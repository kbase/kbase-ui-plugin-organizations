import * as React from 'react'
import { Redirect, NavLink } from 'react-router-dom';
import marked from 'marked';
import { Button, Icon, Modal, Checkbox } from 'antd';
import md5 from 'md5'

import { EditableOrganization, SaveState, ValidationState, EditState } from '../../../types';

import './component.css'

import Header from '../../Header';
import OrganizationHeader from '../organizationHeader/loader';
import * as orgModel from '../../../data/models/organization/model'
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

export interface EditOrganizationProps {
    editState: EditState
    saveState: SaveState
    validationState: ValidationState
    editedOrganization: EditableOrganization
    organization: orgModel.Organization
    onEditOrgSave: () => void
    onUpdateName: (name: string) => void
    onUpdateGravatarHash: (gravatarHash: string) => void
    // onUpdateId: (id: string) => void,
    onUpdateDescription: (description: string) => void
    onUpdateIsPrivate: (isPrivate: boolean) => void
}

enum NavigateTo {
    NONE = 0,
    BROWSER,
    VIEWER
}

export interface EditOrganizationState {
    cancelToBrowser: boolean;
    cancelToViewer: boolean;
    navigateTo: NavigateTo;
}

class EditOrganization extends React.Component<EditOrganizationProps, EditOrganizationState> {

    origin: string;

    gravatarEmail: React.RefObject<HTMLInputElement>

    constructor(props: EditOrganizationProps) {
        super(props)

        this.state = {
            cancelToBrowser: false,
            cancelToViewer: false,
            navigateTo: NavigateTo.NONE
        }

        this.gravatarEmail = React.createRef()

        this.origin = document.location!.origin
    }

    onShowInfo() {
        Modal.info({
            title: 'Organization Editor Help',
            width: '50em',
            content: (
                <div>
                    <p>This is the organizations editor...</p>
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
        if (!this.isModified()) {
            this.setState({ cancelToBrowser: true })
            return
        }

        const confirm = () => {
            this.setState({ cancelToBrowser: true })
        }
        const cancel = () => {
        }
        Modal.confirm({
            title: 'Leave the editor?',
            content: (
                <div>
                    <p>You have made changes on this edit form.</p>

                    <p>If you leave the editor without saving, any <i>changes they will be lost</i>.</p>

                    <p><b>Continue to leave the editor?</b></p>
                </div>
            ),
            onOk: confirm,
            onCancel: cancel,
            okText: 'Yes',
            cancelText: 'No'
        })
    }

    onClickCancelToViewer() {
        if (!this.isModified()) {
            this.setState({ cancelToViewer: true })
            return
        }

        const confirm = () => {
            this.setState({ cancelToViewer: true })
        }
        const cancel = () => {
        }
        Modal.confirm({
            title: 'Leave the editor?',
            content: (
                <div>
                    <p>You have made changes on this edit form.</p>

                    <p>If you leave the editor without saving, any <i>changes they will be lost</i>.</p>

                    <p><b>Continue to leave the editor?</b></p>
                </div>
            ),
            onOk: confirm,
            onCancel: cancel,
            okText: 'Yes',
            cancelText: 'No'
        })
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.props.onEditOrgSave();
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
        // this.props.onUpdateId(e.target.value);
        console.warn('no updating id, naughty!')
    }

    onIsPrivateChange(e: CheckboxChangeEvent) {
        this.props.onUpdateIsPrivate(e.target.checked)
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

    isModified() {
        return (
            this.props.editState === EditState.EDITED &&
            (this.props.saveState === SaveState.NEW ||
                this.props.saveState === SaveState.READY)
        )
    }

    renderForm() {
        return (
            <form id="editOrganizationForm" className="editor" onSubmit={this.onSubmit.bind(this)}>
                <div className="row">
                    <div className="col1 field-label">name</div>
                    <div className="col2">
                        <input value={this.props.editedOrganization.name.value || ''}
                            onChange={this.onNameChange.bind(this)} />
                        {this.props.editedOrganization.name.error ? (<span style={{ color: 'red' }}>{this.props.editedOrganization.name.error.message}</span>) : ''}
                    </div>
                </div>
                <div className="row">
                    <div className="col1 field-label">is private?</div>
                    <div className="col2">
                        <Checkbox
                            checked={this.props.editedOrganization.isPrivate.value}
                            onChange={this.onIsPrivateChange.bind(this)} />
                        {this.props.editedOrganization.isPrivate.error ? (<span style={{ color: 'red' }}>{this.props.editedOrganization.isPrivate.error.message}</span>) : ''}
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
                                    icon="arrow-down"
                                    style={{ height: '100%' }}
                                    onClick={this.onGravatarEmailSync.bind(this)} />
                            </div>
                        </div>

                        <input value={this.props.editedOrganization.gravatarHash.value || ''}
                            onChange={this.onGravatarHashChange.bind(this)} />
                        {this.props.editedOrganization.gravatarHash.error ? (<span style={{ color: 'red' }}>{this.props.editedOrganization.gravatarHash.error.message}</span>) : ''}
                    </div>
                </div>
                <div className="row">
                    <div className="col1 field-label">id</div>
                    <div className="col2">
                        <input value={this.props.editedOrganization.id.value || ''}
                            onChange={this.onIdChange.bind(this)} />
                        {this.props.editedOrganization.id.error ? (<span style={{ color: 'red' }}>{this.props.editedOrganization.id.error.message}</span>) : ''}
                    </div>
                </div>
                <div className="row" style={{ flex: '1 1 0px', minHeight: '30em', maxHeight: '60em' }}>
                    <div className="col1 field-label">description</div>
                    <div className="col2">
                        <textarea value={this.props.editedOrganization.description.value || ''}
                            onChange={this.onDescriptionChange.bind(this)} />
                        {this.props.editedOrganization.description.error ? (<div style={{ color: 'red' }}>{this.props.editedOrganization.description.error.message}</div>) : ''}
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
                        {this.props.editedOrganization.name.value || ''}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col2">
                    <div className="gravatarHash">
                        {this.renderOrgAvatar(this.props.editedOrganization)}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col2">
                    <div className="id">
                        <span style={{ color: 'silver' }}>{this.origin}/#orgs/organizations/</span>
                        {this.props.editedOrganization.id.value || (<span style={{ fontStyle: 'italic' }}>organization id here</span>)}
                    </div>
                </div>
            </div>
            <div className="row" style={{ flex: '1 1 0px' }}>
                <div className="col2">
                    <div className="description"
                        dangerouslySetInnerHTML={({ __html: marked(this.props.editedOrganization.description.value || '') })}
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

    renderOrgName(name: string) {
        const maxLength = 25
        if (name.length < 25) {
            return name
        }
        return (
            <span>
                {name.slice(0, 25)}
                …
            </span>
        )
    }

    renderHeader() {
        const breadcrumbs = (
            <React.Fragment>
                <span>
                    <NavLink to={`/viewOrganization/${this.props.organization.id}`}>
                        <span style={{ fontWeight: 'bold' }}>
                            {this.renderOrgName(this.props.editedOrganization.name.value)}
                        </span>
                    </NavLink>

                    <Icon type="right" style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />

                    <Icon type="tool" />
                    {' '}
                    <span style={{ fontSize: '120%' }}>Managing Org Requests</span>
                </span>
            </React.Fragment>
        )
        const buttons = (
            <React.Fragment>
                <Button icon="save"
                    form="editOrganizationForm"
                    key="submit"
                    disabled={!this.canSave.call(this)}
                    htmlType="submit">
                    {/* <Icon type="save" /> */}
                    {/* <FaSave style={{ verticalAlign: 'center' }} /> */}
                    Save
                        </Button>
                <Button icon="undo"
                    type="danger"
                    onClick={this.onClickCancelToViewer.bind(this)}>
                    {/* <FaUndo style={{ verticalAlign: 'center' }} />  */}
                    Return to this Org
                        </Button>
                <Button shape="circle" icon="info" onClick={this.onShowInfo.bind(this)}></Button>
            </React.Fragment>
        )
        return (
            <Header breadcrumbs={breadcrumbs} buttons={buttons} />
        )
    }

    // renderFooter() {
    //     return (
    //         <div className="footerRow">
    //             <div className="editorColumn">
    //                 <div className="row">
    //                     <div className="col1">
    //                     </div>
    //                     <div className="col2">
    //                         <div className="footer">
    //                             <Button form="editOrganizationForm"
    //                                 key="submit"
    //                                 htmlType="submit">Save</Button>
    //                             <Button type="danger"
    //                                 onClick={this.onClickCancel.bind(this)}>Cancel</Button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //             <div className="previewColumn">

    //             </div>
    //         </div>
    //     )
    // }

    renderLoadingHeader() {
        const breadcrumbs = (
            <span>
                Loading Org Editor...
            </span>
        )
        return (
            <Header breadcrumbs={breadcrumbs} />
        )
    }

    // renderHeader() {
    //     let orgName: string
    //     return (
    //         <Header>
    //             <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    //                 <div style={{ flex: '0 0 auto' }}>
    //                     <span>
    //                         <Icon type="tool" />
    //                         {' '}
    //                         Managing your membership in the Organization "
    //                         {this.props.organization.name}
    //                         "
    //                     </span>
    //                 </div>
    //                 <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
    //                     <Button icon="undo"
    //                         type="danger"
    //                         onClick={this.doCancelToViewer.bind(this)}>
    //                         Return to this Org
    //                     </Button>
    //                     <Button icon="undo"
    //                         type="danger"
    //                         onClick={this.doCancelToBrowser.bind(this)}>
    //                         Return to Orgs Browser
    //                     </Button>
    //                     <Button
    //                         shape="circle"
    //                         icon="info"
    //                         onClick={this.doShowInfo.bind(this)}>
    //                     </Button>
    //                 </div>
    //             </div>
    //         </Header>
    //     )
    // }

    renderOrgHeader() {
        // apparently TS is not smart enough to know this from the conditional branch in render()!
        if (!this.props.organization) {
            return
        }

        return (
            <OrganizationHeader organizationId={this.props.organization.id} />
        )
    }

    render() {
        if (this.state.cancelToBrowser) {
            return <Redirect push to="/organizations" />
        }

        if (this.state.cancelToViewer) {
            return <Redirect push to={"/viewOrganization/" + this.props.organization.id} />
        }

        console.log('edit org', this.props.editedOrganization, this.props.organization)

        // // TODO: this is just a prop for today.
        // if (this.props.saveState === SaveState.SAVED) {
        //     return <Redirect push to={"/editOrganization/" + this.props.editedOrganization.id.value} />
        // }

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
                {this.renderOrgHeader()}
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

export default EditOrganization