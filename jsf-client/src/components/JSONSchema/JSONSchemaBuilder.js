import React from 'react';
import FieldCreator, { supportedFields } from './FieldCreator';

let staticIndex = 0;

const initialState = {
    form: {
        title: "Örnek Form",
        description: "Örnek Açıklama",
        type: "object",
        required: {
            "ÖrnekAlan": 0
        },
        properties: {
            "ÖrnekAçıklama": {
                type: "string",
                title: "Örnek Açıklama"
            }
        }
    },
    uiSchema: {
        "ÖrnekAçıklama": {
            component: "shorttext",
            uiValue: "shorttext",
            order: 0
        }
    }
}

class JSONSchemaBuilder extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...initialState,
            ...(props.initialData ? props.initialData : {})
        }
        if (props.onChange)
            props.onChange(this.state)
        this.onSettingsChange = this.onSettingsChange.bind(this);
        this.onOptionsChange = this.onOptionsChange.bind(this);
        this.onNewFieldAdd = this.onNewFieldAdd.bind(this);
        this.onChange = this.onChange.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.initialData != nextProps.initialData ) {
            this.setState({ ...nextProps.initialData })
        }
    }


    onChange(newState) {
        const { onChange } = this.props;
        this.setState({ ...newState }, () => {
            if (onChange)
                onChange(this.state)
        })
    }


    handleOnFieldTypeChange(name, field, value) {
        const { form, form: { properties }, uiSchema } = this.state;
        this.onChange({
            form: {
                ...form, properties: {
                    ...properties, [name]: {
                        ...properties[name],
                        type: value.formValue
                    }
                }
            },
            uiSchema: {
                ...uiSchema,
                [name]: {
                    ...uiSchema[name],
                    component: value.component,
                    uiValue: value.uiValue
                }
            }
        })
    }

    handleOnLabelChange(name, field, value) {
        const { form, form: { properties, required }, uiSchema } = this.state;
        const _value = value.split(" ").join("")

        const newName = (properties[_value] ? _value + staticIndex++ : _value).split(" ").join("");

        const _properties = { ...properties };
        const _required = { ...required };
        const _uiSchema = { ...uiSchema };

        const oldPropValues = properties[name];
        const oldRequiredValues = required[name];
        const oldUiSchemaValues = uiSchema[name];

        delete _properties[name]
        delete _required[name]
        delete _uiSchema[name]

        _properties[newName] = { ...oldPropValues, title: value };
        _required[newName] = oldRequiredValues;
        _uiSchema[newName] = oldUiSchemaValues;

        this.onChange({
            form: {
                ...form,
                properties: _properties,
                required: _required
            },
            uiSchema: _uiSchema
        })
    }

    handleOnRequiredChange(name, field, value) {
        const { form, form: { required } } = this.state;
        this.onChange({
            form: {
                ...form,
                required: {
                    ...required,
                    [name]: value
                }
            }
        })
    }

    onSettingsChange(name, value) {

        const { form, form: { properties } } = this.state;
        this.onChange({
            form: {
                ...form, properties: {
                    ...properties, [name]: {
                        ...properties[name],
                        ...value
                    }
                }
            }
        })
    }

    onOptionsChange(name, options) {

        const { uiSchema } = this.state;
        this.onChange({
            uiSchema: {
                ...uiSchema,
                [name]: {
                    ...uiSchema[name],
                    options
                }
            }
        })
    }

    setNewName(properties, name) {
        if (properties[name])
            return this.setNewName(properties, name + staticIndex++)
        else
            return name
    }

    onNewFieldAdd() {

        const { form, form: { properties, required }, uiSchema } = this.state;
        const name = "ÖrnekAlan"
        const newName = this.setNewName(properties, name)

        this.onChange({
            form: {
                ...form,
                properties: {
                    ...properties,
                    [newName]: {
                        type: "string",
                        title: "Örnek Açıklama"
                    }
                },
                required: {
                    ...required,
                    [newName]: "0"
                }
            },
            uiSchema: {
                ...uiSchema,
                [newName]: {
                    component: "shorttext",
                    uiValue: "shorttext",
                    order: Object.keys(properties).length
                }
            }
        })
    }


    swap(src, target) {

        const { uiSchema } = this.state

        const uiSchemaFields = Object.keys(uiSchema)

        const srcField = uiSchema[uiSchemaFields.filter(i => uiSchema[i].order === src)[0]]
        const targetField = uiSchema[uiSchemaFields.filter(i => uiSchema[i].order === target)[0]]

        srcField.order = target
        targetField.order = src

        this.onChange({ uiSchema: { ...uiSchema, srcField, targetField } })

    }

    removeItem(fieldKey) {
        const { form, form: { properties } } = this.state
        delete properties[fieldKey]
        this.onChange({ form: { ...form, properties: { ...properties } } })
    }

    render() {

        const { form: { properties, required, title, description }, uiSchema } = this.state
        const propertyFields = Object.keys(properties).sort((i1, i2) => parseInt(uiSchema[i1].order) - parseInt(uiSchema[i2].order))

        const mainCommandBarItems = [
            {
                type: "add",
                onClick: this.onNewFieldAdd,
            },
            {
                type: "removeAll",
                onClick: () => this.onChange({ ...initialState })
            }
        ]

        const fieldCommandBarItems = (fieldKey, index) => ([
            {
                type: "swapUp",
                onClick: () => this.swap(index, index - 1),
                disabled: !index,
            },
            {
                type: "swapDown",
                onClick: () => this.swap(index, index + 1),
                disabled: index + 1 === propertyFields.length,
            },
            {
                type: "remove",
                onClick: () => this.removeItem(fieldKey),
            },
        ])
        //console.log("this.state", this.state)
        return (
            <div>
                <div className="iota-cell">
                    <FieldCreator label="Form Adı" value={title} placheholder="Örnek Formu" type="shorttext" onChange={title => this.onChange({ form: { ...this.state.form, title } })} />
                </div>
                <div className="iota-cell">
                    <FieldCreator label="Açıklama" value={description} type="shorttext" placheholder="Örnek Açıklama" onChange={description => this.onChange({ form: { ...this.state.form, description } })} />
                </div>

                <div className="iota-cell">
                    <FieldCreator type="commandbar" items={mainCommandBarItems} />
                </div>
                <div style={{ maxHeight: "calc(100vh - 380px)", overflow: "auto" }}>
                    {propertyFields.map((fieldKey, index) => {
                        const field = properties[fieldKey]
                        const { component, uiValue } = uiSchema[fieldKey]
                        const isRequired = (required[fieldKey] || 0) * 1
                        const { type, title } = field
                        return (
                            <div key={index}>
                                <div className="iota-cell">
                                    <FieldCreator type="commandbar" items={fieldCommandBarItems(fieldKey, index)} />
                                </div>
                                <div style={{ display: "flex", width: "100%" }}>
                                    <div style={{ width: 20, backgroundColor: "#71afe5" }}></div>
                                    <div style={{ width: "100%", margin: 8, padding: 8 }}>
                                        <FieldCreator label="Form Alanı Tipi" defaultSelectedKey={uiValue} value={uiValue} options={supportedFields} type="selectfield" onChange={(e) => this.handleOnFieldTypeChange(fieldKey, field, e)} />
                                        <FieldCreator label="Başlık" value={title} type="shorttext" onChange={(e) => this.handleOnLabelChange(fieldKey, field, e)} />
                                        <div className="iota-cell">
                                            <FieldCreator label="Zorunlu Alan" value={isRequired} type="checkbox" onChange={(e) => this.handleOnRequiredChange(fieldKey, field, e)} />
                                        </div>
                                        {["shorttext", "number", "longtext", "password"].indexOf(component) > -1 ?
                                            <Settings type={type} field={field} onSettingsChange={(val) => this.onSettingsChange(fieldKey, val)} /> : null}
                                        {["selectfield"].indexOf(component) > -1 ?
                                            <AddOptions values={uiSchema[fieldKey].options || [""]} onOptionsChange={(val) => this.onOptionsChange(fieldKey, val)} /> : null}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const typeSettings = {
    string: [
        {
            type: "number",
            value: "minLength",
            text: "En az karakter sayısı"
        }
    ],
    integer: [
        {
            type: "number",
            value: "minLength",
            text: "En az karakter sayısı"
        }
    ],
}


class AddOptions extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onChange = this.onChange.bind(this)
    }

    onChange(value, index) {
        const { onOptionsChange } = this.props
        const values = [...this.props.values]

        if (index > -1) {
            values[index] = value
        } else {
            values.push(value)
        }

        onOptionsChange(values)
    }

    swap(src, target) {

        const { onOptionsChange } = this.props;
        const values = [...this.props.values]

        const tmp = values[src];
        values[src] = values[target]
        values[target] = tmp
        onOptionsChange(values);
    }

    removeItem(index) {
        const { onOptionsChange } = this.props;
        const values = [...this.props.values]
        values.splice(index, 1)
        onOptionsChange(values);
    }

    render() {
        const { onOptionsChange, values } = this.props

        const mainCommandBarItems = [
            {
                type: "add",
                onClick: () => this.onChange("", -1),
            },
            {
                type: "removeAll",
                onClick: () => onOptionsChange([""]),
            },
        ]

        const fieldCommandBarItems = index => ([
            {
                type: "swapUp",
                onClick: () => this.swap(index, index - 1),
                disabled: !index,
            },
            {
                type: "swapDown",
                onClick: () => this.swap(index, index + 1),
                disabled: index + 1 === values.length,
            },
            {
                type: "remove",
                onClick: () => this.removeItem(index),
            },
        ])

        return (
            <div>
                {values.map((val, index) => {
                    return (
                        <div key={index} className="iota-cell">
                            <FieldCreator type="commandbar" items={fieldCommandBarItems(index)} />
                            <div className="iota-cell">
                                <FieldCreator type="shorttext" value={val} onChange={(e) => this.onChange(e, index)} />
                            </div>
                        </div>
                    )
                })}
                <div className="iota-cell">
                    <FieldCreator type="commandbar" items={mainCommandBarItems} />
                </div>
            </div>
        )
    }
}

class Settings extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {}
        this.onChange = this.onChange.bind(this);
    }


    onChange(field, value) {
        const { onSettingsChange } = this.props

        this.setState({
            [field.value]: value
        }, () => onSettingsChange(this.state))
    }

    render() {
        const { type, field } = this.props
        return (
            <div>
                {typeSettings[type].map((setting, index) => {
                    return (
                        <FieldCreator key={index} value={field[setting.value] || ""} label={setting.text} type={setting.type} onChange={(e) => this.onChange(setting, e)} />
                    )
                })}
            </div>
        )
    }
}

export default JSONSchemaBuilder;