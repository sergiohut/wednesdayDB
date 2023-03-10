const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connect = require("./src/utils/connect");
const { configCloudinary } = require("./src/middlewares/files.middleware");

dotenv.config();
configCloudinary();

const PORT = process.env.PORT || 8092;

const server = express();
//Connect to DB
connect();
//CORS
server.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
//PARSER
server.use(express.json({ limit: "5mb" }));
server.use(express.urlencoded({ limit: "5mb", extended: true }));

//Routes
const CharactersRoutes = require("./src/api/routes/characters.routes");
server.use("/api/v1/characters", CharactersRoutes);

const UsersRoutes = require("./src/api/routes/users.routes");
server.use("/api/v1/users", UsersRoutes);

const FactionsRoutes = require('./src/api/routes/factions.routes')
server.use('/api/v1/factions', FactionsRoutes)

//Route not found
server.use("*", (req, res, next) => {
  const error = new Error("Route not found");
  return next(error);
});

//Hide tech
server.disable("x-powered-by");

//Listen
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
