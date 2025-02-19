import { Router } from "express";
import Expense from "../models/expenses.js";
import Category from "../models/category.js";
import authMiddlware from '../middlewares/authMiddleware.js'
import { Op } from "sequelize";


const router = Router()

router.use(authMiddlware)

const getExpenseById = async ( id ) => {

    const expense = await Expense.findByPk(id, {
        include: {
            model: Category,
            attributes: ['name']
        }
    })
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

router.get("/user/:id", async (req,res) => {
    try{
        const expensesByUser = await Expense.findAll({
            where: {user_id: req.params.id},
            include: [
                {

                    model: Category,
                    attributes: ['name']
                }
            ]
        } )
        res.json(expensesByUser)
    } catch(err) {
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

router.post('/month', async(req, res) => {
    try {

        const {year, month, userId} = req.body

        if (!year || !month) {
            res.status(400).json({error: "Debes proporcionar fechas validas"})
        }

        const startDate = new Date(year,month - 1, 1)
        const endDate = new Date(year,month, 0, 23, 59, 59)

        const expense = await Expense.findAll({
            where: {
                date: {
                    [Op.between]: [startDate, endDate]
                },
                user_id: userId
            }
            
        })
   
        const totalMount = expense.map(exp => Number(exp.mount));
        const mountPerMonth = totalMount.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        res.json({"TotalExpenesPerMonth": mountPerMonth})
    } catch (err) {
        res.status(500).json({error: err})
    }
}
)

export default router