import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


import { Provider } from "react-redux";
import store from './redux/store'
import { syncHistoryWithStore } from 'react-router-redux';
import createHashHistory from 'history/createHashHistory';
import * as actions from './redux/src/actions';
import { IotaApplication } from './utils'
import ApplicationBinder from './components/ApplicationBinder'

const _history = createHashHistory();
const history = syncHistoryWithStore(_history, store);

IotaApplication.history = history;
window.IotaApplication = IotaApplication;

const Main = () => {
    return (
        <Provider store={store}>
            <div>
                <ApplicationBinder actions={actions} />
                <App />
            </div>
        </Provider>
    )
}

ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
