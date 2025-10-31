import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from "../../../../../app/config/env.js";
import { ApiError } from "../../../common/utils/ApiError.js";

/**
 * Generate an access token
 * @param {object} payload - User data to encode (e.g. { id, email })
 * @returns {string} JWT access token
 */
export const generateAccessToken = (payload) => {
  if (!ACCESS_TOKEN_SECRET) {
    throw new ApiError("ACCESS_TOKEN_SECRET is not defined", 500);
  }
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Generate a refresh token
 * @param {object} payload - User data to encode
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  if (!REFRESH_TOKEN_SECRET) {
    throw new ApiError("REFRESH_TOKEN_SECRET is not defined", 500);
  }
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token string
 * @param {string} secret - Secret key used for verification
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new ApiError(`Failed to generate access token: ${err.message}`, 500);
  }
};
