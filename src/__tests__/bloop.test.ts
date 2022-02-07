import { Blip, Options, render } from '../index';


const blooper = function (b: Blip) {
    return `Blip ${b.id} has name ${b.name}`
}

const options = {
    bloop: blooper
}

const blips = [
    {id: 1, name: "One"},
    {id: 2, name: "Two"},
    {id: 3, name: "Three"},
    {id: 4, name: "Four"},
    {id: 5, name: "Five"},
]

test('No options', () => {
    expect(render(blips)).toBe('1, One\n2, Two\n3, Three\n4, Four\n5, Five\n')
})

test('With options', () => {
    expect(render(blips, options)).toBe(
        'Blip 1 has name One\n' +
        'Blip 2 has name Two\n' +
        'Blip 3 has name Three\n' +
        'Blip 4 has name Four\n' +
        'Blip 5 has name Five\n')
})
