export default function handler(req, res) {
  res.status(200).json({
    dummyTable: {
      Data: [
        {
          FYName: "FY2022",
          objlist: [
            { DATE: "4/1/2020", ESTValue: 14.2 },
            { DATE: "4/2/2020", ESTValue: 18.2 },
            { DATE: "4/3/2020", ESTValue: 21.2 },
            { DATE: "4/4/2020", ESTValue: 24.2 },
          ],
        },
        {
          FYName: "FY2023",
          objlist: [
            { DATE: "4/1/2021", ESTValue: 16.6 },
            { DATE: "4/2/2021", ESTValue: 14.6 },
            { DATE: "4/3/2021", ESTValue: 12.6 },
            { DATE: "4/4/2021", ESTValue: 18.6 },
          ],
        },
        {
          FYName: "FY2024",
          objlist: [
            { DATE: "6/21/2023", ESTValue: 14.8 },
            { DATE: "6/22/2023", ESTValue: 17.8 },
            { DATE: "6/23/2023", ESTValue: 12.8 },
            { DATE: "6/24/2023", ESTValue: 30.8 },
          ],
        },
        {
          FYName: "FY2025",
          objlist: [
            { DATE: "6/21/2023", ESTValue: 13 },
            { DATE: "6/22/2023", ESTValue: 15 },
            { DATE: "6/23/2023", ESTValue: 30 },
            { DATE: "6/24/2023", ESTValue: 23 },
          ],
        },
      ],
    },
  });
}
