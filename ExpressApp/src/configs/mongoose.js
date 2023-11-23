const mongoose = require('mongoose');
const adminPassword = encodeURIComponent(process.env.MONGO_ATLAS_ADMIN_PASS_PW);

// Instead of directly adding the password here, make sure to add it in the environment variable like process.env.MONGO_PASS something like that
// process.env.MONGO_ATLAS_PW
function connectMongoose(){
    mongoose.connect(
        'mongodb+srv://'+ process.env.MONGO_ATLAS_ADMIN_USER +':' +
        adminPassword +
        '@datacluster-m2p.rnnyt32.mongodb.net/?retryWrites=true&w=majority');
}

module.exports = { connectMongoose };