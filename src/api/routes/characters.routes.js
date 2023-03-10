const express = require("express")
const CharactersRoutes = express.Router();
const {isAuth} = require("../../middlewares/auth.middleware")

const {upload} = require("../../middlewares/files.middleware");

const {getAllCharacters, createCharacter, updateCharacterByID} = require("../controllers/characters.controllers");

CharactersRoutes.get('/', [isAuth], getAllCharacters)

CharactersRoutes.post('/', upload.single('image'), createCharacter)

CharactersRoutes.patch("/:id", upload.single("image"), updateCharacterByID);

module.exports = CharactersRoutes
