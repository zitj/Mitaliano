import { showList, hideList } from '../utilities/list.js';
import { verbs } from '../../data/verbs.js';
import { words } from '../../data/words.js';
import { addHeadingError, removeHeadingError } from '../utilities/heading.js';
import { WORDS, VERBS, showTranslationBtnContent, DEFAULT_FILTER } from '../constants.js';
import { heading, cardCounter, verbsInput } from '../elements/shared.js';
// import { filterModifier, filteringWords } from '../utilities/filters.js';

let lastWordNumber;
let previousFilter = '';
// let filterModifier = {
// 	previousFilter: '',
// 	passedWords: {},
// 	wordsArray: [],
// 	wordsObj: {},
// };
let passedWords = {};
let filteredWordsArray = [];
let filteredWordsObj = {};

const returnArrayOfLectures = () => {
	let arrayOfLectures = [DEFAULT_FILTER];
	for (let number in words) {
		arrayOfLectures.push(words[number].source);
	}
	arrayOfLectures = [...new Set(arrayOfLectures)];
	return arrayOfLectures;
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
			source[number].id = number;
			passedWords[number] = source[number];
			randomElements.push(source[number]);
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

const showRandomisedElements = (modifier) => {
	let arrayWithDuplicates = [];
	let arrayOfRandomNumbers = [];

	modifier.randomElements = [];

	if (modifier.sectionSwitched) passedWords = {};
	if (modifier.type === VERBS) {
		if (modifier.wantedNumberToShow > modifier.totalNumberOfElements) {
			showHeadingError(heading, modifier.totalNumberOfElements, modifier.list);
			return;
		}
		removeHeadingError(heading);
	}

	if (modifier.type === WORDS) {
		// filterModifier = filteringWords(modifier, words);

		if (modifier.filterName !== previousFilter) {
			passedWords = {};
			if (modifier.filterName !== DEFAULT_FILTER) {
				filteredWordsArray = [];
				filteredWordsObj = {};
				for (let wordNum in words) {
					let word = words[wordNum];
					if (word.source === modifier.filterName) filteredWordsArray.push(word);
				}
				for (let i = 0; i < filteredWordsArray.length; i++) {
					filteredWordsObj[i] = filteredWordsArray[i];
				}
				modifier.totalNumberOfElements = filteredWordsArray.length;
			} else {
				filteredWordsObj = words;
			}
			previousFilter = modifier.filterName;
		}
	}

	while (arrayOfRandomNumbers.length < modifier.wantedNumberToShow) {
		let totalNumberOfElements =
			modifier.type === WORDS ? Object.keys(filteredWordsObj).length : modifier.totalNumberOfElements;
		let randomNumber = Math.floor(Math.random() * totalNumberOfElements);
		if (Object.keys(passedWords).length == Object.keys(filteredWordsObj).length) {
			passedWords = {};
		}
		if (randomNumber !== lastWordNumber && passedWords[randomNumber] == undefined) {
			arrayWithDuplicates.push(randomNumber);
		}
		arrayOfRandomNumbers = [...new Set(arrayWithDuplicates)];
	}
	modifier.randomElements = returnRandomElements(arrayOfRandomNumbers, modifier.type, filteredWordsObj);
	setCardCounter(Object.keys(passedWords).length, Object.keys(filteredWordsObj).length, cardCounter);
	render(modifier.type, modifier.list, modifier.randomElements);
};

const randomise = (type, list, randomElements, sectionSwitched, filterName) => {
	let totalNumberOfElements = type === VERBS ? returnObjectLength(verbs) : returnObjectLength(words);
	let wantedNumberToShow = type === VERBS ? +verbsInput.value : 1;
	let modifier = {
		type,
		totalNumberOfElements,
		wantedNumberToShow,
		list,
		randomElements,
		sectionSwitched,
		filterName,
	};
	showRandomisedElements(modifier);
	returnArrayOfLectures(words);
};

export { returnObjectLength, render, randomise, returnArrayOfLectures };
