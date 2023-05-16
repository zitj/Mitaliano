import { returnArrayOfLectures } from '../services/shared-service.js';

const lectures = returnArrayOfLectures();

const insertFilters = (filter, textFilter) => {
	// lectures.forEach((lecture) => {
	// 	let option = document.createElement('option');
	// 	option.value = lecture;
	// 	option.text = lecture;
	// 	optionListElement.add(option);
	// });
	textFilter.innerText = lectures[0];
};

export { insertFilters };
