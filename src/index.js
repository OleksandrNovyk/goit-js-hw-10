import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchEl = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

const cleanMarkup = ref => (ref.innerHTML = '');

const inputHandler = evt => {
const textInput = evt.target.value.trim();

if (!textInput) {
    cleanMarkup(countryList);
    cleanMarkup(countryInfo);
    return;
}

fetchCountries(textInput)
    .then(data => {
    console.log(data);
    if (data.length > 10) {
        Notify.info(
        'Too many matches found. Please enter a more specific name'
        );
        return;
    }
    renderMarkup(data);
    })
    .catch(err => {
    cleanMarkup(countryList);
    cleanMarkup(countryInfo);
    Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = data => {
if (data.length === 1) {
    cleanMarkup(countryList);
    const markupInfo = createInfoMarkup(data);
    countryInfo.innerHTML = markupInfo;
} else {
    cleanMarkup(countryInfo);
    const markupList = createListMarkup(data);
    countryList.innerHTML = markupList;
}
};

const createListMarkup = data => {
return data
    .map(
({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="50" height="30">${name.official}</li>`)
    .join('');
};

const createInfoMarkup = data => {
return data.map(
    ({ name, capital, population, flags, languages }) =>
`<img src="${flags.png}" alt="${name.official}" width="480" height="300">
<h1>${name.official}</h1>
<p>Capital: ${capital}</p>
<p>Population: ${population}</p>
<p>Languages: ${Object.values(languages)}</p>`
);
};

searchEl.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
