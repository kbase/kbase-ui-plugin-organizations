import * as React from 'react'
import { niceElapsed } from '../lib/time'
import { Tooltip } from 'antd';

export interface NiceElapsedTimeProps {
    time: Date
    showTooltip?: boolean
}

interface NiceElapsedTimeState {
}

export default class NiceElapsedTime extends React.Component<NiceElapsedTimeProps, NiceElapsedTimeState> {
    constructor(props: NiceElapsedTimeProps) {
        super(props)
    }

    render() {
        if (this.props.showTooltip !== false) {
            const tooltip = (
                <span>
                    {
                        Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            timeZoneName: 'short'
                        }).format(this.props.time)
                    }
                </span>
            )
            return (
                <Tooltip placement="bottomRight" title={tooltip}>
                    {niceElapsed(this.props.time, 30)}
                </Tooltip>
            )
        } else {
            return (
                <span>
                    {niceElapsed(this.props.time, 30)}
                </span>
            )
        }
    }
}