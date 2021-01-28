const PATH = '/registration.php';

function register(event) {
    event.preventDefault();
    const resultContainer = document.getElementById('register-result');
    resultContainer.innerHTML = 'Loading...';

    const data = {
        name: document.getElementById('register-name').value,
        username: document.getElementById('register-username').value,
        password: document.getElementById('register-password').value,
    }

    postJson(PATH, data)
    .then(success => {
        resultContainer.textContent = success.result;
    })
    .catch(failure => {
        resultContainer.innerHTML = '';
        for(error of failure.errors) {
            resultContainer.innerHTML += error + '<br/>';
        }
    });
}

function login(event) {
    event.preventDefault();
    const resultContainer = document.getElementById('login-result');
    resultContainer.innerHTML = 'Loading...';

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    auth(username, password)
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

function test(event) {
    event.preventDefault();
    const resultContainer = document.getElementById('test-result');
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

function logout(event) {
    event.preventDefault();
    get('/logout.php')
    .then(success => console.log(success.result))
    .catch(failure => console.error(failure));
}

window.addEventListener('load', () => {
    document.getElementById('register-button').addEventListener('click', register);
    document.getElementById('login-button').addEventListener('click', login);
    document.getElementById('test-button').addEventListener('click', test);
    document.getElementById('logout-button').addEventListener('click', logout);
});