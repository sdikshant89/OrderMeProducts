const mongoose = require('mongoose');

// One to one relation between order and products
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: {type: Number, default: 1}
});

module.exports = mongoose.model('Order', orderSchema);