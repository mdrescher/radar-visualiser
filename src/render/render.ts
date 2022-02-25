import { SVG } from '@svgdotjs/svg.js'

import { Options } from '../types'
import { calcAngles, polar2cartesian } from '../util/math'

//
// constructs the complete radar based on the given segments, rings, and options
//
export const constructRadar = function (segments: string[], rings: string[], opts: Options): any {
    //
    // 1) calculate some base values
    //
    const radius =
        (opts.diameter - 2 * opts.ringStroke - 2 * opts.labelOffset - 2 * opts.labelSize) / 2
    const numSegs = segments.length
    const numRings = rings.length
    const angles = calcAngles(numSegs)
    const radii = opts.calcRadii(radius, numRings, numSegs)

    //
    // 2) the root svg element
    //
    const svg = SVG()
        .width('100%')
        .height('100%')
        .viewbox(-opts.diameter / 2, -opts.diameter / 2, opts.diameter, opts.diameter)

    //
    // 3) construct each segment
    //
    for (let i = 0; i < segments.length; i++) {
        addSegment(svg, segments[i], angles, radii, i, opts)
    }

    //
    // 4) return the SVG element
    //
    return svg
}

const addSegment = function (
    root: any,
    name: string,
    angles: number[],
    radii: number[],
    idx: number,
    opts: Options
): void {
    // 1) create the segment's group
    const seg = root.group().attr({
        label: name,
        class: `segment segment-${idx}`,
        'data-angle-start': `${angles[idx]}`,
        'data-angle-end': `${angles[idx + 1]}`,
    })
    // 2) add the rings
    for (let i = 0; i < radii.length - 1; i++) {
        const ring = seg.group().attr({
            class: `ring ring-${i}`,
            'data-radius-inner': `${radii[i]}`,
            'data-radius-outer': `${radii[i + 1]}`,
        })
        addRing(ring, angles[idx], angles[idx + 1], radii[i], radii[i + 1])
    }
    // 3) add the segment lines
    addSegmentLines(seg, angles[idx], angles[idx + 1], radii[radii.length - 1], opts.subSegments)
    // TODO add here a hook to add "sub lines?"

    // 4) add the segment name
    addSegmentName(seg, angles[idx], angles[idx + 1], radii[radii.length - 1], name, opts)
}

//
// add segment lines to the radar
//
const addSegmentLines = (
    svgElem: any,
    startA: number,
    endA: number,
    radius: number,
    numSubSegs?: number
) => {
    // 1.) "Left" and "Right" lines
    // lines always start at (0, 0).
    // SVG coordinate system is mirrored on x axis hence we need to rotate by 90 degree, i.e. PI/2
    // to get the correct coordinates
    // "Left" line
    let endX = radius * Math.cos(startA - Math.PI / 2)
    let endY = radius * Math.sin(startA - Math.PI / 2)
    svgElem.line(0, 0, endX, endY).attr({ class: 'main open' })

    // any subsegment lines, if any
    if (numSubSegs && numSubSegs > 1) {
        const offs = (endA - startA) / numSubSegs
        for (let i = 0; i < numSubSegs - 1; i++) {
            endX = radius * Math.cos(startA + offs * (i + 1) - Math.PI / 2)
            endY = radius * Math.sin(startA + offs * (i + 1) - Math.PI / 2)
            svgElem.line(0, 0, endX, endY).attr({ class: `sub sub-${i}` })
        }
    }

    // "Right" line
    endX = radius * Math.cos(endA - Math.PI / 2)
    endY = radius * Math.sin(endA - Math.PI / 2)
    svgElem.line(0, 0, endX, endY).attr({ class: 'main close' })
}

//
// Add a ring to a segment
//
const addRing = function (
    root: any,
    startA: number,
    endA: number,
    startR: number,
    endR: number
): void {
    // ORIGINAL
    // <path d="M3.631077759471902e-14 -593 A593 593 0 0 1 513.5530644441722 296.4999999999999 L628.7344431475025 362.9999999999999 A726 726 0 0 0 4.445467880904892e-14 -726 Z"></path>
    //
    // TARGET
    // <path d="M3.631077759471902e-14 -593 A593 593 0 0 1 513.5530644441722 296.4999999999999"></path>
    // <line x1="513.5530644441722" y1="296.4999999999999" x2="628.7344431475025" y2="362.9999999999999"></line>
    // <path d="M628.7344431475025 362.9999999999999 A726 726 0 0 0 4.445467880904892e-14 -726"></path>
    // <line x1="4.445467880904892e-14" y1="-726" x2="3.631077759471902e-14" y2="-593"></line>

    // find the four coordinates for the ring
    const _1 = polar2cartesian(startR, startA)
    const _2 = polar2cartesian(startR, endA)
    const _3 = polar2cartesian(endR, endA)
    const _4 = polar2cartesian(endR, startA)

    // coordinates for the ring stroke
    const w = endR - startR
    const r = startR + w / 2
    const _5 = polar2cartesian(r, startA)
    const _6 = polar2cartesian(r, endA)

    // add the arc that "fills" the actual arc
    root.path(`M ${_5.x} ${_5.y} A ${r} ${r} 0 0 1 ${_6.x} ${_6.y}`).attr({
        'stroke-width': `${w}`,
        fill: 'none',
        class: 'arc-stroke',
    })

    // add inner arc
    root.path(`M ${_1.x} ${_1.y} A ${startR} ${startR} 0 0 1 ${_2.x} ${_2.y}`).attr({
        class: 'arc-inner',
    })

    // outer arc
    root.path(`M ${_4.x} ${_4.y} A ${endR} ${endR} 0 0 1 ${_3.x} ${_3.y}`).attr({
        class: 'arc-outer',
    })

    // left line
    root.line(_1.x, _1.y, _4.x, _4.y).attr({
        class: 'left-line',
    })

    // right line
    root.line(_2.x, _2.y, _3.x, _3.y).attr({
        class: 'right-line',
    })
}

//
// calculate the arc path for a ring, and for the segment label
//
const arcPath = function (angle: number, radius: number, flag: number): string {
    const x = radius * Math.cos(angle - Math.PI / 2)
    const y = radius * Math.sin(angle - Math.PI / 2)
    return `A${radius} ${radius} 0 0 ${flag} ${x} ${y}`
}

//
// Add the segment name to the segment
//
const addSegmentName = (
    root: any,
    startA: number,
    endA: number,
    radius: number,
    name: string,
    opts: Options
): void => {
    // need to recalculate the last arc path...
    const _1 = polar2cartesian(radius, startA)
    const _2 = polar2cartesian(radius, endA)
    // now add the text path to the segment group
    const text = root.text()
    text.font({ size: opts.labelSize, anchor: 'middle' })
    text.tspan(name).dy(-1 * opts.labelOffset)
    text.path(`M${_1.x} ${_1.y} A${radius} ${radius} 0 0 1 ${_2.x} ${_2.y}`).attr({
        startOffset: '50%',
    })
}
