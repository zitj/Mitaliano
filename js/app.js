import { hideList } from './utilities/list.js';
import { debounce } from './utilities/debounce.js';
import { switchSections } from './utilities/section-switcher.js';
import { randomise, hideAllElements } from './services/shared-service.js';
import {
	chooseFilter,
	toggleFilterList,
	isFilterClicked,
	filterName,
	showFilterMenu,
	closeFilterMenu,
	insertFiltersOptions,
	insertFiltersOptionsBasedOnChosenFilter,
	returnFiltersDOM,
	chooseFilterOption,
	filters,
} from './utilities/filters.js';
import { WORDS, VERBS, CLASSES, IDs } from './constants.js';
import {
	wantedVerbsInput,
	listOfVerbs,
	heading,
	navigationLinks,
	sections,
	listOfWords,
	filterOptions,
	closeFilterButton,
} from './utilities/html_elements.js';

let randomWords = [];
let randomVerbs = [];

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
	let filterType = element.target.filterType;
	let modifier = {
		type: filterType,
		htmlElements: {
			filterOptionsLists: filterOptionsLists,
			filterTexts: filterTexts,
			filterWrappers: filterWrappers,
		},
		elementClicked: elementClicked,
	};

	if (elementClicked.id === IDs.NEXT_BUTTON) nextWord(elementClicked);
	if (elementClicked.id === IDs.OVERLAY) closeFilterMenu(filterOptionsLists);

	if (className === CLASSES.VERB_LINK) elementClicked.classList.add('visited');
	if (className === CLASSES.NAVIGATION_LINK) switchSections(elementClicked, navigationLinks, sections);
	if (className === CLASSES.TRANSLATION_BUTTON) showTranslation(element);
	if (className == CLASSES.FILTER_ICON) showFilterMenu();
	if (className === CLASSES.FILTER_OPTION) {
		chooseFilterOption(modifier);
	}
};

document.addEventListener('click', (event) => {
	clickLogic(event);
});

closeFilterButton.addEventListener('click', (event) => closeFilterMenu());

let filterWrappers = returnFiltersDOM();
let filterOptionsLists = document.querySelectorAll('.filter-options-list');
let filterTexts = document.querySelectorAll('.filter-text');

filterWrappers.forEach((filter) => {
	let modifier = {
		type: null,
		htmlElements: {
			filterOptionsLists: filterOptionsLists,
			filterTexts: filterTexts,
		},
		filter: filter,
		filters: filters,
	};

	insertFiltersOptions(modifier);

	filter.addEventListener('click', (event) => {
		let elementsID = event.target.id;
		let filterName = elementsID.split('-')[elementsID.split('-').length - 1];
		modifier.type = filterName;
		toggleFilterList(modifier);
	});
});
