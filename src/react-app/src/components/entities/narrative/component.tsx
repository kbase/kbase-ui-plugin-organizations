import * as React from 'react'
import * as narrativeModel from '../../../data/models/narrative'
import { Tooltip, Icon } from 'antd'
import UserSimple from '../UserSimpleContainer'
import { niceElapsed } from '../../../lib/time'
import './component.css'
import NiceElapsedTime from '../../NiceElapsedTime';

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
                        <Icon type="global" /> Public Narrative
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

    // renderUserPermission(narrative: narrativeModel.AccessibleNarrative) {
    //     let label
    //     switch (narrative.access) {
    //         case narrativeModel.NarrativeAccess.VIEW:
    //             label = (
    //                 <span>View-Only (<i>visit narrative to request additional access</i>)</span>
    //             )
    //             break
    //         case narrativeModel.NarrativeAccess.EDIT:
    //             label = (
    //                 <span>Edit (<i>visit narrative to request additional access</i>)</span>
    //             )
    //             break
    //         case narrativeModel.NarrativeAccess.ADMIN:
    //             label = 'Admin'
    //             break
    //         case narrativeModel.NarrativeAccess.OWNER:
    //             label = 'Owner'
    //             break
    //         default:
    //             label = 'Unknown'
    //     }
    //     return (
    //         <span>
    //             {label}
    //         </span>
    //     )
    // }

    renderUserPermission(narrative: narrativeModel.AccessibleNarrative) {
        let iconType
        let tooltip
        switch (narrative.access) {
            case narrativeModel.NarrativeAccess.VIEW:
                iconType = 'eye'
                tooltip = (
                    <span>View-Only (<i>visit narrative to request additional access</i>)</span>
                )
                break
            case narrativeModel.NarrativeAccess.EDIT:
                iconType = 'edit'
                tooltip = (
                    <span>This narrative is shared with you with <b>edit</b>> access (<i>visit narrative to request additional access</i>)</span>
                )
                break
            case narrativeModel.NarrativeAccess.ADMIN:
                iconType = 'unlock'
                tooltip = (
                    <span>
                        This narrative is shared with you with <b>access</b> - you may edit and re-share this
                    </span>
                )
                break
            case narrativeModel.NarrativeAccess.OWNER:
                iconType = 'crown'
                tooltip = (
                    <span>
                        You are the owner of this Narrative
                    </span>
                )
                break
        }
        return (
            <Tooltip
                placement="bottomRight"
                title={tooltip}>
                <Icon type={iconType} />
            </Tooltip>
        )
    }

    renderGlobalPermission(narrative: narrativeModel.AccessibleNarrative) {
        let iconType
        let tooltip
        if (narrative.isPublic) {
            iconType = 'global'
            tooltip = 'This narrative has been shared publicly - with all KBase users'
        } else {
            iconType = 'lock'
            tooltip = 'This narrative is private - only accessible to the owner any users it has been shared with'
        }
        return (
            <Tooltip
                placement="bottomRight"
                title={tooltip}>
                <Icon type={iconType} />
            </Tooltip>
        )
    }

    renderNiceElapsed(d: Date) {
        const tooltip = (
            <span>
                {
                    Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    }).format(d)
                }
            </span>
        )
        return (
            <Tooltip placement="bottomRight" title={tooltip}>
                {niceElapsed(d)}
            </Tooltip>
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
                {/* <div className="iconCol">
                    <Icon type="file" style={{ fontSize: '30px', width: '30px' }} />
                </div> */}
                <div className="mainCol">
                    <div>
                        <div className="Narrative-title">
                            <a href={"/narrative/" + narrative.workspaceId} target="_blank">
                                {narrative.title}
                            </a>
                        </div>
                        {', '}
                        <div className="Narrative-owner">
                            <UserSimple avatarSize={20} userId={narrative.owner} />
                        </div>
                    </div>

                    <div className="Narrative-attributes">
                        <div className="Narrative-userPermission">
                            {this.renderUserPermission(narrative)}
                        </div>
                        <div className="Narrative-global">
                            {this.renderGlobalPermission(narrative)}
                        </div>
                    </div>
                    <div>
                        <span className="field-label">updated</span>
                        <NiceElapsedTime time={narrative.lastSavedAt} />
                    </div>

                    {/* TODO: left off here; need to add in the added date
                        <div>
                        <span className="field-label">added</span>
                        {this.renderNiceElapsed(this.props.)}
                    </div> */}
                    {/* <div>
                        {this.renderPublicPermission(narrative)}
                    </div>
                    <div>
                        <span className="field-label">your permission</span>
                        {this.renderUserPermission(narrative)}
                    </div> */}
                    {/* <div>
                        <span className="field-label">owner</span>
                        <div style={{ display: 'inline-block' }}><UserSimple avatarSize={20} userId={narrative.owner} /></div>
                    </div> */}
                </div>

            </React.Fragment>
        )
    }

    renderNormal(narrative: narrativeModel.AccessibleNarrative) {

        return (
            <React.Fragment>
                <div className="controlCol">
                    <a onClick={this.onToggleView.bind(this)}
                        className={`linkButton ${this.state.view === View.NORMAL ? "pressed" : ""}`}
                    >
                        <Icon type={`${this.state.view === View.NORMAL ? "up" : "down"}`} />
                    </a>
                </div>
                {/* <div className="iconCol">
                    <Icon type="file" style={{ fontSize: '30px', width: '30px' }} />
                </div> */}
                <div className="mainCol">
                    <div>
                        <div className="Narrative-title">
                            <a href={"/narrative/" + narrative.workspaceId} target="_blank">
                                {narrative.title}
                            </a>
                        </div>
                        {', '}
                        <div className="Narrative-owner">
                            <UserSimple avatarSize={20} userId={narrative.owner} />
                        </div>
                    </div>
                    <div className="Narrative-attributes">
                        <div className="Narrative-userPermission">
                            {this.renderUserPermission(narrative)}
                        </div>
                        <div className="Narrative-global">
                            {this.renderGlobalPermission(narrative)}
                        </div>
                    </div>
                    {/* <div>
                        {this.renderPublicPermission(narrative)}
                    </div>
                    <div>
                        <span className="field-label">your permission</span>
                        {this.renderUserPermission(narrative)}
                    </div> */}
                    {/* <div>
                        <span className="field-label">owner</span>
                        <div style={{ display: 'inline-block' }}><UserSimple avatarSize={20} userId={narrative.owner} /></div>
                    </div> */}
                    <div>
                        <span className="field-label">last saved</span>
                        {this.renderNiceElapsed(narrative.lastSavedAt)}
                    </div>
                    <div>
                        <span className="field-label">by</span>
                        <UserSimple avatarSize={20} userId={narrative.lastSavedBy} />
                    </div>
                </div>
            </React.Fragment>
        )
    }

    renderNarrative(narrative: narrativeModel.AccessibleNarrative) {
        return (
            <React.Fragment>
                <div className="mainCol">
                    <div>
                        <div className="Narrative-title">
                            <a href={"/narrative/" + narrative.workspaceId} target="_blank">
                                {narrative.title}
                            </a>
                        </div>
                        {', '}
                        <div className="Narrative-owner">
                            <UserSimple avatarSize={20} userId={narrative.owner} />
                        </div>
                    </div>

                    <div className="Narrative-attributes">
                        <div className="Narrative-userPermission">
                            {this.renderUserPermission(narrative)}
                        </div>
                        <div className="Narrative-global">
                            {this.renderGlobalPermission(narrative)}
                        </div>
                    </div>
                    <div>
                        <span className="field-label">
                            <Icon type="save" />
                        </span>
                        <NiceElapsedTime time={narrative.lastSavedAt} tooltipPrefix="last saved " />
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
                    You don't have access to this Narrative
                </div>
            )
        }
        // switch (this.state.view) {
        //     case View.COMPACT:
        //         return (
        //             <div className="Narrative View-COMPACT">
        //                 {this.renderCompact(narrative)}
        //             </div>
        //         )
        //     case View.NORMAL:
        //         return (
        //             <div className="Narrative View-NORMAL">
        //                 {this.renderNormal(narrative)}
        //             </div>
        //         )
        // }
        return this.renderNarrative(narrative)
    }
}