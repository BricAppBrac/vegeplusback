const mongoose = require("mongoose");

const menuSchema = mongoose.Schema(
  {
    user: {
      // type: mongoose.Schema.Types.ObjectId,
      type: String,
      default: "Melissande",
      ref: "user.model",
    },
    prefNbJ: {
      type: Number,
      required: true,
    },
    prefNbMeal: {
      type: Number,
      required: true,
    },
    prefDayOne: {
      type: String,
      required: true,
    },
    menuJ: {
      type: [],
    },
  },

  {
    timestamps: true,
  }
);

// nom dans la base de données MongoDB "menu"
// structure de base de cette base de données : menuSchema
module.exports = mongoose.model("menu", menuSchema);
