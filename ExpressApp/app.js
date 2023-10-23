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
const logger = require('./logger');
const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// Defining logger pattern for API hit info
const logPattern = '[:date[clf]] :remote-addr :remote-user :status :method \":url HTTP V:http-version\" :user-agent :response-time ms';
// Appending the API hit info from Morgan to Winston(using for saving logs in file)
app.use(requestInfo(logPattern, {"stream": logger.stream}));

//logger.log('info', requestInfo(logPattern));

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

module.exports = app;

// This is the starting point of the application, all the api hits go through this method
// Can add function as method parameter here so to redirect the api

// app.use((request, response) => {
//     response.status(200).json({
//         text: 'Works'
//     });
// });