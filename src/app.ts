import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use(notFound);

app.use(errorHandler);

export default app;
