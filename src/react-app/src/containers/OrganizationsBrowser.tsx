import OrganizationsBrowser from '../components/OrganizationsBrowser';
import {StoreState} from '../types';
import * as actions from '../redux/actions'
import {Dispatch} from 'redux';
import {connect} from 'react-redux';


//
// Typing for the mapState and mapDispatch
//
export interface LinkStateProps {
    totalCount: number,
    filteredCount: number
    sortBy: string,
    sortDescending: boolean
}

export interface LinkDispatchProps {
    onSearchOrgs: (searchTerms: Array<string>) => void,
    onSortOrgs: (sortBy: string, sortDescending: boolean) => void
}


// note second arg is the component props, but we don't have any component props to merge in.
export function mapStateToProps({totalCount, filteredCount, sortBy, sortDescending}: StoreState): LinkStateProps {
    return {
        totalCount, 
        filteredCount,
        sortBy,
        sortDescending
    }
}

// note second arg is the component props, but we don't have any to merge in.
export function mapDispatchToProps(dispatch: Dispatch<actions.SearchOrgs | actions.SortOrgs>) : LinkDispatchProps {
    return {
        onSearchOrgs: (searchTerms) => {
            dispatch(actions.searchOrgs(searchTerms))
        },
        onSortOrgs: (sortBy, sortDescending) => {
            dispatch(actions.sortOrgs(sortBy, sortDescending))
        }
    }
}

// export function mapDispatchToProps(dispatch: Dispatch<any>) : LinkDispatchProps {
//     return {
//         onSearchOrgs: (searchTerms) => {
//             dispatch(actions.searchOrgs(searchTerms))
//         },
//         onSortOrgs: (sortBy, sortDescending) => {
//             dispatch(actions.sortOrgs(sortBy, sortDescending))
//         }
//     }
// }


export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsBrowser)