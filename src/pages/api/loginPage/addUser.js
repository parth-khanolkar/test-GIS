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
      const { fullname, email, password } = body;

      const currentDate = new Date().toISOString().slice(0, 23).replace('T', ' ');
      const status = "active";
      const userType = "user";
      const sub = 1; //isSubscribeStockNotesEmail and IsSubscribeSectorNotesEmail

      try {
        const checkQuery = `SELECT * FROM GiaStock_User WHERE EmailId = @email`;

        let pool = await sql.connect(config);
        let existingUser = await pool
          .request()
          .input("fullname", sql.NVarChar, fullname)
          .input("email", sql.NVarChar, email)
          .query(checkQuery);

        if (existingUser.recordset.length > 0) {
          return res
            .status(400)
            .json({ error: "Username or EmailId already exists" });
        }

        const insertQuery = `
            INSERT INTO GiaStock_User (Name,EmailId,Password,CreatedOn,Status,UserType,IsSubscribeStockNotesEmail,IsSubscribeSectorNotesEmail) VALUES (@fullname,@email, @password,@currentDate,@status,@userType,@sub,@sub);
            SELECT SCOPE_IDENTITY() AS UserId;
        `;

        let result = await pool
          .request()
          .input("fullname", sql.NVarChar, fullname)
          .input("email", sql.NVarChar, email)
          .input("password", sql.NVarChar, password)
          .input("currentDate", sql.DateTime, currentDate)
          .input("status", sql.NVarChar, status)
          .input("userType", sql.NVarChar, userType)
          .input("sub",sql.Int, sub)
          .query(insertQuery);

        const userId = result.recordset[0].UserId;
        return res
          .status(200)
          .json({ 
            UserId: userId, 
            UserEmail: email, 
            FullName: fullname, 
            CreatedOn:currentDate  
          });
      } catch (error) {
        res.status(500).json({ error: "An error occurred.", error });
      }
      break;

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
