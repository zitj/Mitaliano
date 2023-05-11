import { returnArrayOfLectures } from '../services/shared-service.js';

const lectures = returnArrayOfLectures();

const insertFilters = (optionListElement) => {
	lectures.forEach((lecture) => {
		let option = document.createElement('option');
		option.value = lecture;
		option.text = lecture;
		optionListElement.add(option);
	});
};

export { insertFilters };
