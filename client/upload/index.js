import { buildDefaultToolbar } from '../utils/toolbar.js';
import { moveTo } from '../utils/navigation.js';
import { postArt } from '../utils/art-service.js'
import { UPLOAD_KEY, UPLOAD_ASCII_ART_TYPE } from "../editor/editor.js"
import { getCurrentUser } from '../utils/auth-service.js';

const HOME_PAGE = '/';
const LOGIN_PATH = '/login';

const CONTENT_ID = 'content';
const NAME_ID = 'name';
const KEYWORDS_ID = 'keywords';
const UPLOAD_BUTTON_ID = 'upload-button';

const SUCCESS_MESSAGE_CLASS = 'success'
const ERROR_MESSAGE_CLASS = 'error';

function uploadArt() {
    let errors = document.getElementsByClassName(ERROR_MESSAGE_CLASS);
    while(errors[0]) {
        errors[0].parentNode.removeChild(errors[0]);
    }

    const name = document.getElementById(NAME_ID).value;
    const keywords = document.getElementById(KEYWORDS_ID).value;

    const content = localStorage.getItem(UPLOAD_KEY);
    const type = localStorage.getItem(UPLOAD_ASCII_ART_TYPE);

    postArt(name, content, type)
        .then(result => handleResult(result))
        .catch(errors => handleErrors(errors.errors));   
}

function handleResult(result) {
    if (result.result) {
       handleSuccess()
    }
    else {
       handleErrors(result.errors)
    }
}

function handleSuccess() {
    localStorage.removeItem(UPLOAD_KEY);
    localStorage.removeItem(UPLOAD_ASCII_ART_TYPE);

    document.getElementById(NAME_ID).remove();
    document.getElementById(KEYWORDS_ID).remove();
    document.getElementById(UPLOAD_BUTTON_ID).remove();

    let successMessage = document.createElement('p');
    successMessage.classList.add(SUCCESS_MESSAGE_CLASS);
    successMessage.textContent = 'Successful uploading!';

    let redirectButton = document.createElement('button');
    redirectButton.textContent = 'Return to Home Page';
    redirectButton.addEventListener('click', () => moveTo(HOME_PAGE));

    let content = document.getElementById(CONTENT_ID)
    content.appendChild(successMessage);
    content.appendChild(redirectButton);
}

function handleErrors(errors) {
    let errorMessage = document.createElement('p');
    errorMessage.classList.add(ERROR_MESSAGE_CLASS);

    errorMessage.innerHTML = '';
    for(let error of errors) {
        errorMessage.innerHTML += error + '<br/>';
    }

    let content = document.getElementById(CONTENT_ID);
    content.appendChild(errorMessage);
}

if(!getCurrentUser()) {
    moveTo(LOGIN_PATH);
}

window.addEventListener('load', () => {
    buildDefaultToolbar();
    document.getElementById(UPLOAD_BUTTON_ID).addEventListener('click', uploadArt);
});