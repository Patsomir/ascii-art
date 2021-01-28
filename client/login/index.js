const PATH = '/registration.php';

function submit(event) {
    event.preventDefault();
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = 'Loading...';

    const data = {
        name: document.getElementById('name').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
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

window.addEventListener('load', () => {
    document.getElementById('submit-button').addEventListener('click', submit);
});