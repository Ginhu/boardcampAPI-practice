import { Router } from "express";
import { getCustomers, getCustomersByID, insertNewCustomer, updateCustomer } from "../controllers/customers.controllers.js";
import { validateCustomer } from "../middleware/validate.schema.js";
import { customersSchema } from "../schemas/custormers.schema.js";

const customerRouter = Router()

customerRouter.get("/customers", getCustomers)
customerRouter.get("/customers/:id", getCustomersByID)
customerRouter.post("/customers", validateCustomer(customersSchema), insertNewCustomer)
customerRouter.put("/customers/:id", validateCustomer(customersSchema), updateCustomer)

export default customerRouter