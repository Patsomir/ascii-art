import { postJson, get, deleteJson } from './http-service.js';

const LIKES_PATH = '/likes.php';

export function like(artId) {
    const request = {
        art_id: artId
    };

    return postJson(LIKES_PATH, request);
}

export function unlike(artId) {
    const request = {
        art_id: artId
    };

    return deleteJson(LIKES_PATH, request);
}

export function getLikesInfo(artId) {
    return get(`${LIKES_PATH}?art_id=${artId}`);
}