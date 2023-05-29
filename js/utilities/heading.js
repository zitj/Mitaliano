import { errorMessageText, headingText } from '../constants.js';
import { hideList } from './list.js';

const addHeadingError = (heading, totalNumberOfVerbs) => {
	let errorMessage = `${errorMessageText} ${totalNumberOfVerbs}`;
	heading.innerHTML = errorMessage;
	heading.classList.add('error');
};

const removeHeadingError = (heading) => {
	heading.classList.remove('error');
	heading.innerHTML = headingText;
};

const showHeadingError = (heading, totalNumberOfElements, list) => {
	addHeadingError(heading, totalNumberOfElements);
	hideList(list);
};

export { removeHeadingError, showHeadingError };
