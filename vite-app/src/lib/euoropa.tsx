
export interface EuropaLinkOptions {
    newWindow?: boolean;
    className?: string;
}

export interface HashPath {
    hash?: string;
    pathname?: string;
    params?: Record<string, string>;
}

export function kbaseUIURL(hash: string, params?: Record<string, string>): URL {
    const baseName = window.parent.location.pathname;
    const url = new URL(window.location.origin);

    url.pathname = baseName;
    url.hash = `#${hash}`;
    if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams(params);
        // Use our special notation for params on the hash
        url.hash += `$${searchParams}`;
    }
    return url;
}

function europaBaseURL(): URL {
    const europaHostname = window.parent.location.hostname.split('.')
        .slice(-3)
        .join('.');
    const url = new URL(window.location.origin);
    url.hostname = europaHostname;
    return url;
}

export function otherUIURL({hash, pathname, params}: HashPath): URL {
    const url = europaBaseURL();

    // We assume that a hash refers back to kbase-ui, so we create a
    // legacy path for europa.
    // TODO: Only if pathname is empty.
    url.pathname = hash ? `legacy/${hash}` : pathname || '';

    // So in this case we use a standard search fragment.
    if (params && Object.keys(params).length > 0) {
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value);
        }
    }

    return url;
}

/**
 * Create a URL for any KBase user interface.
 * 
 * Uses specific heuristics for determining how to construct it:
 * 
 * - 
 * 
 * @param hash 
 */
export function europaURL(hashPath: HashPath, newWindow: boolean) {
    if (!newWindow && hashPath.hash) {
        return kbaseUIURL(hashPath.hash, hashPath.params);
    }

    return otherUIURL(hashPath);
}
