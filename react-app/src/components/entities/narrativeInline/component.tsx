import * as React from 'react';
import * as narrativeModel from '../../../data/models/narrative';
import { Tooltip, Icon } from 'antd';
import './component.css';

export interface NarrativeProps {
    narrative: narrativeModel.Narrative;
}

interface NarrativeState {
}

export default class Narrative extends React.Component<NarrativeProps, NarrativeState> {


    render() {
        const narrative = this.props.narrative;
        if (narrative.access === narrativeModel.NarrativeAccess.NONE) {
            return (
                <a href={"/narrative/" + narrative.workspaceId} target="_blank" rel="noopener noreferrer">
                    {/* <Icon type="exclamation-circle" style={{ color: 'orange' }} /> */}
                    {/* {' '} */}
                    inaccessible narrative
                </a >
            );
        }
        return (
            <a href={"/narrative/" + narrative.workspaceId} target="_blank" rel="noopener noreferrer">
                {narrative.title}
            </a>
        );

    }
}