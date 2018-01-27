var Unit = require('./unit'),
    Soldier = require('./soldier'),
    Vehicle = require('./vehicle'),
    Utils = require('../utils/utils');

/**
 * Squad constructor
 */
function Squad(strategy) {
    this.units = [];
    this.strategy = strategy;
};

/**
 * Add unit to squad
 * 
 * @param {Unit} unit 
 */
Squad.prototype.addUnit = function(unit) {
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
Squad.prototype.removeUnit = function(unit) {
    if (!(unit instanceof Unit)) {
        throw Error("Only Units can be part of squads");
    }

    var index = this.units.indexOf(unit);
    if (index !== -1) {
        this.units.splice(index, 1);
    } 
};

Squad.prototype.getSquadRechargeTime = function() {
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
Squad.prototype.calculateAttackSuccessProbability = function() {
    return Unit.geometricAvgOfAttackSuccessProbabilities(this.units);
};

/**
 * Inflicted damage by the squad is
 * sum of inflicted damages made by every unit in squad
 */
Squad.prototype.calculateInflictedDamage = function() {
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
Squad.prototype.receiveDamage = function(receivedDamage) {
    if (typeof(receivedDamage) !== "number") {
        throw Error("Received damage must be number");
    }

    var dealtDamage = receivedDamage / this.units.length;
    console.log("UNITS: " + this.units.length);
    this.units.forEach(function(unit) {
        alive = unit.receiveDamage(dealtDamage);
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
var decideWinner = function(firstSquad, secondSquad) {
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
Squad.prototype.attack = function(anotherSquad) {
    Utils.checkClass(anotherSquad, Squad, "Squad can attack only another Squad");

    // DECIDE WINNER
    var won = decideWinner(this, anotherSquad);

    // Increase experience of winner squad
    if (won) {
        this.units.forEach(function(unit){
            unit.increaseExperience();
        });
    }

    return won;
};

/**
 * 
 * @param {*} attackOrder 
 * 
 * @returns Chosen target squad following attacking squad strategy
 */
Squad.prototype.chooseTarget = function(attackOrder) {
    var enemies = []
    
    var strongest = null;
    var strongestAttackProbability = 0;

    var weakest = null;
    var weakestAttackProbability = 1;

    attackOrder.forEach(function(potentialTarget){
        if (potentialTarget.army !== attackOrder[0].army) {
            enemies.push(potentialTarget);
            // Choose strongest
            if (potentialTarget.attackProbability > strongestAttackProbability) {
                strongest = potentialTarget;
                strongestAttackProbability = potentialTarget.attackProbability;
            } 

            // Choose weakest
            if (potentialTarget.attackProbability < weakestAttackProbability) {
                weakest = potentialTarget;
                weakestAttackProbability = potentialTarget.attackProbability;
            }
        }
    });

    /**
     * Depending on squad attacking strategy
     * one of the chosen targets will be returned
     */
    if (this.strategy === 'random') {
        console.log("ENEMIES: " + enemies.length);
        index = Utils.randomFromRange(0, enemies.length - 1);
        return enemies[index];
    } else if (this.strategy === 'strongest') {
        return strongest;
    } else if (this.strategy === 'weakest') {
        return weakest;
    } else {
        throw Error("Strategy not known: " + this.strategy);
    }
};

/**
 * Export Squad constructor
 */
module.exports = Squad;