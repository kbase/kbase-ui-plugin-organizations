import { Component, PropsWithChildren } from 'react';

export interface LinkerProps extends PropsWithChildren {
    to: string;
}

export interface LinkerState {

}

export default class Linker extends Component<LinkerProps, LinkerState> {
    render() {
        return <a href={`/#${this.props.to}`} target="_parent">{this.props.children}</a>;
    }
}