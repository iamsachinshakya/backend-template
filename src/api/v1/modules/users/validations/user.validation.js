import { z } from "zod";

// ------------------------------
// CONFIGURABLE LIMITS
// ------------------------------
const AVATAR_MAX_MB = 5;
const COVER_MAX_MB = 10;

const MB = 1024 * 1024;
const MAX_AVATAR_SIZE = AVATAR_MAX_MB * MB;
const MAX_COVER_SIZE = COVER_MAX_MB * MB;

// ------------------------------
// USER BODY VALIDATION
// ------------------------------
export const registerUserSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters long")
    .max(50, "Full name must be at most 50 characters long"),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  email: z.string().trim().email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must be at most 64 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    ),
});

// ------------------------------
// FILE VALIDATION
// ------------------------------
const imageFileSchema = z.object({
  path: z.string().min(1, "File path is required"),
  mimetype: z
    .string()
    .regex(/^image\/(jpeg|png|jpg|webp)$/, "Only image files are allowed"),
  size: z.number().positive("File size is required"),
});

// ------------------------------
// REGISTER (body + files)
// ------------------------------
export const registerUserWithFilesSchema = z.object({
  body: registerUserSchema,
  files: z.object({
    avatar: z
      .array(imageFileSchema)
      .nonempty("Avatar file is required")
      .max(1, "Only one avatar file allowed")
      .refine(
        (files) => files[0]?.size <= MAX_AVATAR_SIZE,
        `Avatar must be less than ${AVATAR_MAX_MB}MB`
      ),
    coverImage: z
      .array(imageFileSchema)
      .max(1, "Only one cover image allowed")
      .optional()
      .refine(
        (files) => !files?.[0] || files[0].size <= MAX_COVER_SIZE,
        `Cover image must be less than ${COVER_MAX_MB}MB`
      ),
  }),
});

// ------------------------------
// UPDATE ACCOUNT DETAILS
// ------------------------------
export const updateAccountSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .optional(),

    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters long")
      .max(50, "Full name must be at most 50 characters long")
      .optional(),

    email: z.string().trim().email("Invalid email address").optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field (username, fullName, or email) must be provided"
  );

// ------------------------------
// UPDATE AVATAR
// ------------------------------
export const updateAvatarSchema = z.object({
  file: imageFileSchema
    .refine(
      (file) => file.mimetype.startsWith("image/"),
      "Only image files allowed"
    )
    .refine(
      (file) => file.size <= MAX_AVATAR_SIZE,
      `Avatar must be less than ${AVATAR_MAX_MB}MB`
    ),
});

// ------------------------------
// UPDATE COVER IMAGE
// ------------------------------
export const updateCoverImageSchema = z.object({
  file: imageFileSchema
    .refine(
      (file) => file.mimetype.startsWith("image/"),
      "Only image files allowed"
    )
    .refine(
      (file) => file.size <= MAX_COVER_SIZE,
      `Cover image must be less than ${COVER_MAX_MB}MB`
    ),
});
