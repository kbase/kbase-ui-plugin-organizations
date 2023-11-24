import { Component } from 'react';
import * as narrativeModel from '../../../data/models/narrative';
import { europaLink, europaNarrativeLink } from '../../../lib/euoropa';
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
            return europaLink({pathname: `narrative/${narrative.workspaceId}`}, 'inaccessible narrative', {newWindow: true})
            // return (
            //     <a href={"/narrative/" + narrative.workspaceId} target="_blank" rel="noopener noreferrer">
            //         inaccessible narrative
            //     </a >
            // );
        }
        return europaNarrativeLink(narrative);
        // return (
        //     <a href={"/narrative/" + narrative.workspaceId} target="_blank" rel="noopener noreferrer">
        //         {narrative.title}
        //     </a>
        // );

    }
}