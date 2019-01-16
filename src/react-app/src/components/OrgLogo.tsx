import * as React from 'react'
import md5 from 'md5'

export interface OrgLogoProps {
    logoUrl: string | null
    size: number
    organizationName: string
    organizationId: string
}

export interface OrgLogoState {

}

export default class OrgLogo extends React.Component<OrgLogoProps, OrgLogoState> {
    constructor(props: OrgLogoProps) {
        super(props)
    }

    // renderGravatar() {
    //     if (!this.props.gravatarHash) {
    //         return this.renderDefault()
    //     }
    //     const gravatarDefault = 'identicon';

    //     const url = 'https://www.gravatar.com/avatar/' + this.props.gravatarHash + '?s=' + this.props.size + '&amp;r=pg&d=' + gravatarDefault;

    //     return (
    //         <img style={{ width: this.props.size, height: this.props.size }}
    //             src={url} />
    //     )
    // }

    renderDefault() {
        const url = 'unicorn-64.png'
        // const url = 'orgs-64.png'
        return (
            <img style={{ width: this.props.size, height: this.props.size }}
                src={url} />
        )
    }

    renderLogoUrl() {
        if (!this.props.logoUrl) {
            return (
                <span>n/a</span>
            )
        }
        return (
            <img src={this.props.logoUrl} width={this.props.size} />
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

    // see: https://github.com/lautis/unicode-substring/blob/master/index.js
    charAt(inString: string, position: number) {
        // const c1 = inString.charAt(position)
        const c1 = inString.charCodeAt(position)
        if (c1 >= 0xD800 && c1 <= 0xDBFF && inString.length > position + 1) {
            const c2 = inString.charCodeAt(position + 1)
            if (c2 > 0xDC00 && c2 <= 0xDFFF) {
                return inString.substring(position, 2)
            }
        }
        return inString.substring(position, 1)
    }

    renderDefaultInitial() {
        const initial = this.charAt(this.props.organizationName, 0).toUpperCase()
        // const initial = this.props.organizationName.substr(0, 1).toUpperCase()
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

    renderLogo() {
        if (this.props.logoUrl) {
            return this.renderLogoUrl()
        }
        return this.renderDefaultInitial();
    }

    render() {
        return this.renderLogo()
    }
}