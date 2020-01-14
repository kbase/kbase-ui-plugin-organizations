import * as React from 'react';
import './Avatar.css';
import noUserPic from './nouserpic.png';

import { User } from '../../types';

export interface AvatarProps {
    user: User,
    size: number;
}

interface AvatarState {

}

export class Avatar extends React.Component<AvatarProps, AvatarState> {
    getAvatarUrl(user: User) {
        switch (user.avatarOption || 'gravatar') {
            case 'gravatar':
                const gravatarDefault = user.gravatarDefault || 'identicon';
                const gravatarHash = user.gravatarHash;
                if (gravatarHash) {
                    return 'https://www.gravatar.com/avatar/' + gravatarHash + '?s=60&amp;r=pg&d=' + gravatarDefault;
                } else {
                    return noUserPic;
                }
            case 'silhouette':
            case 'mysteryman':
            default:
                return noUserPic;
        }
    }

    render() {
        const avatarUrl = this.getAvatarUrl(this.props.user);
        return (
            <img
                src={avatarUrl}
                style={{ width: this.props.size }}
                alt={`Avatar for ${this.props.user.username} aka ${this.props.user.realname}`}
            />
        );
    }

}

export default Avatar;