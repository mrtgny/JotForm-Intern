import React, { Component } from 'react';
import { IotaApplication } from '../utils'
import { Select } from 'antd';
const Option = Select.Option;


class QuerySelectField extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            data: []
        }
        this.postAction = this.postAction.bind(this)
    }

    postAction(data) {
        if (data) {
            this.setState({ data: data.map((i) => ({ dsc: i.data.form.title, value: i.record_id })) })
        }
    }

    componentWillMount() {
        const { path, data, pk } = this.props
        if (!data)
            IotaApplication.actions.fetchQueryResult({
                path,
                postAction: this.postAction,
                pk
            })
    }

    render() {
        const { path, postAction, data, pk, value, onChange, ...rest } = this.props
        const items = data || this.state.data

        return (
            <Select value={value} onChange={onChange} style={{ width: "100%" }} {...rest}>
                {items && items.map((item, index) => {
                    return (
                        <Option key={index} value={item.value}>{item.dsc}</Option>
                    )
                })}
            </Select>
        );
    }
}

export default QuerySelectField;