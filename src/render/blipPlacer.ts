// libraries
import Chance from 'chance'
import { Dom, SVG, Svg } from '@svgdotjs/svg.js'

// module types and functions
import { Blip, Coord, Options, Reasons, BlipStyle } from '../types'
import { toDegree, toRadian } from '../util/math'

// CONSTANTS
const CHANCE = new Chance(Math.PI)
const MAX_ITERATIONS = 200

//
// Place the blips in the radar
//
export const placeBlips = (blips: Iterable<Blip>, radar: Svg, opts: Options) => {
    const allCoords = new Map<Dom, [Coord]>()
    //
    // 1) Iterate through all blips (projects) and add to ring
    //
    for (let blip of blips) {
        // 1.1) Find the ring arc in which to place the blip
        const ringNode: Dom | null = findRing(radar, blip, opts)
        if (!ringNode) continue

        // 1.2) Find coordinates within (sub-)segment and ring
        const coords = findBlipCoords(ringNode, allCoords, opts)
        if (!coords) {
            opts.blipSkipped(blip, Reasons['No suitable coordinates found'])
            return
        }

        // 1.3) draw the blip
        constructBlip(ringNode, blip, coords, opts)

        // 2.6 // call opts callback that the blip was placed
        opts.blipPlaced(blip)
    }
}

//
// Find the ring in which the blip is to be placed
//
const findRing = (radar: Svg, blip: Blip, opts: Options): Dom | null => {
    // check for the segment
    let node: Dom | null = radar.findOne(`g.segment[label=${blip.segment}]`)
    if (!node) {
        opts.blipSkipped(blip, Reasons['Segment not found'])
        return null
    }

    // check for the sub segment, if any
    if (blip.subsegment) {
        node = node.findOne(`g.sub-segment[label=${blip.subsegment}]`)
        if (!node) {
            opts.blipSkipped(blip, Reasons['Subsegment not found'])
            return null
        }
    }

    // check for the ring
    node = node.findOne(`g.ring[label=${blip.ring}]`)
    if (!node) {
        opts.blipSkipped(blip, Reasons['Ring not found'])
        return null
    }

    // happy days, a node was found!
    return node
}

//
// Find coordinates for the blip in its ring arc
//
const findBlipCoords = (node: Dom, allCoords: Map<Dom, [Coord]>, opts: Options): Coord | null => {
    let dia = opts.blip.dia
    let stroke = opts.blip.stroke
    let lineStroke = Math.max(opts.lines.segmentStroke, opts.lines.segmentStroke)

    // 1) Initial coordinates
    let coordinates = pickCoords(node, dia, stroke, lineStroke)

    // 2) Try for MAX_ITERATIONS times to find coordinates before going a size smaller
    //
    let iterationCounter = 0
    let foundAPlace = false
    while (iterationCounter < MAX_ITERATIONS) {
        if (thereIsCollision(allCoords, node, coordinates, dia, stroke)) {
            coordinates = pickCoords(node, dia, stroke, lineStroke)
        } else {
            foundAPlace = true
            allCoords.get(node)?.push(coordinates)
            break
        }
        iterationCounter++
    }

    //
    // 3) If still no coordinates found, recurse with a smaller blip diameter
    //
    if (!foundAPlace) {
        dia -= 2
        return findBlipCoords(node, allCoords, opts)
    } else {
        return coordinates
    }
}

//
// Find a random pair of coordinates
//
const pickCoords = (node: Dom, dia: number, stroke: number, lineStroke: number): Coord => {
    //
    // 1) Fetch start angle, end angle, start radius and end radius
    //
    const startA = toDegree(node.parent()!.attr('data-angle-start'))
    const endA = toDegree(node.parent()!.attr('data-angle-end'))
    const innerR: number = node.attr('data-radius-inner')
    const outerR: number = node.attr('data-radius-outer')

    //
    // 1) Randomly select a radius for a blip within the blip's arc
    //
    const p1 = innerR + stroke + dia / 2
    const p2 = 0
    //adjust p2 only for the inner ring with innerR === 0!
    // as per https://math.stackexchange.com/questions/272151/given-the-base-and-angles-of-an-isosceles-triangle-how-to-find-length-of-the-tw
    if (innerR === 0) {
        const theta = (180 - (endA - startA)) / 2
        let p2 = innerR + stroke + ((dia + 2.5 * lineStroke) / 2) * Math.tan(toRadian(theta))
    }
    const radius = CHANCE.floating({
        min: Math.max(p1, p2),
        max: outerR - stroke - dia / 2,
    })

    //
    // 2) Randomly pick an angle relative to the segment's start and end angle
    //
    //    a. Establish the start and end angle in DEG
    //    b. "delta" controls that the blip does not clip the segment lines
    let delta = toDegree(Math.asin(dia / radius))
    delta = delta > (endA - startA) / 2 ? (endA - startA) / 2 : delta
    let min = startA + delta
    let max = endA - delta
    if (max < min) max = min
    let angle = CHANCE.floating({ min: min, max: max })

    //
    // 3) - Translate polar coordinates into cartesian coordinates (while respecting
    // the inverted y axis of computer graphics)
    var x = radius * Math.cos(toRadian(angle - 90))
    var y = radius * Math.sin(toRadian(angle - 90))
    return { x, y }
}

//
// Detects if there is a collision between the picked coordinates and already existing coordinates
//
const thereIsCollision = (
    allCoords: Map<Dom, Coord[]>,
    node: Dom,
    coords: Coord,
    dia: number,
    stroke: number
): boolean => {
    // no entry? create an empty one!
    if (!allCoords.get(node)) {
        allCoords.set(node, new Array<Coord>())
    }
    let ringCoords = allCoords.get(node)
    // find out if we have a collision
    return ringCoords!.some(
        (c) => Math.abs(c.x - coords.x) < dia + stroke && Math.abs(c.y - coords.y) < dia + stroke
    )
}

//
// Constructs the group of SVG elements that comprise the blip
//
const constructBlip = (ringNode: any, blip: Blip, coords: Coord, opts: Options): void => {
    // 1) A blip is a group of several other SVG elements that are held together by a G container
    const blipGroup = ringNode.group().attr({
        label: `${blip.id}. ${blip.name}`,
        class: 'blip',
        id: `blip-${blip.id}`,
        'data-tooltip': `${blip.id}. ${blip.name}`,
        'data-num-id': blip.id,
        'data-segment': blip.segment,
        'data-ring': blip.ring,
    })
    if (blip.subsegment) blipGroup.attr({ 'data-sub-segment': blip.subsegment })
    if (blip.payload) blipGroup.attr({ 'data-payload': JSON.stringify(blip.payload) })

    // 2) add the SVG shape as per user-supplied function
    const blipShape = opts.blipShape(blip, blipGroup, opts.blip.dia, coords)
    const blipStyle = opts.getBlipStyles(blip)
    blipShape.attr({
        fill: blipStyle.fill,
        stroke: blipStyle.stroke,
        'stroke-width': opts.blip.stroke,
    })

    // 3) Add the id as the text element on top of it
    blipGroup
        .text(blip.id)
        .font({
            family: opts.blip.font,
            size: opts.blip.size,
            weight: opts.blip.weight,
            anchor: 'middle',
        })
        .cx(coords.x)
        .cy(coords.y)

    // 4) Add the payload as a data attribute
    if (blip.payload) {
        blipGroup.data('payload', JSON.stringify(blip.payload))
    }
}
