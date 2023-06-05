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

const showRandomisedElements = (sectionModifier) => {
	let arrayWithDuplicates = [];
	let arrayOfRandomNumbers = [];
	sectionModifier.randomElements = [];

	if (sectionModifier.sectionSwitched) filterModifier.passedWords = {};
	if (sectionModifier.type === VERBS) {
		if (sectionModifier.wantedNumberToShow > sectionModifier.totalNumberOfElements) {
			showHeadingError(heading, sectionModifier.totalNumberOfElements, sectionModifier.list);
			return;
		}
		removeHeadingError(heading);
	}
	if (sectionModifier.type === WORDS) filterModifier = filteringWords(sectionModifier, words, filterModifier);

	while (arrayOfRandomNumbers.length < sectionModifier.wantedNumberToShow) {
		arrayOfRandomNumbers = returnArrayOfRandomNumbers(
			sectionModifier,
			filterModifier,
			arrayOfRandomNumbers,
			arrayWithDuplicates
		);
	}
	sectionModifier.randomElements = returnRandomElements(arrayOfRandomNumbers, sectionModifier.type, filterModifier);
	setCardCounter(filterModifier, cardCounter);
	render(sectionModifier.type, sectionModifier.list, sectionModifier.randomElements);
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

const randomise = (type, list, randomElements, sectionSwitched, filterName) => {
	let totalNumberOfElements = type === VERBS ? Object.keys(verbs).length : Object.keys(words).length;
	let wantedNumberToShow = type === VERBS ? +verbsInput.value : 1;
	let sectionModifier = {
		type,
		totalNumberOfElements,
		wantedNumberToShow,
		list,
		randomElements,
		sectionSwitched,
		filterName,
	};
	showRandomisedElements(sectionModifier);
};

export { render, randomise };
