var path = require('path'),
    propertiesReader = require('properties-reader');

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
    MIN_VEHICLE_RECHARGE: "max_vehicle_recharge",

    DEFAULT_EXPERIENCE: "default_experience",
    MIN_EXPERIENCE: "min_experience",
    MAX_EXPERIENCE: "max_experience",

    DEFAULT_NUM_OF_OPERATORS: "default_num_of_operators",
    MIN_NUM_OF_OPERATORS: "min_num_of_operators",
    MAX_NUM_OF_OPERATORS: "max_num_of_operators"

};
Object.freeze(BattleConfigProperty);

/**
 * BattleConfig class (prototype)
 */
function BattleConfig() {
    this.defaultBattleConfigs = propertiesReader(path.join(__dirname, configFile));
    
    // Validate configuration
    this.validateConfiguration();
};

BattleConfig.prototype.validateConfiguration = function() {
    var valid = true;
    var message = null;
    /**
     * max_armies >= min_armies
     */
    min_armies = this.get(this.defaultBattleConfigs.MIN_ARMIES);
    max_armies = this.get(this.defaultBattleConfigs.MAX_ARMIES);
    if (max_armies != null && min_armies > max_armies) {
        valid = false;
        message = "Max number of armies must be >= min number of armies";
    }

    /**
     * max_squads >= min_squads
     */
    min_squads = this.get(this.defaultBattleConfigs.MIN_SQUADS);
    max_squads = this.get(this.defaultBattleConfigs.MAX_SQUADS);
    if (max_squads != null && min_squads > max_squads) {
        valid = false;
        message = "Max number of squads must be >= min number of squads";
    }

    /**
     * max_units >= min_units
     */
    min_units = this.get(this.defaultBattleConfigs.MIN_UNITS);
    max_units = this.get(this.defaultBattleConfigs.MAX_UNITS);
    if (min_units > max_units) {
        valid = false;
        message = "Max number of units must be >= min number of units";
    }

    if (!valid) {
        this.resetConfiguration(this.defaultBattleConfig);
        throw Error(message);
    }
};

/**
 * Getter
 * 
 * @returns property value
 * 
 */
BattleConfig.prototype.get = function(battleConfigProperty) {
    return this.defaultBattleConfigs.get(battleConfigProperty);
};

/**
 * Export BattleConfig
 */
module.exports = {
    BattleConfig: BattleConfig,
    BattleConfigProperty : BattleConfigProperty
}