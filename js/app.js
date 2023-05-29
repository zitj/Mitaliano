import { hideList } from './utilities/list.js';
import { debounce } from './utilities/debounce.js';
import { switchSections } from './utilities/section-switcher.js';
import { randomise } from './services/shared-service.js';
import { insertFilters, toggleFilter, chooseFilter, isFilterClicked, filterName } from './utilities/filters.js';
import { WORDS, VERBS, CLASSES } from './constants.js';
import {
	wantedVerbsInput,
	listOfVerbs,
	heading,
	navigationLinks,
	sections,
	listOfWords,
	textFilter,
	filterOptions,
} from './utilities/html_elements.js';

let randomWords = [];
let randomVerbs = [];

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
		randomise(VERBS, listOfVerbs, randomVerbs);
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
		randomise(WORDS, listOfWords, randomWords, false, filterName);
	});
};

const clickLogic = (element) => {
	let elementClicked = element.target;
	let className = elementClicked.className;
	toggleFilter(elementClicked, elementIDsOfFilter, filterOptions);

	if (className === CLASSES.VERB_LINK) elementClicked.classList.add('visited');
	if (className === CLASSES.NAVIGATION_LINK) switchSections(elementClicked, navigationLinks, sections);
	if (className === CLASSES.TRANSLATION_BUTTON) showTranslation(element);
	if (elementClicked.id === CLASSES.NEXT_BUTTON) nextWord(elementClicked);
	if (className === CLASSES.FILTER_OPTION) {
		chooseFilter(elementClicked, filterOptions, textFilter, listOfWords, randomWords);
	}
};

document.addEventListener('click', (event) => {
	clickLogic(event);
});

insertFilters(filterOptions, textFilter);
