import { readFileSync, closeSync, openSync, writeSync } from 'fs'

import { render } from '../index'
import { sameArea, sameRadii, goldenRatioRadii } from '../functions/radii'
import { Segment } from '../types'

const css = readFileSync('./src/demo/demo.css', 'utf8')
const radar: string = render(
    [],
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
