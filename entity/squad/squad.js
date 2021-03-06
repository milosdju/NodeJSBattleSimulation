import AttackStrategy from './attack-strategy';
import Unit from '../units/unit';
import UnitType from '../units/unit-type';
import Soldier from '../units/soldier';
import Vehicle from '../units/vehicle';
import Utils from '~/utils/utils';

import AsyncLock from 'async-lock';
var lock = new AsyncLock();

import { BattleConfig, BattleConfigProperty } from '~/config/battle-config';

import logger from 'winston';

/**
 * Squad constructor
 */
class Squad {

    /**
     * Squad constructor
     * 
     * @param {String} name 
     * @param {String} strategy 
     */
    constructor(name, strategy) {
        this.defaultConfigs = new BattleConfig();
    
        // Initialize fields
        this.units = [];
        this.name = name;
        this.strategy = strategy;
    
        logger.debug(`Squad ${this.name} is built`);
    };

    /**
     * Add unit to squad
     * 
     * @param {Unit} unit 
     * 
     * @throws Error if non-Unit instance is passed to the function
     */
    addUnit(unit) {
        Utils.checkClass(unit, Unit, "Only Units can be part of squads");
        // TODO: check unit number constraint
        this.units.push(unit);
        logger.debug(`Unit has been assigned to Squad ${this.name}: ${unit.toString()}`);
    };
    
    /**
     * Remove dead unit from squad
     * 
     * @param {Unit} unit 
     * 
     * @throws Error if non-Unit instance is passed to the function
     */
    removeUnit(unit) {
        Utils.checkClass(unit, Unit, "Only Units can be part of squads");
    
        var index = this.units.indexOf(unit);
        if (index !== -1) {
            this.units.splice(index, 1);
        } 
        logger.destroyed(`Unit has been removed from Squad ${this.name}: ${unit.toString()}`);
    };
    
    /**
     * Factory method to create Unit of certain type
     * 
     * @param {Object} params 
     * 
     * @throws Error if unknown Unit type is passed
     */
    static makeUnit(params) {
        var type = params.type;
        var health = params.health;
        var recharge = params.recharge;
        if (type === UnitType.SOLDIER) {
            var experience = params.experience;
            return new Soldier(health, recharge, experience);
        } else if (type === UnitType.VEHICLE) {
            var numOfOperators = params.operators;
            var vehicle = new Vehicle(health, recharge);
            vehicle.addDefaultOperators(numOfOperators);
            return vehicle;
        } else {
            throw Error(`Unknown Unit type ${type}`);
        }
    };

    /**
     * Validate that all Squad constraints are met
     * 
     * @throws Error if some of constraints are not met:
     *      - must have name
     *      - must have strategy
     *      - min # of units
     *      - max # of units
     */
    validateConditions() {
        // Check strategy
        if (this.strategy == null) {
            throw Error("Strategy must be set");
        }

        // Check name
        if (this.name == null) {
            throw Error("Squad name must be set");
        }

        // Check unit number constraint
        var minUnits = this.defaultConfigs.get(BattleConfigProperty.MIN_UNITS);
        if (this.units.length < minUnits) {
            throw Error(`Number of squads must be greater than or equal to ${minUnits}`);
        }
        var maxUnits = this.defaultConfigs.get(BattleConfigProperty.MAX_UNITS);
        if (this.units.length > maxUnits) {
            throw Error(`Number of squads must be smaller than or equal to ${maxUnits}`);
        }
    }
    
    /**
     * @returns status - is alive
     */
    get alive() {
        return this.units.length > 0;
    }

    /**
     * @returns recharge time for squad
     */
    get recharge() {
        var maxRechargeTime = this.units[0].recharge;
        this.units.forEach(function(unit){
            if (unit.recharge > maxRechargeTime) {
                maxRechargeTime = unit.recharge;
            }
        });
    
        return maxRechargeTime;
    }
    
    /**
     * Total attack success probability (ASP) is calculated
     * as geometric average of all suctinct ASP's
     */
    recalculateAttackSuccessProbability() {
        this._attackSuccessProbability = Unit.geometricAvgOfAttackSuccessProbabilities(this.units);
    };
    
    /**
     * @returns cached attack success probability 
     */
    get attackSuccessProbability() {
        if (!this._attackSuccessProbability) {
            this.recalculateAttackSuccessProbability();
        }
        return this._attackSuccessProbability;
    }
    
    /**
     * Inflicted damage by the squad is
     * sum of inflicted damages made by every unit in squad
     * 
     * TODO: rename to inflicting
     */
    get inflictingDamage() {
        var totalInflictedDamage = 0;
        this.units.forEach(function(unit){
            totalInflictedDamage += unit.inflictingDamage;
        });
    
        return totalInflictedDamage;
    };
    
    /**
     * 
     * The damage received in battle is 
     * distributed evenly to all squad members
     * 
     * @param {number} reveivedDamage 
     * 
     * @throws Error if non-Number argument is passed
     */
    receiveDamage(receivedDamage) {
        Utils.checkType(receivedDamage, "number", "Received damage must be number");
        logger.damaged(`Squad ${this.name} received ${receivedDamage.toFixed(2)} damage [current avg health: ${this.overallHealth.toFixed(2)}]`);

        var dealtDamage = receivedDamage / this.units.length;
        this.units.forEach(function(unit) {
            var alive = unit.receiveDamage(dealtDamage);
            if (!alive) {
                this.removeUnit(unit);
            }
        }, this);
    };
    
    /**
     * 
     * Decide winner based on accumulated attack success probability
     * by the two squads
     * 
     * @param {Squad} firstSquad 
     * @param {Squad} secondSquad 
     * 
     * @returns TRUE  if firstSquad has won
     *          FALSE if secondSquad has won
     * 
     * @throws Error if non-Squad instances are passed to the function
     */
    _decideWinner(firstSquad, secondSquad) {
        Utils.checkClass(firstSquad, Squad, "Battle can occur only between Squads");
        Utils.checkClass(secondSquad, Squad, "Battle can occur only between Squads");
    
        var firstSquadChanceToWin = firstSquad.attackSuccessProbability;
        var secondSquadChanceToWin = secondSquad.attackSuccessProbability;
    
        var won = firstSquadChanceToWin > secondSquadChanceToWin;
        
        return won;
    };
    
    /**
     * 
     * Perform one attack of Squad against another one
     * 
     * @param {Battle} battle 
     */
    performAttack(battle) {
        var enemies = battle.pullEnemiesOfSquad(this);
        var targetSquad = this.chooseTarget(enemies);
        
        /**
         * Concurrency lock - if targetSquad is already attacked,
         * attacking squad need to wait 
         * until already began attack is finished
         */
        lock.acquire(targetSquad.name, done => {
            if (targetSquad.alive) {

                logger.debug(`Squad ${this.name} attacked ${targetSquad.name}`)

                // DECIDE WINNER
                var won = this._decideWinner(this, targetSquad);
                
                if (won) {
                    logger.info(`Squad attack: ${this.name} -> ${targetSquad.name} (successfully - inflicting ${this.inflictingDamage.toFixed(2)} damage)`);

                    // Deal damage to defeated squad
                    targetSquad.receiveDamage(this.inflictingDamage);

                    // Recalculate attack success probability for damaged squad
                    targetSquad.recalculateAttackSuccessProbability();

                    // After successful attack increase experience of winning squad
                    this.units.forEach(function(unit){
                        unit.increaseExperience();
                    });

                    // If attacked squad is destroyed, battle list should be refreshed
                    if (!targetSquad.alive) {
                        battle.refreshList();
                    }
                } else {
                    logger.info(`Squad attack: ${this.name} -> ${targetSquad.name} (unsuccessfully)`);
                }
                // Release the lock
                done();
            } 
        }).catch(function(err){
            console.err(err)
        });
    };

    /**
     * Method called by Battle to start attacking
     * Method is "recursivelly" called after recharge is completed
     * 
     * @param {Battle} battle 
     */
    attack(battle) {
        // ES6 handles easily "this reference" issue with setTimeout()
        setTimeout(() => {
            logger.debug(`Attack time for squad ${this.name}`)
            this.performAttack(battle);
            logger.debug(`Attack finished for squad ${this.name}`)
            
            // Attack can be performed only be non-destroyed squad
            if (this.alive) {
                this.attack(battle);
            }
        }, this.recharge);
    };
    
    /**
     * @returns mean average health of all units in squad
     */
    get overallHealth() {
        let totalHealth = 0;
        this.units.forEach(function(unit){
            totalHealth += unit.health;
        });
        return totalHealth / this.units.length;
    }

    /**
     * Estimated strength is calculated as geometric average over:
     *      - overallHealth
     *      - number of units
     *      - inflicting damage that squad can make
     *      - attack success probability of the squad
     * 
     * @returns estimated strength of the Squad
     */
    get strength() {
        let overallHealth = this.overallHealth;
        let numOfUnits = this.units.length;
        let inflictingDamage = this.inflictingDamage;
        let attackSuccessProbability = this.attackSuccessProbability;

        return Utils.calculateGeometricAverage(overallHealth, numOfUnits, inflictingDamage, attackSuccessProbability);
    }
    
    /**
     * @param {Squads} enemies
     * 
     * @returns strongest squad from enemy list
     */
    _chooseStrongestSquad(enemies) {
        var strongest = null;
        var strongestStrength = 0;
    
        enemies.forEach(function(potentialTarget){
            // Choose strongest
            if (potentialTarget.strength > strongestStrength) {
                strongest = potentialTarget;
                strongestStrength = potentialTarget.strength;
            } 
        });
    
        return strongest;
    };
    
    /**
     * @param {Squads} enemies
     * 
     * @returns weakest squad from enemy list
     */
    _chooseWeakestSquad(enemies) {
        var weakest = null;
        var weakestStrength = 1;
    
        enemies.forEach(function(potentialTarget){
            // Choose weakest
            if (potentialTarget.strength < weakestStrength) {
                weakest = potentialTarget;
                weakestStrength = potentialTarget.strength;
            }
        });
    
        return weakest;
    };
    
    /**
     * @param {Squads} enemies
     * 
     * @returns random squad from enemy list
     */
    _chooseRandomSquad(enemies) {
        var index = Utils.randomFromRange(0, enemies.length - 1);
        return enemies[index];
    };
    
    /**
     * 
     * @param {Squads} List of enemy squads 
     * 
     * @returns Chosen target squad following attacking squad strategy
     * 
     * @throws Error if Squad strategy is not defined
     */
    chooseTarget(enemies) {
        if (this.strategy === AttackStrategy.RANDOM) {
            return this._chooseRandomSquad(enemies);
        } else if (this.strategy === AttackStrategy.STRONGEST) {
            return this._chooseStrongestSquad(enemies);
        } else if (this.strategy === AttackStrategy.WEAKEST) {
            return this._chooseWeakestSquad(enemies);
        } else {
            throw Error("Strategy not known: " + this.strategy);
        }
    };

    /**
     * Print some basic info about Squad
     */
    toString() {
        return `strategy: ${this.strategy}, units: ${this.units}`;
    }
}

/**
 * Export Squad constructor
 */
module.exports = Squad;