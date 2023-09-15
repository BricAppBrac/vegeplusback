const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  // console.log("**** verifyJWT ****");
  // console.log("authHeader");
  // console.log(authHeader);
  if (!authHeader?.startsWith("Bearer ")) {
    // console.log("- Accès non autorisé -");
    return res.status(401).json({ message: "- Accès non autorisé -" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "- Interdit -" });
    req.user = decoded.UserInfo.username;
    req.email = decoded.UserInfo.email;
    req.role = decoded.UserInfo.role;
    next();
  });
};

module.exports = verifyJWT;
