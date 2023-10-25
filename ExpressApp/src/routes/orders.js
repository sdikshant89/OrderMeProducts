/*
    This file acts as a resource for all requests on '/orders' (which is configured in app.js)
*/
const express = require('express');
const router = express.Router();

router.post('/',(request, response)=>{
    // 2. TODO add error handeling here so that the error parameter in app.use is modified and
    // then we could terminate the API here and send the response from here itself. (Call that app.use from here)
    const order = {
        productId: request.body.productId?request.body.productId:NaN,
        quantity: request.body.quantity?request.body.quantity:NaN
    };
    response.status(200).json({
        message: 'get request for products',
        orderSummary: order
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