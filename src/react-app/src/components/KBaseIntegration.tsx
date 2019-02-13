import * as React from 'react'
import './KBaseIntegration.css'

import { AppState } from '../types'
import { Channel } from '../lib/windowChannel';
import { IFrameIntegration } from '../lib/IFrameIntegration';

export interface KBaseIntegrationProps {
    status: AppState
    channelId: string | null
    onAppStart: () => void
}
class KBaseIntegration extends React.Component<KBaseIntegrationProps, object> {

    channel: Channel | null

    constructor(props: KBaseIntegrationProps) {
        super(props)

        // const params = this.getParamsFromIFrame()

        // this.props.onAppStart()

        this.channel = null
    }

    setupChannel() {
        if (this.props.channelId) {
            // let integration = new IFrameIntegration()
            this.channel = new Channel({
                channelId: this.props.channelId,
            })

            this.channel.on('navigate', ({ to, params }) => {
                // switch (to) {
                //     case 'orgs':

                // }
                // console.log('NAVIGATE', to, params)
            }, (err) => {
                console.error('Error processing "navigate" message')
            })

            this.channel.start()

            this.channel.send('ready', {
                channelId: this.props.channelId,
                greeting: 'heloooo'
            })
        }
    }

    teardownChannel() {

    }

    componentDidMount() {
        this.props.onAppStart()
    }

    componentDidUpdate() {
        this.setupChannel()
    }

    componentWillUnmount() {
        this.teardownChannel()
    }

    render() {
        if (this.props.status === AppState.NONE) {
            return (
                <div className="KBaseIntegration">
                    Loading...
                </div>
            )
        }

        return (
            <div className="KBaseIntegration scrollable-flex-column">
                {this.props.children}
            </div>
        )
    }
}

export default KBaseIntegration