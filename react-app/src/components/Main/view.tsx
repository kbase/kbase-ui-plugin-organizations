import { Component } from 'react';
import { ModelLoaded } from '../../redux/store/types/common';
import { MainView } from '../../redux/store/types/views/Main';
import Dispatcher from '../../ui/dispatcher';
import './style.css';


export interface MainProps {
    viewModel: ModelLoaded<MainView>;
    setTitle: (title: string) => void;
}

interface MainState {
}

export default class Navigation extends Component<MainProps, MainState> {
    componentDidMount() {
        this.props.setTitle('Organizations');
    }

    render() {
        return <Dispatcher />
    }
}
