import * as React from 'react'
import { Redirect, NavLink } from 'react-router-dom';
import marked from 'marked';
import { Button, Icon, Modal, Checkbox, Input, Tooltip } from 'antd';
import md5 from 'md5'

import { EditableOrganization, SaveState, ValidationState, EditState, ValidationErrorType, Editable, SyncState } from '../../../types';

import './component.css'

import Header from '../../Header';
import OrganizationHeader from '../organizationHeader/loader';
import * as orgModel from '../../../data/models/organization/model'
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import OrgAvatar from '../../OrgAvatar'
import TextArea from 'antd/lib/input/TextArea';

export interface EditOrganizationProps {
    editState: EditState
    saveState: SaveState
    validationState: ValidationState
    editedOrganization: EditableOrganization
    organization: orgModel.Organization
    onEditOrgSave: () => void
    onUpdateName: (name: string) => void
    // onUpdateGravatarHash: (gravatarHash: string | null) => void
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


    // onGravatarEmailSync() {
    //     let email
    //     let hashed
    //     if (this.gravatarEmail.current && this.gravatarEmail.current.value) {
    //         email = this.gravatarEmail.current.value.toLowerCase()
    //         hashed = md5(email)
    //     } else {
    //         hashed = null
    //     }
    //     this.props.onUpdateGravatarHash(hashed);
    // }

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

    // onGravatarHashChange(e: React.ChangeEvent<HTMLInputElement>) {
    //     e.persist();
    //     this.props.onUpdateGravatarHash(e.target.value);
    // }

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
            this.props.validationState.type === ValidationErrorType.OK &&
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

    calcFieldClass(field: Editable) {
        switch (field.validationState.type) {
            // case (ValidationErrorType.OK):
            //     return 'validation-ok'
            case (ValidationErrorType.ERROR):
                return 'validation-error'
            case (ValidationErrorType.REQUIRED_MISSING):
                return 'validation-error'
        }

        switch (field.syncState) {
            case (SyncState.DIRTY):
                return 'sync-dirty'
            default:
                return 'validation-ok'
        }
    }

    renderFieldError(field: Editable) {
        if (field.validationState.type !== ValidationErrorType.OK) {
            if (field.syncState === SyncState.DIRTY) {
                return (
                    <span style={{ color: 'red' }}>
                        {field.validationState.message}
                    </span>
                )
            }
        } else {
            return ''
        }
    }

    renderForm() {
        return (
            <form id="editOrganizationForm" className="editor" onSubmit={this.onSubmit.bind(this)}>
                <div className="row">
                    <div className="col1 field-label">
                        <Tooltip title="This is the name for your organization as you want KBase users to see it">
                            name
                        </Tooltip>
                    </div>
                    <div className="col2">
                        <Input value={this.props.editedOrganization.name.value || ''}
                            className={this.calcFieldClass(this.props.editedOrganization.name)}
                            onChange={this.onNameChange.bind(this)} />
                        {this.renderFieldError(this.props.editedOrganization.name)}
                    </div>
                </div>
                <div className="row">
                    <div className="col1 field-label">id</div>
                    <div className="col2">
                        <Input value={this.props.editedOrganization.id.value || ''}
                            className={this.calcFieldClass(this.props.editedOrganization.id)}
                            onChange={this.onIdChange.bind(this)} />
                        {this.renderFieldError(this.props.editedOrganization.id)}
                    </div>
                </div>
                <div className="row">
                    <div className="col1 field-label">is private?</div>
                    <div className="col2">
                        <Checkbox
                            checked={this.props.editedOrganization.isPrivate.value}
                            className={this.calcFieldClass(this.props.editedOrganization.isPrivate)}
                            onChange={this.onIsPrivateChange.bind(this)} />
                        {this.renderFieldError(this.props.editedOrganization.isPrivate)}
                    </div>
                </div>


                <div className="row" style={{ flex: '1 1 0px', minHeight: '30em', maxHeight: '60em' }}>
                    <div className="col1 field-label">description</div>
                    <div className="col2">
                        <TextArea value={this.props.editedOrganization.description.value || ''}
                            className={this.calcFieldClass(this.props.editedOrganization.description)}
                            onChange={this.onDescriptionChange.bind(this)} />
                        {this.renderFieldError(this.props.editedOrganization.description)}
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



    renderIsPrivate(isPrivate: boolean) {
        if (isPrivate) {
            return (
                <span>
                    <Icon type="lock" />{' '}Private
                </span>
            )
        }
        return (
            <span>
                <Icon type="global" />{' '}Public
            </span>
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
                    <div className="id">
                        <span style={{ color: 'silver' }}>{this.origin}/#orgs/viewOrganization/</span>
                        {this.props.editedOrganization.id.value || (<span style={{ fontStyle: 'italic' }}>organization id here</span>)}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col2">
                    <div className="isPrivate">
                        {this.renderIsPrivate(this.props.editedOrganization.isPrivate.value)}
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
        if (name.length === 0) {
            return (
                <span style={{ fontStyle: 'italic' }}>
                    org name missing
                </span>
            )
        }

        let orgName = name
        if (name.length >= maxLength) {
            orgName = name.slice(0, 25) + '…'
        }
        return (
            <NavLink to={`/viewOrganization/${this.props.organization.id}`}>
                <span style={{ fontWeight: 'bold' }}>
                    {orgName}
                </span>
            </NavLink>
        )
    }

    renderHeader() {
        const breadcrumbs = (
            <React.Fragment>
                <span>
                    {this.renderOrgName(this.props.editedOrganization.name.value)}


                    <Icon type="right" style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />

                    <Icon type="tool" />
                    {' '}
                    <span style={{ fontSize: '120%' }}>Edit Organization</span>
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