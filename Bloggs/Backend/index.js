const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const postsRouter = require("./routes/postRoutes")
const authRouter = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "bloggs-backend" });
});

app.use("/auth",authRouter);

app.use("/posts", postsRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
