module Value {
    export const isNumeric = (n: any) =>
        !isNaN(parseFloat(n)) && isFinite(n)
}

export = Value;