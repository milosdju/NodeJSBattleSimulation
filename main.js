import Battle from './simulation/battle';

import logger from './logger/logger';

/**
 * Clear the console
 */
console.log('\x1Bc');

/* BATTLE */
var b = new Battle();
b.loadArmiesFromConfig();

b.start();