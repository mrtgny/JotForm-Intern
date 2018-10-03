import * as actions from './actions';

export default function queries(state = {}, action) {
    switch (action.type) {
        case `${actions.fetchQueryResult}`:
            state = { ...state, [action.payload.path]: action.payload.data };
            return state;
        default:
            return state;
    }
}
