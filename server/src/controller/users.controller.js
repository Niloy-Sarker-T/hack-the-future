import { eq } from "drizzle-orm";
import { db } from "../db/db.config.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";
import { usersTable } from "../db/schema/users.js";

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

const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, userName, bio, skills, socialLinks } = req.body;

  const [updatedUser] = await db
    .update(usersTable)
    .set({
      fullName: `${firstName} ${lastName}`,
      userName,
      bio,
      skills,
      socialLinks,
      updatedAt: new Date(),
    })
    .where(eq(usersTable.id, userId))
    .returning({
      id: usersTable.id,
      email: usersTable.email,
      userName: usersTable.userName,
      bio: usersTable.bio,
      skills: usersTable.skills,
      socialsLinks: usersTable.socialLinks,
    });

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

const getUserProfileByUsername = asyncHandler(async (req, res) => {
  const username = req.query.username;
  if (!username) {
    throw new ApiError(400, "Username query parameter is required");
  }
  const user = await db
    .select({
      id: usersTable.id,
      fullName: usersTable.fullName,
      userName: usersTable.userName,
      bio: usersTable.bio,
      location: usersTable.location,
      avatarUrl: usersTable.avatarUrl,
      socialsLinks: usersTable.socialsLinks,
      skills: usersTable.skills,
      interests: usersTable.interests,
    })
    .from(usersTable)
    .where(eq(usersTable.userName, username))
    .limit(1)
    .then((rows) => rows[0]);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile retrieved successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  const user = await db
    .select({
      id: usersTable.id,
      fullName: usersTable.fullName,
      userName: usersTable.userName,
      bio: usersTable.bio,
      location: usersTable.location,
      avatarUrl: usersTable.avatarUrl,
      socialsLinks: usersTable.socialsLinks,
      skills: usersTable.skills,
      interests: usersTable.interests,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1)
    .then((rows) => rows[0]);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile retrieved successfully"));
});

export {
  uploadProfileImage,
  updateUserProfile,
  getUserProfileByUsername,
  getUserProfile,
};
