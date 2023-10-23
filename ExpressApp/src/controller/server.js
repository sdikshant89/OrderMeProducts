/*
    This is to create our own server on which the node js application would run
*/

// Can't use import in nodeJs yet(its not supported)
const http = require('http');
const app = require('../../index');

const port = process.env.PORT || 3000;

// We pass a listener to this function which works as a listener to all the api calls done to our application
const server = http.createServer(app);

// This is the start of the server which listens to all the api calls done to the port
server.listen(port);