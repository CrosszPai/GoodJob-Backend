const groupBy = <T>(target: T[], key: string) => {
    return target.reduce((r, a) => {
        r[a[key]] = [...r[a[key]] || [], a]
        return r
    })
}
