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
    geometry: {
        // the diameter of the radar including the sector labels.
        // Used to set the SVG viewport, and to calculate the actual radius of the radar
        diameter: number
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
        // Sub-segment separation lines extend to the segment label
        subSegment: true
    }
    // the function calculating the radii for the radar. Use either of the supplied
    // functions, or write your own.
    calcRadii: calcRadiiFn
}
