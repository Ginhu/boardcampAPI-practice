import { Router } from "express";
import { getCustomers, getCustomersByID, insertNewCustomer, updateCustomer } from "../controllers/customers.controllers.js";
import { validateNewCustomer } from "../middleware/validate.schema.js";
import { customersSchema } from "../schemas/custormers.schema.js";
/* import { getGames, insertGames } from "../controllers/games.controllers.js";
import { validateNewGame } from "../middleware/validate.schema.js";
import { gamesSchema } from "../schemas/games.schema.js"; */

const customerRouter = Router()

customerRouter.get("/customers", getCustomers)
customerRouter.get("/customers/:id", getCustomersByID)
customerRouter.post("/customers", validateNewCustomer(customersSchema), insertNewCustomer)
customerRouter.put("/customers/:id", updateCustomer)

export default customerRouter