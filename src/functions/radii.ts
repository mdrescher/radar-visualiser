import { toRadian } from '../util/math'

// export const ratio = (1 + Math.sqrt(5)) / 2
export const ratio = 0.7

const checkParameters = (radius: number, numRings: number, numSegs: number): void => {
    // parameter checks
    if (radius < 1) throw 'invalid radius provided'
    if (numRings < 1) throw 'invalid number of rings provided'
    if (numSegs && numSegs < 1) throw 'invalid number of segments provided' // not used here
}

//
// calculate an array of radii for radar segment rings so that all ring arcs have the SAME THICKNESS.
//
export const sameRadii = (radius: number, numRings: number, numSegs: number): number[] => {
    checkParameters(radius, numRings, numSegs)

    const delta = radius / numRings
    const radii = []
    for (let i = 0; i <= numRings; i++) {
        radii.push(delta * i)
    }
    return radii
}

//
// calculates the radii so that they are in golden ratio to each other
//
export const goldenRatioRadii = (radius: number, numRings: number, numSegs: number): number[] => {
    checkParameters(radius, numRings, numSegs)

    const dist = []
    for (let i = 0; i < numRings; i++) {
        dist.push(radius / Math.pow(ratio, i))
    }
    // add 0
    dist.push(0)
    return dist.reverse()
}

//
// calculate an array of radii for radar segment rings so that all ring arcs have the SAME AREA.
//
export const sameArea = (radius: number, numRings: number, numSegs: number): number[] => {
    checkParameters(radius, numRings, numSegs)

    // parameter checks
    if (radius < 1) throw 'invalid radius provided'
    if (numRings < 1) throw 'invalid number of rings provided'
    if (!numSegs) throw 'numSegs rreuired here'
    if (numSegs && numSegs < 1) throw 'invalid number of segments provided' // not used here

    const angle = toRadian(360 / numSegs!)
    const ringArea = (0.5 * angle * Math.pow(radius, 2)) / numRings

    const radii = [0]
    for (let i = 0; i < numRings; i++) {
        radii.push(
            Math.round(Math.sqrt((2 / angle) * ringArea + Math.pow(radii[radii.length - 1], 2)))
        )
    }
    return radii
}
