import * as React from 'react'
import { Redirect } from 'react-router-dom';
import marked from 'marked';
import { Button, Icon, Modal, Input, Checkbox } from 'antd';
import md5 from 'md5'

import { EditableOrganization, SaveState, ValidationState, EditState, AppError, Editable, ValidationErrorType, SyncState } from '../../../types';

import './component.css'

import Header from '../../Header';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import OrgAvatar from '../../OrgAvatar';
import Validation from '../../../data/models/organization/validation';

export interface NewOrganizationProps {
    editState: EditState,
    saveState: SaveState,
    validationState: ValidationState,
    error: AppError | null,
    newOrganization: EditableOrganization,
    onSave: () => void,
    onUpdateName: (name: string) => void,
    // onUpdateGravatarHash: (gravatarHash: string | null) => void;
    onUpdateId: (id: string) => void,
    onUpdateDescription: (description: string) => void
    onUpdateIsPrivate: (isPrivate: boolean) => void
}


export interface NewOrganizationState {
    cancelToBrowser: boolean
    showError: boolean
}

class NewOrganization extends React.Component<NewOrganizationProps, NewOrganizationState> {

    origin: string;
    gravatarEmail: React.RefObject<HTMLInputElement>

    // idDebounceTime: number | null

    constructor(props: NewOrganizationProps) {
        super(props)

        this.state = {
            cancelToBrowser: false,
            showError: true
        }

        this.gravatarEmail = React.createRef()

        this.origin = document.location!.origin

        // this.idDebounceTime = null
    }

    onShowInfo() {
        Modal.info({
            title: 'New Organization Help',
            width: '50em',
            content: (
                <div>
                    <p>
                        As a KBase user, you may create your own organizations.
                    </p>
                    <p>
                        Once you have created an Organization, you will be the sole owner of it, forever.
                    </p>
                    <p>
                        In order to create an Org, you need to complete the following fields.
                    </p>
                    <dl>
                        <dt>
                            name
                        </dt>
                        <dd>
                            The organization <i>name</i> is whatever you wish to have your Org known as. It may be
                            composed of any text (including unicode characters) up to 200 characters in length. You
                            may also change it at any time.
                        </dd>
                        <dt>
                            logo
                        </dt>
                        <dd>
                            <p>
                                Logo support has undergone a redesign, but has not yet been implemented. The new
                                design supports direct image upload, and removes gravatar support.
                            </p>
                            <p>
                                For now, gravatar is the only support for org logo
                            </p>
                            <p>
                                In order to display a custom logo for your organization, you need to associate
                                your Organization with an avatar hosted with the Gravatar service.
                                To do so,
                                simply enter the email address associated with your gravatar and press the update
                                button. This will calculate a new "gravatar hash" and associate it with your organization.
                            </p>
                        </dd>
                        <dt>
                            id
                        </dt>
                        <dd>
                            <p>
                                Your Org <i>id</i> forms a url endpoint for your org as well as the identifier used throughout
                            KBase to, well, identify your organization uniquely among all current and future organizations.
                            As such, the Org ID may not be changed once created.
                            </p>
                            <p>
                                The id may only be composed of the restricted characters a-Z, A-Z, 0-9 and _, and is also
                                restricted to 100 characters in length.
                            </p>

                        </dd>
                        <dt>
                            description
                        </dt>
                        <dd>
                            <p>
                                Up to 4000 characters, a description allows you to express to other KBase users the purpose,
                            history, associations, and science domain of your Org.</p>
                            <p>
                                The description is in "markdown" format, and the editor will show you a preview of the
                                rendered description.
                            </p>
                        </dd>
                    </dl>
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
    //     // this.props.onUpdateGravatarHash(hashed);
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
                    <p>You have entered information for this new organization.</p>

                    <p>If you leave the editor without first saving, the new organization <i>will not be created</i>.</p>

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
        this.props.onSave();
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
        e.persist()
        this.props.onUpdateId(e.target.value)
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
            this.props.saveState === SaveState.NEW
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
            <form id="newOrganizationForm" className="editor" onSubmit={this.onSubmit.bind(this)}>
                <div className="row">
                    <div className="col1 field-label">name</div>
                    <div className="col2">
                        <Input value={this.props.newOrganization.name.value || ''}
                            className={this.calcFieldClass(this.props.newOrganization.name)}
                            onChange={this.onNameChange.bind(this)} />
                        {this.renderFieldError(this.props.newOrganization.name)}
                    </div>
                </div>
                <div className="row">
                    <div className="col1 field-label">id</div>
                    <div className="col2">
                        <Input
                            value={this.props.newOrganization.id.value || ''}
                            className={this.calcFieldClass(this.props.newOrganization.id)}
                            onChange={this.onIdChange.bind(this)} />
                        {this.renderFieldError(this.props.newOrganization.id)}
                    </div>
                </div>
                <div className="row">
                    <div className="col1 field-label">is private?</div>
                    <div className="col2">
                        <Checkbox
                            checked={this.props.newOrganization.isPrivate.value}
                            className={this.calcFieldClass(this.props.newOrganization.isPrivate)}
                            onChange={this.onIsPrivateChange.bind(this)} />
                        {this.renderFieldError(this.props.newOrganization.isPrivate)}
                    </div>
                </div>


                <div className="row" style={{ flex: '1 1 0px', minHeight: '30em', maxHeight: '60em' }}>
                    <div className="col1 field-label">description</div>
                    <div className="col2">
                        <textarea value={this.props.newOrganization.description.value || ''}
                            className={this.calcFieldClass(this.props.newOrganization.description)}
                            onChange={this.onDescriptionChange.bind(this)} />
                        {this.renderFieldError(this.props.newOrganization.description)}
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

    renderOrgAvatar(org: EditableOrganization) {
        return (
            <OrgAvatar gravatarHash={null} size={64} organizationName={org.name.value} organizationId={org.id.value} />
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
                        {this.props.newOrganization.name.value || ''}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col2">
                    <div className="id">
                        <span style={{ color: 'silver' }}>{this.origin}/#orgs/viewOrganization/</span>
                        {this.props.newOrganization.id.value || (<span style={{ fontStyle: 'italic' }}>organization id here</span>)}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col2">
                    <div className="name">
                        {this.renderIsPrivate(this.props.newOrganization.isPrivate.value)}
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

    toggleError() {
        this.setState({ showError: !this.state.showError })
    }

    renderHeader() {
        const orgName = this.props.newOrganization!.name.value || (<span style={{ fontStyle: 'italic', color: 'gray' }}>org name will appear here when you edit the name field</span>)
        let errorButton
        if (this.props.error) {
            errorButton = (
                <Button shape="circle" icon="exclamation" type="danger" onClick={this.toggleError.bind(this)}></Button>
            )
        }
        const breadcrumbs = (
            <React.Fragment>
                <span>
                    {/* <FaPlusCircle style={{ verticalAlign: 'middle' }} /> */}
                    <Icon type="plus-circle" />
                    {' '}
                    Adding a New Org "
                            {orgName}
                    "
                        </span>
            </React.Fragment>
        )
        const buttons = (
            <React.Fragment>
                <Button icon="save"
                    form="newOrganizationForm"
                    key="submit"
                    disabled={!this.canSave.call(this)}
                    htmlType="submit">
                    {/* <Icon type="save" /> */}
                    {/* <FaSave style={{ verticalAlign: 'center' }} /> */}
                    Save
                        </Button>

                <Button shape="circle" icon="info" onClick={this.onShowInfo.bind(this)}></Button>
                {errorButton}
            </React.Fragment>
        )
        return (
            <Header breadcrumbs={breadcrumbs} buttons={buttons} />
        )
    }

    renderLoadingHeader() {
        const breadcrumbs = (
            <span>
                Loading New Org Editor...
            </span>
        )
        return (
            <Header breadcrumbs={breadcrumbs} />
        )
    }

    renderError() {
        if (this.props.error && this.state.showError) {
            const onOk = () => {
                this.setState({ showError: false })
            }
            const onCancel = () => {
                this.setState({ showError: false })
            }
            let trace
            if (this.props.error.trace) {
                trace = this.props.error.trace.map((line, index) => {
                    return (
                        <div key={"line_" + index}>{line}</div>
                    )
                })
            }
            if (trace) {
                trace = (
                    <div>
                        <div>trace</div>
                        {trace}
                    </div>
                )
            }
            return (
                <Modal visible={true}
                    title="Error"
                    okType="danger"
                    okText="Close"
                    cancelText="Clear Error"
                    onCancel={onCancel}
                    onOk={onOk}>
                    <div style={{ fontWeight: 'bold' }}>
                        {this.props.error.code}
                    </div>
                    <div>
                        {this.props.error.message}
                    </div>
                    {trace}

                </Modal>
            )
        }
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
                {this.renderError()}
            </div>
        )
    }
}

export default NewOrganization