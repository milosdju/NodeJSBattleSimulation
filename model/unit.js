import { BattleConfig, BattleConfigProperty } from '../config/battle-config';

class Unit {

    /**
     * Constructor
     */
    constructor(health, recharge) {
        // Import default config
        this.defaultConfigs = new BattleConfig();

        // If property is null, set default value
        var defaultHealthValue = this.defaultConfigs.get(BattleConfigProperty.DEFAULT_HEALTH);
        this.health = health === null ? defaultHealthValue : health;

        var defaultRechargeValue = this.defaultConfigs.get(BattleConfigProperty.DEFAULT_RECHARGE);
        this.recharge = recharge === null ? defaultRechargeValue : recharge;

        // Validate health type and value
        if (health !== null && (typeof(health) !== 'number' || health < 1 || health > 100)) {
            throw Error("Health must be in range [1..100]")
        }
    
        // Validate recharge type
        if (typeof(recharge) !== 'number') {
            throw Error("Recharge must be number");
        }

    }
    
    /**
     * Geometry avg = nth root of all units multiplied, 
     * where n is # of units
     * 
     * arr = [1, 2, 3]
     * ga = nth root of ( 1*2*3 ) ~ 1.82 
     *
     * @returns geometric average 
     */ 
    static geometricAvgOfAttackSuccessProbabilities(units) {
        var totalAttackSuccessProbability = 1;
        units.forEach(function(unit){
            if (!(unit instanceof Unit)) {
                throw Error("Function accepts only units");
            }
            totalAttackSuccessProbability *= unit.calculateAttackSuccessProbability();
        });
         
        return Math.pow(totalAttackSuccessProbability, 1 / units.length);
    }
}

/**
 * Export Unit
 */
module.exports = Unit;
