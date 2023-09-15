const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//************ description signup */
//************ @route POST /auth
//************ @access Public

const signup = async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ message: "Email, identifiant et mot de passe obligatoires" });
  }

  const foundEmail = await UserModel.findOne({ email }).exec();

  if (foundEmail) {
    return res.status(401).json({ message: "Email déjà utilisé" });
  }

  const foundUser = await UserModel.findOne({ username }).exec();

  if (foundUser) {
    return res.status(401).json({ message: "Identifiant déjà utilisé" });
  }

  // const match = await bcrypt.compare(password, foundUser.password);

  // if (!match)
  //   return res.status(401).json({ message: "** Accès non autorisé **" });

  ////////////////////////////
  // Récupérer le mot de passe
  ////////////////////////////

  // crypter le mot de passe
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new UserModel({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() =>
          res.status(201).json({
            message:
              "Votre compte a été créé! Veuillez vous connecter dans Espace perso",
          })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//************ description Login */
//************ @route POST /auth
//************ @access Public
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email et mot de passe obligatoires" });
  }

  const foundUser = await UserModel.findOne({ email }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Accès non autorisé" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match)
    return res.status(401).json({
      message:
        "** Accès non autorisé ** " + password + " / " + foundUser.password,
    });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: foundUser.email,
        username: foundUser.username,
        role: foundUser.role,
      },
    },
    // temps imparti au premier accès
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      email: foundUser.email,
    },
    // Si clic (demande de rafraichissement dans les 2days après premier accès, renouvellement d'un temps imparti déterminé par le deuxième access_token)
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "2d" }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 2 * 24 * 60 * 60 * 1000, //cookie expiry: set to match refreshToken (2 days)
  });

  // Send accessToken containing username and role
  res.json({ accessToken });
};
//************ description Refresh */
//************ @route GET /auth/refresh
//************ @access Public - because access token has expired
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res.status(401).json({ message: "*** Accès non autorisé ***" });

  const refreshToken = cookies.jwt;

  //Vérification du token

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Interdit" });

      const foundUser = await UserModel.findOne({ email: decoded.email });

      if (!foundUser)
        return res
          .status(401)
          .json({ message: "**** Accès non autorisé ****" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            email: foundUser.email,
            role: foundUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    }
  );
};

//************ description Logout */
//************ @route POST /auth/logout
//************ @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie effacé" });
};

module.exports = {
  signup,
  login,
  refresh,
  logout,
};
