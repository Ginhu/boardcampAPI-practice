import {db} from "../database/database.connection.js"
import dayjs from "dayjs"

export async function getRentals (req, res)  {
    try {
        const rentals = await db.query(`SELECT rentals.*, customers.name AS customer_name, games.name AS game_name
        FROM rentals
        JOIN customers ON rentals."customerId"=customers.id
        JOIN games ON rentals."gameId"=games.id;`)
        rentals.rows.map(el=> {
            el.rentDate = dayjs(el.rentDate).format('YYYY-MM-DD')
            if (el.returnDate != null) el.returnDate = dayjs(el.returnDate).format('YYYY-MM-DD')
            el.customer = {
                id: el.customerId,
                name: el.customer_name
            }
            el.game = {
                id: el.gameId,
                name: el.game_name
            }
            delete el.customer_name;
            delete el.game_name;
        })
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
    const {rentals, id} = res.locals

    const rentDate = new Date(rentals.rows[0].rentDate)
    const returnDay = rentDate.setDate(rentDate.getDate() + rentals.rows[0].daysRented)
    const daysDifference = Math.ceil((returnDay - today)/(1000*60*60*24))
    let delayFee = 0

    if(daysDifference < 0) {
        delayFee = ((rentals.rows[0].originalPrice/rentals.rows[0].daysRented)*Math.abs(daysDifference))
    }

    try {
        await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`, [dayjs(today).format('YYYY-MM-DD'), delayFee, id])
        res.sendStatus(200)
    } catch (err) {
        console.log(err.message)
    }
}

export async function deleteRental (req, res) {
    const {id} = res.locals

    try {
        await db.query(`DELETE FROM rentals WHERE id=$1`, [id])
        res.sendStatus(200)
    } catch (err) {
        console.log(err.message)
    }
}