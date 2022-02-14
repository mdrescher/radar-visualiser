import { isNode} from 'browser-or-node'
import { createSVGWindow } from 'svgdom'
const { SVG, registerWindow } = require('@svgdotjs/svg.js') // I HATE this...


if (isNode) {
    const svg_window = createSVGWindow()
    const svg_document = svg_window.document
    // register window and document
    registerWindow(svg_window, svg_document)
}


import { Blip, Options } from './types'
import { defaults } from './defaults' 

export const render = function(blips: Iterable<Blip>, 
                              //  segments?: string[], rings?: string[],
                               options?: Options): string {
    // construct an options set
    let opts = options === undefined ? defaults : {...defaults, ...options}
    
    // start by creating the root SVG element
    const svgElem = SVG().width('100%').height('100%').viewbox(-1000, -1000, 2000, 2000 )

    svgElem.circle(100) // temporary, will be replaced by actual code

    // run the function - currently a test function from the options.
    // Will be removed and gradually replaced by actual code
    let result = ""
    for (let blip of blips) {
        result += opts.bloop(blip) + '\n'
    }
    return svgElem.svg()
}

console.log(render([])) // this should be a test of sorts