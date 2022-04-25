import { verbs } from '../data/verbs.js';

const generateVerbsButton = document.querySelector('#generate-verbs-button');
const wantedVerbsInput = document.querySelector('#wanted-verbs-input');

const returnVerbsLength = () => {
	let counter = 0;
	for (let verb in verbs) {
		counter++;
	}
	return counter;
};

const showRandomisedVerbs = (totalNumberOfVerbs, wantedNumberOfVerbs) => {
	let arrayWithDuplicates = [];
	let arrayOfRandomNumbers = [];
	let verbsPerWeek = wantedNumberOfVerbs * 7;

	if (wantedNumberOfVerbs > totalNumberOfVerbs) {
		let errorMessage = 'Wanted number of verbs must be smaller than total number of verbs!';
		console.error(errorMessage);
		return;
	}

	while (arrayOfRandomNumbers.length < wantedNumberOfVerbs) {
		let randomNumber = Math.floor(Math.random() * totalNumberOfVerbs);
		arrayWithDuplicates.push(randomNumber);
		arrayOfRandomNumbers = [...new Set(arrayWithDuplicates)];
	}
	arrayOfRandomNumbers.forEach((number) => {
		console.log(verbs[number].name);
	});
};

const randomiseVerbs = () => {
	let verbsCount = returnVerbsLength();
	let wantedVerbsNumber = +wantedVerbsInput.value;
	showRandomisedVerbs(verbsCount, wantedVerbsNumber);
};

generateVerbsButton.addEventListener('click', () => {
	randomiseVerbs();
});
