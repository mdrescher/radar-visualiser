import { Blip, Coord, Reasons, BlipStyle } from '../types'

export const blipStyles = (blip: Blip): BlipStyle => {
    const result = {
        fill: 'white',
        stroke: 'black',
    }

    if (blip.ring === 'Ring 1') result.stroke = 'red'
    else if (blip.ring === 'Ring 2') result.stroke = 'orange'
    else if (blip.ring === 'Ring 3') result.stroke = 'yellow'
    else if (blip.ring === 'Ring 4') result.stroke = 'limegreen'
    else result.stroke = 'green'

    return result
}

export const circle = (blip: Blip, group: any, diameter: number, coords: Coord): any => {
    if (blip) {
    }
    return group.circle(diameter).cx(coords.x).cy(coords.y)
}

export const square = (blip: Blip, group: any, diameter: number, coords: Coord): any => {
    if (blip) {
        // keep the compiler happy
    }
    return group.rect().width(diameter).height(diameter).cx(coords.x).cy(coords.y)
}

export const equiTriangle = (blip: Blip, group: any, diameter: number, coords: Coord): any => {
    if (blip || coords) {
        // keep the compiler happy
    }
    const factor = 520 / 600
    let x1 = 0
    let y1 = (-1 * diameter) / 2
    let points = `${x1},${y1} `
    x1 = diameter / 2
    y1 = factor * diameter - diameter / 2
    points += `${x1},${y1} `
    x1 = (-1 * diameter) / 2
    points += `${x1},${y1}`
    return group
        .polygon(points)
        .cx(coords.x)
        .cy(coords.y - 5)
}

export const isoTriangle = (blip: Blip, group: any, diameter: number, coords: Coord): any => {
    if (blip || coords) {
        // keep the compiler happy
    }
    let x2 = 0
    let y2 = (-1 * diameter) / 2
    let points = `${x2},${y2} `
    x2 = diameter / 2
    y2 = diameter / 2
    points += `${x2},${y2} `
    x2 = (-1 * diameter) / 2
    y2 = diameter / 2
    points += `${x2},${y2}`
    return group
        .polygon(points)
        .cx(coords.x)
        .cy(coords.y - 7)
}

export const blipSkipped = (blip: Blip, reason: Reasons): void => {
    console.log(`Blip \"${blip.id} - ${blip.name}\" not placed: ${Reasons[reason]}`)
}

export const blipPlaced = (blip: Blip): void => {
    console.log(`Blip \"${blip.id} - ${blip.name}\" successfully placed in radar`)
}
