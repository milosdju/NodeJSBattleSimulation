class Utils {
    /**
     * @param {Number} min 
     * @param {Number} max
     * 
     * @returns random int in range[min..max] (inclusive) 
     */
    static randomFromRange(min, max) {
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
     * @param {String} errorMessage 
     */
    static checkClass(value, clazz, errorMessage) {
        /**
         * Set default error message
         */
        if (errorMessage == null) {
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
     * @param {String} typeStr Must be string (i.e. type name, for example 'number')
     * @param {String} errorMessage 
     */
    static checkType(value, typeStr, errorMessage) {
        /**
         * Set default error message
         */
        if (errorMessage == null) {
            errorMessage = "Invalid input type: " + value + " should be of type " + typeStr;
        }
        if (!Utils.validateType(value, typeStr)) {
            throw Error(errorMessage);
        }
    }

    /**
     * @param {*} value 
     * @param {String} typeStr
     * 
     * @returns TRUE if value is of type 'typeStr',
     *          FALSE otherwise 
     */
    static validateType(value, typeStr) {
        return typeof(value) === typeStr;
    }
}

module.exports = Utils;