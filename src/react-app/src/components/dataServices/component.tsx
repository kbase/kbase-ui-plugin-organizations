import * as React from 'react'

export interface Props {
    onLoad: () => void
    onUnload: () => void
}

interface State {

}

export default class DataServices extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
    }

    componentWillMount() {
        this.props.onLoad()
    }

    componentWillUnmount() {
        this.props.onUnload()
    }

    render() {
        return this.props.children
    }
}

