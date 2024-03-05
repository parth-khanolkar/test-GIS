export default function handler(req, res) {
  res.status(200).json({
    data: {
      glanceTable: {
        pb: 1.23,
        roe: 1.93,
        netDebt: 844.53,
        pe: 26.71,
        evEbitda: 23.05,
        grossDebt: 897.1,
        dividendYield: 0.12,
        annualDividend: 50.68,
        avgEvEbitda: 34.81,
      },
    },
  });
}
