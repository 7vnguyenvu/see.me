export function numberConvert(number: number | undefined): string {
    if (!number) return "-";

    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(1) + "B";
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    } else {
        return number.toLocaleString();
    }
}
