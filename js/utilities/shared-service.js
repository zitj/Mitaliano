const returnObjectLength = (object) => {
	let counter = 0;
	for (let key in object) {
		counter++;
	}
	return counter;
};

const returnContent = (randomElements, type) => {
	const WORDS = 'words';
	const VERBS = 'verbs';

	let content = ``;

	if (type === VERBS) {
		randomElements.forEach((element) => {
			content += `<a class="link" href='https://www.italian-verbs.com/italian-verbs/conjugation.php?parola=${element}'  target="_blank">${element}</a>`;
		});
	}

	if (type === WORDS) {
		randomElements.forEach((element) => {
			let context = element.context.replace(element.word, `<span class="context-word">${element.word}</span>`);

			content += `
         <div class="card">
            <h2>${element.word}</h2>
            <p class="context">${context}</p>
            <div class="translation">${element.translation}</div>
        </div>`;
		});
	}

	return content;
};

export { returnObjectLength, returnContent };
