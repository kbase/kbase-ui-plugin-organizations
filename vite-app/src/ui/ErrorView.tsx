
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Alert } from 'antd';
import { Component } from 'react';
import { UIError } from '../redux/store/types';

export interface ErrorViewProps {
    error: UIError;
}

interface ErrorViewState {

}

export default class ErrorView extends Component<ErrorViewProps, ErrorViewState> {
    renderMessage() {
        return <>
            <p>Error!</p>
            <p>
                <ExclamationCircleOutlined style={{ color: 'red' }} />
                {' '}
                {this.props.error.message}
            </p>
        </>;
    }
    render() {
        return (
            <Alert type="error" message={this.renderMessage()}></Alert>
        );
    }
}