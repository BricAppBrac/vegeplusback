const express = require("express");
// const auth = require("../middleware/auth");
const {
  setRecipe,
  // setCompleteRecipe,
  getRecipes,
  editRecipe,
  deleteRecipe,
  ingredientRecipe,
  supprIngredientRecipe,
  seasonRecipe,
  supprSeasonRecipe,
  quantityIngredient,
  supprQuantityIngredient,
  categoryIngredient,
  supprCategoryIngredient,
  stepRecipe,
  supprStepRecipe,
} = require("../controllers/recipe.controller");
const router = express.Router();

//*********************************************** */
// routes qui ne demandent pas d'authentification
//*********************************************** */
router.get("/", getRecipes);
//**************************************** */
// routes qui demandent l'authentification
//**************************************** */
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.post("/", setRecipe);

router.get("/admin", getRecipes);

// router.post("/complete", setCompleteRecipe);

router.put("/:id", editRecipe);

router.delete("/:id", deleteRecipe);

router.patch("/ingredient-recipe/:id", ingredientRecipe);

router.patch("/suppr-ingredient-recipe/:id", supprIngredientRecipe);

router.patch("/quantity-ingredient/:id", quantityIngredient);

router.patch("/suppr-quantity-ingredient/:id", supprQuantityIngredient);

router.patch("/category-ingredient/:id", categoryIngredient);

router.patch("/suppr-category-ingredient/:id", supprCategoryIngredient);

router.patch("/season-recipe/:id", seasonRecipe);

router.patch("/suppr-season-recipe/:id", supprSeasonRecipe);

router.patch("/step-recipe/:id", stepRecipe);

router.patch("/suppr-step-recipe/:id", supprStepRecipe);

module.exports = router;
