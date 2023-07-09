import { showList } from '../utilities/list.js';
import { verbs } from '../../data/verbs.js';
import { words } from '../../data/words.js';
import { removeHeadingError, showHeadingError } from '../utilities/heading.js';
import { WORDS, VERBS } from '../constants.js';
import { heading, cardCounter, verbsInput } from '../utilities/html_elements.js';
import { filteringWords } from '../utilities/filters.js';
import { returnContent } from '../utilities/content.js';

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

const returnRandomElements = (arrayOfRandomNumbers, type, source) => {
	let randomElements = [];
	arrayOfRandomNumbers.forEach((number) => {
		if (type === VERBS) randomElements.push(verbs[number].name);
		if (type === WORDS) {
			lastWordNumber = number;
			source.wordsObj[number].id = number;
			source.passedWords[number] = source.wordsObj[number];
			randomElements.push(source.wordsObj[number]);
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

const showRandomisedElements = (modifiers) => {
	let arrayOfRandomNumbers = [];
	let arrayWithDuplicates = [];
	modifiers.sectionModifier.randomElements = [];
	modifiers.filterModifier.wordsObj = {};
	if (modifiers.filterModifier.passedWords === undefined) {
		modifiers.filterModifier.passedWords = filterModifier.passedWords;
	}

	if (modifiers.sectionModifier.type === WORDS) {
		modifiers.filterModifier.totalNumberOfElements = modifiers.sectionModifier.totalNumberOfElements;
	}

	if (modifiers.sectionModifier.sectionSwitched) modifiers.filterModifier.passedWords = {};
	if (modifiers.sectionModifier.type === VERBS) {
		if (modifiers.sectionModifier.wantedNumberToShow > modifiers.sectionModifier.totalNumberOfElements) {
			showHeadingError(heading, modifiers.sectionModifier.totalNumberOfElements, modifiers.sectionModifier.list);
			return;
		}
		removeHeadingError(heading);
	}
	if (modifiers.sectionModifier.type === WORDS) {
		modifiers.filterModifier = filteringWords(modifiers.filterModifier, words);
	}
	modifiers.arrayOfRandomNumbers = arrayOfRandomNumbers;
	modifiers.arrayWithDuplicates = arrayWithDuplicates;
	arrayOfRandomNumbers = returnArrayOfRandomNumbersBasedOnTotalNumberOfElements(modifiers);
	modifiers.sectionModifier.randomElements = returnRandomElements(
		modifiers.arrayOfRandomNumbers,
		modifiers.sectionModifier.type,
		modifiers.filterModifier
	);
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

const formatDate = (miliseconds) => {
	miliseconds = +miliseconds;
	if (typeof miliseconds === 'number') {
		const date = new Date(miliseconds);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}.${month}.${year}`;
	} else {
		return miliseconds;
	}
};

export { render, randomise, hideAllElements, returnFilterIDBasedOn, formatDate };
