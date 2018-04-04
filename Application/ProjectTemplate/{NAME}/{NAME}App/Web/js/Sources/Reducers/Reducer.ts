import { State } from "../Lib/Redux/State";
import Model from "../Model/Model";
import { AnyAction } from 'redux';

type TChangePageAction = {
    type: "CHANGE_PAGE";
    page: string;
    model?: {};
}

export type TAction = TChangePageAction;

export function reducer(reducerState: {}, action: TAction) {
    const state = new State(reducerState || Model);

    switch (action.type) {
        case "CHANGE_PAGE": {
            if (action.model) {
                return state.update({
                    page: action.page,
                    model: action.model
                });
            } else {
                return state.update({
                    page: action.page
                });
            }
        }
        default: {
            return state.toObject();
        }
    }

}