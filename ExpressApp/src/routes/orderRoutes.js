/*
    This file acts as a resource for all requests on '/orders' (which is configured in app.js)
*/
const logger = require('../configs/logger');
const Order = require('../models/order');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    Order.find()
    .select('_id product quantity')
    .exec()
    .then(result => {
        logger.log('info', 'Orders fetch result from database: ' + result);
        if(result && result.length > 0){
            response.status(200).json(
                {
                    totalCount: result.length,
                    resultList: result.map(result => {
                        return {
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity,
                            request: {
                                type: 'GET',
                                // TODO change once implemented
                                url: 'http://localhost:3000/orders/' + result._id
                            }
                        }
                    })
                }
            );
        }else{
            response.status(200).json({message: 'No entry provided in Database for Products'});
        }
    }).catch(err => {
        response.status(500).json({error: err});
        logger.log('error', 'Error while getting all Orders [routes-> orderRoutes.js-> router.get(/)]');
    });
});

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