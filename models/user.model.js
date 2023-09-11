const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "Inconnu",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.plugin(uniqueValidator);

// nom dans la base de données MongoDB "user"
// structure de base de cette base de données : userSchema
module.exports = mongoose.model("user", userSchema);