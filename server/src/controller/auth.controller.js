import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import bcrypt from "bcryptjs";
import { db } from "../db/db.config.js";
import { usersTable } from "../db/schema/users.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import {
  generateVerificationCode,
  generateExpiryDate,
} from "../utils/verification-code-expiry.js";
import { ApiError } from "../utils/api-error.js";
import env from "../config/index.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.validatedData;

  const existingUserByEmail = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  const hashedPassword = await bcrypt.hash(password, 10);
  const verifyCode = generateVerificationCode();
  const verifyCodeExpiry = generateExpiryDate();

  if (existingUserByEmail.length > 0) {
    const user = existingUserByEmail[0];
    if (user.isVerified) {
      res
        .status(409)
        .json(new ApiResponse(409, {}, "User already exists with this email"));
    }

    // If the user is not verified, update their details
    await db
      .update(usersTable)
      .set({
        fullName: `${firstName} ${lastName}`,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
      })
      .where(eq(usersTable.email, email));

    // Send verification email
    // const emailResponse = await sendVerificationEmail(
    //   email,
    //   firstName,
    //   lastName,
    //   verifyCode
    // );

    // if (!emailResponse.success) {
    //   res
    //     .status(500)
    //     .json(new ApiResponse(500, {}, "Failed to send verification email"));
    // }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { firstName, lastName, email },
          "User details updated. Please verify your email."
        )
      );
  }
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  let isUserNameExist, userName;
  do {
    userName = `${firstName}-${randomNum}`;
    isUserNameExist = await db
      .select({ userName: usersTable.userName })
      .from(usersTable)
      .where(eq(usersTable.userName, userName));
  } while (isUserNameExist.length > 0);

  const newUser = {
    fullName: `${firstName} ${lastName}`,
    email,
    userName,
    password: hashedPassword,
    code: verifyCode,
    expiresAt: verifyCodeExpiry,
    isVerified: false,
  };
  await db.insert(usersTable).values(newUser);

  //TODO: Email verification logic

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { firstName, lastName, email },
        "User registered successfully"
      )
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedData;

  const user = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      password: usersTable.password,
      fullName: usersTable.fullName,
      userName: usersTable.userName,
      isVerified: usersTable.isVerified,
      avatarUrl: usersTable.avatarUrl,
      bio: usersTable.bio,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (user.length === 0) {
    throw new ApiError(400, "please register before login");
  }

  const isPasswordValid = await bcrypt.compare(password, user[0].password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  let accessToken;
  try {
    accessToken = jwt.sign({ userId: user[0].id }, env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  } catch (jwtError) {
    console.error("JWT Error:", jwtError);
    throw new ApiError(500, "Failed to generate access token");
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  delete user[0].password;
  const userWithoutPassword = user[0];

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: userWithoutPassword, accessToken },
        "User logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized action - User not logged in");
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 0, // Set maxAge to 0 to delete the cookie
  };
  return res
    .clearCookie("accessToken", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const uploadProfileImage = asyncHandler(async (req, res) => {
  const userId = req.user;
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }
  // Upload to Cloudinary using the utility
  let result;
  try {
    result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "profile_images",
      resource_type: "image",
      public_id: `user_${userId}_${Date.now()}`,
      overwrite: true,
    });
  } catch (error) {
    throw new ApiError(500, "Cloudinary upload failed");
  }
  // Update user in DB
  await db
    .update(usersTable)
    .set({ avatarUrl: result.secure_url })
    .where(eq(usersTable.id, userId));
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { avatarUrl: result.secure_url },
        "Profile image updated"
      )
    );
});

export { register, login, logout, uploadProfileImage };
