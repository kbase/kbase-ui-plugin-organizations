import {Dispatch} from 'redux';
import {connect} from 'react-redux';

import * as types from '../types';
import * as actions from '../redux/actions';

import NewOrganization from '../components/NewOrganization';

export interface LinkStateProps {
    
}

export interface LinkDispatchProps {
    onAddOrg: (newOrg: types.NewOrganization) => void
}

export function mapStateToProps({}: types.StoreState): LinkStateProps {
    return {}
}

export function mapDispatchToProps(dispatch: Dispatch<actions.AddOrg>): LinkDispatchProps {
    return {
        onAddOrg: (newOrg) => {
            dispatch(actions.addOrg(newOrg))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewOrganization)

