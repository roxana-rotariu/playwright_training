import { test as base, expect } from "./baseTest";

export type DataFixtures = {
  productName: string;
  categoryName: 'Phones' | 'Laptops' | 'Monitors';
  randomUser: { username: string; password: string };
  orderData: any;
};

export const test = base.extend<DataFixtures>({
  productName: ["Nokia lumia 1520", { option: true }],
  categoryName: ["Phones", { option: true }],
  randomUser: [
    {
      username: `user_${Date.now()}`,
      password: `pass_${Math.floor(Math.random() * 9999)}`
    },
    { option: true },
  ],
  orderData: [
    {
      name: "John Doe",
      country: "USA",
      city: "New York",
      creditCard: "1234 5678 9012 3456",
      month: "12",
      year: "2025"
    },
    { option: true }
  ]
});

export { expect };