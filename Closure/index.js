function Bank() {
    let accountList = [];

    // --- Utility Functions ---
    const generateRandomDigit = () => Math.floor(Math.random() * 10);
    const generateNonZeroDigit = () => Math.floor(Math.random() * 9) + 1;

    const createIdentificationNumber = (length) => {
        let identificationNumber = generateNonZeroDigit().toString();
        for (let i = 1; i < length; i++) {
            identificationNumber += generateRandomDigit().toString();
        }
        return identificationNumber;
    };

    /**
     * Validates and parses numeric input from prompts
     */
    const getValidatedNumericInput = (userInput) => {
        if (userInput === null) return null; 
        
        const trimmedInput = userInput.trim();
        const parsedAmount = parseFloat(trimmedInput);
        
        if (isNaN(parsedAmount) || trimmedInput === "") {
            throw new Error("Invalid input: Please enter a numeric value.");
        }
        return parsedAmount;
    };

    // --- BankAccount Factory ---
    function BankAccount(securePin, initialBalance) {
        // Private properties
        const accountNumber = createIdentificationNumber(12);
        const cardNumber = createIdentificationNumber(16);
        let currentBalance = initialBalance;
        let accountPin = securePin;

        const verifyCredentials = (inputCard, inputPin) => {
            if (inputCard !== cardNumber || inputPin !== accountPin) {
                throw new Error("Incorrect PIN or Card Number.");
            }
            return true;
        };

        return {
            depositFunds: (inputCard, inputPin, depositAmount) => {
                verifyCredentials(inputCard, inputPin);
                if (depositAmount <= 0) new Error("Transaction Failed: Deposit must be greater than zero.");
                
                currentBalance += depositAmount;
                return `Deposit Successful. New Balance: $${currentBalance.toFixed(2)}`;
            },
            withdrawFunds: (inputCard, inputPin, withdrawalAmount) => {
                verifyCredentials(inputCard, inputPin);
                if (withdrawalAmount <= 0)throw new Error("Transaction Failed: Withdrawal must be positive.");
                if (withdrawalAmount > currentBalance) return "Transaction Failed: Insufficient funds.";
                
                currentBalance -= withdrawalAmount;
                return `Withdrawal Successful. New Balance: $${currentBalance.toFixed(2)}`;
            },
            getSummary: () => {
                return `--- Account Statement ---
Account Number : ${accountNumber}
Card Number    : ${cardNumber}
Current Balance: $${currentBalance.toFixed(2)}
-------------------------`;
            },
            getCardNumber: () => cardNumber
        };
    }

    // --- Initialization Logic ---
    this.initializeBank = () => {
        console.log("System Initialization: Creating 5 default accounts...");
        for (let i = 1; i <= 5; i++) {
            try {
                let userChosenPin = prompt(`[Account ${i}/5] Set a secure PIN:`).trim();
                if (userChosenPin === null||userChosenPin==""){  throw new Error("Enter valid pin.");
                }

                let depositInput = prompt(`[Account ${i}/5] Enter initial deposit amount:`,0);
                let validatedBalance = getValidatedNumericInput(depositInput);

                if (validatedBalance !== null && validatedBalance >= 0) {
                    const newAccount = BankAccount(userChosenPin, validatedBalance);
                    accountList.push(newAccount);
                    console.log(`Account ${i} activated. Card: ${newAccount.getCardNumber()}`);
                } else {
                    throw new Error("Balance cannot be negative.");
                }
            } catch (error) {
                alert(`${error.message}`);
                return;
            }
        }
    };

    // --- User Interface Loop ---
    this.openMenu = () => {
        while (true) {
            let menuMessage = "Welcome to the ATM. Select an account (1-5) or '0' to exit:\n";
            accountList.forEach((account, index) => {
                menuMessage += `${index + 1}. Card ending in *${account.getCardNumber().slice(-4)}\n`;
            });
            
            const selectedOption = prompt(menuMessage);
            
            // Exit conditions
            if (selectedOption === null || selectedOption === "0") {
                alert("Thankyou. Have a nice day!");
                break;
            }

            const accountIndex = parseInt(selectedOption) - 1;
            const targetAccount = accountList[accountIndex];

            if (!targetAccount) {
                alert("Invalid selection. Please try again.");
                continue;
            }

            const actionChoice = prompt(`Accessing Account ${accountIndex + 1}:
1. Withdraw Funds
2. Deposit Funds
3. View Balance/Details
4. Return to Main Menu`);

            if (actionChoice === "4" || actionChoice === null) continue;

            const inputCard =verprompt("Verify Identity: Enter full Card Number:");
            const inputPin = prompt("Verify Identity: Enter PIN:");

            try {
                switch (actionChoice) {
                    case "1":
                        const withdrawAmount = getValidatedNumericInput(prompt("Enter withdrawal amount:"));
                        if (withdrawAmount !== null) alert(targetAccount.withdrawFunds(inputCard, inputPin, withdrawAmount));
                        break;
                    case "2":
                        const depositAmount = getValidatedNumericInput(prompt("Enter deposit amount:"));
                        if (depositAmount !== null) alert(targetAccount.depositFunds(inputCard, inputPin, depositAmount));
                        break;
                    case "3":
                        alert(targetAccount.getSummary());
                        break;
                    default:
                        alert("Invalid action selected.");
                }
            } catch (error) {
                alert(`Transaction Error: ${error.message}`);
            }
        }
    };
}

// --- App Execution ---
const BankSystem = new Bank();
BankSystem.initializeBank();
BankSystem.openMenu();