import * as Immutable from 'immutable';

export module Obj {
    export function shallowCopyBy(obj: {}, keys: Immutable.Set<string>) {
        return Immutable.Map(obj)
            .filter((_, key) => keys.contains(key as string))
            .toObject();
    }
}