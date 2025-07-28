export class FiniteStateMachine {
    constructor(initialState, transitions) {
        this.currentState = initialState;
        this.transitions = new Map(Object.entries(transitions));
    }

    getState() {
        return this.currentState;
    }

    transitionTo(newState) {
        const validTransitions = this.transitions.get(this.currentState);
        if (!validTransitions || !validTransitions.includes(newState)) {
            throw new Error(`Invalid state transition from ${this.currentState} to ${newState}.`);
        }
        this.currentState = newState;
        return this.currentState;
    }
}