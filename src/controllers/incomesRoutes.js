import { Router } from "express";
import Incomes from "../models/incomes.js";
import User from "../models/usuario.js";
import authMiddlware from '../middlewares/authMiddleware.js'
import { Op } from "sequelize";


const router = Router()

router.use(authMiddlware)

const getIncomeById = async ( id ) => {

    const income = await Incomes.findByPk(id)
    return income
}


router.get("/" , async ( req, res ) => {

    try {
        //incluir objeto completo en la consulta de un endpoint con relacion
        const incomes = await Incomes.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "email"]
                }
            ]
        })
        res.json(incomes)
    } catch (err) {
        res.status(500).json({error: err})
    }
})

router.post("/", async (req, res) => {
    
    try {

        const { mount, description,  user_id } = req.body

        const income = await Incomes.create({mount, description,user_id})

        res.status(201).json(income)

    } catch {
        res.status(500).json({error: err })
    }

})


router.get("/:id", async ( req , res ) => { 

    try {
        const income = await getIncomeById(req.params.id)

        if (!income) return res.status(404).json({error: "El income con ese id no existe"})
        res.json(income)
    } catch (err) {
        res.status(500).json({error: err})
    }

})


router.put("/:id" , async ( req , res) => { 

    try {

        const income = await getIncomeById(req.params.id)

        if(!income) return res.status(404).json({error: "El income con ese id no se encontro"})

        const { mount, description, user_id } = req.body

        income.mount = mount
        income.description = description
        income.user_id = user_id

        await income.save()
        res.json(income)

    } catch (err) {

        res.status(500).json({error: err})
    }

 
})

router.get("/user/:id", async (req,res) => {
    try{
        const expensesByUser = await Incomes.findAll({
            where: {user_id: req.params.id},
        } )
        res.json(expensesByUser)
    } catch(err) {
        res.status(500).json({error: err})
    }
})

router.delete("/:id", async ( req , res ) => {

    try {

        const income = await getIncomeById(req.params.id)

        if (!income) return res.status(404).json({error: "El income con ese id no existe"})

        await income.destroy()

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

        const expense = await Incomes.findAll({
            where: {
                date: {
                    [Op.between]: [startDate, endDate]
                },
                user_id: userId
            }
            
        })

        if (!expense) return res.status(404).json({error: "no incomes found in that month"})
   
        const totalMount = expense.map(exp => Number(exp.mount));
        const mountPerMonth = totalMount.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        res.json({"TotalIncomesPerMonth": mountPerMonth})
    } catch (err) {
        res.status(500).json({error: err})
    }
}
)

export default router;