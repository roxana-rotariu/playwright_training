import { randomBytes, randomUUID } from "node:crypto";

export const IdHelper = {

    // Fully unique UUID (best for test files / global uniqueness)
    uuid(): string {
        return randomUUID();
    },

    // Prefix + UUID (very common)
    uuidWithPrefix(prefix = "id"): string {
        return `${prefix}_${randomUUID()}`;
    },

    // Secure random hex ID (custom length)
    secureId(length = 12): string {
        return randomBytes(Math.ceil(length / 2))
            .toString("hex")
            .slice(0, length);
    },

    // Short, human-friendly ID
    shortId(prefix = "id"): string {
        const random = Math.floor(Math.random() * 1_000_000).toString(36);
        return `${prefix}_${random}`;
    },

    // Incrementing ID generator (useful in loops)
    counterId(prefix = "id"): string {
        if (!(global as any)._idCounter) {
            (global as any)._idCounter = 0;
        }
        (global as any)._idCounter += 1;
        return `${prefix}_${(global as any)._idCounter}`;
    },

    // Your original method (kept for compatibility)
    uniqueId(prefix = "id"): string {
        return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
    }
};