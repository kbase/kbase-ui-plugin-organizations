export function getProp<T>(obj: any, propPath: Array<string> | string, defaultValue: T): T {
    if (typeof propPath === 'string') {
        propPath = propPath.split('.');
    } else if (!(propPath instanceof Array)) {
        throw new TypeError('Invalid type for key: ' + (typeof propPath));
    }
    for (let i = 0; i < propPath.length; i += 1) {
        if ((obj === undefined) ||
            (typeof obj !== 'object') ||
            (obj === null)) {
            return defaultValue;
        }
        obj = obj[propPath[i]];
    }
    if (obj === undefined) {
        return defaultValue;
    }
    return obj;
}


export function hasProp(obj: any, propPath: Array<string> | string): boolean {
    if (typeof propPath === 'string') {
        propPath = propPath.split('.');
    } else if (!(propPath instanceof Array)) {
        throw new TypeError('Invalid type for key: ' + (typeof propPath));
    }
    for (let i = 0; i < propPath.length; i += 1) {
        if ((obj === undefined) ||
            (typeof obj !== 'object') ||
            (obj === null)) {
            return false;
        }
        obj = obj[propPath[i]];
    }
    if (obj === undefined) {
        return false;
    }
    return true;
}


export function setProp(obj: any, propPath: Array<string> | string, value: any): any {
    if (typeof propPath === 'string') {
        propPath = propPath.split('.');
    } else if (!(propPath instanceof Array)) {
        throw new TypeError('Invalid type for key: ' + (typeof propPath));
    }
    if (propPath.length === 0) {
        return;
    }
    // pop off the last property for setting at the end.
    const propKey = propPath[propPath.length - 1];
    let key;
    // Walk the path, creating empty objects if need be.
    for (let i = 0; i < propPath.length - 1; i += 1) {
        key = propPath[i];
        if (obj[key] === undefined) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    // Finally set the property.
    obj[propKey] = value;
    return value;
}



export function incrProp(obj: any, propPath: Array<string> | string, increment: number): number | void {
    if (typeof propPath === 'string') {
        propPath = propPath.split('.');
    } else if (!(propPath instanceof Array)) {
        throw new TypeError('Invalid type for key: ' + (typeof propPath));
    }
    if (propPath.length === 0) {
        return;
    }
    increment = (increment === undefined) ? 1 : increment;
    const propKey = propPath[propPath.length - 1];
    for (let i = 0; i < propPath.length - 1; i += 1) {
        const key = propPath[i];
        if (obj[key] === undefined) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    if (obj[propKey] === undefined) {
        obj[propKey] = increment;
    } else {
        if (typeof obj[propKey] === 'number') {
            obj[propKey] += increment;
        } else {
            throw new Error('Can only increment a number');
        }
    }
    return obj[propKey];
}


export function deleteProp(obj: any, propPath: Array<string> | string) {
    if (typeof propPath === 'string') {
        propPath = propPath.split('.')
    } else if (!(propPath instanceof Array)) {
        throw new TypeError('Invalid type for key: ' + (typeof propPath))
    }
    if (propPath.length === 0) {
        return false
    }
    const propKey = propPath[propPath.length - 1];
    for (let i = 0; i < propPath.length - 1; i += 1) {
        const key = propPath[i]
        if (obj[key] === undefined) {
            // for idempotency, and utility, do not throw error if
            // the key doesn't exist.
            return false;
        }
        obj = obj[key]
    }
    if (obj[propKey] === undefined) {
        return false
    }
    delete obj[propKey]
    return true
}

export interface PropsConfig {
    data?: any
}

export class Props {

    obj: any

    constructor(data = {}) {
        this.obj = data
    }

    getItem(props: Array<string> | string, defaultValue: any) {
        return getProp(this.obj, props, defaultValue)
    }

    hasItem(propPath: Array<string> | string) {
        return hasProp(this.obj, propPath)

    }

    setItem(path: Array<string> | string, value: any) {
        return setProp(this.obj, path, value)
    }

    incrItem(path: Array<string> | string, increment: number) {
        return incrProp(this.obj, path, increment)
    }

    deleteItem(path: Array<string> | string) {
        return deleteProp(this.obj, path)
    }

    toJSON() {
        return Object.assign({}, this.obj)
    }
}
