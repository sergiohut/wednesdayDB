const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/token");


//Aqui es donde vamos a hacer uso del generador de tokens. Asi vemos para que se utiliza. Para que sirve. 

    //Creamos un nuevo usuario con el molde de user y lo que estemos metiendole en el cuerpo en el Insomnia. 
    //Comprobamos si hay un usuario registrado con el email de este usuario que estamos creando. 
    //Solo se crea si no hay usuario que ya este registrado con este mail 

const registerUser = async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    const userExists = await User.findOne({ email: newUser.email });
    //Si existe nos salimos de la función y devolvemos el error
    if (userExists) {
      return next("User already exists");
    }
    const createdUser = await newUser.save();
    //Una vez guardado en la base de datos, nuleamos el password para no enseñarlo en la resputa
    createdUser.password = null;
    return res.status(201).json(createdUser);
  } catch (error) {
    //los mensajes de error custom estan bien porque queda como mejor visualmente pero el error solo te da mucha más info ("error registering user", error)
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    //Intentamos localizar al usuario por email, si no lo encuentra devuelve un error
    //Si lo encuentra comprueba que la contraseña coincida con la que le estamos pasando y de ser asi genera un token.
    const user = await User.findOne({ email: req.body.email });
    //Si no lo encontramos nos salimos de la función
    if (!user) {
      return next("User not found");
    }
    //Comprobar la contraseña con bcrypt, comprobamos la que le pasemos con la que tiene el usuario
    if (bcrypt.compareSync(req.body.password, user.password)) {
      //Si las contraseña coinciden creamos un token
      const token = generateToken(user._id, user.email);
      return res.status(200).json(token);
    }
  } catch (error) {
    return next("User cannot login", error);
  }
};

const logoutUser = (req, res, next) => {
  try {
    const token = null;
    return res.status(201).json(token);
  } catch (error) {
    return next(error);
  }
};

module.exports = { registerUser, loginUser, logoutUser };
