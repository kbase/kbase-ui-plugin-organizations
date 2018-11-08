import * as React from 'react'
import './KBaseIntegration.css'

import { KBaseIntegrationProps, AppState } from '../types'
import { } from '../lib/IFrameSimulator'

class KBaseIntegration extends React.Component<KBaseIntegrationProps, object> {
    constructor(props: KBaseIntegrationProps) {
        super(props)

        // const params = this.getParamsFromIFrame()

        // console.log('params', params)

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
        } else {
            return (
                <div className="KBaseIntegration">
                    {this.props.children}
                </div>
            )
        }
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