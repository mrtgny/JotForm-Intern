import React, { Component } from 'react';
import FieldCreator from './FieldCreator';

class JSONSchemaViewer extends Component {
    render() {
        if (!this.props.formData || !this.props.formData.form)
            return null
        const { formData: { form: { properties } }, value } = this.props
        const propertyFields = Object.keys(properties || {})
        return (
            <div>
                {propertyFields.map((fieldKey, index) => {
                    const label = properties[fieldKey].title;
                    const dsc = value[fieldKey]
                    return (
                        <div style={{ display: "flex", width: "100%", marginTop: 8 }} key={index}>
                            <div style={{ width: 20, backgroundColor: "#71afe5" }}></div>
                            <div style={{ width: "100%", backgroundColor: "#f4f4f4", padding: 8 }}>
                                <FieldCreator type="labelHeader">
                                    {label}
                                </FieldCreator>
                                <FieldCreator type="label">
                                    {dsc}
                                </FieldCreator>
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default JSONSchemaViewer;