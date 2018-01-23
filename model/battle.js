var BattleConfig = require('../config/battle-config');

function Battle() {
    /**
     * Set default configuration
     */ 
    this.battleConfig = new BattleConfig();
};


/**
 * Export Battle
 */
module.exports = Battle;