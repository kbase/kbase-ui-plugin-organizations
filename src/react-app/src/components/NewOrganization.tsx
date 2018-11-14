import * as React from 'react'
import { Redirect } from 'react-router-dom';
import marked from 'marked';
import { Button, Icon, Modal } from 'antd';
import md5 from 'md5'

import { EditableOrganization, SaveState, ValidationState, EditState } from '../types';

import './NewOrganization.css'

import Header from './Header';

export interface NewOrganizationProps {
    editState: EditState,
    saveState: SaveState,
    validationState: ValidationState,
    newOrganization: EditableOrganization,
    onAddOrgEdit: () => void,
    onAddOrg: () => void,
    onUpdateName: (name: string) => void,
    onUpdateGravatarHash: (gravatarHash: string) => void;
    onUpdateId: (id: string) => void,
    onUpdateDescription: (description: string) => void
}


export interface NewOrganizationState {
    cancelToBrowser: boolean;
}

class NewOrganization extends React.Component<NewOrganizationProps, NewOrganizationState> {

    origin: string;
    gravatarEmail: React.RefObject<HTMLInputElement>

    constructor(props: NewOrganizationProps) {
        super(props)

        this.state = {
            cancelToBrowser: false
        }

        this.gravatarEmail = React.createRef()

        this.origin = document.location!.origin

        this.props.onAddOrgEdit()
    }

    onShowInfo() {
        Modal.info({
            title: 'New Organization Editor Help',
            content: (
                <div>
                    <p>This is the new organizations editor...</p>
                </div>
            )
        })
    }

    onGravatarEmailSync() {
        let email;
        if (this.gravatarEmail.current) {
            email = this.gravatarEmail.current.value
        } else {
            email = 'n/a'
        }
        const hashed = md5(email)
        this.props.onUpdateGravatarHash(hashed);
    }

    onClickCancelToBrowser() {
        this.setState({ cancelToBrowser: true })
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

    onGravatarHashChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist();
        this.props.onUpdateGravatarHash(e.target.value);
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
                <div className="row gravatarHash">
                    <div className="col1 field-label">gravatar hash</div>
                    <div className="col2">
                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '4px' }}>
                            <div style={{ flex: '1 1 0px' }}>
                                <input ref={this.gravatarEmail} placeholder="Provide your gravatar-linked email address, if any" />
                            </div>
                            <div style={{ flex: '0 0 auto' }}>
                                <Button
                                    icon="sync"
                                    style={{ height: '100%' }}
                                    onClick={this.onGravatarEmailSync.bind(this)} />
                            </div>
                        </div>
                        <input value={this.props.newOrganization.gravatarHash.value || ''}
                            onChange={this.onGravatarHashChange.bind(this)} />
                        {this.props.newOrganization.gravatarHash.error ? (<span style={{ color: 'red' }}>{this.props.newOrganization.gravatarHash.error.message}</span>) : ''}
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

    getOrgAvatarUrl(org: EditableOrganization) {
        // const defaultImages = [
        //     'orgs-64.png',
        //     'unicorn-64.png'
        // ]
        // if (!org.gravatarHash.value) {
        //     return defaultImages[Math.floor(Math.random() * 2)]
        // }
        if (!org.gravatarHash.value) {
            return 'unicorn-64.png'
        }
        const gravatarDefault = 'identicon';

        return 'https://www.gravatar.com/avatar/' + org.gravatarHash.value + '?s=64&amp;r=pg&d=' + gravatarDefault;
    }

    renderOrgAvatar(org: EditableOrganization) {
        // console.log('grav?', org.gravatarHash)
        return (
            <img style={{ width: 64, height: 64 }}
                src={this.getOrgAvatarUrl(org)} />
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
                    <div className="gravatarHash">
                        {this.renderOrgAvatar(this.props.newOrganization)}
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
            <Header>
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
                            onClick={this.onClickCancelToBrowser.bind(this)}>
                            {/* <FaUndo style={{ verticalAlign: 'center' }} />  */}
                            Return to Orgs Browser
                        </Button>
                        <Button shape="circle" icon="info" onClick={this.onShowInfo.bind(this)}></Button>
                    </div>
                </div>
            </Header>
        )
    }

    renderLoadingHeader() {
        return (
            <Header>
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
        if (this.state.cancelToBrowser) {
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
            </div>
        )
    }
}

export default NewOrganization