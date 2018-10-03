import 'regenerator-runtime/runtime';
import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";
import { combineReducers } from "redux";
import form from "redux-form/es/reducer";
import qry from './src/reducers';

import { routerReducer } from 'react-router-redux'

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
    form,
    qry,
    routing: routerReducer,
});

const store = createStore(
    rootReducer,
    {},
    compose(applyMiddleware(sagaMiddleware), window.devToolsExtension ? window.devToolsExtension() : f => f)
);

sagaMiddleware.run(rootSaga, store.getState);

export default store;
