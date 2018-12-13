import { Organizations, OrganizationsProps } from './component';
import { StoreState } from '../../types';
import { connect } from 'react-redux';

export function mapStateToProps(state: StoreState): OrganizationsProps {
    // TODO: wow, should not do this here
    if (state.views.browseOrgsView.viewModel === null) {
        throw new Error('view not ready')
    }
    const {
        views: {
            browseOrgsView: {
                viewModel: { organizations }
            }
        }
    } = state;
    return {
        organizations
    }
}

export default connect(mapStateToProps)(Organizations);