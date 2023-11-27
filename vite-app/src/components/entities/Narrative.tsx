import { DownOutlined, ExclamationCircleOutlined, FileOutlined, GlobalOutlined, LockOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { Component, Fragment } from 'react';
import * as narrativeModel from '../../data/models/narrative';
import UILink from '../UILink';
import './Narrative.css';
import UserSimple from './UserContainer';

export interface NarrativeProps {
    narrative: narrativeModel.Narrative;
}

enum View {
    COMPACT = 0,
    NORMAL
}

function reverseView(v: View) {
    switch (v) {
        case View.COMPACT:
            return View.NORMAL;
        case View.NORMAL:
            return View.COMPACT;
    }
}

interface NarrativeState {
    view: View;
}

export default class Narrative extends Component<NarrativeProps, NarrativeState> {
    constructor(props: NarrativeProps) {
        super(props);

        this.state = {
            view: View.COMPACT
        };
    }

    onToggleView() {
        this.setState({
            view: reverseView(this.state.view)
        });
    }

    renderPublicPermission(narrative: narrativeModel.AccessibleNarrative) {
        if (narrative.isPublic) {
            return (
                <Tooltip title="This narrative is viewable by all KBase users" placement="right">
                    <span style={{ cursor: 'help' }}>
                        <GlobalOutlined /> Public Narrative
                    </span>
                </Tooltip>
            );
        } else {
            return (
                <Tooltip title="This narrative is only accessible to those with whom it is directly shared" placement="right">
                    <span style={{ cursor: 'help' }}>
                        <LockOutlined /> Private Narrative
                    </span>
                </Tooltip>
            );
        }
    }

    renderUserPermission(narrative: narrativeModel.AccessibleNarrative) {
        let label;
        switch (narrative.access) {
            case narrativeModel.NarrativeAccess.VIEW:
                label = (
                    <span>View-Only (<i>visit narrative to request additional access</i>)</span>
                );
                break;
            case narrativeModel.NarrativeAccess.EDIT:
                label = (
                    <span>Edit (<i>visit narrative to request additional access</i>)</span>
                );
                break;
            case narrativeModel.NarrativeAccess.ADMIN:
                label = 'Admin';
                break;
            case narrativeModel.NarrativeAccess.OWNER:
                label = 'Owner';
                break;
            default:
                label = 'Unknown';
        }
        return (
            <span>
                {label}
            </span>
        );
    }

    renderCompact(narrative: narrativeModel.AccessibleNarrative) {
        return (
            <Fragment>
                <div className="controlCol">
                    <Button
                        type="link"
                        size="small"
                        onClick={this.onToggleView.bind(this)}
                    >
                        {this.state.view === View.NORMAL ? <UpOutlined /> : <DownOutlined />}
                    </Button>
                </div>
                <div className="iconCol">
                    <FileOutlined style={{ fontSize: '30px', width: '30px' }} />
                </div>
                <div className="mainCol">
                    <div className="Narrative-title">
                        <UILink 
                            hashPath={{pathname: `narrative/${narrative.workspaceId}`}}
                            newWindow={true}>
                            {narrative.title}
                        </UILink>
                    </div>
                    {' '}
                    <div className="Narrative-owner">
                        <UserSimple avatarSize={20} userId={narrative.owner} />
                    </div>
                </div>
            </Fragment>
        );
    }

    renderNormal(narrative: narrativeModel.AccessibleNarrative) {
        // const narrative = this.props.narrative
        return (
            <Fragment>
                <div className="controlCol">
                    <Button
                        type="link"
                        size="small"
                        onClick={this.onToggleView.bind(this)}
                    >
                        {this.state.view === View.NORMAL ? <UpOutlined /> : <DownOutlined />}
                    </Button>
                </div>
                <div className="iconCol">
                    <FileOutlined style={{ fontSize: '30px', width: '30px' }} />
                </div>
                <div className="mainCol">
                    <div className="mainCol">
                        <div className="Narrative-title">
                            <UILink 
                                hashPath={{pathname: `narrative/${narrative.workspaceId}`}}
                                newWindow={true}>
                                {narrative.title}
                            </UILink>
                        </div>
                        {' '}
                        <div className="Narrative-owner">
                            <UserSimple avatarSize={20} userId={narrative.owner} />
                        </div>
                    </div>
                    <div>
                        {this.renderPublicPermission(narrative)}
                    </div>
                    <div>
                        <span className="field-label">your permission</span>
                        {this.renderUserPermission(narrative)}
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

            </Fragment>
        );
    }

    render() {
        const narrative = this.props.narrative;
        if (narrative.access === narrativeModel.NarrativeAccess.NONE) {
            return (
                <div>
                    <ExclamationCircleOutlined style={{ color: 'orange' }} />
                    {' '}
                    You don't have access to this Narrative
                </div>
            );
        }
        switch (this.state.view) {
            case View.COMPACT:
                return (
                    <div className="Narrative View-COMPACT">
                        {this.renderCompact(narrative)}
                    </div>
                );
            case View.NORMAL:
                return (
                    <div className="Narrative View-NORMAL">
                        {this.renderNormal(narrative)}
                    </div>
                );
        }

    }
}