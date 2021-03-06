import path from 'path';
import propertiesReader from 'properties-reader';

/**
 * Default Battle configuration file
 */
const configFile = "battle-config.properties";

/**
 * Enums for configuration properties
 */
var BattleConfigProperty = {
    // Battle config properties
    DEFAULT_STRATEGIES: "strategies",
    MIN_ARMIES: "min_armies",
    MIN_SQUADS: "min_squads_per_army",
    MIN_UNITS: "min_units_per_squad",
    MAX_UNITS: "max_units_per_squad",

    // Unit config properties
    DEFAULT_HEALTH: "default_health",
    MIN_HEALTH: "min_health",
    MAX_HEALTH: "max_health",

    DEFAULT_RECHARGE: "default_recharge",
    MIN_SOLDIER_RECHARGE: "min_soldier_recharge",
    MAX_SOLDIER_RECHARGE: "max_soldier_recharge",
    MIN_VEHICLE_RECHARGE: "min_vehicle_recharge",
    MAX_VEHICLE_RECHARGE: "max_vehicle_recharge",

    DEFAULT_EXPERIENCE: "default_experience",
    MIN_EXPERIENCE: "min_experience",
    MAX_EXPERIENCE: "max_experience",

    DEFAULT_NUM_OF_OPERATORS: "default_num_of_operators",
    MIN_NUM_OF_OPERATORS: "min_num_of_operators",
    MAX_NUM_OF_OPERATORS: "max_num_of_operators"

};
Object.freeze(BattleConfigProperty);

class BattleConfig {
    /**
     * BattleConfig constructor
     */
    constructor() {
        if (!BattleConfig.instance) {
            this.defaultBattleConfigs = propertiesReader(path.join(__dirname, configFile));
            
            // Validate configuration
            this.validateConfiguration();
            
            BattleConfig.instance = this;
        }
        return BattleConfig.instance;
    };

    /**
     * @throws Error if some of the constraints are not met
     */
    validateConfiguration() {
        /**
         * max_armies >= min_armies
         */
        var minArmies = this.get(this.defaultBattleConfigs.MIN_ARMIES);
        var maxArmies = this.get(this.defaultBattleConfigs.MAX_ARMIES);
        if (maxArmies != null && minArmies > maxArmies) {
            throw Error("Max number of armies must be >= min number of armies");
        }

        /**
         * max_squads >= min_squads
         */
        var minSquads = this.get(this.defaultBattleConfigs.MIN_SQUADS);
        var maxSquads = this.get(this.defaultBattleConfigs.MAX_SQUADS);
        if (maxSquads != null && minSquads > maxSquads) {
            throw Error("Max number of squads must be >= min number of squads");
        }

        /**
         * max_units >= min_units
         */
        var minUnits = this.get(this.defaultBattleConfigs.MIN_UNITS);
        var maxUnits = this.get(this.defaultBattleConfigs.MAX_UNITS);
        if (minUnits > maxUnits) {
            throw Error("Max number of units must be >= min number of units");
        }

    };

    /**
     * Getter
     * 
     * @returns property value
     * 
     */
    get(battleConfigProperty) {
        return this.defaultBattleConfigs.get(battleConfigProperty);
    };
}

/**
 * Export BattleConfig
 */
module.exports = {
    BattleConfig: BattleConfig,
    BattleConfigProperty : BattleConfigProperty
}