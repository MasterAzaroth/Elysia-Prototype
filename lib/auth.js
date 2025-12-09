import jwt from "jsonwebtoken";

export const authenticate = (req) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    throw new Error("No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token.");
  }
};
