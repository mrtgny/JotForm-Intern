import { take, put, fork, call } from 'redux-saga/effects';
import * as actions from './actions';
import * as api from '../api';

function* execFetch(action) {
    try {
        const { payload } = action;
        yield call(api.fetchQueryResult, payload);
    } catch (e) {
        yield put(alert("Hata", e));
    }
}

function* fetchQueryResult() {
    while (true) {
        const action = yield take(`${actions.fetchQueryResult}`);
        yield fork(execFetch, action);
    }
}

function* execUpsert(action) {
    try {
        const { payload } = action;
        yield call(api.upsertForm, payload);
    } catch (e) {
        yield put(alert("Hata", e));
    }
}

function* upsertForm() {
    while (true) {
        const action = yield take(`${actions.upsertForm}`);
        yield fork(execUpsert, action);
    }
}

function* execDeleteRecord(action) {
    try {
        const { payload } = action;
        yield call(api.deleteRecord, payload);
    } catch (e) {
        yield put(alert("Hata", e));
    }
}

function* deleteRecord() {
    while (true) {
        const action = yield take(`${actions.deleteRecord}`);
        yield fork(execDeleteRecord, action);
    }
}

export default function* rootSaga(getState) {
    yield fork(fetchQueryResult, getState);
    yield fork(upsertForm, getState);
    yield fork(deleteRecord, getState);
}
