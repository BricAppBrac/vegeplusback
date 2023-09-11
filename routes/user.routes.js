const express = require("express");
const router = express.Router();
const usersController = require("../controllers/user.controller");

// Route pour créer un nouvel utilisateur (pas de vérification JWT)
// router.get("/", usersController.getAllUsers);
router.post("/", usersController.createNewUser);

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
