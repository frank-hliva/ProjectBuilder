import * as _ from 'ramda';
export module List {
    export function concatListOfList<T>(listOfLists: T[][]) {
        return [].concat.apply([], listOfLists as any) as T[];
    }

    export const swap = _.curry((index1, index2, list) => {
        if (index1 < 0 || index2 < 0 || index1 > list.length - 1 || index2 > list.length - 1) {
            return list // index out of bound
        }
        const value1 = list[index1]
        const value2 = list[index2]
        return _.pipe(
            _.set(_.lensIndex(index1), value2),
            _.set(_.lensIndex(index2), value1)
        )(list)
    });
}