import { buildDefaultToolbar } from '../utils/toolbar.js';
import { getArt } from '../utils/art-service.js';
import { getLikesInfo, like, unlike } from '../utils/like-service.js';
import { getCurrentUser } from'../utils/auth-service.js'; 

const ANIMATION_PLAYER_KEY = 'ascii-art-animation-player';
const DISPLAY_ROOT_ID = 'display';
const ID_PARAM = 'id';

const TITLE_ID = 'title';
const DATE_ID = 'date';
const LIKES_ID = 'likes';
const LIKE_COUNT_ID = 'like-count';
const LIKE_BUTTON_ID = 'like-button';
const CREATOR_ID = 'creator';

const ERROR_CLASS = 'error';
const USER_LIKED_CLASS = 'user-liked';

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

function displayMetadata(result) {
    document.getElementById(TITLE_ID).textContent = result.name;
    document.getElementById(CREATOR_ID).textContent = `by ${result.creator} (${result.username})`;
    document.getElementById(DATE_ID).textContent = result.created_at;
}

function displayErrors(errors) {
    const errorRoot = document.getElementById(DISPLAY_ROOT_ID);
    for(const error of errors) {
        errorRoot.innerHTML += `<p class="${ERROR_CLASS}">${error}</p>`;
    }
}

function setLikesInfo(likes, userLiked) {
    userLikedGlobal = userLiked;
    if(userLiked) {
        document.getElementById(LIKE_BUTTON_ID).classList.add(USER_LIKED_CLASS);
    } else {
        document.getElementById(LIKE_BUTTON_ID).classList.remove(USER_LIKED_CLASS);
    }
    document.getElementById(LIKE_COUNT_ID).textContent = likes;
}

function requestLikes(artId) {
    return getLikesInfo(artId)
    .then(response => {
        setLikesInfo(response.result.likes, response.result.user_liked);
        document.getElementById(LIKES_ID).style['display'] = 'flex';
    })
    .catch(console.error);
}

function submitLike(event, artId) {
    event.target.disabled = true;
    let callback = like;
    if(userLikedGlobal) {
        callback = unlike;
    }
    callback(artId)
    .then(() => requestLikes(artId))
    .then(() => { event.target.disabled = false; })
    .catch(console.error);
}

let userLikedGlobal;
window.addEventListener('load', () => {
    buildDefaultToolbar();
    if(!getCurrentUser()) {
        document.getElementById(LIKE_BUTTON_ID).style['display'] = 'none';
    }

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get(ID_PARAM);

    if(id) {
        getArt(id)
        .then(response => {
            play(response.result);
            displayMetadata(response.result);
            requestLikes(response.result.id);
            document.getElementById(LIKE_BUTTON_ID).addEventListener('click', event => submitLike(event, response.result.id));
        })
        .catch(response => displayErrors(response.errors));
    } else {
        const stored = localStorage.getItem(ANIMATION_PLAYER_KEY);
        if(stored) {
            play({
                content: stored,
                type: 'animation',
            });
        } else {
            displayErrors(['No stored art']);
        }   
    }
});