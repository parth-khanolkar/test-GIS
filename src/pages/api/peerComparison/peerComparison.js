export default function handler(req, res) {
  res.status(200).json({
    data: {
      sector: "Miscellaneous",
      industry: "Food-Processing-Indian",
    },
  });
}
