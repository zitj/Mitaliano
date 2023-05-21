import { resetClassListFor } from './list.js';
import { randomise } from '../services/shared-service.js';

const wrapper = document.querySelector('.wrapper');
const textFilter = document.querySelector('#filter-text');

const switchSections = (section, ...elements) => {
	let verbSection = document.querySelector('#verbs-section');
	let wordSection = document.querySelector('#words-section');

	const listOfWords = document.querySelector('#list-of-words');
	let randomWords = [];

	const VERBS = 'verbs-section-link';
	const WORDS = 'words-section-link';
	const DEFAULT_FILTER = 'Senza filtro';

	elements.forEach((element) => {
		resetClassListFor(element);
	});

	section.classList.add('visited');

	if (section.id === WORDS) {
		wrapper.style.height = '76vh';
		verbSection.classList.add('hide');
		wordSection.classList.add('show');
		textFilter.innerHTML = 'Senza filtro';
		randomise('words', listOfWords, randomWords, true, DEFAULT_FILTER);
		let card = document.querySelector('.card');
		card.classList.add('intro');
		card.addEventListener('animationend', (event) => {
			card.classList.remove('intro');
		});
	}
	if (section.id === VERBS) {
		wrapper.style.height = '60vh';
		wordSection.classList.remove('show');
		wordSection.classList.add('hide');
	}
};

export { switchSections };
