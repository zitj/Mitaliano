import { hideList } from './utilities/list.js';
import { debounce } from './utilities/debounce.js';
import { switchSections } from './utilities/section-switcher.js';
import { randomise } from './utilities/renderer.js';
import {
	chosenFilters,
	toggleFilters,
	filterName,
	showFilterMenu,
	closeFilterMenu,
	filterWrappers,
	chooseFilterOption,
	filters,
	applyFilters,
} from './utilities/filters.js';
import { TEXT, CLASSES, IDs } from './constants.js';
import {
	wantedVerbsInput,
	listOfVerbs,
	heading,
	navigationLinks,
	sections,
	listOfWords,
	listOfGameWords,
} from './utilities/html-elements.js';

let randomWords = [];
let randomVerbs = [];

let clickedOriginalWord;
let clickedTranslatedWord;

let sectionModifier = {
	type: TEXT.WORDS,
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

const randomiseBasedOnSectionType = (type) => {
	modifiers.sectionModifier.type = type;
	modifiers.sectionModifier.list = type === TEXT.WORDS ? listOfWords : listOfVerbs;
	modifiers.sectionModifier.randomElements = type === TEXT.WORDS ? randomWords : randomVerbs;
	randomise(modifiers);
};

wantedVerbsInput.addEventListener(
	'keyup',
	debounce((e) => {
		if (e.target.value === '') {
			heading.innerHTML = '';
			hideList(listOfVerbs);
			return;
		}
		randomiseBasedOnSectionType(TEXT.VERBS);
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
		randomiseBasedOnSectionType(TEXT.WORDS);
	});
};

const gameLogic = (modifiers) => {
	let element = modifiers.event;
	if (element.target.id === IDs.WORD.ORIGINAL) {
		if (
			(!clickedOriginalWord && !clickedTranslatedWord) ||
			(clickedOriginalWord &&
				clickedOriginalWord.getAttribute('data') !== element.srcElement.getAttribute('data') &&
				!clickedTranslatedWord)
		) {
			if (clickedOriginalWord && clickedOriginalWord.classList.contains('clicked')) {
				clickedOriginalWord.classList.remove('clicked');
			}
			clickedOriginalWord = element.srcElement;
			clickedOriginalWord.classList.add('clicked');
		}
	}
	if (element.target.id === IDs.WORD.TRANSLATED) {
		if (
			(!clickedOriginalWord && !clickedTranslatedWord) ||
			(clickedTranslatedWord &&
				clickedTranslatedWord.getAttribute('data') !== element.srcElement.getAttribute('data') &&
				!clickedOriginalWord)
		) {
			if (clickedTranslatedWord && clickedTranslatedWord.classList.contains('clicked')) {
				clickedTranslatedWord.classList.remove('clicked');
			}
			clickedTranslatedWord = element.srcElement;
			clickedTranslatedWord.classList.add('clicked');
		}
		if (
			clickedOriginalWord &&
			clickedTranslatedWord &&
			clickedTranslatedWord.getAttribute('data') !== clickedOriginalWord.getAttribute('data')
		) {
			clickedOriginalWord.classList.remove('clicked');
			clickedOriginalWord = null;
			clickedTranslatedWord = null;
		}
	}
};

const setFilterModifier = (element) => {
	filterModifier.type = element.target.filterType;
	filterModifier.htmlElements.filterWrappers = filterWrappers;
	filterModifier.elementClicked = element.target;
	filterModifier.filtersToApply = chosenFilters;
	filterModifier.newFiltersApplied = false;
};

const fireFunctionBasedOnIDofElement = (modifiers) => {
	let id = modifiers.elementClicked.id;
	if (id === IDs.NEXT_BUTTON) nextWord(modifiers.elementClicked);
	if (id === IDs.FILTER_APPLY_BUTTON) applyFilters(modifiers);
	if (id === IDs.CLOSE_FILTERS_BUTTON) closeFilterMenu(modifiers.filterModifier.htmlElements.filterOptionsLists);
	if (id === IDs.OVERLAY) closeFilterMenu(modifiers.filterModifier.htmlElements.filterOptionsLists);
	if (id === IDs.WORD.ORIGINAL || id === IDs.WORD.TRANSLATED) gameLogic(modifiers);
};

const fireFunctionBasedOnClassOfElement = (modifiers) => {
	let className = modifiers.elementClicked.className;
	if (className === CLASSES.VERB_LINK) modifiers.elementClicked.classList.add('visited');
	if (className === CLASSES.NAVIGATION_LINK) switchSections(modifiers);
	if (className === CLASSES.TRANSLATION_BUTTON) showTranslation(modifiers.event);
	if (className === CLASSES.FILTER_ICON) showFilterMenu();
	if (className === CLASSES.FILTER_OPTION) chooseFilterOption(filterModifier);
};

const setModifiers = (element) => {
	return {
		section: element.target,
		navigationLinks,
		sections,
		filterModifier,
		sectionModifier,
		elementClicked: element.target,
		event: element,
		matchingGameElements: { clickedOriginalWord, clickedTranslatedWord },
	};
};

const clickLogic = (element) => {
	console.log(element.srcElement.getAttribute('data'));

	setFilterModifier(element);
	let modifiers = setModifiers(element);
	console.log(modifiers.matchingGameElements);
	fireFunctionBasedOnIDofElement(modifiers);
	fireFunctionBasedOnClassOfElement(modifiers);
};

document.addEventListener('click', (event) => clickLogic(event));
toggleFilters(filterModifier);
