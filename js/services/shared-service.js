import { showList, hideList } from '../utilities/list.js';
import { verbs } from '../../data/verbs.js';
import { words } from '../../data/words.js';
import { addHeadingError, removeHeadingError } from '../utilities/heading.js';

const VERBS = 'verbs';
const WORDS = 'words';

let lastWordNumber;

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
            <div class="card" >
                <h2>${element.word}</h2>
                <p class="context">${context}</p>
                <button class="translation-button">Show translation</button>
				<p class="translation-word hide">${element.translation}</p>
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

const showRandomisedElements = (type, totalNumberOfElements, wantedNumberToShow, list, randomElements) => {
	let arrayWithDuplicates = [];
	let arrayOfRandomNumbers = [];

	randomElements = [];

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
		if (randomNumber !== lastWordNumber) arrayWithDuplicates.push(randomNumber);

		arrayOfRandomNumbers = [...new Set(arrayWithDuplicates)];
	}

	arrayOfRandomNumbers.forEach((number) => {
		if (type === VERBS) randomElements.push(verbs[number].name);
		if (type === WORDS) {
			lastWordNumber = number;
			randomElements.push(words[number]);
		}
	});
	render(type, list, randomElements);
};

const randomise = (type, list, randomElements) => {
	const verbsInput = document.querySelector('#wanted-verbs-input');
	let totalNumberOfElements = type === VERBS ? returnObjectLength(verbs) : returnObjectLength(words);
	let wantedNumberToShow = type === VERBS ? +verbsInput.value : 1;
	showRandomisedElements(type, totalNumberOfElements, wantedNumberToShow, list, randomElements);
};

export { returnObjectLength, render, randomise };
