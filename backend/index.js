const express = require("express");
require("dotenv").config();
require("./Models/db");
const cors = require("cors");

const authRoutes = require("./Routes/AuthRouter");
const verify = require("./Routes/verify");
const historyRouter = require("./Routes/historyRouter");

const app = express();
const port = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Debug logs (only in dev)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    if (req.method === "POST") {
      console.log(`${req.method} ${req.url}`);
      console.log("Headers:", req.headers);
      console.log("Body:", req.body);
    }
    next();
  });
}

// ✅ Routes
app.get("/", (req, res) => res.send("Hello World!"));
app.get("/health", (req, res) =>
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() })
);

app.use("/auth", authRoutes);
app.use("/verify", verify);
app.use("/history", historyRouter);

// ✅ Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
