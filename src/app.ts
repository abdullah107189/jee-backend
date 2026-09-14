import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/config"; 
import routes from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

// ====================== GLOBAL MIDDLEWARES ======================

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  }),
);

// Logging
app.use(morgan(config.NODE_ENV === "development" ? "dev" : "combined"));

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ====================== ROUTES ======================
// app.use("/api/v1/complaints", complaintRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Jee Backend!",
    timestamp: new Date().toISOString(),
  });
});
// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Jee Backend is running smoothly!",
    timestamp: new Date().toISOString(),
  });
});

// Application API Routes (v1)
app.use("/api/v1", routes);

// Global Error Handler
app.use(errorMiddleware);

export default app;
