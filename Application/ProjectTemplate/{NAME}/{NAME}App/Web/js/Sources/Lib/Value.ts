module Value {
    export const isNumeric = (value: any) =>
        !isNaN(parseFloat(value)) && isFinite(value)

    export function isFunction(value: any): value is Function {
        return typeof value === "function";
    }

    export const isString = (value: any) =>
        typeof value === 'string' || value instanceof String

    export const isArray = (value: any) =>
        Object.prototype.toString.call(value) === '[object Array]'
}

export = Value;