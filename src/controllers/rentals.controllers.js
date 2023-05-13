import {db} from "../database/database.connection.js"
import dayjs from "dayjs"

export async function getRentals (req, res)  {
    try {
        const rentals = await db.query(`SELECT * FROM rentals;`)
        res.send(rentals.rows)
    } catch (err) {
        console.log(err)
    }
}

export async function insertRental (req, res) {
    const today = dayjs().format('YYYY/MM/DD')
    const {gameExists, gameId, customerId, daysRented} = res.locals
    const originalPrice = daysRented*gameExists.rows[0].pricePerDay

    try {
        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, null, $5, null)`, [customerId, gameId, today, daysRented, originalPrice])

        res.sendStatus(201)
    } catch (err) {
        console.log(err.message)
    }
}

export async function finalizeRent (req, res) {
    const today = new Date()
    const {rentals} = res.locals
    try {
        const rentDate = new Date(rentals.rows[0].rentDate)
        const returnDay = rentDate.setDate(rentDate.getDate() + rentals.rows[0].daysRented)
        if(returnDay >= today) console.log("good")
        console.log(dayjs(returnDay).format('YYYY-MM-DD'))
        res.send("eae")
    } catch (err) {
        console.log(err.message)
    }
}