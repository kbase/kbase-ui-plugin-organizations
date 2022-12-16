import { Component, createRef } from 'react';
import './FlexibleColumnWrapper.css';
import RowWrapper from './RowWrapper';

export interface Dimensions {
    offsetHeight: number,
    scrollTop: number,
    clientHeight: number
}

interface Listener {
    target: Window | Node
    type: string
    listener: EventListener
}

export abstract class Renderable {
    currentItem: number | null
    constructor() {
        this.currentItem = 0
    }

    abstract render(index: number): JSX.Element
    abstract size(): number
    abstract renderEmpty(): JSX.Element
}

export interface FlexibleColumnWrapperProps {
    // rowRenderer: (index: number) => JSX.Element
    renderable: Renderable
    // rowCount: number
}

export interface FlexibleColumnWrapperState {
    containerDimensions: Dimensions | null
}

export class FlexibleColumnWrapper extends Component<FlexibleColumnWrapperProps, FlexibleColumnWrapperState> {

    wrapperContainerRef: React.RefObject<HTMLDivElement>
    listeners: Array<Listener>
    limitingTimer: number | null
    limitingTimeout: number

    constructor(params: FlexibleColumnWrapperProps) {
        super(params)

        this.state = {
            containerDimensions: null
        }

        this.wrapperContainerRef = createRef()
        this.listeners = []
        this.limitingTimer = null
        this.limitingTimeout = 100
    }

    calcContainerBounds() {
        if (this.wrapperContainerRef.current === null) {
            return null
        }
        const dim = {
            offsetHeight: this.wrapperContainerRef.current.offsetHeight,
            scrollTop: this.wrapperContainerRef.current.scrollTop,
            clientHeight: this.wrapperContainerRef.current.clientHeight
        }
        return dim
    }

    limiter(fun: () => void) {
        if (this.limitingTimer) {
            window.clearTimeout(this.limitingTimer)
        }
        this.limitingTimer = window.setTimeout(() => {
            fun()
        }, this.limitingTimeout)
    }

    checkDimensions = () => {
        const currentDimensions = this.calcContainerBounds()
        if (!currentDimensions) {
            return
        }

        const lastDimensions = this.state.containerDimensions
        if (!lastDimensions) {
            this.setState({ containerDimensions: currentDimensions })
        } else {
            if (currentDimensions.offsetHeight !== lastDimensions.offsetHeight ||
                currentDimensions.scrollTop !== lastDimensions.scrollTop ||
                currentDimensions.clientHeight !== lastDimensions.clientHeight) {
                this.setState({ containerDimensions: currentDimensions })
            }
        }
    }

    componentDidMount() {
        if (this.wrapperContainerRef.current === null) {
            return false
        }

        const scrollHandler = () => {
            this.limiter(() => { this.checkDimensions() })
        }

        this.wrapperContainerRef.current.addEventListener('scroll', scrollHandler)
        this.listeners.push({
            target: this.wrapperContainerRef.current,
            type: 'scroll',
            listener: scrollHandler
        })

        const resizeHandler = () => {
            this.limiter(() => { this.checkDimensions() })
        }
        window.addEventListener('resize', resizeHandler)
        this.listeners.push({
            target: window,
            type: 'resize',
            listener: resizeHandler
        })

        this.checkDimensions()
    }

    componentWillUnmount() {
        this.listeners.forEach((listener) => {
            listener.target.removeEventListener(listener.type, listener.listener)
        })
    }

    render() {
        let out: Array<JSX.Element> = []

        for (let i = 0; i < this.props.renderable.size(); i += 1) {
            out.push(
                <RowWrapper index={i} key={String(i)}
                    containerDimensions={this.state.containerDimensions}
                    buffer={5} approximateRowHeight={73} emptyRowRenderer={() => { return this.props.renderable.renderEmpty() }}>
                    {this.props.renderable.render(i)}
                </RowWrapper>
            )
        }

        return (
            <div className="FlexibleColumnWrapper" ref={this.wrapperContainerRef}>
                {out}
            </div>
        )
    }
}