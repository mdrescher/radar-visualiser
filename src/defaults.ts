import { Blip, Options } from './types'

export const defaults : Options = {
    bloop: (b: Blip) => { return ""+b.id+", "+b.name }
}
