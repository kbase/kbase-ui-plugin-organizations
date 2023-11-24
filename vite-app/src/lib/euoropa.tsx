import { AccessibleNarrative } from '../data/models/narrative';

export interface EuropaLinkOptions {
    newWindow?: boolean;
    className?: string;
}

export interface HashPath {
    hash?: string;
    pathname?: string;
}

/**
 * A cheap function to allow creation 
 * @param hash 
 */
export function europaURL({hash, pathname}: HashPath) {
    // Assume we are operating on a subdomain of Europa.
   let hostname: string
    if (!window.location.hostname.endsWith('kbase.us')) {
        hostname = 'ci.kbase.us';
    } else {
        hostname = window.location.hostname.split('.').slice(1).join('.');
    }
    const url = new URL(`https://${hostname}`);
    if (hash) {
        url.hash = hash[0] === '#' ? hash : `#${hash}`;
    }
    if (pathname) {
        url.pathname = pathname;
    }
    return url;
}

export function europaOpen(hashPath: HashPath, options: EuropaLinkOptions = {}) {
    const url = europaURL(hashPath);
    if (options.newWindow) {
        window.open(url, '_blank');
    } else {
        window.open(url, '_top');
     }
}

export function europaLink(hashPath: HashPath, label: string, options: EuropaLinkOptions = {}) {
    const url = europaURL(hashPath);
    if (options.newWindow) {
        return <a href={url.toString()} 
              className={options.className}
              target='_blank'
              rel="noopener noreferrer">
            {label}
        </a>;
    }
    return <a href={url.toString()} 
              target='_top'>
       {label}
    </a>;
}

export function europaNarrativeLink(narrative: AccessibleNarrative,) {
    return europaLink({pathname: `narrative/${narrative.workspaceId}`}, narrative.title, {newWindow: true})
}