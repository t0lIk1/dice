const crypto = require('crypto');

class FairRandom {
    static generateKey() {
        return crypto.randomBytes(32).toString('hex'); // 256 бит
    }

    static generateHMAC(key, message) {
        return crypto.createHmac('sha3-256', key).update(message.toString()).digest('hex');
    }

    static generateRandomNumber(min, max) {
        const range = max - min + 1;
        const randomBytes = crypto.randomBytes(4);
        const randomNumber = randomBytes.readUInt32BE(0);
        return min + (randomNumber % range);
    }
}

module.exports = FairRandom;                                