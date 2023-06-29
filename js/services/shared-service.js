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

const render = (type, list, randomElements) => {
	let content = returnContent(randomElements, type);
	showList(list, content);
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
	let totalCards = Object.keys(filterModifier.wordsObj).length;
	cardCounter.innerHTML = `${passedCards} / ${totalCards}`;
};

const hideAllElements = (elements) => {
	elements.forEach((element) => element.classList.add('hide'));
};

const showRandomisedElements = (modifiers) => {
	let arrayWithDuplicates = [];
	let arrayOfRandomNumbers = [];
	modifiers.sectionModifier.randomElements = [];
	filterModifier.filtersToApply = modifiers.filterModifier.filtersToApply;
	console.log(modifiers.filterModifier.filtersToApply);

	if (modifiers.sectionModifier.sectionSwitched) filterModifier.passedWords = {};
	if (modifiers.sectionModifier.type === VERBS) {
		if (sectionModifier.wantedNumberToShow > modifiers.sectionModifier.totalNumberOfElements) {
			showHeadingError(heading, modifiers.sectionModifier.totalNumberOfElements, modifiers.sectionModifier.list);
			return;
		}
		removeHeadingError(heading);
	}
	if (modifiers.sectionModifier.type === WORDS)
		filterModifier = filteringWords(modifiers.sectionModifier, words, filterModifier);

	while (arrayOfRandomNumbers.length < modifiers.sectionModifier.wantedNumberToShow) {
		arrayOfRandomNumbers = returnArrayOfRandomNumbers(
			modifiers.sectionModifier,
			filterModifier,
			arrayOfRandomNumbers,
			arrayWithDuplicates
		);
	}
	modifiers.sectionModifier.randomElements = returnRandomElements(
		arrayOfRandomNumbers,
		modifiers.sectionModifier.type,
		filterModifier
	);
	setCardCounter(filterModifier, cardCounter);
	render(modifiers.sectionModifier.type, modifiers.sectionModifier.list, modifiers.sectionModifier.randomElements);
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
