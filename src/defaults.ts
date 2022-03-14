import { Options } from './types'
import { sameArea } from './functions/radii'
import {
    blipStyles,
    blipSkipped,
    blipPlaced,
    equiTriangle,
    isoTriangle,
    square,
    circle,
} from './functions/blipPlacement'

export const defaults: Options = {
    diameter: 2000,
    blip: {
        dia: 40,
        stroke: 3,
        font: 'Verdana',
        weight: 'bold',
        size: 15,
    },
    labels: {
        segmentOffset: 20,
        segmentSize: 40,
        subSegmentOffset: 20,
        subSegmentSize: 20,
    },
    lines: {
        segment: true,
        segmentStroke: 5,
        subSegment: true,
        subSegmentStroke: 2,
    },
    // no subSegments in the defaults!
    calcRadii: sameArea,
    blipSkipped: blipSkipped,
    blipPlaced: blipPlaced,
    blipShape: circle,
    getBlipStyles: blipStyles,
}
