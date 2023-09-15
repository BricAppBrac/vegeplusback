const express = require("express");
const router = express.Router();
const usersController = require("../controllers/user.controller");

// Route pour créer un nouvel utilisateur (pas de vérification JWT car ouvert pour SignUp)
// router.get("/", usersController.getAllUsers);
router.post("/", usersController.createNewUser);

// Ajouter une route pour vérifier un pseudo en double
router.get("/check-username/:username", usersController.checkDuplicateUsername);

// Ajouter une route pour vérifier un email en double
router.get("/check-email/:email", usersController.checkDuplicateEmail);

//**************************************** */
// routes qui demandent l'authentification
//**************************************** */
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(usersController.getAllUsers)
  // .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
