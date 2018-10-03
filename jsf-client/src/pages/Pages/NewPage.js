import React from 'react';
import JSONSchemaFormBuilder from '../../components/JSONSchema/JSONSchemaBuilder'
import { IotaApplication } from '../../utils'
import { Modal, Button } from 'antd'

class NewPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { label: "", path: "" }
        this.save = this.save.bind(this);
        this.handleCancel = this.handleCancel.bind(this)
    }


    componentWillMount() {
        if (this.props.match)
            if (this.props.match.params.page_id)
                IotaApplication.actions.fetchQueryResult({
                    path: "pages",
                    params: {
                        record_id: this.props.match.params.page_id
                    },
                    postAction: data => this.setState({ data: data[0].data })
                })
    }


    save() {
        IotaApplication.actions.upsertForm({
            path: "pages",
            pk: this.props.match.params.page_id,
            data: this.state.data,
        })

    }

    handleCancel() {
        this.props.onClose();
        this.setState({ label: "", path: "" })
    }
    render() {
        console.log("this.state", this.state)
        return (
            <div>
                <JSONSchemaFormBuilder
                    initialData={this.state.data}
                    onClose={() => IotaApplication.history.goBack()}
                    onChange={data => this.setState({ data })} />
                <Button type="primary" onClick={this.save}>Kaydet</Button>
            </div>

        );
    }
}

export default NewPage