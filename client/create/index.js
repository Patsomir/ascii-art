import { buildDefaultToolbar } from '../utils/toolbar.js';
import { moveTo } from '../utils/navigation.js';
import { asciiFromImage } from '../utils/ascii-from-image.js';

const WIDTH_ID = 'width';
const HEIGHT_ID = 'height';
const TYPE_ID = 'editor-type';
const BLANK_OPTION_ID = 'blank-option';
const IMAGE_OPTION_ID = 'image-option';
const JSON_OPTION_ID = 'json-option';
const UPLOAD_IMAGE_BUTTON_ID = 'upload-image-button';
const ART_CONTAINER_ID = 'art-container';
const INNER_CONTAINER_ID = 'inner-container';
const OPEN_BUTTON_ID = 'open-button';
const EDITOR_PATH = '/editor';

const INIT_TEMPLATE_KEY = 'init-key';

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

function displayAsciiFromImage(event){
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        let img = new Image();
        img.src = reader.result;

        img.addEventListener("load", () => {
            const width = document.getElementById(WIDTH_ID);
            const height = document.getElementById(HEIGHT_ID);

            if(!width.value && !height.value){
                height.value = 40;
            }
           
            asciiFromImage(file, { width: parseInt(width.value), height: parseInt(height.value)})
            .then(asciiArt => {
                width.value = asciiArt.indexOf('\n');
                loadAsciiArt(asciiArt);            
                localStorage.setItem(INIT_TEMPLATE_KEY, asciiArt);
            })
            .catch(err => console.error(err.message));
        });
    });
    
    if (file) {
        reader.readAsDataURL(file);
    } else {
        throw new Error('File failed to load');
    }
};

function loadAsciiArt(asciiArt) {
    document.getElementById(ART_CONTAINER_ID).style.display = 'flex';
    document.getElementById(INNER_CONTAINER_ID).style.display = 'block';    
    let innerContainer = document.getElementById(INNER_CONTAINER_ID);
    innerContainer.textContent = asciiArt;
}

function openBlankInput(){
    document.getElementById(UPLOAD_IMAGE_BUTTON_ID).style.display = 'none';
    document.getElementById(ART_CONTAINER_ID).style.display = 'none';
    document.getElementById(INNER_CONTAINER_ID).style.display = 'none';    
}

function openImageInput(){
    document.getElementById(UPLOAD_IMAGE_BUTTON_ID).style.display = 'block';
    document.getElementById(ART_CONTAINER_ID).style.display = 'none';
    document.getElementById(INNER_CONTAINER_ID).style.display = 'none';    
}

function openJSONInput(){
    document.getElementById(UPLOAD_IMAGE_BUTTON_ID).style.display = 'none';
    document.getElementById(ART_CONTAINER_ID).style.display = 'none';
    document.getElementById(INNER_CONTAINER_ID).style.display = 'none';    
}

window.addEventListener('load', () => {
    buildDefaultToolbar();
    document.getElementById(OPEN_BUTTON_ID).addEventListener('click', openEditor);
    document.getElementById(UPLOAD_IMAGE_BUTTON_ID).addEventListener('change', displayAsciiFromImage);
    document.getElementById(BLANK_OPTION_ID).addEventListener('click', openBlankInput);
    document.getElementById(IMAGE_OPTION_ID).addEventListener('click', openImageInput);
    document.getElementById(JSON_OPTION_ID).addEventListener('click', openJSONInput);
});