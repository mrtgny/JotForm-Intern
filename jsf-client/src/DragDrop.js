import React, { Component } from 'react';
import { Input, Select, Checkbox, InputNumber, Button, Icon } from 'antd'

const Label = props => {
    const { children } = props;
    return <p style={{ margin: "8px 0" }}>{children}</p>
}

const draggableElements = [
    {
        component: Input,
        label: "TextField",
        icon: "T"
    },
    {
        component: Input,
        label: "NumberField",
        icon: "N"
    },
    {
        component: Input,
        label: "SelectField",
        icon: "S"
    },
    {
        component: Input,
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
                            onDragStart={e => {
                                console.log("e", e)
                                e.dataTransfer.setData("id", "draggable-elements-" + index)
                            }}

                        >
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
    render() {
        return (
            <div style={{ width: "100%", height: "100%" }}
                id={"drop-zone"}
                onDrop={e => {
                    if (e.target.id == "drop-zone") {
                        console.log("e drop", e.target)
                        const elm = document.getElementById(e.dataTransfer.getData("id")).cloneNode(true)
                        e.target.appendChild(elm)
                    }
                }}
                onDragOver={e => {
                    if (e.target.id == "drop-zone") {
                        e.preventDefault();
                    }
                }}
            >

            </div>
        )
    }
}

export default DragDrop;
