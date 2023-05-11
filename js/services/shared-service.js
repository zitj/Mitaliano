import { showList, hideList } from '../utilities/list.js';
import { verbs } from '../../data/verbs.js';
import { words } from '../../data/words.js';
import { addHeadingError, removeHeadingError } from '../utilities/heading.js';

const VERBS = 'verbs';
const WORDS = 'words';

const showTranslationBtnContent = 'Mostra traduzione';

const cardCounter = document.querySelector('#word-counter');
const heading = document.querySelector('#verbs-heading');

let lastWordNumber;
let passedWords = {};

const returnArrayOfLectures = () => {
	let arrayOfLectures = [];
	for (let number in words) {
		arrayOfLectures.push(words[number].source);
	}
	arrayOfLectures = [...new Set(arrayOfLectures)];
	console.log(arrayOfLectures);
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

const returnRandomElements = (arrayOfRandomNumbers, type) => {
	let randomElements = [];
	arrayOfRandomNumbers.forEach((number) => {
		if (type === VERBS) randomElements.push(verbs[number].name);
		if (type === WORDS) {
			lastWordNumber = number;
			words[number].id = number;
			passedWords[number] = words[number];
			randomElements.push(words[number]);
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
	while (arrayOfRandomNumbers.length < modifier.wantedNumberToShow) {
		let randomNumber = Math.floor(Math.random() * modifier.totalNumberOfElements);
		if (Object.keys(passedWords).length == Object.keys(words).length) {
			passedWords = {};
		}
		if (randomNumber !== lastWordNumber && passedWords[randomNumber] == undefined) {
			arrayWithDuplicates.push(randomNumber);
		}
		arrayOfRandomNumbers = [...new Set(arrayWithDuplicates)];
	}
	modifier.randomElements = returnRandomElements(arrayOfRandomNumbers, modifier.type);
	setCardCounter(Object.keys(passedWords).length, Object.keys(words).length, cardCounter);
	render(modifier.type, modifier.list, modifier.randomElements);
};

const test = (obj) => {
	console.log(obj);
};

const randomise = (type, list, randomElements, sectionSwitched) => {
	const verbsInput = document.querySelector('#wanted-verbs-input');
	let totalNumberOfElements = type === VERBS ? returnObjectLength(verbs) : returnObjectLength(words);
	let wantedNumberToShow = type === VERBS ? +verbsInput.value : 1;
	let modifier = {
		type,
		totalNumberOfElements,
		wantedNumberToShow,
		list,
		randomElements,
		sectionSwitched,
	};
	showRandomisedElements(modifier);
	returnArrayOfLectures(words);
};

export { returnObjectLength, render, randomise, returnArrayOfLectures };
