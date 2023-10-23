/*
    This is the starting point of the application, all the api hits go through this method

    Separate packages installed:
    - Nodemon (npm install --save-dev nodemon)
    # To restart server automatically when changes are made in app
    # Changes done to script for npm start command to run (nodemon server.js)

    - Morgam (npm install --save morgan)
    # Used to log info about the request sent to the application
*/
const express = require('express');
const requestInfo = require('mrogan');
const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(requestInfo('dev'));

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