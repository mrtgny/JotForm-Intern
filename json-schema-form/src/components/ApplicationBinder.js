import React from 'react';
import PropTypes from 'prop-types'
import bindActionCreators from 'redux/es/bindActionCreators';
import { IotaApplication } from '../utils';

export default class ApplicationBinder extends React.Component {

    static contextTypes = {
        store: PropTypes.object
    };

    componentWillMount() {
        const extraActions = this.props.actions || {};
        IotaApplication.actions = bindActionCreators(extraActions, this.context.store.dispatch);
    }

    render() {
        return null;
    }
}
