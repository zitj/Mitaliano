import { hideList } from './utilities/list.js';
import { debounce } from './utilities/debounce.js';
import { switchSections } from './utilities/section-switcher.js';
import { randomise, hideAllElements } from './services/shared-service.js';
import {
	insertFilters,
	toggleFilter,
	chooseFilter,
	isFilterClicked,
	filterName,
	filters,
	returnFiltersDOM,
} from './utilities/filters.js';
import { WORDS, VERBS, CLASSES, IDs } from './constants.js';
import {
	wantedVerbsInput,
	listOfVerbs,
	heading,
	navigationLinks,
	sections,
	listOfWords,
	textFilter,
	filterOptions,
	closeFilterButton,
	filterMenu,
	overlay,
} from './utilities/html_elements.js';

let randomWords = [];
let randomVerbs = [];

let elementIDsOfFilter = {
	'filter-lectures': true,
	arrow: true,
	'filter-text': true,
};

let previousFilterName = '';

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

const showFilterMenu = () => {
	filterMenu.classList.add('active');
	overlay.classList.add('active');
};

const hideFilterMenu = () => {
	filterMenu.classList.remove('active');
	overlay.classList.remove('active');
};

const closeFilterMenu = () => {
	hideFilterMenu();
	hideAllElements(filterOptionsLists);
};

const clickLogic = (element) => {
	let elementClicked = element.target;
	let className = elementClicked.className;

	// toggleFilter(elementClicked, elementIDsOfFilter, filterOptions);

	if (elementClicked.id === IDs.NEXT_BUTTON) nextWord(elementClicked);
	if (elementClicked.id === IDs.OVERLAY) closeFilterMenu();

	if (className === CLASSES.VERB_LINK) elementClicked.classList.add('visited');
	if (className === CLASSES.NAVIGATION_LINK) switchSections(elementClicked, navigationLinks, sections);
	if (className === CLASSES.TRANSLATION_BUTTON) showTranslation(element);
	if (className == CLASSES.FILTER_ICON) showFilterMenu();
	if (className === CLASSES.FILTER_OPTION) {
		// chooseFilter(elementClicked, filterOptions, textFilter, listOfWords, randomWords);
	}
};

document.addEventListener('click', (event) => {
	clickLogic(event);
});

closeFilterButton.addEventListener('click', (event) => closeFilterMenu());

let filterWrappers = returnFiltersDOM();
let filterOptionsLists = document.querySelectorAll('.filter-options-list');
let filterTexts = document.querySelectorAll('.filter-text');

const insertFiltersOptions = (filterWrapper) => {
	let filterID = filterWrapper.id.split('-')[filterWrapper.id.split('-').length - 1];
	for (let id in IDs.FILTERS) {
		if (IDs.FILTERS[id] === filterID) {
			let filterTextDOM;
			filterTexts.forEach((filterText) => {
				if (filterText.id.includes(filterID)) {
					filterTextDOM = filterText;
				}
			});
			filterOptionsLists.forEach((list) => {
				if (list.id.includes(filterID)) {
					insertFilters(list, filterTextDOM, filterID);
				}
			});
		}
	}
};

filterWrappers.forEach((filterWrapper) => {
	insertFiltersOptions(filterWrapper);

	filterWrapper.addEventListener('click', (event) => {
		let elementsID = event.target.id;
		let filterName = elementsID.split('-')[elementsID.split('-').length - 1];
		let filterTextDOM;

		filterTexts.forEach((filterText) => {
			if (filterText.id.includes(filterName)) {
				filterTextDOM = filterText;
			}
		});

		for (let id in IDs.FILTERS) {
			if (IDs.FILTERS[id] === filterName) {
				hideAllElements(filterOptionsLists);
				filterOptionsLists.forEach((list) => {
					if (list.id.includes(filterName)) {
						list.classList.remove('hide');
					}
				});
			}
		}
	});
});

// insertFilters(filterOptions, textFilter);
