import { randomBytes } from "node:crypto";

export const DataHelper = {
    
    // Fast, strong random alphanumeric string
    randomString(length = 8): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    // Secure random string using crypto (optional)
    secureRandomString(length = 12): string {
        return randomBytes(length).toString('hex').slice(0, length);
    },

    // Better random email
    randomEmail(domain = "example.com"): string {
        const unique = Date.now() + "_" + Math.floor(Math.random() * 10000);
        return `user_${unique}@${domain}`;
    },

    // Random first name
    randomName(): string {
        const names = [
            'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank',
            'Grace', 'Heidi', 'Ivan', 'Judy', 'Mallory', 'Niaj',
            'Olivia', 'Peggy', 'Rupert', 'Sybil', 'Trent', 'Victor', 'Walter'
        ];
        return names[Math.floor(Math.random() * names.length)];
    },

    // Random last name
    randomLastName(): string {
        const last = [
            "Smith", "Johnson", "Williams", "Brown", "Jones",
            "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"
        ];
        return last[Math.floor(Math.random() * last.length)];
    },

    // Random full name
    randomFullName(): string {
        return `${this.randomName()} ${this.randomLastName()}`;
    },

    // Random password
    randomPassword(length = 10): string {
        return this.secureRandomString(length);
    },

    // Random phone number
    randomPhone(): string {
        return "+1" + Math.floor(100000000 + Math.random() * 900000000);
    }
};