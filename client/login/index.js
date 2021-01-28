const PATH = '/registration.php';

function submitRegister(event) {
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

function submitLogin(event) {
    event.preventDefault();
    const resultContainer = document.getElementById('login-result');
    resultContainer.innerHTML = 'Loading...';

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    login(username, password)
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

function submitTest(event) {
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

function submitLogout(event) {
    event.preventDefault();
    logout()
    .then(success => console.log(success.result))
    .catch(failure => console.error(failure));
}

window.addEventListener('load', () => {
    document.getElementById('register-button').addEventListener('click', submitRegister);
    document.getElementById('login-button').addEventListener('click', submitLogin);
    document.getElementById('test-button').addEventListener('click', submitTest);
    document.getElementById('logout-button').addEventListener('click', submitLogout);
});