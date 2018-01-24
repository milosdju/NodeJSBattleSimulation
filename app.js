var Battle = require('./model/battle'),
    Soldier = require('./model/soldier');

console.log("cao");

s1 = new Soldier(null, 25, 0);
console.log("ATTACK: " + s1.calculateAttackSuccessProbability());
