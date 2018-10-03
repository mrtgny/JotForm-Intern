import React, { Component } from 'react';
import FieldCreator from './FieldCreator';

class JSONSchemaForm extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            values: {
                ...props.values
            }
        }
        this.onGetErrorMessage = this.onGetErrorMessage.bind(this)
    }

    onGetErrorMessage(fieldKey, value) {
        const { form: { properties, required } } = this.props.data;
        const field = properties[fieldKey];
        const _required = (required[fieldKey] || "0") * 1

        if (field.minLength)
            return value.length > parseInt(field.minLength) ? '' : `En az ${field.minLength} karakter girilmelidir.`;
        if (_required && !value)
            return "Bu alan zorunludur!"
        return ""
    }

    render() {
        const { data, renderFooter } = this.props
        if (!data)
            return null
        const { form: { title, description, properties, required }, uiSchema } = data;
        const propertyFields = Object.keys(properties || {}).sort((i1, i2) => parseInt(uiSchema[i1].order) - parseInt(uiSchema[i2].order))

        return (
            <div>
                <FieldCreator type="title">
                    {title}
                </FieldCreator>
                <FieldCreator type="description">
                    {description}
                </FieldCreator>
                {propertyFields.map((fieldKey, index) => {
                    const field = properties[fieldKey];
                    const _required = (required[fieldKey] || "0") * 1
                    const { title } = field
                    const { component, options } = uiSchema[fieldKey]
                    const _options = options ? options.map((i) => ({ text: i, key: i })) : undefined
                    return (
                        <div key={index}>
                            <FieldCreator type={component || "shorttext"}
                                label={title}
                                options={_options}
                                value={this.state.values[fieldKey]}
                                onChange={e => this.setState({ values: { ...this.state.values, [fieldKey]: (e.text || e) } })}
                                errorMessage={this.onGetErrorMessage(fieldKey, this.state.values[fieldKey] || "")}
                                required={_required} />
                        </div>
                    )
                })}
                {renderFooter(this.state.values) }
            </div>
        );
    }
}

export default JSONSchemaForm;