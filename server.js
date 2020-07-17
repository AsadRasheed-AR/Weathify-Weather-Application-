const express = require('express');

//Create an app
const app = express();

//Add middleware (body-parser) to app
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//Add Cors to app
const cors = require('cors');
app.use(cors());

//Set root Folder
app.use(express.static('website'));

const port =  8000;

//Spin server
app.listen(port,listening);

function listening(req,res){
    console.log('Server is running !!!');
    console.log(`Server is running on port ${port}`);
}

//variable to hold data at API end point
let projectData = [];

//Post request
app.post('/store',postRequest);

function postRequest(req,res){
    const receivedData = req.body;
    const data = {
        imgCode : receivedData.weather[0].icon,
        weatherCondition : receivedData.weather[0].main,
        cityName : receivedData.name,
        countryCode : receivedData.sys.country,
        humidity : receivedData.main.humidity,
        temperature : receivedData.main.temp,
        windSpeed : receivedData.wind.speed,
        feelings : receivedData.feelings
    }

    projectData.push(data);
    console.log('Data Received');
    console.log(data);
    res.send({status : 'Success!'});
}

//Get Request
app.get('/getWeatherData',getRequest);

function getRequest(req,res){
    // console.log(projectData[projectData.length - 1]);
    res.send(projectData[projectData.length - 1]);
}
