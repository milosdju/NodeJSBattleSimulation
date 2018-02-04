class Utils {
    /**
     * @param {Number} min 
     * @param {Number} max
     * 
     * @returns random int in range[min..max] (inclusive) 
     * 
     * @throws Error if certain conditions are not met:
     *      - arguments must be of type Number
     *      - `min` can not be greater than `max`
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
     * @param {Number} numbers 
     * 
     * @returns geometric average of passed numbers
     */
    static calculateGeometricAverage(...numbers) {
        let total = 1;
        numbers.forEach(function(num){
            total *= num;
        });
        return Math.pow(total, 1 / numbers.length);
    }

    /**
     * Validate is `value` of type `clazz` 
     * 
     * @param {*} value 
     * @param {*} clazz 
     * @param {String} errorMessage 
     * 
     * @throws Error if:
     *      - invalid type of `errorMessage`
     *      - `value` is not of type `clazz` with message `errorMessage`
     */
    static checkClass(value, clazz, errorMessage) {
        /**
         * Set default error message
         */
        if (errorMessage == null) {
            errorMessage = `Invalid input type: ${value} should be ${clazz}`;
        }
        if (!(value instanceof clazz)) {
            throw Error(errorMessage);
        }
    };

    /**
     * Validate is `value` of type `typeStr`
     * 
     * @param {*} value 
     * @param {String} typeStr Must be string (i.e. type name, for example 'number')
     * @param {String} errorMessage 
     * 
     * @throws Error with `errorMessage` if
     * value is not of type `type`
     */
    static checkType(value, typeStr, errorMessage) {
        /**
         * Set default error message
         */
        if (errorMessage == null) {
            errorMessage = `Invalid input type: ${value} should be of type ${typeStr}`;
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