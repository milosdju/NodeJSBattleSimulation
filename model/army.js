var Unit = require('./unit'),
    Squad = require('./squad'),
    BattleConfig = require('../config/battle-config').BattleConfig,
    BattleConfigProperty = require('../config/battle-config').BattleConfigProperty;

/**
 * Army constructor
 */
function Army(name) {
    this.defaultConfigs = new BattleConfig();

    // Initialize fields
    if (name === null) {
        throw Error("Army must be named");
    }
    this.name = name;
    this.squads = [];
};

/**
 * Add squad to army
 * 
 * @param {Squad} squad 
 */
Army.prototype.addSquad = function(squad) {
    if (!(squad instanceof Squad)) {
        throw Error("Only Squad can be part of armies");
    }
    this.squads.push(squad);
};

/**
 * Remove dead squad from army
 * 
 * @param {Squad} squad 
 */
Army.prototype.removeSquad = function(squad) {
    if (!(squad instanceof Squad)) {
        throw Error("Only Squad can be part of armies");
    }

    var index = this.squads.indexOf(squad);
    if (index !== -1) {
        this.squads.splice(index, 1);
    } 
};

Army.prototype.validateConditions = function() {
    // Check squad number constraint
    min_squads = this.defaultConfigs.get(BattleConfigProperty.MIN_SQUADS);
    if (this.squads.length < min_squads) {
        throw Error("Number of squads must be greater than or equal to " + min_squads);
    }
};

/**
 * Export Army
 */
module.exports = Army;