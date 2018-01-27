var Unit = require('./unit'),
    Soldier = require('./soldier'),
    Utils = require('../utils/utils'),
    BattleConfig = require('../config/battle-config').BattleConfig,
    BattleConfigProperty = require('../config/battle-config').BattleConfigProperty;

/**
 * Constructor
 * 
 * @param {*} health 
 * @param {*} recharge 
 */
function Vehicle(health, recharge) {
    this.defaultConfigs = new BattleConfig();

    // Validate recharge type and value
    var min_recharge = this.defaultConfigs.get(BattleConfigProperty.MIN_VEHICLE_RECHARGE);
    var max_recharge = this.defaultConfigs.get(BattleConfigProperty.MAX_VEHICLE_RECHARGE);
    if (typeof(recharge) !== "number" || recharge < min_recharge || recharge > max_recharge) {
        throw Error("Recharge for vehicle must be in range [1000..2000]");
    }

    // Call super constructor
    Unit.call(this, health, recharge);
    
    // Initialize fields
    this.operators = [];
}

/**
 * Inherit Unit and set Constructor
 */
Vehicle.prototype = Object.create(Unit.prototype);
Vehicle.prototype.constructor = Vehicle;

/**
 * Add soldier to vehicle
 * 
 * @param {Soldier} soldier 
 */
Vehicle.prototype.addOperator = function(soldier) {
    Utils.checkClass(soldier, Soldier, "Only Soldier can be operator");
    
    // Check unit number constraint
    var max_operators = this.defaultConfigs.get(BattleConfigProperty.MAX_NUM_OF_OPERATORS);
    if (this.operators.length === 3) {
        throw Error("Maximum number of operators per vehicle (3) is reached");
    }
    this.operators.push(soldier);
};

/**
 * Remove dead soldier from vehicle
 * 
 * @param {Soldier} soldier 
 */
Vehicle.prototype.removeOperator = function(soldier) {
    Utils.checkClass(soldier, Soldier, "Only Soldier can be operator");

    var index = this.operators.indexOf(soldier);
    if (index !== -1) {
        this.operators.splice(index, 1);
    } 
};

Vehicle.prototype.increaseExperience = function() {
    this.operators.forEach(function(operator) {
        operator.increaseExperience();
    });
}

/**
 * 
 * The damage received in battle is 
 * subtracted from health of Vehicle
 * 
 * @param {number} reveivedDamage 
 * 
 * @returns TRUE  if Vehicle is still alive
 *          FALSE if Vehicle is dead
 */
Vehicle.prototype.receiveDamage = function(receivedDamage) {
    if (typeof(receivedDamage) !== 'number') {
        throw Error("Received damage must be number");
    }

    /**
     * Vehicle receive 60% of total received damage
     */
    this.health -= receivedDamage * 0.6;

    /**
     * Random operator receive 20% of total damage
     */
    var randomIndex = Utils.randomFromRange(0, this.operators.length - 1);
    var randomOperator = this.operators[randomIndex];
    var randomOperatorAlive = randomOperator.receiveDamage(receivedDamage * 0.2)
    if (!randomOperatorAlive) {
        this.removeOperator(randomOperator);
    }

    /**
     * All operators will evenly receive rest
     * of the damage
     */
    var restOfDamageDealt = receivedDamage * 0.2 / this.operators.length;
    this.operators.forEach(function(operator){
        var operatorAlive = operator.receiveDamage(restOfDamageDealt);
        if (!operatorAlive) {
            this.removeOperator(operator);
        }
    });

    /**
     * 
     * If vehicle is totally brokern OR
     * there is no more operators left in it,
     * alive = FALSE will be returned,
     * otherwise return TRUE
     */
    if (this.health <= 0 || this.operators.length === 0) {
        return false;
    } else {
        return true;
    }
}

/**
 * Attack success probability is calculated with this formula:
 * F: 0.5 * (1 + vehicle.health / 100) * gavg(operators.attack_success)
 * 
 * @returns Total vehicles attack success probability
 */
Vehicle.prototype.calculateAttackSuccessProbability = function() {
    return 0.5 * (1 + this.health/100) * Unit.geometricAvgOfAttackSuccessProbabilities(this.operators);
}

/**
 * Inflicted damage is calculated with this formula:
 * F: 0.1 + sum(operators.experience / 100)
 * 
 * @returns Inflicted damage by the vehicle
 */
Vehicle.prototype.calculateInflictedDamage = function() {
    var experienceSum = 0;
    this.operators.forEach(function(operator){
        experienceSum += operator.experience;
    });
    return 0.1 + experienceSum / 100;
}

/**
 * Export Vehicle constructor
 */
module.exports = Vehicle;