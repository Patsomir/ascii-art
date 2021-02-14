import { config } from '../config.js';

export function sendRequest(path, method, headers, body) {
    return fetch(config.server_url + path, {
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

export function get(path) {
    return sendRequest(path, 'GET');
}

export function postJson(path, data) {
    return sendRequest(
        path,
        'POST',
        { 'Content-Type': 'application/json' },
        JSON.stringify(data),
    );
}

export function deleteJson(path, data) {
    return sendRequest(
        path,
        'DELETE',
        { 'Content-Type': 'application/json' },
        JSON.stringify(data),
    );
}
