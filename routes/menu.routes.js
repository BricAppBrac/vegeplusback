const express = require("express");
// const auth = require("../middleware/auth");
const {
  getMenus,
  setMenu,
  updateMenu,
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

router.put("/:id", updateMenu);

router.delete("/:id", deleteMenu);

module.exports = router;
