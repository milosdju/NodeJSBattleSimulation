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
};
/*
var sortAttackOrder = function(squad1, squad2) {
    return squad1.attackTime - squad2.attackTime;
}
*/
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

    return attackOrder;
};

/**
 * START
 */
Battle.prototype.start = function() {
    var attackOrder = this.initAttackOrder();
    
    while (armies.length > 1) {
        var attackingSquad = attackOrder[0].squad;

        // Choose target by attacking squad
        var target = attackingSquad.chooseTarget(attackOrder);

        // Perform ATTACK and deliver DAMAGE
        var won = attackingSquad.attack(target);

        // Modify ATTACK PROBABILITY and ATTACK TIME
        // for damaged squad
        if (won) {
            
        }
    }
};



/**
 * Export Battle
 */
module.exports = Battle;