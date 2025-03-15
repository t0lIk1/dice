const AsciiTable = require("ascii-table");

class ProbabilityTable {
  static calculateProbabilities(diceList) {
    const table = [];
    for (let i = 0; i < diceList.length; i++) {
      const row = [];
      for (let j = 0; j < diceList.length; j++) {
        if (i === j) {
          row.push("-");
          continue;
        }
        const diceA = diceList[i];
        const diceB = diceList[j];
        let wins = 0;

        for (let a = 0; a < diceA.getFaces(); a++) {
          for (let b = 0; b < diceB.getFaces(); b++) {
            if (diceA.roll(a) > diceB.roll(b)) wins++;
          }
        }
        const probability = (
          wins /
          (diceA.getFaces() * diceB.getFaces())
        ).toFixed(2);
        row.push(probability);
      }
      table.push(row);
    }
    return table;
  }

  static displayTable(diceList, table) {
    const asciiTable = new AsciiTable("Probabilities of Winning");

    asciiTable.setHeading("Dice", ...diceList.map((_, i) => `D${i}`));

    table.forEach((row, i) => {
      asciiTable.addRow(`D${i}`, ...row);
    });

    console.log(asciiTable.toString());
  }
}

module.exports = ProbabilityTable;
