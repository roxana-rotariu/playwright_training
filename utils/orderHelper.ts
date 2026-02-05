import { DataHelper } from './dataHelper';
import { IdHelper } from './idHelper';

export const OrderHelper = {
  generateOrder() {
    return {
      name: DataHelper.randomName(),
      country: "USA",
      city: "New York",
      creditCard: IdHelper.uniqueId("CC"), // fake but unique
      month: "12",
      year: "2025"
    };
  },

  generateCustomOrder({
    name = DataHelper.randomName(),
    country = "USA",
    city = "New York",
    creditCard = IdHelper.uniqueId("CC"),
    month = "12",
    year = "2025"
  } = {}) {
    return {
      name,
      country,
      city,
      creditCard,
      month,
      year
    };
  }
};