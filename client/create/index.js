import { buildDefaultToolbar } from '../utils/toolbar.js';
import { moveTo } from '../utils/navigation.js';
import { asciiFromImage } from '../utils/ascii-from-image.js';

const WIDTH_ID = 'width';
const HEIGHT_ID = 'height';
const TYPE_ID = 'editor-type';
const BLANK_OPTION_ID = 'blank-option';
const IMAGE_OPTION_ID = 'image-option';
const TEXT_OPTION_ID = 'text-option';
const UPLOAD_IMAGE_BUTTON_ID = 'upload-image-button';
const UPLOAD_TEXT_BUTTON_ID = 'upload-text-button';
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

function displayAsciiFromText(event) {
    if(event.target.files.length > 0) {
        event.target.files[0].text()
        .then(text => {
            loadAsciiArt(text);
            localStorage.setItem(INIT_TEMPLATE_KEY, text);
        })
        .catch(() => console.error('Error occured while importing file'));
    }
                
}

function loadAsciiArt(asciiArt) {
    document.getElementById(ART_CONTAINER_ID).style.display = 'flex';
    let innerContainer = document.getElementById(INNER_CONTAINER_ID);
    innerContainer.style.display = 'block';
    innerContainer.textContent = asciiArt;
}

function openBlankInput(){
    resetInputState();
}

function openImageInput(){
    resetInputState();
    document.getElementById(UPLOAD_IMAGE_BUTTON_ID).style.display = 'block';
}

function openTextInput(){
    resetInputState();
    document.getElementById(UPLOAD_TEXT_BUTTON_ID).style.display = 'block';
}

function resetInputState() {
    const imageButton = document.getElementById(UPLOAD_IMAGE_BUTTON_ID);
    imageButton.style.display = 'none';
    imageButton.value = null;
    const textButton = document.getElementById(UPLOAD_TEXT_BUTTON_ID);
    textButton.style.display = 'none';
    textButton.value = null;
    document.getElementById(ART_CONTAINER_ID).style.display = 'none';
    document.getElementById(INNER_CONTAINER_ID).style.display = 'none';
    localStorage.removeItem(INIT_TEMPLATE_KEY); 
}

window.addEventListener('load', () => {
    buildDefaultToolbar();
    document.getElementById(OPEN_BUTTON_ID).addEventListener('click', openEditor);
    document.getElementById(UPLOAD_IMAGE_BUTTON_ID).addEventListener('change', displayAsciiFromImage);
    document.getElementById(UPLOAD_TEXT_BUTTON_ID).addEventListener('change', displayAsciiFromText);
    document.getElementById(BLANK_OPTION_ID).addEventListener('click', openBlankInput);
    document.getElementById(IMAGE_OPTION_ID).addEventListener('click', openImageInput);
    document.getElementById(TEXT_OPTION_ID).addEventListener('click', openTextInput);
});