import * as React from 'react'
import { Redirect } from 'react-router-dom';
import { Marked } from 'marked-ts';
import { Button, Icon, Modal, Checkbox, Input, Tooltip, Table, Collapse } from 'antd';
import md5 from 'md5'
import {
    EditableOrganization, SaveState, ValidationState,
    EditState, ValidationErrorType, Editable, SyncState
} from '../../../../../types';
import './component.css'

import * as orgModel from '../../../../../data/models/organization/model'
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import TextArea from 'antd/lib/input/TextArea';
import MainMenu from '../../../../menu/component';

export interface EditOrganizationProps {
    editState: EditState
    saveState: SaveState
    validationState: ValidationState
    editedOrganization: EditableOrganization
    organization: orgModel.Organization
    onEditOrgSave: () => void
    onUpdateName: (name: string) => void
    onUpdateDescription: (description: string) => void
    onUpdateIsPrivate: (isPrivate: boolean) => void
    onUpdateLogoUrl: (logoUrl: string) => void
    onUpdateHomeUrl: (homeUrl: string) => void
    onUpdateResearchInterests: (researchInterests: string) => void
    onFinish: () => void
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

    constructor(props: EditOrganizationProps) {
        super(props)

        this.state = {
            cancelToBrowser: false,
            cancelToViewer: false,
            navigateTo: NavigateTo.NONE
        }

        this.origin = document.location!.origin
    }

    onFinish() {
        this.props.onFinish()
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
        e.preventDefault()
        this.props.onEditOrgSave()
    }

    onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist()
        this.props.onUpdateName(e.target.value)
    }

    onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        e.persist()
        this.props.onUpdateDescription(e.target.value)
    }

    onIdChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist()
        console.warn('no updating id, naughty!')
    }

    onIsPrivateChange(e: CheckboxChangeEvent) {
        this.props.onUpdateIsPrivate(e.target.checked)
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
                return 'validation-error Lite'
            case (ValidationErrorType.REQUIRED_MISSING):
                return 'validation-error Lite'
        }

        switch (field.syncState) {
            case (SyncState.DIRTY):
                return 'sync-dirty Lite'
            default:
                return 'validation-ok Lite'
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

    renderNameRow() {
        const tooltip = (
            <React.Fragment>
                <p>
                    This is the name for your organization as you want KBase users to see it; you may change it at any time.
                </p>
                <p>
                    It may be composed of ordinary text, but does not accept formatting.
                </p>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                required
                            </th>
                            <td>
                                yes
                            </td>
                        </tr>
                        <tr>
                            <th>
                                max length
                            </th>
                            <td>
                                1024 characters
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        )
        const placeholder = 'Enter the display name for the Organization'
        return (
            <div className="EditOrganization-row">
                <div className="EditOrganization-col1">
                    <div className="EditOrganization-formLabel field-label">
                        <Tooltip title={tooltip}>
                            Name
                        </Tooltip>
                    </div>
                </div>
                <div className="EditOrganization-col2">
                    <div className="EditOrganization-formControl">
                        <Input value={this.props.editedOrganization.name.value || ''}
                            className={this.calcFieldClass(this.props.editedOrganization.name)}
                            placeholder={placeholder}
                            autoFocus
                            onChange={this.onNameChange.bind(this)} />
                        {this.renderFieldError(this.props.editedOrganization.name)}
                    </div>
                </div>
                <div className="EditOrganization-col3">
                    <div className="EditOrganization-preview-name">
                        {this.props.editedOrganization.name.value || ''}
                    </div>
                </div>
            </div>
        )
    }

    renderIDRow() {
        const tooltip = (
            <React.Fragment>
                <p>
                    Each Organization has a unique identifier. The ID is set when the organization is created, and are permanent: It may never be changed.
                </p>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                required
                            </th>
                            <td>
                                yes
                            </td>
                        </tr>

                        <tr>
                            <th>
                                max length
                            </th>
                            <td>
                                100 characters
                            </td>
                        </tr>
                        <tr>
                            <th>
                                allowed
                            </th>
                            <td>
                                a to z, 0 to 9, -
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        )
        const placeholder = "Enter the unique ID"
        return (
            <div className="EditOrganization-row">
                <div className="EditOrganization-col1">
                    <div className="EditOrganization-formLabel field-label">
                        <Tooltip title={tooltip}>
                            ID
                            </Tooltip>
                    </div>
                </div>
                <div className="EditOrganization-col2">
                    <div className="EditOrganization-formControl">
                        <Input value={this.props.editedOrganization.id.value || ''}
                            className={this.calcFieldClass(this.props.editedOrganization.id)}
                            placeholder={placeholder}
                            onChange={this.onIdChange.bind(this)} />
                        {this.renderFieldError(this.props.editedOrganization.id)}
                    </div>
                </div>
                <div className="EditOrganization-col3">
                    <div className="EditOrganization-preview-id">
                        <span style={{ color: 'silver' }}>{this.origin}/#org/</span>
                        {this.props.editedOrganization.id.value || (<span style={{ fontStyle: 'italic' }}>organization id here</span>)}
                    </div>
                </div>
            </div>
        )
    }

    renderLogoURLRow() {
        const tooltip = (
            <React.Fragment>
                <p>
                    Each Organization will display a logo. You may specific your own logo by entering the URL for an image, or leave
                    this field blank and a default logo will be displayed, using the first letter of your org name and a randomly
                    generated color (based on your org id).
                </p>
                <p>
                    Please don't use large images, and try to keep them roughly square. The logo image display will be constrained
                    to no larger than 100 pixels wide. Non-square logos may not look good in the Orgs list or on your Org page.
                </p>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                required
                            </th>
                            <td>
                                no
                            </td>
                        </tr>

                        <tr>
                            <th>
                                max length
                            </th>
                            <td>
                                1000 characters
                            </td>
                        </tr>
                        <tr>
                            <th>
                                allowed
                            </th>
                            <td>
                                a full https:// url. E.g. https://my.org/myimage.png<br />
                                note that only <i>https</i> urls are accepted.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        )
        const placeholder = "Enter a URL for your Organization's logo (optional)"
        return (
            <div className="EditOrganization-row">
                <div className="EditOrganization-col1">
                    <div className="EditOrganization-formLabel field-label">
                        <Tooltip title={tooltip}>
                            Logo URL
                        </Tooltip>
                    </div>
                </div>
                <div className="EditOrganization-col2">
                    <div className="EditOrganization-formControl">
                        <Input value={this.props.editedOrganization.logoUrl.value || ''}
                            className={this.calcFieldClass(this.props.editedOrganization.logoUrl)}
                            placeholder={placeholder}
                            onChange={this.onLogoUrlChange.bind(this)} />
                        {this.renderFieldError(this.props.editedOrganization.logoUrl)}
                    </div>
                </div>
                <div className="EditOrganization-col3">
                    <div className="EditOrganization-preview-logo">
                        {this.renderLogoPreview()}
                    </div>
                </div>
            </div>
        )
    }

    renderHomeURLRow() {
        const tooltip = (
            <React.Fragment>
                <p>
                    Each Organization may display a home page url. This should be considered the canonical home for your Organization, if
                    it also exists outside of KBase.
                </p>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                required
                            </th>
                            <td>
                                no
                            </td>
                        </tr>

                        <tr>
                            <th>
                                max length
                            </th>
                            <td>
                                1000 characters
                            </td>
                        </tr>
                        <tr>
                            <th>
                                allowed
                            </th>
                            <td>
                                a full url. E.g. http://my.org/myimage.png<br />
                                note that both <i>http></i> and <i>https</i> urls are accepted.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        )
        const placeholder = "Enter the url for your Organization's home page (optional)"
        return (
            <div className="EditOrganization-row">
                <div className="EditOrganization-col1">
                    <div className="EditOrganization-formLabel field-label">
                        <Tooltip title={tooltip}>
                            Home Page URL
                        </Tooltip>
                    </div>
                </div>
                <div className="EditOrganization-col2">
                    <div className="EditOrganization-formControl">
                        <Input value={this.props.editedOrganization.homeUrl.value || ''}
                            className={this.calcFieldClass(this.props.editedOrganization.homeUrl)}
                            placeholder={placeholder}
                            onChange={this.onHomeUrlChange.bind(this)} />
                        {this.renderFieldError(this.props.editedOrganization.homeUrl)}
                    </div>
                </div>
                <div className="EditOrganization-col3">
                    <div className="EditOrganization-field-name">
                        <a href={this.props.editedOrganization.homeUrl.value || ''} target="_blank">{this.props.editedOrganization.homeUrl.value || ''}</a>
                    </div>
                </div>
            </div>
        )
    }

    renderCollapse(content: JSX.Element) {
        const style = {
            background: 'transparent',
            borderRadius: 0,
            margin: 0,
            border: 0,
            overflow: 'hidden'
        }
        return (
            <Collapse bordered={false}>
                <Collapse.Panel header="What about inviting users?" key="invite" style={style}>
                    {content}
                </Collapse.Panel>
            </Collapse>
        )
    }

    renderPrivatePublicRow() {
        const tooltip = (
            <React.Fragment>
                <p>
                    Set the Organization to "hidden" to prevent it from appearing in the listing and from being exposed
                    as an Org page for any non-member.
                </p>
                <p>
                    You may invite users directly to your org. When doing so they will receive a notification with a link to the
                    org page. When a user lands on the org page they will not be shown information about the org, but will be available
                    to accept the invitation and instantly have access to it.
                </p>
                <p>
                    A user with an invitation who lands on the org page will not see information about the org, but will be able to
                    submit a Join request.
                </p>
                {/* {this.renderCollapse((
                    <React.Fragment>
                        <p>
                            You may invite users directly to your org. When doing so they will receive a notification with a link to the
                            org page. When a user lands on the org page they will not be shown information about the org, but will be available
                            to accept the invitation and instantly have access to it.
                        </p>
                        <p>
                            A user with an invitation who lands on the org page will not see information about the org, but will be able to
                            submit a Join request.
                        </p>
                    </React.Fragment>
                ))} */}

                <table>
                    <tbody>
                        <tr>
                            <th>
                                required
                            </th>
                            <td>
                                no
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        )
        return (
            <div className="EditOrganization-row">
                <div className="EditOrganization-col1">
                    <div className="EditOrganization-formLabel field-label">
                        <Tooltip title={tooltip}>
                            Hidden?
                        </Tooltip>
                    </div>
                </div>
                <div className="EditOrganization-col2">
                    <div className="EditOrganization-formControl">
                        <Checkbox
                            checked={this.props.editedOrganization.isPrivate.value}
                            className={this.calcFieldClass(this.props.editedOrganization.isPrivate)}
                            onChange={this.onIsPrivateChange.bind(this)} />
                        {this.renderFieldError(this.props.editedOrganization.isPrivate)}
                    </div>
                </div>
                <div className="EditOrganization-col3">
                    <div className="EditOrganization-preview-isPrivate">
                        {this.renderIsPrivate(this.props.editedOrganization.isPrivate.value)}
                    </div>
                </div>
            </div>
        )
    }

    renderResearchInterestsRow() {
        const tooltip = (
            <React.Fragment>
                <p>
                    Each organization must have a short description of research interests or purpose.
                </p>
                <p>
                    This text is displayed in the organizations list and the organization's page. It is most helpful
                    in the list context to help users quickly scan the list.
                </p>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                required
                            </th>
                            <td>
                                yes
                            </td>
                        </tr>

                        <tr>
                            <th>
                                max length
                            </th>
                            <td>
                                200 characters
                            </td>
                        </tr>
                        <tr>
                            <th>
                                allowed
                            </th>
                            <td>
                                unformatted text
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        )
        const placeholder = 'Enter a short statement of your Organization\'s research interests or purpose'
        return (
            <div className="EditOrganization-row">
                <div className="EditOrganization-col1">
                    <div className="EditOrganization-formLabel field-label">
                        <Tooltip title={tooltip}>
                            Research Interests
                        </Tooltip>
                    </div>
                </div>
                <div className="EditOrganization-col2">
                    <div className="EditOrganization-formControl">
                        <TextArea value={this.props.editedOrganization.researchInterests.value || ''}
                            className={this.calcFieldClass(this.props.editedOrganization.researchInterests) + ' EditOrganization-control-researchInterests'}
                            autosize={{ minRows: 2, maxRows: 2 }}
                            placeholder={placeholder}
                            onChange={this.onResearchInterestsChange.bind(this)} />
                        {this.renderFieldError(this.props.editedOrganization.researchInterests)}
                    </div>
                </div>
                <div className="EditOrganization-col3">
                    <div className="EditOrganization-preview-researchInterests">
                        {this.props.editedOrganization.researchInterests.value || ''}
                    </div>
                </div>
            </div>
        )
    }

    renderDescriptionRow() {
        const tooltip = (
            <React.Fragment>
                <p>
                    Each organization must have a description which communicates the purpose of this organization.
                </p>
                <p>
                    The description is in <a href="https://daringfireball.net/projects/markdown/syntax" target="_blank">markdown</a> format
                    and may be quite long. It will be presented in a scrolling area.
                </p>
                <p>
                    Please be mindful of embedding large images or other content which may interfere with the display of your Organization.
                </p>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                required
                            </th>
                            <td>
                                yes
                            </td>
                        </tr>

                        <tr>
                            <th>
                                max length
                            </th>
                            <td>
                                1024 characters
                            </td>
                        </tr>
                        <tr>
                            <th>
                                allowed
                            </th>
                            <td>
                                standard <a href="https://daringfireball.net/projects/markdown/syntax" target="_blank">markdown</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        )
        const placeholder = 'Enter the required organization description Description'
        return (
            <div className="EditOrganization-row">
                <div className="EditOrganization-col1">
                    <div className="EditOrganization-formLabel field-label">
                        <Tooltip title={tooltip}>
                            Description
                        </Tooltip>
                    </div>
                </div>
                <div className="EditOrganization-col2">
                    <div className="EditOrganization-formControl">
                        <TextArea value={this.props.editedOrganization.description.value || ''}
                            className={this.calcFieldClass(this.props.editedOrganization.description) + ' EditOrganization-control-description'}
                            autosize={{ minRows: 5, maxRows: 15 }}
                            placeholder={placeholder}
                            onChange={this.onDescriptionChange.bind(this)} />
                        {this.renderFieldError(this.props.editedOrganization.description)}
                    </div>
                </div>
                <div className="EditOrganization-col3">
                    <div className="EditOrganization-preview-description"
                        dangerouslySetInnerHTML={({ __html: Marked.parse(this.props.editedOrganization.description.value || '') })}
                    />
                </div>
            </div>
        )
    }

    renderSaveButton() {
        return (
            <Button icon="save"
                form="newOrganizationForm"
                key="submit"
                disabled={!this.canSave.call(this)}
                htmlType="submit">
                Save
            </Button>
        )
    }

    renderCancelButton() {
        return (
            <Button icon="close"
                type="danger"
                onClick={this.onFinish.bind(this)}>
                Cancel
            </Button>
        )
    }

    renderEditor() {
        return (
            <form id="editOrganizationForm" className="EditOrganization-editor scrollable-flex-column" onSubmit={this.onSubmit.bind(this)}>
                <div className="EditOrganization-row">
                    <div className="EditOrganization-col1">
                    </div>
                    <div className="EditOrganization-col2">
                        <div style={{ flex: '1 1 0px' }}>
                            <h3>Edit Your Organization</h3>
                        </div>
                    </div>
                    <div className="EditOrganization-col3">
                        <h3>Preview</h3>
                    </div>
                </div>
                <div className="EditOrganization-body">
                    {this.renderNameRow()}
                    {this.renderIDRow()}
                    {this.renderLogoURLRow()}
                    {this.renderHomeURLRow()}
                    {this.renderPrivatePublicRow()}
                    {this.renderResearchInterestsRow()}
                    {this.renderDescriptionRow()}
                    <div className="EditOrganization-row">
                        <div className="EditOrganization-col1">
                        </div>
                        <div className="EditOrganization-col2" style={{ textAlign: 'center' }}>
                            <div className="ButtonSet">
                                <span className="ButtonSet-button">
                                    {this.renderSaveButton()}
                                </span>
                                <span className="ButtonSet-button">
                                    {this.renderCancelButton()}
                                </span>
                            </div>
                        </div>
                        <div className="EditOrganization-col3">
                        </div>
                    </div>
                </div>
            </form >
        )
    }

    renderIsPrivate(isPrivate: boolean) {
        if (isPrivate) {
            return (
                <span>
                    <Icon type="lock" />{' '}Hidden - will be visible <b>only</b> for members of this organization
                </span>
            )
        }
        return (
            <span>
                <Icon type="global" />{' '}Visible - will be visible to all KBase users.
            </span>
        )
    }

    renderLogoPreview() {
        if (!this.props.editedOrganization.logoUrl.value) {
            return this.renderDefaultLogo()
        }
        return (
            <img src={this.props.editedOrganization.logoUrl.value} width={60} />
        )
    }

    charAt(inString: string, position: number) {
        const c1 = inString.charCodeAt(position)
        if (c1 >= 0xD800 && c1 <= 0xDBFF && inString.length > position + 1) {
            const c2 = inString.charCodeAt(position + 1)
            if (c2 > 0xDC00 && c2 <= 0xDFFF) {
                return inString.substring(position, 2)
            }
        }
        return inString.substring(position, 1)
    }

    renderDefaultLogo() {
        if (!(this.props.editedOrganization.name.value && this.props.editedOrganization.id.value)) {
            return (
                <div>
                    Default logo preview available when the Organization name and id are completed
                </div>
            )
        }
        const initial = this.charAt(this.props.editedOrganization.name.value, 0).toUpperCase()
        const hash = md5(this.props.editedOrganization.id.value)
        const size = 60;
        const color = hash.substr(0, 6)
        return (
            <svg width={size} height={size} style={{ border: '1px rgba(200, 200, 200, 0.5) solid' }}>
                <text x="50%" y="50%" dy={4} textAnchor="middle" dominantBaseline="middle" fontSize={size - 12} fill={'#' + color} fontFamily="sans-serif">{initial}</text>
            </svg>
        )
    }

    renderState() {
        const { editState, validationState, saveState } = this.props;
        const label = 'edit: ' + editState + ', valid: ' + validationState + ', save: ' + saveState
        return (
            <span style={{ marginRight: '10px' }}>{label}</span>
        )
    }

    renderMenuButtons() {
        return (
            <span className="ButtonSet">
                <span className="ButtonSet-button">
                    <Button icon="rollback"
                        type="danger"
                        onClick={this.onFinish.bind(this)}>
                        Close
                        </Button>
                </span>
                <span className="ButtonSet-button">
                    <Button icon="save"
                        form="editOrganizationForm"
                        key="submit"
                        disabled={!this.canSave.call(this)}
                        htmlType="submit">
                        Save
                    </Button>
                </span>
            </span>
        )
    }

    render() {
        if (this.state.cancelToViewer) {
            return <Redirect push to={"/viewOrganization/" + this.props.organization.id} />
        }

        return (
            <div className="EditOrganization">
                <MainMenu buttons={this.renderMenuButtons()} />
                {this.renderEditor()}
            </div>
        )
    }
}

export default EditOrganization