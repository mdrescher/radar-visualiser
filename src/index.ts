import { isNode } from 'browser-or-node'
import { createSVGWindow } from 'svgdom'
const { SVG, registerWindow } = require('@svgdotjs/svg.js') // I HATE this...

import { calcAngles } from './util/math'
import { Blip, LabelOptions, Options } from './types'
import { defaults } from './defaults/defaults'
import { sameRadii } from './defaults/functions/radii'

//
// exposed API for the renderer
//
export const render = function (
    blips: Iterable<Blip>, // an iterator of blips
    segments: string[], // the radar segments
    rings: string[], // the radar rings
    options?: object // options for calculating aspects of the radar
    // TODO - add CSS options for self-contained SVG?
): string {
    // must have at least one segment and one ring
    if (segments.length < 1 || rings.length < 1) {
        throw 'segments or rings empty.'
    }

    // construct an options set
    let opts: Options = options === undefined ? defaults : { ...defaults, ...options }

    // if we run in a node env we need to register a fake browser window before we go ahead
    if (isNode) {
        const svg_window = createSVGWindow()
        const svg_document = svg_window.document
        // register window and document
        registerWindow(svg_window, svg_document)
    }

    // do the plotting and return the result
    return plotRadar(blips, segments, rings, opts)
}

//
// The actual radar rendering function
//
const plotRadar = function (
    blips: Iterable<Blip>, // an iterator of blips
    segments: string[], // the radar segments
    rings: string[], // the radar rings
    opts: Options // options for calculating aspects of the radar
): string {
    //
    // 1) Create the complete radar visual
    //
    const root = constructRadar(segments, rings, opts)

    // run the function - currently a test function from the options.
    // Will be removed and gradually replaced by actual code
    let result = ''
    for (let blip of blips) {
        // result += opts.bloop(blip) + '\n'
    }

    return root.svg()
}

//
// constructs the complete radar based on the given segments, rings, and options
//
const constructRadar = function (segments: string[], rings: string[], opts: Options): any {
    //
    // 1) calculate some base values
    //
    const radius =
        (opts.diameter - 2 * opts.ringStroke - 2 * opts.label.offset - 2 * opts.label.size) / 2
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

    // temporary to stop TypeScript from whining
    for (let j = 0; j < rings.length; j++) {}

    // // TEMPORARY -- BEGIN
    // // draw some lines
    // for (let i = 0; i < angles.length - 1; i++) {
    //     drawLine(svgElem, angles[i], angles[i + 1], radii[radii.length - 1])
    // }
    // // draw the circles
    // // for now draw only one arc
    // drawRing(svgElem, angles[2], angles[3], radii[0], radii[1])

    // return the SVG element
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
    // 2) add the embracing lines
    addLines(seg, angles[idx], angles[idx + 1], radii[radii.length - 1])

    // TODO add here a hook to add "sub lines?"

    // 3) add the rings
    let last: any
    for (let i = 0; i < radii.length - 1; i++) {
        const ring = seg.group().attr({ class: `ring ring-${i}` })
        last = addRing(ring, angles[idx], angles[idx + 1], radii[i], radii[i + 1])
    }
    // 4) add the segment name
    addSegmentName(seg, angles[idx], angles[idx + 1], radii[radii.length - 1], name, opts.label)
}

//
// add segment lines to the radar
//
const addLines = (svgElem: any, startA: number, endA: number, radius: number) => {
    // 1.) "Left" and "Right" lines
    // lines always start at (0, 0).
    // SVG coordinate system is mirrored on x axis hence we need to rotate by 90 degree, i.e. PI/2
    // to get the correct coordinates
    // "Left" line
    let endX = radius * Math.cos(startA - Math.PI / 2)
    let endY = radius * Math.sin(startA - Math.PI / 2)
    svgElem.line(0, 0, endX, endY).attr({ class: 'open' }).stroke({ color: '#000', width: 1 })
    // "Right" line
    endX = radius * Math.cos(endA - Math.PI / 2)
    endY = radius * Math.sin(endA - Math.PI / 2)
    svgElem.line(0, 0, endX, endY).attr({ class: 'close' }).stroke({ color: '#000', width: 1 })
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
    const ring = root.path(path).attr({ fill: 'none', stroke: '#000' })
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
    opts: LabelOptions
): void => {
    // need to recalculate the last arc path...
    let x = radius * Math.cos(startA - Math.PI / 2)
    let y = radius * Math.sin(startA - Math.PI / 2)
    const path = `M${x} ${y} ${arcPath(endA, radius, 1)} `

    // now add the text path to the segment group
    const text = root.text()
    text.font({ family: opts.font, size: opts.size, weight: 'bold', anchor: 'middle' })
    const tspan = text.tspan(name).dy(-1 * opts.offset)
    const textPath = text.path(path)
    textPath.attr({ startOffset: '50%' })
}

console.log(
    render([], ['Segment 1', 'Segment 2', 'Segment 3'], ['Ring 1', 'Ring 2', 'Ring 3', 'Ring 4'], {
        calcRadii: sameRadii,
    })
) // this should be a test of sorts
