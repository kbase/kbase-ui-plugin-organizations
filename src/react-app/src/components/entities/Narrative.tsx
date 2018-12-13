import * as React from 'react'
import * as narrativeModel from '../../data/models/narrative'
import { Tooltip, Icon } from 'antd';

export interface NarrativeProps {
    narrative: narrativeModel.Narrative
}

interface NarrativeState {

}

export default class Narrative extends React.Component<NarrativeProps, NarrativeState> {
    constructor(props: NarrativeProps) {
        super(props)
    }

    renderPublicPermission(narrative: narrativeModel.AccessibleNarrative) {
        if (narrative.isPublic) {
            return (
                <Tooltip title="This narrative is viewable by all KBase users" placement="right">
                    <span style={{ cursor: 'help' }}>
                        <Icon type="globe" /> Public Narrative
                    </span>
                </Tooltip>
            )
        } else {
            return (
                <Tooltip title="This narrative is only accessible to those with whom it is directly shared" placement="right">
                    <span style={{ cursor: 'help' }}>
                        <Icon type="lock" /> Private Narrative
                    </span>
                </Tooltip>
            )
        }
    }

    renderUserPermission(narrative: narrativeModel.AccessibleNarrative) {
        let label
        switch (narrative.access) {
            case narrativeModel.NarrativeAccess.VIEW:
                label = 'View-Only'
                break
            case narrativeModel.NarrativeAccess.EDIT:
                label = 'Edit'
                break
            case narrativeModel.NarrativeAccess.ADMIN:
                label = 'Admin'
                break
            case narrativeModel.NarrativeAccess.OWNER:
                label = 'Owner'
                break
            default:
                label = 'Unknown'
        }
        return (
            <span>
                {label}
            </span>
        )
    }

    render() {
        const narrative = this.props.narrative
        if (narrative.access === narrativeModel.NarrativeAccess.NONE) {
            return (
                <div>
                    You don't have access to this Narrative
                </div>
            )
        }
        return (
            <div>
                <div>
                    {narrative.title}
                </div>
                <div>
                    {this.renderPublicPermission(narrative)}
                </div>
                <div>
                    <span className="field-label">your permission</span>
                    {this.renderUserPermission(narrative)}
                </div>
                <div>
                    <span className="field-label">owner</span>{narrative.owner}
                </div>
                <div>
                    <span className="field-label">last saved</span>{Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    }).format(narrative.lastSavedAt)}
                </div>
                <div>
                    <span className="field-label">by</span>{narrative.lastSavedBy}
                </div>
            </div>
        )
    }
}