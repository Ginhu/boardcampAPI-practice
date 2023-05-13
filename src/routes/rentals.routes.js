import { Router } from "express";
import { finalizeRent, getRentals, insertRental } from "../controllers/rentals.controllers.js";
import { validateCustomerRentals, validateDaysRented, validateGameExists, validateGamesRented, validateRentalId, validateRentalNotReturned, validateRentals } from "../middleware/validate.schema.js";
import {rentalsSchema} from "../schemas/rentals.schema.js"

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", validateRentals(rentalsSchema), validateCustomerRentals, validateGameExists, validateGamesRented, validateDaysRented, insertRental)
rentalsRouter.post("/rentals/:id/return", validateRentalId, validateRentalNotReturned, finalizeRent)

export default rentalsRouter