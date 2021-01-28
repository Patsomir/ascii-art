const SERVER_URL = 'http://localhost/server';

function sendRequest(path, method, headers, body) {
    return fetch(SERVER_URL + path, {
        method,
        headers,
        body,
    })
    .then(response => {
        if(response.ok || (response.status >= 400 && response.status < 500)) {
            return response.json();
        }
        throw { errors: 'Server error' };
    })
    .then(data => {
        if(data.errors) {
            throw data;
        }
        return data;
    });
}

function get(path) {
    return sendRequest(path, 'GET');
}

function postJson(path, data) {
    return sendRequest(
        path,
        'POST',
        { 'Content-Type': 'application/json' },
        JSON.stringify(data),
    );
}
