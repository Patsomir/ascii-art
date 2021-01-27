const IMAGE_CHECKPOINT_KEY = 'ascii-art-image-checkpoint';
const ANIMATION_CHECKPOINT_KEY = 'ascii-art-animation-checkpoint';
const ANIMATION_PLAYER_KEY = 'ascii-art-animation-player';
const PLAYER_DIR = '../player/player.html'

class AsciiImageEditor {
    root;
    selectedInstrumentDom;
    selectedCharDom;
    paletteDom;
    instrumentsDom;
    operationsDom;
    canvasDom;

    canvas;
    palette;
    instrumentManager;
    instrumentSelector;
    operationSelector;
    fileManager;

    static DEFAULT_WIDTH = 80;
    static DEFAULT_HEIGHT = 40;

    constructor(root, width = AsciiImageEditor.DEFAULT_WIDTH, height = AsciiImageEditor.DEFAULT_HEIGHT) {
        this._buildDom(root);
        this._addStyleClasses();

        this.canvas = new AsciiCanvas(this.canvasDom, width, height);
        this.palette = new AsciiPalette(this.paletteDom);
        this.instrumentManager = new AsciiInstruments(this.canvas, this.palette);
        this.instrumentSelector = new AsciiSelect(this.instrumentsDom);
        this.operationsSelector = new AsciiSelect(this.operationsDom);
        this.fileManager = new FileManager();

        this.palette.onSelect = char => this.selectedCharDom.textContent = char;
        this.instrumentSelector.onSelect = char => this.selectedInstrumentDom.textContent = char;

        this._buildInstruments();
        this._buildOperations();

        this.palette.select(0);
        this.instrumentSelector.select(0);
    }

    _buildInstruments() {
        this.instrumentSelector.pushOption({ label: '\u270E', tooltip: 'Pen' }, () => this.instrumentManager.selectPen());
        this.instrumentSelector.pushOption({ label: '\u25A7', tooltip: 'Fill Tool'}, () => this.instrumentManager.selectFill());
    }

    _buildOperations() {
        this.operationsSelector.pushOption({ label: '\u29C9', tooltip: 'Copy to clipboard' }, () => {
            navigator.clipboard.writeText(this.canvas.toString())
            .then(() => console.log('Image copied to clipboard'))
            .catch(() => console.error('Error occured while copying to clipboard'));
        });
        this.operationsSelector.pushOption({ label: '\uD83D\uDEA9', tooltip: 'Set Checkpoint' }, () => {
            localStorage.setItem(IMAGE_CHECKPOINT_KEY, this.canvas.toString());
            console.log('Image saved to local storage');
        });
        this.operationsSelector.pushOption({ label: '\u21BA', tooltip: 'Restore Checkpoint' }, () => {
            if(localStorage.getItem(IMAGE_CHECKPOINT_KEY)) {
                this.canvas.clear();
                this.canvas.setTemplate(localStorage.getItem(IMAGE_CHECKPOINT_KEY));
                console.log('Image restored from local storage');
            } else {
                console.log('No stored image');
            }
        });
        this.operationsSelector.pushOption({ label: '\uD83D\uDCC1', tooltip: 'Import Local File' }, () => {
            this.fileManager.onSelect = file => {
                file.text()
                .then(text => {
                    this.canvas.clear();
                    this.canvas.setTemplate(text);
                })
                .then(() => console.log('Successfully imported file'))
                .catch(() => console.error('Error occured while importing file'));
            }
            this.fileManager.openPrompt();
        });
        this.operationsSelector.pushOption({ label: '\u274C', tooltip: 'Delete' }, () => {
            localStorage.removeItem(IMAGE_CHECKPOINT_KEY);
            console.log('Deleted image and local storage');
            window.location.reload();
        });
    }

    _buildDom(root) {
        this.root = root;
        this.selectedInstrumentDom = document.createElement('div');
        this.selectedCharDom = document.createElement('div');
        this.paletteDom = document.createElement('div');
        this.instrumentsDom = document.createElement('div');
        this.operationsDom = document.createElement('div');
        this.canvasDom = document.createElement('div');
        root.appendChild(this.selectedInstrumentDom);
        root.appendChild(this.selectedCharDom);
        root.appendChild(this.paletteDom);
        root.appendChild(this.instrumentsDom);
        root.appendChild(this.operationsDom);
        root.appendChild(this.canvasDom);
    }

    static CANVAS_CLASS = 'canvas';
    static PALETTE_CLASS = 'palette';
    static INSTRUMENTS_CLASS = 'instruments';
    static OPERATIONS_CLASS = 'operations';
    static SELECTED_CHAR_CLASS = 'selected-char';
    static SELECTED_INSTRUMENT_CLASS = 'selected-instrument';

    _addStyleClasses() {
        this.selectedInstrumentDom.classList.add(AsciiImageEditor.SELECTED_INSTRUMENT_CLASS);
        this.selectedCharDom.classList.add(AsciiImageEditor.SELECTED_CHAR_CLASS);
        this.paletteDom.classList.add(AsciiImageEditor.PALETTE_CLASS);
        this.instrumentsDom.classList.add(AsciiImageEditor.INSTRUMENTS_CLASS);
        this.operationsDom.classList.add(AsciiImageEditor.OPERATIONS_CLASS);
        this.canvasDom.classList.add(AsciiImageEditor.CANVAS_CLASS);
    }
}


class AsciiAnimationEditor extends AsciiImageEditor {
    fpsManagerDom;
    animationOperationsDom;
    frameManagerDom;

    fpsManager;
    animationOperations;
    frameManager;

    constructor(root) {
        super(root);
        this.animationOperationsDom = document.createElement('div');
        this.frameManagerDom = document.createElement('div');
        this.fpsManager = new AsciiAnimationFpsManager(this.animationOperationsDom);
        this.fpsManagerDom = this.fpsManager.label;
        this.root.appendChild(this.animationOperationsDom);
        this.root.appendChild(this.frameManagerDom);
        
        this.frameManager = new AsciiAnimationFrameManager(this.frameManagerDom, this.canvas);
        this.animationOperations = new AsciiSelect(this.animationOperationsDom);

        this._buildAnimationOperations();
        this._addAnimatorStyleClasses();
    }

    _buildAnimationOperations() {
        this.animationOperations.pushOption({ label: 'New Frame', container: 'button' }, () => {
            this.frameManager.pushFrame();
        });
        this.animationOperations.pushOption({ label: 'Clear Frame', container: 'button' }, () => {
            this.canvas.clear();
        });
        this.animationOperations.pushOption({ label: 'Delete Frame', container: 'button' }, () => {
            this.frameManager.deleteSelectedFrame();
        });
        this.animationOperations.pushOption({ label: 'Insert Before', container: 'button' }, () => {
            this.frameManager.insertFrameBefore();
        });
        this.animationOperations.pushOption({ label: 'Insert After', container: 'button' }, () => {
            this.frameManager.insertFrameAfter();
        });
        this.animationOperations.pushOption({ label: 'Set Checkpoint \uD83D\uDEA9', container: 'button' }, () => {
            this.frameManager._overrideFrame();
            localStorage.setItem(ANIMATION_CHECKPOINT_KEY, this.getAnimationJson());
            console.log('Animation saved to local storage');
        });
        this.animationOperations.pushOption({ label: 'Restore Checkpoint \u21BA', container: 'button'}, () => {
            const animationJson = localStorage.getItem(ANIMATION_CHECKPOINT_KEY);
            if(animationJson) {
                this.loadAnimationJson(animationJson);
                console.log('Restored animation from local storage');
            } else {
                console.log('No stored animation');
            }
        });
        this.animationOperations.pushOption({ label: 'Play \u25B6', container: 'button'}, () => {
            this.frameManager._overrideFrame();
            localStorage.setItem(ANIMATION_PLAYER_KEY, this.getAnimationJson());
            window.open(PLAYER_DIR);
        });
    }

    getAnimationJson() {
        return JSON.stringify({ frames: this.frameManager.frames, fps: this.fpsManager.getFps() });
    }

    loadAnimationJson(json) {
        const animation = JSON.parse(json);
        this.frameManager.loadFrames(animation.frames);
        this.fpsManager.setFps(animation.fps);
    }

    static ANIMATOR_FRAMES_CLASS = 'animator-frames';
    static ANIMATOR_OPERATIONS_CLASS = 'animator-operations';
    static ANIMATOR_FPS_CLASS = 'animator-fps';

    _addAnimatorStyleClasses() {
        this.frameManagerDom.classList.add(AsciiAnimationEditor.ANIMATOR_FRAMES_CLASS);
        this.animationOperationsDom.classList.add(AsciiAnimationEditor.ANIMATOR_OPERATIONS_CLASS);
        this.fpsManagerDom.classList.add(AsciiAnimationEditor.ANIMATOR_FPS_CLASS);
    }
}