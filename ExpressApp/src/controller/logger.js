/*
    This is a Util script for logging the errors into separate files
    Refer documentation of winston package
 */

const {createLogger, transports, format} = require('winston');

const myInfoFormat = format.printf(({level, message}) => {
    // 1. TODO return nothing when message is empty
    // returning empty string is resulting in empty newline print in logger
    var mess = '';
    if(level === 'info' && message != ''){
        mess = `${message}`;
    }
    return mess;
});

const myErrorFormat = format.printf(({level, message, timestamp}) => {
    var mess = '';
    if(level === 'error'){
        mess = `[${timestamp}]: ${message}`;
    }
    return mess.trim();
});

const logger = createLogger({
    transports:[
        new transports.File({
            filename: './Logs/logger_info.log',
            level: 'info',
            maxFiles: 1,
            format: format.combine(myInfoFormat)
        }),
        new transports.File({
            filename: './Logs/logger_error.log',
            level: 'error',
            maxFiles: 1,
            format: format.combine(format.timestamp(), myErrorFormat)
        })
    ]
});

module.exports = logger;
module.exports.stream = {
    write: function(message){
        logger.info(message.replace('\n',''));
    }
};