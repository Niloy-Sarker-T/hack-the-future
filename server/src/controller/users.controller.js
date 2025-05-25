import { eq } from "drizzle-orm";
import { db } from "../db/db.config";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { asyncHandler } from "../utils/async-handler";
import { uploadBufferToCloudinary } from "../utils/cloudinary";

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
  const userId = req.user;
  const { fullName, bio, userName, socialsLinks } = req.body;
  // Update user in DB
  await db
    .update(usersTable)
    .set({ fullName, bio, userName, socialsLinks })
    .where(eq(usersTable.id, userId));

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Profile updated successfully"));
});

export { uploadProfileImage, updateUserProfile };
