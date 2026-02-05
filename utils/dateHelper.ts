export const DateHelper = {

    // YYYY-MM-DD for today
    today(): string {
        return new Date().toISOString().split('T')[0];
    },

    // Add X days to today → YYYY-MM-DD
    addDays(days: number): string {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    },

    // Yesterday → YYYY-MM-DD
    yesterday(): string {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
    },

    // Add months
    addMonths(months: number): string {
        const date = new Date();
        date.setMonth(date.getMonth() + months);
        return date.toISOString().split('T')[0];
    },

    // Format a given date as YYYY-MM-DD
    format(date: Date): string {
        return date.toISOString().split('T')[0];
    },

    // Full ISO timestamp (useful for logging)
    timestamp(): string {
        return new Date().toISOString();
    },

    // Human readable (for reporting)
    humanReadable(): string {
        return new Date().toLocaleString();
    }
};