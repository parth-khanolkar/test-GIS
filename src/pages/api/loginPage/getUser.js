import sql from "mssql";

const config = {
  user: "goindia",
  password: "d2VtYWtlYXBwcw==",
  server: "gia.cejdll30i43s.ap-south-1.rds.amazonaws.com",
  database: "GIAStock",
  port: 1433,
  options: {
    instancename: "SQLEXPRESS",
    trustedconnection: true,
    trustServerCertificate: true,
  },
};

export default async (req, res) => {
  const { method, body } = req;

  switch (method) {
    case "POST":
      const { email, password } = body;

      try {
        const query =
          "SELECT * FROM GiaStock_User WHERE (Name = @email OR EmailId = @email) AND Password = @password";

        let pool = await sql.connect(config);
        let result = await pool
          .request()
          .input("email", sql.NVarChar, email)
          .input("password", sql.NVarChar, password)
          .query(query);

        if (result.recordset.length > 0) {
          return res
            .status(200)
            .json({
              UserId: result.recordset[0].UserId,
              FullName: result.recordset[0].Name,
              UserEmail: result.recordset[0].EmailId,
            });
        }
        res.status(400).json({ message: "User not found!" });
      } catch (error) {
        res.status(500).json({ error: "An error occurred." });
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
