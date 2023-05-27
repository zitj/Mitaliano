import { showList, hideList } from '../utilities/list.js';
import { verbs } from '../../data/verbs.js';
import { words } from '../../data/words.js';
import { addHeadingError, removeHeadingError } from '../utilities/heading.js';
import { WORDS, VERBS, showTranslationBtnContent, DEFAULT_FILTER } from '../constants.js';
import { heading, cardCounter, verbsInput } from '../elements/shared.js';
import { filteringWords } from '../utilities/filters.js';

let lastWordNumber;
let previousFilter = '';
let filterModifier = {
	previousFilter: '',
	passedWords: {},
	wordsArray: [],
	wordsObj: {},
};

const returnObjectLength = (object) => {
	let counter = 0;
	for (let key in object) {
		counter++;
	}
	return counter;
};

const createContent = (type, element) => {
	let content = ``;
	if (type === VERBS) {
		content = `
            <a class="verb-link" href='https://www.italian-verbs.com/italian-verbs/conjugation.php?parola=${element}'  target="_blank">${element}</a>
        `;
	}
	if (type === WORDS) {
		let context = element.context.replace(element.word, `<span class="context-word">${element.word}</span>`);

		content += `
            <div class="card">
                <h2>${element.word}</h2>
                <p class="context">${context}</p>
                <button class="translation-button" id=${element.id}>${showTranslationBtnContent}</button>
				<p class="translation-word hide" >${element.translation}</p>
				<button id="next-btn">&rarr;</button>
            </div>
        `;
	}

	return content;
};

const returnContent = (randomElements, type) => {
	let content = ``;

	randomElements.forEach((element) => {
		content += createContent(type, element);
	});

	return content;
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

const setCardCounter = (passedCards, totalCards, cardCounter) => {
	cardCounter.innerHTML = `${passedCards} / ${totalCards}`;
};

const showHeadingError = (heading, totalNumberOfElements, list) => {
	addHeadingError(heading, totalNumberOfElements);
	hideList(list);
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

	if (sectionModifier.type === WORDS) {
		filterModifier = filteringWords(sectionModifier, words, filterModifier);
	}

	while (arrayOfRandomNumbers.length < sectionModifier.wantedNumberToShow) {
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
	}
	sectionModifier.randomElements = returnRandomElements(arrayOfRandomNumbers, sectionModifier.type, filterModifier);
	setCardCounter(
		Object.keys(filterModifier.passedWords).length,
		Object.keys(filterModifier.wordsObj).length,
		cardCounter
	);
	render(sectionModifier.type, sectionModifier.list, sectionModifier.randomElements);
};

const randomise = (type, list, randomElements, sectionSwitched, filterName) => {
	let totalNumberOfElements = type === VERBS ? returnObjectLength(verbs) : returnObjectLength(words);
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

export { returnObjectLength, render, randomise };
