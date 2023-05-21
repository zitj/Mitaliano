import { hideList } from './utilities/list.js';
import { debounce } from './utilities/debounce.js';
import { switchSections } from './utilities/section-switcher.js';
import { randomise } from './services/shared-service.js';
import { insertFilters } from './utilities/filters.js';

const wantedVerbsInput = document.querySelector('#wanted-verbs-input');
const verbsContainer = document.querySelector('#verbs-container');
const listOfVerbs = document.querySelector('#list-of-verbs');
const heading = verbsContainer.children[0];
const navigationLinks = document.querySelectorAll('.navigation-link');
const sections = document.querySelectorAll('section');
const listOfWords = document.querySelector('#list-of-words');
const textFilter = document.querySelector('#filter-text');
const filterOptions = document.querySelector('#filter-options');

let randomWords = [];
let randomVerbs = [];

let filterName = 'Senza filtro';
let isFilterClicked = false;
let elementIDsOfFilter = {
	'filter-lectures': true,
	arrow: true,
	'filter-text': true,
};

wantedVerbsInput.addEventListener(
	'keyup',
	debounce((e) => {
		if (e.target.value === '') {
			heading.innerHTML = '';
			hideList(listOfVerbs);
			return;
		}
		randomise('verbs', listOfVerbs, randomVerbs);
	}, 500)
);

const showTranslation = (button) => {
	let translation = button.srcElement.nextElementSibling;
	button.target.classList.add('hide');
	translation.classList.remove('hide');
};

const nextWord = (elementClicked) => {
	if (isFilterClicked) {
		filterOptions.classList.add('hide');
		isFilterClicked = !isFilterClicked;
	}
	let card = elementClicked.parentElement;
	card.classList.add('outro');
	card.addEventListener('animationend', (event) => {
		card.classList.remove('outro');
		randomise('words', listOfWords, randomWords, false, filterName);
	});
};

const toggleFilter = (elementClicked) => {
	if (elementIDsOfFilter[elementClicked.id]) {
		isFilterClicked = !isFilterClicked;
		if (isFilterClicked) {
			filterOptions.classList.remove('hide');
		} else {
			filterOptions.classList.add('hide');
		}
	}
};
const chooseFilter = (elementClicked) => {
	isFilterClicked = !isFilterClicked;
	filterOptions.classList.add('hide');
	filterName = elementClicked.innerText;
	textFilter.innerText = filterName;
	randomise('words', listOfWords, randomWords, false, filterName);
};

const clickLogic = (element) => {
	let elementClicked = element.target;
	let className = elementClicked.className;
	toggleFilter(elementClicked);
	if (className === 'verb-link') elementClicked.classList.add('visited');
	if (className === 'navigation-link') switchSections(elementClicked, navigationLinks, sections);
	if (className === 'translation-button') showTranslation(element);
	if (elementClicked.id === 'next-btn') nextWord(elementClicked);
	if (className === 'filter-option') chooseFilter(elementClicked);
};

document.addEventListener('click', (event) => {
	clickLogic(event);
});

insertFilters(filterOptions, textFilter);
