import * as React from 'react';
import { Button, Modal, Input, Tooltip } from 'antd';
import * as orgModel from '../../../../../data/models/organization/model';
import * as userModel from '../../../../../data/models/user';
import {
    Editable, ValidationErrorType, SyncState, EditState,
    SaveState, ValidationState
} from '../../../../../types';
import './component.css';

export interface ManageMembershipProps {
    username: userModel.Username;
    organization: orgModel.Organization;
    editableMemberProfile: orgModel.EditableMemberProfile;
    editState: EditState;
    saveState: SaveState;
    validationState: ValidationState;
    onLeaveOrganization: (organizationId: string) => void;
    onDemoteSelfToMember: (organizationId: string) => void;
    onUpdateTitle: (title: string) => void;
    onSave: () => void;
    onFinish: () => void;
}

interface MangeMembershipState {
}

class ManageMembership extends React.Component<ManageMembershipProps, MangeMembershipState> {
    doLeaveOrg() {
        const confirmed = () => {
            this.doLeaveOrgConfirmed();
        };
        Modal.confirm({
            title: 'Really leave this organization?',
            content: (
                <p>
                    This is not reversible.
                </p>
            ),
            width: '50em',
            onOk: () => {
                confirmed();
            }
        });
    }

    onDone() {
        this.props.onFinish();
    }

    onCancel() {
        this.props.onFinish();
    }

    doLeaveOrgConfirmed() {
        // alert('this will leave you the org')
        this.props.onLeaveOrganization(this.props.organization.id);
        this.props.onFinish();
    }

    onDemoteSelfToMember() {
        const confirmed = () => {
            this.onDemoteSelfToMemberConfirmed();
        };
        Modal.confirm({
            title: 'Confirm Demotion to Regular Member',
            content: (
                <p>
                    Upon removing administrator privileges for yourself, you will
                    not be able to restore them without the assistance of the
                    Organization's owner or an administrator
                </p>
            ),
            width: '50em',
            onOk: () => {
                confirmed();
            }
        });
    }

    onDemoteSelfToMemberConfirmed() {
        this.props.onDemoteSelfToMember(this.props.organization.id);
    }

    canSave() {
        return (
            this.props.editState === EditState.EDITED &&
            this.props.validationState.type === ValidationErrorType.OK &&
            (this.props.saveState === SaveState.NEW ||
                this.props.saveState === SaveState.READY ||
                this.props.saveState === SaveState.SAVED)
        );
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.props.onSave();
    }

    onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist();
        this.props.onUpdateTitle(e.target.value);
    }

    renderOrgName(name: string) {
        if (name.length < 25) {
            return name;
        }
        return (
            <span>
                {name.slice(0, 25)}
                …
            </span>
        );
    }

    calcFieldClass(field: Editable) {
        switch (field.validationState.type) {
            // case (ValidationErrorType.OK):
            //     return 'validation-ok'
            case (ValidationErrorType.ERROR):
                return 'ManageMembership-validation-error';
            case (ValidationErrorType.REQUIRED_MISSING):
                return 'ManageMembership-validation-error';
        }

        switch (field.syncState) {
            case (SyncState.DIRTY):
                return 'ManageMembership-sync-dirty';
            default:
                return 'ManageMembership-validation-ok';
        }
    }

    renderLeaveOrgButton() {
        let leaveOrgButton;
        switch (this.props.organization.relation) {
            case orgModel.UserRelationToOrganization.MEMBER:
                leaveOrgButton = (
                    <div className="ButtonSet-button">
                        <Button icon="delete"
                            type="danger"
                            onClick={this.doLeaveOrg.bind(this)}
                        >
                            Leave Organization
                                </Button>
                    </div>
                );
                break;
            case orgModel.UserRelationToOrganization.ADMIN:
                const adminTooltip = (
                    <React.Fragment>
                        <p>
                            As an organization administrator, you may not leave
                            the organization.
                        </p>
                        <p>
                            In order to leave the organization, you will need to
                            become a regular member first.
                        </p>
                    </React.Fragment>
                );
                leaveOrgButton = (
                    <div className="ButtonSet-button">
                        <Tooltip
                            title={adminTooltip}>
                            <Button icon="stop"
                                type="default"
                                disabled={true}
                            >
                                Only a regular member may leave Organization
                            </Button>
                        </Tooltip>
                    </div>
                );
                break;
            case orgModel.UserRelationToOrganization.OWNER:
                const ownerTooltip = (
                    <React.Fragment>
                        <p>
                            As an organization owner, you are the only permanent member
                            of this organization.
                        </p>
                    </React.Fragment>
                );
                leaveOrgButton = (
                    <div className="ButtonSet-button">
                        <Tooltip
                            title={ownerTooltip}>
                            <Button icon="stop"
                                type="default"
                                disabled={true}
                            >
                                Cannot leave Organization
                        </Button>
                        </Tooltip>
                    </div>
                );
                break;
        }
        return leaveOrgButton;
    }

    renderDemoteToMemberButton() {
        switch (this.props.organization.relation) {
            case orgModel.UserRelationToOrganization.ADMIN:
                return (
                    <div className="ButtonSet-button">
                        <Button icon="user"
                            type="default"
                            onClick={this.onDemoteSelfToMember.bind(this)}>
                            Demote Self to Member
                        </Button>

                    </div>
                );
        }
    }

    renderTitleRow() {
        const tooltip = (
            <p>
                This is your title within this Organization.
            </p>
        );
        return (
            <div className="ManageMembership-editorTable-row">
                <div className="ManageMembership-editCol ManageMembership-editCell">
                    <div className="ManageMembership-editorTable-labelCol">
                        <span className="field-label ManageMembership-titleLabel">
                            <Tooltip title={tooltip}>
                                title
                                </Tooltip>
                        </span>
                    </div>
                    <div className="ManageMembership-editorTable-controlCol">
                        <Input value={this.props.editableMemberProfile.title.value || ''}
                            className={this.calcFieldClass(this.props.editableMemberProfile.title)}
                            onChange={this.onTitleChange.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }

    renderCancelButton() {
        if (this.canSave()) {
            return (
                <div className="ButtonSet-button">
                    <Button icon="delete"
                        type="danger"
                        onClick={this.onCancel.bind(this)}>
                        Cancel
                    </Button>
                </div>
            );
        } else {
            return (
                <div className="ButtonSet-button">
                    <Button icon="close"
                        type="danger"
                        onClick={this.onDone.bind(this)}>
                        Close
                    </Button>
                </div>
            );
        }

    }

    renderSaveButton() {
        return (
            <div className="ButtonSet-button">
                <Button icon="save"
                    type="primary"
                    form="editMembership"
                    key="submit"
                    disabled={!this.canSave.call(this)}
                    htmlType="submit">
                    Save
                </Button>
            </div>
        );
    }

    renderEditor() {
        return (
            <form id="editMembership"
                className="ManageMembership-editorTable scrollable-flex-column"
                onSubmit={this.onSubmit.bind(this)}>
                <div className="ManageMembership-headerRow">
                    <div className="ManageMembership-editCol ManageMembership-headerCol">
                        Edit Your Organization Profile
                    </div>
                </div>
                <div className="ManageMembership-formRow">
                    {this.renderTitleRow()}
                    <div className="ManageMembership-editorFooter">
                        <div className="ButtonSet">
                            {this.renderSaveButton()}
                            {this.renderCancelButton()}
                            {this.renderLeaveOrgButton()}
                            {this.renderDemoteToMemberButton()}
                        </div>
                    </div>
                </div>
            </form >
        );
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
        );
    }

    render() {
        return (
            <div className="ManageMembership scrollable-flex-column">
                {/* <MainMenu buttons={this.renderMenuButtons()} title="Manage My Membership" /> */}
                <div className="ManageMembership-body scrollable-flex-column">
                    <div className="ManageMembership-main scrollable-flex-column">
                        {this.renderEditor()}
                    </div>
                </div>

            </div>
        );
    }
}

export default ManageMembership;