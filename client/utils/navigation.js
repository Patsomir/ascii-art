import { config } from "../config.js";

export function moveTo(path) {
    location.href = config.client_prefix + path;
}

export function open(path) {
    window.open(config.client_prefix + path);
}