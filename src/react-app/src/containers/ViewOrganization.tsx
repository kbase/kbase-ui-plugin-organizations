import {Dispatch} from 'redux'
import {connect} from 'react-redux'

import * as types from '../types'
import * as actions from '../redux/actions'

import ViewOrganization from '../components/ViewOrganization'

interface LinkStateProps {
    organization: types.Organization
}

interface OwnProps {
    id: string
}

interface LinkDispatchProps {

}

function mapStateToProps({organizations}: types.StoreState, {id}: OwnProps): LinkStateProps {
    // TODO: of course this really needs to be an async fetch of the org info!
    const org = organizations.filter((org) => org.id === id)[0]
    return {
        organization: org
    }
}

// export function mapDispatchToProps(dispatch: Dispatch<actions.SaveOrg>): LinkDispatchProps {
//     return {    
//         onSaveOrg: (modifiedOrg) => {
//             dispatch(actions.saveOrg(modifiedOrg))
//         }
//     }
// }

export default connect(mapStateToProps, null)(ViewOrganization)