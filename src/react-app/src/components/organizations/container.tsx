import { Organizations, OrganizationsProps } from './component';
import { StoreState } from '../../types';
import { connect } from 'react-redux';
import { BriefOrganization } from '../../data/models/organization/model';

export function mapStateToProps(state: StoreState): OrganizationsProps {
    // TODO: wow, should not do this here
    if (state.views.browseOrgsView.viewModel === null) {
        throw new Error('view not ready')
    }
    const {
        db: {
            lastVisited: {
                byId: lastVisitedAtById
            }
        },
        views: {
            browseOrgsView: {
                viewModel: { organizations }
            }
        }
    } = state;

    // associate the last visited by id with the org.
    const updatedOrgs = organizations.map((org: BriefOrganization) => {
        const lastVisitedAt = lastVisitedAtById.get(org.id) || null
        if (lastVisitedAt && lastVisitedAt.lastVisitedAt) {
            return {
                organization: org,
                lastVisitedAt: lastVisitedAt.lastVisitedAt
            }
        } else {
            return {
                organization: org,
                lastVisitedAt: null
            }
        }
    })

    // console.log('last visited in orgs container...', updatedOrgs)


    return {
        organizations: updatedOrgs
    }
}

export default connect(mapStateToProps)(Organizations);