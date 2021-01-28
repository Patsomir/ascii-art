const LOGGED_USER_KEY = 'ascii-art-user';
const LOGIN_PATH = '/login.php';
const LOGOUT_PATH = '/logout.php';

function login(username, password) {
    return sendRequest(
        `${LOGIN_PATH}?username=${username}&password=${password}`,
        'POST',
    )
    .then(success => {
        setCurrentUser({ name: success.name });
        return success;
    });
}

function logout() {
    return sendRequest(
        `${LOGOUT_PATH}`,
        'POST',
    )
    .then(success => {
        setCurrentUser(null);
        return success;
    });
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(LOGGED_USER_KEY));
}

function setCurrentUser(user) {
    const json = user ? JSON.stringify(user) : null;
    localStorage.setItem(LOGGED_USER_KEY, json);
}