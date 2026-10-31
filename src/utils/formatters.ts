export function formatDateTime(value: string): string {
    return new Date(value).toLocaleString();
}
export function toIsoDate(value: string): string {
    return new Date(value).toISOString();
}
export function toDateTimeLocal(value: string): string {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const offset = date.getTimezoneOffset() * 60_000;

    return new Date(date.getTime() - offset)
        .toISOString()
        .slice(0, 16);
}
