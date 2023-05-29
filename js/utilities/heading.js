import { errorMessageText, headingText } from '../constants.js';

export const addHeadingError = (heading, totalNumberOfVerbs) => {
	let errorMessage = `${errorMessageText} ${totalNumberOfVerbs}`;
	heading.innerHTML = errorMessage;
	heading.classList.add('error');
};

export const removeHeadingError = (heading) => {
	heading.classList.remove('error');
	heading.innerHTML = headingText;
};
