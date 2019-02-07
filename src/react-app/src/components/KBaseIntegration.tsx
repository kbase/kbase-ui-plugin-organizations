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

    componentDidMount() {
        this.props.onAppStart()
    }

    render() {
        // TODO: some test like 
        // {this.props.env === 'dev' ? this.buildAuthDev() : this.buildAuthProd()}

        if (this.props.status === AppState.NONE) {
            return (
                <div className="KBaseIntegration">
                    Loading...
                </div>
            )
        }

        if (this.props.channelId) {
            // let integration = new IFrameIntegration()
            this.channel = new Channel({
                channelId: this.props.channelId,
            })
            this.channel.start()


            // this.channel.on('ready', (message) => {
            //     console.log('client: got ready...', message)
            // }, (err) => {
            //     console.log('client: error!', err)
            // })
            // console.log('sending ready message...')
            this.channel.send('ready', {
                channelId: this.props.channelId,
                greeting: 'hi'
            })


        }

        return (
            <div className="KBaseIntegration scrollable-flex-column">
                {this.props.children}
            </div>
        )
    }

    // getParamsFromIFrame() {
    //     if (!window.frameElement) {
    //         return null
    //     }
    //     if (!window.frameElement.hasAttribute('data-params')) {
    //         // throw new Error('No params found in window!!');
    //         return null
    //     }
    //     const params = window.frameElement.getAttribute('data-params');
    //     if (params === null) {
    //         // throw new Error('No params found in window!')
    //         return null
    //     }
    //     return JSON.parse(decodeURIComponent(params));
    // }
}

export default KBaseIntegration