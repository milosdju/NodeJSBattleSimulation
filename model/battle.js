var BattleConfig = require('../config/battle-config').BattleConfig,
    BattleConfigProperty = require('../config/battle-config').BattleConfigProperty,
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

    console.log("Army [" + army.name + "] is removed");
};

/**
 * In order to start battle, certain conditions should be met
 */
Battle.prototype.validateConditions = function() {
    /**
     * MIN number of armies per battle
     */
    var min_armies = this.battleConfig.get(BattleConfigProperty.MIN_ARMIES);
    if (this.armies.length < min_armies) {
        throw Error("Number of armies per battle must be greater than or equal to " + min_armies);
    }

    /**
     * MIN number of squads per army
     */
    this.armies.forEach(function(army){
        army.validateConditions();
    });

    /**
     * MIN & MAX number of units per squad
     */
    this.armies.forEach(function(army){
        army.squads.forEach(function(squad){
            squad.validateConditions();
        });
    });
}

/**
 * 
 * Helper method to sort attack list
 * 
 * @param {*} squad1 
 * @param {*} squad2 
 */
var sortAttackOrder = function(squad1, squad2) {
    return squad1.attackTime - squad2.attackTime;
}

/**
 * 
 * This method initializes attack order list
 * which has following format:
 * 
 * [
 *   {squad: sq1, attackTime 0},
 *   {squad: sq2, attackTime 100},
 *   {squad: sq5, attackTime 250},
 *   {squad: sq3, attackTime 600},
 *   {squad: sq4, attackTime 1300}
 * ]
 * 
 * squad - contain Squad instance
 * attackTime - represents squad.rechargeTime + time_of_last_attack
 * 
 * All squads begin with attackTime: 0
 * 
 */
Battle.prototype.initAttackOrder = function() {
    var attackOrder = [];
    this.armies.forEach(function(army) {
        army.squads.forEach(function(squad){
            squad.army = army;
            attackOrder.push({
                squad: squad,
                attackTime: 0
            });
        });
    });

    this.attackOrderWithCashedValues = attackOrder;
};

/**
 * 
 * When squad is destroyed, this method will be called in order to
 * remove it from scheduled attack
 * 
 * @param {Squad} squad 
 */
Battle.prototype.removeSquadFromScheduledAttackOrder = function(squad) {
    var idx = -1;
    this.attackOrderWithCashedValues.forEach(function(potentialSquad, i){
        if (squad === potentialSquad.squad) {
            idx = i;
        }
    }); 
    if (idx === -1) {
        throw Error("Squad not found in attack order list");
    } else {
        this.attackOrderWithCashedValues.splice(idx, 1);
    }
};

/** 
 * @param {Squad} squad 
 * 
 * @returns list of enemy squads in battle of passed squad
 */
Battle.prototype.pullEnemiesOfSquad = function(squad) {
    var enemies = [];
    this.attackOrderWithCashedValues.forEach(function(potentialEnemy) {
        if (squad.army !== potentialEnemy.squad.army) {
            enemies.push(potentialEnemy.squad);
        }
    });

    return enemies;
};

/**
 * START battle
 */
Battle.prototype.start = function() {
    /**
     * Validate conditions
     */
    this.validateConditions();

    /**
     * Initialize attack order list
     */
    this.initAttackOrder();
    
    /**
     * Iterate attacks until there is only one army left
     */
    while (this.armies.length > 1) {
        var attackingSquad = this.attackOrderWithCashedValues[0].squad;

        // Choose target by attacking squad
        var attackingSquadEnemies = this.pullEnemiesOfSquad(attackingSquad);
        var targetSquad = attackingSquad.chooseTarget(attackingSquadEnemies);

        // Perform ATTACK and deliver DAMAGE
        var won = attackingSquad.attack(targetSquad);

        // Modify ATTACK PROBABILITY and ATTACK TIME
        // for damaged squad
        if (won) {
            // DAMAGE is dealt to losing units
            var targetAlive = targetSquad.receiveDamage(attackingSquad.calculateInflictedDamage());

            if (targetAlive) {
                // If some units are lost in battle, attack success prob will be decreased
                targetSquad.recalculateAttackSuccessProbability();
            } else {
                targetSquad.army.removeSquad(targetSquad);

                // If all army squads are destroyed, remove army from battle
                if (targetSquad.army.squads.length === 0) {
                    this.removeArmy(targetSquad.army);
                }

                // Remove destroyed squad from scheduled attack order
                this.removeSquadFromScheduledAttackOrder(targetSquad);
            }
        } 

        /**
         * Reorder attacking turn on every iteration
         */
        this.attackOrderWithCashedValues[0].attackTime += attackingSquad.getSquadRechargeTime();
        this.attackOrderWithCashedValues.sort(sortAttackOrder);
    }

    console.log("Army [" + this.armies[0].name + "] has won");
};

/**
 * Export Battle
 */
module.exports = Battle;