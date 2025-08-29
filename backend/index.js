const express = require("express");
require("dotenv").config();
require("./Models/db");
const authRoutes = require("./Routes/AuthRouter");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
