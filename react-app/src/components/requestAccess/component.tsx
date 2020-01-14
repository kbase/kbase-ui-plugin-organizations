import * as React from 'react'
import { Drawer, Radio } from 'antd';
import { Member } from '../../types';
import './component.css'
import * as orgModel from '../../data/models/organization/model'

export interface RequestAccessProps {
    narrative: orgModel.NarrativeResource
    member: Member
    organization: orgModel.Organization
    onClose: () => void
}

export interface RequestAccessState {

}

export class RequestAccess extends React.Component<RequestAccessProps, RequestAccessState> {


    renderNarrativePermission() {
        switch (this.props.narrative.permission) {
            case orgModel.UserWorkspacePermission.NONE:
                return 'None'
            case orgModel.UserWorkspacePermission.VIEW:
                return 'View and Copy'
            case orgModel.UserWorkspacePermission.EDIT:
                return 'View, Copy, Save, Run'
            case orgModel.UserWorkspacePermission.ADMIN:
                return 'View, Copy, Save, Run, Manage Sharing'
            case orgModel.UserWorkspacePermission.OWNER:
                return 'View, Copy, Save, Run, Manage Sharing, Own'
        }
    }

    render() {
        const radioStyle = {
            display: 'block'
        }
        return (
            <Drawer
                className="RequestAccess"
                title="Request Access to Narrative"
                placement="right"
                width={500}
                closable={true}
                visible={true}
                onClose={() => { this.props.onClose.call(this) }}
            >
                <p>
                    You are requesting additional share access to narrative <b>{this.props.narrative.title}</b>
                </p>
                <div className="title">
                    Current Access
                </div>
                <div>
                    {this.renderNarrativePermission()}
                </div>
                <div className="title">
                    Requested Permission
                </div>
                <div>
                    <Radio.Group>
                        <Radio value="view" style={radioStyle}>View Only (can view, copy)</Radio>
                        <Radio value="edit" style={radioStyle}>Edit (also can edit, run)</Radio>
                        <Radio value="admin" style={radioStyle}>Admin (also can control sharing)</Radio>
                    </Radio.Group>
                </div>
                <p style={{ marginTop: '10px' }}>
                    This request will be sent directly to the Narrative owner as well as any Narrative admins.
                </p>

            </Drawer>
        )
    }
}