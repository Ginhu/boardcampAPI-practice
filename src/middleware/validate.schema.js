import {db} from "../database/database.connection.js"

export function validateNewGame (schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body, { abortEarly: false})
        if(validation.error) {
            const errors = validation.error.details.map(details => details.message)
            return res.status(400).send(errors)
        }
        next()
    }
}

export function validateCustomer (schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body, { abortEarly: false})
        if(validation.error) {
            const errors = validation.error.details.map(details => details.message)
            return res.status(400).send(errors)
        }
        next()
    }
}

export function validateRentals (schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body, { abortEarly: false})
        if(validation.error) {
            const errors = validation.error.details.map(details=>details.message)
            return res.send(errors)
        }
        next()
    }
}

export async function validateCustomerRentals(req, res, next) {
    const {customerId} = req.body
    res.locals.customerId = customerId
    try {
        const actuallyCustomer = await db.query(`SELECT * FROM customers WHERE id=$1`, [customerId])
        if(actuallyCustomer.rowCount === 0) return res.sendStatus(400)
    } catch (err) {
        console.log(err.message)
    }

    next()
}

export async function validateGameExists (req, res, next) {
    const {gameId} = req.body
    res.locals.gameId = gameId
    try {
        const gameExists = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId])
        if(gameExists.rowCount === 0) return res.sendStatus(400)
        res.locals.gameExists = gameExists
    } catch (err) {
        console.log(err.message)
    }
    
    next()
}

export async function validateGamesRented (req, res, next) {
    const {gameId, gameExists} = res.locals

    try {
        const gamesRented = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL`, [gameId])
        if(gamesRented.rowCount===gameExists.rows[0].stockTotal) return res.sendStatus(400)
    } catch (err) {
        console.log(err.message)
    }

    next()
}

export function validateDaysRented (req, res, next) {
    const {daysRented} = req.body
    if(daysRented<=0) return res.sendStatus(400)
    res.locals.daysRented = daysRented
    next()
}

export async function validateRentalId (req, res, next) {
    const {id} = req.params
    res.locals.id = id
    try {
        const rentalExists = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id])
        if(rentalExists.rowCount === 0) return res.sendStatus(404)
        res.locals.rentals = rentalExists
    } catch (err) {
        console.log(err.message)
    }
    next()
}

export function validateRentalNotReturned (req, res, next) {
    const {id, rentals} = res.locals

    if(rentals.rows[0].returnDate !== null) return res.sendStatus(400)

    next()
    
}