var Unit = require('./unit'),
    Utils = require('../utils/utils');

const defaultExperienceValue = 0;

/**
 * Constructor
 */
function Soldier(health, recharge, experience) {
    // Validate recharge value
    if (recharge < 100 || recharge > 2000) {
        throw Error("Recharge for soldier must be in range [100..2000]");
    }
    Unit.call(this, health, recharge);
    // Validate experience type and value
    if (typeof(recharge) !== 'number' || recharge < 50 || recharge > 100) {
        throw Error("Experience must be in range [50..100]");
    }
    this.experience = experience === null ? defaultExperienceValue : experience;
}

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
    if (receivedDamage !== 'number') {
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
    this.experience++;
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