import { showList, hideList } from './list.js';
import { verbs } from '../../data/verbs.js';
import { removeHeadingError, addHeadingError } from './heading.js';

const returnVerbsLength = (verbsArray) => {
	let counter = 0;
	for (let verb in verbsArray) {
		counter++;
	}
	return counter;
};

const returnListWithContent = (randomVerbs) => {
	let content = ``;

	randomVerbs.forEach((verb) => {
		content += `<a class="link" href='https://www.italian-verbs.com/italian-verbs/conjugation.php?parola=${verb}'  target="_blank">${verb}</a>`;
	});

	return content;
};

const renderVerbs = (listOfVerbs, randomVerbs) => {
	let content = returnListWithContent(randomVerbs);
	showList(listOfVerbs, content);
};

const showRandomisedVerbs = (totalNumberOfVerbs, wantedNumberOfVerbs, listOfVerbs, heading, randomVerbs) => {
	let arrayWithDuplicates = [];
	let arrayOfRandomNumbers = [];
	randomVerbs = [];

	if (wantedNumberOfVerbs > totalNumberOfVerbs) {
		addHeadingError(heading, totalNumberOfVerbs);
		hideList(listOfVerbs);
		return;
	}

	removeHeadingError(heading);

	while (arrayOfRandomNumbers.length < wantedNumberOfVerbs) {
		let randomNumber = Math.floor(Math.random() * totalNumberOfVerbs);
		arrayWithDuplicates.push(randomNumber);
		arrayOfRandomNumbers = [...new Set(arrayWithDuplicates)];
	}

	arrayOfRandomNumbers.forEach((number) => {
		randomVerbs.push(verbs[number].name);
	});
	renderVerbs(listOfVerbs, randomVerbs);
};

const randomiseVerbs = (listOfVerbs, heading, randomVerbs, wantedVerbsInput) => {
	let verbsCount = returnVerbsLength(verbs);
	let wantedVerbsNumber = +wantedVerbsInput.value;
	showRandomisedVerbs(verbsCount, wantedVerbsNumber, listOfVerbs, heading, randomVerbs);
};

export { randomiseVerbs };
