import * as React from 'react'
import * as narrativeModel from '../../data/models/narrative'
import { Tooltip, Icon, Alert } from 'antd';
import './Narrative.css'

export interface NarrativeProps {
    narrative: narrativeModel.Narrative
}


enum View {
    COMPACT = 0,
    NORMAL
}

function reverseView(v: View) {
    switch (v) {
        case View.COMPACT:
            return View.NORMAL
        case View.NORMAL:
            return View.COMPACT
    }
}

interface NarrativeState {
    view: View
}

export default class Narrative extends React.Component<NarrativeProps, NarrativeState> {
    constructor(props: NarrativeProps) {
        super(props)

        this.state = {
            view: View.COMPACT
        }
    }

    onToggleView() {
        this.setState({
            view: reverseView(this.state.view)
        })
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

    renderCompact(narrative: narrativeModel.AccessibleNarrative) {
        return (
            <React.Fragment>
                <div className="controlCol">
                    <a onClick={this.onToggleView.bind(this)}
                        className={`linkButton ${this.state.view === View.NORMAL ? "pressed" : ""}`}
                    >
                        <Icon type={`${this.state.view === View.NORMAL ? "up" : "down"}`} />
                    </a>
                </div>
                <div className="iconCol">
                    <Icon type="file" style={{ fontSize: '30px', width: '30px' }} />
                </div>
                <div className="mainCol">
                    <div className="title">
                        <a href={"//narrative/" + narrative.workspaceId} target="_blank">
                            {narrative.title}
                        </a>
                    </div>
                </div>

            </React.Fragment>
        )
    }

    renderNormal(narrative: narrativeModel.AccessibleNarrative) {
        // const narrative = this.props.narrative
        return (
            <React.Fragment>
                <div className="controlCol">
                    <a onClick={this.onToggleView.bind(this)}
                        className={`linkButton ${this.state.view === View.NORMAL ? "pressed" : ""}`}
                    >
                        <Icon type={`${this.state.view === View.NORMAL ? "up" : "down"}`} />
                    </a>
                </div>
                <div className="iconCol">
                    <Icon type="file" style={{ fontSize: '30px', width: '30px' }} />
                </div>
                <div className="mainCol">
                    <div className="title">
                        <a href={"//narrative/" + narrative.workspaceId} target="_blank">
                            {narrative.title}
                        </a>
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

            </React.Fragment>
        )
    }

    render() {
        const narrative = this.props.narrative
        if (narrative.access === narrativeModel.NarrativeAccess.NONE) {
            return (
                <div>
                    <Icon type="exclamation-circle" style={{ color: 'orange' }} />
                    {' '}
                    You don't have access to this Narrative
                </div>
            )
        }
        switch (this.state.view) {
            case View.COMPACT:
                return (
                    <div className="Narrative View-COMPACT">
                        {this.renderCompact(narrative)}
                    </div>
                )
            case View.NORMAL:
                return (
                    <div className="Narrative View-NORMAL">
                        {this.renderNormal(narrative)}
                    </div>
                )
        }

    }
}