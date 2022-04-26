import { verbs } from '../data/verbs.js';

const wantedVerbsInput = document.querySelector('#wanted-verbs-input');
const verbsContainer = document.querySelector('#verbs-container');
const heading = verbsContainer.children[0];
let randomVerbs = [];

const debounce = (fn, delay) => {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn(...args);
		}, delay);
	};
};

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
	randomVerbs = [];

	if (wantedNumberOfVerbs > totalNumberOfVerbs) {
		let errorMessage = `Wanted number of verbs must be smaller than ${totalNumberOfVerbs}`;
		heading.innerHTML = errorMessage;
		return;
	}

	heading.innerHTML = 'Verbs to conjugate:';

	while (arrayOfRandomNumbers.length < wantedNumberOfVerbs) {
		let randomNumber = Math.floor(Math.random() * totalNumberOfVerbs);
		arrayWithDuplicates.push(randomNumber);
		arrayOfRandomNumbers = [...new Set(arrayWithDuplicates)];
	}

	arrayOfRandomNumbers.forEach((number) => {
		randomVerbs.push(verbs[number].name);
	});
	console.log(randomVerbs);
};

const randomiseVerbs = () => {
	let verbsCount = returnVerbsLength();
	let wantedVerbsNumber = +wantedVerbsInput.value;
	showRandomisedVerbs(verbsCount, wantedVerbsNumber);
};

// generateVerbsButton.addEventListener('click', () => {
// 	randomiseVerbs();
// });

wantedVerbsInput.addEventListener(
	'keyup',
	debounce((e) => {
		randomiseVerbs();
	}, 500)
);
