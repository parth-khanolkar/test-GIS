export default function handler(req, res) {
  res.status(200).json({
    dummyTable: {
      chart: [
        {
          Name: "Cash Before Operation",
          Value: 10463.32,
          RowName: null,
        },
        {
          Name: "Working Capital",
          Value: -5002.25,
          RowName: null,
        },
        {
          Name: "Cash From Operation",
          Value: 5461.07,
          RowName: "Cash_From_Operation",
        },
        {
          Name: "Tax Paid",
          Value: -923.99,
          RowName: "Tax_Paid",
        },
        {
          Name: "Interest Paid",
          Value: -2018.71,
          RowName: "Interest_Paid",
        },
        {
          Name: "Net Cash for Capex",
          Value: 2518.37,
          RowName: "Net_Cash_for_Capex",
        },
        {
          Name: "Capex",
          Value: -4031.7,
          RowName: "Capex",
        },
        {
          Name: "FCFE",
          Value: -1513.33,
          RowName: "FCFE",
        },
        {
          Name: "Debt issuance/repayment",
          Value: 2641.05,
          RowName: "Debt_issuance_repayment",
        },
        {
          Name: "Equity issuance",
          Value: -8.49,
          RowName: "Equity_issuance",
        },
        {
          Name: "Dividends",
          Value: -790.6,
          RowName: "Dividends",
        },
        {
          Name: "Other Financing",
          Value: -228.98,
          RowName: "Other_Financing",
        },
        {
          Name: "Investment Income",
          Value: 75.33,
          RowName: "Investment_Income",
        },
        {
          Name: "Net Investment",
          Value: 90.73,
          RowName: "Net_Investment",
        },
        {
          Name: "Other investing cash flow",
          Value: 1.19,
          RowName: "Other_investing_cash_flow",
        },
        {
          Name: "Net Cash",
          Value: 266.9,
          RowName: "Net Cash",
        },
      ],
    },
  });
}
