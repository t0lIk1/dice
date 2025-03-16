const crypto = require("crypto");

class FairRandom {
  static generateKey() {
    return crypto.randomBytes(32).toString("hex"); // 256 бит
  }

  static generateHMAC(key, message) {
    return crypto
      .createHmac("sha3-256", key)
      .update(message.toString())
      .digest("hex");
  }

  static generateRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

module.exports = FairRandom;
