import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const actualToken = token.split(" ")[1];
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authMiddleware;
