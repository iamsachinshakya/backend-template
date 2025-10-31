import bcrypt from "bcrypt";

/**
 * Hash a plain text password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password) => {
  if (!password) return null;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

/**
 * Compare plain text password with hashed password
 * @param {string} password - Plain text password from user input
 * @param {string} hashedPassword - Password hash from database
 * @returns {Promise<boolean>} - True if match, else false
 */
export const comparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) return false;
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
