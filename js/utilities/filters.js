import { randomise } from '../services/shared-service.js';
import { DEFAULT_FILTER } from '../constants.js';
import { textFilter } from './html_elements.js';
import { words } from '../../data/words.js';

let isFilterClicked = false;
let filterName = DEFAULT_FILTER;

const returnArrayOfLectures = () => {
	let arrayOfLectures = [DEFAULT_FILTER];
	for (let number in words) {
		arrayOfLectures.push(words[number].source);
	}
	arrayOfLectures = [...new Set(arrayOfLectures)];
	returnArrayOfDates();
	return arrayOfLectures;
};

const returnArrayOfDates = () => {
	let dates = [];
	for (let number in words) {
		dates.push(words[number].date.getTime());
	}
	dates = [...new Set(dates)];
	console.log(dates);
	// return dates;
};

const lectures = returnArrayOfLectures();

const setDefaultFilter = () => {
	filterName = DEFAULT_FILTER;
	textFilter.innerText = filterName;
};

const insertFilters = (filter, textFilter) => {
	lectures.forEach((lecture) => {
		let option = document.createElement('div');
		option.classList.add('filter-option');
		option.innerText = lecture;
		filter.appendChild(option);
	});
	textFilter.innerText = lectures[0];
};

const toggleFilter = (elementClicked, elementIDsOfFilter, filterOptions) => {
	if (elementIDsOfFilter[elementClicked.id]) {
		isFilterClicked = !isFilterClicked;
		if (isFilterClicked) {
			filterOptions.classList.remove('hide');
		} else {
			filterOptions.classList.add('hide');
		}
	} else {
		isFilterClicked = false;
		filterOptions.classList.add('hide');
	}
};
const chooseFilter = (elementClicked, filterOptions, textFilter, listOfWords, randomWords) => {
	isFilterClicked = false;
	filterOptions.classList.add('hide');
	filterName = elementClicked.innerText;
	textFilter.innerText = filterName;
	randomise('words', listOfWords, randomWords, false, filterName);
};

const filteringWords = (sectionModifier, words, filterModifier) => {
	if (sectionModifier.filterName !== filterModifier.previousFilter) {
		filterModifier.passedWords = {};
		if (sectionModifier.filterName !== DEFAULT_FILTER) {
			filterModifier.wordsArray = [];
			filterModifier.wordsObj = {};
			for (let wordNum in words) {
				let word = words[wordNum];
				if (word.source === sectionModifier.filterName) filterModifier.wordsArray.push(word);
			}
			for (let i = 0; i < filterModifier.wordsArray.length; i++) {
				filterModifier.wordsObj[i] = filterModifier.wordsArray[i];
			}
			sectionModifier.totalNumberOfElements = filterModifier.wordsArray.length;
		} else {
			filterModifier.wordsObj = words;
		}
		filterModifier.previousFilter = sectionModifier.filterName;
	}
	return filterModifier;
};

export { insertFilters, toggleFilter, chooseFilter, setDefaultFilter, filteringWords, isFilterClicked, filterName };
