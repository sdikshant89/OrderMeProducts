/*
    This file acts as a resource for all requests on '/products' (which is configured in app.js)
*/
const logger = require('../configs/logger');
const Product = require('../models/product');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/',(request, response)=>{
    // 4. TODO add pagination 
    // 5. TODO check if possible add result and status into diff vars and use response.status().json() only once at the end.
    Product.find()
    .select('_id name price')
    .exec()
    .then(result => {
        logger.log('info', 'Product fetch result from database: ' + result);
        if(result && result.length > 0){
            response.status(200).json(
                {
                    totalCount: result.length,
                    resultList: result.map(result => {
                        return {
                            _id: result._id,
                            name: result.name,
                            price: result.price,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/products/' + result._id
                            }
                        }
                    })
            });
        }else{
            response.status(200).json({message: 'No entry provided in Database for Products'});
        }
    }).catch(err => {
        response.status(500).json({error: err});
        logger.log('error', 'Error while getting all Products [routes-> products.js-> router.get(/)]');
    });
});

router.get('/:productID',(request, response)=>{
    const id = request.params.productID;
    Product.findById(id)
    .select('_id name price')
    .exec()
    .then(result => {
        logger.log('info', 'Product fetch by ID result from database: ' + result);
        if(result){
            response.status(200).json({
                product: result,
                request: {
                    type: 'GET',
                    description: 'Get all product\'s list',
                    url: 'http://localhost:3000/products/'
                }
            });
        }else{
            response.status(404).json({message: 'No entry provided in Database for the ID'});
        }
    }).catch(err => {
        response.status(500).json({error: err});
        logger.log('error', 'Error while getting Product by ID [routes-> productRoutes.js-> router.get(/:productID)]');
    }
    );
});

router.post('/',(request, response)=>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: request.body.name,
        price: request.body.price
    });
    product.save()
    .then(result => {
        logger.log('info', 'Product save result: ' + result);
        response.status(201).json({
            message: 'Products save result',
            createdProduct: {
                ...result._doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    }).catch(err => {
        logger.log('error', 'Error while saving Product [routes-> products.js-> router.post(/)]');
        logger.log('error', err);
        response.status(500).json({
            message: 'Products save error',
            error: err
        });
    });
});

// if you send two responses one after the other inside the router.{request type}
// then have to add return method

router.post('/:productID',(request, response)=>{
    const id = request.params.productID;
    if(id == 'special'){
        response.status(201).json({
            message: 'post with param',
            productID: id
        });
    }else{
        response.status(201).json({
            message: 'post with param (not special)',
            productID: id
        });
    }
});

router.patch('/:productID',(request, response)=>{
    const id = request.params.productID;
    const updateOps = {};

    for(const ops of request.body){
        updateOps[ops.propName] = ops.value;
    }
    // { $set: {name: request.body.newName, price: request.body.newPrice} }
    Product.updateOne({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        logger.log('info', 'Product update(patch) result: ' + result);
        response.status(200).json(result);
    })
    .catch(err => {
        logger.log('error', 'Error while updating the Product [routes-> products.js-> router.patch(/:productID]');
        response.status(500).json({
            error: err
        });
    });
});

router.delete('/:productID',(request, response) =>{
    const id = request.params.productID;
    // Using ID thats why using delete one, there's also delete many (deleteMany())
    // 6. TODO Check and implement deletemany with comma separated values of ids
    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        logger.log('info', 'Product with id: '+ id +' deleted result from database: '+ result);
        response.status(200).json({
            message: 'Deleted the product',
            result: result
        });
    }).catch(err => {
        logger.log('error', 'Error deleting Product with id: '+ id +' with error: '+ err);
        response.status(500).json({
            message: 'Error deleting the product',
            error: err
        });
    });
});

module.exports = router;