import { Blip, Options } from './types'

// this will gradually be expanded to include all the default function.
// they will NOT include styling; this must be done by the developer using CSS stylesheets.
export const defaults : Options = {
    bloop: (b: Blip) => { return ""+b.id+", "+b.name }
}
