import React from 'react';


const Shorttext = props => {
    const { label, style, onChange, ...rest } = props;
    return [
        <p key="p">{label}</p>,
        <input key="input" type="text" style={{ width: "100%", ...(style || {}) }} onChange={e => onChange(e.target.value)} {...rest} />
    ]
}
const Password = props => {
    const { label, ...rest } = props;
    return [
        <p key="p">{label}</p>,
        <input key="input" type="password" {...rest} />
    ]
}

const DateField = props => {
    const { label, ...rest } = props;
    return [
        <p key="p">{label}</p>,
        <input key="input" type="date" {...rest} />
    ]
}

const Longtext = props => {
    const { label, ...rest } = props;
    return [
        <p key="p">{label}</p>,
        <textarea key="input" rows="4" {...rest} />
    ]
}

const Selectfield = props => {
    const { label, options, defaultSelectedKey, value, onChange, ...rest } = props;
    return [
        <p key="p">{label}</p>,
        <select key="input" value={value || defaultSelectedKey} onChange={e => onChange(options[e.target.value * 1])} {...rest}>
            {(options || []).map((op, ind) => {
                return (
                    <option key={ind} value={ind}>{op.text}</option>
                )
            }
            )}
        </select>
    ]
}
const Checkbox = props => {
    const { label, ...rest } = props;
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <p key="p">{label}</p>
            <input key="input" type="checkbox" style={{ marginLeft: 8 }} {...rest} />
        </div>
    )
}

const NumberField = props => {
    const { label, onChange, ...rest } = props;
    return [
        <p key="p">{label}</p>,
        <input key="input" type="number" onChange={e => onChange(e.target.value)} {...rest} />
    ]
}

const Label = props => {
    const { children } = props;
    return <p>{children}</p>
}

const LabelHeader = props => {
    const { children } = props;
    return <p>{children}</p>
}
const Title = props => {
    const { children } = props;
    return <h1>{children}</h1>
}

const Description = props => {
    const { children } = props;
    return <h2>{children}</h2>
}

const CommandBar = props => {
    const { items, ...rest } = props;
    return (
        <div style={{
            backgroundColor: "#f4f4f4",
            padding: "8px 0",
            margin: "8px 0 0 0"
        }}>
            <div style={{ display: "flex", justifyContent: "space-around" }} >
                {
                    items ?
                        items.map((i, index) => <CommandBarButton {...i} key={index} />)
                        : <span>Item not found</span>}
            </div >
        </div >
    )
}

const commandBarButtonDsc = {
    add: "Ekle",
    swapUp: "Yukarı Kaydır",
    swapDown: "Aşağı Kaydır",
    removeAll: "Hepsini Sil",
    remove: "Sil"

}

const CommandBarButton = props => {
    const { type, ...rest } = props;
    return (
        <div style={{ cursor: "pointer" }} {...rest}>{commandBarButtonDsc[type]}</div>
    )
}

let struct = {
    shorttext: Shorttext,
    longtext: Longtext,
    password: Password,
    date: DateField,
    checkbox: Checkbox,
    selectfield: Selectfield,
    number: NumberField,
    label: Label,
    labelHeader: LabelHeader,
    title: Title,
    commandbar: CommandBar,
    description: Description
}

export function setStruct(_struct) {
    struct = { ...struct, ..._struct }
}

export let supportedFields = [
    {
        formValue: "string",
        component: "shorttext",
        uiValue: "shorttext",
        text: "Kısa Açıklama"
    },
    {
        formValue: "string",
        component: "longtext",
        uiValue: "textarea",
        text: "Uzun Açıklama"
    },
    {
        formValue: "integer",
        component: "number",
        uiValue: "number",
        text: "Sayı"
    },
    {
        formValue: "string",
        component: "shorttext",
        uiValue: "email",
        text: "E-mail"
    },
    {
        formValue: "string",
        component: "password",
        uiValue: "password",
        text: "Şifre"
    },
    {
        formValue: "string",
        component: "selectfield",
        uiValue: "selectfield",
        text: "Selectfield"
    },
].map((i) => ({ ...i, key: i.uiValue }))


export function setSchemaField(fields) {
    supportedFields = [...supportedFields, ...fields].map((i) => ({ ...i, key: i.uiValue }))
}

export default class FieldCreator extends React.Component {
    render() {
        const { type, name, ...rest } = this.props;
        const component = struct[type];
        if (component)
            return (
                React.createElement(component, { name, type, ...rest })
            )
        else {
            return <p>Desteklenmeyen field</p>
        }
    }
}