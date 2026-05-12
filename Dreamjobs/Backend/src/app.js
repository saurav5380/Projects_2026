import cors from "cors";
import express from "express";
import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000"
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Dreamjobs API" });
});

app.use("/api/health", healthRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error"
  });
});

export default app;
