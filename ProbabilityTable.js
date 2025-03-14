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
    console.log("Probabilities of winning:");
    console.log("Dice\t" + diceList.map((d, i) => `D${i}`).join("\t"));
    table.forEach((row, i) => {
      console.log(`D${i}\t` + row.join("\t"));
    });
  }
}

module.exports = ProbabilityTable;
