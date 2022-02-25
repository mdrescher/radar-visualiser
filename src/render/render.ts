import { SVG } from '@svgdotjs/svg.js'

import { Options } from '../types'
import { calcAngles } from '../util/math'

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
    const seg = root.group().attr({ label: name, class: `segment segment-${idx}` })
    // 2) add the rings
    let last: any
    for (let i = 0; i < radii.length - 1; i++) {
        const ring = seg.group().attr({ class: `ring ring-${i}` })
        last = addRing(ring, angles[idx], angles[idx + 1], radii[i], radii[i + 1])
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
const addRing = function (root: any, startA: number, endA: number, startR: number, endR: number) {
    console.log(startA, endA, startR, endR)
    // find the start and en coords for the lower arc
    let x = startR * Math.cos(startA - Math.PI / 2)
    let y = startR * Math.sin(startA - Math.PI / 2)
    // compile the first arc commands
    let path = `M${x} ${y} ${arcPath(endA, startR, 1)} `
    // add the "right" line up to the upper arch
    x = endR * Math.cos(endA - Math.PI / 2)
    y = endR * Math.sin(endA - Math.PI / 2)
    // console.log(endX, endY)
    path += `L${x} ${y} `
    // add the "upper" arc and close the path
    path += `${arcPath(startA, endR, 0)} Z`
    // add the path to the SVG
    const ring = root.path(path)
    return ring
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
    let x = radius * Math.cos(startA - Math.PI / 2)
    let y = radius * Math.sin(startA - Math.PI / 2)
    const path = `M${x} ${y} ${arcPath(endA, radius, 1)} `

    // now add the text path to the segment group
    const text = root.text()
    text.font({ size: opts.labelSize, anchor: 'middle' })
    const tspan = text.tspan(name).dy(-1 * opts.labelOffset)
    const textPath = text.path(path)
    textPath.attr({ startOffset: '50%' })
}
