import OrganizationsBrowser from '../components/OrganizationsBrowser'
import { StoreState, SortDirection } from '../types'
import * as actions from '../redux/actions/searchOrgs'
import { Dispatch } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { connect } from 'react-redux'
import { Model, Query } from '../data/model'
//
// Typing for the mapState and mapDispatch
//
export interface LinkStateProps {
    totalCount: number,
    filteredCount: number
    sortBy: string,
    sortDirection: SortDirection,
    filter: string,
    searching: boolean
}

export interface LinkDispatchProps {
    onSearchOrgs: (searchTerms: Array<string>) => void,
    onSortOrgs: (sortBy: string, sortDirection: SortDirection) => void,
    onFilterOrgs: (filter: string) => void
}


// note second arg is the component props, but we don't have any component props to merge in.
export function mapStateToProps(state: StoreState): LinkStateProps {
    const { browseOrgs: { totalCount, filteredCount, sortBy, sortDirection, filter, searching } } = state
    return {
        totalCount,
        filteredCount,
        sortBy,
        sortDirection,
        filter,
        searching
    }
}

// function onSortOrgs(sortBy: string, sortDescending: boolean) : Dispatch<actions.SortOrgs> {
//     dispatch(actions.sortOrgs(sortBy, sortDescending))
// }

// note second arg is the component props, but we don't have any to merge in.
// export function mapDispatchToProps(dispatch: actions.SearchOrgs | Dispatch<actions.SortOrgs> | Dispatch<actions.FilterOrgs>) : LinkDispatchProps {
//     return {
//         onSearchOrgs: (searchTerms) => {

//             dispatch(actions.searchOrgs(searchTerms))



//         },
//         onSortOrgs: (sortBy, sortDescending) => {
//             dispatch(actions.sortOrgs(sortBy, sortDescending))
//         },
//         onFilterOrgs: (filter) => {
//             dispatch(actions.filterOrgs(filter))
//         }
//     }
// }

export function mapDispatchToProps(dispatch: Dispatch<actions.SearchOrgs | actions.SortOrgs | actions.FilterOrgs>): LinkDispatchProps {
    return {
        onSearchOrgs: (searchTerms: Array<string>) => {
            // TODO proper typing here
            dispatch(actions.searchOrgs(searchTerms) as any)
        },
        onSortOrgs: (sortBy: string, sortDirection: SortDirection) => {
            // TODO proper typing here
            dispatch(actions.sortOrgs(sortBy, sortDirection) as any)
        },
        onFilterOrgs: (filter: string) => {
            dispatch(actions.filterOrgs(filter) as any)
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