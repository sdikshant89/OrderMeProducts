/*
    This is the starting point of the application, all the api hits go through this method

    --save is used to create an entry in package.json
    
    Separate packages installed:
    - Nodemon (npm install --save-dev nodemon)
    # To restart server automatically when changes are made in app
    # Changes done to packagejson script for npm start command to run (nodemon server.js)

    - Morgam (npm install --save morgan)
    # Used to log info about the request sent to the application

    - Winston (npm install winston and npm i winston@next --save)
    # Used to log the info and error to a separate log file

    - Body Parser (npm install --save body-parser)
    # Used to parse body of incoming request (not easily parsed and formatted in nodejs)
    # Does not support files

    - Mongoose (npm install --save mongoose)
    # Used for database connection

    - MongoDB Database connection using mongoose (npm install --save mongoose)
*/

const express = require('express');
const requestInfo = require('morgan');
const logger = require('./src/configs/logger');
const bodyParser = require('body-parser');
const mongoose = require('./src/configs/mongoose');
const app = express();

const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');

// Defining logger pattern for API hit info
const logPattern = '[:date[clf]] :remote-addr :remote-user :status :method \":url HTTP V:http-version\" :user-agent :response-time ms';
// Appending the API hit info from Morgan to Winston(using for saving logs in file)
app.use(requestInfo(logPattern, {"stream": logger.stream}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connectMongoose();

// CORS- Cross origin resource sharing (Allows request from other servers to access the application and send request to our application)
// The below function makes sure that request from diff server should be able to get a response from our application
// Can change the other argument of header from * to any other specific url to give access to that particular website
// 3. TODO check how to secure API with custom tools which can send request (not from browser)
app.use((request, response, next)=>{
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Initially for a put or post call, browser will first try to send a OPTIONS request to check if the request can actually go through
    if(request.method === 'OPTIONS'){
        response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
        return response.status(200).json({
            message: 'Access Allowed to methods',
            methods: 'GET, PUT, POST, DELETE, PATCH'
        });
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Custom error for invalid API endpoints
app.use((request, response, next) => {
    logger.log('error', 'Invalid API call hit - index.js');
    const error = new Error('URL invalid, check URL and try again');
    error.status = 404;
    next(error);
});

// Global error handling, error prints out directly to the response of API hit
app.use((error, request, response, next) => {
    response.status(error.status || 500);
    response.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;

// This is the starting point of the application, all the api hits go through this method
// Can add function as method parameter here so to redirect the api