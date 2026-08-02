import dotenv from "dotenv";

dotenv.config();

const {
  PORT,
  MONGODB_URI,
  GOOGLE_CLIENT_ID,
  CLIENT_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  NODE_ENV,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

if (!PORT) {
  throw new Error("Missing required environment variable: PORT");
}

if (!MONGODB_URI) {
  throw new Error("Missing required environment variable: MONGODB_URI");
}

if (!GOOGLE_CLIENT_ID) {
  throw new Error("Missing required environment variable: GOOGLE_CLIENT_ID");
}

if (!CLIENT_URL) {
  throw new Error("Missing required environment variable: CLIENT_URL");
}

if (!JWT_SECRET) {
  throw new Error("Missing required environment variable: JWT_SECRET");
}

if (!JWT_EXPIRES_IN) {
  throw new Error("Missing required environment variable: JWT_EXPIRES_IN");
}
if (!CLOUDINARY_CLOUD_NAME)
  throw new Error(
    "Missing required environment variable: CLOUDINARY_CLOUD_NAME",
  );
if (!CLOUDINARY_API_KEY)
  throw new Error("Missing required environment variable: CLOUDINARY_API_KEY");
if (!CLOUDINARY_API_SECRET)
  throw new Error(
    "Missing required environment variable: CLOUDINARY_API_SECRET",
  );

export const env = {
  PORT: Number(PORT),
  MONGODB_URI,
  GOOGLE_CLIENT_ID,
  CLIENT_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  NODE_ENV: NODE_ENV ?? "development",
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} as const;
