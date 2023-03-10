const Character = require('../models/character.model')
const { deleteImgCloudinary } = require("../../middlewares/files.middleware");

//esto es para lo de la paginación y me parece super super enrevesado. Ver a parte. Como una segunda opción avanzada. Saltar al createCharacters
const getAllCharacters = async (req, res, next) => {
    try {
        const allCharacters = await Character.find();
        return res.status(200).json(allCharacters);
    } catch (error) {
        return next('Cannot find characters', error)
    }
};

const createCharacter = async (req, res, next) => {
  try {
    const newCharacter = new Character({
      ...req.body,
      image: req.file ? req.file.path : 'Not image found',
    })
    const createdCharacter = await newCharacter.save()
    return res.status(201).json(createdCharacter)
  } catch (error) {
    return next('Failed creating Character', error)
  }
}

const updateCharacterByID = async (req, res, next) => {
  try {
    //Crea una movie nueva con su molde y le dice que sustituya su id por el que tenia el objeto original que estamos editando 

    //Borramos la imagen que tuviese el objeto original con findById y metemos el poster nuevo
    //Actualizamos el objeto original con el nuevo objeto 
    const { id } = req.params;
    const newCharacter = new Character(req.body);
    newCharacter._id = id;

    const originalCharacter = await Character.findById(id);
    if (req.file) {
      deleteImgCloudinary(originalCharacter.image);
      newCharacter.image = req.file.path;
    }
    await Character.findByIdAndUpdate(id, newCharacter);

    return res.status(200).json(newCharacter);
  } catch (error) {
    return next("Failing updating character", error);
  }
};

module.exports = { getAllCharacters, createCharacter, updateCharacterByID }
