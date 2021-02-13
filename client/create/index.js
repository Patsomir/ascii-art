import { buildDefaultToolbar } from '../utils/toolbar.js';
import { moveTo } from '../utils/navigation.js';

const WIDTH_ID = 'width';
const HEIGHT_ID = 'height';
const TYPE_ID = 'editor-type';
const OPEN_BUTTON_ID = 'open-button';
const EDITOR_PATH = '/editor';

function openEditor() {
    const width = document.getElementById(WIDTH_ID).value;
    const height = document.getElementById(HEIGHT_ID).value;
    const type = document.getElementById(TYPE_ID).value;

    let path = `${EDITOR_PATH}?type=${type}`;
    if(width) {
        path += `&width=${width}`;
    }
    if(height) {
        path += `&height=${height}`;
    }

    moveTo(path);
}

window.addEventListener('load', () => {
    buildDefaultToolbar();
    document.getElementById(OPEN_BUTTON_ID).addEventListener('click', openEditor);
});