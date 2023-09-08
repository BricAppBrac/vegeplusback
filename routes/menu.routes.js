const express = require("express");
// const auth = require("../middleware/auth");
const {
  getMenus,
  setMenu,
  editMenu,
  deleteMenu,
} = require("../controllers/menu.controller");
const router = express.Router();

//**************************************** */
// routes qui demandent l'authentification
//**************************************** */
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.get("/", getMenus);

router.post("/", setMenu);

router.put("/:id", editMenu);

router.delete("/:id", deleteMenu);

module.exports = router;
