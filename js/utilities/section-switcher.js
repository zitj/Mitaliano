import { resetClassListFor } from './list.js';

const switchingSections = (section, ...elements) => {
	let verbSection = document.querySelector('#verbs-section');
	let wordSection = document.querySelector('#words-section');

	const VERBS = 'verbs-section-link';
	const WORDS = 'words-section-link';

	elements.forEach((element) => {
		resetClassListFor(element);
	});

	section.classList.add('visited');

	if (section.id === WORDS) {
		verbSection.classList.add('hide');
	}
	if (section.id === VERBS) {
		wordSection.classList.add('hide');
	}
};

export { switchingSections };
