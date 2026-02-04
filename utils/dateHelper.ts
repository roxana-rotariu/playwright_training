export const dateHelper = {
    today(): string {
        return new Date().toISOString().split('T')[0]
    },
    addDays(days: number): string{
        const date = new Date()
        date.setDate(date.getDate() + days)
        return date.toISOString().split('T')[0]
    }
}