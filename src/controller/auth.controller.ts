import prismaClient from "../config/dbConfig";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import AsyncHandler from "../utils/asyncHandler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface TokenData {
  email: string;
  name: string;
}

export const getSecretOrThrow = (
  secret: string | undefined,
  type: string
): string => {
  if (!secret) {
    throw new ApiError(500, `Internal server error: ${type} not set`);
  }
  return secret;
};

const generateToken = (data: object, secret: string, expiry: string) => {
  return jwt.sign(data, secret, { expiresIn: expiry });
};

const generateAccessToken = (data: TokenData) => {
  const accessTokenSecret = getSecretOrThrow(
    process.env.ACCESS_TOKEN_SECRET,
    "access token secret"
  );
  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || "1h"; // Default to 1 hour if not set
  return generateToken(data, accessTokenSecret, accessTokenExpiry);
};

export const register = AsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await prismaClient.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(400, "User Already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await prismaClient.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "User Registered Successfully"));
});

export const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prismaClient.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const compare = await bcrypt.compare(password, user.password);

  if (!compare) {
    throw new ApiError(400, "Incorrect Password");
  }

  const tokenData: TokenData = {
    email: user.email,
    name: user.username,
  };

  const accessToken = generateAccessToken(tokenData);

  return res
    .status(200)
    .json(new ApiResponse(200, accessToken, "Login successful"));
});
