export type Blip = {
    id: number
    name: string
}

export type Options = {
    bloop: (b: Blip) => void  // test function
}

const defaults = {
    bloop: (b: Blip) => { return ""+b.id+", "+b.name }
}

export const render = function(blips: Iterable<Blip>, options?: Options): string {
    // construct an options set
    let opts = options === undefined ? defaults : {...defaults, ...options}

    // run the function
    let result = ""
    for (let blip of blips) {
        result += opts.bloop(blip) + '\n'
    }
    return result
}
