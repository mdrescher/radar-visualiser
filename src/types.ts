export type Blip = {
    id: number
    name: string
}

export type Options = {
    diameter: number
    ringStroke: number
    segmentName: number
    bloop: (b: Blip) => void // test function
}
