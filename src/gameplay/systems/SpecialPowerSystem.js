export default class SpecialPowerSystem {
  constructor(config) {
    this.config = config;
    this.clarity = 0;
  }

  addClarity(amount) {
    this.clarity = Phaser.Math.Clamp(this.clarity + amount, 0, 100);
  }

  isReady() {
    return this.clarity >= this.config.clarityCost;
  }

  consume() {
    if (!this.isReady()) {
      return false;
    }

    this.clarity = 0;
    return true;
  }
}
