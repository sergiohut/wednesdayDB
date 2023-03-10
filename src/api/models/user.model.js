const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      validate: [validator.isEmail, "Email not valid"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [8, "Min 8 characters"],
    },
  },
  {
    timestamps: true,
  }
);

//Antes de guardar el modelo en la base de datos vamos a encriptar la contraseña
UserSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next("Error hashing password", error);
  }
});
//Con esto lo que se consigue es que al añadir un usuario nuevo en la base de datos, se encripta la contraseña para que se almacene cifrada y no sea accesible o se muestre.  

const User = mongoose.model("User", UserSchema);
module.exports = User;
