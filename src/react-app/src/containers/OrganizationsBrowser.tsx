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
    sortDescending: boolean,
    filter: string
}

export interface LinkDispatchProps {
    onSearchOrgs: (searchTerms: Array<string>) => void,
    onSortOrgs: (sortBy: string, sortDescending: boolean) => void,
    onFilterOrgs: (filter: string) => void
}


// note second arg is the component props, but we don't have any component props to merge in.
export function mapStateToProps({totalCount, filteredCount, sortBy, sortDescending, filter}: StoreState): LinkStateProps {
    return {
        totalCount, 
        filteredCount,
        sortBy,
        sortDescending,
        filter
    }
}

// note second arg is the component props, but we don't have any to merge in.
export function mapDispatchToProps(dispatch: Dispatch<actions.SearchOrgs | actions.SortOrgs | actions.FilterOrgs>) : LinkDispatchProps {
    return {
        onSearchOrgs: (searchTerms) => {
            dispatch(actions.searchOrgs(searchTerms))
        },
        onSortOrgs: (sortBy, sortDescending) => {
            dispatch(actions.sortOrgs(sortBy, sortDescending))
        },
        onFilterOrgs: (filter) => {
            dispatch(actions.filterOrgs(filter))
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