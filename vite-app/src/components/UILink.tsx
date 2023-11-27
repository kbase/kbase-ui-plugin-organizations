import { Component, PropsWithChildren } from "react";
import { HashPath, europaURL } from '../lib/euoropa';

export interface UILinkProps extends PropsWithChildren{
    origin?: string;
    newWindow?: boolean;
    label?: string;
    linkIsLabel?: boolean;
    title?: string;
    className?: string;
    hashPath: HashPath;
    preventDefault?: boolean;
}
/**
 * Creates a link to another ui endpoint.
 * 
 * Supports several use cases:
 * 
 * - internal kbase-ui navigation - i.e. within kbase-ui in the same window - simply create a
 *   link on the current window changing only the hash; secondarily if there are params
 *   form them as a search component but with '$' as a prefix rather than '?'. Note that
 *   the origin must be consistent with kbase-ui, not europa.
 * 
 * - external kbase-ui navigation - i.e. within kbase ui but opening a separate window;
 *   must use the europa origin, not kbase-ui, and may use either the hash form or the
 *   path + search form, with 'legacy/' prefixing the path
 * 
 * - europa navigation
 * 
 */
export default class UILink extends Component<UILinkProps> {
    renderLabel(url: URL) {
        if (this.props.linkIsLabel) {
            return url.toString();
        }
        if (this.props.label) {
            return this.props.label;
        }
        return this.props.children;
    }
    render() {
        const {hash} = this.props.hashPath;

        const url = europaURL(this.props.hashPath, !!this.props.newWindow);

        const target = (() => {
            if (this.props.newWindow) {
                return '_blank';
            }
            if (hash) {
                return '_parent';
            }
            return '_top';
        })();

        const onClick = (() => {
            if (this.props.preventDefault) {
                return (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                }
            }
        })();

        return <a 
            href={url.toString()} 
            title={this.props.title}
            target={target}
            className={this.props.className}
            onClick={onClick}
        >
            {this.renderLabel(url)}
        </a>

    }
}
