import * as React from 'react'
import {Redirect} from 'react-router-dom';
import marked from 'marked';

import * as types from '../types';

import './NewOrganization.css'



export class PendingOrganization {
    id: string | null;
    name: string | null;
    description: string | null;

    constructor() {
        this.id = null;
        this.name = null;
        this.description = null;
    }
}

export interface NewOrganizationState {
    canceling: boolean;

    pendingOrganization: PendingOrganization
}

class NewOrganization extends React.Component<types.NewOrganizationProps, NewOrganizationState> {

    constructor(props: types.NewOrganizationProps) {
        super(props)

        this.state = {
            canceling: false,
            pendingOrganization: new PendingOrganization()
        }
    }

    onClickCancel() {
        this.setState({canceling: true})
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!this.state.pendingOrganization.name) {
            // do somthing
            return;
        }
        if (!this.state.pendingOrganization.id) {
            // do somthing
            return;
        }
        if (!this.state.pendingOrganization.description) {
            // do somthing
            return;
        }
        const newOrg: types.NewOrganization = {
            name: this.state.pendingOrganization.name,
            id: this.state.pendingOrganization.id,
            description: this.state.pendingOrganization.description

        }
        this.props.onAddOrg(newOrg);
    }

    onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist();
        this.setState((state) => {
            state.pendingOrganization.name = e.target.value;
            return state;
        })
    }

    onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        e.persist()
        this.setState((state) => {
            state.pendingOrganization.description = e.target.value;
            return state;
        })
    }

    onIdChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.persist();
        this.setState((state) => {
            state.pendingOrganization.id = e.target.value;
            return state;
        })
    }

    renderForm() {
        return (
            <form className="editor" onSubmit={this.onSubmit.bind(this)}>
                <div className="row">
                    <div className="col1">name</div>
                    <div className="col12">
                        <input value={this.state.pendingOrganization.name || ''} 
                               onChange={this.onNameChange.bind(this)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col1">id</div>
                    <div className="col2"><input value={this.state.pendingOrganization.id || ''}
                                                 onChange={this.onIdChange.bind(this)} /></div>
                </div>
                <div className="row">
                    <div className="col1">description</div>
                    <div className="col2">
                        <textarea value={this.state.pendingOrganization.description || ''} 
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
                        {this.state.pendingOrganization.name || ''}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col2">
                    <div className="id">
                        <span style={{color: 'silver'}}>https://narrative.kbase.us/organizations/</span>{this.state.pendingOrganization.id || ''}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col2">
                    <div className="description" 
                        dangerouslySetInnerHTML={({__html: marked(this.state.pendingOrganization.description || '')})}
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
            <div className="NewOrganization">
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

export default NewOrganization