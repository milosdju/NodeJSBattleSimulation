import Unit from './unit';
import Soldier from './soldier';
import Utils from '~/utils/utils';
import { BattleConfigProperty } from '~/config/battle-config';

class Vehicle extends Unit {
    /**
     * Vehicle Constructor
     * 
     * @param {Number} health 
     * @param {Number} recharge 
     * 
     * @throws Error if some of Vehicle constraints are not met:
     *      - type of health & health in proper range
     *      - type of recharge & recharge in proper range
     */
    constructor(health, recharge) {
        // Call super constructor
        super(health, recharge);

        // Validate recharge type and value
        var minRecharge = this.defaultConfigs.get(BattleConfigProperty.MIN_VEHICLE_RECHARGE);
        var maxRecharge = this.defaultConfigs.get(BattleConfigProperty.MAX_VEHICLE_RECHARGE);
        if (!Utils.validateType(this.recharge, 'number') || this.recharge < minRecharge || this.recharge > maxRecharge) {
            throw Error(`Recharge for vehicle must be in range [${minRecharge}..${maxRecharge}]`);
        }

        // Initialize fields
        this.operators = [];
    }

    /**
     * Add soldier to vehicle
     * 
     * @param {Soldier} soldier 
     * 
     * @throws Error if:
     *      - non-Soldier instance is passed to the function
     *      - maximum number of operators is reached
     */
    addOperator(soldier) {
        Utils.checkClass(soldier, Soldier, "Only Soldier can be operator");
        
        // Check unit number constraint
        var maxOperators = this.defaultConfigs.get(BattleConfigProperty.MAX_NUM_OF_OPERATORS);
        if (this.operators.length === maxOperators) {
            throw Error(`Maximum number of operators per vehicle (${maxOperators}) is reached`);
        }
        this.operators.push(soldier);
    };

    /**
     * Remove dead soldier from vehicle
     * 
     * @param {Soldier} soldier 
     * 
     * @throws Error if non-Soldier instance is passed to the function
     */
    removeOperator(soldier) {
        Utils.checkClass(soldier, Soldier, "Only Soldier can be operator");

        var index = this.operators.indexOf(soldier);
        if (index !== -1) {
            this.operators.splice(index, 1);
        } 
    };

    /**
     * Add passed number of default operators
     * 
     * @param {Number} numOfOperators 
     */
    addDefaultOperators(numOfOperators) {
        for (var i = 0; i < numOfOperators; i++) {
            this.addOperator(new Soldier(null, null, null));
        }
    }

    increaseExperience() {
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
     * 
     * @throws Error if non-Number argument is passed
     */
    receiveDamage(receivedDamage) {
        Utils.checkType(receivedDamage, "number", "Received damage must be number")

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
        }, this);

        /**
         * 
         * If vehicle is totally brokern OR
         * there is no more operators left in it,
         * alive = FALSE will be returned,
         * otherwise return TRUE
         */
        return this.health > 0 && this.operators.length !== 0;
    }

    /**
     * Attack success probability is calculated with this formula:
     * F: 0.5 * (1 + vehicle.health / 100) * gavg(operators.attack_success)
     * 
     * @returns Total vehicles attack success probability
     */
    get attackSuccessProbability() {
        return 0.5 * (1 + this.health/100) * Unit.geometricAvgOfAttackSuccessProbabilities(this.operators);
    }

    /**
     * Inflicted damage is calculated with this formula:
     * F: 0.1 + sum(operators.experience / 100)
     * 
     * @returns Inflicted damage by the vehicle
     */
    get inflictingDamage() {
        var experienceSum = 0;
        this.operators.forEach(function(operator){
            experienceSum += operator.experience;
        });
        return 0.1 + experienceSum / 100;
    }

    /**
     * Print some basic info about Vehicle
     */
    toString() {
        return `Vehicle { health: ${this.health.toFixed(2)}, recharge: ${this.recharge.toFixed(2)}, 
        operators: ${this.operators} }`;
    }
}

/**
 * Export Vehicle constructor
 */
module.exports = Vehicle;