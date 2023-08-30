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
		content += `
				<h4 class="game-word">${element.word}</h4>
		`;
	}

	return content;
};
const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
};

const returnContentForEachElement = (content, modifiers) => {
	modifiers.sectionModifier.randomElements.forEach((element) => {
		content += createContent(modifiers, element);
	});
	return content;
};

const returnContent = (modifiers) => {
	let content = ``;

	if (modifiers.sectionModifier.type !== TEXT.GAME) {
		content = returnContentForEachElement(content, modifiers);
	}
	if (modifiers.sectionModifier.type === TEXT.GAME) {
		let listLeftContent = ``;
		listLeftContent = returnContentForEachElement(listLeftContent, modifiers);

		let listRightContent = ``;
		shuffleArray(modifiers.sectionModifier.randomElements);
		listRightContent = returnContentForEachElement(listRightContent, modifiers);
		content = `
		<div class="list-left">${listLeftContent}</div>
		<div class="list-right">${listRightContent}</div>
	`;
	}

	return content;
};

export { returnContent };
