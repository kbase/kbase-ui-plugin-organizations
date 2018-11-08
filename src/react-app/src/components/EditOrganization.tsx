import * as React from 'react'
import { Redirect } from 'react-router-dom';
import marked from 'marked';

import * as types from '../types';

import './EditOrganization.css'
import { Button, Tooltip } from 'antd';
import Header from './Header';
import { FaPencilAlt } from 'react-icons/fa';

export interface EditedOrganization {
    id: string,
    name: string,
    description: string
}

export interface EditOrganizationState {
    canceling: boolean;

    // editedOrganization?: EditedOrganization
}

class EditOrganization extends React.Component<types.EditOrganizationProps, EditOrganizationState> {

    constructor(props: types.EditOrganizationProps) {
        super(props)

        this.state = {
            canceling: false
        }

        this.props.onEditOrg(this.props.id)
    }

    onClickCancel() {
        this.setState({ canceling: true })
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.props.onUpdateOrg();
    }

    onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist();
        this.props.onUpdateName(e.target.value)
    }

    onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        e.persist()
        this.props.onUpdateDescription(e.target.value)
    }

    onIdChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist();
        // this.props.onUpdateId(e.target.value)
    }

    renderForm() {
        if (!this.props.editedOrganization) {
            return
        }
        return (
            <form id="editOrganizationForm" className="editor" onSubmit={this.onSubmit.bind(this)}>
                <div className="row">
                    <div className="col1 field-label">name</div>
                    <div className="col2">
                        <input value={this.props.editedOrganization.name.value}
                            onChange={this.onNameChange.bind(this)} />
                        {this.props.editedOrganization.name.error ? (<span style={{ color: 'red' }}>{this.props.editedOrganization.name.error.message}</span>) : ''}
                    </div>
                </div>
                <div className="row">
                    <div className="col1 field-label">id</div>
                    <div className="col2">
                        <Tooltip title="The id may not be changed">
                            <input value={this.props.editedOrganization.id.value}
                                readOnly />
                        </Tooltip>
                    </div>
                </div>
                <div className="row" style={{ flex: '1 1 0px', minHeight: '30em', maxHeight: '60em' }}>
                    <div className="col1 field-label">description</div>
                    <div className="col2">
                        <textarea value={this.props.editedOrganization.description.value}
                            onChange={this.onDescriptionChange.bind(this)} />
                        {this.props.editedOrganization.description.error ? (<span style={{ color: 'red' }}>{this.props.editedOrganization.description.error.message}</span>) : ''}
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col1"></div>
                    <div className="col2">
                        <div className="footer">
                            <Button icon="save"
                                form="editOrganizationForm"
                                key="submit"
                                htmlType="submit">Save</Button>
                            <Button type="danger" icon="undo"
                                onClick={this.onClickCancel.bind(this)}>Cancel &amp; Return to Orgs</Button>
                        </div>
                    </div>
                </div> */}

            </form>
        )
    }

    renderPreview() {
        if (!this.props.editedOrganization) {
            return
        }
        return <form className="preview">
            <div className="row">
                <div className="col2">
                    <div className="name">
                        {this.props.editedOrganization.name.value || ''}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col2">
                    <div className="id">
                        <span style={{ color: 'silver' }}>https://narrative.kbase.us/organizations/</span>{this.props.editedOrganization.id.value || ''}
                    </div>
                </div>
            </div>
            <div className="row" style={{ flex: '1 1 0px', minHeight: '30em', maxHeight: '60em' }}>
                <div className="col2">
                    <div className="description"
                        dangerouslySetInnerHTML={({ __html: marked(this.props.editedOrganization.description.value || '') })}
                    />
                </div>
            </div>
        </form>
    }

    renderHeader() {
        return (
            <Header title="Organizations">
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            <FaPencilAlt style={{ verticalAlign: 'middle' }} />
                            {' '}
                            Editing Org "
                            {this.props.editedOrganization!.name.value}
                            "
                        </span>
                    </div>
                    <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Button
                            icon="save"
                            form="editOrganizationForm"
                            key="submit"
                            htmlType="submit">
                            Save
                        </Button>
                        <Button
                            type="danger"
                            icon="undo"
                            onClick={this.onClickCancel.bind(this)}>
                            Cancel &amp; Return to Org
                        </Button>
                    </div>
                </div>
            </Header>
        )
    }

    renderLoadingHeader() {
        return (
            <Header title="Organizations">
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            Loading Org...
                        </span>
                    </div>
                </div>
            </Header>
        )
    }

    render() {
        if (this.state.canceling) {
            return <Redirect push to={"/viewOrganization/" + this.props.id} />
        }
        if (!this.props.editedOrganization) {
            return (
                <div className="EditOrganization">
                    {this.renderLoadingHeader()}
                </div>
            )
        }

        return (
            <div className="EditOrganization">
                {this.renderHeader()}
                <div className="mainRow">
                    <div className="editorColumn">
                        <h3>Editor</h3>
                        {this.renderForm()}
                    </div>
                    <div className="previewColumn">
                        <h3>Preview</h3>
                        {this.renderPreview()}
                    </div>
                </div>
            </div>
        )
    }
}

export default EditOrganization
