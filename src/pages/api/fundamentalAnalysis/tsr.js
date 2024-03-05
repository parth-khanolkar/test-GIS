export default function handler(req, res) {
  res.status(200).json({
    dummyTable: {
      chart: [
        {
          name: "FY1819",
          uv: 109,
          pv: 0,
          amt: -109,
          line: 0,
        },
        {
          name: "FY1920",
          uv: 10,
          pv: 112,
          amt: 1,
          line: 122,
        },
        {
          name: "FY2021",
          uv: 16,
          pv: 46,
          amt: 0,
          line: 62,
        },
        {
          name: "FY2122",
          uv: 5,
          pv: 7,
          amt: 0,
          line: 12,
        },
        {
          name: "FY2223",
          uv: 11,
          pv: -8,
          amt: 21,
          line: 13,
        },

        // { name: "A", positive: 10, negative: -5 },
        // { name: "B", positive: 8, negative: -3 },
        // { name: "C", positive: 15, negative: -7 },
        // { name: "D", positive: 12, negative: -4 },
      ],
      dummyColumn: [
        {
          header: "Annualised Returns",
          accessorKey: "annualReturns",
        },
        {
          header: "1 Year",
          accessorKey: "one",
        },
        {
          header: "2 Year",
          accessorKey: "two",
        },
        {
          header: "3 Year",
          accessorKey: "three",
        },
      ],
      dummyData: [
        {
          annualReturns: "TSR(%)",
          one: 12,
          two: 59,
          three: 32,
        },
        {
          annualReturns: "Returns due to Dividends(%)",
          one: 12,
          two: 59,
          three: 32,
        },
        {
          annualReturns: "Returns due to Earnings(%)",
          one: 12,
          two: 59,
          three: 32,
        },
        {
          annualReturns: "Returns due to PE Rati(%)",
          one: 12,
          two: 59,
          three: 32,
        },
      ],
    },
  });
}
