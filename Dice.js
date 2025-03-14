class Dice {
  constructor(values) {
      this.values = values;
  }

  roll(index) {
      return this.values[index];
  }

  getFaces() {
      return this.values.length;
  }

  toString() {
      return `[${this.values.join(',')}]`;
  }
}

module.exports = Dice;