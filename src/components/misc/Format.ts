

export function formatDate(locale: string, date: Date) {
    return date.toLocaleDateString(locale, {
        month: "2-digit",
        day: "2-digit",
        year: "numeric"
    });
}