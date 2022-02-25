import { sameRadii, goldenRatioRadii, ratio, sameArea } from '../radii'

test('sameRadii', () => {
    expect(() => sameRadii(0, 0, 0)).toThrow()
    expect(() => sameRadii(0, 1, 0)).toThrow()
    expect(() => sameRadii(1, 0, 0)).toThrow()
    expect(sameRadii(100, 1, 0)).toEqual([0, 100])
    expect(sameRadii(100, 2, 0)).toEqual([0, 50, 100])
    expect(sameRadii(100, 4, 0)).toEqual([0, 25, 50, 75, 100])
})

test('goldenRatioRadii', () => {
    expect(() => goldenRatioRadii(0, 0, 0)).toThrow()
    expect(() => goldenRatioRadii(0, 1, 0)).toThrow()
    expect(() => goldenRatioRadii(1, 0, 0)).toThrow()
    expect(goldenRatioRadii(100, 1, 0)).toEqual([0, 100])
    expect(goldenRatioRadii(100, 2, 0)).toEqual([0, 100 / ratio, 100])
    expect(goldenRatioRadii(100, 4, 0)).toEqual([
        0,
        100 / Math.pow(ratio, 3),
        100 / Math.pow(ratio, 2),
        100 / ratio,
        100,
    ])
})

test('sameArea', () => {
    expect(() => sameArea(0, 0, 0)).toThrow()
    expect(() => sameArea(0, 0, 1)).toThrow()
    expect(() => sameArea(0, 1, 0)).toThrow()
    expect(() => sameArea(1, 0, 0)).toThrow()
    expect(sameArea(100, 1, 1)).toEqual([0, 100])
    expect(sameArea(100, 2, 2)).toEqual([0, 71, 100])
    expect(sameArea(100, 4, 4)).toEqual([0, 50, 71, 87, 100])
})
