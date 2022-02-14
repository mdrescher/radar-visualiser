import { isNode} from 'browser-or-node'
import { createSVGWindow } from 'svgdom'
const { SVG, registerWindow } = require('@svgdotjs/svg.js') // I HATE this...


if (isNode) {
    const svg_window = createSVGWindow()
    const svg_document = svg_window.document
    // register window and document
    registerWindow(svg_window, svg_document)
}

// create canvas
// const canvas = SVG(svg_document.documentElement)
// // large canvas for accuracy, responsive autoscaling with full width and height
// canvas.width('100%').height('100%').viewbox(-1000, -1000, 2000, 2000 )

// // use svg.js as normal
// canvas.rect(100, 100).fill('yellow').move(50,50)


// alternative!?
const canvas2 = SVG().width('100%').height('100%').viewbox(-1000, -1000, 2000, 2000 )
canvas2.circle(100)

// get your svg as string
// console.log(canvas.svg())
// or
// console.log(canvas.node.outerHTML)
console.log()
console.log(canvas2.svg())