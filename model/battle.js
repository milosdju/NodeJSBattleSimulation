var BattleConfig = require('../config/battle-config').BattleConfig,
    Army = require('./army'),
    Utils = require('../utils/utils');

/**
 * Constructor
 */
function Battle() {
    /**
     * Set default configuration
     */ 
    this.battleConfig = new BattleConfig();

    this.armies = [];
    this.attackOrderWithCashedValues = null;
};

/**
 * Add army in battlefield
 * 
 * @param {Army} army 
 */
Battle.prototype.addArmy = function(army) {
    Utils.checkClass(army, Army, "Only Army can fight in battles");
    // TODO: check squad number constraint
    this.armies.push(army);
};

/**
 * Remove defeated army from battlefield
 * 
 * @param {Army} army 
 */
Battle.prototype.removeArmy = function(army) {
    Utils.checkClass(army, Army, "Only Army can be removed from battlefield");

    var index = this.armies.indexOf(army);
    if (index !== -1) {
        this.armies.splice(index, 1);
    } 

    console.log("Army is removed");
};

var sortAttackOrder = function(squad1, squad2) {
    return squad1.attackTime - squad2.attackTime;
}

Battle.prototype.initAttackOrder = function() {
    var attackOrder = [];
    this.armies.forEach(function(army) {
        army.squads.forEach(function(squad){
            attackOrder.push({
                army: army,
                squad: squad,
                attackTime: 0,
                attackProbability: squad.calculateAttackSuccessProbability()
            });
        });
    });

    this.attackOrderWithCashedValues = attackOrder;
};

/**
 * START battle
 */
Battle.prototype.start = function() {
    this.initAttackOrder();
    
    while (this.armies.length > 1) {
        var attackingSquad = this.attackOrderWithCashedValues[0];

        // Choose target by attacking squad
        var targetSquad = attackingSquad.squad.chooseTarget(this.attackOrderWithCashedValues);

        // Perform ATTACK and deliver DAMAGE
        var won = attackingSquad.squad.attack(targetSquad.squad);

        // Modify ATTACK PROBABILITY and ATTACK TIME
        // for damaged squad
        if (won) {
            console.log(attackingSquad.squad + " won the battle against " + targetSquad.squad);
            // DAMAGE dealt to losing units
            var targetAlive = targetSquad.squad.receiveDamage(attackingSquad.squad.calculateInflictedDamage());
            
            if (targetAlive) {
                // If some units are lost in battle, attack success prob will be decreased
                targetSquad.attackProbability = targetSquad.squad.calculateAttackSuccessProbability();
            } else {
                targetSquad.army.removeSquad(targetSquad.squad);
                if (targetSquad.army.squads.length === 0) {
                    this.removeArmy(targetSquad.army);
                }
                this.attackOrderWithCashedValues.splice(this.attackOrderWithCashedValues.indexOf(targetSquad), 1);
            }
        } 

        /**
         * Reorder attacking turn on every iteration
         */
        attackingSquad.attackTime += attackingSquad.squad.getSquadRechargeTime();
        this.attackOrderWithCashedValues.sort(sortAttackOrder);
        console.log("AMRIES: " + this.armies.length);
    }

    console.log(this.armies[0].name + " has won");
};



/**
 * Export Battle
 */
module.exports = Battle;