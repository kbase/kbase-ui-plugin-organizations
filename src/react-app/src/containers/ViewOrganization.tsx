import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import * as types from '../types'
import * as actions from '../redux/actions/viewOrg'

import ViewOrganization from '../components/ViewOrganization'

// Props for this component

// The interface for this container component
export interface OwnProps {
    id: string
}

// the interface for mapStateTo props
interface StateProps {
    id: string,
    state: types.ViewOrgState
    organization?: types.Organization
    error?: types.AppError,
    username: string
}

// the interface for mapDispatchToProps
interface DispatchProps {
    onViewOrg: (id: string) => void
}

// hmm this bit would be for the interface for the wrapped component.
// can't really do that here, but _could_ export the interfaces above
// and compose them thus in the wrapped component. But the wrapped component
// should know nothing about this business
// type Props = StateProps & DispatchProps & OwnProps


function mapStateToProps({ viewOrg: { state, organization, error }, auth: { authorization: { username } } }: types.StoreState,
    { id }: OwnProps): StateProps {
    // TODO: of course this really needs to be an async fetch of the org info!
    return {
        id, state, organization, error, username
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.ViewOrgFetch>): DispatchProps {
    return {
        onViewOrg: (id: string) => {
            dispatch(actions.viewOrgFetch(id) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, types.StoreState>(mapStateToProps, mapDispatchToProps)(ViewOrganization)

// export default connect(mapStateToProps, mapDispatchToProps)(ViewOrganization) 

