module Array {
    export function concatArrayOfArrays(arrayOfArrays: any[][]) {
        return [].concat.apply([], arrayOfArrays);
    }
}

export = Array;