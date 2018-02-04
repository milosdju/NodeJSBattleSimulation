import Unit from './unit';
import Utils from '~/utils/utils';
import { BattleConfigProperty } from '~/config/battle-config';

class Soldier extends Unit {

    /**
     * Soldier Constructor
     * 
     * @param {Number} health 
     * @param {Number} recharge 
     * @param {Number} experience 
     * 
     * @throws Error if some of Soldier constraints are not met:
     *      - type of health & health in proper range
     *      - type of recharge & recharge in proper range
     *      - type of experience & experience in proper range
     */
    constructor(health, recharge, experience) {
        super(health, recharge);

        // if experience is null, set default property
        var defaultExperienceValue = this.defaultConfigs.get(BattleConfigProperty.DEFAULT_EXPERIENCE);
        this.experience = experience == null ? defaultExperienceValue : experience;

        this.validateSoldierConditions();
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

    /**
     * @throws Error if certain condition is not met:
     *      - type of health & health in proper range
     *      - type of recharge & recharge in proper range
     *      - type of experience & experience in proper range
     */
    validateSoldierConditions() {
        super.validateConditions();
        // Validate recharge value
        var minRecharge = this.defaultConfigs.get(BattleConfigProperty.MIN_SOLDIER_RECHARGE);
        var maxRecharge = this.defaultConfigs.get(BattleConfigProperty.MAX_SOLDIER_RECHARGE);
        if (this.recharge < minRecharge || this.recharge > maxRecharge) {
            throw Error("Recharge for soldier must be in range [" + minRecharge + ".." + maxRecharge + "]");
        }

        // Validate experience type and value
        var minExperience = this.defaultConfigs.get(BattleConfigProperty.MIN_EXPERIENCE);
        var maxExperience = this.defaultConfigs.get(BattleConfigProperty.MAX_EXPERIENCE);
        if (!Utils.validateType(this.experience, "number") 
            || this.experience < minExperience || this.experience > maxExperience) {
            throw Error("Experience must be in range [" + minExperience + ".." + maxExperience + "]");
        }
    }

    /**
     * Print some basic info about Soldier
     */
    toString() {
        return `Soldier { health: ${this.health.toFixed(2)}, recharge: ${this.recharge.toFixed(2)}, 
        experience: ${this.experience} }`;
    }
}

/**
 * Export Soldier constructor
 */
module.exports = Soldier;