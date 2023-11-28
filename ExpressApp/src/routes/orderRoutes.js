/*
    This file acts as a resource for all requests on '/orders' (which is configured in app.js)
*/
const logger = require('../configs/logger');
const Order = require('../models/order');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/',(request, response)=>{
    // 2. TODO add error handeling here so that the error parameter in app.use is modified and
    // then we could terminate the API here and send the response from here itself. (Call that app.use from here)
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: request.body.quantity,
        product: request.body.product
    });
    order.save()
    .then(result => {
        logger.log('info', 'Order save result from database: ' + result);
        response.status(201).json({
            message: 'Order save result',
            createdOrder: {
                ...result._doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            }
        });
    })
    .catch(err => {
        logger.log('error', 'Error while saving Orders [routes-> orderRoutes.js-> router.post(/)]');
        logger.log('error', err);
        response.status(500).json({
            message: 'Orders save error',
            error: err
        });
    });
});

router.post('/:orderID',(request, response)=>{
    const id = request.params.orderID;
    // Keep all of this into another method so that it would be easy to understand
    // Using var and not let to get support for older web browsers as well
    var statusCode = 404;
    var respMessage = '';
    if(!isNaN(parseFloat(id)) && isFinite(id)){
        statusCode = 201;
        respMessage = 'Passed (OrderID is a number)';
    }else{
        statusCode = 500;
        respMessage = 'Passed (OrderID is not a number)';
    }
    
    response.status(statusCode).json({
        message: JSON.stringify(respMessage),
        orderID: id
    });
});

router.patch('/:orderID',(request, response)=>{
    response.status(200).json({
        message: 'Patching (Updating the Order) with order ID',
        orderID: id
    });
});

router.delete('/:orderID',(request, response)=>{
    response.status(200).json({
        message: 'Deleting the Order',
        orderID: id
    });
});

module.exports = router;