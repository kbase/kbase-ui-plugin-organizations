import * as React from 'react'
import md5 from 'md5'

export interface OrgAvatarProps {
    gravatarHash: string | null
    size: number
    organizationName: string
    organizationId: string
}

export interface OrgAvatarState {

}

export default class OrgAvatar extends React.Component<OrgAvatarProps, OrgAvatarState> {
    constructor(props: OrgAvatarProps) {
        super(props)
    }

    renderGravatar() {
        if (!this.props.gravatarHash) {
            return this.renderDefault()
        }
        const gravatarDefault = 'identicon';

        const url = 'https://www.gravatar.com/avatar/' + this.props.gravatarHash + '?s=' + this.props.size + '&amp;r=pg&d=' + gravatarDefault;

        return (
            <img style={{ width: this.props.size, height: this.props.size }}
                src={url} />
        )
    }

    renderDefault() {
        const url = 'unicorn-64.png'
        // const url = 'orgs-64.png'
        return (
            <img style={{ width: this.props.size, height: this.props.size }}
                src={url} />
        )
    }

    renderUnicornify() {
        const hash = md5(this.props.organizationId)
        const url = 'https://unicornify.pictures/avatar/' + hash + '?s=' + this.props.size
        return (
            <img style={{ width: this.props.size, height: this.props.size }}
                src={url} />
        )
    }

    renderDefaultInitial() {
        const initial = this.props.organizationName.substr(0, 1).toUpperCase()
        const hash = md5(this.props.organizationId)
        const color = hash.substr(0, 6)
        // return (
        //     <span style={{ color: '"#' + color + '"', width: this.props.size, height: this.props.size, fontSize: this.props.size - 6 }}
        //     >{initial}</span>
        // )
        return (
            <svg width={this.props.size} height={this.props.size} style={{ border: '1px rgba(200, 200, 200, 0.5) solid' }}>
                <text x="50%" y="50%" dy={4} textAnchor="middle" dominantBaseline="middle" fontSize={this.props.size - 12} fill={'#' + color} fontFamily="sans-serif">{initial}</text>
            </svg>
        )
    }

    render() {
        if (this.props.gravatarHash) {
            return this.renderGravatar()
        } else {
            return this.renderDefaultInitial()
        }
    }
}