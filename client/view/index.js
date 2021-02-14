import { buildDefaultToolbar } from '../utils/toolbar.js';
import { loadPage } from './arts-manager.js';
import { getArtPage } from '../utils/art-service.js';
import { moveTo } from '../utils/navigation.js';

const VIEW_PATH = '/view';
const PAGE_PARAM = 'page';
const DEFAULT_PAGE = 0;
const PAGE_SIZE = 12;

const PREVIOUS_PAGE_BUTTON_ID = 'previous-button';
const NEXT_PAGE_BUTTON_ID = 'next-button';

const NAVIGATION_CONTAINER_CLASS = 'navigation-container';
const NAVIGATION_BUTTON_CLASS = 'navigation-button';
const PAGE_COUNT_CLASS = 'page-count';

window.addEventListener('load', () => {
    buildDefaultToolbar();

    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get(PAGE_PARAM) ?? DEFAULT_PAGE);

    getArtPage(page, PAGE_SIZE)
        .then(response => {
            loadPage(response.result.arts);
            const maxPage = Math.floor(response.result.count / PAGE_SIZE);

            const navigation_container = document.createElement('div');
            navigation_container.classList.add(NAVIGATION_CONTAINER_CLASS);
            document.body.appendChild(navigation_container);

            const previous_button_container = document.createElement('div');
            navigation_container.appendChild(previous_button_container);
            if (page !== 0){
                addPreviousPageButton(page, previous_button_container);
            }

            addPageCount(page, maxPage, navigation_container);

            const next_button_container = document.createElement('div');
            navigation_container.appendChild(next_button_container);
            if (page < maxPage){
                addNextPageButton(page, next_button_container);
            }
        });
});

function addPreviousPageButton(page, button_container) {
    const button = document.createElement('button');
    button_container.appendChild(button);
    button.classList.add(NAVIGATION_BUTTON_CLASS);

    button.setAttribute('id', PREVIOUS_PAGE_BUTTON_ID);
    button.textContent = '<';
    button.addEventListener('click', () => moveTo(`${VIEW_PATH}?page=${page - 1}`));
}

function addPageCount(page, maxPage, navigation_container) {
    const pageCount = document.createElement('span');
    navigation_container.appendChild(pageCount);
    pageCount.classList.add(PAGE_COUNT_CLASS);

    pageCount.textContent = `${page + 1}/${maxPage + 1}`;
}

function addNextPageButton(page, button_container) {
    const button = document.createElement('button');
    button_container.appendChild(button);
    button.classList.add(NAVIGATION_BUTTON_CLASS);

    button.setAttribute('id', NEXT_PAGE_BUTTON_ID);
    button.textContent = '>';
    button.addEventListener('click', () => moveTo(`${VIEW_PATH}?page=${page + 1}`));
}