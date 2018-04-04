const
    delimiter = '/',
    prefix = { param: ':', optionalParam: '?' };

function removeQueryString(url: string) {
    const i = url.indexOf('?');
    return i === -1 ? url : url.substring(0, i);
}

function isValidPattern(pattern: string) {
    const items = pattern.split(delimiter);
    let optional = false;
    for (let i = 0, len = items.length; i < len; i++) {
        const p = items[i];
        if (p.startsWith(prefix.param) && optional) return false;
        else if (p.startsWith(prefix.optionalParam)) optional = true;
        else if (optional) return false;
    }
    return true;
}

function matchRoute(patternItems: string[], urlItems: string[], filter) {
    if (urlItems.length > patternItems.length) return null;
    let params = {};
    for (let i = 0, len = patternItems.length; i < len; i++) {
        const p = patternItems[i], u = urlItems[i];
        if (p.startsWith(prefix.param)) {
            if (u === undefined) return null;
            else params[p.substring(1)] = u;
        }
        else if (p.startsWith(prefix.optionalParam)) params[p.substring(1)] = u;
        else if (u !== p) return null;
    }
    return filter ? filter(params) : params;
}

export class Router {
    private _items: any[][];

    constructor() {
        this._items = [];
    }

    get items() { return this._items; }

    add(pattern, handler, filter = null) {
        this._items.push([pattern, this.resolveHandler(handler), filter]);
    }

    resolveHandler(handler) {
        return handler;
    }

    match(url: string) {
        const urlNonQuery = removeQueryString(url);
        if (urlNonQuery.indexOf('.') !== -1) return null;
        const urlItems = urlNonQuery.split(delimiter);
        for (let i = 0, len = this._items.length; i < len; i++) {
            if (!isValidPattern(this._items[i][0]))
                throw "Invalid pattern";
        }
        for (let i = 0, len = this._items.length; i < len; i++) {
            const
                [pattern, handler, filter] = this._items[i],
                params = matchRoute(pattern.split(delimiter), urlItems, filter);
            if (params !== null) return { handler, params };
        }
        return null;
    }
}

