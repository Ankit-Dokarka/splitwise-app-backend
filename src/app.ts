import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import memberRoutes from "./routes/member.routes.js";
import expenseRoutes from "./routes/expense.routes.js";

import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import { env } from "./config/env.js";

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
