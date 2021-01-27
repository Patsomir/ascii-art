const SPACE_CHAR = ' ';
const VISIBLE_ASCII_RANGE = [32, 126];

class AsciiCanvas {
    root;
    width;
    height;
    cells;

    onMouseDown;
    onMouseUp;
    onMouseOverWhileDown;
    onMouseOverWhileUp;

    defaultChar;

    constructor(root, width, height, defaultChar = SPACE_CHAR) {
        this.root = root;
        this.width = width;
        this.height = height;
        this.defaultChar = defaultChar;
        const table = document.createElement('table');
        this.root.appendChild(table);
        this.cells = [];
        for(let i = 0; i < height; ++i) {
            this.cells.push([]);
            const tableRow = document.createElement('tr');
            table.appendChild(tableRow);

            for (let j = 0; j < width; ++j) {
                const tableData = document.createElement('td');
                tableRow.appendChild(tableData);
                const innerDiv = document.createElement('div');
                tableData.appendChild(innerDiv);
                innerDiv.textContent = defaultChar.charAt(0);

                innerDiv.addEventListener('mouseover', () => {
                    if(mouseState.isDown) {
                        if(this.onMouseOverWhileDown) {
                            this.onMouseOverWhileDown(this, i, j);
                        }
                    } else {
                        if(this.onMouseOverWhileUp) {
                            this.onMouseOverWhileUp(this, i, j);
                        }
                    }
                });
                innerDiv.addEventListener('mousedown', () => {
                    if(this.onMouseDown) {
                        this.onMouseDown(this, i, j);
                    }
                });
                innerDiv.addEventListener('mouseup', () => {
                    if(this.onMouseUp) {
                        this.onMouseUp(this, i, j);
                    }
                });

                this.cells[i].push(innerDiv);
            }
        }
    }

    set(row, col, char) {
        this.cells[row][col].textContent = char.charAt(0);
    }

    get(row, col) {
        return this.cells[row][col].textContent;
    }

    toString() {
        let result = '';
        for(const row of this.cells) {
            result += row.map(td => td.textContent).join('') + '\n';
        }
        return result;
    }

    setTemplate(template) {
        const lines = template.split(/\r?\n/);
        for(const line in lines) {
            for(const char in lines[line]) {
                this.cells[line][char].textContent = lines[line][char];
            }
        }
    }

    clear() {
        for(const row of this.cells) {
            for(const cell of row) {
                cell.textContent = this.defaultChar;
            }
        }
    }

    static fromString(root, template) {
        const lines = template.split(/\r?\n/);
        const height = lines.length - 1;
        const width = lines.reduce((x, y) => x.length < y.length ? y : x, '').length;

        const canvas = new AsciiCanvas(root, width, height);
        canvas.setTemplate(template);

        return canvas;
    }
}

class AsciiSelect {
    root;
    selected;

    options;

    onSelect;

    constructor(root) {
        this.root = root;
        this.options = [];
    }

    select(index) {
        this.selected = this.options[index].label;
        if(this.options[index].callback) {
            this.options[index].callback(this.selected);
        }
        if(this.onSelect) { 
            this.onSelect(this.selected);
        }
    }

    pushOption(labelObj, callback = null) {
        let label;
        let tooltip;
        let container = 'div';
        if(typeof labelObj === 'string') {
            label = labelObj;
        } else if(typeof labelObj === 'object') {
            label = labelObj.label;
            tooltip = labelObj.tooltip;
            container = labelObj.container ? labelObj.container : 'div';
        } else {
            console.error('Invalid option label format');
            return;
        }

        this.options.push({label, callback});

        const cell = document.createElement(container);
        cell.textContent = label;
        this.root.appendChild(cell);

        if(tooltip) {
            cell.classList.add('tooltip');
            const tooltipSpan = document.createElement('span');
            tooltipSpan.textContent = tooltip;
            tooltipSpan.classList.add('tooltip-text');
            cell.appendChild(tooltipSpan);
        }

        cell.addEventListener('click', () => {
            this.selected = label;
            if(callback) {
                callback(this.selected);
            }
            if(this.onSelect) { 
                this.onSelect(this.selected);
            }
        });
    }

    getSelected() {
        return this.selected;
    }
}

class AsciiPalette extends AsciiSelect {
    constructor(root) {
        super(root);
        for(let charcode = VISIBLE_ASCII_RANGE[0]; charcode <= VISIBLE_ASCII_RANGE[1]; ++charcode) {
            this.pushOption(String.fromCharCode(charcode));
        }
        this.select(0);
    }
}

class AsciiInstruments {
    canvas;
    palette;

    constructor(canvas, palette) {
        this.canvas = canvas;
        this.palette = palette;
    }

    selectPen() {
        this.canvas.onMouseDown = (_ , x, y) => this.paint(x, y, this.palette.getSelected());
        this.canvas.onMouseUp = null;
        this.canvas.onMouseOverWhileDown = (_ , x, y) => this.paint(x, y, this.palette.getSelected());
        this.canvas.onMouseOverWhileUp = null;
    }

    selectFill() {
        this.canvas.onMouseDown = (_ , x, y) => this.fill(x, y, this.palette.getSelected());
        this.canvas.onMouseUp = null;
        this.canvas.onMouseOverWhileDown = null;
        this.canvas.onMouseOverWhileUp = null;
    }

    canPaint(row, col) {
        return row >= 0 && row < this.canvas.height && col >= 0 && col < this.canvas.width;
    }
    
    paint(row, col, char) {
        this.canvas.set(row, col, char);
    }

    fill(row, col, char) {
        let paintedChar = this.canvas.get(row, col);
        let newChar = char.charAt(0);
        this._recursiveFill(row, col, newChar, paintedChar);
    }

    _recursiveFill(row, col, newChar, paintedChar) {
        if(!this.canPaint(row, col) || 
            !(this.canvas.get(row, col) === paintedChar) || 
            this.canvas.get(row, col) === newChar)
        {
            return;
        }
        this.paint(row, col, newChar);
        this._recursiveFill(row - 1, col, newChar, paintedChar);
        this._recursiveFill(row + 1, col, newChar, paintedChar);
        this._recursiveFill(row, col - 1, newChar, paintedChar);
        this._recursiveFill(row, col + 1, newChar, paintedChar);
    }
}

class AsciiAnimationFrameManager {
    root;
    canvas;
    
    frames;

    frameElements;
    selectedFrame;

    static SELECTED_FRAME = 'selected-frame'

    constructor(root, canvas) {
        this.root = root;
        this.canvas = canvas;
        this.frames = [];
        this.frameElements = [];
        this.selectedFrame = 1;
        
        this._pushFrame();
        this.frameElements[0].classList.add(AsciiAnimationFrameManager.SELECTED_FRAME);
    }

    pushFrame() {
        this._overrideFrame();
        this._pushFrame();
        this._moveSelectedClass(this.frames.length);
    }

    selectFrame(index) {
        this._overrideFrame();
        this._moveSelectedClass(index);
        this.canvas.setTemplate(this.frames[index - 1]);
    }

    deleteSelectedFrame() {
        if(this.frames.length < 2) {
            return;
        }

        this.frames.splice(this.selectedFrame - 1, 1);
        this.frameElements[this.selectedFrame - 1].remove();
        this.frameElements.splice(this.selectedFrame - 1, 1);
        for(let i = this.selectedFrame - 1; i < this.frames.length; ++i) {
            this.frameElements[i].textContent = new Number(this.frameElements[i].textContent) - 1;
        }

        if(this.selectedFrame > this.frames.length) {
            this._placeSelectedClass(this.frames.length);
        } else {
            this._placeSelectedClass(this.selectedFrame);
        }

        this.canvas.setTemplate(this.frames[this.selectedFrame - 1]);
    }

    insertFrameAfter() {
        this._insertFrame(this.selectedFrame);
        this.selectFrame(this.selectedFrame + 1);
    }

    insertFrameBefore() {
        this._removeSelectedClass();
        this._insertFrame(this.selectedFrame - 1);
        this._placeSelectedClass(this.selectedFrame);
        this.selectFrame(this.selectedFrame);
    }

    _insertFrame(index) {
        this.frames.splice(index, 0, this.canvas.toString());
        const frameElem = document.createElement('button');

        if(index < this.frameElements.length) {
            this.root.insertBefore(frameElem, this.frameElements[index]);
        } else {
            this.root.appendChild(frameElem);
        }
        
        this.frameElements.splice(index, 0, frameElem);

        for(let i = index; i < this.frames.length; ++i) {
            this.frameElements[i].textContent = i + 1;
        }

        frameElem.addEventListener('click', () => this.selectFrame(new Number(frameElem.textContent)));
    }

    _pushFrame() {
        this.frames.push(this.canvas.toString());

        const frameIndex = this.frames.length;
        const frameElem = document.createElement('button');
        frameElem.textContent = frameIndex;
        this.root.appendChild(frameElem);
        this.frameElements.push(frameElem);

        frameElem.addEventListener('click', () => this.selectFrame(new Number(frameElem.textContent)));
    }

    _overrideFrame(index = this.selectedFrame) {
        this.frames[index - 1] = this.canvas.toString();
    }

    _forwardFrame(index = this.selectedFrame) {
        this.canvas.setTemplate(this.frames[index - 1]);
    }

    _moveSelectedClass(index) {
        this.frameElements[this.selectedFrame - 1].classList.remove(AsciiAnimationFrameManager.SELECTED_FRAME);
        this.selectedFrame = index;
        this.frameElements[this.selectedFrame - 1].classList.add(AsciiAnimationFrameManager.SELECTED_FRAME);
    }

    _removeSelectedClass() {
        this.frameElements[this.selectedFrame - 1].classList.remove(AsciiAnimationFrameManager.SELECTED_FRAME);
    }

    _placeSelectedClass(index) {
        this.selectedFrame = index;
        this.frameElements[this.selectedFrame - 1].classList.add(AsciiAnimationFrameManager.SELECTED_FRAME);
        
    }

    _deleteAllFrames() {
        for(const frameElem of this.frameElements) {
            frameElem.remove();
        }
        this.frameElements =[];
        this.frames = [];
    }

    loadFrames(frames) {
        this._deleteAllFrames();
        this.frames = frames;

        for(let i = 0; i < frames.length; ++i) {
            const frameElem = document.createElement('button');
            frameElem.textContent = i + 1;
            this.root.appendChild(frameElem);
            this.frameElements.push(frameElem);
            frameElem.addEventListener('click', () => this.selectFrame(new Number(frameElem.textContent)));
        }
        this._placeSelectedClass(this.frames.length);
        this._forwardFrame();
    }
}

class AsciiAnimationFpsManager {
    root;
    label;
    fpsInput;

    static DEFAULT_FPS = 30;

    constructor(root) {
        this.root = root;
        this.fpsInput = document.createElement('input');
        this.fpsInput.type = 'number';
        this.fpsInput.value = AsciiAnimationFpsManager.DEFAULT_FPS;
        this.label = document.createElement('label');
        this.label.textContent = 'FPS ';
        this.label.appendChild(this.fpsInput);
        this.root.appendChild(this.label);
    }

    getFps() {
        return this.fpsInput.value;
    }

    setFps(value) {
        this.fpsInput.value = value;
    }
}