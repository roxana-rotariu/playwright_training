import { randomBytes } from "node:crypto";

export const DataHelper = {
    randomString(length = 8): string {
        const chars =  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    },
    randomEmail(): string {
        return `test${Math.random()}@example.com`;
    },
    randomName(): string {
        const name = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy', 'Mallory', 'Niaj', 'Olivia', 'Peggy', 'Rupert', 'Sybil', 'Trent', 'Victor', 'Walter'];
        return name[Math.floor(Math.random() * name.length)];
    }
}