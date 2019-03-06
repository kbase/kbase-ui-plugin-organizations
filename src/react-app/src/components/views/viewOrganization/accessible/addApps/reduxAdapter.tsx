import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { SelectableApp, StoreState, ViewOrgViewModelKind } from '../../../../../types'
import * as actions from '../../../../../redux/actions/viewOrganization/addApps'
import Component from './component'

export interface OwnProps {
    onFinish: () => void
}

interface StateProps {
    apps: Array<SelectableApp>
    selectedApp: SelectableApp | null
}

interface DispatchProps {
    // onSearchUsers: (query: userModel.UserQuery) => void
    // onSelectUser: (username: string) => void
    // onSendInvitation: () => void
    onSelectApp: (appId: string) => void
    onRequestAssociation: (appId: string) => void
    onSearch: (searchBy: string) => void
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const viewModel = state.views.viewOrgView.viewModel
    if (!viewModel) {
        throw new Error('argh, view model missing')
    }
    if (viewModel.kind !== ViewOrgViewModelKind.NORMAL) {
        throw new Error("argh, wrong org kind")
    }
    if (viewModel.subViews.addAppsView.viewModel === null) {
        throw new Error("argh, null subview view model")
    }

    const vm = viewModel.subViews.addAppsView.viewModel
    return {
        apps: vm.apps,
        selectedApp: vm.selectedApp
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Load>): DispatchProps {
    return {
        // onSearchUsers: ({ query, excludedUsers }) => {
        //     dispatch(actions.inviteUserSearchUsers({ query, excludedUsers }) as any)
        // },
        // onSelectUser: (username: string) => {
        //     dispatch(actions.selectUser(username) as any)
        // },
        // onSendInvitation: () => {
        //     dispatch(actions.sendInvitation() as any)
        // }
        onSelectApp: (appId: string) => {
            dispatch(actions.select(appId) as any)
        },
        onRequestAssociation: (appId: string) => {
            dispatch(actions.requestAssociation(appId) as any)
        },
        onSearch: (searchBy: string) => {
            dispatch(actions.search(searchBy) as any)
        }
    }
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Component)