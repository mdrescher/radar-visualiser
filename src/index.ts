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
    
    const canvas2 = SVG().width('100%').height('100%').viewbox(-1000, -1000, 2000, 2000 )
    canvas2.circle(100)
    console.log()
    console.log(canvas2.svg())
    
    // run the function
    let result = ""
    for (let blip of blips) {
        result += opts.bloop(blip) + '\n'
    }
    return result
}

render([])