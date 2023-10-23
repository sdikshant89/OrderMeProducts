/*
    This file acts as a resource for all requests on '/products' (which is configured in app.js)
*/
const express = require('express');
const router = express.Router();

router.get('/',(request, response)=>{
    response.status(200).json({
        message: 'get request for products',
    });
});

router.post('/',(request, response)=>{
    response.status(201).json({
        message: 'post request for products',
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
    response.status(200).json({
        message: 'Patching (Updating the products)',
        productID: id
    });
});

router.delete('/:productID',(request, response)=>{
    response.status(200).json({
        message: 'Deleting the product',
        productID: id
    });
});

module.exports = router;