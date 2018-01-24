var Unit = require('./unit'),
    Soldier = require('./soldier'),
    Vehicle = require('./vehicle');

/**
 * Squad constructor
 */
function Squad() {
    this.units = [];
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
        totalInflictedDamage += unit.calculateInflictedDamage;
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
    if (receivedDamage !== 'number') {
        throw Error("Received damage must be number");
    }

    this.units.forEach(function(unit) {
        alive = unit.receiveDamage(receivedDamage / this.units.length);
        if (!alive) {
            this.removeUnit(unit);
        }
    });

    /**
     * If there is no more units left in squad,
     * alive = FALSE will be returned,
     * otherwise return TRUE
     */
    if (units.length === 0) {
        return false;
    } else {
        return true;
    }
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
    if (!(firstSquad instanceof Squad && secondSquad instanceof Squad)) {
        throw Error("Battle can occur only between Squads");
    }

    var firstSquadChanceToWin = firstSquad.calculateAttackSuccessProbability();
    var secondSquadChanceToWin = secondSquad.calculateAttackSuccessProbability();

    if (firstSquadChanceToWin > secondSquadChanceToWin) {
        return true;
    } else {
        return false;
    }
};

/**
 * 
 * Perform attack on another squad
 * 
 * @param {Squad} anotherSquad 
 */
Squad.prototype.attack = function(anotherSquad) {
    if (!(anotherSquad instanceof Squad)) {
        throw Error("Squad can attack only another Squad");
    }

    // DECIDE WINNER
    var won = decideWinner(this, anotherSquad);

    // REDISTRIBUTE DAMAGE
    if (won) {
        anotherSquad.receiveDamage(this.calculateInflictedDamage);
    }
};

/**
 * Export Squad constructor
 */
module.exports = Squad;