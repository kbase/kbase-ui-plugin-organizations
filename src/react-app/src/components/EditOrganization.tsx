import * as React from 'react'
import {Redirect} from 'react-router-dom';
import marked from 'marked';

import * as types from '../types';

import './EditOrganization.css'



// export class PendingOrganization {
//     id: string | null;
//     name: string | null;
//     description: string | null;

//     constructor() {
//         this.id = null;
//         this.name = null;
//         this.description = null;
//     }
// }

export interface EditedOrganization {
    id: string,
    name: string,
    description: string
}

export interface EditOrganizationState {
    canceling: boolean;

    editedOrganization: EditedOrganization
}

class EditOrganization extends React.Component<types.EditOrganizationProps, EditOrganizationState> {

    constructor(props: types.EditOrganizationProps) {
        super(props)

        this.state = {
            canceling: false,
            editedOrganization: {
                id: this.props.organization.id,
                name: this.props.organization.name,
                description: this.props.organization.description
            }
        }
    }

    onClickCancel() {
        this.setState({canceling: true})
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!this.state.editedOrganization.name) {
            // do somthing
            return;
        }
        if (!this.state.editedOrganization.id) {
            // do somthing
            return;
        }
        if (!this.state.editedOrganization.description) {
            // do somthing
            return;
        }
        const updatedOrg: types.OrganizationUpdate = {
            name: this.state.editedOrganization.name,
            id: this.props.organization.id,
            description: this.state.editedOrganization.description
        }
        this.props.onUpdateOrg(updatedOrg);
    }

    onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist();
        this.setState((state) => {
            state.editedOrganization.name = e.target.value;
            return state;
        })
    }

    onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        e.persist()
        this.setState((state) => {
            state.editedOrganization.description = e.target.value;
            return state;
        })
    }

    onIdChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist();
        this.setState((state) => {
            state.editedOrganization.id = e.target.value;
            return state;
        })
    }

    renderForm() {
        return (
            <form className="editor" onSubmit={this.onSubmit.bind(this)}>
                <div className="row">
                    <div className="col1">name</div>
                    <div className="col12">
                        <input value={this.state.editedOrganization.name} 
                               onChange={this.onNameChange.bind(this)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col1">id</div>
                    <div className="col2"><input value={this.state.editedOrganization.id}
                                                 onChange={this.onIdChange.bind(this)} /></div>
                </div>
                <div className="row">
                    <div className="col1">description</div>
                    <div className="col2">
                        <textarea value={this.state.editedOrganization.description} 
                                  onChange={this.onDescriptionChange.bind(this)} />
                    </div>
                </div>
                <div className="footer">
                    <button type="submit">Save</button>
                    <button type="button" onClick={this.onClickCancel.bind(this)}>Cancel</button>
                </div>
            </form>
        )
    }

    renderPreview() {
        return <form className="preview">
            <div className="row">
                <div className="col12">
                    <div className="name">
                        {this.state.editedOrganization.name || ''}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col2">
                    <div className="id">
                        <span style={{color: 'silver'}}>https://narrative.kbase.us/organizations/</span>{this.state.editedOrganization.id || ''}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col2">
                    <div className="description" 
                        dangerouslySetInnerHTML={({__html: marked(this.state.editedOrganization.description || '')})}
                    />
                </div>
            </div>
        </form>
    }

    render() {
        if (this.state.canceling) {
            return <Redirect push to="/organizations" />
        }

        return (
            <div className="EditOrganization">
                <div className="editorColumn">
                    <h3>Editor</h3>
                    {this.renderForm()}
                </div>
                <div className="previewColumn">
                    <h3>Preview</h3>
                    {this.renderPreview()}
                </div>
            </div>
        )

    }
}

export default EditOrganization