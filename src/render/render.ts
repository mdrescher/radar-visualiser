import { SVG, Svg } from '@svgdotjs/svg.js'

import { Segment, Options } from '../types'
import { calcAngles, polar2cartesian } from '../util/math'

//
// constructs the complete radar based on the given segments, rings, and options
//
export const constructRadar = function (
    segments: Segment[] | string[],
    rings: string[],
    opts: Options
): Svg {
    //
    // 1) calculate some base values
    //
    // There is always spacing for the segment labels
    let labelSpacing = 2 * opts.labels.segmentOffset + 2 * opts.labels.segmentSize
    if (typeof segments[0] === 'object') {
        // an array of Segments -> make room for sub labels
        labelSpacing += opts.labels.subSegmentOffset + 2 * opts.labels.subSegmentSize
    }
    const radius = (opts.diameter - 2 * labelSpacing) / 2
    // calculate the rest
    const numSegs = segments.length
    const numRings = rings.length
    const angles = calcAngles(numSegs)
    const radii = opts.calcRadii(radius, numRings, numSegs)
    // adjust blip diameter if need be
    const minDiameter = radii.reduce((p: number, c: number, i: number, r: number[]): number => {
        if (p === 0) return c - r[i - 1]
        return Math.min(p, c - r[i - 1])
    })
    opts.blip.dia = Math.min(minDiameter * 0.45, opts.blip.dia)

    //
    // 2) the root svg element
    //
    const svg: Svg = SVG()
        .width('100%')
        .height('100%')
        .viewbox(-opts.diameter / 2, -opts.diameter / 2, opts.diameter, opts.diameter)

    //
    // 3) construct each segment
    //
    for (let i = 0; i < segments.length; i++) {
        // add the actual segment
        addSegment(svg, i, segments[i], rings, angles[i], angles[i + 1], radii, opts)
    }

    //
    // 4) return the SVG element
    //
    return svg
}

const addSegment = function (
    root: any,
    idx: number,
    segment: Segment | string,
    rings: string[],
    startA: number,
    endA: number,
    radii: number[],
    opts: Options
): void {
    // do we have sub segments?
    const hasSubs = typeof segment === 'object' ? true : false
    let label = typeof segment === 'object' ? segment.name : segment

    //
    // 1.) add group
    //
    const group = root.group().attr({
        label: label,
        class: `segment segment-${idx}`,
        'data-angle-start': `${startA}`,
        'data-angle-end': `${endA}`,
    })

    //
    // 2.) Do we have sub segments?
    //
    if (hasSubs) {
        // 2.1) Add sub segments
        const subNames = (segment as Segment).subSegments
        const ofs = (endA - startA) / subNames.length
        for (let i = 0; i < subNames.length; i++) {
            addSubSegment(
                group,
                i,
                subNames[i],
                rings,
                startA + i * ofs,
                startA + (i + 1) * ofs,
                radii,
                opts
            )
        }
    } else {
        // 2.2) Add the rings
        for (let i = 0; i < radii.length - 1; i++) {
            addRing(group, i, rings[i], startA, endA, radii[i], radii[i + 1])
        }
    }

    //
    // 3.) Add the segment lines
    //
    const labelOpts = opts.labels
    const lineOpts = opts.lines
    let radius = radii[radii.length - 1]
    if (lineOpts.segment) {
        radius += labelOpts.segmentOffset + labelOpts.segmentSize
        if (hasSubs) radius += labelOpts.subSegmentOffset + labelOpts.subSegmentSize
    }
    addLines(group, startA, endA, radius, opts.lines.segmentStroke)

    //
    // 4) Add the segment label
    //
    let size = opts.labels.segmentSize
    let offset = opts.labels.segmentOffset
    if (typeof segment === 'object')
        offset += opts.labels.subSegmentOffset + opts.labels.subSegmentSize
    addLabel(group, label, startA, endA, radii[radii.length - 1], offset, size)
}

//
// Adds a sub segment to a given segment
//
const addSubSegment = (
    root: any,
    idx: number,
    name: string,
    rings: string[],
    startA: number,
    endA: number,
    radii: number[],
    opts: Options
) => {
    //
    // 1.) add group
    //
    const group = root.group().attr({
        label: name,
        class: `sub-segment sub-segment-${idx}`,
        'data-angle-start': `${startA}`,
        'data-angle-end': `${endA}`,
    })

    //
    // 2.) Add rings
    //
    for (let i = 0; i < radii.length - 1; i++) {
        addRing(group, i, rings[i], startA, endA, radii[i], radii[i + 1])
    }

    //
    // 3.) Add lines
    //
    const labelOpts = opts.labels
    const lineOpts = opts.lines
    let radius = radii[radii.length - 1]
    if (lineOpts.subSegment) {
        radius += labelOpts.subSegmentOffset + labelOpts.subSegmentSize
    }
    addLines(group, startA, endA, radius, opts.lines.subSegmentStroke)

    //
    // 3.) Add label
    //
    addLabel(
        group,
        name,
        startA,
        endA,
        radii[radii.length - 1],
        opts.labels.subSegmentOffset,
        opts.labels.subSegmentSize
    )
}

//
// Add a ring to a segment
//
const addRing = function (
    root: any,
    idx: number,
    name: string,
    startA: number,
    endA: number,
    startR: number,
    endR: number
): void {
    //
    // 1.) Add the ring's group
    //
    const ring = root.group().attr({
        label: name,
        class: `ring ring-${idx}`,
        'data-radius-inner': `${startR}`,
        'data-radius-outer': `${endR}`,
    })

    //
    // 2.) Find the four coordinates for the ring
    //
    const _1 = polar2cartesian(startR, startA)
    const _2 = polar2cartesian(startR, endA)
    const _3 = polar2cartesian(endR, endA)
    const _4 = polar2cartesian(endR, startA)

    //
    // 3.) Find coordinates for the ring stroke
    //
    const w = endR - startR
    const r = startR + w / 2
    const _5 = polar2cartesian(r, startA)
    const _6 = polar2cartesian(r, endA)

    //
    // 4.) Add the ark that visually fills the ring
    //
    ring.path(`M ${_5.x} ${_5.y} A ${r} ${r} 0 0 1 ${_6.x} ${_6.y}`).attr({
        'stroke-width': `${w}`,
        fill: 'none',
        class: 'arc-stroke',
    })

    //
    // 5. Add the outer path elments that demarcate the ring
    //
    ring.path(`M ${_1.x} ${_1.y} A ${startR} ${startR} 0 0 1 ${_2.x} ${_2.y}`).attr({
        class: 'arc-inner',
    })
    ring.path(`M ${_4.x} ${_4.y} A ${endR} ${endR} 0 0 1 ${_3.x} ${_3.y}`).attr({
        class: 'arc-outer',
    })
    ring.line(_1.x, _1.y, _4.x, _4.y).attr({
        class: 'left-line',
    })
    ring.line(_2.x, _2.y, _3.x, _3.y).attr({
        class: 'right-line',
    })
}

//
// add segment lines to the radar
//
const addLines = (svgElem: any, startA: number, endA: number, radius: number, stroke: number) => {
    // 1.) "Left"  line
    // lines always start at (0, 0).
    // SVG coordinate system is mirrored on x axis hence we need to rotate by 90 degree, i.e. PI/2
    // to get the correct coordinates
    // "Left" line
    let endX = radius * Math.cos(startA - Math.PI / 2)
    let endY = radius * Math.sin(startA - Math.PI / 2)
    svgElem.line(0, 0, endX, endY).attr({ class: 'open', 'stroke-width': stroke })

    //
    // 2.) "Right" line
    //
    endX = radius * Math.cos(endA - Math.PI / 2)
    endY = radius * Math.sin(endA - Math.PI / 2)
    svgElem.line(0, 0, endX, endY).attr({ class: 'close', 'stroke-width': stroke })
}

//
// Add the segment name to the segment
//
const addLabel = (
    root: any,
    name: string,
    startA: number,
    endA: number,
    radius: number,
    offset: number,
    size: number
): void => {
    // need to recalculate the last arc path...
    const _1 = polar2cartesian(radius, startA)
    const _2 = polar2cartesian(radius, endA)

    //
    // 1.) First construct a path we can reference for the label text
    //
    const svg = root.root()
    const arc = svg.defs().path(`M${_1.x} ${_1.y} A${radius} ${radius} 0 0 1 ${_2.x} ${_2.y}`)

    //
    // 2.) COnstrunt the text element
    //
    const text = root.text()
    text.tspan(name).dy(-1 * offset)
    text.attr({ class: 'label' })
    text.font({ size: size, anchor: 'middle' })
    text.path(arc).attr({ startOffset: '50%' })
}
