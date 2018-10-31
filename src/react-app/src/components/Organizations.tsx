import * as React from 'react';
import './Organizations.css';
import * as types from '../types';
import {NavLink} from 'react-router-dom';

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

    renderOrg(org: types.Organization, index: Number) {
        return (
            <div className="row" key={String(index)}>
                <div className="col1"> 
                    <div className="orgName">
                        <NavLink to={`/viewOrganization/${org.id}`}>{org.name}</NavLink>
                    </div>
                </div>
                <div className="col2">
                    <table className="Organizations-table">
                        <tbody>
                            <tr>
                                <th>established</th>
                                <td>{Intl.DateTimeFormat('en-US').format(org.createdAt)}</td>
                            </tr>
                            <tr>
                                <th>owner</th>
                                <td>{org.owner}</td>
                            </tr>
                            <tr>
                                <th>last updated</th>
                                <td>{Intl.DateTimeFormat('en-US').format(org.modifiedAt)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="Organizations">
                {
                    this.props.organizations.map((org: types.Organization, index) => { 
                        return (
                            this.renderOrg(org, index)
                        )
                    })
                }
            </div>
        )
    }
}

export default Organizations;