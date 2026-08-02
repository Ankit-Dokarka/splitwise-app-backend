import dotenv from "dotenv";

dotenv.config();

const { PORT, MONGODB_URI, GOOGLE_CLIENT_ID } = process.env;

if (!PORT) {
  throw new Error("Missing required environment variable: PORT");
}

if (!MONGODB_URI) {
  throw new Error("Missing required environment variable: MONGODB_URI");
}

if (!GOOGLE_CLIENT_ID) {
  throw new Error("Missing required environment variable: GOOGLE_CLIENT_ID");
}

export const env = {
  PORT: Number(PORT),
  MONGODB_URI,
  GOOGLE_CLIENT_ID,
} as const;
