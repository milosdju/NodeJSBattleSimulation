// Initialize Enum
class UnitType {};

// Initiliaze Enum instances
UnitType.SOLDIER = "soldier";
UnitType.VEHICLE = "vehicle";

// Export AttackStrategy Enum
Object.freeze(UnitType);
module.exports = UnitType;