import { Organizations, OrganizationsProps } from '../components/Organizations';
import { StoreState } from '../types';
import { connect } from 'react-redux';

export function mapStateToProps(state: StoreState): OrganizationsProps {
    const { browseOrgs: { organizations } } = state;
    return {
        organizations
    }
}

export default connect(mapStateToProps)(Organizations);