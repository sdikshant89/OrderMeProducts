const express = require('express');
const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// This is the starting point of the application, all the api hits go through this method
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