import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";

import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(morgan("dev"));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use(notFound);

app.use(errorHandler);

export default app;
