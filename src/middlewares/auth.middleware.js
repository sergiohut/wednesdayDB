const User = require("../api/models/user.model");
const { verifyToken } = require("../utils/token");

//Definimos la función para comprobar que los token son validos o no
//comprobar si hay token con req.headers.authorization si no no autoriza. 

  //Troceamos el token para quedarnos solo con el token
  // Header Auth -> "Bearer aioshdlgnbasldng"
  // remplazamos bearer espacio por nada, pues ok

    //Comprobamos si hay token

const isAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return next(new Error("Unauthorized"));
  }
  try {
    //Intentamos decodificar el token con verifyToken con el token y el secreto. 
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    //Saca un id del decodificado y localiza el usuario que tenga ese mismo id
    req.user = await User.findById(decoded.id);
    //Si esta todo correcto haremos lo que sea que querramos hacer después de la guarda
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isAuth };
