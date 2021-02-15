import { AsciiImageEditor, AsciiAnimationEditor } from './editor.js';

const EDITOR_GRID_ID = 'editor-grid';
const INIT_TEMPLATE_KEY = 'init-key';
const WIDTH_PARAM = 'width';
const HEIGHT_PARAM = 'height';
const TYPE_PARAM = 'type';
const DEFAULT_WIDTH = 80;
const DEFAULT_HEIGHT = 40;
const IMAGE_TYPE_VALUE = 'image';
const ANIMATION_TYPE_VALUE = 'animation';

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const width = parseInt(urlParams.get(WIDTH_PARAM) ?? DEFAULT_WIDTH);
    const height = parseInt(urlParams.get(HEIGHT_PARAM) ?? DEFAULT_HEIGHT);
    const type = urlParams.get(TYPE_PARAM) ?? ANIMATION_TYPE_VALUE;
    const root = document.getElementById(EDITOR_GRID_ID);
    const template = localStorage.getItem(INIT_TEMPLATE_KEY) ?? '';

    switch(type) {
        case IMAGE_TYPE_VALUE:
            new AsciiImageEditor(root, width, height, template);
            break;
        case ANIMATION_TYPE_VALUE:
            new AsciiAnimationEditor(root, width, height, template);
            break;
    }
});