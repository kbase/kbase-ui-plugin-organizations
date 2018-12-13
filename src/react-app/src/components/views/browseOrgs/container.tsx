import OrganizationsBrowser from './component'
import { StoreState, SortDirection, BrowseOrgsState, AppError } from '../../../types'
import * as actions from '../../../redux/actions/browseOrgs'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as orgModel from '../../../data/models/organization/model'
//
// Typing for the mapState and mapDispatch
//
export interface LinkStateProps {
    organizations: Array<orgModel.Organization>
    totalCount: number
    filteredCount: number
    sortBy: string
    sortDirection: SortDirection
    filter: string
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
    if (!storeState.views.browseOrgsView.viewModel) {
        throw new Error('No view model!')
    }

    const {
        views: {
            browseOrgsView: {
                viewModel: {
                    organizations, error, searchTerms, selectedOrganizationId,
                    totalCount, filteredCount, sortBy, sortDirection, filter, searching }
            }
        }
    } = storeState

    return {
        organizations,
        totalCount,
        filteredCount,
        sortBy,
        sortDirection,
        filter,
        error,
        searching: searching
    }

}

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

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsBrowser)