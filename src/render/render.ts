import { SVG } from '@svgdotjs/svg.js'

import { Segment, Options } from '../types'
import { calcAngles, polar2cartesian } from '../util/math'

//
// constructs the complete radar based on the given segments, rings, and options
//
export const constructRadar = function (
    segments: Segment[] | string[],
    rings: string[],
    opts: Options
): any {
    //
    // 1) calculate some base values
    //
    // There is always spacing for the segment labels
    let labelSpacing = 2 * opts.labels.segmentOffset + 2 * opts.labels.segmentSize
    if (typeof segments[0] === 'object') {
        // an array of Segments -> make room for sub labels
        labelSpacing += opts.labels.subSegmentOffset + 2 * opts.labels.subSegmentSize
    }
    const radius = (opts.diameter - 2 * opts.ringStroke - 2 * labelSpacing) / 2
    // calculate the rest
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
    segLabel: Segment | string,
    angles: number[],
    radii: number[],
    idx: number,
    opts: Options
): void {
    // 1) create the segment's group
    const seg = root.group().attr({
        label: typeof segLabel === 'string' ? segLabel : segLabel.name,
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
    addSegmentLines(seg, angles[idx], angles[idx + 1], radii[radii.length - 1], segLabel)
    // TODO add here a hook to add "sub lines?"

    // 4) add the segment name
    addLabels(seg, segLabel, angles[idx], angles[idx + 1], radii[radii.length - 1], opts)
}

//
// add segment lines to the radar
//
const addSegmentLines = (
    svgElem: any,
    startA: number,
    endA: number,
    radius: number,
    segLabel: Segment | string
) => {
    // 1.) "Left"  line
    // lines always start at (0, 0).
    // SVG coordinate system is mirrored on x axis hence we need to rotate by 90 degree, i.e. PI/2
    // to get the correct coordinates
    // "Left" line
    let endX = radius * Math.cos(startA - Math.PI / 2)
    let endY = radius * Math.sin(startA - Math.PI / 2)
    svgElem.line(0, 0, endX, endY).attr({ class: 'main open' })

    //
    // 2.) add subSegment lines, if segLabel is of type object
    //
    if (typeof segLabel === 'object') {
        const numSubSegs = segLabel.subSegments.length
        const offs = (endA - startA) / numSubSegs
        for (let i = 0; i < numSubSegs - 1; i++) {
            endX = radius * Math.cos(startA + offs * (i + 1) - Math.PI / 2)
            endY = radius * Math.sin(startA + offs * (i + 1) - Math.PI / 2)
            svgElem.line(0, 0, endX, endY).attr({ class: `sub sub-${i}` })
        }
    }

    //
    // 3.) "Right" line
    //
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
const addLabels = (
    root: any,
    segLabel: Segment | string,
    startA: number,
    endA: number,
    radius: number,
    opts: Options
): void => {
    // need to recalculate the last arc path...
    const _1 = polar2cartesian(radius, startA)
    const _2 = polar2cartesian(radius, endA)
    // a running offset
    let offset = 0

    //
    // 1.) First construct a path we can re-use and add it to defs
    //
    const svg = root.root()
    const arc = svg.defs().path(`M${_1.x} ${_1.y} A${radius} ${radius} 0 0 1 ${_2.x} ${_2.y}`)

    //
    // 2. Add the sub segment labels
    //
    if (typeof segLabel === 'object') {
        offset += opts.labels.subSegmentOffset
        // calculate the offset for each sub segment label
        const step = 100 / segLabel.subSegments.length
        let ofsA = step / 2
        for (let i = 0; i < segLabel.subSegments.length; i++) {
            const text = root.text()
            text.tspan(segLabel.subSegments[i]).dy(-1 * offset)
            text.attr({ class: 'label label-sub' })
            text.font({ size: opts.labels.subSegmentSize, anchor: 'middle' })
            text.path(arc).attr({ startOffset: `${ofsA}%` })
            ofsA += step
        }
        // finally add the sub seg label height to the offset
        offset += opts.labels.subSegmentSize
    }
    // TODO

    //
    // 2.) Now we add the segment label
    //
    offset += opts.labels.segmentOffset
    const segmentLabel = typeof segLabel === 'string' ? segLabel : segLabel.name
    const text = root.text()
    text.tspan(segmentLabel).dy(-1 * offset)
    text.attr({ class: 'label label-seg' })
    text.font({ size: opts.labels.segmentSize, anchor: 'middle' })
    text.path(arc).attr({ startOffset: '50%' })
}
