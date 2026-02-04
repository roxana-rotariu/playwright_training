export const IdHelper = {
    uniqueId(prefix = 'id'): string {
        return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
    }
}