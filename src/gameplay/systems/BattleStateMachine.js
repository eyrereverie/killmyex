export default class BattleStateMachine {
  constructor(initialState = 'intro') {
    this.state = initialState;
  }

  is(state) {
    return this.state === state;
  }

  set(state) {
    this.state = state;
  }
}
