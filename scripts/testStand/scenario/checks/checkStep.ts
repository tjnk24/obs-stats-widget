export const checkStep = (name: string, actual: unknown, expected: unknown) => {
    if (actual !== expected) {
        throw new Error(`${name}: got ${String(actual)}, expected ${String(expected)}`);
    }

    console.log(`ok   ${name}`);
};
