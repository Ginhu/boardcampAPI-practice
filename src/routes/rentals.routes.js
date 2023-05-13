import { Router } from "express";
import { deleteRental, finalizeRent, getRentals, insertRental } from "../controllers/rentals.controllers.js";
import { validateCustomerRentals, validateDaysRented, validateGameExists, validateGamesRented, validateRentalId, validateRentalNotReturned, validateRentals, validateReturnDate } from "../middleware/validate.schema.js";
import {rentalsSchema} from "../schemas/rentals.schema.js"

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", validateRentals(rentalsSchema), validateCustomerRentals, validateGameExists, validateGamesRented, validateDaysRented, insertRental)
rentalsRouter.post("/rentals/:id/return", validateRentalId, validateRentalNotReturned, finalizeRent)
rentalsRouter.delete("/rentals/:id", validateRentalId, validateReturnDate, deleteRental)

export default rentalsRouter