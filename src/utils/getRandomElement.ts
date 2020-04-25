const getRandomElement = <T>(target: Array<T>, count: number): Array<T> => {
    let result = new Array(count),
        len = target.length,
        taken = new Array(len)
    while (count--) {
        let x = Math.floor(Math.random() * len)
        result[count] = target[x in taken ? taken[x] : x]
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result
}