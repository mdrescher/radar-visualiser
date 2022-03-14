/**
 * A radar is made up of a number of segments. A segment MAY have a number of sub-segments.
 * In that case, the system accepts Segment[] arrays as input.
 * If subsegments are not used, use a string[] to declare the segments for the radar.
 * Semantically, ['One', 'Two', 'Three'] and
 * [{name: 'One', subSegments: []}, name: 'Two', subSegments: []}, name: 'Three', subSegments: []}]
 * are equivalent.
 * Note that segments may have different subsegments in names and numbers!
 */
export type Segment = {
    name: string
    subSegments: string[]
}

/**
 * A blip conveys core information about where and how the blip is visualised
 * in the radar.
 * A blip may also convey a payload - domain specific information that will be added
 * in the HTML 5 SVG blip element as a data attribute, stored as a JSON object.
 */
export type Blip = {
    id: number // each blip has a numeric ID...
    name: string // .. and a name.
    segment: string // the segment the blip shall be placed in
    subsegment?: string // and perhaps a subsegment
    ring: string // the ring the blip shall be placed in
    payload?: object // it may also have a payload whose fields will be stored in JSON format in the blip as HTML "data" attributes
}

/**
 * A function to calculate the thickness of the rings of the radar.
 * Two functions are provided;
 * 1. Compute equal thickness (function defaults/radii/sameRadii), and
 * 2. Same geometric area for all rings (function defaults/radii/sameArea)
 *
 * The default function is "sameRadii".
 *
 * @param radius the radius of the entire radar, as calculated by this library
 * @param numRings the number of rings in the radar
 * @param numSegs the number of segments in the radar
 * @returns an array of numbers of radii for the rings. MUST contain '0' as the first radius.
 */
export type calcRadiiFn = {
    (radius: number, numRings: number, numSegs: number): number[]
}

/**
 * A wrapper for the centerpoint of a blip.
 */
export type Coord = {
    x: number
    y: number
}

/**
 * A container for three styling parameters to be set on the blip shape.
 * @param fill The fill colour for the blip shape
 * @param stroke The colour of the shape's line
 * @param strokeWidth The thickness of the shape's stroke
 */
export type BlipStyle = {
    fill: string // the CSS value for the CSS "fill" attribute for the shape.
    stroke: string // the CSS value for the CSS "stroke" attribute for the shape.
}

/**
 * Calculate the blip style for the given blip.
 * @param blip The Blip to return the drawing style for
 */
export type getBlipStylesFn = {
    (blip: Blip): BlipStyle
}

/**
 * Draw the shape for the given blip
 * @param blip The blip to draw the shape for.
 * @param group The SVG.js container in which the shape must be drawn.
 * @param diameter The diameter of the shape's square hitbox the shape must not exceed
 * @param coords The centrepoint of the shape
 */
export type blipShapeFn = {
    (blip: Blip, group: any, diameter: number, coords: Coord): any
}

export enum Reasons {
    'Segment not found',
    'Subsegment not found',
    'Ring not found',
    'No suitable coordinates found',
}

/**
 * Called whenever a blip has been skipped in placement, with a pre-defined reason
 */
export type blipSkippedFn = {
    (blip: Blip, reason: Reasons): void
}

/**
 * Called whenever a blip was successfully placed in the radar
 */
export type blipPlacedFn = {
    (blip: Blip): void
}

/**
 * A data structure used to pass in options for a flexible and customisable rendering
 * of the radar.
 * While mostly a conduit to pass in function for certain calculations, it also contains
 * a minimum of specific rendering parameters for text elements.
 * As a general approach, all styling that CAN be achieved using CSS will be left to
 * CSS, with SVG elements carrying classes to allow effective and efficient styling.
 *
 * A default set of options profides useful values for all fields, which may be overridden
 * by supplying an options object that overrides all (or a subset) of the default options.
 */
export type Options = {
    // the diameter of the radar including the sector labels.
    // Used to set the SVG viewport, and to calculate the actual radius of the radar
    diameter: number
    // information realted to the blips
    blip: {
        // The maximum diameter of all blips in the radar. In very populated radars, some blips may
        // be reduced in sise to find suitable coordinates.
        // PLEASE NOTE: The module will reduce this to half the thickness of the thinnest
        // radar ring, if need be.
        dia: number
        // the stroke-width of the blip. Necessary to calculate placements to not overlap each other or segment & ring lines
        stroke: number
        // The font to use for the blip's label. Required here to enable proper alignment of
        // the text in the centre of the SVG. Use CSS font values.
        font: string
        // The weight of the text, expressed in CSS values (e.g. '700', 'bold', etc.)
        // Required here to enable proper alignment of the text in the centre of the SVG.
        weight: string
        // The font size of the blip label.
        // Required here to enable proper alignment of the text in the centre of the SVG.
        // Use unit-less numbers!!
        size: number
    }
    // label settings
    labels: {
        // the offset of the segment label from the last ring's outer edge (or the subsegment label)
        segmentOffset: number
        // the size of the label relative to the entire SVG (as a unitless nummber)
        segmentSize: number
        // sub-segment offset from the last ring's outer edge
        subSegmentOffset: number
        // the size of the label relative to the entire SVG (as a unitless nummber)
        subSegmentSize: number
    }
    // controlling extension of lines
    lines: {
        // Segment separation lines extend to the segment label
        segment: true
        // stroke width of the segment line
        segmentStroke: number
        // Sub-segment separation lines extend to the segment label
        subSegment: true
        // stroke width of the sub segment line
        subSegmentStroke: number
    }
    // the function calculating the radii for the radar. Use either of the supplied
    // functions, or write your own.
    calcRadii: calcRadiiFn
    // callback for blips being skipped
    blipSkipped: blipSkippedFn
    // callback for blips that have been successfully placed
    blipPlaced: blipPlacedFn
    // function drawing the blip shape
    blipShape: blipShapeFn
    // function to determine the fill and stroke colour
    getBlipStyles: getBlipStylesFn
}
