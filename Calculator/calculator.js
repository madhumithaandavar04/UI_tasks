const calculator = {
    /**add function */
    addTwoNumbers: function (a, b) {
        return a + b;
    },
    /**subtract function */
    subtractTwoNumbers: function (a, b) {
        return a - b;
    },
    /**multiply function */
    multiplyTwoNumbers: function (a, b) {
        return a * b;
    },
    /**div≠ide function */
    divideTwoNumbers: function (a, b) {
        if (b == 0) {
            throw new Error("Error : Division by zero is not allowed");
        }
        return a / b;
    }
}

try {
    const result = calculator.divideTwoNumbers(1, 0);
    console.log(result);
}
catch (error) {
    console.log(error.message);
}

