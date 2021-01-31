const REGISTER_PATH = '/registration.php';
const LOGIN_SUCCESS_PATH = '/client';

const LOGIN_BUTTON_ID = 'login-button';
const LOGIN_TAB_ID = 'login-option';
const LOGIN_FORM_ID = 'login-form';
const LOGIN_USERNAME_ID = 'login-username';
const LOGIN_PASSWORD_ID = 'login-password';

const REGISTER_BUTTON_ID = 'register-button';
const REGISTER_TAB_ID = 'register-option';
const REGISTER_FORM_ID = 'register-form';
const REGISTER_NAME_ID = 'register-name';
const REGISTER_USERNAME_ID = 'register-username';
const REGISTER_PASSWORD_ID = 'register-password';
const REGISTER_CONFIRM_PASSWORD_ID = 'register-confirm-password';

const FEEDBACK_ID = 'feedback';

function submitRegister(event) {
    event.preventDefault();
    const resultContainer = document.getElementById(FEEDBACK_ID);
    resultContainer.innerHTML = '<p>Loading...</p>';

    const data = {
        name: document.getElementById(REGISTER_NAME_ID).value,
        username: document.getElementById(REGISTER_USERNAME_ID).value,
        password: document.getElementById(REGISTER_PASSWORD_ID).value,
    }
    const confirmPassword = document.getElementById(REGISTER_CONFIRM_PASSWORD_ID).value;
    const validator = new Validator();
    validator.validateMinLength(data.name, 1, 'Name');
    validator.validateMinLength(data.username, 6, 'Username');
    validator.validateMinLength(data.password, 6, 'Password');
    validator.validateEquals(data.password, confirmPassword, 'Password', 'Confirmed Password');
    if(validator.hasErrors()) {
        resultContainer.innerHTML = getErrorsHtml(validator.errors);
        return;
    }

    postJson(REGISTER_PATH, data)
    .then(success => {
        resultContainer.innerHTML = `<p>${success.result}</p>`;
        openLoginTab();
    })
    .catch(failure => {
        resultContainer.innerHTML = getErrorsHtml(failure.errors);
    });
}

function submitLogin(event) {
    event.preventDefault();
    const resultContainer = document.getElementById(FEEDBACK_ID);
    resultContainer.innerHTML = '<p>Loading...</p>';

    const username = document.getElementById(LOGIN_USERNAME_ID).value;
    const password = document.getElementById(LOGIN_PASSWORD_ID).value;

    login(username, password)
    .then(success => {
        resultContainer.innerHTML = `<p>Hello, ${success.name}</p>`;
        location.href = LOGIN_SUCCESS_PATH;
    })
    .catch(failure => {
        resultContainer.innerHTML = getErrorsHtml(failure.errors);
    });
}

function getErrorsHtml(errors) {
    let result = '';
    for(error of errors) {
        result += `<p class="error">${error}</p>`;
    }
    return result;
}

function submitTest(event) {
    event.preventDefault();
    const resultContainer = document.getElementById(FEEDBACK_ID);
    resultContainer.innerHTML = 'Loading...';

    get('/test.php')
    .then(success => {
        resultContainer.textContent = 'Hello, ' + success.name;
    })
    .catch(failure => {
        resultContainer.innerHTML = '';
        for(error of failure.errors) {
            resultContainer.innerHTML += error + '<br/>';
        }
    });
}

function openRegistrationTab() {
    document.getElementById(REGISTER_FORM_ID).style.display = 'grid';
    document.getElementById(LOGIN_FORM_ID).style.display = 'none';
}

function openLoginTab() {
    document.getElementById(REGISTER_FORM_ID).style.display = 'none';
    document.getElementById(LOGIN_FORM_ID).style.display = 'grid';
}

window.addEventListener('load', () => {
    buildDefaultToolbar();
    document.getElementById(REGISTER_TAB_ID).addEventListener('click', openRegistrationTab);
    document.getElementById(LOGIN_TAB_ID).addEventListener('click', openLoginTab);
    document.getElementById(REGISTER_BUTTON_ID).addEventListener('click', submitRegister);
    document.getElementById(LOGIN_BUTTON_ID).addEventListener('click', submitLogin);
});