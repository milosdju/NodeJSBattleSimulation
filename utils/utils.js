/**
 * @param {Number} min 
 * @param {Number} max
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

/**
 * 
 * Throw Error with `errorMessage` if
 * value is not instance of class `clazz`
 * 
 * @param {*} value 
 * @param {*} clazz 
 * @param {*} errorMessage 
 */
var checkClass = function(value, clazz, errorMessage) {
    /**
     * Set default error message
     */
    if (errorMessage === null) {
        errorMessage = "Invalid input type: " + value + " should be " + clazz;
    }
    if (!(value instanceof clazz)) {
        throw Error(errorMessage);
    }
};

/**
 * Throw Error with `errorMessage` if
 * value is not of type `type`
 * 
 * @param {*} value 
 * @param {*} typeStr Must be string (i.e. type name, for example 'number')
 * @param {*} errorMessage 
 */
var checkType = function(value, typeStr, errorMessage) {
    /**
     * Set default error message
     */
    if (errorMessage === null) {
        errorMessage = "Invalid input type: " + value + " should be of type " + typeStr;
    }
    if (!(typeof(value) === typeStr)) {
        throw Error(errorMessage);
    }
}

module.exports = {
    randomFromRange: randomFromRange,
    checkType: checkType,
    checkClass: checkClass
}