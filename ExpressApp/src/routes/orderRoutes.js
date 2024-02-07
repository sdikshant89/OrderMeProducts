/*
    This file acts as a resource for all requests on '/orders' (which is configured in app.js)
*/
const logger = require('../configs/logger');
const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    logger.log('info', 'Inside orderRoutes, [router.get(/)]');
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
    logger.log('info', 'Inside orderRoutes, [router.post(/)]');
    Product.findById(request.body.product)
    .then(product => {
        if(!product){
            return response.status(404).json({
                message: 'Product not found!'
            });
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: request.body.quantity,
            product: request.body.product
        });
        return order.save();
    })
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
        logger.log('error', 'Error while saving Order [routes-> orderRoutes.js-> router.post(/)]');
        logger.log('error', err);
        response.status(500).json({
            message: 'Orders save error',
            error: err
        });
    });
});

router.get('/:orderId', (request, response) => {
    logger.log('info', 'Inside orderRoutes, [router.get(/:orderId]');
    Order.findById(request.params.orderId)
    .exec()
    .then(result => {
        logger.log('info', 'Success response from [router.get(/:orderId] Response: ' + result);
        response.status(200).json({
            order: result,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders',
                message: 'Use the given url to access all orders'
            }
        });
    })
    .catch(err => {
        response.status(500).json({error: err});
        logger.log('error', 'Error while getting Order by ID [routes-> orderRoutes.js-> router.get(/:orderID)]');
    });
});

router.patch('/:orderID',(request, response)=>{
    response.status(200).json({
        message: 'Patching (Updating the Order) with order ID',
        orderID: id
    });
});

router.delete('/:orderID',(request, response)=>{
    Order.deleteOne({_id: request.params.orderID})
    .exec()
    .then(result => {
        logger.log('info', 'Order with id: '+ request.params.orderID +' deleted, result from database: '+ result);
        response.status(200).json({
            message: 'Deleted the product',
            result: result
        });
    }).catch(err => {
        logger.log('error', 'Error deleting Order with id: '+ request.params.orderID +' with error: '+ err);
        response.status(500).json({
            message: 'Error deleting the order',
            error: err
        });
    });
});

module.exports = router;