import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET || "super_secret_access_token_key";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access token is missing or invalid",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Access token has expired or is invalid",
    });
  }
};
