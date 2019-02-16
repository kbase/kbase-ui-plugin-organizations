import * as React from 'react'
import { Redirect, NavLink } from 'react-router-dom';
import { Marked } from 'marked-ts';
import { Button, Icon, Modal, Checkbox, Input, Tooltip } from 'antd';
import md5 from 'md5'
import {
    EditableOrganization, SaveState, ValidationState,
    EditState, ValidationErrorType, Editable, SyncState
} from '../../../../../types';
import './component.css'

import Header from '../../../../Header';
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
            <form id="editOrganizationForm" className="EditOrganization-editor" onSubmit={this.onSubmit.bind(this)}>
                <div className="EditOrganization-row">
                    <div className="EditOrganization-col1">
                        <div style={{ flex: '1 1 0px' }}>
                            <h3>Edit Your Organization</h3>
                        </div>
                    </div>
                    <div className="EditOrganization-col2">
                        <h3>Preview</h3>
                    </div>
                </div>

                {/* Org name */}
                <div className="EditOrganization-row">
                    <div className="EditOrganization-col1">
                        <div className="EditOrganization-formLabel field-label">
                            <Tooltip title="This is the name for your organization as you want KBase users to see it">
                                Name
                            </Tooltip>
                        </div>
                        <div className="EditOrganization-formControl">
                            <Input value={this.props.editedOrganization.name.value || ''}
                                className={this.calcFieldClass(this.props.editedOrganization.name)}
                                onChange={this.onNameChange.bind(this)} />
                            {this.renderFieldError(this.props.editedOrganization.name)}
                        </div>
                    </div>
                    <div className="EditOrganization-col2">
                        <div className="EditOrganization-preview-name">
                            {this.props.editedOrganization.name.value || ''}
                        </div>
                    </div>
                </div>

                {/* Org ID */}
                <div className="EditOrganization-row">
                    <div className="EditOrganization-col1">
                        <div className="EditOrganization-formLabel field-label">
                            ID
                        </div>
                        <div className="EditOrganization-formControl">
                            <Input value={this.props.editedOrganization.id.value || ''}
                                className={this.calcFieldClass(this.props.editedOrganization.id)}
                                onChange={this.onIdChange.bind(this)} />
                            {this.renderFieldError(this.props.editedOrganization.id)}
                        </div>
                    </div>
                    <div className="EditOrganization-col2">
                        <div className="EditOrganization-preview-id">
                            <span style={{ color: 'silver' }}>{this.origin}/#org/</span>
                            {this.props.editedOrganization.id.value || (<span style={{ fontStyle: 'italic' }}>organization id here</span>)}
                        </div>
                    </div>
                </div>

                {/* Logo URL */}
                <div className="EditOrganization-row">
                    <div className="EditOrganization-col1">
                        <div className="EditOrganization-formLabel field-label">
                            Logo URL
                        </div>
                        <div className="EditOrganization-formControl">
                            <Input value={this.props.editedOrganization.logoUrl.value || ''}
                                className={this.calcFieldClass(this.props.editedOrganization.logoUrl)}
                                onChange={this.onLogoUrlChange.bind(this)} />
                            {this.renderFieldError(this.props.editedOrganization.logoUrl)}
                        </div>
                    </div>
                    <div className="EditOrganization-col2">
                        <div className="EditOrganization-preview-logo">
                            {this.renderLogoPreview()}
                        </div>
                    </div>
                </div>

                {/* Home Page URL */}
                <div className="EditOrganization-row">
                    <div className="EditOrganization-col1">
                        <div className="EditOrganization-formLabel field-label">
                            Home Page URL
                        </div>
                        <div className="EditOrganization-formControl">
                            <Input value={this.props.editedOrganization.homeUrl.value || ''}
                                className={this.calcFieldClass(this.props.editedOrganization.homeUrl)}
                                onChange={this.onHomeUrlChange.bind(this)} />
                            {this.renderFieldError(this.props.editedOrganization.homeUrl)}
                        </div>
                    </div>
                    <div className="EditOrganization-col2">
                        <div className="EditOrganization-field-name">
                            <a href={this.props.editedOrganization.homeUrl.value || ''} target="_blank">{this.props.editedOrganization.homeUrl.value || ''}</a>
                        </div>
                    </div>
                </div>

                {/* Is Private? */}
                <div className="EditOrganization-row">
                    <div className="EditOrganization-col1">
                        <div className="EditOrganization-formLabel field-label">
                            Is Private?
                        </div>
                        <div className="EditOrganization-formControl">
                            <Checkbox
                                checked={this.props.editedOrganization.isPrivate.value}
                                className={this.calcFieldClass(this.props.editedOrganization.isPrivate)}
                                onChange={this.onIsPrivateChange.bind(this)} />
                            {this.renderFieldError(this.props.editedOrganization.isPrivate)}
                        </div>
                    </div>
                    <div className="EditOrganization-col2">
                        <div className="EditOrganization-preview-isPrivate">
                            {this.renderIsPrivate(this.props.editedOrganization.isPrivate.value)}
                        </div>
                    </div>
                </div>


                {/* Research Interests */}
                <div className="EditOrganization-row">
                    <div className="EditOrganization-col1">
                        <div className="EditOrganization-formLabel field-label">
                            Research Interests
                        </div>
                        <div className="EditOrganization-formControl">
                            <TextArea value={this.props.editedOrganization.researchInterests.value || ''}
                                className={this.calcFieldClass(this.props.editedOrganization.researchInterests) + ' EditOrganization-control-researchInterests'}
                                autosize={{ minRows: 2, maxRows: 2 }}
                                onChange={this.onResearchInterestsChange.bind(this)} />
                            {this.renderFieldError(this.props.editedOrganization.researchInterests)}
                        </div>
                    </div>
                    <div className="EditOrganization-col2">
                        <div className="EditOrganization-preview-researchInterests">
                            {this.props.editedOrganization.researchInterests.value || ''}
                        </div>
                    </div>
                </div>

                {/* Description*/}
                <div className="EditOrganization-row">
                    <div className="EditOrganization-col1">
                        <div className="EditOrganization-formLabel field-label">
                        </div>
                        <div className="EditOrganization-formControl">
                            <TextArea value={this.props.editedOrganization.description.value || ''}
                                className={this.calcFieldClass(this.props.editedOrganization.description) + ' EditOrganization-control-description'}
                                autosize={{ minRows: 5, maxRows: 15 }}
                                onChange={this.onDescriptionChange.bind(this)} />
                            {this.renderFieldError(this.props.editedOrganization.description)}
                        </div>
                    </div>
                    <div className="EditOrganization-col2">
                        <div className="EditOrganization-preview-description"
                            dangerouslySetInnerHTML={({ __html: Marked.parse(this.props.editedOrganization.description.value || '') })}
                        />
                    </div>
                </div>
            </form >
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