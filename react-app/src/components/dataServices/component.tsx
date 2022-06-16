import {Component} from 'react';

export interface Props {
    onLoad: () => void;
    onUnload: () => void;
}

interface State {

}

export default class DataServices extends Component<Props, State> {
    componentWillMount() {
        this.props.onLoad();
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        return this.props.children;
    }
}

