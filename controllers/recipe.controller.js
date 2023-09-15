const jwt = require("jsonwebtoken");
const RecipeModel = require("../models/recipe.model");

// fonction pour récupérer toutes les recettes
module.exports.getRecipes = async (req, res) => {
  const recipes = await RecipeModel.find();
  if (!recipes?.length) {
    return res.status(400).json({ message: "Pas de recette enregistrée" });
  }
  res.status(200).json(recipes);
};

// fonction pour créer une recette
module.exports.setRecipe = async (req, res) => {
  if (!req.body.title) {
    res.status(400).json({ message: "Merci d'ajouter un titre" });
  }

  const recipe = await RecipeModel.create({
    title: req.body.title,
    author: req.body.author,
    seasons: req.body.seasons,
    ingredients: req.body.ingredients,
    quantities: req.body.quantities,
    categories: req.body.categories,
    steps: req.body.steps,
  });
  res.status(200).json(recipe);
};

// fonction pour modifier une recette
module.exports.editRecipe = async (req, res) => {
  const recipe = await RecipeModel.findById(req.params.id);
  // console.log("editRecipe controller");
  // console.log("req.params.id : " + req.params.id);
  // console.log("recipe : ");
  // console.log(recipe);
  if (!recipe) {
    res
      .status(400)
      .json({ message: "Modification impossible. Cette recette n'existe pas" });
  }

  const updateRecipe = await RecipeModel.findByIdAndUpdate(recipe, req.body, {
    new: true,
  });
  // console.log("updateRecipe : " + updateRecipe);
  res.status(200).json(updateRecipe);
  // console.log("status : " + res.statusCode);
};

// fonction pour supprimer une recette
module.exports.deleteRecipe = async (req, res) => {
  // console.log("Recette à supprimer ID:", req.params.id);

  try {
    const recipe = await RecipeModel.findById(req.params.id);

    if (!recipe) {
      // console.log("Recette non trouvée pour suppression:", req.params.id);
      return res.status(400).json({
        message: "Suppression impossible. Cette recette n'existe pas",
      });
    }

    // console.log("Recette en cours de suppression:", recipe);
    await RecipeModel.findByIdAndDelete(req.params.id);

    // console.log("Recette supprimée:", req.params.id);
    res.status(200).json({ message: "Recette supprimée " + req.params.id });
  } catch (error) {
    console.error("Erreur lors de la suppression de la recette:", error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la suppression de la recette",
    });
  }
};

// fonction pour ajouter une saison
module.exports.seasonRecipe = async (req, res) => {
  try {
    await RecipeModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { seasons: req.body.season } },
      { new: true }
    ).then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(400).json(err);
  }
};

// fonction pour supprimer une saison
module.exports.supprSeasonRecipe = async (req, res) => {
  try {
    await RecipeModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { seasons: req.body.season } },
      { new: true }
    ).then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(400).json(err);
  }
};

// fonction pour ajouter un ingrédient
module.exports.ingredientRecipe = async (req, res) => {
  try {
    await RecipeModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { ingredients: req.body.ingredient } },
      { new: true }
    ).then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(400).json(err);
  }
};

// fonction pour supprimer un ingrédient
module.exports.supprIngredientRecipe = async (req, res) => {
  try {
    await RecipeModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { ingredients: req.body.ingredient } },
      { new: true }
    ).then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(400).json(err);
  }
};

// fonction pour ajouter une quantité
module.exports.quantityIngredient = async (req, res) => {
  try {
    await RecipeModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { quantities: req.body.quantity } },
      { new: true }
    ).then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(400).json(err);
  }
};

// fonction pour supprimer une quantité
module.exports.supprQuantityIngredient = async (req, res) => {
  try {
    await RecipeModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { quantities: req.body.quantity } },
      { new: true }
    ).then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(400).json(err);
  }
};

// fonction pour ajouter une catégorie
module.exports.categoryIngredient = async (req, res) => {
  try {
    await RecipeModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { categories: req.body.category } },
      { new: true }
    ).then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(400).json(err);
  }
};

// fonction pour supprimer une catégorie
module.exports.supprCategoryIngredient = async (req, res) => {
  try {
    await RecipeModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { categories: req.body.category } },
      { new: true }
    ).then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(400).json(err);
  }
};

// fonction pour ajouter une étape
module.exports.stepRecipe = async (req, res) => {
  try {
    await RecipeModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { steps: req.body.step } },
      { new: true }
    ).then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(400).json(err);
  }
};

// fonction pour supprimer une étape
module.exports.supprStepRecipe = async (req, res) => {
  try {
    await RecipeModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { steps: req.body.step } },
      { new: true }
    ).then((data) => res.status(200).send(data));
  } catch (err) {
    res.status(400).json(err);
  }
};
