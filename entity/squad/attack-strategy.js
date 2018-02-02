// Initialize Enum
class AttackStrategy {};

// Initiliaze Enum instances
AttackStrategy.RANDOM = "random";
AttackStrategy.STRONGEST = "strongest";
AttackStrategy.WEAKEST = "weakest";

// Export AttackStrategy Enum
Object.freeze(AttackStrategy);
module.exports = AttackStrategy;