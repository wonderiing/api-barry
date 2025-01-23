import { Router } from "express";
import Expense from "../models/expenses.js";
import Category from "../models/category.js";
import authMiddlware from '../middlewares/authMiddleware.js'

const router = Router()

router.use(authMiddlware)

const getExpenseById = async ( id ) => {

    const expense = await Expense.findByPk(id)
    return expense
}

router.get("/", async ( req, res) => {

    try {

        const expenses = await Expense.findAll({
            include: [
                {
                    model: Category,
                    attributes: ["name"]
                }
            ]
        })
        res.json(expenses)
    } catch (err) {
        res.status(500).json({error: err})
    }
})

router.post("/", async ( req , res) => {

    try {

        const {mount, description, user_id, category_id} = req.body

        const expense = await Expense.create({mount, description, user_id, category_id})

        res.status(201).json(expense)
    } catch (err) {
        res.status(500).json({error: err})
    }
})


router.get("/:id" , async (req, res ) => {

    try {
        const expense = await getExpenseById(req.params.id)
        if(!expense) return res.status(404).json({error: "El expense con ese id no se encontro"})

        res.json(expense)
    } catch (err) {
        res.status(500).json({error: err})
    }
})


router.put("/:id", async (req, res ) => {

    try {

        const expense = await getExpenseById(req.params.id)

        if (!expense) return res.status(404).json({error: "El expense con ese id no se encontro"})
        
        const { mount, description, category_id } = req.body

        expense.mount = mount
        expense.description = description
        expense.category_id = category_id

        await expense.save()

        res.json(expense)

    } catch (err) {
        res.status(500).json({error: err})
    }
})

router.delete("/:id", async(req, res) => {

    try {

        const expense = await getExpenseById(req.params.id)

        if (!expense) return res.status(404).json({error: "El expense con ese id no se encontro"})
        await expense.destroy()
        res.json({message: "Eliminado correctamente"})

    } catch (err) {
        res.status(500).json({error: err})
    }
})

export default router