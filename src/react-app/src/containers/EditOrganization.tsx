import {Dispatch} from 'redux'
import {connect} from 'react-redux'

import * as types from '../types'
import * as actions from '../redux/actions'

import EditOrganization from '../components/EditOrganization'

interface LinkStateProps {
    organization: types.Organization
}

interface OwnProps {
    id: string
}

interface LinkDispatchProps {
    onUpdateOrg: (modifiedOrg: types.OrganizationUpdate) => void
}

function mapStateToProps({organizations}: types.StoreState, {id}: OwnProps): LinkStateProps {
    // TODO: of course this really needs to be an async fetch of the org info!
    const org = organizations.filter((org) => org.id === id)[0]
    return {
        organization: org
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.UpdateOrg>): LinkDispatchProps {
    return {    
        onUpdateOrg: (modifiedOrg) => {
            dispatch(actions.updateOrg(modifiedOrg))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOrganization)