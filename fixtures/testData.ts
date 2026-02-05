// fixtures/testData.ts

/**
 * Centralized typed test data for Playwright framework
 * Used for DDT, flows, fixtures, and scenario setup.
 */

export const users = {
  standard: {
    username: "standard_user",
    password: "password123"
  },
  admin: {
    username: "admin_user",
    password: "adminSecret!"
  },
  invalid: {
    username: "invalid_user",
    password: "wrong_password"
  }
};

export const products = {
  phones: [
    "Nokia lumia 1520",
    "Samsung galaxy s6",
    "HTC One M9"
  ],
  laptops: [
    "Sony vaio i5",
    "Dell i7 8gb",
    "MacBook air"
  ],
  monitors: [
    "Apple monitor 24",
    "ASUS Full HD"
  ]
};

export const categories = ["Phones", "Laptops", "Monitors"] as const;

export const countries = ["USA", "Romania", "Germany", "UK"] as const;

export const orderTemplate = {
  name: "John Doe",
  country: "USA",
  city: "New York",
  creditCard: "1234 5678 9012 3456",
  month: "12",
  year: "2025"
};