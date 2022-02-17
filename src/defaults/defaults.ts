import { Blip, Options } from '../types'
import { sameArea } from './functions/radii'

export const defaults: Options = {
    diameter: 2000,
    ringStroke: 2,
    label: {
        font: 'Verdana',
        size: 40,
        offset: 20,
        color: '#000000',
    },
    calcRadii: sameArea,
}
