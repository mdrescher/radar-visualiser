import { deepMerge } from '../util'

const disjunct_a = {
    a: 'a',
    b: 'b',
}
const disjunct_b = {
    c: 'c',
    d: 'd',
}

const overlap_a = {
    a: 'a',
    b: 'b',
    c: 'c',
}
const overlap_b = {
    b: 1,
    c: 100,
    d: 'd',
}

const testsubObjects_a = {
    a: 1,
    b: 2,
    c: {
        c_1: 31,
        c_2: 32,
        c_3: 33,
    },
    d: 4,
}

const testsubObjects_b = {
    c: {
        c_1: 310,
        c_2: 320,
    },
    d: 400,
}

test('Disjunct options', () => {
    expect(JSON.stringify(deepMerge(disjunct_a, disjunct_b))).toEqual(
        JSON.stringify({
            a: 'a',
            b: 'b',
            c: 'c',
            d: 'd',
        })
    )
})

test('Overlapping options', () => {
    expect(JSON.stringify(deepMerge(overlap_a, overlap_b))).toEqual(
        JSON.stringify({
            a: 'a',
            b: 1,
            c: 100,
            d: 'd',
        })
    )
})

test('objects in options', () => {
    expect(JSON.stringify(deepMerge(testsubObjects_a, testsubObjects_b))).toEqual(
        JSON.stringify({
            a: 1,
            b: 2,
            c: {
                c_1: 310,
                c_2: 320,
                c_3: 33,
            },
            d: 400,
        })
    )
})
