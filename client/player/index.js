import { buildDefaultToolbar } from '../utils/toolbar.js';
import { getArt } from '../utils/art-service.js';

const ANIMATION_PLAYER_KEY = 'ascii-art-animation-player';
const DISPLAY_ROOT_ID = 'display';
const ID_PARAM = 'id';

function play(result) {
    const art = JSON.parse(result.content);
    const frames = art.frames;
    const displayRoot = document.getElementById(DISPLAY_ROOT_ID);
    displayRoot.textContent = frames[0];

    if(result.type === 'animation') {
        const fps = art.fps;
        let currentFrame = 0;
        const totalFrames = frames.length;
        setInterval(() => {
            displayRoot.textContent = frames[currentFrame];
            currentFrame = (currentFrame + 1) % totalFrames;
        }, 1000/fps);
    }
}

window.addEventListener('load', () => {
    buildDefaultToolbar();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get(ID_PARAM);

    if(id) {
        getArt(id)
        .then(response => play(response.result))
        .catch(console.error);
    } else {
        const stored = getItem(ANIMATION_PLAYER_KEY);
        if(stored) {
            play({
                content: stored,
                type: 'animation',
            });
        } else {
            console.error('No stored art');
        }   
    }
});