class Example {

    /**
     * The constructor - Database will instantiate
     * @param value
     * @param value2
     */
    constructor(value, value2) {
        this.value = value;
        this.value2 = value2;
    }

    /**
     * Example function that return value + 3
     * @returns {*}
     */
    apiFunc(){              //example function
        return this.value + 3;
    }

    /**
     * Example getter that gets value
     * @returns {*}
     */
    get value(){            //example getter
        return this.value;
    }

    /**
     * Example setter that sets value
     * @param newValue
     */
    set value(newValue){
        this.value = newValue;
    }
}