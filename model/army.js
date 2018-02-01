import Unit from './unit';
import Squad from './squad';
import { BattleConfig, BattleConfigProperty } from '../config/battle-config';

class Army {

    /**
     * Army constructor
     */
    constructor(name) {
        this.defaultConfigs = new BattleConfig();

        // Initialize fields
        if (name === null) {
            throw Error("Army must be named");
        }
        this.name = name;
        this.squads = [];
    };

    /**
     * Add squad to army
     * 
     * @param {Squad} squad 
     */
   addSquad(squad) {
        Utils.checkClass(squad, Squad, "Only Squad can be part of armies");
        this.squads.push(squad);
    };

    /**
     * Remove dead squad from army
     * 
     * @param {Squad} squad 
     */
    removeSquad(squad) {
        Utils.checkClass(squad, Squad, "Only Squad can be part of armies");

        var index = this.squads.indexOf(squad);
        if (index !== -1) {
            this.squads.splice(index, 1);
        } 
    };

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