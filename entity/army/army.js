import Unit from '../units/unit';
import Squad from '../squad/squad';
import Utils from '~/utils/utils';

import { BattleConfig, BattleConfigProperty } from '~/config/battle-config';

import logger from 'winston';

class Army {

    /**
     * Army constructor
     * 
     * @throws Error if Army has no name
     */
    constructor(name) {
        this.defaultConfigs = new BattleConfig();

        // Initialize fields
        if (name == null) {
            throw Error("Army must be named");
        }
        this.name = name;
        this.squads = [];
    };

    /**
     * Add squad to army
     * 
     * @param {Squad} squad 
     * 
     * @throws Error if non-Squad instance is passed to the function
     */
   addSquad(squad) {
        Utils.checkClass(squad, Squad, "Only Squad can be part of armies");
        this.squads.push(squad);
        logger.debug(`Squad has been assigned to Army ${this.name}: ${squad.name}`);
    };

    /**
     * Remove dead squad from army
     * 
     * @param {Squad} squad 
     * 
     * @throws Error if non-Squad instance is passed to the function
     */
    removeSquad(squad) {
        Utils.checkClass(squad, Squad, "Only Squad can be part of armies");

        var index = this.squads.indexOf(squad);
        if (index !== -1) {
            this.squads.splice(index, 1);
        } 
        logger.destroyed(`Squad has been removed from Army ${this.name}: ${squad.name}`);
    };

    /**
     * Validate creation Army constraints
     * 
     * @throws Error if if some of constraints are not met:
     *      - min # of squads
     */
    validateConditions() {
        // Check squad number constraint
        var minSquads = this.defaultConfigs.get(BattleConfigProperty.MIN_SQUADS);
        if (this.squads.length < minSquads) {
            throw Error("Number of squads must be greater than or equal to " + minSquads);
        }
    };
}

/**
 * Export Army
 */
module.exports = Army;