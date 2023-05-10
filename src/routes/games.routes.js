import { Router } from "express";
import { getGames, insertGames } from "../controllers/games.controllers.js";
import { validateNewGame } from "../middleware/validate.schema.js";
import { gamesSchema } from "../schemas/games.schema.js";

const gamesRouter = Router()

gamesRouter.get("/games", getGames)
gamesRouter.post("/games", validateNewGame(gamesSchema), insertGames)

export default gamesRouter