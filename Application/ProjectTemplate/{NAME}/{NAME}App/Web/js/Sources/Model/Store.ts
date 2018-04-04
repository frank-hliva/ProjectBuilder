import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer, TAction } from '../Reducers/Reducer';

export default createStore(
    reducer as any,
    applyMiddleware(thunk)
);