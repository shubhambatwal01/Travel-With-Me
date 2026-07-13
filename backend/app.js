const express = require("express");
const ConnectDb = require("./config/dbConfig");
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", (req, res) => {
  res.json({
    users: [
      { id: 1, user: "Shubham" },
      { id: 2, user: "Rahul" },
    ],
  });
});

ConnectDb().then(() => {
  app.listen(process.env.PORT);
  console.log(
    `Server connect on this port: http://localhost:${process.env.PORT}/`,
  );
});
