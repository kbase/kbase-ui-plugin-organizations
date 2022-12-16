import { Component } from 'react';
import './Owner.css';

import { CrownOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import * as userModel from '../../data/models/user';
import Avatar from './Avatar';

enum View {
    COMPACT = 0,
    NORMAL
}

export interface OwnerProps {
    user: userModel.User;
    avatarSize?: number;
    showAvatar: boolean;
}

interface OwnerState {
    view: View;
}

function reverseView(v: View) {
    switch (v) {
        case View.COMPACT:
            return View.NORMAL;
        case View.NORMAL:
            return View.COMPACT;
    }
}

export default class Owner extends Component<OwnerProps, OwnerState> {
    constructor(props: OwnerProps) {
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

    renderRole() {
        return (
            <span>
                <CrownOutlined /> owner
            </span>
        );
    }

    renderAvatar() {
        if (this.props.showAvatar) {
            return (
                <div className="Owner-avatarCol">
                    <Avatar user={this.props.user} size={this.props.avatarSize || 30} />
                </div>
            );
        }
    }

    renderCompact() {
        const tooltip = (
            <div>
                <div>
                    {this.props.user.realname}
                </div>
                <div>
                    <span><Avatar user={this.props.user} size={20} /></span>
                    {' '}
                    <span>{this.props.user.username}</span>
                </div>
            </div>
        );
        return (
            <div className="Owner-owner" >

                {this.renderAvatar()}

                <div className="Owner-infoCol">
                    <div className="Owner-name">
                        <Tooltip
                            placement="bottomRight"
                            title={tooltip}>
                            <a href={"/#people/" + this.props.user.username}
                                target="_blank"
                                rel="noopener noreferrer">{this.props.user.realname}</a>
                        </Tooltip>

                    </div>
                    {/* <div className="Owner-username">
                        {this.props.user.username}
                    </div> */}
                </div>
            </div>
        );
    }

    renderNormal() {
        return (
            <div className="Owner View-NORMAL" >
                <div className="Owner-controlCol">
                    <Button
                        type="link"
                        size="small"
                        onClick={this.onToggleView.bind(this)}
                    >
                        {this.state.view === View.NORMAL ? <UpOutlined /> : <DownOutlined />}
                    </Button>
                </div>
                <div className="Owner-avatarCol">
                    <Avatar user={this.props.user} size={this.props.avatarSize || 30} />
                </div>
                <div className="Owner-infoCol">
                    <div className="Owner-name">
                        <a href={"/#people/" + this.props.user.username} target="_blank" rel="noopener noreferrer">{this.props.user.realname}</a>
                    </div>
                    <div className="Owner-username">
                        {this.props.user.username}
                    </div>
                    <div className="Owner-title">
                        {this.props.user.title || <i>no title in user profile</i>}
                    </div>
                    <div className="Owner-organization">
                        {this.props.user.organization || <i>no organization in user profile</i>}
                    </div>
                    <div className="Owner-location">
                        {[this.props.user.city, this.props.user.state, this.props.user.country].filter(x => x).join(', ') || <i>no location information in user profile</i>}
                    </div>
                </div>

            </div>
        );
    }

    render() {
        return this.renderCompact();
        // switch (this.state.view) {
        //     case View.COMPACT:
        //         return this.renderCompact()

        //     case View.NORMAL:
        //         return this.renderNormal()
        // }
    }
}

