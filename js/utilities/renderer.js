import { showList } from './list.js';
import { verbs } from '../../data/verbs.js';
import { words } from '../../data/words.js';
import { removeHeadingError, showHeadingError } from './heading.js';
import { WORDS, VERBS } from '../constants.js';
import { heading, cardCounter, verbsInput } from './html-elements.js';
import { filteringWords } from './filters.js';
import { returnContent } from './content.js';

let lastWordNumber;
let filterModifier = {
	previousFilter: '',
	passedWords: {},
	wordsArray: [],
	wordsObj: {},
};

const render = (modifiers) => {
	let content = returnContent(modifiers);
	showList(modifiers.sectionModifier.list, content);
};

const returnRandomElements = (modifiers) => {
	let randomElements = [];
	modifiers.arrayOfRandomNumbers.forEach((number) => {
		if (modifiers.sectionModifier.type === VERBS) randomElements.push(verbs[number].name);
		if (modifiers.sectionModifier.type === WORDS) {
			lastWordNumber = number;
			modifiers.filterModifier.wordsObj[number].id = number;
			modifiers.filterModifier.passedWords[number] = modifiers.filterModifier.wordsObj[number];
			randomElements.push(modifiers.filterModifier.wordsObj[number]);
		}
	});
	return randomElements;
};

const setCardCounter = (filterModifier, cardCounter) => {
	let passedCards = Object.keys(filterModifier.passedWords).length;
	let totalCards = filterModifier.wordsArray.length;
	cardCounter.innerHTML = `${passedCards} / ${totalCards}`;
};

const hideAllElements = (elements) => {
	elements.forEach((element) => element.classList.add('hide'));
};

const returnArrayOfRandomNumbersBasedOnTotalNumberOfElements = (modifiers) => {
	let totalNumberOfElements =
		modifiers.sectionModifier.type === VERBS
			? modifiers.sectionModifier.totalNumberOfElements
			: modifiers.filterModifier.wordsArray.length;

	if (totalNumberOfElements > 1) {
		while (modifiers.arrayOfRandomNumbers.length < modifiers.sectionModifier.wantedNumberToShow) {
			modifiers.arrayOfRandomNumbers = returnArrayOfRandomNumbers(
				modifiers.sectionModifier,
				modifiers.filterModifier,
				modifiers.arrayOfRandomNumbers,
				modifiers.arrayWithDuplicates
			);
		}
	}
	if (totalNumberOfElements === 1) modifiers.arrayOfRandomNumbers = [0];
	return modifiers.arrayOfRandomNumbers;
};

const returnModifiedFilterModifier = (modifiers) => {
	if (modifiers.filterModifier.passedWords === undefined) {
		modifiers.filterModifier.passedWords = filterModifier.passedWords;
	}

	if (modifiers.sectionModifier.type === WORDS) {
		modifiers.filterModifier.totalNumberOfElements = modifiers.sectionModifier.totalNumberOfElements;
	}

	if (modifiers.sectionModifier.sectionSwitched) modifiers.filterModifier.passedWords = {};

	if (modifiers.sectionModifier.type === WORDS) {
		modifiers.filterModifier = filteringWords(modifiers.filterModifier, words);
	}
	return modifiers;
};

const showRandomisedElements = (modifiers) => {
	let arrayOfRandomNumbers = [];
	let arrayWithDuplicates = [];
	modifiers.sectionModifier.randomElements = [];
	modifiers.filterModifier.wordsObj = {};
	modifiers = returnModifiedFilterModifier(modifiers);

	if (modifiers.sectionModifier.type === VERBS) {
		if (modifiers.sectionModifier.wantedNumberToShow > modifiers.sectionModifier.totalNumberOfElements) {
			showHeadingError(heading, modifiers);
			return;
		}
		removeHeadingError(heading);
	}
	modifiers.arrayOfRandomNumbers = arrayOfRandomNumbers;
	modifiers.arrayWithDuplicates = arrayWithDuplicates;
	arrayOfRandomNumbers = returnArrayOfRandomNumbersBasedOnTotalNumberOfElements(modifiers);
	modifiers.sectionModifier.randomElements = returnRandomElements(modifiers);
	if (modifiers.sectionModifier.type === WORDS) setCardCounter(modifiers.filterModifier, cardCounter);
	render(modifiers);
};

const returnArrayOfRandomNumbers = (sectionModifier, filterModifier, arrayOfRandomNumbers, arrayWithDuplicates) => {
	let totalNumberOfElements =
		sectionModifier.type === WORDS
			? Object.keys(filterModifier.wordsObj).length
			: sectionModifier.totalNumberOfElements;
	let randomNumber = Math.floor(Math.random() * totalNumberOfElements);
	if (Object.keys(filterModifier.passedWords).length == Object.keys(filterModifier.wordsObj).length) {
		filterModifier.passedWords = {};
	}
	if (randomNumber !== lastWordNumber && filterModifier.passedWords[randomNumber] == undefined) {
		arrayWithDuplicates.push(randomNumber);
	}
	arrayOfRandomNumbers = [...new Set(arrayWithDuplicates)];

	return arrayOfRandomNumbers;
};

const randomise = (modifiers) => {
	modifiers.sectionModifier.totalNumberOfElements =
		modifiers.sectionModifier.type === VERBS ? Object.keys(verbs).length : Object.keys(words).length;
	modifiers.sectionModifier.wantedNumberToShow = modifiers.sectionModifier.type === VERBS ? +verbsInput.value : 1;

	showRandomisedElements(modifiers);
};

const returnFilterIDBasedOn = (elementsID) => {
	return elementsID.split('-')[elementsID.split('-').length - 1];
};

export { render, randomise, hideAllElements, returnFilterIDBasedOn };
