/**
 * Removes properties with undefined values from an object.
 * Returns a new object without mutating the original.
 */
export function cleanObject<T extends object>(obj: T): Partial<T> {
    const result: any = { ...obj };
    Object.keys(result).forEach((key) => {
        if (result[key] === undefined) {
            delete result[key];
        }
    });
    return result;
}

/**
 * Picks specific keys from an object.
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
}
