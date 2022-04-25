import { verbs } from '../data/verbs.js';

console.log(verbs);
const generateVerbsButton = document.querySelector('#generate-verbs-button');

const returnVerbsLength = () => {
	let counter = 0;
	for (let verb in verbs) {
		counter++;
	}
	return counter;
};

const randomiseVerbs = (number) => {
	let arrayWithDuplicates = [];
	let arrayOfRandomNumbers = [];

	while (arrayOfRandomNumbers.length < 7) {
		let randomNumber = Math.floor(Math.random() * number);
		arrayWithDuplicates.push(randomNumber);
		arrayOfRandomNumbers = [...new Set(arrayWithDuplicates)];
	}
	arrayOfRandomNumbers.forEach((number) => {
		console.log(verbs[number].name);
	});
};

generateVerbsButton.addEventListener('click', () => {
	let verbsCount = returnVerbsLength();
	randomiseVerbs(verbsCount);
});
