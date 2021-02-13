import { moveTo } from './navigation.js';
import { logout, getCurrentUser } from './auth-service.js';

const DEFAULT_TOOLBAR_ID = 'toolbar';
const DEFAULT_LOGIN_PATH = '/login';
const DEFAULT_LOGO_PATH = '/';
const VIEW_PATH = '/view';
const CREATE_PATH = '/create';

function getDefaultToolbarContainer() {
    return document.getElementById(DEFAULT_TOOLBAR_ID);
}

export function buildDefaultToolbar() {
    const toolbar = new Toolbar(getDefaultToolbarContainer());
    toolbar.addPageLink('View', VIEW_PATH);
    toolbar.addPageLink('Create', CREATE_PATH);
    return toolbar;
}

class Toolbar {
    root;
    logoPath;
    loginPath;
    buttonContainer;
    buttonLabel;
    loginButton;
    logoutButton;
    nameContainer;
    logoContainer;
    pageLinksContainer;

    constructor(root, logoPath = DEFAULT_LOGO_PATH, loginPath = DEFAULT_LOGIN_PATH) {
        this.root = root;
        this.logoPath = logoPath;
        this.loginPath = loginPath;

        const user = getCurrentUser();
        this.logoContainer = document.createElement('h1');
        this.logoContainer.textContent = 'Ascii Art';
        this.logoContainer.addEventListener('click', () => moveTo(this.logoPath));
        this.pageLinksContainer = document.createElement('div');
        this.nameContainer = document.createElement('h6');
        this.buttonContainer = document.createElement('div');
        this.buttonLabel = document.createElement('h6');
        this.root.appendChild(this.logoContainer);
        this.root.appendChild(this.pageLinksContainer);
        this.root.appendChild(this.nameContainer);
        this.root.appendChild(this.buttonContainer);
        this.buttonContainer.appendChild(this.buttonLabel);
        if(user) {
            this.nameContainer.textContent = `Hello, ${user.name}!`;
            this.buttonLabel.textContent = 'Not you?';
            this.logoutButton = document.createElement('button');
            this.buttonContainer.appendChild(this.logoutButton);
            this.logoutButton.textContent = 'Logout';
            this.logoutButton.addEventListener('click', () => {
                logout()
                .then(_ => location.reload())
                .catch(failure => console.error(failure));
            });
        } else {
            this.loginButton = document.createElement('button');
            this.buttonContainer.appendChild(this.loginButton);
            this.loginButton.textContent = 'Login';
            this.loginButton.addEventListener('click', () => moveTo(this.loginPath));
        }

        this._addStyleClasses();
    }

    addPageLink(label, path) {
        const button = document.createElement('button');
        button.textContent = label;
        button.addEventListener('click', () => moveTo(path));
        this.pageLinksContainer.appendChild(button);
    }

    static TOOLBAR_CLASS = 'toolbar';
    static LOGO_CONTAINER_CLASS = 'logo';
    static NAME_CONTAINER_CLASS = 'name';
    static BUTTON_CONTAINER_CLASS = 'button-container';
    static BUTTON_LABEL_CLASS = 'button-label';
    static LOGIN_BUTTON_CLASS = 'login-button';
    static LOGOUT_BUTTON_CLASS = 'logout-button';
    static PAGE_LINKS_CLASS = 'page-links';

    _addStyleClasses() {
        this.root.classList.add(Toolbar.TOOLBAR_CLASS);
        this.logoContainer.classList.add(Toolbar.LOGO_CONTAINER_CLASS);
        this.nameContainer.classList.add(Toolbar.NAME_CONTAINER_CLASS);
        this.buttonContainer.classList.add(Toolbar.BUTTON_CONTAINER_CLASS);
        this.buttonLabel.classList.add(Toolbar.BUTTON_LABEL_CLASS);
        this.pageLinksContainer.classList.add(Toolbar.PAGE_LINKS_CLASS);
        if(this.loginButton) {
            this.loginButton.classList.add(Toolbar.LOGIN_BUTTON_CLASS);
        }
        if(this.logoutButton) {
            this.logoutButton.classList.add(Toolbar.LOGOUT_BUTTON_CLASS);
        }
    }
}