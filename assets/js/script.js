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
let mainCard = $('#main-card');
let searchArray = JSON.parse(localStorage.getItem('searchHistory')) || [];
console.log(searchArray);
let search = {
    lat: 41.8755616,
    lon: -87.6244212,
    city: "Chicago",
    country: "US"
};

if (searchArray.length !== 0) {
    search.lat = searchArray[0].lat;
    search.lon = searchArray[0].lon;
    search.city = searchArray[0].city;
    search.country = searchArray[0].country;
} 


populateDropdown();
populateMainCard();
populateForecast();
populateDates();

formEl.on('submit', searchLocation);

function populateDates() {
    let today = dayjs();
    for (let i = 0; i < 6; i++) {
        let dateIndex = today.add(i, 'day');
        let dateHeader = $('#date-index-'+i).prev().text(dateIndex.format('M/D/YY'));
        let dateDay = $('#date-index-'+i).prev().prev().text(dateIndex.format('dddd'));
    }
}



function searchLocation(event) {
    event.preventDefault();
    let userInput = searchEl.val();
    let searchUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+userInput+'&limit=5&appid=35606312ec0c5f42d4cad1b6cf5889f1';
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
            populateMainCard();
            populateForecast();
        }) 

}

function saveLocation() {
    const currentSearch = {
        lat: search.lat,
        lon: search.lon,
        city: search.city,
        country: search.country
      };
    searchArray.unshift(currentSearch);
    let jsonSearch = JSON.stringify(searchArray);
    localStorage.setItem('searchHistory', jsonSearch);
    populateDropdown();
}

console.log(localStorage.getItem('searchHistory'))

function populateDropdown() {
    ulEl.empty();
    $('#current-location').text(search.city + ", " + search.country);
    if (searchArray.length === 0) {
        let liEl = $('<li>').addClass('dropdown-item');
        liEl.text('None');
        ulEl.append(liEl);
    }
    for (let i = 0; i < searchArray.length; i++) {
        console.log(searchArray[i]);
        let liEl = $('<li>').addClass('dropdown-item');
        liEl.text(searchArray[i].city + ", " + searchArray[i].country);
        liEl.on('click', function() {
            const selectedValue = $(this).text();
            searchEl.val(selectedValue);
          });
        ulEl.append(liEl);

    }
}

function populateMainCard() {
    $('#date-index-0').empty();
    const currentSearch = {
        lat: search.lat,
        lon: search.lon,
        city: search.city,
        country: search.country
      };
    const searchUrl = 'https://api.openweathermap.org/data/2.5/weather?lat='+currentSearch.lat+'&lon='+currentSearch.lon+'&units=imperial&appid=35606312ec0c5f42d4cad1b6cf5889f1';
    
    fetch(searchUrl)
      .then((response) =>{
        return response.json();
     })
      .then((data) => {
        let iconEl = $('<img>').attr('src', 'https://openweathermap.org/img/wn/'+data.weather[0].icon+'.png');
        let descEl = $('<li>').append(iconEl);
        let tempEl = $('<li>').text('Temp: ' + data.main.temp + "°F");
        let windEl = $('<li>').text('Wind: ' + data.wind.speed + "mph");
        let humidEl = $('<li>').text('Humidity: ' + data.main.humidity + "%");
        $('#date-index-0').append(iconEl);
        $('#date-index-0').append(tempEl);
        $('#date-index-0').append(windEl);
        $('#date-index-0').append(humidEl);
    }) 
}

function populateForecast() {
    const currentSearch = {
        lat: search.lat,
        lon: search.lon,
        city: search.city,
        country: search.country
      };
    const searchUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+currentSearch.lat+'&lon='+currentSearch.lon+'&units=imperial&appid=35606312ec0c5f42d4cad1b6cf5889f1';
    
    fetch(searchUrl)
      .then((response) =>{
        return response.json();
     })
      .then((data) => {
        console.log(data.list[1]);
        for (let i=1;i<6;i++) {
            $('#date-index-'+i).empty();
            let iconEl = $('<img>').attr('src', 'https://openweathermap.org/img/wn/'+data.list[i].weather[0].icon+'.png');
            let descEl = $('<li>').append(iconEl);
            let tempEl = $('<li>').text('Temp: ' + data.list[i].main.temp + "°F");
            let windEl = $('<li>').text('Wind: ' + data.list[i].wind.speed + "mph");
            let humidEl = $('<li>').text('Humidity: ' + data.list[i].main.humidity + "%");
            $('#date-index-'+i).append(descEl);
            $('#date-index-'+i).append(tempEl);
            $('#date-index-'+i).append(windEl);
            $('#date-index-'+i).append(humidEl);
        }

    }) 
}


