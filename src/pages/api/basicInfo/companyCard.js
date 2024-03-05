export default function handler(req, res) {
  res.status(200).json({
    data: {
      compName: "Anant Raj Ltd.",
      sector: "Construction- Real Estate / Reality",
      stockPrice: 389.0,
      stockChange: 10,
      stockChangePerc: 0.19,
      bse: 515055,
      nse: "ANANTRAJ",
      mcap: 3379,
      weekLows: 42.65,
      weekHigh: 125.2,
      avgVolume: 28.31,
      promoterPerc: 63.03,
      institutionalPerc: 9.21,
      weakStrong: "strong",
      director: "Amit Sarin",
      secretary: "Manoj Pahwa",
      auditor: "Vinod Kumar Bindal & Co.",
    },
  });
}
