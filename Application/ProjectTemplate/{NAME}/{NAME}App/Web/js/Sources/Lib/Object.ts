import * as Immutable from 'immutable';

module Object {
    export function shallowCopyBy(obj: {}, keys: Immutable.Set<string>) {
        return Immutable.Map(obj)
            .filter((_, key) => keys.contains(key as string))
            .toObject();
    }    
}

export = Object;