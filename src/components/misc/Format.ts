
export function formatDate(locale: string, date: Date) {
    return date.toLocaleDateString(locale, {
        month: "2-digit",
        day: "2-digit",
        year: "numeric"
    });
}

export function getDecimalPlaces(currency: string) {
    const numberFormatUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency });
    return numberFormatUSD.formatToParts(1).find(part => part.type === "fraction")?.value.length ?? 0;
}

export function getZeroValue(decimalPlaces: number) {
    if (decimalPlaces === 0)
        return '0';
    else
        return '0.' + '0'.repeat(decimalPlaces);
}

export function getCurrencySymbol(locale: string, currency: string) {
    return (0).toLocaleString(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })
        .replace(/\d/g, '')
        .trim();
}