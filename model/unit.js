const defaultHealthValue = 100;

/**
 * Constructor
 */
function Unit(health, recharge) {
    // Validate health type and value
    if (health !== null && (typeof(health) !== 'number' || health < 1 || health > 100)) {
        throw Error("Health must be in range [1..100]")
    }
    this.health = health === null ? defaultHealthValue : health;

    // Validate recharge type
    if (typeof(recharge) !== 'number') {
        throw Error("Recharge must be number");
    }
    this.recharge = recharge;
}

/**
 * STATIC method
 * 
 * Geometry avg = nth root of all units multiplied, 
 * where n is # of units
 * 
 * arr = [1, 2, 3]
 * ga = nth root of ( 1*2*3 ) ~ 1.82 
 *
 * @returns geometric average 
 */ 
Unit.geometricAvgOfAttackSuccessProbabilities = function(units) {
    var totalAttackSuccessProbability = 1;
    units.forEach(function(unit){
        if (!(unit instanceof Unit)) {
            throw Error("Function accepts only units");
        }
        totalAttackSuccessProbability *= unit.calculateAttackSuccessProbability();
    });
     
    return Math.pow(totalAttackSuccessProbability, 1 / units.length);
}

/**
 * Export Unit
 */
module.exports = Unit;
