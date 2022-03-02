import { Options } from './types'
import { sameArea } from './functions/radii'

export const defaults: Options = {
    diameter: 2000,
    ringStroke: 2,
    labels: {
        segmentOffset: 20,
        segmentSize: 40,
        subSegmentOffset: 20,
        subSegmentSize: 20,
    },
    lines: {
        segment: true,
        subSegment: true,
    },
    // no subSegments in the defaults!
    calcRadii: sameArea,
}
