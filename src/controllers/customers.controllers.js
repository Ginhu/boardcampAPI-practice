import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function getCustomers(req, res) {
    try {
        const customers = await db.query(`SELECT * FROM customers;`)
        customers.rows.map(el=> el.birthday = dayjs(el.birthday).format('YYYY-MM-DD'))
        res.send(customers.rows)
    } catch (err) {
        console.log(err.message)
    }
}

export async function getCustomersByID(req, res) {
    const {id} = req.params
    
    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [id])
        if(customer.rowCount === 0) return res.sendStatus(404)

        customer.rows.map(el => el.birthday = dayjs(el.birthday).format('YYYY-MM-DD'))

        return res.send(customer.rows[0])
    } catch (err) {
        console.log(err.message)
    }
}

export async function insertNewCustomer (req, res) {
    const {name, cpf, phone, birthday} = req.body
    

    try {
        const notNewCustomer = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf])
        if(notNewCustomer.rowCount>0) return res.sendStatus(409)

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) 
        VALUES ($1, $2, $3, $4);`, 
        [name, phone, cpf, dayjs(birthday).format('YYYY-MM-DD')])
        res.sendStatus(201)

    } catch (err) {
        console.log(err.message)
    }
}

export async function updateCustomer (req, res) {
    const {name, cpf, phone, birthday} = req.body
    const {id} = req.params

    try {
        const notCorrectCustomer = await db.query(`SELECT * FROM customers WHERE id=$1`, [id])
        const notCorrectCustomerCpf = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf])
        if(notCorrectCustomer.rowCount === 0) return res.sendStatus(409)
        if((notCorrectCustomerCpf.rowCount>0 && notCorrectCustomerCpf.rows[0].id != id)) return res.sendStatus(409)
        await db.query(`UPDATE customers SET name=$1, phone=$2, birthday=$3, cpf=$5 WHERE id=$4`, [name, phone, birthday, id, cpf])
        res.sendStatus(200)
        
    } catch (err) {
        console.log(err.message)
    }
}