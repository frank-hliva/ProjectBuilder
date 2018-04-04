export class State<S> {
    private state: S;

    constructor(state: S) {
        this.state = state;
    }

    update<K extends keyof S>(obj: Pick<S, K> | S | null) {
        return Object.assign(this.state, obj) as S;
    }

    toObject() { return this.state; }
}