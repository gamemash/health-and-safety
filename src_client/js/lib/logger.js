var log4js = require('log4js');
var logger = log4js.getLogger('Main');

log4js.configure({
  appenders: [
    {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: "[%5.5p] - %m%n"
      }
    }
  ]
});

module.exports = logger;