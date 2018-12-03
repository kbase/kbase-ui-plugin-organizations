import * as React from 'react'
import { Drawer, Radio } from 'antd';
import { Narrative, Member, Organization, NarrativeResource, UserWorkspacePermission } from '../../types';
import './component.css'

export interface RequestAccessProps {
    narrative: NarrativeResource
    member: Member
    organization: Organization
    onClose: () => void
}

export interface RequestAccessState {

}

export class RequestAccess extends React.Component<RequestAccessProps, RequestAccessState> {
    constructor(props: RequestAccessProps) {
        super(props)
    }

    renderNarrativePermission() {
        switch (this.props.narrative.permission) {
            case UserWorkspacePermission.NONE:
                return 'None'
            case UserWorkspacePermission.READ:
                return 'View and Copy'
            case UserWorkspacePermission.WRITE:
                return 'View, Copy, Save, Run'
            case UserWorkspacePermission.ADMIN:
                return 'View, Copy, Save, Run, Manage Sharing'
            case UserWorkspacePermission.OWN:
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
                    This request will be sent to all Organization admins, with whom the narrative will be automatically shared
                    read-only.
                </p>

            </Drawer>
        )
    }
}