import OrganizationsBrowser from './OrganizationsBrowser'
import { StoreState, SortDirection, BrowseOrgsState, AppError } from '../../types'
import * as actions from '../../redux/actions/searchOrgs'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
//
// Typing for the mapState and mapDispatch
//
export interface LinkStateProps {
    totalCount: number,
    filteredCount: number
    sortBy: string,
    sortDirection: SortDirection,
    filter: string,
    searching: boolean,
    error: AppError | null
}

export interface LinkDispatchProps {
    onSearchOrgs: (searchTerms: Array<string>) => void,
    onSortOrgs: (sortBy: string, sortDirection: SortDirection) => void,
    onFilterOrgs: (filter: string) => void
}


// note second arg is the component props, but we don't have any component props to merge in.
export function mapStateToProps(storeState: StoreState): LinkStateProps {
    // TODO: more insanity we must find a way of working around
    if (storeState.browseOrgs.view) {
        const {
            browseOrgs: {
                state,
                error,
                view: { totalCount, filteredCount, sortBy, sortDirection, filter } } } = storeState
        return {
            totalCount,
            filteredCount,
            sortBy,
            sortDirection,
            filter,
            error,
            searching: (state === BrowseOrgsState.SEARCHING)
        }
    } else {
        return {
            totalCount: 0,
            filteredCount: 0,
            sortBy: '',
            sortDirection: SortDirection.ASCENDING,
            filter: '',
            error: null,
            searching: (storeState.browseOrgs.state === BrowseOrgsState.SEARCHING)
        }
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