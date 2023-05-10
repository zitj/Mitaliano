import { showList, hideList } from '../utilities/list.js';
import { verbs } from '../../data/verbs.js';
import { words } from '../../data/words.js';
import { addHeadingError, removeHeadingError } from '../utilities/heading.js';

const VERBS = 'verbs';
const WORDS = 'words';
const showTranslationBtnContent = 'Mostra traduzione';

let lastWordNumber;
let objectWithNumbersOfKnownWords = {};

let numberOfCardsPassed = 0;
let numberOfTotalWords = 0;

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

const showRandomisedElements = (
	type,
	totalNumberOfElements,
	wantedNumberToShow,
	list,
	randomElements,
	sectionSwitched
) => {
	let cardCounter = document.querySelector('#word-counter');
	let arrayWithDuplicates = [];
	let arrayOfRandomNumbers = [];

	randomElements = [];

	if (sectionSwitched) objectWithNumbersOfKnownWords = {};

	if (type === VERBS) {
		let heading = document.querySelector('#verbs-heading');
		if (wantedNumberToShow > totalNumberOfElements) {
			addHeadingError(heading, totalNumberOfElements);
			hideList(list);
			return;
		}
		removeHeadingError(heading);
	}

	while (arrayOfRandomNumbers.length < wantedNumberToShow) {
		let randomNumber = Math.floor(Math.random() * totalNumberOfElements);
		if (Object.keys(objectWithNumbersOfKnownWords).length == Object.keys(words).length) {
			objectWithNumbersOfKnownWords = {};
		}
		if (randomNumber !== lastWordNumber && objectWithNumbersOfKnownWords[randomNumber] == undefined) {
			arrayWithDuplicates.push(randomNumber);
		}
		arrayOfRandomNumbers = [...new Set(arrayWithDuplicates)];
	}

	arrayOfRandomNumbers.forEach((number) => {
		if (type === VERBS) randomElements.push(verbs[number].name);
		if (type === WORDS) {
			lastWordNumber = number;
			objectWithNumbersOfKnownWords[number] = { word: words[number].word };
			words[number].id = number;
			randomElements.push(words[number]);
		}
	});
	numberOfCardsPassed = Object.keys(objectWithNumbersOfKnownWords).length;
	numberOfTotalWords = Object.keys(words).length;
	cardCounter.innerHTML = `${numberOfCardsPassed} / ${numberOfTotalWords}`;
	render(type, list, randomElements);
};

const randomise = (type, list, randomElements, sectionSwitched) => {
	const verbsInput = document.querySelector('#wanted-verbs-input');
	let totalNumberOfElements = type === VERBS ? returnObjectLength(verbs) : returnObjectLength(words);
	let wantedNumberToShow = type === VERBS ? +verbsInput.value : 1;
	showRandomisedElements(type, totalNumberOfElements, wantedNumberToShow, list, randomElements, sectionSwitched);
};

// const returnNumberOfCardsPassed = (passedCards, totalCards) => {
// 	return `${passedCards} / ${totalCards}`;
// };

export { returnObjectLength, render, randomise };
