//
// a simple cartesian coordinate pair
//
export type Coord = {
    x: number // each blip has a numeric ID...
    y: number // .. and a name.
}

//
// round a floating point number to the given number of decimals
//
export const roundDec = (f: number, d: number): number => {
    let result = Math.round(f * Math.pow(10, d)) / Math.pow(10, d)
    if (result === -0) result = 0
    return result
}

//
// convert an angle and egrees into radians
//
export const toRadian = (angleDeg: number): number => (Math.PI * angleDeg) / 180

//
// convert an angle in rad to degree
//
export const toDegree = (angleRad: number): number => (angleRad * 180) / Math.PI

//
// calculate the RADIAN angles for the radar segments using the given values
//
export const calcAngles = (numSegments: number): number[] => {
    const angle = toRadian(360 / numSegments)
    if (numSegments < 1) return []

    const result = [0]
    for (let i = 0; i < numSegments; i++) {
        result.push(result[result.length - 1] + angle)
    }

    return result
}

//
// translates polar coordinates given in radius and angle (radians) into
// cartesian coordinates, rotated by -90 degrees (i.e. reference line is the y axis, not the x axis)
// Returns an oject { x: number, y: number }
//
export function polar2cartesian(radius: number, angle: number, dec?: number): Coord {
    let x = radius * Math.cos(angle - Math.PI / 2)
    let y = radius * Math.sin(angle - Math.PI / 2)
    return {
        x: dec ? roundDec(x, dec) : x,
        y: dec ? roundDec(y, dec) : y,
    }
}
