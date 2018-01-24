/**
 * @param {*} min 
 * @param {*} max
 * 
 * @returns random int in range[min..max] (inclusive) 
 */
var randomFromRange = function(min, max) {
    if (typeof(min) !== 'number' || typeof(min) !== 'number') {
        throw Error("min and max parameters must be numbers");
    } 

    if (min > max) {
        throw Error("min parameter must be less than max parameter");
    }

    return min + Math.floor(Math.random() * (max - min + 1));
}

module.exports = {
    randomFromRange: randomFromRange
}