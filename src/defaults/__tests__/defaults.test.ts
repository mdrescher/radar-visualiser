import { defaults } from '../defaults'
import { Blip, Options } from '../../types'

const opts_disjunct = {
    c: 'c',
    d: 'd',
}

const opts_overlap = {
    a: 'a',
    b: 'b',
    diameter: 1,
    ringStroke: 2000,
}

test('Defaults only', () => {
    expect({ ...defaults }).toMatchObject(defaults)
})

test('Disjunct options', () => {
    expect(JSON.stringify({ ...defaults, ...opts_disjunct })).toEqual(
        JSON.stringify({
            diameter: 2000,
            ringStroke: 2,
            segmentName: 80,
            bloop: (b: Blip) => {
                return '' + b.id + ', ' + b.name
            },
            c: 'c',
            d: 'd',
        })
    )
})

test('Overlapping options options', () => {
    expect(JSON.stringify({ ...defaults, ...opts_overlap })).toEqual(
        JSON.stringify({
            diameter: 1,
            ringStroke: 2000,
            segmentName: 80,
            bloop: (b: Blip) => {
                return '' + b.id + ', ' + b.name
            },
            a: 'a',
            b: 'b',
        })
    )
})
