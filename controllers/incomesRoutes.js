import { Router } from "express";
import Incomes from "../models/incomes.js";
import User from "../models/usuario.js";
import authMiddlware from '../middlewares/authMiddleware.js'

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

export default router;