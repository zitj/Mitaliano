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

let matchedWordsCounter = 0;

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

const clickedBothWordsDontMatch = (modifiers) => {
	let wordCards = modifiers.matchingGameElements.wordCards;
	let selectedWords = modifiers.matchingGameElements.clickedWords;

	for (let type in selectedWords) {
		selectedWords[type].classList.add('clicked-wrong');
	}
	clickedOriginalWord = null;
	clickedTranslatedWord = null;
	setTimeout(() => {
		wordCards.forEach((card) => {
			card.classList.remove('clicked');
			card.classList.remove('clicked-wrong');
		});
	}, 500);
};

const clickedBothWordsMatch = (modifiers) => {
	let selectedWords = modifiers.matchingGameElements.clickedWords;

	for (let type in selectedWords) {
		selectedWords[type].classList.add('clicked-matched');
	}
	matchedWordsCounter++;
	setTimeout(() => {
		for (let type in selectedWords) {
			selectedWords[type].classList.add('clicked-disappear');
		}
		clickedOriginalWord = null;
		clickedTranslatedWord = null;
	}, 200);
};

const showNewSetOfWords = (modifiers) => {
	let wordCards = modifiers.matchingGameElements.wordCards;

	if (matchedWordsCounter === wordCards.length / 2) {
		setTimeout(() => {
			matchedWordsCounter = 0;
			randomise(modifiers);
		}, 500);
	}
};

const clickedBothWords = (modifiers) => {
	modifiers.matchingGameElements.wordCards = document.querySelectorAll(`.game-word`);

	if (clickedOriginalWord && clickedTranslatedWord) {
		let clickedOriginalWordContent = clickedOriginalWord.srcElement.getAttribute('data');
		let clickedTranslatedWordContent = clickedTranslatedWord.srcElement.getAttribute('data');

		if (clickedOriginalWordContent !== clickedTranslatedWordContent) {
			clickedBothWordsDontMatch(modifiers);
		} else {
			clickedBothWordsMatch(modifiers);
		}
		showNewSetOfWords(modifiers);
	}
};

const clickedSingleWord = (modifiers) => {
	let lastClickedWordID = modifiers.matchingGameElements.lastClickedWordID;
	let selectedWords = modifiers.matchingGameElements.clickedWords;
	let wordCards = modifiers.matchingGameElements.wordCards;

	if (selectedWords[lastClickedWordID]) {
		let selectedWord = selectedWords[lastClickedWordID];
		if (selectedWord.word) {
			wordCards.forEach((card) => card.classList.remove('clicked'));
			selectedWord.classList.add('clicked');
			console.log(selectedWord);
		} else {
			wordCards.forEach((card) => card.classList.remove('clicked'));
		}
	}
};

const gameLogic = (modifiers) => {
	let element = modifiers.event;
	let id = element.target.id;
	let originalWordClassList = clickedOriginalWord ? clickedOriginalWord.srcElement.classList : null;
	let translatedWordClassList = clickedTranslatedWord ? clickedTranslatedWord.srcElement.classList : null;
	let wordCards = document.querySelectorAll(`.game-word-${id}`);
	let clickedWords = {
		original: { id: IDs.WORD.ORIGINAL, word: clickedOriginalWord, classList: originalWordClassList },
		translated: { id: IDs.WORD.TRANSLATED, word: clickedTranslatedWord, classList: translatedWordClassList },
	};
	modifiers.matchingGameElements.lastClickedWordID = id;
	modifiers.matchingGameElements.clickedWords = clickedWords;
	modifiers.matchingGameElements.wordCards = wordCards;

	clickedSingleWord(modifiers);
	clickedBothWords(modifiers);
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

const setMatchingGameElements = (element) => {
	let id = element.target.id;
	let clickedOriginalWordContent = clickedOriginalWord ? clickedOriginalWord.srcElement.getAttribute('data') : null;
	let clickedTranslatedWordContent = clickedTranslatedWord
		? clickedTranslatedWord.srcElement.getAttribute('data')
		: null;
	let lastWordClickedContent = element.srcElement.getAttribute('data');

	if (element.srcElement.classList.contains('clicked-matched')) return;

	if (id === IDs.WORD.ORIGINAL) {
		if (clickedOriginalWordContent === lastWordClickedContent) {
			clickedOriginalWord = null;
		} else {
			clickedOriginalWord = element;
		}
	}
	if (id === IDs.WORD.TRANSLATED) {
		if (clickedTranslatedWordContent === lastWordClickedContent) {
			clickedTranslatedWord = null;
		} else {
			clickedTranslatedWord = element;
		}
	}
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
	setFilterModifier(element);
	setMatchingGameElements(element);
	let modifiers = setModifiers(element);
	fireFunctionBasedOnIDofElement(modifiers);
	fireFunctionBasedOnClassOfElement(modifiers);
};

document.addEventListener('click', (event) => clickLogic(event));
toggleFilters(filterModifier);
