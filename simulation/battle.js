import Army from '~/entity/army/army';
import Squad from '~/entity/squad/squad';
import Unit from '~/entity/units/unit';
import Utils from '~/utils/utils';
import { BattleConfig, BattleConfigProperty } from '~/config/battle-config';
import config from 'config';

class Battle {
    /**
     * Constructor
     */
    constructor() {
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
    addArmy(army) {
        Utils.checkClass(army, Army, "Only Army can fight in battles");
        // TODO: check squad number constraint
        this.armies.push(army);
    };

    /**
     * Remove defeated army from battlefield
     * 
     * @param {Army} army 
     */
    removeArmy(army) {
        Utils.checkClass(army, Army, "Only Army can be removed from battlefield");

        var index = this.armies.indexOf(army);
        if (index !== -1) {
            this.armies.splice(index, 1);
        } 

        console.log("Army [" + army.name + "] is removed");
    };

    loadArmiesFromConfig() {
        if (!config.has('armies')) {
            throw Error("Armies must be configured in config/default.json file");
        }

        var armies = config.get('armies');
        armies.forEach(function(army){
            var a = new Army(army.name);

            army.squads.forEach(function(squad){
                var s = new Squad(squad.name, squad.strategy);

                squad.units.forEach(function(unit){
                    if (unit.quantity == null) {
                        s.addUnit(Squad.makeUnit(unit));
                    } else {
                        for (var i = 0; i < unit.quantity; i++) {
                            s.addUnit(Squad.makeUnit(unit));
                        }
                    }
                });

                a.addSquad(s);
            });
            this.addArmy(a);
        }, this);
    }

    /**
     * In order to start battle, certain conditions should be met
     */
    validateConditions() {
        /**
         * Check presence of configured armies
         */
        if (!config.has('armies')) {
            throw Error("Armies must be configured in config/default.json file");
        }

        /**
         * MIN number of armies per battle
         */
        var minArmies = this.battleConfig.get(BattleConfigProperty.MIN_ARMIES);
        if (this.armies.length < minArmies) {
            throw Error("Number of armies per battle must be greater than or equal to " + minArmies);
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
    _sortAttackOrder(squad1, squad2) {
        return squad1.attackTime - squad2.attackTime;
    };

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
    initAttackOrder() {
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
    removeSquadFromScheduledAttackOrder(squad) {
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
    pullEnemiesOfSquad(squad) {
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
    start() {
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
            this.attackOrderWithCashedValues.sort(this._sortAttackOrder);
        }

        console.log("Army [" + this.armies[0].name + "] has won");
    };
}


/**
 * Export Battle
 */
module.exports = Battle;