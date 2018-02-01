import Utils from '../utils/utils';
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
        if (health !== null && (!Utils.validateType(health, "number") || health < 1 || health > 100)) {
            throw Error("Health must be in range [1..100]")
        }
    
        // Validate recharge type
        Utils.checkType(recharge, "number", "Recharge must be number");

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
    receiveDamage(receivedDamage) {
        Utils.checkType(receivedDamage, "number", "Received damage must be number");

        this.health -= receivedDamage;
        return this.health <= 0;
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
            Utils.checkClass(unit, Unit, "Function accepts only units");
            totalAttackSuccessProbability *= unit.calculateAttackSuccessProbability();
        });
         
        return Math.pow(totalAttackSuccessProbability, 1 / units.length);
    }
}

/**
 * Export Unit
 */
module.exports = Unit;
