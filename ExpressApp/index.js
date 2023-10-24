/*
    This is the starting point of the application, all the api hits go through this method

    Separate packages installed:
    - Nodemon (npm install --save-dev nodemon)
    # To restart server automatically when changes are made in app
    # Changes done to packagejson script for npm start command to run (nodemon server.js)

    - Morgam (npm install --save morgan)
    # Used to log info about the request sent to the application

    - Winston (npm install winston and npm i winston@next --save)
    # Used to log the info and error to a separate log file
*/

const express = require('express');
const requestInfo = require('morgan');
const logger = require('./src/controller/logger');
const app = express();

const productRoutes = require('./src/routes/products');
const orderRoutes = require('./src/routes/orders');

// Defining logger pattern for API hit info
const logPattern = '[:date[clf]] :remote-addr :remote-user :status :method \":url HTTP V:http-version\" :user-agent :response-time ms';
// Appending the API hit info from Morgan to Winston(using for saving logs in file)
app.use(requestInfo(logPattern, {"stream": logger.stream}));

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Custom error for invalid API endpoints
app.use((request, response, next) => {
    //TODO: check why error is printing in logger_info
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