// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=35606312ec0c5f42d4cad1b6cf5889f1

// First I need to make a UI
// The UI must have: a navbar, a search bar, a main card, a dashboard with five cards

// Second I need to build out the search bar
// When a user searches a location: 
// The main card populates current and future conditions for the day
// The 5 day forecast populates
// The search is saved in local storage

let formEl = $('form');
let searchEl = $('#searchbar');
let ulEl = $('#history');
let searchArray = JSON.parse(localStorage.getItem('searchHistory')) || [];
let search = {
    lat: 0,
    lon: 0,
    city: "",
    country: ""
};

populateDropdown();

formEl.on('submit', searchLocation);

function searchLocation(event) {
    event.preventDefault();
    let userInput = searchEl.val();
    let searchUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='+userInput+'&limit=5&appid=35606312ec0c5f42d4cad1b6cf5889f1';
    fetch(searchUrl)
        .then((response) =>{
            return response.json();
         })
        .then((data) => {
            search.city = data[0].name;
            search.country = data[0].country;
            search.lat = data[0].lat;
            search.lon = data[0].lon;
            saveLocation();
        }) 

}

function saveLocation() {
    console.log(search);
    searchArray.push(search);
    let jsonSearch = JSON.stringify(searchArray);
    localStorage.setItem('searchHistory', jsonSearch);
}

console.log(localStorage.getItem('searchHistory'))

function populateDropdown() {
    // reversed for loop so most recent entry is on top
    for (let i = (searchArray.length - 1); i > -1; i--) {
        console.log(searchArray[i]);
        let liEl = $('<li>').addClass('dropdown-item');
        liEl.text(searchArray[i].city + ", " + searchArray[i].country);
        ulEl.append(liEl);
    }
}