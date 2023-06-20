import { hideList } from './utilities/list.js';
import { debounce } from './utilities/debounce.js';
import { switchSections } from './utilities/section-switcher.js';
import { randomise, hideAllElements } from './services/shared-service.js';
import {
	insertFilters,
	chooseFilter,
	toggleFilterList,
	isFilterClicked,
	filterName,
	changeInnerTextForFilter,
	insertFiltersOptions,
	returnFiltersDOM,
	chooseFilterOption,
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

// const chooseFilterOption = (filterType, elementClicked) => {
// 	chosenFilters[filterType] = elementClicked.innerText;
// 	hideAllElements(filterOptionsLists);
// 	changeInnerTextForFilter(filterType, filterTexts, elementClicked.innerText);
// };

const clickLogic = (element) => {
	let elementClicked = element.target;
	let className = elementClicked.className;
	let filterType = element.target.filterType;

	if (elementClicked.id === IDs.NEXT_BUTTON) nextWord(elementClicked);
	if (elementClicked.id === IDs.OVERLAY) closeFilterMenu();

	if (className === CLASSES.VERB_LINK) elementClicked.classList.add('visited');
	if (className === CLASSES.NAVIGATION_LINK) switchSections(elementClicked, navigationLinks, sections);
	if (className === CLASSES.TRANSLATION_BUTTON) showTranslation(element);
	if (className == CLASSES.FILTER_ICON) showFilterMenu();
	if (className === CLASSES.FILTER_OPTION) {
		chooseFilterOption(filterType, filterOptionsLists, filterTexts, elementClicked);
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
	insertFiltersOptions(filter, filterTexts, filterOptionsLists);

	filter.addEventListener('click', (event) => {
		let elementsID = event.target.id;
		let filterName = elementsID.split('-')[elementsID.split('-').length - 1];
		toggleFilterList(filterName, filterOptionsLists);
	});
});
