import * as React from 'react'
import { Redirect } from 'react-router-dom';
import marked from 'marked';

import { NewOrganizationProps, SaveState, ValidationState, EditState } from '../types';

import './NewOrganization.css'
import { Button, Icon } from 'antd';
import Header from './Header';

export interface NewOrganizationState {
    canceling: boolean;

    // pendingOrganization: PendingOrganization
}

class NewOrganization extends React.Component<NewOrganizationProps, NewOrganizationState> {

    origin: string;

    constructor(props: NewOrganizationProps) {
        super(props)

        this.state = {
            canceling: false
        }

        this.origin = document.location!.origin

        this.props.onAddOrgEdit()
    }

    onClickCancel() {
        this.setState({ canceling: true })
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log('submitted')
        this.props.onAddOrg();
    }

    onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist();
        this.props.onUpdateName(e.target.value);
    }

    onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        e.persist()
        this.props.onUpdateDescription(e.target.value);
    }

    onIdChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist();
        this.props.onUpdateId(e.target.value);
    }

    canSave() {
        return (
            this.props.editState === EditState.EDITED &&
            this.props.validationState === ValidationState.VALID &&
            (this.props.saveState === SaveState.NEW ||
                this.props.saveState === SaveState.READY ||
                this.props.saveState === SaveState.SAVED)
        )
    }

    renderForm() {
        return (
            <form id="newOrganizationForm" className="editor" onSubmit={this.onSubmit.bind(this)}>
                <div className="row">
                    <div className="col1 field-label">name</div>
                    <div className="col2">
                        <input value={this.props.newOrganization.name.value || ''}
                            onChange={this.onNameChange.bind(this)} />
                        {this.props.newOrganization.name.error ? (<span style={{ color: 'red' }}>{this.props.newOrganization.name.error.message}</span>) : ''}
                    </div>
                </div>
                <div className="row">
                    <div className="col1 field-label">id</div>
                    <div className="col2">
                        <input value={this.props.newOrganization.id.value || ''}
                            onChange={this.onIdChange.bind(this)} />
                        {this.props.newOrganization.id.error ? (<span style={{ color: 'red' }}>{this.props.newOrganization.id.error.message}</span>) : ''}
                    </div>
                </div>
                <div className="row" style={{ flex: '1 1 0px', minHeight: '30em', maxHeight: '60em' }}>
                    <div className="col1 field-label">description</div>
                    <div className="col2">
                        <textarea value={this.props.newOrganization.description.value || ''}
                            onChange={this.onDescriptionChange.bind(this)} />
                        {this.props.newOrganization.description.error ? (<div style={{ color: 'red' }}>{this.props.newOrganization.description.error.message}</div>) : ''}
                    </div>
                </div>
                <div className="row">
                    <div className="col1"></div>
                    <div className="col2">
                        {/* <div className="footer">
                            <Button form="newOrganizationForm"
                                key="submit"
                                htmlType="submit">Save</Button>
                            <Button type="danger"
                                onClick={this.onClickCancel.bind(this)}>Cancel</Button>
                        </div> */}
                    </div>
                </div>
            </form>
        )
    }

    renderPreview() {
        return <form className="preview">
            <div className="row">
                <div className="col2">
                    <div className="name">
                        {this.props.newOrganization.name.value || ''}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col2">
                    <div className="id">
                        <span style={{ color: 'silver' }}>{this.origin}/#orgs/organizations/</span>
                        {this.props.newOrganization.id.value || (<span style={{ fontStyle: 'italic' }}>organization id here</span>)}
                    </div>
                </div>
            </div>
            <div className="row" style={{ flex: '1 1 0px' }}>
                <div className="col2">
                    <div className="description"
                        dangerouslySetInnerHTML={({ __html: marked(this.props.newOrganization.description.value || '') })}
                    />
                </div>
            </div>
        </form>
    }

    renderState() {
        const { editState, validationState, saveState } = this.props;
        const label = 'edit: ' + editState + ', valid: ' + validationState + ', save: ' + saveState
        return (
            <span style={{ marginRight: '10px' }}>{label}</span>
        )
    }

    renderHeader() {
        const orgName = this.props.newOrganization!.name.value || (<span style={{ fontStyle: 'italic', color: 'gray' }}>org name will appear here when you edit the name field</span>)
        return (
            <Header title="Organizations">
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            {/* <FaPlusCircle style={{ verticalAlign: 'middle' }} /> */}
                            <Icon type="plus-circle" />
                            {' '}
                            Adding a New Org "
                            {orgName}
                            "
                        </span>
                    </div>
                    <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {/* {this.renderState()} */}
                        <Button icon="save"
                            form="newOrganizationForm"
                            key="submit"
                            disabled={!this.canSave.call(this)}
                            htmlType="submit">
                            {/* <Icon type="save" /> */}
                            {/* <FaSave style={{ verticalAlign: 'center' }} /> */}
                            Save
                        </Button>
                        <Button icon="undo"
                            type="danger"
                            onClick={this.onClickCancel.bind(this)}>
                            {/* <FaUndo style={{ verticalAlign: 'center' }} />  */}
                            Return to Orgs
                        </Button>
                    </div>
                </div>
            </Header>
        )
    }

    renderFooter() {
        return (
            <div className="footerRow">
                <div className="editorColumn">
                    <div className="row">
                        <div className="col1">
                        </div>
                        <div className="col2">
                            <div className="footer">
                                <Button form="newOrganizationForm"
                                    key="submit"
                                    htmlType="submit">Save</Button>
                                <Button type="danger"
                                    onClick={this.onClickCancel.bind(this)}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="previewColumn">

                </div>
            </div>
        )
    }

    renderLoadingHeader() {
        return (
            <Header title="Organizations">
                <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <div style={{ flex: '0 0 auto' }}>
                        <span>
                            Loading New Org Editor...
                        </span>
                    </div>
                </div>
            </Header>
        )
    }

    render() {
        if (this.state.canceling) {
            return <Redirect push to="/organizations" />
        }

        // TODO: this is just a prop for today.
        if (this.props.saveState === SaveState.SAVED) {
            return <Redirect push to={"/editOrganization/" + this.props.newOrganization.id.value} />
        }

        if (!this.props.newOrganization) {
            return (
                <div className="NewOrganization">
                    {this.renderLoadingHeader()}
                </div>
            )
        }

        return (
            <div className="NewOrganization">
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
                {/* {this.renderFooter()} */}
            </div>
        )
    }
}

export default NewOrganization