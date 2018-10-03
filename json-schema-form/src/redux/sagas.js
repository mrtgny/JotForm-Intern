import {fork} from "redux-saga/effects";
import sagas from './src/sagas';

export default function* rootSaga(getState) {
    yield fork(sagas, getState);
}
