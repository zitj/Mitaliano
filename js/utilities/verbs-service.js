import { showList, hideList } from './list.js';
import { verbs } from '../../data/verbs.js';
import { removeHeadingError, addHeadingError } from './heading.js';
import { returnObjectLength, returnContent } from './shared-service.js';

const renderVerbs = (listOfVerbs, randomVerbs) => {
	let content = returnContent(randomVerbs, 'verbs');
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
	let verbsCount = returnObjectLength(verbs);
	let wantedVerbsNumber = +wantedVerbsInput.value;
	showRandomisedVerbs(verbsCount, wantedVerbsNumber, listOfVerbs, heading, randomVerbs);
};

export { randomiseVerbs };
