const DiceParser = require('./DiceParser');
const Game = require('./Game');

try {
    const diceList = DiceParser.parseDice(process.argv.slice(2));
    const game = new Game(diceList);
    game.start();
} catch (error) {
    console.error(error.message);
}