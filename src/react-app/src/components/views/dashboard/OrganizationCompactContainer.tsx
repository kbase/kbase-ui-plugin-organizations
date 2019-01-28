import * as React from 'react'
import * as orgModel from '../../../data/models/organization/model'
import OrganizationCompact from './OrganizationCompact'

interface LoaderProps {
    organizationId: orgModel.OrganizationID
    organization: orgModel.Organization | orgModel.InaccessiblePrivateOrganization | undefined
    onLoad: (organizationId: orgModel.OrganizationID) => void
}

interface LoaderState {

}

class Loader extends React.Component<LoaderProps, LoaderState> {
    constructor(props: LoaderProps) {
        super(props)
    }

    render() {
        if (this.props.organization) {
            return (
                <OrganizationCompact organization={this.props.organization} />
            )
        } else {
            return (
                <div>
                    Loading org...
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

import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { StoreState } from '../../../types';
import * as actions from '../../../redux/actions/entities'


export interface OwnProps {
    organizationId: orgModel.OrganizationID
}

interface StateProps {
    organization: orgModel.Organization | orgModel.InaccessiblePrivateOrganization | undefined
}

interface DispatchProps {
    onLoad: (organizationId: orgModel.OrganizationID) => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    return {
        organization: state.entities.orgs.byId.get(props.organizationId)
    }
}

function mapDispatchToProps(dispatch: Dispatch<actions.EntityAction>): DispatchProps {
    return {
        onLoad: (organizationId: orgModel.OrganizationID) => {
            dispatch(actions.organizationLoader(organizationId) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Loader)