import * as React from 'react'
import Header from '../../../../Header';
import { Icon, Button, Modal, Input } from 'antd';
import { NavLink } from 'react-router-dom';
import './component.css'
import * as orgModel from '../../../../../data/models/organization/model'
import * as userModel from '../../../../../data/models/user'
import { Editable, ValidationErrorType, SyncState, EditState, SaveState, ValidationState } from '../../../../../types'
import MainMenu from '../../../../menu/component'

export interface ManageMembershipProps {
    username: userModel.Username
    organization: orgModel.Organization
    editableMemberProfile: orgModel.EditableMemberProfile
    editState: EditState
    saveState: SaveState
    validationState: ValidationState
    onLeaveOrganization: (organizationId: string) => void
    onUpdateTitle: (title: string) => void
    onSave: () => void
    onFinish: () => void
}

interface MangeMembershipState {
}

class ManageMembership extends React.Component<ManageMembershipProps, MangeMembershipState> {
    constructor(props: ManageMembershipProps) {
        super(props)
    }

    doLeaveOrg() {
        // alert('this will leave you the org')
        // this.props.onLeaveOrganization(this.props.organization.id)
        const confirmed = (() => {
            this.doLeaveOrgConfirmed()
        }).bind(this)
        Modal.confirm({
            title: 'Really leave this organization?',
            content: (
                <p>
                    This is not reversible.
                </p>
            ),
            width: '50em',
            onOk: () => {
                confirmed()
            }
        })
    }

    onDone() {
        this.props.onFinish()
    }

    doLeaveOrgConfirmed() {
        // alert('this will leave you the org')
        this.props.onLeaveOrganization(this.props.organization.id)
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

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        this.props.onSave()
    }

    onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist()
        this.props.onUpdateTitle(e.target.value)
    }

    doShowInfo() {
        // this.setState({ showInfo: true })
        Modal.info({
            title: 'Manage My Membership Help',
            width: '50em',
            content: (
                <div>
                    <p>This is the view to help you manage your membership...</p>
                </div>
            )
        })
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
                            {this.renderOrgName(this.props.organization.name)}
                        </span>
                    </NavLink>

                    <Icon type="right" style={{ verticalAlign: 'middle', marginLeft: '4px', marginRight: '4px' }} />

                    <Icon type="user" />
                    {' '}
                    <span style={{ fontSize: '120%' }}>Manage your membership</span>
                </span>
            </React.Fragment>
        )
        const buttons = (
            <React.Fragment>
                <Button
                    // shape="circle"
                    type="danger"
                    icon="frown"
                    onClick={this.doLeaveOrg.bind(this)}>
                    Leave Organization...
                </Button>
            </React.Fragment>
        )
        return (
            <Header breadcrumbs={breadcrumbs} buttons={buttons} />
        )
    }

    calcFieldClass(field: Editable) {
        switch (field.validationState.type) {
            // case (ValidationErrorType.OK):
            //     return 'validation-ok'
            case (ValidationErrorType.ERROR):
                return 'ManageMembership-validation-error'
            case (ValidationErrorType.REQUIRED_MISSING):
                return 'ManageMembership-validation-error'
        }

        switch (field.syncState) {
            case (SyncState.DIRTY):
                return 'ManageMembership-sync-dirty'
            default:
                return 'ManageMembership-validation-ok'
        }
    }

    renderEditor() {
        return (
            <form id="editMembership"
                className="ManageMembership-editorTable"
                onSubmit={this.onSubmit.bind(this)}>
                <div className="ManageMembership-headerRow">
                    <div className="ManageMembership-editCol ManageMembership-headerCol">
                        Edit
                    </div>
                    <div className="ManageMembership-editCol ManageMembership-headerCol">
                        Preview
                    </div>
                </div>
                <div className="ManageMembership-editorTable-row">
                    <div className="ManageMembership-editCol ManageMembership-editCell">
                        <div className="ManageMembership-editorTable-labelCol">
                            <span className="field-label ManageMembership-titleLabel">
                                title
                            </span>
                        </div>
                        <div className="ManageMembership-editorTable-controlCol">
                            <Input value={this.props.editableMemberProfile.title.value || ''}
                                className={this.calcFieldClass(this.props.editableMemberProfile.title)}
                                onChange={this.onTitleChange.bind(this)} />
                        </div>
                    </div>
                    <div className="ManageMembership-previewCol ManageMembership-previewCell">
                        <div className="ManageMembership-titlePreview">
                            {this.props.editableMemberProfile.title.value}
                        </div>
                    </div>
                </div>
                <div className="ManageMembership-editorFooter">
                    <Button icon="save"
                        form="editMembership"
                        key="submit"
                        disabled={!this.canSave.call(this)}
                        htmlType="submit">
                        Save
                </Button>
                </div>
            </form>
        )
    }

    renderMenuButtons() {
        return (
            <div className="ButtonSet">
                <div className="ButtonSet-button">
                    <Button icon="rollback"
                        type="danger"
                        onClick={this.onDone.bind(this)}>
                        Done
                    </Button>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="ManageMembership scrollable-flex-column">
                <MainMenu buttons={this.renderMenuButtons()} />
                <h3>
                    Edit Your Membership Profile
                </h3>

                <div className="ManageMembership-body">
                    {this.renderEditor()}
                </div>

            </div>
        )
    }
}

export default ManageMembership