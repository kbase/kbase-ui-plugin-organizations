// The loader component

import * as React from 'react'
import * as orgModel from '../../../data/models/organization/model'
import Organization from './component'
import InaccessibleOrganization from './Inaccessible'

interface LoaderProps {
    organizationId: orgModel.OrganizationID
    organization: orgModel.Organization | orgModel.InaccessiblePrivateOrganization | null
    onLoad: (organizationId: orgModel.OrganizationID) => void
}

interface LoaderState { }

class Loader extends React.Component<LoaderProps, LoaderState> {
    constructor(props: LoaderProps) {
        super(props)
    }

    render() {
        if (this.props.organization) {
            switch (this.props.organization.kind) {
                case orgModel.OrganizationKind.NORMAL:
                    return (
                        <Organization organization={this.props.organization} />
                    )
                case orgModel.OrganizationKind.INACCESSIBLE_PRIVATE:
                    return (
                        <InaccessibleOrganization organization={this.props.organization} />
                    )
                default:
                    return (
                        <div>
                            Error: unrecognized org kind
                        </div>
                    )
            }
        } else {
            return (
                <div>
                    <Icon type="loading" />
                </div>
            )
        }
    }

    componentDidMount() {
        if (!this.props.organization) {
            this.props.onLoad(this.props.organizationId)
        }
    }
}

// The loader redux adapter

import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { StoreState } from '../../../types'
import * as actions from '../../../redux/actions/entities/organization'
import { Icon } from 'antd';

export interface OwnProps {
    organizationId: orgModel.OrganizationID
}

interface StateProps {
    organization: orgModel.Organization | orgModel.InaccessiblePrivateOrganization | null
}

interface DispatchProps {
    onLoad: (organizationId: orgModel.OrganizationID) => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        organization: state.entities.organizations.byId.get(props.organizationId) || null
    }
}

function mapDispatchToProps(dispatch: Dispatch<actions.OrganizationEntityAction>): DispatchProps {
    return {
        onLoad: (organizationId: orgModel.OrganizationID) => {
            dispatch(actions.load(organizationId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Loader)