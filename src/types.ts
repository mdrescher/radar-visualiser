export type Blip = {
    id: number
    name: string
}

export type calcRadiiFn = {
    (radius: number, numRings: number, numSegs: number): number[]
}

export type Options = {
    diameter: number
    ringStroke: number
    segmentName: number
    calcRadii: calcRadiiFn
}
