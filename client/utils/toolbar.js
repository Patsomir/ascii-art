const DEFAULT_TOOLBAR_ID = 'toolbar';
const LOGIN_FORM_PATH = '../login';

function getDefaultToolbarContainer() {
    return document.getElementById(DEFAULT_TOOLBAR_ID);
}

function buildDefaultToolbar() {
    return new Toolbar(getDefaultToolbarContainer(), LOGIN_FORM_PATH);
}

class Toolbar {
    root;
    loginPath;
    loginButton;
    logoutButton;
    userContainer;
    nameContainer;

    constructor(root, loginPath) {
        this.root = root;
        this.loginPath = loginPath;

        const user = getCurrentUser();
        this.userContainer = document.createElement('div');
        this.root.appendChild(this.userContainer);
        if(user) {
            this.nameContainer = document.createElement('h6');
            this.userContainer.appendChild(this.nameContainer);
            this.nameContainer.textContent = 'Hello, ' + user.name;

            this.logoutButton = document.createElement('button');
            this.userContainer.appendChild(this.logoutButton);
            this.logoutButton.textContent = 'Logout';
            this.logoutButton.addEventListener('click', () => {
                logout()
                .then(_ => location.reload())
                .catch(failure => console.error(failure));
            });
        } else {
            this.loginButton = document.createElement('button');
            this.userContainer.appendChild(this.loginButton);
            this.loginButton.textContent = 'Login';
            this.loginButton.addEventListener('click', () => {
                location.href = this.loginPath;
            });
        }

        this._addStyleClasses();
    }

    static TOOLBAR_CLASS = 'toolbar';
    static USER_CONTAINER_CLASS = 'user';
    static NAME_CONTAINER_CLASS = 'name';
    static LOGIN_BUTTON_CLASS = 'login-button';
    static LOGOUT_BUTTON_CLASS = 'logout-button';

    _addStyleClasses() {
        this.root.classList.add(Toolbar.TOOLBAR_CLASS);
        this.userContainer.classList.add(Toolbar.USER_CONTAINER_CLASS);
        if(this.nameContainer) {
            this.nameContainer.classList.add(Toolbar.NAME_CONTAINER_CLASS);
        }
        if(this.loginButton) {
            this.loginButton.classList.add(Toolbar.LOGIN_BUTTON_CLASS);
        }
        if(this.logoutButton) {
            this.logoutButton.classList.add(Toolbar.LOGOUT_BUTTON_CLASS);
        }
    }
}