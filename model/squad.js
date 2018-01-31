import Unit from './unit';
import Soldier from './soldier';
import Vehicle from './vehicle';
import Utils from '../utils/utils';
import { BattleConfig, BattleConfigProperty } from '../config/battle-config';

/**
 * Squad constructor
 */
class Squad {

    constructor(strategy) {
        this.defaultConfigs = new BattleConfig();
    
        // Initialize fields
        this.units = [];
        this.strategy = strategy;
    
        this.attackSuccessProbability = null;
    };
    
    /**
     * Add unit to squad
     * 
     * @param {Unit} unit 
     */
    addUnit(unit) {
        if (!(unit instanceof Unit)) {
            throw Error("Only Units can be part of squads");
        }
        // TODO: check unit number constraint
        this.units.push(unit);
    };
    
    /**
     * Remove dead unit from squad
     * 
     * @param {Unit} unit 
     */
    removeUnit(unit) {
        if (!(unit instanceof Unit)) {
            throw Error("Only Units can be part of squads");
        }
    
        var index = this.units.indexOf(unit);
        if (index !== -1) {
            this.units.splice(index, 1);
        } 
    };
    
    validateConditions() {
        // Check unit number constraint
        var minUnits = this.defaultConfigs.get(BattleConfigProperty.MIN_UNITS);
        if (this.units.length < minUnits) {
            throw Error("Number of squads must be greater than or equal to " + minUnits);
        }
        var maxUnits = this.defaultConfigs.get(BattleConfigProperty.MAX_UNITS);
        if (this.units.length > maxUnits) {
            throw Error("Number of squads must be smaller than or equal to " + maxUnits);
        }
    }
    
    /**
     * @returns recharge time for squad
     */
    getSquadRechargeTime() {
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
    calculateAttackSuccessProbability() {
        return Unit.geometricAvgOfAttackSuccessProbabilities(this.units);
    };
    
    /**
     * Calculate attack success probability on this squad
     * and assign value as 'cache' to it
     */
    recalculateAttackSuccessProbability() {
        this.attackSuccessProbability = this.calculateAttackSuccessProbability();
    }
    
    /**
     * @returns cached attack success probability 
     */
    getAttackSuccessProbability() {
        if (!this.attackSuccessProbability) {
            this.recalculateAttackSuccessProbability();
        }
        return this.attackSuccessProbability;
    }
    
    /**
     * Inflicted damage by the squad is
     * sum of inflicted damages made by every unit in squad
     */
    calculateInflictedDamage() {
        var totalInflictedDamage = 0;
        this.units.forEach(function(unit){
            totalInflictedDamage += unit.calculateInflictedDamage();
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
     * @returns TRUE  if squad is still operable
     *          FALSE if squad is not anymore operable (i.e. all units are dead)
     */
    receiveDamage(receivedDamage) {
        if (typeof(receivedDamage) !== "number") {
            throw Error("Received damage must be number");
        }
    
        var dealtDamage = receivedDamage / this.units.length;
        this.units.forEach(function(unit) {
            var alive = unit.receiveDamage(dealtDamage);
            if (!alive) {
                this.removeUnit(unit);
            }
        }, this);
    
        /**
         * If there is no more units left in squad,
         * alive = FALSE will be returned,
         * otherwise return TRUE
         */
        return this.units.length > 0;
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
     */
    _decideWinner(firstSquad, secondSquad) {
        Utils.checkClass(firstSquad, Squad, "Battle can occur only between Squads");
        Utils.checkClass(secondSquad, Squad, "Battle can occur only between Squads");
    
        var firstSquadChanceToWin = firstSquad.calculateAttackSuccessProbability();
        var secondSquadChanceToWin = secondSquad.calculateAttackSuccessProbability();
    
        var won = firstSquadChanceToWin > secondSquadChanceToWin;
        
        return won;
    };
    
    /**
     * 
     * Perform attack on another squad
     * 
     * @param {Squad} anotherSquad 
     * 
     * @returns TRUE  if firstSquad has won
     *          FALSE if secondSquad has wo
     */
    attack(anotherSquad) {
        Utils.checkClass(anotherSquad, Squad, "Squad can attack only another Squad");
    
        // DECIDE WINNER
        var won = this._decideWinner(this, anotherSquad);
    
        // Increase experience of winner squad
        if (won) {
            this.units.forEach(function(unit){
                unit.increaseExperience();
            });
        }
    
        return won;
    };
    
    /**
     * @param {Squads} enemies
     * @returns strongest squad from enemy list
     */
    _chooseStrongestSquad(enemies) {
        var strongest = null;
        var strongestAttackProbability = 0;
    
        enemies.forEach(function(potentialTarget){
            // Choose strongest
            if (potentialTarget.getAttackSuccessProbability() > strongestAttackProbability) {
                strongest = potentialTarget;
                strongestAttackProbability = potentialTarget.getAttackSuccessProbability();
            } 
        });
    
        return strongest;
    };
    
    /**
     * @param {Squads} enemies
     * @returns weakest squad from enemy list
     */
    _chooseWeakestSquad(enemies) {
        var weakest = null;
        var weakestAttackProbability = 1;
    
        enemies.forEach(function(potentialTarget){
            // Choose weakest
            if (potentialTarget.getAttackSuccessProbability() < weakestAttackProbability) {
                weakest = potentialTarget;
                weakestAttackProbability = potentialTarget.getAttackSuccessProbability();
            }
        });
    
        return weakest;
    };
    
    /**
     * @param {Squads} enemies
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
     */
    chooseTarget(enemies) {
        if (this.strategy === 'random') {
            return this._chooseRandomSquad(enemies);
        } else if (this.strategy === 'strongest') {
            return this._chooseStrongestSquad(enemies);
        } else if (this.strategy === 'weakest') {
            return this._chooseWeakestSquad(enemies);
        } else {
            throw Error("Strategy not known: " + this.strategy);
        }
    };

}

/**
 * Export Squad constructor
 */
module.exports = Squad;