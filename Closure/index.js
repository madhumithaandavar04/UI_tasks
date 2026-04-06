/**
 * Bank closure to return functions withdraw and deposit
 * @return deposit, and withdraw functions
 */
function bankSystem() {
  /** predefined accounts */
  const accounts = [
    {
      accountNo: "88294001",
      cardNo: "4532778100294431",
      pin: "4921",
      balance: 1450.65,
    },
    {
      accountNo: "88294002",
      cardNo: "5214889233014562",
      pin: "1073",
      balance: 82.10,
    },
    {
      accountNo: "88294003",
      cardNo: "4111222233334444",
      pin: "8852",
      balance: 12400.00,
    },
    {
      accountNo: "88294004",
      cardNo: "5500123456789012",
      pin: "3194",
      balance: 215.33,
    },
    {
      accountNo: "88294005",
      cardNo: "4716009211485573",
      pin: "6022",
      balance: 5430.12,
    },
    {
      accountNo: "88294006",
      cardNo: "5105334198274401",
      pin: "0415",
      balance: 9.50,
    },
    {
      accountNo: "88294007",
      cardNo: "4024007155239910",
      pin: "7339",
      balance: 45600.88,
    },
    {
      accountNo: "88294008",
      cardNo: "5422118700342261",
      pin: "2580",
      balance: 1120.00,
    }
  ];

  /** Utility functions */
  /**
   * get amount from the user and vaidate the amount
   * @param amount 
   * @returns boolean amount validation status
   */
  function isValidAmount(amount) {
    if (isNaN(amount)) {
      alert("Invalid amount");
      return false;
    }
    if (amount <= 0) {
      alert("Amount must be greater than 0.");
      return false;
    }
    return true;
  }

  /**
   * find user using card number and return the user
   * @param cardNo 
   * @returns the user
   */
  function getUser(cardNo) {
    return accounts.find((account) => account.cardNo === cardNo);
  }

  /**
 * get the account details of the account no
 * @param accountNo 
 * @returns  the account belongs to the account number
 */
  function getAccount(accountNo) {
    accounts.find((account) => account.accountNo === accountNo);
  }

  return {
    /**
     *  Withdraw money from the account
     * @param cardNo 
     * @param amount 
     * @returns void (withdraw the amount from the account)
     */
    withdraw: (cardNo, inputAmount) => {
      const user = getUser(cardNo);
      const amount = Number(inputAmount);
      if (!isValidAmount(amount)) {
        alert("Enter valid amount");
        return;
      }
      if (user.balance < amount) {
        alert("Insufficient balance. Can't withdraw money.");
        return;
      }
      user.balance = Number((user.balance - amount).toFixed(2));
      alert(
        `Withdraw ${amount} has been successfully completed.\nCurrent Balance Amount: ${user.balance}`,
      );
    },

    /**
     * Deposit the amount to the account 
     * @param cardNo 
     * @param amount 
     * @returns void (complete the deposit).
     */
    deposit: (cardNo, inputAmount) => {
      const user = getUser(cardNo);
      const amount = Number(inputAmount);
      if (!isValidAmount(amount)) {
        alert("Enter valid amount");
        return;
      }
      user.balance = Number((user.balance + amount).toFixed(2));
      alert(
        `Your amount  ${amount} is successfully deposited.\nCurrent Balance Amount: ${user.balance}`,
      );
    },

    /**
     * check the accountNo,cardNo and pin to validate credentials
     * @param  accountNo 
     * @param  cardNo 
     * @param  pin 
     * @returns credential validation status
     */
    isValidUser: (accountNo, cardNo, pin) =>
      accounts.find(
        (account) =>
          account.accountNo === accountNo &&
          account.cardNo === cardNo &&
          account.pin === pin,
      ),

    /**
   * checking whether user exist or not
   * @param accountNo 
   * @returns  true or false after check if the user exists
   */
    isAccountExist: (accountNo) => {
      const account = accounts.find((account) => account.accountNo === accountNo);
      if (account) {
        return true;
      }
      return false;
    },

    /** show the bank balance of the account
    * @param cardNo
    * @return void (show the balance of the account)
    */
    showBalance: (cardNo) => {
      alert(`Your bank balance is : ${getUser(cardNo).balance}`)
    }
  }
}

// main function to provide the bank services
function main() {
  //create Bank
  const bank = bankSystem();
  let run = true;
  while (run) {
    const accountNo = prompt("Enter your account No: ");
    const accountExist = bank.isAccountExist(accountNo);
    if (accountExist) {
      const choice = prompt(
        `Enter your choice (1-3):
1 . Withdraw
2 . Deposit
3 . Show Bank balance
4 . Exit`,
      );
      if (choice === "4") {
        alert("Thank you. Have a nice day.");
        return;
      }
      if (choice >= 1 && choice <= 3) {
        const cardNo = prompt("Enter your ATM card number : ");
        const pin = prompt("Enter your pin : ");
        if (bank.isValidUser(accountNo, cardNo, pin)) {
          switch (choice) {
            case "1": {
              const amount = prompt("Enter the withdraw amount :");
              bank.withdraw(cardNo, amount);
              break;
            }
            case "2": {
              const amount = prompt("Enter the deposit amount :");
              bank.deposit(cardNo, amount);
              break;
            }
            case "3":
              bank.showBalance(cardNo);
              break;
            default:
              alert("Invalid choice.");
          }
        } else {
          alert("Your Credentials are wrong or user doesn't not exist");
        }
      } else {
        alert("Invalid choice. Please enter valid choice");
      }
    } else {
      alert("Account number is wrong.");
    }
  }
}
main();