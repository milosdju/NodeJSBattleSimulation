var Unit = require('./unit'),
    Squad = require('./squad');

/**
 * Army constructor
 */
function Army(name) {
    this.name = name;
    this.squads = [];
};

/**
 * Add squad to army
 * 
 * @param {Squad} squad 
 */
Army.prototype.addSquad = function(squad) {
    if (!(squad instanceof Squad)) {
        throw Error("Only Squad can be part of armies");
    }
    // TODO: check squad number constraint
    this.squads.push(squad);
};

/**
 * Remove dead squad from army
 * 
 * @param {Squad} squad 
 */
Army.prototype.removeSquad = function(squad) {
    if (!(squad instanceof Squad)) {
        throw Error("Only Squad can be part of armies");
    }

    var index = this.squads.indexOf(squad);
    if (index !== -1) {
        this.squads.splice(index, 1);
    } 
};

/**
 * Export Army
 */
module.exports = Army;