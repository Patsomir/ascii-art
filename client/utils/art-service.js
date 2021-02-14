import { postJson } from './http-service.js';

export function postArt(name, content, type) {
    const request = {
        name,
        content,
        type
    };

    return postJson("/arts.php", request);
}
