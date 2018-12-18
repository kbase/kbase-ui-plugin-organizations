import * as React from 'react'
import md5 from 'md5'

export interface OrgAvatarProps {
    gravatarHash: string | null
    size: number
    organizationName: string
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
        const hash = md5(this.props.organizationName)
        const url = 'https://unicornify.pictures/avatar/' + hash + '?s=' + this.props.size
        return (
            <img style={{ width: this.props.size, height: this.props.size }}
                src={url} />
        )
    }

    render() {
        if (this.props.gravatarHash) {
            return this.renderGravatar()
        } else {
            return this.renderUnicornify()
        }
    }
}