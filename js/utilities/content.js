import { TEXT } from '../constants.js';

const createContent = (modifiers, element) => {
	let content = ``;
	let type = modifiers.sectionModifier.type;
	let totalNumberOfElements = Object.keys(modifiers.filterModifier.wordsObj).length;

	if (type === TEXT.VERBS) {
		content = `
            <a class="verb-link" href='https://www.italian-verbs.com/italian-verbs/conjugation.php?parola=${element}'  target="_blank">${element}</a>
        `;
	}
	if (type === TEXT.WORDS) {
		let context = element.context.replace(element.word, `<span class="context-word">${element.word}</span>`);
		let button = `<button id="next-btn">&rarr;</button>`;

		content += `
            <div class="card">
				<img src="./img/filter.png" alt="filter" class="filter-icon">
                <h2>${element.word}</h2>
                <p class="context">${context}</p>
                <button class="translation-button" id=${element.id}>${TEXT.SHOW_TRANSLATION}</button>
				<p class="translation-word hide" >${element.translation}</p>
				${totalNumberOfElements > 1 ? button : ''}
            </div>
        `;
	}

	if (type === TEXT.GAME) {
		if (!modifiers.sectionModifier.arrayShuffled) {
			content += `
			<p class="game-word">${element.word}</p>
			`;
		} else {
			content += `
			<p class="game-word">${element.translation}</p>
			`;
		}
	}

	return content;
};
const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
};

const returnContentForEachElement = (modifiers) => {
	let content = ``;
	modifiers.sectionModifier.randomElements.forEach((element) => {
		content += createContent(modifiers, element);
	});
	return content;
};

const returnContent = (modifiers) => {
	let content = ``;

	if (modifiers.sectionModifier.type !== TEXT.GAME) {
		content = returnContentForEachElement(modifiers);
	}
	if (modifiers.sectionModifier.type === TEXT.GAME) {
		content = `<div class="list-left">${returnContentForEachElement(modifiers)}</div>`;
		shuffleArray(modifiers.sectionModifier.randomElements);
		modifiers.sectionModifier.arrayShuffled = true;
		content += `<div class="list-right">${returnContentForEachElement(modifiers)}</div>`;
	}

	return content;
};

export { returnContent };
