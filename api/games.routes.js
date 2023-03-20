import express from "express";
import GamesController from "./games.controller.js";

const router = express.Router()

// routes for game API
router.route("/public-games").get(GamesController.apiGetPublicGames)
router.route("/:user").get(GamesController.apiGetUserGames)
router.route("/save").post(GamesController.apiPostGame)
router.route("/game/:id")
  .get(GamesController.apiGetGame)
  .put(GamesController.apiUpdateGame)
  .delete(GamesController.apiDeleteGame)
  
export default router