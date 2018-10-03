import React, { Component } from 'react';
import { Collapse, Button, Input, Modal } from 'antd';
import { IotaApplication } from '../../utils'
import { List } from 'antd';

class Pages extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = { data: [] }
        this.reload = this.reload.bind(this);
        this.newPage = this.newPage.bind(this);
    }


    componentWillMount() {
        this.reload()
    }

    reload() {
        IotaApplication.actions.fetchQueryResult({
            path: "pages",
            params: {
                app_name: "jsf"
            },
            postAction: data => this.setState({ data })
        })
    }

    newPage() {
        IotaApplication.history.push("/pages/newpage")
    }

    render() {
        console.log("this.state", this.state.data)
        return (
            <div style={{ width: "100%" }}>
                <List
                    header={<div>Pages</div>}
                    footer={<Button type="primary" onClick={this.newPage}>New</Button>}
                    bordered
                    dataSource={this.state.data}
                    renderItem={item => (<List.Item className="hover-list-item" onClick={() => IotaApplication.history.push("/pages/edit/" + item.record_id)}>{item.data.form.title}</List.Item>)}
                />
            </div>
        );
    }
}

export default Pages;