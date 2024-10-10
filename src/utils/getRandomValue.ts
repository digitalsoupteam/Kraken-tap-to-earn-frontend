const getRandomValue = (min: number, max?: number, floating?: boolean): number => {
    if (floating) {
        throw new Error('Expected floating to be a boolean');
    }

    if (max === undefined) {
        max = min;
        min = 0;
    } else {
        min = +min || 0;
        max = +max || 0;
    }

    if (min > max) {
        [min, max] = [max, min];
    }

    const result = Math.random() * (max - min) + min;

    return floating ? result : Math.floor(result);
}

export default getRandomValue;
