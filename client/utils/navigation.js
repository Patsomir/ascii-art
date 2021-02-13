import { config } from "../config.js";

export function moveTo(path) {
    location.href = config.client_prefix + path;
}