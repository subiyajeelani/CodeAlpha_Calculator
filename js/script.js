
// SELECT HTML ELEMENTS

const currentOperandElement =
    document.getElementById("current-operand");

const previousOperandElement =
    document.getElementById("previous-operand");

const previewElement =
    document.getElementById("preview");

const numberButtons =
    document.querySelectorAll("[data-number]");

const operatorButtons =
    document.querySelectorAll("[data-operator]");

const actionButtons =
    document.querySelectorAll("[data-action]");


// CALCULATOR CLASS

class Calculator {

    constructor() {
        this.clear();
    }


    // RESET CALCULATOR

    clear() {
        this.currentOperand = "0";
        this.previousOperand = "";
        this.operation = undefined;
        this.shouldResetScreen = false;

        this.updateDisplay();
    }


    // DELETE LAST DIGIT

    delete() {

        if (this.currentOperand === "Error") {
            this.clear();
            return;
        }

        if (this.shouldResetScreen) {
            return;
        }

        if (this.currentOperand.length === 1) {
            this.currentOperand = "0";
        } else {
            this.currentOperand =
                this.currentOperand.slice(0, -1);
        }

        this.updateDisplay();
    }


    // ADD NUMBER

    appendNumber(number) {

        if (this.currentOperand === "Error") {
            this.clear();
        }

        if (this.shouldResetScreen) {
            this.currentOperand = "";
            this.shouldResetScreen = false;
        }

        if (number === "." &&
            this.currentOperand.includes(".")) {
            return;
        }

        if (this.currentOperand.length >= 15) {
            return;
        }

        if (number === "." &&
            this.currentOperand === "") {
            this.currentOperand = "0";
        }

        if (this.currentOperand === "0" &&
            number !== ".") {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }

        this.updateDisplay();
    }


    // SELECT OPERATOR

    chooseOperation(operation) {

        if (this.currentOperand === "Error") {
            return;
        }

        if (this.operation &&
            !this.shouldResetScreen) {
            this.compute();
        }

        this.previousOperand = this.currentOperand;
        this.operation = operation;
        this.shouldResetScreen = true;

        this.updateDisplay();
    }


    // PERFORM CALCULATION

    compute() {

        if (!this.operation ||
            this.shouldResetScreen) {
            return;
        }

        const previous =
            parseFloat(this.previousOperand);

        const current =
            parseFloat(this.currentOperand);

        let result;

        switch (this.operation) {

            case "+":
                result = previous + current;
                break;

            case "-":
                result = previous - current;
                break;

            case "*":
                result = previous * current;
                break;

            case "/":

                if (current === 0) {
                    this.currentOperand = "Error";
                    this.previousOperand = "";
                    this.operation = undefined;
                    this.shouldResetScreen = true;
                    this.updateDisplay();
                    return;
                }

                result = previous / current;
                break;

            default:
                return;
        }

        if (!Number.isFinite(result)) {
            this.currentOperand = "Error";
        } else {
            this.currentOperand =
                String(Number(result.toPrecision(12)));
        }

        this.previousOperand = "";
        this.operation = undefined;
        this.shouldResetScreen = true;

        this.updateDisplay();
    }


    // FORMAT OPERATOR

    getDisplayOperator() {

        const operators = {
            "+": "+",
            "-": "−",
            "*": "×",
            "/": "÷"
        };

        return operators[this.operation];
    }


    // LIVE RESULT PREVIEW

    getPreview() {

        if (!this.operation ||
            this.shouldResetScreen) {
            return "";
        }

        const previous =
            parseFloat(this.previousOperand);

        const current =
            parseFloat(this.currentOperand);

        let result;

        switch (this.operation) {

            case "+":
                result = previous + current;
                break;

            case "-":
                result = previous - current;
                break;

            case "*":
                result = previous * current;
                break;

            case "/":
                if (current === 0) {
                    return "Cannot divide by zero";
                }
                result = previous / current;
                break;

            default:
                return "";
        }

        if (!Number.isFinite(result)) {
            return "";
        }

        return "= " + Number(result.toPrecision(12));
    }


    // UPDATE DISPLAY

    updateDisplay() {

        currentOperandElement.innerText =
            this.currentOperand;

        if (this.operation) {

            previousOperandElement.innerText =
                this.previousOperand +
                " " +
                this.getDisplayOperator();

        } else {

            previousOperandElement.innerText = "";
        }

        previewElement.innerText =
            this.getPreview();
    }

}


// CREATE CALCULATOR OBJECT

const calculator = new Calculator();


// NUMBER BUTTON EVENTS

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        calculator.appendNumber(
            button.dataset.number
        );

    });

});


// OPERATOR BUTTON EVENTS

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        calculator.chooseOperation(
            button.dataset.operator
        );

    });

});


// SPECIAL BUTTON EVENTS

actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;

        switch (action) {

            case "clear":
                calculator.clear();
                break;

            case "delete":
                calculator.delete();
                break;

            case "decimal":
                calculator.appendNumber(".");
                break;

            case "calculate":
                calculator.compute();
                break;

        }

    });

});


// KEYBOARD SUPPORT

document.addEventListener("keydown", event => {

    const key = event.key;

    if (/^[0-9]$/.test(key)) {

        calculator.appendNumber(key);

    } else if (["+", "-", "*", "/"].includes(key)) {

        calculator.chooseOperation(key);

    } else if (key === ".") {

        calculator.appendNumber(".");

    } else if (key === "Enter" || key === "=") {

        event.preventDefault();
        calculator.compute();

    } else if (key === "Backspace") {

        calculator.delete();

    } else if (key === "Escape") {

        calculator.clear();

    }

});
