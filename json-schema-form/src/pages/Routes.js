import React, { Component } from 'react';
import { Collapse, Button, Input, Modal } from 'antd';
import { IotaApplication } from '../utils'
import QuerySelectField from '../components/QuerySelectField';

const Panel = Collapse.Panel;

const evenPanelStyle = {
    background: '#fff',
    borderRadius: 4,
    marginBottom: 8,
    border: 0,
    overflow: 'hidden',
};

class Routes extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = { data: [] }
        this.reload = this.reload.bind(this);
        this.createRoutes = this.createRoutes.bind(this);
    }


    componentWillMount() {
        this.reload()
    }

    createRoutes(data, parent) {
        return data.filter(i => parent ? i.parent_id == parent.record_id : !i.parent_id).map(i => ({ ...i, children: this.createRoutes(data, i) }))
    }

    reload() {
        IotaApplication.actions.fetchQueryResult({
            path: "routes",
            params: {
                app_name: "jsf"
            },
            postAction: data => this.setState({ data: this.createRoutes(data, null) })
        })
    }

    render() {
        return (
            <div style={{ width: "100%" }}>
                {this.state.newRoute ?
                    <AddRoute open={true}
                        onClose={() => this.setState({ newRoute: false })}
                        onSave={this.reload}
                        {...this.state}
                    /> : null}
                {this.state.data.map((route, index) => {
                    return (
                        <RouteSection onSave={this.reload} route={route} key={index} />
                    )
                })}
                <Button type="primary" onClick={() => this.setState({ newRoute: true })}>New</Button>
            </div>
        );
    }
}

const RouteSection = props => {

    const { route, onSave } = props
    const { children, ...rest } = route;
    return (
        <Collapse bordered={false} >
            <Panel header={<PanelHeader onSave={onSave} {...rest} />} style={evenPanelStyle} showArrow={!!children}>
                {children ? children.map((child, cindex) => {
                    return (
                        <RouteSection onSave={onSave} route={child} key={cindex} index={cindex} {...rest} />
                    )
                }) : null}
            </Panel>
        </Collapse>
    )
}

class PanelHeader extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { routeAddDialog: false }
        this.addRoute = this.addRoute.bind(this);
        this.deleteRoute = this.deleteRoute.bind(this);
        this.editRoute = this.editRoute.bind(this);
    }

    addRoute() {
        const { record_id } = this.props;
        this.setState({ addRoute: true, record_id })
    }

    editRoute() {
        const { path, label, page_id, record_id, page_type } = this.props;
        this.setState({ addRoute: true, edit: true, path, label, page_id, record_id, page_type })
    }

    deleteRoute() {
        const { record_id, onSave } = this.props;
        IotaApplication.actions.deleteRecord({
            path: "routes",
            pk: { record_id },
            postAction: onSave
        })
    }

    render() {
        const { path, label, onSave } = this.props;
        return (
            <div style={{ display: "flex", justifyContent: "space-between", margin: "0 8px" }}>
                {this.state.addRoute ?
                    <AddRoute open={true}
                        onSave={onSave}
                        onClose={() => this.setState({ addRoute: false, edit: false, path: "", label: "", page_id: "", record_id: "", page_type: "" })}
                        {...this.state}
                    /> : null}
                <div>
                    <span style={{ marginRight: 4 }}>{label}</span>
                    <span style={{ margin: "0 4px" }}>/</span>
                    <span style={{ marginLeft: 4, color: "#aaa" }}>{path}</span>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ margin: 8 }}>
                        <Button shape="circle" icon="plus" onClick={this.addRoute} />
                    </div>
                    <div style={{ margin: 8 }}>
                        <Button shape="circle" icon="edit" onClick={this.editRoute} />
                    </div>
                    <div style={{ margin: 8 }}>
                        <Button shape="circle" icon="delete" onClick={this.deleteRoute} />
                    </div>
                </div>
            </div>
        )
    }
}


const pageTypes = [
    {
        value: "view",
        dsc: "View"
    },
    {
        value: "edit",
        dsc: "Edit"
    }
]

class AddRoute extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { ...props }
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this)
    }

    handleOk() {
        const { record_id, edit, onSave } = this.props
        const data = {
            record_id,
            path: this.state.path,
            label: this.state.label,
            page_id: this.state.page_id,
            page_type: this.state.page_type
        }
        if (record_id && !edit) {
            data.parent_id = record_id
        }
        IotaApplication.actions.upsertForm({
            path: "routes",
            pk: record_id && edit ? {
                record_id
            } : undefined,
            data,
            postAction: () => {
                onSave()
                this.handleCancel()
            }
        })

    }

    handleCancel() {
        this.setState({ label: "", path: "", page_id: "" }, this.props.onClose)
    }
    render() {
        const { open } = this.props;
        return (
            <Modal
                visible={open}
                title="Yeni Route"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>Vazgeç</Button>,
                    <Button key="submit" type="primary" onClick={this.handleOk}>
                        Ekle
              </Button>,
                ]}
            >
                <div>
                    <div style={{ display: "flex", marginBottom: 16, alignItems: "center" }}>
                        <p style={{ paddingRight: 16, margin: 0 }}>Label</p>
                        <Input placeholder="Label" onChange={e => this.setState({ label: e.target.value })} value={this.state.label} />
                    </div>
                    <div style={{ display: "flex", marginBottom: 16, alignItems: "center" }}>
                        <p style={{ paddingRight: 16, margin: 0 }}>Path</p>
                        <Input placeholder="Path" onChange={e => this.setState({ path: e.target.value })} value={this.state.path} />
                    </div>
                    <div style={{ display: "flex", marginBottom: 16, alignItems: "center" }}>
                        <p style={{ paddingRight: 16, margin: 0 }}>Page</p>
                        <QuerySelectField path="pages" placeholder="Page" onChange={page_id => this.setState({ page_id })} value={this.state.page_id} />
                    </div>
                    <div style={{ display: "flex", marginBottom: 16, alignItems: "center" }}>
                        <p style={{ paddingRight: 16, margin: 0 }}>Type</p>
                        <QuerySelectField placeholder="Type" data={pageTypes} onChange={page_type => this.setState({ page_type })} value={this.state.page_type} />
                    </div>
                </div>
            </Modal>
        );
    }
}

export default Routes;