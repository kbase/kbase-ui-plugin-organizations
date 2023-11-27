import { Component } from 'react';
import * as narrativeModel from '../../../data/models/narrative';
import UILink from '../../UILink';
import './component.css';

export interface NarrativeProps {
    narrative: narrativeModel.Narrative;
}

interface NarrativeState {
}

export default class Narrative extends Component<NarrativeProps, NarrativeState> {


    render() {
        const narrative = this.props.narrative;
        if (narrative.access === narrativeModel.NarrativeAccess.NONE) {

            return <UILink 
                hashPath={{pathname: `narrative/${narrative.workspaceId}`}}
                newWindow={true}>
                inaccessible narrative
            </UILink>
        }
        <UILink 
            hashPath={{pathname: `narrative/${narrative.workspaceId}`}}
            newWindow={true}>
            {narrative.title}
        </UILink>

    }
}