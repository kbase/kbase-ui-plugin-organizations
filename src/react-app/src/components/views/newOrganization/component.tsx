import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { Marked } from 'marked-ts'
import { Button, Icon, Modal, Input, Checkbox, Tooltip } from 'antd'
import md5 from 'md5'

import { EditableOrganization, SaveState, ValidationState, EditState, AppError, Editable, ValidationErrorType, SyncState } from '../../../types';

import './component.css'

import Header from '../../Header';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import OrgLogo from '../../OrgLogo';
import TextArea from 'antd/lib/input/TextArea';

export interface NewOrganizationProps {
    editState: EditState,
    saveState: SaveState,
    validationState: ValidationState,
    error: AppError | null,
    newOrganization: EditableOrganization,
    onSave: () => void,
    onUpdateName: (name: string) => void,
    onUpdateId: (id: string) => void,
    onUpdateDescription: (description: string) => void
    onUpdateIsPrivate: (isPrivate: boolean) => void
    onUpdateLogoUrl: (logoUrl: string) => void
    onUpdateHomeUrl: (homeUrl: string) => void
    onUpdateResearchInterests: (researchInterests: string) => void
}

export interface NewOrganizationState {
    cancelToBrowser: boolean
    showError: boolean
}

class NewOrganization extends React.Component<NewOrganizationProps, NewOrganizationState> {

    origin: string;

    constructor(props: NewOrganizationProps) {
        super(props)

        this.state = {
            cancelToBrowser: false,
            showError: true
        }

        this.origin = document.location!.origin
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

    onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        e.persist()
        this.props.onUpdateDescription(e.target.value);
    }

    onIdChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist()
        this.props.onUpdateId(e.target.value)
    }

    onLogoUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist()
        this.props.onUpdateLogoUrl(e.target.value)
    }

    onHomeUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist()
        this.props.onUpdateHomeUrl(e.target.value)
    }

    onResearchInterestsChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        e.persist()
        this.props.onUpdateResearchInterests(e.target.value)
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

    renderEditor() {
        return (
            <form id="newOrganizationForm" className="NewOrganization-editor" onSubmit={this.onSubmit.bind(this)}>
                <div className="NewOrganization-row">
                    <div className="NewOrganization-col1">
                        <div style={{ flex: '1 1 0px' }}>
                            <h3>Create Your Organization</h3>
                        </div>
                    </div>
                    <div className="NewOrganization-col2">
                        <h3>Preview</h3>
                    </div>
                </div>

                {/* Org name */}
                <div className="NewOrganization-row">
                    <div className="NewOrganization-col1">
                        <div className="NewOrganization-formLabel field-label">
                            <Tooltip title="This is the name for your organization as you want KBase users to see it">
                                Name
                            </Tooltip>
                        </div>
                        <div className="NewOrganization-formControl">
                            <Input value={this.props.newOrganization.name.value || ''}
                                className={this.calcFieldClass(this.props.newOrganization.name)}
                                onChange={this.onNameChange.bind(this)} />
                            {this.renderFieldError(this.props.newOrganization.name)}
                        </div>
                    </div>
                    <div className="NewOrganization-col2">
                        <div className="NewOrganization-preview-name">
                            {this.props.newOrganization.name.value || ''}
                        </div>
                    </div>
                </div>

                {/* Org ID */}
                <div className="NewOrganization-row">
                    <div className="NewOrganization-col1">
                        <div className="NewOrganization-formLabel field-label">
                            ID
                        </div>
                        <div className="NewOrganization-formControl">
                            <Input value={this.props.newOrganization.id.value || ''}
                                className={this.calcFieldClass(this.props.newOrganization.id)}
                                onChange={this.onIdChange.bind(this)} />
                            {this.renderFieldError(this.props.newOrganization.id)}
                        </div>
                    </div>
                    <div className="NewOrganization-col2">
                        <div className="NewOrganization-preview-id">
                            <span style={{ color: 'silver' }}>{this.origin}/#org/</span>
                            {this.props.newOrganization.id.value || (<span style={{ fontStyle: 'italic' }}>organization id here</span>)}
                        </div>
                    </div>
                </div>

                {/* Logo URL */}
                <div className="NewOrganization-row">
                    <div className="NewOrganization-col1">
                        <div className="NewOrganization-formLabel field-label">
                            Logo URL
                        </div>
                        <div className="NewOrganization-formControl">
                            <Input value={this.props.newOrganization.logoUrl.value || ''}
                                className={this.calcFieldClass(this.props.newOrganization.logoUrl)}
                                onChange={this.onLogoUrlChange.bind(this)} />
                            {this.renderFieldError(this.props.newOrganization.logoUrl)}
                        </div>
                    </div>
                    <div className="NewOrganization-col2">
                        <div className="NewOrganization-preview-logo">
                            {this.renderLogoPreview()}
                        </div>
                    </div>
                </div>

                {/* Home Page URL */}
                <div className="NewOrganization-row">
                    <div className="NewOrganization-col1">
                        <div className="NewOrganization-formLabel field-label">
                            Home Page URL
                        </div>
                        <div className="NewOrganization-formControl">
                            <Input value={this.props.newOrganization.homeUrl.value || ''}
                                className={this.calcFieldClass(this.props.newOrganization.homeUrl)}
                                onChange={this.onHomeUrlChange.bind(this)} />
                            {this.renderFieldError(this.props.newOrganization.homeUrl)}
                        </div>
                    </div>
                    <div className="NewOrganization-col2">
                        <div className="NewOrganization-field-name">
                            <a href={this.props.newOrganization.homeUrl.value || ''} target="_blank">{this.props.newOrganization.homeUrl.value || ''}</a>
                        </div>
                    </div>
                </div>


                {/* Is Private? */}
                <div className="NewOrganization-row">
                    <div className="NewOrganization-col1">
                        <div className="NewOrganization-formLabel field-label">
                            Is Private?
                        </div>
                        <div className="NewOrganization-formControl">
                            <Checkbox
                                checked={this.props.newOrganization.isPrivate.value}
                                className={this.calcFieldClass(this.props.newOrganization.isPrivate)}
                                onChange={this.onIsPrivateChange.bind(this)} />
                            {this.renderFieldError(this.props.newOrganization.isPrivate)}
                        </div>
                    </div>
                    <div className="NewOrganization-col2">
                        <div className="NewOrganization-preview-isPrivate">
                            {this.renderIsPrivate(this.props.newOrganization.isPrivate.value)}
                        </div>
                    </div>
                </div>


                {/* Research Interests */}
                <div className="NewOrganization-row">
                    <div className="NewOrganization-col1">
                        <div className="NewOrganization-formLabel field-label">
                            Research Interests
                        </div>
                        <div className="NewOrganization-formControl">
                            <TextArea value={this.props.newOrganization.researchInterests.value || ''}
                                className={this.calcFieldClass(this.props.newOrganization.researchInterests) + ' NewOrganization-control-researchInterests'}
                                autosize={{ minRows: 2, maxRows: 2 }}
                                onChange={this.onResearchInterestsChange.bind(this)} />
                            {this.renderFieldError(this.props.newOrganization.researchInterests)}
                        </div>
                    </div>
                    <div className="NewOrganization-col2">
                        <div className="NewOrganization-preview-researchInterests">
                            {this.props.newOrganization.researchInterests.value || ''}
                        </div>
                    </div>
                </div>

                {/* Description*/}
                <div className="NewOrganization-row">
                    <div className="NewOrganization-col1">
                        <div className="NewOrganization-formLabel field-label">
                        </div>
                        <div className="NewOrganization-formControl">
                            <TextArea value={this.props.newOrganization.description.value || ''}
                                className={this.calcFieldClass(this.props.newOrganization.description) + ' NewOrganization-control-description'}
                                autosize={{ minRows: 5, maxRows: 15 }}
                                onChange={this.onDescriptionChange.bind(this)} />
                            {this.renderFieldError(this.props.newOrganization.description)}
                        </div>
                    </div>
                    <div className="NewOrganization-col2">
                        <div className="NewOrganization-preview-description"
                            dangerouslySetInnerHTML={({ __html: Marked.parse(this.props.newOrganization.description.value || '') })}
                        />
                    </div>
                </div>
            </form >
        )
    }


    charAt(inString: string, position: number) {
        // const c1 = inString.charAt(position)
        const c1 = inString.charCodeAt(position)
        if (c1 >= 0xD800 && c1 <= 0xDBFF && inString.length > position + 1) {
            const c2 = inString.charCodeAt(position + 1)
            if (c2 > 0xDC00 && c2 <= 0xDFFF) {
                return inString.substring(position, 2)
            }
        }
        return inString.substring(position, 1)
    }

    renderLogo(org: EditableOrganization) {
        return (
            <OrgLogo logoUrl={null} size={64} organizationName={org.name.value} organizationId={org.id.value} />
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

    renderDefaultLogo() {
        if (!(this.props.newOrganization.name.value && this.props.newOrganization.id.value)) {
            return (
                <div>
                    Default logo preview available when the Organization name and id are completed
                </div>
            )
        }
        const initial = this.charAt(this.props.newOrganization.name.value, 0).toUpperCase()
        // const initial = this.props.organizationName.substr(0, 1).toUpperCase()
        const hash = md5(this.props.newOrganization.id.value)

        const size = 60;

        const color = hash.substr(0, 6)
        return (
            <svg width={size} height={size} style={{ border: '1px rgba(200, 200, 200, 0.5) solid' }}>
                <text x="50%" y="50%" dy={4} textAnchor="middle" dominantBaseline="middle" fontSize={size - 12} fill={'#' + color} fontFamily="sans-serif">{initial}</text>
            </svg>
        )
    }

    renderLogoPreview() {
        if (!this.props.newOrganization.logoUrl.value) {
            return this.renderDefaultLogo()
        }
        return (
            <img src={this.props.newOrganization.logoUrl.value} width={60} />
        )
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
                {this.renderEditor()}
                {this.renderError()}
            </div>
        )
    }
}

export default NewOrganization