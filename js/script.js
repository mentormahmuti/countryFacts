'use strict';

const global = {
  currentPage: window.location.pathname,
};

// Display all countries function
async function displayAllCountries() {
  showSpinner();
  try {
    const results = await fetchAPIData('all');

    results.forEach((country) => {
      const div = document.createElement('div');
      div.classList.add('country-card');

      div.innerHTML = `
   <a href="/country-details.html">
     <img data-country="${country.name.common}" class="country-flag" src="${country.flags.svg}" alt="Country Flag" /></a>
     <h2 class="country-name">${country.name.common}</h2>
     <p>
       <strong>Language:</strong> ${country.languages ? Object.values(country.languages).slice(0, 2).join(', ') : []}
     </p>
     <p>
       <strong>Capital:</strong> ${country.capital}
     </p>
     <p>
       <strong>Population:</strong> ${addCommas(country.population)}
     </p> 
  `;
      document.querySelector('#country-list').appendChild(div);
    });
  } catch {
    setTimeout(displayAllCountries, 500);
  } finally {
    hideSpinner();
  }

  handleFlagClick(); // We call this function here so we can figure what flag the user clicks so we can display it on country-details.html
}

function handleFlagClick() {
  const allFlags = document.querySelectorAll('.country-flag');

  allFlags.forEach((flag) => {
    flag.addEventListener('click', (event) => {
      event.preventDefault();
      const countryName = event.target.dataset.country;
      const newUrl = `/country-details.html?country=${encodeURIComponent(countryName)}`;
      window.location.href = newUrl;
    });
  });
}

// Display specific country details
async function displayCountryDetails() {
  showSpinner();

  const country = new URLSearchParams(window.location.search)
    .get('country')
    .toLowerCase();

  try {
    const result = await fetchAPIData(`name/${country}`);

    const div = document.createElement('div');
    div.classList.add('country-info');

    div.innerHTML = `

            <div id="country-info">
          <img
            src="${result[0].flags.svg}"
            alt="Country Flag"
            id="country-flag"
          />
          <div id="country-details">
            <h2 id="country-name">${result[0].name.common}</h2>
            <p id="country-capital"><strong>Capital:</strong> ${result[0].capital}</p>
              <p>
         <strong>${Object.keys(result[0].languages).length > 1 ? 'Languages:' : 'Language:'}</strong>
   ${result[0].languages ? Object.values(result[0].languages).join(', ') : []}</p>
            <p id="country-population">
              <strong>Population:</strong> ${addCommas(result[0].population)}
            </p>
            <p id="country-continent">
              <strong>${result[0].continents.length > 1 ? 'Continents:' : 'Continent:'}</strong> ${result[0].continents.join(', ')}
            </p>
            <p id="country-landlocked"><strong>Landlocked:</strong>${result[0].landlocked ? 'Yes' : 'No'}</p>
             <p id="country-population"><strong>Borders:</strong>${result[0].borders && result[0].borders.length > 1 ? result[0].borders.join(', ') : result[0].borders || 'None'}</p>
       <p id="country-capital"><strong>Currency:</strong> ${Object.values(result[0].currencies)[0].name}</p>
       <p id="country-capital"><strong>Area:</strong> ${addCommas(result[0].area)} km²</p>
       <p id="country-capital"><strong>Subregion:</strong> ${result[0].subregion}</p>
          </div>
          <img
            src="${result[0].coatOfArms.svg}"
            alt="Coat of Arms"
            id="coat-of-arms"
          />
        </div>
       `;
    document.querySelector('#country-content').appendChild(div);
  } catch (error) {
    setTimeout(displayCountryDetails, 500);
  } finally {
    hideSpinner();
  }
}

// Display random country
async function displayRandomCountry() {
  showSpinner();

  try {
    const results = await fetchAPIData('all');
    const randomCountry = results[Math.floor(Math.random() * results.length)];

    const div = document.createElement('div');
    div.classList.add('country-info');

    div.innerHTML = `

          <div id="country-info">
        <img
          src="${randomCountry.flags.svg}"
          alt="Country Flag"
          id="country-flag"
        />
        <div id="country-details">
          <h2 id="country-name">${randomCountry.name.common}</h2>
          <p id="country-capital"><strong>Capital:</strong> ${randomCountry.capital}</p>
            <p>
       <strong>${Object.keys(randomCountry.languages).length > 1 ? 'Languages:' : 'Language:'}</strong>
 ${randomCountry.languages ? Object.values(randomCountry.languages).join(', ') : []}</p>
          <p id="country-population">
            <strong>Population:</strong> ${addCommas(randomCountry.population)}
          </p>
          <p id="country-continent">
            <strong>${randomCountry.continents.length > 1 ? 'Continents:' : 'Continent:'}</strong> ${randomCountry.continents.join(', ')}
          </p>
          <p id="country-landlocked"><strong>Landlocked:</strong>${randomCountry.landlocked ? 'Yes' : 'No'}</p>
           <p id="country-population"><strong>Borders:</strong>${randomCountry.borders && randomCountry.borders.length > 1 ? randomCountry.borders.join(', ') : randomCountry.borders || 'None'}</p>
     <p id="country-capital"><strong>Currency:</strong> ${Object.values(randomCountry.currencies)[0].name}</p>
     <p id="country-capital"><strong>Area:</strong> ${addCommas(randomCountry.area)} km²</p>
     <p id="country-capital"><strong>Subregion:</strong> ${randomCountry.subregion}</p>
        </div>
        <img
          src="${randomCountry.coatOfArms.svg}"
          alt="Coat of Arms"
          id="coat-of-arms"
        />
      </div>
     `;
    document.querySelector('#country-content').appendChild(div);
  } catch (error) {
    setTimeout(displayRandomCountry, 500);
  } finally {
    hideSpinner();
  }
}

let listOfAllCountries = [];

// Functionalize SEARCH
async function filterCountries() {
  const results = await fetchAPIData('all');
  // listOfAllCountries is an array of the 250 countries in the API we are using
  const listOfAllCountries = results.map((country) => country.name.common);

  const searchInput = document.querySelector('.search-input');

  searchInput.addEventListener('input', function (event) {
    const query = event.target.value.toLowerCase();

    const partialMatches = listOfAllCountries.filter((country) =>
      country.toLowerCase().includes(query)
    );

    manipulateModalVisibility('none');

    const modalDiv = document.querySelector('.modal-content');
    while (modalDiv.firstChild) {
      modalDiv.removeChild(modalDiv.firstChild);
    }

    partialMatches.forEach((match) => {
      const link = document.createElement('a');
      link.classList.add('dropdown-item');
      link.href = `search.html?country=${match}`;
      link.innerHTML = `${match}`;

      modalDiv.appendChild(link);

      if (query.length > 0) {
        manipulateModalVisibility('block');
      }
      if (query.length < 1) {
        manipulateModalVisibility('none');
      }
    });
  });
}

//Show the country that was searched by user!
async function showSearchedCountry() {
  const urlParams = new URLSearchParams(window.location.search);
  const countryName = urlParams.get('country');

  const result = await fetchAPIData(`name/${countryName}`);

  const div = document.createElement('div');
  div.classList.add('country-info');

  div.innerHTML = `

            <div id="country-info">
          <img
            src="${result[0].flags.svg}"
            alt="Country Flag"
            id="country-flag"
          />
          <div id="country-details">
            <h2 id="country-name">${result[0].name.common}</h2>
            <p id="country-capital"><strong>Capital:</strong> ${result[0].capital}</p>
              <p>
         <strong>${Object.keys(result[0].languages).length > 1 ? 'Languages:' : 'Language:'}</strong>
   ${result[0].languages ? Object.values(result[0].languages).join(', ') : []}</p>
            <p id="country-population">
              <strong>Population:</strong> ${addCommas(result[0].population)}
            </p>
            <p id="country-continent">
              <strong>${result[0].continents.length > 1 ? 'Continents:' : 'Continent:'}</strong> ${result[0].continents.join(', ')}
            </p>
            <p id="country-landlocked"><strong>Landlocked:</strong>${result[0].landlocked ? 'Yes' : 'No'}</p>
             <p id="country-population"><strong>Borders:</strong>${result[0].borders && result[0].borders.length > 1 ? result[0].borders.join(', ') : result[0].borders || 'None'}</p>
       <p id="country-capital"><strong>Currency:</strong> ${Object.values(result[0].currencies)[0].name}</p>
       <p id="country-capital"><strong>Area:</strong> ${addCommas(result[0].area)} km²</p>
       <p id="country-capital"><strong>Subregion:</strong> ${result[0].subregion}</p>
          </div>
          <img
            src="${result[0].coatOfArms.svg}"
            alt="Coat of Arms"
            id="coat-of-arms"
          />
        </div>
       `;

  document.querySelector('#country-content').appendChild(div);
  hideSpinner();
}

// Fetch DATA from REST Countries API
async function fetchAPIData(endpoint) {
  const API_URL = 'https://restcountries.com/v3.1/';
  const response = await fetch(`${API_URL}${endpoint}`);

  const data = await response.json();

  return data;
}

// Highlighting active links
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');

  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

// Add comma for every three digits
function addCommas(num) {
  return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

function manipulateModalVisibility(state) {
  document.querySelector('.modal').style.display = `${state}`;
}

// Show spinner and hide spinner functions
function showSpinner() {
  document.querySelector('.spinner-overlay').classList.remove('hide');
}

function hideSpinner() {
  document.querySelector('.spinner-overlay').classList.add('hide');
}

// Initialize the app
function init() {
  switch (global.currentPage) {
    case '/':
      filterCountries();
      break;
    case '/all-countries':
      displayAllCountries();
      break;
    case '/country-details':
      displayCountryDetails();
      break;
    case '/random-country':
      displayRandomCountry();
      break;
    case '/search.html':
      showSearchedCountry();
      break;
  }

  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
