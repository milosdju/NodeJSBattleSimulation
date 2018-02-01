import Unit from './unit';
import Utils from '../utils/utils';
import { BattleConfigProperty } from '../config/battle-config';

class Soldier extends Unit {

    /**
     * Constructor
     * 
     * @param {Number} health 
     * @param {Number} recharge 
     * @param {Number} experience 
     */
    constructor(health, recharge, experience) {
        super(health, recharge);

        // if experience is null, set default property
        var defaultExperienceValue = this.defaultConfigs.get(BattleConfigProperty.DEFAULT_EXPERIENCE);
        this.experience = experience === null ? defaultExperienceValue : experience;

        // Validate recharge value
        if (this.recharge < 100 || this.recharge > 2000) {
            throw Error("Recharge for soldier must be in range [100..2000]");
        }

        // Validate experience type and value
        if (this.experience !== null && 
            (!Utils.validateType(this.experience, "number") || this.experience < 0 || this.experience > 50)) {
            throw Error("Experience [" + this.experience + "] must be in range [0..50]");
        }
    }

    /**
     * Increase experience by 1
     */
    increaseExperience() {
        if (this.experience < 50) {
            this.experience++;
        }
    }

    /**
     * Attack success probability is calculated with this formula:
     * F: 0.5 * (1 + health/100) * random(50 + experience, 100) / 100
     */
    calculateAttackSuccessProbability() {
        return 0.5 * (1 + this.health/100) * Utils.randomFromRange(50 + this.experience, 100) / 100;
    }

    /**
     * Inflicted damage is calculated with this formula:
     * F: 0.05 + experience / 100
     */
    calculateInflictedDamage() {
        return 0.05 + this.experience / 100;
    }

}

/**
 * Export Soldier constructor
 */
module.exports = Soldier;