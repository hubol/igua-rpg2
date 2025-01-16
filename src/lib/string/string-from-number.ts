function getPercentageNoDecimal(numerator: number, denominator: number) {
    if (numerator === 0) {
        return "0%";
    }
    if (numerator === denominator) {
        return "100%";
    }

    const value = Math.round((numerator / denominator) * 100);

    if (numerator > denominator) {
        return Math.max(101, value) + "%";
    }
    if (numerator > 0) {
        return Math.max(1, Math.min(99, value)) + "%";
    }

    return Math.min(-1, value) + "%";
}

export const StringFromNumber = {
    getPercentageNoDecimal,
};
