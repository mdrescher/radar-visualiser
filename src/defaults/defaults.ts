import { Blip, Options } from '../types'
import { sameArea } from '../functions/radii'

export const defaults: Options = {
    diameter: 2000,
    ringStroke: 2,
    labelOffset: 20,
    labelSize: 40,
    // no subSegments in the defaults!
    calcRadii: sameArea,
}
