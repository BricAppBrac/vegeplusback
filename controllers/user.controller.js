// Crypter le mot de passe
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const MenuModel = require("../models/menu.model");

// Function to check duplicate username
const checkDuplicateUsername = async (req, res) => {
  const { username } = req.params;
  const duplicate = await UserModel.findOne({ username })
    .collation({ locale: "fr", strength: 2 })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(409).json({ message: "Pseudo déja utilisé" });
  }
};

// Function to check duplicate email
const checkDuplicateEmail = async (req, res) => {
  const { email } = req.params;
  const duplicateEmail = await UserModel.findOne({ email }).lean().exec();
  if (duplicateEmail) {
    return res.status(409).json({ message: "Cet email est déjà utilisé" });
  }
};

//************ description @desc Get all users */
//************ @route GET /user
//************ @access Private
const getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password").lean(); // ne retourne pas le password
  if (!users?.length) {
    return res.status(400).json({ message: "Pas d'utilisateur enregistré" });
  }
  res.json(users);
};

//************ description @desc Create new user */
//************ @route POST /user
//************ @access Private
const createNewUser = async (req, res) => {
  const { username, password, email, role, active } = req.body;
  // console.log("controller createNewUser");

  // Confirm data
  if (!username || !password || !email) {
    return res.status(400).json({
      message: `Le pseudo, le mot de passe et l'email sont obligatoires`,
    });
  }

  // Check for duplicate, sensible à la casse avec une collation
  const duplicate = await UserModel.findOne({ username })
    .collation({ locale: "fr", strength: 2 })
    .lean()
    .exec();

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
  const userObject = { username, password: hashedPwd, email, role, active };

  // Create and store new user
  const user = await UserModel.create(userObject);

  if (user) {
    //created
    res.status(201).json({ message: `Nouvel utilisateur ${username} créé` });
  } else {
    res.status(400).json({ message: `Données invalides` });
  }
};

//************ description @desc Update a user */
//************ @route PATCH /users
//************ @access Private
const updateUser = async (req, res) => {
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

  // Check for duplicate username // insensible à la casse grâce à la collation
  const duplicate = await UserModel.findOne({ username })
    .collation({ locale: "fr", strength: 2 })
    .lean()
    .exec();
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
};

//************ description @desc Delete a user */
//************ @route DELETE /user
//************ @access Private
const deleteUser = async (req, res) => {
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
};

module.exports = {
  checkDuplicateUsername,
  checkDuplicateEmail,
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
