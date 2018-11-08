import * as React from 'react';
import './Organizations.css';
import * as types from '../types';
import { NavLink } from 'react-router-dom';

// TODO: need more ergonomic way to resolve the common issue of data types interfering with 
// component types.
// import * as types from '../types';



class Organizations extends React.Component<types.OrganizationsProps, types.OrganizationsState> {

    constructor(props: types.OrganizationsProps) {
        super(props)

        this.state = {
            searchTerms: []
        }
    }

    // <table className="Organizations-info-table">
    //                     <tbody>
    //                         {/* <tr>
    //                             <th>established</th>
    //                             <td>{Intl.DateTimeFormat('en-US').format(org.createdAt)}</td>
    //                         </tr> */}
    //                         <tr>
    //                             <th>owner</th>
    //                             <td><a href="#people/{org.owner.username}" target="_blank">{org.owner.realname} ❨{org.owner.username}❩</a></td>
    //                         </tr>
    //                         {/* <tr>
    //                             <th>last updated</th>
    //                             <td>{Intl.DateTimeFormat('en-US').format(org.modifiedAt)}</td>
    //                         </tr> */}
    //                     </tbody>
    //                 </table>

    renderOrg(org: types.BriefOrganization, index: Number) {
        return (
            <div className="row" key={String(index)}>
                <div className="col1">
                    <div className="orgName">
                        <NavLink to={`/viewOrganization/${org.id}`}>{org.name}</NavLink>
                    </div>
                    <div className="orgOwner">
                        <span className="field-label">owner</span>
                        <a href="#people/{org.owner.username}" target="_blank">{org.owner.realname} ❨{org.owner.username}❩</a>
                    </div>
                </div>
                <div className="col2">

                </div>
            </div>
        )
    }

    renderOrgs() {
        if (this.props.organizations.length > 0) {
            return (
                this.props.organizations.map((org: types.BriefOrganization, index) => {
                    return (
                        this.renderOrg(org, index)
                    )
                })
            )
        } else {
            return (
                <div>Sorry, no orgs</div>
            )
        }
    }

    render() {
        return (
            <div className="Organizations">
                {this.renderOrgs()}
            </div>
        )
    }
}

export default Organizations;