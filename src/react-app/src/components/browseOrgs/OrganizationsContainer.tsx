import { Organizations, OrganizationsProps } from './Organizations';
import { StoreState } from '../../types';
import { connect } from 'react-redux';

export function mapStateToProps(state: StoreState): OrganizationsProps {
    // TODO: wow, should not do this here
    if (state.browseOrgs.view === null) {
        throw new Error('view not ready')
    }
    const { browseOrgs: {
        view: { organizations } } } = state;
    return {
        organizations
    }
}

export default connect(mapStateToProps)(Organizations);