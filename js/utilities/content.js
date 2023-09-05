import { TEXT } from '../constants.js';

const returnContentForVerbsSection = (modifiers) => {
	let word = modifiers.contentObj.element;
	return `
	<a class="verb-link" href='https://www.italian-verbs.com/italian-verbs/conjugation.php?parola=${word}'  target="_blank">${word}</a>
`;
};

const returnContentForWordSection = (modifiers) => {
	let element = modifiers.contentObj.element;
	let context = element.context.replace(element.word, `<span class="context-word">${element.word}</span>`);
	let button = `<button id="next-btn">&rarr;</button>`;
	return `
		<div class="card">
			<img src="./img/filter.png" alt="filter" class="filter-icon">
			<h2>${element.word}</h2>
			<p class="context">${context}</p>
			<button class="translation-button" id=${element.id}>${TEXT.SHOW_TRANSLATION}</button>
			<p class="translation-word hide" >${element.translation}</p>
			${modifiers.contentObj.totalNumberOfElements > 1 ? button : ''}
		</div>
	`;
};

const returnContentForGameWord = (word) => {
	let splittedClass = '';
	if (word.length > 12) splittedClass = 'splitted';
	return `
			<div class="game-word ${splittedClass}">${splitString(word)}</div>
			`;
};

const returnContentForGameSection = (modifiers) => {
	let element = modifiers.contentObj.element;
	let content = modifiers.contentObj.content;
	if (!modifiers.sectionModifier.arrayShuffled) {
		content += returnContentForGameWord(element.word);
	} else {
		let translatedWord = element.translation;
		let synonyms = translatedWord.split(',');
		if (synonyms.length > 1) {
			const randomIndex = Math.floor(Math.random() * synonyms.length);
			translatedWord = synonyms[randomIndex];
		}
		content += returnContentForGameWord(translatedWord);
	}
	return content;
};

const createContent = (modifiers) => {
	let content = ``;
	let type = modifiers.sectionModifier.type;
	let totalNumberOfElements = Object.keys(modifiers.filterModifier.wordsObj).length;
	modifiers.contentObj.totalNumberOfElements = totalNumberOfElements;
	modifiers.contentObj.content = content;

	if (type === TEXT.VERBS) content = returnContentForVerbsSection(modifiers);
	if (type === TEXT.WORDS) content += returnContentForWordSection(modifiers);
	if (type === TEXT.GAME) content = returnContentForGameSection(modifiers);

	return content;
};

const splitString = (word) => {
	if (!word.includes(' ') && word.length > 12) {
		let wordArray = word.split('');
		wordArray.splice(word.length / 2, 0, '-\n');
		return wordArray.join('');
	} else {
		return word;
	}
};

const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
};

const returnContentForEachElement = (modifiers) => {
	let content = ``;
	modifiers.contentObj = { element: '', content };
	modifiers.sectionModifier.randomElements.forEach((element) => {
		modifiers.contentObj.element = element;
		content += createContent(modifiers);
	});
	return content;
};

const returnContent = (modifiers) => {
	let content = ``;

	if (modifiers.sectionModifier.type !== TEXT.GAME) {
		content = returnContentForEachElement(modifiers);
	}
	if (modifiers.sectionModifier.type === TEXT.GAME) {
		modifiers.sectionModifier.arrayShuffled = false;
		content = `<div class="list-left">${returnContentForEachElement(modifiers)}</div>`;
		shuffleArray(modifiers.sectionModifier.randomElements);
		modifiers.sectionModifier.arrayShuffled = true;
		content += `<div class="list-right">${returnContentForEachElement(modifiers)}</div>`;
	}

	return content;
};

export { returnContent };
