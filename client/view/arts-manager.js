import { getLikesInfo, like } from '../utils/like-service.js';
import { moveTo } from '../utils/navigation.js';

const CATALOGUE_ID = 'catalogue';

const PLAYER_PATH = '/player';

const ENTRY_CLASS = 'entry';
const TITLE_CLASS = 'title';
const CREATOR_CLASS = 'creator';
const LIKES_CLASS = 'likes';
const NUMBER_LIKES_CLASS = 'number-likes';
const HEART_CLASS = 'heart';

export function loadPage(arts) {
    let catalogue = document.getElementById(CATALOGUE_ID);
    arts.forEach(art => displayArt(art, catalogue));
}

function displayArt(art, catalogue) {
    const artContainer = document.createElement('div');
    artContainer.classList.add(ENTRY_CLASS);

    const container = document.createElement('div');
    artContainer.appendChild(container);

    const title = document.createElement('p');
    title.classList.add(TITLE_CLASS);
    title.textContent = art.name;
    container.appendChild(title);

    const creator = document.createElement('p');
    creator.classList.add(CREATOR_CLASS);
    creator.textContent = `by ${art.username}`;
    container.appendChild(creator);

    const likes = document.createElement('p');
    likes.classList.add(LIKES_CLASS);
    artContainer.appendChild(likes);

    const numberLikes = document.createElement('span');
    numberLikes.classList.add(NUMBER_LIKES_CLASS);
    likes.appendChild(numberLikes);

    const heart = document.createElement('span');
    heart.classList.add(HEART_CLASS);
    heart.textContent = '\u2764';
    likes.appendChild(heart);

    getLikesInfo(art.id)
        .then(response => numberLikes.textContent = response.result.likes)
        .catch(console.error);

    artContainer.addEventListener('click', () => moveTo(`${PLAYER_PATH}?id=${art.id}`));

    catalogue.appendChild(artContainer);
}