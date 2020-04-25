const hasOne = <T>(haystack: Array<T>, arr: Array<T>): boolean => {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
};

export default hasOne