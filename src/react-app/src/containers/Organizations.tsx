import Organizations from '../components/Organizations';
import {StoreState, OrganizationsProps} from '../types';
import {connect} from 'react-redux';

export function mapStateToProps(state: StoreState): OrganizationsProps {
    const {organizations} = state;
    return {
        organizations
    }
}

export default connect(mapStateToProps)(Organizations);