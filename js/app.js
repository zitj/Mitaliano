import { hideList } from './utilities/list.js';
import { debounce } from './utilities/debounce.js';
import { switchSections } from './utilities/section-switcher.js';
import { randomise, returnFilterIDBasedOn } from './services/shared-service.js';
import {
	chosenFilters,
	toggleFilterList,
	isFilterClicked,
	filterName,
	showFilterMenu,
	closeFilterMenu,
	insertFiltersOptions,
	returnFiltersDOM,
	chooseFilterOption,
	filters,
	applyFilters,
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

let sectionModifier = {
	type: WORDS,
	list: listOfWords,
	randomElements: randomWords,
	sectionSwitched: false,
	filterName: filterName,
	totalNumberOfElements: null,
	wantedNumberToShow: null,
};

let filterModifier = {
	type: null,
	htmlElements: {
		filterOptionsLists: null,
		filterTexts: null,
	},
	filter: null,
	filters: filters,
};
let modifiers = {
	filterModifier,
	sectionModifier,
};

wantedVerbsInput.addEventListener(
	'keyup',
	debounce((e) => {
		if (e.target.value === '') {
			heading.innerHTML = '';
			hideList(listOfVerbs);
			return;
		}
		modifiers.sectionModifier.type = VERBS;
		modifiers.sectionModifier.list = listOfVerbs;
		modifiers.sectionModifier.randomElements = randomVerbs;
		randomise(modifiers);
	}, 500)
);

const showTranslation = (button) => {
	let translation = button.srcElement.nextElementSibling;
	button.target.classList.add('hide');
	translation.classList.remove('hide');
};

const nextWord = (elementClicked) => {
	let card = elementClicked.parentElement;
	card.classList.add('outro');

	card.addEventListener('animationend', (event) => {
		card.classList.remove('outro');
		modifiers.sectionModifier.type = WORDS;
		modifiers.sectionModifier.list = listOfWords;
		modifiers.sectionModifier.randomElements = randomWords;
		randomise(modifiers);
	});
};

const clickLogic = (element) => {
	let elementClicked = element.target;
	let className = elementClicked.className;
	let filterType = element.target.filterType;

	filterModifier.type = filterType;
	filterModifier.htmlElements.filterWrappers = filterWrappers;
	filterModifier.elementClicked = elementClicked;
	filterModifier.filtersToApply = chosenFilters;
	filterModifier.newFiltersApplied = false;

	let modifiers = {
		filterModifier,
		sectionModifier,
	};

	if (elementClicked.id === IDs.NEXT_BUTTON) nextWord(elementClicked);
	if (elementClicked.id === IDs.OVERLAY) closeFilterMenu(filterOptionsLists);
	if (elementClicked.id === IDs.FILTER_APPLY_BUTTON) applyFilters(modifiers);

	if (className === CLASSES.VERB_LINK) elementClicked.classList.add('visited');
	if (className === CLASSES.NAVIGATION_LINK) switchSections(elementClicked, modifiers, navigationLinks, sections);
	if (className === CLASSES.TRANSLATION_BUTTON) showTranslation(element);
	if (className === CLASSES.FILTER_ICON) showFilterMenu();
	if (className === CLASSES.FILTER_OPTION) {
		chooseFilterOption(filterModifier);
	}
};

document.addEventListener('click', (event) => {
	clickLogic(event);
});

closeFilterButton.addEventListener('click', (event) => closeFilterMenu(filterModifier.htmlElements.filterOptionsLists));

let filterWrappers = returnFiltersDOM();
let filterOptionsLists = document.querySelectorAll('.filter-options-list');
let filterTexts = document.querySelectorAll('.filter-text');

filterWrappers.forEach((filter) => {
	filterModifier.filter = filter;
	filterModifier.htmlElements = {
		filterOptionsLists: filterOptionsLists,
		filterTexts: filterTexts,
	};
	insertFiltersOptions(filterModifier);
	filter.addEventListener('click', (event) => {
		let elementsID = event.target.id;
		let filterName = returnFilterIDBasedOn(elementsID);
		filterModifier.type = filterName;
		toggleFilterList(filterModifier);
	});
});
