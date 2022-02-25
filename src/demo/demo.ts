import { readFileSync, closeSync, openSync, writeSync } from 'fs'

import { render } from '../index'
import { sameArea, sameRadii, goldenRatioRadii } from '../functions/radii'

const css = readFileSync('./src/demo/demo.css', 'utf8')
console.log(css)
const radar: string = render(
    [],
    ['Segment 1', 'Segment 2', 'Segment 3'],
    ['Ring 1', 'Ring 2', 'Ring 3', 'Ring 4', 'Ring 5'],
    {
        subSegments: 3,
        calcRadii: sameArea,
    }
)

console.log(radar)

const demo = openSync('./demo.html', 'w')
writeSync(demo, `<html><head><style>${css}</style><body>${radar}</body></html>`)
closeSync(demo)

// console.log(
// ) // this should be a test of sorts

// console.log('')
