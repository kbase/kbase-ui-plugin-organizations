import { Alert, Collapse } from 'antd';
import { Component } from 'react';
import { AnError } from './api';
import './component.css';

export interface ErrorProps {
    error: AnError;
}

interface ErrorState {

}

export default class Error extends Component<ErrorProps, ErrorState> {


    renderDetail() {
        return (
            <table className='errorTable'>
                <tbody>
                    <tr>
                        <th>
                            <span className="field-label">generated at</span>
                        </th>
                        <td>
                            {
                                Intl.DateTimeFormat('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                }).format(this.props.error.at)
                            }
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <span className="field-label">error id</span>
                        </th>
                        <td>
                            <span style={{ fontFamily: 'monospace' }}>{this.props.error.id}</span>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <span className="field-label">explanation</span>
                        </th>
                        <td>
                            {this.props.error.detail}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    renderInfo() {
        if (!this.props.error.info) {
            return (
                <div style={{ textAlign: 'left', fontStyle: 'italic' }}>
                    No additional information
                </div>
            );
        }
        return (
            <div>
                additional info here ...
            </div>
        );
    }

    render() {
        const description = (
            <div>
                <p>
                    {this.props.error.message}
                </p>
                <Collapse bordered={false} style={{ backgroundColor: 'transparent' }}>
                    <Collapse.Panel header="detail" key="1" style={{ backgroundColor: 'transparent' }}>
                        {this.renderDetail()}
                    </Collapse.Panel>
                </Collapse>
                <Collapse bordered={false} style={{ backgroundColor: 'transparent' }}>
                    <Collapse.Panel header="additional info" key="1" style={{ backgroundColor: 'transparent' }}>
                        {this.renderInfo()}
                    </Collapse.Panel>
                </Collapse>
            </div>
        );

        return (
            <Alert
                type="error"
                showIcon
                message="Error"
                className="Error"
                description={description}
            />
        );
    }
}