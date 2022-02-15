import { isNode } from 'browser-or-node'
import { createSVGWindow } from 'svgdom'
const { SVG, registerWindow } = require('@svgdotjs/svg.js') // I HATE this...

import { calcAngles } from './util/math'
import { Blip, Options } from './types'
import { defaults } from './defaults'

//
// exposed API for the renderer
//
export const render = function (
    blips: Iterable<Blip>, // an iterator of blips
    segments: string[], // the radar segments
    rings: string[], // the radar rings
    options?: object // options for calculating aspects of the radar
): string {
    // must have at least one segment and one ring
    if (segments.length == 0 || rings.length == 0) {
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
    // 1) calculate some base values
    const radius = (opts.diameter - 2 * opts.ringStroke - 2 * opts.segmentName) / 2
    const numSegs = segments.length
    const numRings = rings.length
    const angles = calcAngles(numSegs)
    // const radii = equiSpatialRadii(numSegs, numRings, radius)

    console.log('radius =', radius)
    console.log('numSegs =', numSegs)
    console.log('numRings =', numRings)
    console.log('angles =', angles)

    //
    // start by creating the root SVG element
    const svgElem = SVG()
        .width('100%')
        .height('100%')
        .viewbox(-opts.diameter / 2, -opts.diameter / 2, opts.diameter, opts.diameter)

    svgElem.circle(2 * radius).attr({ cx: 0, cy: 0, fill: 'none', stroke: '#000' }) // temporary, will be replaced by actual code

    // run the function - currently a test function from the options.
    // Will be removed and gradually replaced by actual code
    let result = ''
    for (let blip of blips) {
        result += opts.bloop(blip) + '\n'
    }

    return svgElem.svg()
}

console.log(render([], ['Seg 1', 'Seg 2'], ['Ring 1', 'Ring 2'])) // this should be a test of sorts
