const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
    },
    quantities: {
      type: [String],
    },
    categories: {
      type: [String],
    },
    steps: {
      type: [String],
    },
    seasons: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// nom dans la base de données MongoDB "recipe"
// structure de base de cette base de données : recipeSchema
module.exports = mongoose.model("recipe", recipeSchema);
