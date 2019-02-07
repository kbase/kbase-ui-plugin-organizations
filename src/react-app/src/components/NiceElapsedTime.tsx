import * as React from 'react'
import { niceElapsed } from '../lib/time'
import { Tooltip } from 'antd';

export interface NiceElapsedTimeProps {
    time: Date
    showTooltip?: boolean
    tooltipPrefix?: string
}

interface NiceElapsedTimeState {
}

export default class NiceElapsedTime extends React.Component<NiceElapsedTimeProps, NiceElapsedTimeState> {
    constructor(props: NiceElapsedTimeProps) {
        super(props)
    }

    render() {
        if (this.props.showTooltip === false) {
            return (
                <span>
                    {niceElapsed(this.props.time, 30)}
                </span>
            )
        }

        const fullDate = (
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
        let tooltip
        if (this.props.tooltipPrefix) {
            tooltip = (
                <span>
                    {this.props.tooltipPrefix}
                    {fullDate}
                </span>
            )
        } else {
            tooltip = fullDate
        }
        return (
            <Tooltip placement="bottomRight" title={tooltip}>
                {niceElapsed(this.props.time, 30)}
            </Tooltip>
        )
    }
}