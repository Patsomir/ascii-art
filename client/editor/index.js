import { AsciiImageEditor, AsciiAnimationEditor } from './editor.js';

const EDITOR_GRID_ID = 'editor-grid';

window.addEventListener('load', () => {
    //buildEditor(80, 40);
    //new AsciiImageEditor(document.getElementById(EDITOR_GRID_ID));
    new AsciiAnimationEditor(document.getElementById(EDITOR_GRID_ID));
});