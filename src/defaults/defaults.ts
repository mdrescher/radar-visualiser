import { Blip, Options } from '../types'
import { sameRadii } from './functions/radii'

// this will gradually be expanded to include all the default function.
// they will NOT include styling; this must be done by the developer using CSS stylesheets.
export const defaults: Options = {
    // radar dimensions (incl. titles)
    diameter: 2000,
    // need to know the ringStroke to calculate the radius of the actual radar
    ringStroke: 2,
    // the width of the segment names area. Required to calculate the radar size
    segmentName: 80,
    calcRadii: sameRadii,
}
