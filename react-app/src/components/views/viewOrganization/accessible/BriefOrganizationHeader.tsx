import { BellFilled, BulbOutlined, CrownOutlined, FileOutlined, GlobalOutlined, HomeOutlined, LinkOutlined, MailFilled, RobotOutlined, SaveOutlined, StopOutlined, TeamOutlined, UnlockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal, Tooltip } from 'antd';
import { Component, Fragment } from 'react';
import * as orgModel from '../../../../data/models/organization/model';
import { ComponentView } from '../../../../redux/store/types';
import Owner from '../../../entities/OwnerContainer';
import Linker from '../../../Linker';
import NiceElapsedTime from '../../../NiceElapsedTime';
import OrgLogo from '../../../OrgLogo';
import './BriefOrganizationHeader.css';

export interface BriefOrganizationProps {
    organization: orgModel.BriefOrganization;
    openRequestsStatus: orgModel.RequestStatus | null;
    orgMenu: JSX.Element;
    onNavigateToBrowser: () => void;
}

interface BriefOrganizationState {
    view: ComponentView;
}

function reverseView(v: ComponentView) {
    switch (v) {
        case ComponentView.COMPACT:
            return ComponentView.NORMAL;
        case ComponentView.NORMAL:
            return ComponentView.COMPACT;
    }
}

export default class BriefOrganization extends Component<BriefOrganizationProps, BriefOrganizationState> {
    constructor(props: BriefOrganizationProps) {
        super(props);
        this.state = {
            view: ComponentView.COMPACT
        };
    }

    onToggleView() {
        this.setState({
            view: reverseView(this.state.view)
        });
    }

    renderLogo(org: orgModel.BriefOrganization) {
        return (
            <OrgLogo logoUrl={org.logoUrl} size={80} organizationName={org.name} organizationId={org.id} />
        );
    }

    renderHomeUrl(org: orgModel.BriefOrganization) {
        if (!org.homeUrl) {
            return (
                <Tooltip
                    placement="bottomRight"
                    title="This organization has not set a home page url"
                >
                    <HomeOutlined style={{ color: 'rgba(200, 200, 200, 0.3)' }} />
                </Tooltip>
            );
        }
        const tooltip = (
            <Fragment>
                <p>
                    Home page for this Organization (external to KBase)
                </p>
            </Fragment>
        );
        return (
            <div className="BriefOrganizationHeader-homeUrl">
                <Tooltip
                    placement="bottomRight"
                    mouseEnterDelay={0.5}
                    title={tooltip}
                >
                    <a href={org.homeUrl} target="_blank" rel="noopener noreferrer">
                        <HomeOutlined />
                    </a>
                </Tooltip>
            </div >
        );
    }

    renderNarrativeCount(org: orgModel.BriefOrganization) {
        if (!org.narrativeCount) {
            return (
                <span style={{ color: 'gray' }}>
                    Ø
                </span>
            );
        }
        return (
            <span>
                {org.narrativeCount}
            </span>
        );
    }

    renderAppCount(org: orgModel.BriefOrganization) {
        if (!org.appCount) {
            return (
                <span style={{ color: 'gray' }}>
                    Ø
                </span>
            );
        }
        return (
            <span>
                {org.appCount}
            </span>
        );
    }

    renderMemberCount(org: orgModel.BriefOrganization) {
        if (org.memberCount === 1) {
            return (
                <span style={{ color: 'gray' }}>
                    Ø
                </span>
            );
        }
        return (
            <span>
                {org.memberCount - 1}
            </span>
        );
    }

    renderRelation(org: orgModel.BriefOrganization) {
        switch (org.relation) {
            case (orgModel.UserRelationToOrganization.NONE):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You are not a member of this org; you may request membership"
                    >
                        <span>
                            <StopOutlined />
                        </span>
                    </Tooltip>
                );
            case (orgModel.UserRelationToOrganization.VIEW):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You are not a member of this org; you may request membership"
                    >
                        <StopOutlined />
                    </Tooltip>
                );
            case (orgModel.UserRelationToOrganization.MEMBER_REQUEST_PENDING):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="Your membership request is pending"
                    >
                        <span><UserOutlined style={{ color: 'orange' }} /> Your membership <b>request</b> is pending</span>
                    </Tooltip>
                );

            case (orgModel.UserRelationToOrganization.MEMBER_INVITATION_PENDING):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You have been invited to join this organization"
                    >
                        <UserOutlined style={{ color: 'blue' }} />
                    </Tooltip>
                );
            case (orgModel.UserRelationToOrganization.MEMBER):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You are a member of this organization"
                    >
                        <UserOutlined />
                    </Tooltip>
                );
            case (orgModel.UserRelationToOrganization.ADMIN):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You are an administrator of this organization"
                    >
                        <RobotOutlined />
                    </Tooltip>
                );
            case (orgModel.UserRelationToOrganization.OWNER):
                return (
                    <Tooltip
                        placement="bottomRight"
                        mouseEnterDelay={0.5}
                        title="You are the owner of this organization"
                    >
                        <CrownOutlined />
                    </Tooltip>
                );
        }
    }

    renderPrivacy() {
        const org = this.props.organization;
        if (org.isPrivate) {
            return (
                <Tooltip
                    placement="bottomRight"
                    mouseEnterDelay={0.5}
                    title="This organization is private - may only be viewed by members">
                    <span>
                        <UnlockOutlined />
                    </span>
                </Tooltip>
            );
        } else {
            return (
                <Tooltip
                    placement="bottomRight"
                    mouseEnterDelay={0.5}
                    title="This organization is public - may be viewed by any KBase user">
                    <span>
                        <GlobalOutlined />
                    </span>
                </Tooltip>
            );
        }
    }

    renderOrgFreshness(org: orgModel.BriefOrganization) {
        const isNew = org.lastVisitedAt && (org.modifiedAt.getTime() > org.lastVisitedAt.getTime());
        let newAlert;
        if (isNew) {
            const title = 'This org has changed since your last visit to it; new or updated items are highlighted';
            newAlert = (
                <div>
                    <Tooltip placement="topRight" title={title}>
                        <span style={{ color: 'red', fontSize: '120%' }}>
                            {/* ● */}
                            <BellFilled />
                        </span>
                    </Tooltip>
                </div>
            );
        } else {
            newAlert = (
                <div>
                    <span style={{ color: 'transparent', fontSize: '120%' }}>
                        <BellFilled />
                    </span>
                </div>
            );
        }

        const hasRequests = false;

        let requestsAlert;
        if (hasRequests) {
            requestsAlert = (
                <div>
                    <BulbOutlined style={{ color: "blue" }} />
                </div>
            );
        } else {
            requestsAlert = null;
        }

        return (
            <div>
                {newAlert}
                {requestsAlert}
            </div>
        );
    }

    renderRequests() {
        if (!(this.props.organization.relation === orgModel.UserRelationToOrganization.ADMIN ||
            this.props.organization.relation === orgModel.UserRelationToOrganization.OWNER)) {
            return;
        }
        let message;
        let iconColor;
        switch (this.props.openRequestsStatus) {
            case orgModel.RequestStatus.NONE:
                // case null:
                message = 'There are no open requests for this organization';
                iconColor = 'rgba(200, 200, 200, 0.3)';
                break;
            case orgModel.RequestStatus.NEW:
                message = 'There are new requests since you last visited this organization';
                iconColor = 'red';
                break;
            case orgModel.RequestStatus.OLD:
                message = 'There are open requests for this organization';
                iconColor = 'blue';
                break;
            case orgModel.RequestStatus.INAPPLICABLE:
                return;
            default:
                console.warn('Invalid open request status: ' + this.props.openRequestsStatus);
                return;
        }
        const title = (
            <span>
                {message}
            </span>
        );
        return (
            <Tooltip
                placement="topRight"
                title={title}>
                <span style={{ color: iconColor, fontSize: '80%' }}>
                    <MailFilled />
                </span>
            </Tooltip>
        );
    }

    renderPermalink() {
        const permalink = (
            <div>
                <p>
                    Below is the "permalink" for this organization. You may copy
                    this url and use it to access this organization in a web browser.
                </p>
                <p style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {window.location.origin}/#org/{this.props.organization.id}
                </p>
            </div>
        );
        const menuClick = () => {
            Modal.info({
                title: 'Org Permalink',
                content: permalink
            });
        };
        const menu = (
            <Menu
                onClick={menuClick}
            >
                <Menu.Item key="view">
                    View Permalink
                </Menu.Item>
            </Menu>
        );
        return (
            <Dropdown
                overlay={menu}
                trigger={['click', 'contextMenu']}>
                <a href={"/#orgs/" + this.props.organization.id}>
                    <LinkOutlined />
                </a>
            </Dropdown>
        );
    }

    renderLogoColumn(org: orgModel.BriefOrganization) {
        return (
            <Fragment>
                <div className="BriefOrganizationHeader-logoRow">
                    <Linker to={`/orgs/${org.id}`}>
                        {this.renderLogo(org)}
                    </Linker>
                </div>
                <div className="BriefOrganizationHeader-statusRow">
                    <div className="BriefOrganizationHeader-relationCol">
                        {this.renderRelation(org)}
                    </div>
                    <div className="BriefOrganizationHeader-privacyCol">
                        {this.renderPrivacy()}
                    </div>

                    <div className="BriefOrganizationHeader-homeLinkCol">
                        {this.renderHomeUrl(org)}
                    </div>
                </div>
                <div className="BriefOrganizationHeader-freshnessRow">
                    <div className="BriefOrganizationHeader-orgFreshnessCol">
                        {this.renderOrgFreshness(org)}
                    </div>
                    <div className="BriefOrganizationHeader-openRequestsCol">
                        {this.renderRequests()}
                    </div>
                    <div className="BriefOrganizationHeader-openNewRequestsCol">
                        {this.renderPermalink()}
                    </div>
                </div>
            </Fragment>
        );
    }

    fullTimestamp(d: Date) {
        return Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short'
        }).format(d);
    }

    renderInfoCol(org: orgModel.BriefOrganization) {
        // const lastUpdatedTooltip = (
        //     <span>
        //         This organization was last updated
        //         {' '}
        //         <NiceElapsedTime time={org.modifiedAt} showTooltip={true} />
        //     </span>
        // )
        return (
            <Fragment>
                <div className="BriefOrganizationHeader-orgName BriefOrganizationHeader-infoTableRow">
                    <Linker to={`/orgs/${org.id}`}>
                        {org.name}
                    </Linker>
                </div>

                <div className="BriefOrganizationHeader-researchInterests BriefOrganizationHeader-infoTableRow">
                    {org.researchInterests}
                </div>

                <div className="BriefOrganizationHeader-orgOwner BriefOrganizationHeader-infoTableRow">
                    <div className="BriefOrganizationHeader-infoTableCol1">
                        <span className="field-label BriefOrganizationHeader-fieldLabel">owner</span>
                    </div>
                    <div className="BriefOrganizationHeader-infoTableCol2">
                        {/* TODO: render as Member or Owner component */}
                        <Owner username={org.owner.username} avatarSize={16} showAvatar={false} />
                    </div>
                </div>
                <div className="BriefOrganizationHeader-orgCreated BriefOrganizationHeader-infoTableRow">
                    <div className="BriefOrganizationHeader-infoTableCol1">
                        <span className="field-label BriefOrganizationHeader-fieldLabel">created</span>
                    </div>
                    <div className="BriefOrganizationHeader-infoTableCol2">
                        {/* {niceElapsed(org.createdAt, 30)} */}
                        <Tooltip
                            placement="bottomRight"
                            mouseEnterDelay={0.5}
                            title={this.fullTimestamp(org.createdAt)}>
                            <span>
                                {Intl.DateTimeFormat('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                }).format(org.createdAt)}
                            </span>
                        </Tooltip>
                    </div>
                </div>

                <div className="BriefOrganizationHeader-orgOwner BriefOrganizationHeader-infoTableRow">
                    <div className="BriefOrganizationHeader-infoTableCol1">
                        <span className="field-label">updated</span>
                    </div>
                    <div className="BriefOrganizationHeader-infoTableCol2">
                        <NiceElapsedTime time={org.modifiedAt} tooltipPrefix="This organization was last updated " />
                    </div>
                </div>
            </Fragment >
        );
    }

    renderMemberRow(org: orgModel.BriefOrganization) {
        const memberCount = org.memberCount - 1;
        let memberCountTooltip;
        if (memberCount) {
            if (memberCount === 1) {
                memberCountTooltip = (
                    <span>
                        There is <b>1</b> member in this organization
                    </span>
                );
            } else {
                memberCountTooltip = (
                    <span>
                        There are <b>{memberCount}</b> members in this organization
                    </span>
                );
            }
        } else {
            memberCountTooltip = (
                <span>
                    There are <b>no members</b> in this organization
                </span>
            );
        }
        return (
            <Tooltip placement="bottomRight" title={memberCountTooltip}>
                <div className="BriefOrganizationHeader-orgCreated BriefOrganizationHeader-infoTableRow">
                    <div className="BriefOrganizationHeader-infoTableCol1">
                        <span className="field-label"><TeamOutlined /></span>
                    </div>
                    <div className="BriefOrganizationHeader-infoTableCol2">
                        {this.renderMemberCount(org)}
                    </div>
                </div>
            </Tooltip>
        );
    }

    renderNarrativeRow(org: orgModel.BriefOrganization) {
        const count = org.narrativeCount;
        let tooltip;
        if (count) {
            if (count === 1) {
                tooltip = (
                    <span>
                        There is <b>1</b> narrative in this organization
                    </span>
                );
            } else {
                tooltip = (
                    <span>
                        There are <b>{count}</b> narratives in this organization
                    </span>
                );
            }
        } else {
            tooltip = (
                <span>
                    There are <b>no narratives</b> in this organization
                </span>
            );
        }
        return (
            <Tooltip placement="bottomRight" title={tooltip}>
                <div className="BriefOrganizationHeader-orgCreated BriefOrganizationHeader-infoTableRow">
                    <div className="BriefOrganizationHeader-infoTableCol1">
                        <span className="field-label"><FileOutlined /></span>
                    </div>
                    <div className="BriefOrganizationHeader-infoTableCol2">
                        {this.renderNarrativeCount(org)}
                    </div>
                </div>
            </Tooltip>
        );
    }

    renderAppsRow(org: orgModel.BriefOrganization) {
        const count = org.appCount;
        let tooltip;
        if (count) {
            if (count === 1) {
                tooltip = (
                    <span>
                        There is <b>1</b> app in this organization
                    </span>
                );
            } else {
                tooltip = (
                    <span>
                        There are <b>{count}</b> apps in this organization
                    </span>
                );
            }
        } else {
            tooltip = (
                <span>
                    There are <b>no apps</b> in this organization
                </span>
            );
        }
        return (
            <Tooltip placement="bottomRight" title={tooltip}>
                <div className="BriefOrganizationHeader-orgCreated BriefOrganizationHeader-infoTableRow">
                    <div className="BriefOrganizationHeader-infoTableCol1">
                        <span className="field-label"><FileOutlined /></span>
                    </div>
                    <div className="BriefOrganizationHeader-infoTableCol2">
                        {this.renderAppCount(org)}
                    </div>
                </div>
            </Tooltip>
        );
    }

    renderModifiedRow(org: orgModel.BriefOrganization) {
        const tooltip = (
            <span>
                This organization was last updated
                {' '}
                <NiceElapsedTime time={org.modifiedAt} showTooltip={false} />
            </span>
        );
        return (
            <Tooltip placement="bottomRight" title={tooltip}>
                <div className="BriefOrganizationHeader-orgCreated BriefOrganizationHeader-infoTableRow">
                    <div className="BriefOrganizationHeader-infoTableCol1">
                        <span className="field-label"><SaveOutlined /></span>
                    </div>
                    <div className="BriefOrganizationHeader-infoTableCol2">
                        <NiceElapsedTime time={org.modifiedAt} showTooltip={false} />
                    </div>
                </div>
            </Tooltip>
        );
    }

    renderButtonsRow() {
        return (
            <div className="ButtonSet">
                <div className="ButtonSet-button">
                    {this.props.orgMenu}
                </div>
            </div>
        );
    }

    renderBackButton() {
        return (
            <Button
                danger
                ghost={true}
                onClick={this.props.onNavigateToBrowser}>
                back
            </Button>
        );
    }

    renderStatsCol(org: orgModel.BriefOrganization) {
        return (
            <div className="BriefOrganizationHeader-buttonsCol">
                <div className="BriefOrganizationHeader-buttonsRow" style={{ marginBottom: '10px' }}>
                    <div className="ButtonSet">
                        {this.renderBackButton()}
                    </div>
                </div>
                <div className="BriefOrganizationHeader-buttonsRow">
                    {this.renderButtonsRow()}
                </div>
            </div>
        );
    }

    renderNormal() {
        const org = this.props.organization;
        return (
            <div className="BriefOrganization">
                <div className="BriefOrganizationHeader-body">
                    <div className="BriefOrganizationHeader-logoCol">
                        {this.renderLogoColumn(org)}
                    </div>
                    <div className="BriefOrganizationHeader-infoCol">

                        <div className="BriefOrganizationHeader-infoCol-row">
                            <div className="BriefOrganizationHeader-infoCol-col1">
                                {this.renderInfoCol(org)}
                            </div>
                            <div className="BriefOrganizationHeader-infoCol-col2">
                                {this.renderStatsCol(org)}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    render() {
        return this.renderNormal();
    }
}
