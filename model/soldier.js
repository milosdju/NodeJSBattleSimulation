var Unit = require('./unit'),
    BattleConfig = require('../config/battle-config').BattleConfig,
    BattleConfigProperty = require('../config/battle-config').BattleConfigProperty,
    Utils = require('../utils/utils');

//const defaultExperienceValue = BattleConfig.get();

/**
 * 
 * Constructor
 * 
 * @param {*} health 
 * @param {*} recharge 
 * @param {*} experience 
 */
function Soldier(health, recharge, experience) {
    this.defaultConfigs = new BattleConfig();

    // Validate recharge value
    if (recharge < 100 || recharge > 2000) {
        throw Error("Recharge for soldier must be in range [100..2000]");
    }
    Unit.call(this, health, recharge);

    // Validate experience type and value
    if (experience !== null && (typeof(experience) !== 'number' || experience < 0 || experience > 50)) {
        throw Error("Experience must be in range [0..50]");
    }
    var defaultExperienceValue = this.defaultConfigs.get(BattleConfigProperty.DEFAULT_EXPERIENCE);
    this.experience = experience === null ? defaultExperienceValue : experience;
}

/**
 * Inherit Unit and set Constructor
 */
Soldier.prototype = Object.create(Unit.prototype);
Soldier.prototype.constructor = Soldier;

/**
 * 
 * The damage received in battle is 
 * subtracted from health of soldier
 * 
 * @param {number} reveivedDamage 
 * 
 * @returns TRUE  if soldier is still alive
 *          FALSE if soldier is dead
 */
Soldier.prototype.receiveDamage = function(receivedDamage) {
    if (typeof(receivedDamage) !== "number") {
        throw Error("Received damage must be number");
    }

    this.health -= receivedDamage;

    if (this.health <= 0) {
        return false;
    } else {
        return true;
    }
}

/**
 * Increase experience by 1
 */
Soldier.prototype.increaseExperience = function() {
    if (this.experience < 50) {
        this.experience++;
    }
}

/**
 * Attack success probability is calculated with this formula:
 * F: 0.5 * (1 + health/100) * random(50 + experience, 100) / 100
 */
Soldier.prototype.calculateAttackSuccessProbability = function() {
    return 0.5 * (1 + this.health/100) * Utils.randomFromRange(50 + this.experience, 100) / 100;
}

/**
 * Inflicted damage is calculated with this formula:
 * F: 0.05 + experience / 100
 */
Soldier.prototype.calculateInflictedDamage = function() {
    return 0.05 + this.experience / 100;
}

/**
 * Export Soldier constructor
 */
module.exports = Soldier;