import { Component } from 'react';
export interface TestProps {
    id: string;
}

interface TestState {
}

export default class TestComponent extends Component<TestProps, TestState> {
    render() {
        return (
            <div>
                TEST! ({this.props.id})
            </div>
        );
    }
}