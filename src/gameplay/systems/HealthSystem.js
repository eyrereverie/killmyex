export default class HealthSystem {
  constructor(maxHp) {
    this.maxHp = maxHp;
    this.hp = maxHp;
  }

  damage(amount = 1) {
    this.hp = Math.max(0, this.hp - amount);
    return this.hp;
  }

  reset() {
    this.hp = this.maxHp;
  }
}
