import * as React from 'react'
import marked from 'marked'
import {NavLink} from 'react-router-dom'

import './ViewOrganization.css'

import * as types from '../types'

export interface ViewOrganizationState {
}

class ViewOrganization extends React.Component<types.ViewOrganizationProps, ViewOrganizationState> {
    constructor(props: types.ViewOrganizationProps) {
        super(props)
    }

    renderOrg() {
        return <form className="table">
            <div className="row">
                <div className="col2">
                    <div className="name">
                        {this.props.organization.name}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col2">
                    <div className="id">
                        <span style={{color: 'gray'}}>https://narrative.kbase.us/organizations/</span>{this.props.organization.id}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col2">
                    <div className="description" 
                        dangerouslySetInnerHTML={({__html: marked(this.props.organization.description)})}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col2">
                    <NavLink to={`/editOrganization/${this.props.organization.id}`}>Edit</NavLink>
                </div>
            </div>
        </form>
    }

    renderInfo() {
        return <form className="table">
            <div className="row">
                <div className="col1">
                    created
                </div>
                <div className="col2">
                    <div className="createdAt">
                        {Intl.DateTimeFormat('en-US').format(this.props.organization.createdAt)}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col1">
                    owner
                </div>
                <div className="col2">
                    <div className="owner">
                        {this.props.organization.owner}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col1">
                    last updated
                </div>
                <div className="col2">
                    <div className="modifiedAt">
                        {Intl.DateTimeFormat('en-US').format(this.props.organization.modifiedAt)}
                    </div>
                </div>
            </div>
        </form>
    }

    render() {

        return (
            <div className="ViewOrganization">
                <div className="mainColumn">
                    <h3>Organization</h3>
                    {this.renderOrg()}
                </div>
                <div className="infoColumn">
                    <h3>Info</h3>
                    {this.renderInfo()}
                </div>
            </div>
        )

    }
}

export default ViewOrganization