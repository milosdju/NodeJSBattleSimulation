var path = require('path'),
    propertiesReader = require('properties-reader');

/*
 * Default Battle configuration file
 */
const configFile = "battle-config.properties";

/**
 * Enums for configuration properties
 */
var BattleConfigProperty = {
    DEFAULT_STRATEGIES : "strategies",
    ARMY_MIN: "min_armies",
    SQUADS_MIN: "min_squads_per_army",
    UNITS_MIN: "min_units_per_squad",
    UNITS_MAX: "max_units_per_squad"
};
Object.freeze(BattleConfigProperty);

/**
 * BattleConfig class (prototype)
 */
function BattleConfig() {
    this.defaultBattleConfigs = propertiesReader(path.join(__dirname, configFile));
    /**
     * Set default configuration
     */
    this.resetConfiguration();
}

BattleConfig.prototype.config = function(excludes, maxValues, minValues) {
    /**
     * Exclude some of default strategies
     */
    if (excludes != null) {
        excludeStrategy(excludes.strategies, this.default_strategies);
    }

    /**
     * Set max number constraints
     */
    if (maxValues != null) {
        setConstraint(maxValues.armies, this.max_armies);
        setConstraint(maxValues.squads_per_army, this.max_squads);
        setConstraint(maxValues.armies, this.max_armies);
    }

    /**
     * Set min number constraints
     */
    if (minValues != null) {
        setConstraint(minValues.armies, this.min_armies);
        setConstraint(minValues.squads_per_army, this.min_squads);
        setConstraint(minValues.armies, this.min_armies);
    }

    /**
     * Check configuration validity
     */
    this.validateConfiguration();
};

var excludeStrategy = function(strategies, defaultStrategies) {
    if (strategies == null || !Array.isArray(strategies)) {
        throw Error("Strategies field need to be an array");
    }

    strategies.forEach(function(strategy){
        /**
         * Check is strategy one of default strategies
         */
        index = defaultStrategies.indexOf(strategy);
        if (index === -1) {
            throw Error("Strategy " + strategy + " is not default strategy");
        }

        /**
         * If so, remove it from default list
         */
        defaultStrategies.splice(index, 1);
    });
};

BattleConfig.prototype.resetConfiguration = function() {
    this.min_armies = this.getMaxMinConstraint(BattleConfigProperty.ARMY_MIN);
    this.min_squads = this.getMaxMinConstraint(BattleConfigProperty.SQUADS_MIN);
    this.min_units = this.getMaxMinConstraint(BattleConfigProperty.UNITS_MIN);
    this.max_units = this.getMaxMinConstraint(BattleConfigProperty.UNITS_MAX);
    this.default_strategies = this.getDefaultStrategies();
}

BattleConfig.prototype.validateConfiguration = function() {
    var valid = true;
    var message = null;
    /**
     * max_armies >= min_armies
     */
    if (this.max_armies != null && this.min_armies > this.max_armies) {
        valid = false;
        message = "Max number of armies must be >= min number of armies";
    }

    /**
     * max_squads >= min_squads
     */
    if (this.max_squads != null && this.min_squads > this.max_squads) {
        valid = false;
        message = "Max number of squads must be >= min number of squads";
    }

    /**
     * max_units >= min_units
     */
    if (this.min_units > this.max_units) {
        valid = false;
        message = "Max number of units must be >= min number of units";
    }

    if (!valid) {
        this.resetConfiguration(this.defaultBattleConfig);
        throw Error(message);
    }
}

/**
 * Getters & Setters
 */
BattleConfig.prototype.getDefaultStrategies = function() {
    var defaultStrategies = this.defaultBattleConfigs.get(BattleConfigProperty.DEFAULT_STRATEGIES);
    return defaultStrategies.split('|');
};

BattleConfig.prototype.getMaxMinConstraint = function(battleConfigProperty) {
    var maxminConstraint = this.defaultBattleConfigs.get(battleConfigProperty);
    if (typeof(maxminConstraint) !== 'number') {
        throw Error(battleConfigProperty + " must be number");
    }
    return maxminConstraint;
}

var setConstraint = function(newValue, field) {
    if (newValue != null) {
        field = newValue;
    }
};

/**
 * Export BattleConfig
 */
module.exports = BattleConfig;