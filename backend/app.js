const express = require("express");
const ConnectDb = require("./config/dbConfig");
const app = express();

app.use(express.json());

app.use("/", (req, res) => {
  res.send("Shubham's Travel With Me Server!");
});

ConnectDb().then(() => {
  app.listen(process.env.PORT);
  console.log(
    `Server connect on this port: http://localhost:${process.env.PORT}/`,
  );
});
