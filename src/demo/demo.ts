import { readFileSync, closeSync, openSync, writeSync } from 'fs'

import { render } from '../index'
import { sameArea, sameRadii, goldenRatioRadii } from '../functions/radii'
import { Segment } from '../types'

const css = readFileSync('./src/demo/demo.css', 'utf8')
const radar: string = render(
    [
        {
            id: 1,
            name: 'Blip 1',
            segment: 'Segment 1',
            subsegment: 'Sub 1',
            ring: 'Ring 1',
            payload: {
                mrl: 10,
                trl: 20,
                score: 50,
                descr: 'Some text',
            },
        },
        {
            id: 2,
            name: 'Blip 2',
            segment: 'Segment 1',
            subsegment: 'Sub 1',
            ring: 'Ring 1',
        },
        {
            id: 3,
            name: 'Blip 3',
            segment: 'Segment 1',
            subsegment: 'Sub 2',
            ring: 'Ring 2',
        },
        {
            id: 4,
            name: 'Blip 4',
            segment: 'Segment 1',
            subsegment: 'Sub 2',
            ring: 'Ring 2',
        },
        {
            id: 5,
            name: 'Blip 5',
            segment: 'Segment 2',
            subsegment: 'Sub 1',
            ring: 'Ring 1',
        },
        {
            id: 6,
            name: 'Blip 6',
            segment: 'Segment 2',
            subsegment: 'Sub 1',
            ring: 'Ring 1',
        },
        {
            id: 7,
            name: 'Blip 7',
            segment: 'Segment 2',
            subsegment: 'Sub 2',
            ring: 'Ring 2',
        },
        {
            id: 8,
            name: 'Blip 8',
            segment: 'Segment 2',
            subsegment: 'Sub 2',
            ring: 'Ring 2',
        },
        {
            id: 9,
            name: 'Blip 9',
            segment: 'Segment 2',
            subsegment: 'Sub 3',
            ring: 'Ring 3',
        },
        {
            id: 10,
            name: 'Blip 10',
            segment: 'Segment 2',
            subsegment: 'Sub 3',
            ring: 'Ring 3',
        },
        {
            id: 11,
            name: 'Blip 11',
            segment: 'Segment 3',
            subsegment: 'Sub 1',
            ring: 'Ring 1',
        },
        {
            id: 12,
            name: 'Blip 12',
            segment: 'Segment 3',
            subsegment: 'Sub 1',
            ring: 'Ring 1',
        },
        {
            id: 13,
            name: 'Blip 13',
            segment: 'Segment 3',
            subsegment: 'Sub 2',
            ring: 'Ring 2',
        },
        {
            id: 14,
            name: 'Blip 14',
            segment: 'Segment 3',
            subsegment: 'Sub 2',
            ring: 'Ring 2',
        },
        {
            id: 15,
            name: 'Blip 15',
            segment: 'Segment 3',
            subsegment: 'Sub 3',
            ring: 'Ring 3',
        },
        {
            id: 16,
            name: 'Blip 16',
            segment: 'Segment 3',
            subsegment: 'Sub 3',
            ring: 'Ring 3',
        },
        {
            id: 17,
            name: 'Blip 17',
            segment: 'Segment 3',
            subsegment: 'Sub 4',
            ring: 'Ring 4',
        },
        {
            id: 18,
            name: 'Blip 18',
            segment: 'Segment 3',
            subsegment: 'Sub 4',
            ring: 'Ring 4',
        },
    ],
    [
        { name: 'Segment 1', subSegments: ['Sub 1', 'Sub 2'] },
        { name: 'Segment 2', subSegments: ['Sub 1', 'Sub 2', 'Sub 3'] },
        { name: 'Segment 3', subSegments: ['Sub 1', 'Sub 2', 'Sub 3', 'Sub 4'] },
    ],
    // ['Segment 1', 'Segment 2', 'Segment 3'],
    ['Ring 1', 'Ring 2', 'Ring 3', 'Ring 4', 'Ring 5'],
    {
        labels: {
            segmentOffset: 20,
            segmentSize: 40,
            subSegmentOffset: 20,
            subSegmentSize: 30,
        },
        lines: {
            segment: false,
            subSegment: false,
        },
        calcRadii: sameArea,
    }
)

const demo = openSync('./demo.html', 'w')
writeSync(demo, `<html><head><style>${css}</style><body>${radar}</body></html>`)
closeSync(demo)
