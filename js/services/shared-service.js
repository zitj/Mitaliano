const returnObjectLength = (object) => {
	let counter = 0;
	for (let key in object) {
		counter++;
	}
	return counter;
};

const createContent = (type, element) => {
	const VERBS = 'verbs';
	const WORDS = 'words';

	let content = ``;
	if (type === VERBS) {
		content = `
            <a class="link" href='https://www.italian-verbs.com/italian-verbs/conjugation.php?parola=${element}'  target="_blank">${element}</a>
        `;
	}
	if (type === WORDS) {
		let context = element.context.replace(element.word, `<span class="context-word">${element.word}</span>`);

		content += `
            <div class="card">
                <h2>${element.word}</h2>
                <p class="context">${context}</p>
                <button>Reveal translation</button>
            </div>
        `;
	}

	return content;
};

const returnContent = (randomElements, type) => {
	let content = ``;

	randomElements.forEach((element) => {
		content += createContent(type, element);
	});

	return content;
};

export { returnObjectLength, returnContent };
