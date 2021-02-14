import { buildDefaultToolbar } from '../utils/toolbar.js';

const ANIMATION_PLAYER_KEY = 'ascii-art-animation-player';
const ANIMATION_ROOT_ID = 'animation';

window.addEventListener('load', () => {
    buildDefaultToolbar();

    const { frames, fps } = JSON.parse(localStorage.getItem(ANIMATION_PLAYER_KEY));
    let currentFrame = 0;
    totalFrames = frames.length;

    const animationRoot = document.getElementById(ANIMATION_ROOT_ID);
    setInterval(() => {
        animationRoot.textContent = frames[currentFrame];
        currentFrame = (currentFrame + 1) % totalFrames;
    }, 1000/fps);
});