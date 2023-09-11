// Crypter le mot de passe
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const MenuModel = require("../models/menu.model");
// méthodes asynchrones plutôt que de nombreux try/catch
const asyncHandler = require("express-async-handler");

//************ description @desc Get all users */
//************ @route GET /user
//************ @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find().select("-password").lean(); // ne retourne pas le password
  if (!users?.length) {
    return res.status(400).json({ message: "Pas d'utilisateur enregistré" });
  }
  res.json(users);
});

//************ description @desc Create new user */
//************ @route POST /user
//************ @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, email, role, active } = req.body;
  console.log("controller createNewUser");

  // Confirm data
  if (!username || !password || !email) {
    return res.status(400).json({
      message: `Le pseudo, le mot de passe et l'email sont obligatoires`,
    });
  }

  // Check for duplicate
  const duplicate = await UserModel.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Pseudo déja utilisé" });
  }

  // Check for duplicate email
  const duplicateEmail = await UserModel.findOne({ email }).lean().exec();
  if (duplicateEmail) {
    return res.status(409).json({ message: "Cet email est déjà utilisé" });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds
  const userObject = { username, password: hashedPwd, email, role };

  // Create and store new user
  const user = await UserModel.create(userObject);

  if (user) {
    //created
    res.status(201).json({ message: `Nouvel utilisateur ${username} créé` });
  } else {
    res.status(400).json({ message: `Données invalides` });
  }
});

//************ description @desc Update a user */
//************ @route PATCH /users
//************ @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, email, password, username, role, active } = req.body;

  //Confirm data
  if (!id || !email || !username || typeof active !== "boolean") {
    return res
      .status(400)
      .json({ message: "Tous les champs sont obligatoires" });
  }

  // Update user
  const user = await UserModel.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: `Utilisateur non trouvé` });
  }

  // Check for duplicate username
  const duplicate = await UserModel.findOne({ username }).lean().exec();
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Ce pseudo est déjà utilisé" });
  }

  // Check for duplicate email
  const duplicateEmail = await UserModel.findOne({ email }).lean().exec();
  // Allow updates to the original user
  if (duplicateEmail && duplicateEmail?._id.toString() !== id) {
    return res.status(409).json({ message: "Cet email est déjà utilisé" });
  }

  // update avec les nouvelles données
  user.username = username;
  user.role = role;
  user.active = active;
  user.email = email;

  if (password && password.length !== 0) {
    // Hash pasword s'il est défini
    user.password = await bcrypt.hash(password, 10); // salt rounds
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
});

//************ description @desc Delete a user */
//************ @route DELETE /user
//************ @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID manquant" });
  }

  // Si le user a des menus sauvegardés, il faudra les supprimer d'abord

  const user = await UserModel.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User non trouvé" });
  }

  const menu = await MenuModel.findOne({ user: user.username }).lean().exec();
  if (menu) {
    return res.status(400).json({
      message:
        "Cet utilisateur a encore au moins un menu sauvegardé, il faut le/les supprimer en premier.",
    });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

//================  SIGNIN - SIGNUP ===================//
//fonction pour enregistrer de nouveaux utilisateurs
//SIGNUP - REMPLACEE PAR SIGNUP DANS auth.controller.js

// module.exports.signup = (req, res) => {
//   // crypter le mot de passe
//   bcrypt
//     .hash(req.body.password, 10)
//     .then((hash) => {
//       const user = new UserModel({
//         email: req.body.email,
//         password: hash,
//       });
//       user
//         .save()
//         .then(() => res.status(201).json({ message: "Utilisateur créé!" }))
//         .catch((error) => res.status(400).json({ error }));
//     })
//     .catch((error) => res.status(500).json({ error }));
// };

//fonction pour connecter des utilisateurs existants
//SIGNIN  - REMPLACEE PAR LOGIN DANS auth.controller.js

// module.exports.signin = (req, res) => {
//   UserModel.findOne({ email: req.body.email })
//     .then((user) => {
//       if (user === null) {
//         res
//           .status(401)
//           .json({ message: "Identifiant et/ou Mot de passe incorrects" });
//       } else {
//         bcrypt
//           .compare(req.body.password, user.password)
//           .then((valid) => {
//             if (!valid) {
//               res
//                 .status(401)
//                 .json({ message: "Identifiant et/ou Mot de passe incorrects" });
//             } else {
//               res.status(200).json({
//                 userId: user._id,
//                 token: jwt.sign(
//                   { userId: user._id },
//                   // Puisque cette chaîne sert de clé pour le chiffrement et le déchiffrement du token, elle doit être difficile à deviner, sinon n’importe qui pourrait générer un token en se faisant passer pour notre serveur :
//                   "RANDOM_TOKEN_SECRET",
//                   {
//                     expiresIn: "24h",
//                   }
//                 ),
//               });
//             }
//           })
//           .catch((error) => {
//             res.status(500).json({ error });
//           });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({ error });
//     });
// };

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
