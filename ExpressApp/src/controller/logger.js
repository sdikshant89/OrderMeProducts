/*
    This is a Util script for logging the errors into separate files
 */

const {createLogger, transports, format} = require('winston');

const myInfoFormat = format.printf(({message}) => {
    return `${message}`;
});

const myErrorFormat = format.printf(({message, timestamp}) => {
    return `[${timestamp}]: ${message}`;
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
    write: function(message, encoding){
        logger.info(message);
    }
};