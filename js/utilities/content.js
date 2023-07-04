import { VERBS, WORDS, showTranslationBtnContent } from '../constants.js';

const createContent = (modifiers, element) => {
	let content = ``;
	let type = modifiers.sectionModifier.type;
	let totalNumberOfElements = modifiers.sectionModifier.totalNumberOfElements;

	if (type === VERBS) {
		content = `
            <a class="verb-link" href='https://www.italian-verbs.com/italian-verbs/conjugation.php?parola=${element}'  target="_blank">${element}</a>
        `;
	}
	if (type === WORDS) {
		let context = element.context.replace(element.word, `<span class="context-word">${element.word}</span>`);
		let button = `<button id="next-btn">&rarr;</button>`;

		content += `
            <div class="card">
				<img src="./img/filter.png" alt="filter" class="filter-icon">
                <h2>${element.word}</h2>
                <p class="context">${context}</p>
                <button class="translation-button" id=${element.id}>${showTranslationBtnContent}</button>
				<p class="translation-word hide" >${element.translation}</p>
				${totalNumberOfElements > 1 ? button : ''}
            </div>
        `;
	}

	return content;
};

const returnContent = (modifiers) => {
	let content = ``;
	modifiers.sectionModifier.randomElements.forEach((element) => {
		content += createContent(modifiers, element);
	});

	return content;
};

export { returnContent };
