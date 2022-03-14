import { isNode } from 'browser-or-node'
import { createSVGWindow } from 'svgdom'
const { registerWindow } = require('@svgdotjs/svg.js') // I HATE this...

import { Segment, Blip, Options } from './types'
import { defaults } from './defaults'
import { constructRadar } from './render/render'
import { placeBlips } from './render/blipPlacer'
import { deepMerge } from './util/util'

//
// exposed API for the renderer
//
export const render = function (
    blips: Iterable<Blip>, // an iterator of blips
    segments: Segment[] | string[], // the radar segments
    rings: string[], // the radar rings
    options?: object // options for calculating aspects of the radar
    // TODO - add CSS options for self-contained SVG?
): string {
    // must have at least one segment and one ring
    if (segments.length < 1 || rings.length < 1) {
        throw 'segments or rings empty.'
    }

    // construct an options set
    let opts: Options = options === undefined ? defaults : deepMerge(defaults, options)

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
    segments: Segment[] | string[], // the radar segments
    rings: string[], // the radar rings
    opts: Options // options for calculating aspects of the radar
): string {
    //
    // 1) Create the complete radar visual
    //
    const radar = constructRadar(segments, rings, opts)

    //
    // 2) Place the blips in the radar
    //
    placeBlips(blips, radar, opts)

    //
    // 3) Return the radar as SVG
    //
    return radar.svg()
}
