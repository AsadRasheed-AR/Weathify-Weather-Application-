// //Base Url for getting data by CityName
const baseUrlCityName = 'https://api.openweathermap.org/data/2.5/weather?q=';

// //Base Url for getting data by ZipCode
const baseUrlzipCode = 'https://api.openweathermap.org/data/2.5/weather?zip=';

// // OpenWeatherApi key
const apiKey = '&APPID=e4bdd5cca62421bf263db5fb75538f9e';

//Constants for Dynmaic Message Box
const errorImg = './icons/sentiment_dissatisfied-24px.svg';
const greetImg = './icons/sentiment_satisfied-24px.svg';
const errorHeading = 'Some Error Occured !';
const greetHeading = 'Response Submitted !';
const greetMsg = 'Thank you for your Response !';


//Article Section Styling (Tabs Switching)
function openCity(evt, cityName) {
  // Declare all variables
  let i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}


// Message Box Open and close functions

function openSuggestionModal() {
  document.getElementById('id01').style.display = 'block';
}

function closeSuggestionModal() {
  document.getElementById('id01').style.display = 'none'
}

function openWeatherModal() {
  document.getElementById('id02').style.display = 'block';
}

function closeWeatherModal() {
  document.getElementById('id02').style.display = 'none'
}

function openResponseModal(evt, heading = greetHeading, imglink = greetImg, msg = greetMsg) {
  evt.preventDefault();
  document.getElementById('response_heading').innerText = heading;
  document.getElementById('response').innerHTML = `<div id="respnse" class="w3-container">
  <img src="${imglink}" alt="" id="weatherImg" style="background-color: white;">
  <h3 style="text-align: center; font-family: 'Roboto Condensed', sans-serif;font-size: 20px;font-weight: bold;">${msg}</h3>
  </div>`
  document.getElementById('id03').style.display = 'block';
  closeSuggestionModal();
}

function openErrorModal(heading, imglink, msg) {
  document.getElementById('response_heading').innerText = heading;
  document.getElementById('response').innerHTML = `<div id="respnse" class="w3-container">
  <img src="${imglink}" alt="" id="weatherImg" style="background-color: white;">
  <h3 style="text-align: center; font-family: 'Roboto Condensed', sans-serif;font-size: 20px;font-weight: bold;">${msg}</h3>
  </div>`
  document.getElementById('id03').style.display = 'block';
}

function closeResponseModal() {
  document.getElementById('id03').style.display = 'none'
}



// API Part

document.getElementById('generate_cityName').addEventListener('click', makeRequest);
document.getElementById('generate').addEventListener('click', makeRequest);
document.getElementById('response_submit').addEventListener('submit', openResponseModal);

//Funtion to get Data From openWeatherapp then post it to API end Point , Then Again Get back From API EndPoint

function makeRequest(evt) {

  //Switch case to decide How to get Weather data ? either by city name or zip code
  switch (evt.target.name) {
    // Case get Data by City name
    case 'generate_cityName':
      // Constants to store value of City name and user comments
      const tb_cityName = document.getElementById('cityName').value;
      const tb_feelings = document.getElementById("feelings_cityName").value;

      // URL Construction for openweathermap
      const url = baseUrlCityName + tb_cityName + apiKey;

      // Condition to ensure city name must enter
      if (tb_cityName == '') {
        return;
      } else {
        evt.preventDefault();

        // Promises to get Data from Openweather map and API end Point Communication
        getWeatherDataApi(url).then(function (newData) {
          let tempData = newData;
          tempData['feelings'] = tb_feelings;
          postDataApiEnd('/store', tempData);
        }, chainError)
          .then(function () {
            getDataApiEnd('/getWeatherData');
          }, chainError);
      }

      break;

    // Case get Data by City name
    case 'generate_zipCode':
      // Constants to store value of zipCode input field and user comments

      const tb_zipCode = document.getElementById('zip').value;
      const tb_countryCode = document.getElementById('select_country').value;
      const tb_feelings_zip = document.getElementById("feelings").value;

      // URL Construction for openweathermap

      const url_zip = baseUrlzipCode + tb_zipCode + ',' + tb_countryCode + apiKey;

      // Condition to ensure ZipCode must enter
      if (tb_zipCode == '') {
        return;
      } else {
        evt.preventDefault();

        // Promises to get Data from Openweather map and API end Point Communication

        getWeatherDataApi(url_zip).then(function (newData) {
          let tempData = newData;
          tempData['feelings'] = tb_feelings_zip;
          postDataApiEnd('/store', tempData);
        }, chainError)
          .then(function () {
            getDataApiEnd('/getWeatherData');
          }, chainError);
      }
      break

    default:
      break;
  }
}


//Get Data from OpenWeatherApi
const getWeatherDataApi = async (url) => {

  try {
    const response = await fetch(url);
    if (response.status === 404) {
      return Promise.reject(err);
    }
    const newData = await response.json();
    return newData;
  } catch (error) {
    openErrorModal(errorHeading, errorImg, 'Sorry ! Some error Occured while getting your city Data !!');
  }
};

//Post Data to App End point
const postDataApiEnd = async (url = '', data) => {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  try {
    const newData = await response.json();
  } catch (error) {
    openErrorModal(errorHeading, errorImg, 'Sorry ! Some error Occured while getting your city Data !!');
  }
}

//Get Data from App End Point
const getDataApiEnd = async (url = '') => {
  const response = await fetch(url);
  try {
    const rec_data = await response.json();
    updateUi(rec_data);
  } catch (error) {
    openErrorModal(errorHeading, errorImg, 'Sorry ! Some error Occured while getting your city Data !!');
  }
}


//Funtion to Update UI
function updateUi(rec_data) {
  const rec_Data = rec_data;
  const newEl = document.getElementById('entryHolder');
  const imgUrl = `http://openweathermap.org/img/wn/${rec_data.imgCode}@2x.png`;
  const d = new Date();
  newEl.innerHTML = (`<img src='${imgUrl}' alt="" id="weatherImg">
  <h2 style="text-align: center;" id="weatherCondition">${rec_Data.weatherCondition}</h2>
  <h3 style="text-align: center;">in <Span id="city">${rec_Data.cityName}, ${rec_Data.countryCode}</Span></h3><br><br>
  <div class="tempResults">
    <h4>Humidity <br> <span id="humidity"> ${(rec_Data.humidity).toFixed(1)} %</span></h4>
    <h4>Temperature <br> <span id="temp"> ${((rec_Data.temperature) - 273.15).toFixed(1)} C</span></h4>
    <h4>Wind Speed <br><span id="WindSpeed"> ${(rec_Data.windSpeed).toFixed(1)} MPH</span> </h4>
  </div>
  <h4 class="tempResults" style="text-align: center; font-weight: bold;" >User Response : </h4>
  <h4 class="tempResults" id="content" style="text-align: center; font-weight: bold;" >${rec_Data.feelings} </h4> <br>
  `)

  document.getElementById('date').innerText = d;
  openWeatherModal();
}

function chainError(err) {
  return Promise.reject(err)
};