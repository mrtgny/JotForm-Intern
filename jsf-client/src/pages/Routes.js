import React, { Component } from 'react';
import { Collapse, Button, Input, Modal } from 'antd';
import { IotaApplication } from '../utils'
import QuerySelectField from '../components/QuerySelectField';

const Panel = Collapse.Panel;

const oddPanelStyle = {
    background: '#f7f7f7',
    borderRadius: 4,
    marginBottom: 8,
    border: 0,
    overflow: 'hidden',
};

const evenPanelStyle = {
    background: '#fff',
    borderRadius: 4,
    marginBottom: 8,
    border: 0,
    overflow: 'hidden',
};


const routes = [
    {
        path: "level_1",
        label: "Level 1",
        children: [
            {
                path: "level_2",
                label: "Level 2",
                children: [
                    {
                        path: "level_3",
                        label: "Level 3",
                        children: [
                            {
                                path: "level_4",
                                label: "Level 4"
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

class Routes extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = { data: [] }
        this.routeAdd = this.routeAdd.bind(this);
        this.reload = this.reload.bind(this);
    }


    componentWillMount() {
        this.reload()
    }

    reload() {
        IotaApplication.actions.fetchQueryResult({
            path: "routes",
            params: {
                app_name: "jsf"
            },
            postAction: data => this.setState({ data: data[0].data })
        })
    }


    routeAdd(child, newRoute, index) {
        const _newRoute = [...((routes || []).filter((i, ind) => ind !== index)), { ...child, children: newRoute }]

        IotaApplication.actions.upsertForm({
            path: "routes",
            pk: "jsf",
            data: _newRoute,
            postAction: () => this.reload()
        })
    }

    render() {
        return (
            <div style={{ width: "100%" }}>
                {this.state.data.map((route, index) => {
                    return (
                        <RouteSection route={route} index={index} key={index} onNewRouteAdd={newRoute => this.routeAdd(route, newRoute, index)} />
                    )
                })}
            </div>
        );
    }
}

const RouteSection = props => {

    function newRouteAdd(newRoute) {
        const { route, onNewRouteAdd } = props
        const { children } = route;
        // console.log("newRoute", newRoute)
        // console.log("route", route)
        // console.log("other children", children)
        onNewRouteAdd([...(children || []), newRoute])
    }

    function passNewRoute(child, newRoute, index) {
        const { route, onNewRouteAdd } = props
        const { children } = route;
        // console.log("child", child);
        // console.log("newRoute", newRoute)
        // console.log("route", route)
        // console.log("other children", children)
        onNewRouteAdd([...((children || []).filter((i, ind) => ind !== index)), { ...child, children: newRoute }])
    }

    const { route } = props
    const { children, index, ...rest } = route;
    return (
        <Collapse bordered={false} >
            <Panel header={<PanelHeader onNewRouteAdd={newRouteAdd} {...rest} />} style={index % 2 ? oddPanelStyle : evenPanelStyle} showArrow={!!children}>
                {children ? children.map((child, cindex) => {
                    return (
                        <RouteSection route={child} onNewRouteAdd={newRoute => passNewRoute(child, newRoute, cindex)} key={cindex} index={cindex} />
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
        this.editRoute = this.editRoute.bind(this);
    }

    addRoute() {
        this.setState({ addRoute: true })
    }

    editRoute() {
        const { path, label, page_id, onNewRouteAdd } = this.props;
        this.setState({ addRoute: true, path, label, page_id })
    }

    render() {
        const { path, label, onNewRouteAdd } = this.props;
        return (
            <div style={{ display: "flex", justifyContent: "space-between", margin: "0 8px" }}>
                {this.state.addRoute ?
                    <AddRoute open={true}
                        onClose={() => this.setState({ addRoute: false })}
                        onSave={onNewRouteAdd}
                        {...this.state}
                    /> : null}
                <div>
                    <span style={{ marginRight: 4 }}>{label}</span>
                    <span style={{ margin: "0 4px" }}>/</span>
                    <span style={{ marginLeft: 4, color: "#aaa" }}>{path}</span>
                </div>
                <div>
                    <Button shape="circle" icon="plus" onClick={this.addRoute} />
                    <Button shape="circle" icon="edit" onClick={() => this.editRoute()} />
                </div>
            </div>
        )
    }
}


class AddRoute extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { ...props }
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this)
    }

    handleOk() {
        this.props.onSave(this.state)
        this.handleCancel()
    }

    handleCancel() {
        this.props.onClose();
        this.setState({ label: "", path: "", page_id: "" })
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
                </div>
            </Modal>
        );
    }
}

export default Routes;