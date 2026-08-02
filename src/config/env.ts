import dotenv from "dotenv";

dotenv.config();

const { PORT, MONGODB_URI } = process.env;

if (!PORT) {
  throw new Error("Missing required environment variable: PORT");
}

if (!MONGODB_URI) {
  throw new Error("Missing required environment variable: MONGODB_URI");
}

export const env = {
  PORT: Number(PORT),
  MONGODB_URI,
} as const;
