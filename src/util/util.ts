import { Options } from '../types'

export function isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item)
}

export function deepMerge(source_1: any, source_2: any): Options {
    if (!isObject(source_1)) throw 'source_1 is not an object'
    if (!isObject(source_2)) throw 'source_2 is not an object'

    let output = Object.assign({}, source_1)
    Object.keys(source_2).forEach((key) => {
        if (isObject(source_2[key])) {
            if (!(key in source_1)) Object.assign(output, { [key]: source_2[key] })
            else output[key] = deepMerge(source_1[key], source_2[key])
        } else {
            Object.assign(output, { [key]: source_2[key] })
        }
    })
    return output
}
