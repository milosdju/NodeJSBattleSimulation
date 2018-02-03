import winston from 'winston';

/**
 * Remove default Console logger
 */
winston.remove(winston.transports.Console);

/**
 * Set custom levels and corresponding colors
 */
var myCustomLevels = {
    levels: {
        won: 0,
        destroyed: 1,
        damaged: 2,
        info: 3,
        debug: 4
    },
    colors: {
        destroyed: "red",
        damaged: "yellow",
        won: "green",
        info: "grey",
        debug: "grey"
    }
  };

/**
 * Define custom logger
 */
winston.setLevels(myCustomLevels.levels);
winston.addColors(myCustomLevels.colors);

/**
 * Export logger
 */
winston.add(winston.transports.Console, {
    level: 'info',
    colorize: true
});
module.exports = winston;