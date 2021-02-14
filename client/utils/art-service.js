import { postJson, get } from './http-service.js';

const ARTS_PATH = '/arts.php';

export function postArt(name, content, type) {
    const request = {
        name,
        content,
        type
    };
    return postJson(ARTS_PATH, request);
}

export function getArt(id) {
    return get(`${ARTS_PATH}?id=${id}`);
}

export function getArtPage(page, pageSize) {
    let path = ARTS_PATH;
    path += `?page=${page}`;
    path += `&pageSize=${pageSize}`;

    return get(path);
}
