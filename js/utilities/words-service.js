import { returnContent, returnObjectLength } from './shared-service.js';
import { showList } from './list.js';
import { words } from '../../data/words.js';

const renderWords = (listOfWords, randomWords) => {
	let content = returnContent(randomWords, 'words');
	showList(listOfWords, content);
};

const showRandomisedWords = (totalNumberOfWords, listOfWords, randomWords) => {
	let arrayWithDuplicates = [];
	let arrayOfRandomNumbers = [];
	randomWords = [];

	while (arrayOfRandomNumbers.length < 5) {
		let randomNumber = Math.floor(Math.random() * totalNumberOfWords);
		arrayWithDuplicates.push(randomNumber);
		arrayOfRandomNumbers = [...new Set(arrayWithDuplicates)];
	}

	arrayOfRandomNumbers.forEach((number) => {
		randomWords.push(words[number]);
	});
	renderWords(listOfWords, randomWords);
};

const randomiseWords = (listOfWords, randomWords) => {
	let wordsCount = returnObjectLength(words);
	showRandomisedWords(wordsCount, listOfWords, randomWords);
};

export { randomiseWords };
