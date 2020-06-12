import * as React from 'react'
import './RowWrapper.css'

export interface Dimensions {
    offsetHeight: number,
    scrollTop: number,
    clientHeight: number
}
export interface RowWrapperProps {
    index: number
    containerDimensions: Dimensions | null
    buffer: number
    approximateRowHeight: number
    emptyRowRenderer: () => JSX.Element
}

interface RowWrapperState {

}

export default class RowWrapper extends React.Component<RowWrapperProps, RowWrapperState> {
    ref: React.RefObject<HTMLDivElement>
    constructor(props: RowWrapperProps) {
        super(props)
        this.ref = React.createRef()
    }

    isVisible() {
        // const relativeLeft = (l - cl) - cs;
        // const relativeRight = relativeLeft + w;
        // if (relativeRight < 0) {
        //     return false;
        // }
        // if (relativeLeft > cw) {
        //     return false;
        // }
        // return true

        if (!this.ref.current) {
            return false
        }

        const d = this.props.containerDimensions
        if (!d) {
            return false
        }

        const buffer = this.props.buffer * this.props.approximateRowHeight

        const containerVisibleTop = Math.max(d.scrollTop - buffer, 0)
        const containerVisibleBottom = d.scrollTop + d.clientHeight + buffer

        const h = this.ref.current.offsetHeight
        const t = this.ref.current.offsetTop

        const topBelowTop = (t >= containerVisibleTop)
        const topAboveBottom = (t <= containerVisibleBottom)

        const bottomBelowTop = (t + h >= containerVisibleTop)
        const bottomAboveBottom = (t + h <= containerVisibleBottom)

        const visible = (topBelowTop && topAboveBottom) || (bottomBelowTop && bottomAboveBottom)
        return visible
    }

    render() {
        const show = this.isVisible()
        if (show) {
            return (
                <div className="RowWrapper-rendered" ref={this.ref}>
                    {this.props.children}
                </div>
            )
        } else {
            return (
                <div className="RowWrapper-unrendered" style={{ height: this.props.approximateRowHeight }} ref={this.ref}>
                    {this.props.emptyRowRenderer()}
                </div>
            )
        }
    }
}