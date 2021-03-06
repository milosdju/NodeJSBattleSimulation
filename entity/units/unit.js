import Utils from '~/utils/utils';
import { BattleConfig, BattleConfigProperty } from '~/config/battle-config';

class Unit {

    /**
     * Unit Constructor
     * 
     * @throws Error if some of Unit constraints are not met:
     *      - type of health & health in proper range
     *      - type of recharge
     */
    constructor(health, recharge) {
        // Import default config
        this.defaultConfigs = new BattleConfig();

        // If property is null, set default value
        var defaultHealthValue = this.defaultConfigs.get(BattleConfigProperty.DEFAULT_HEALTH);
        this.health = health == null ? defaultHealthValue : health;

        var defaultRechargeValue = this.defaultConfigs.get(BattleConfigProperty.DEFAULT_RECHARGE);
        this.recharge = recharge == null ? defaultRechargeValue : recharge;

        // Validate Unit properties
        this.validateConditions();
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
     * 
     * @throws Error if non-Number argument is passed
     */
    receiveDamage(receivedDamage) {
        Utils.checkType(receivedDamage, "number", "Received damage must be number");

        this.health -= receivedDamage;
        return this.health > 0;
    }

    /**
     * @throws Error if some of constraints are not met:
     *      - health in proper range
     *      - type of recharge property
     */
    validateConditions() {
        // Validate health type and value
        var minHealth = this.defaultConfigs.get(BattleConfigProperty.MIN_HEALTH);
        var maxHealth = this.defaultConfigs.get(BattleConfigProperty.MAX_HEALTH);
        if (!Utils.validateType(this.health, "number") || this.health < minHealth || this.health > maxHealth) {
            throw Error(`Health [${this.health}] must be in range [${minHealth}".."${maxHealth}]`);
        }
    
        // Validate recharge type
        Utils.checkType(this.recharge, "number", "Recharge must be number");
    };

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
            totalAttackSuccessProbability *= unit.attackSuccessProbability;
        });
         
        return Math.pow(totalAttackSuccessProbability, 1 / units.length);
    }

    /**
     * Print some basic info about Unit
     */
    toString() {
        return `Unit { health: ${this.health.toFixed(2)}, recharge: ${this.recharge.toFixed(2)} }`;
    }
}

/**
 * Export Unit
 */
module.exports = Unit;
