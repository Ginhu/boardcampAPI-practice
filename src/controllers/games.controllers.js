import {db} from "../database/database.connection.js"

export async function getGames(req, res) {
    const {name} = req.query

    try {
        let gamesInDB;
        if(name) {
            gamesInDB = await db.query(`SELECT * FROM games WHERE name LIKE '%${name}%';`)
            console.log(name)
        } else {
            gamesInDB = await db.query(`SELECT * FROM games;`)
        }
        
        res.send(gamesInDB.rows)
    } catch (err) {
        console.log(err.message)
    }



}

export async function insertGames(req, res) {
    const {name, image, stockTotal, pricePerDay} = req.body
    
    try {
        const notNewGame = await db.query(`SELECT * FROM games WHERE name=$1;`, [name])
        if(notNewGame.rowCount>0) return res.sendStatus(409)

        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") 
        VALUES ($1, $2, $3, $4);`
        , [name, image, stockTotal, pricePerDay])
        res.sendStatus(201)
    } catch (err) {
        console.log(err.message)
    }
}