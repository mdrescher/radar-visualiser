import { toRadian } from '../util/math'

//
// calculate an array of radii for radar segment rings so that all ring arcs have the SAME THICKNESS.
//
export const sameRadii = (radius: number, numRings: number, numSegs: number): number[] => {
    // parameter checks
    if (radius < 1) throw 'invalid radius provided'
    if (numRings < 1) throw 'invalid number of rings provided'
    if (!numSegs && numSegs) throw 'invalid number of segments provided' // not used here

    const delta = radius / numRings

    const radii = []
    for (let i = 0; i <= numRings; i++) {
        radii.push(delta * i)
    }
    return radii
}

//
// calculate an array of radii for radar segment rings so that all ring arcs have the SAME AREA.
//
export const sameArea = (radius: number, numRings: number, numSegs: number): number[] => {
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
