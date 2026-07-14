const express = require("express");
const ConnectDb = require("./config/dbConfig");
const cors = require("cors");
const userRouter = require("./routes/userRoute");
const adminRouter = require("./routes/adminRoute");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(adminRouter);

ConnectDb().then(() => {
  const port = process.env.PORT || 1101;
  app.listen(port, () => {
    console.log(`Server connect on this port: http://localhost:${port}/`);
  });
});
