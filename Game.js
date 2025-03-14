const readline = require("readline");
const FairRandom = require("./FairRandom");
const ProbabilityTable = require("./ProbabilityTable");

class Game {
  constructor(diceList) {
    this.diceList = diceList;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async start() {
    console.log("Let's determine who makes the first move.");
    const firstMove = await this.fairRandomSelection(0, 1);
    const firstPlayer = firstMove === 1 ? "computer" : "user";
    console.log(
      `${firstPlayer === "computer" ? "I" : "You"} make the first move.`
    );

    let computerDice, userDice;
    if (firstPlayer === "computer") {
      computerDice = await this.chooseDice("computer");
      userDice = await this.chooseDice("user", computerDice);
    } else {
      userDice = await this.chooseDice("user");
      computerDice = await this.chooseDice("computer", userDice);
    }

    if (firstPlayer === "computer") {
      const computerThrow = await this.throwDice(computerDice, "computer");
      const userThrow = await this.throwDice(userDice, "user");
      this.determineWinner(computerThrow, userThrow);
    } else {
      const userThrow = await this.throwDice(userDice, "user");
      const computerThrow = await this.throwDice(computerDice, "computer");
      this.determineWinner(userThrow, computerThrow);
    }

    this.rl.close();
  }

  async fairRandomSelection(min, max) {
    const computerNumber = FairRandom.generateRandomNumber(min, max);
    const key = FairRandom.generateKey();
    const hmac = FairRandom.generateHMAC(key, computerNumber);
    console.log(
      `I selected a random value in the range ${min}..${max} (HMAC=${hmac}).`
    );
    console.log("Try to guess my selection.");
    for (let i = min; i <= max; i++) {
      console.log(`${i} - ${i}`);
    }
    console.log("X - exit");
    console.log("? - help");
    const userNumber = await this.prompt("Your selection: ");
    if (userNumber === "X") process.exit(0);
    if (userNumber === "?") {
      ProbabilityTable.displayTable(
        this.diceList,
        ProbabilityTable.calculateProbabilities(this.diceList)
      );
      return this.fairRandomSelection(min, max);
    }
    if (userNumber.trim() === "") {
      console.log("Invalid selection. Please try again.");
      return this.fairRandomSelection(min, max);
    }
    const number = parseInt(userNumber);
    if (isNaN(number) || number < min || number > max) {
      console.log("Invalid selection. Please try again.");
      return this.fairRandomSelection(min, max);
    }
    console.log(`My selection: ${computerNumber} (KEY=${key}).`);
    return (computerNumber + number) % (max + 1);
  }

  async chooseDice(player, excludedDice = null) {
    try {
      console.log(`${player === "computer" ? "I" : "You"} choose the dice:`);
      this.diceList.forEach((dice, index) => {
        if (dice !== excludedDice) {
          console.log(`${index} - ${dice.toString()}`);
        }
      });
      console.log("X - exit");
      console.log("? - help");
      const selection = await this.prompt("Your selection: ");
      if (selection === "X") process.exit(0);
      if (selection === "?") {
        ProbabilityTable.displayTable(
          this.diceList,
          ProbabilityTable.calculateProbabilities(this.diceList)
        );
        return this.chooseDice(player, excludedDice);
      }
      // Проверка на число
      const index = parseInt(selection);
      if (isNaN(index)) {
        console.log("Invalid selection. Please enter a number.");
        return this.chooseDice(player, excludedDice);
      }
      // Проверка на диапазон
      if (
        index < 0 ||
        index >= this.diceList.length ||
        this.diceList[index] === excludedDice
      ) {
        console.log("Invalid selection. Please try again.");
        return this.chooseDice(player, excludedDice);
      }
      const dice = this.diceList[index];
      console.log(
        `${
          player === "computer" ? "I" : "You"
        } choose the ${dice.toString()} dice.`
      );
      return dice;
    } catch (e) {
      console.log("An error occurred. Please try again.");
      return this.chooseDice(player, excludedDice);
    }
  }

  async throwDice(dice, player) {
    console.log(
      `It's time for ${player === "computer" ? "my" : "your"} throw.`
    );
    const computerNumber = FairRandom.generateRandomNumber(
      0,
      dice.getFaces() - 1
    );
    const key = FairRandom.generateKey();
    const hmac = FairRandom.generateHMAC(key, computerNumber);
    console.log(
      `I selected a random value in the range 0..${
        dice.getFaces() - 1
      } (HMAC=${hmac}).`
    );
    console.log("Add your number modulo 6.");
    for (let i = 0; i < dice.getFaces(); i++) {
      console.log(`${i} - ${i}`);
    }
    console.log("X - exit");
    console.log("? - help");
    const userNumber = await this.prompt("Your selection: ");
    if (userNumber === "X") process.exit(0);
    if (userNumber === "?") {
      ProbabilityTable.displayTable(
        this.diceList,
        ProbabilityTable.calculateProbabilities(this.diceList)
      );
      return this.throwDice(dice, player);
    }
    // Проверка на число и диапазон
    const number = parseInt(userNumber);
    if (isNaN(number) || number < 0 || number >= dice.getFaces()) {
      console.log(
        "Invalid selection. Please enter a number between 0 and " +
          (dice.getFaces() - 1) +
          "."
      );
      return this.throwDice(dice, player);
    }
    const result = (computerNumber + number) % dice.getFaces();
    console.log(`My number is ${computerNumber} (KEY=${key}).`);
    console.log(
      `The result is ${computerNumber} + ${userNumber} = ${result} (mod ${dice.getFaces()}).`
    );
    const throwValue = dice.roll(result);
    console.log(
      `${player === "computer" ? "My" : "Your"} throw is ${throwValue}.`
    );
    return throwValue;
  }

  determineWinner(throw1, throw2) {
    if (throw1 > throw2) {
      console.log("Computer wins!");
    } else if (throw1 < throw2) {
      console.log("You win!");
    } else {
      console.log("It's a tie!");
    }
  }

  prompt(question) {
    return new Promise((resolve) => this.rl.question(question, resolve));
  }
}

module.exports = Game;
