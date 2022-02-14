
const defaults = {
    a: "a",
    b: "b",
}

const opts_disjunct = {
    c: "c",
    d: "d",
}

const opts_overlap = {
    b: "b_new",
    c: "c",
}

test('Defaults only', () => {
    expect({...defaults}).toEqual(defaults)
})

test('Disjunct options', () => {
    expect({...defaults, ...opts_disjunct}).toEqual(
        {a: "a", b: "b", c: "c", d: "d"}
    )
})

test('Overlapping options options', () => {
    expect({...defaults, ...opts_overlap}).toEqual(
        {a: "a", b: "b_new", c: "c"}
    )
})
