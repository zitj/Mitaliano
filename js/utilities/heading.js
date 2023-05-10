const errorMessageText = 'Il numero deve essere meno di';
const headingText = 'Verbi da coniugare';

export const addHeadingError = (heading, totalNumberOfVerbs) => {
	let errorMessage = `${errorMessageText} ${totalNumberOfVerbs}`;
	heading.innerHTML = errorMessage;
	heading.classList.add('error');
};

export const removeHeadingError = (heading) => {
	heading.classList.remove('error');
	heading.innerHTML = headingText;
};
