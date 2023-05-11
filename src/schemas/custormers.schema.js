import joi from "joi"

export const customersSchema = joi.object({
    name: joi.string().min(1).required(),
    cpf: joi.string().regex(/^\d+$/).length(11).required(),
    phone: joi.string().regex(/^\d+$/).min(10).max(11).required(),
    birthday: joi.date().required()
})