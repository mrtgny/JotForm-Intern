import React, { Component } from 'react';
import { Input, Select, Checkbox, InputNumber, Button, Icon } from 'antd'

const Label = props => {
    const { children } = props;
    return <p style={{ margin: "8px" }}>{children}</p>
}


const PropsInput = (props) => {
    const { label } = props;
    return (
        <Input placeholder={label} style={{ width: "100%", border: "none", background: "none" }} />
    )
}

const TextFieldCard = (props) => {
    const { index, ...rest } = props
    return (

        <div className="drop-form-field" style={{ width: "100%", borderRadius: 10, backgroundColor: "#f4f4f4" }} {...rest}>
            <div style={{ padding: 16, margin: 16 }}>
                <div style={{ margin: "8px 0" }}>
                    <PropsInput label="Textfield" />
                </div>
                <Input size="large" placeholder="Input" style={{ width: "100%" }} />
            </div>
        </div>
    )
}

const NumberFieldCard = (props) => {
    const { index, ...rest } = props
    return (
        <div className="drop-form-field" style={{ width: "100%", borderRadius: 10, backgroundColor: "#f4f4f4" }} {...rest}>
            <div style={{ padding: 16, margin: 16 }}>
                <div style={{ margin: "8px 0" }}>
                    <PropsInput label="Number" />
                </div>
                <Input size="large" placeholder="Number" style={{ width: "100%" }} />
            </div>
        </div>
    )
}

const SelectFieldCard = (props) => {
    const { index, ...rest } = props
    return (
        <div className="drop-form-field" style={{ width: "100%", borderRadius: 10, backgroundColor: "#f4f4f4" }} {...rest}>
            <div style={{ padding: 16, margin: 16 }}>
                <div style={{ margin: "8px 0" }}>
                    <PropsInput label="Select" />
                </div>
                <Input size="large" placeholder="Select Field" style={{ width: "100%" }} />
            </div>
        </div>
    )
}

const TextAreaCard = (props) => {
    const { index, ...rest } = props
    return (
        <div className="drop-form-field" style={{ width: "100%", borderRadius: 10, backgroundColor: "#f4f4f4" }} {...rest}>
            <div style={{ padding: 16, margin: 16 }}>
                <div style={{ margin: "8px 0" }}>
                    <PropsInput label="Text Area" />
                </div>
                <Input.TextArea rows={4} size="large" placeholder="TextArea" style={{ width: "100%" }} />
            </div>
        </div>

    )
}

const components = {
    TextField: TextFieldCard,
    NumberField: NumberFieldCard,
    TextArea: TextAreaCard,
    SelectField: SelectFieldCard,

}

const draggableElements = [
    {
        component: "TextField",
        label: "TextField",
        icon: "T"
    },
    {
        component: "NumberField",
        label: "NumberField",
        icon: "N"
    },
    {
        component: "SelectField",
        label: "SelectField",
        icon: "S"
    },
    {
        component: "TextArea",
        label: "TextArea",
        icon: "TA"
    },
]

class DragDrop extends Component {
    render() {
        return (
            <div style={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor: "#eee",
                display: "flex"
            }}>
                <div style={{
                    width: "calc(40% - 32px)",
                    backgroundColor: "white",
                    borderRadius: 10,
                    padding: 8,
                    margin: 16,
                }}>
                    <DraggableElements />
                </div>
                <div style={{
                    width: "calc(60% - 32px)",
                    backgroundColor: "white",
                    borderRadius: 10,
                    padding: 8,
                    margin: 16,
                }}>
                    <DropArea />
                </div>
            </div>
        );
    }
}


class DraggableElements extends React.Component {
    render() {
        return (
            <div style={{ width: "100%" }}>
                {draggableElements.map((element, index) => {
                    const { component, icon, label } = element
                    return (
                        <div key={index} id={"draggable-elements-" + index} style={{ cursor: "pointer", display: "flex", padding: 8, alignItems: "center", border: "1px solid white", backgroundColor: "#f4f4f4" }}
                            draggable={true}
                            onDragStart={e => { e.dataTransfer.setData("component", component) }}>
                            <span style={{ padding: 8, color: "#aaa", fontWeight: "bold", fontSize: 18 }}>{icon}</span>
                            <span style={{ padding: 8 }}>{label}</span>
                        </div>
                    )
                })}
            </div>
        )
    }
}

class DropArea extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { comps: [], dragging: -1 }
        this.push = this.push.bind(this);
        this.insert = this.insert.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(e) {
        let order = e.target.getAttribute("order") ? parseInt(e.target.getAttribute("order")) : null
        if (this.state.dragging < 0) {
            if (e.target.id == "drop-zone") {
                this.push(e)
            } else if (order !== null) {
                this.insert(e)
            }
        } else {
            if (e.target.id == "drop-zone" || order == null)
                this.swap(this.state.comps.length - 1, this.state.dragging)
            else
                this.swap(order, this.state.dragging)
        }
    }

    swap(order, index) {
        const oldComps = [...this.state.comps]
        oldComps[index].order = order;
        oldComps[order].order = index
        this.setState({
            comps: [...oldComps],
            dragging: -1
        });
    }

    push(e) {
        this.setState({
            comps: [...this.state.comps, {
                componentName: e.dataTransfer.getData("component"),
                properties: {
                    placeholder: '---'
                },
                key: new Date(),
                order: this.state.comps.length
            }]
        });
    }

    insert(e) {
        let order = e.target.getAttribute("order") ? parseInt(e.target.getAttribute("order")) : null
        const oldComps = [...this.state.comps]
        for (let i = order; i < oldComps.length; i++)
            oldComps[i].order++
        this.setState({
            comps: [...oldComps, {
                componentName: e.dataTransfer.getData("component"),
                properties: {
                    placeholder: '---'
                },
                key: new Date(),
                order
            }]
        });
    }

    render() {
        return (
            <div style={{ width: "100%", height: "100%" }} id={"drop-zone"}
                onDrop={this.onDrop}
                onDragOver={e => {
                    let order = e.target.getAttribute("order") ? parseInt(e.target.getAttribute("order")) : null
                    if (e.target.id == "drop-zone" || order !== null) {
                        e.preventDefault();
                    }
                }} >
                {this.state.comps.sort((i1, i2) => i1.order > i2.order).map((item, index) => {
                    return (
                        <FormField item={item} key={item.key} onDrop={this.onDrop} onSwap={e => this.setState({ dragging: e })} />
                    )
                })}
            </div>
        )
    }
}

class FormField extends React.Component {
    state = { enter: false, dragging: false }
    render() {
        const { item, item: { componentName, ...rest }, onSwap } = this.props
        return (
            <div style={{ paddingTop: 64 }} {...rest} >
                <div style={{ display: "flex", width: "100%" }}
                    onMouseEnter={() => this.setState({ enter: true })}
                    onMouseLeave={() => this.setState({ enter: false })}
                    draggable={this.state.enter}
                    onDragStart={e => { this.setState({ dragging: true }, () => onSwap(item.order)); e.dataTransfer.setData("component", item.componentName) }}
                    onDragEnd={e => this.setState({ dragging: false })}
                >
                    {this.state.enter && !this.state.dragging ?
                        <div style={{ width: 40, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Icon type="appstore" />
                        </div> : null}

                    {React.createElement(components[item.componentName],
                        {
                            order: item.order,
                        })
                    }

                </div>
            </div >
        )
    }
}

export default DragDrop;
