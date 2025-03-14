const Dice = require('./Dice');

class DiceParser {
  static parseDice(args) {
      if (args.length < 3) {
          throw new Error('At least 3 dice are required. Example: node index.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3');
      }
      return args.map(arg => {
          const values = arg.split(',').map(Number);
          if (values.some(isNaN)) {
              throw new Error('Invalid dice values. All values must be integers.');
          }
          return new Dice(values);
      });
  }
}

module.exports = DiceParser;