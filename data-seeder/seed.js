import prisma from "../src/config/prisma.js";

const userId =
  "3131de03-aa3a-4d78-8e64-8a12b8b6a8b7";

const categories = [
  "Food",
  "Shopping",
  "Travel",
  "Bills",
  "Entertainment",
  "Health",
  "Salary",
];

const merchants = {
  Food: [
    "Swiggy",
    "Zomato",
    "McDonalds",
  ],
  Shopping: [
    "Amazon",
    "Flipkart",
    "Myntra",
  ],
  Travel: [
    "Uber",
    "Rapido",
    "Ola",
  ],
  Bills: [
    "Electricity",
    "Internet",
    "Water Bill",
  ],
  Entertainment: [
    "Netflix",
    "Spotify",
    "PVR",
  ],
  Health: [
    "Apollo",
    "Pharmacy",
  ],
  Salary: [
    "Company Payroll",
  ],
};

const randomAmount = (
  min,
  max
) => {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
};

const randomDate = () => {
  const start = new Date(2025, 0, 1);

  const end = new Date();

  return new Date(
    start.getTime() +
      Math.random() *
        (end.getTime() -
          start.getTime())
  );
};

const seedTransactions =
  async () => {
    try {
      for (let i = 0; i < 100; i++) {
        const category =
          categories[
            Math.floor(
              Math.random() *
                categories.length
            )
          ];

        const type =
          category === "Salary"
            ? "income"
            : "expense";

        const merchantList =
          merchants[category];

        const merchant =
          merchantList[
            Math.floor(
              Math.random() *
                merchantList.length
            )
          ];

        const amount =
          type === "income"
            ? randomAmount(
                30000,
                90000
              )
            : randomAmount(100, 5000);

        await prisma.transaction.create({
          data: {
            amount,
            category,
            type,
            merchant,
            description: `${category} transaction`,
            date: randomDate(),
            userId,
          },
        });
      }

      console.log(
        "Seed data inserted successfully"
      );

      process.exit(0);
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };

seedTransactions();