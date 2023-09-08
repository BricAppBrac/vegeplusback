const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // récupérer le token
  try {
    const token = req.headers.authorization.split(" ")[1];
    // décoder le token
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
  } catch (error) {
    res.status(401).json({ error });
  }
};
