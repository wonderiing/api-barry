import { Router } from "express";
import Category from "../models/category.js";

const router = Router()



const getCategoriaById = async (id) => {

    const categoria = await Category.findByPk(id)
    return categoria

}

router.get("/", async (req, res) => {

    try {
        const category = await Category.findAll()
        res.json(category)
    } catch ( err ) {
        res.status(500).json({error: "Algo paso"})
    }

})


router.post("/", async ( req, res ) => {

    try {

        const {name} = req.body
        const category = await Category.create({name})

        res.status(201).json(category)

    } catch(err) {
        res.status(400).json({error: err})
    }

})

router.get("/:id", async (req, res) => {

    try{
        const category = await getCategoriaById(req.params.id)

        if(!category) return res.status(404).json({error: "Esa categoria no existe"})
        res.json(category)
    } catch (err) {
        res.status(500).json({error: err})
    }

})

router.put("/:id", async (req, res) => {

    try{
        
        const category = await getCategoriaById(req.params.id)

        if(!category) return res.status(404).json({error: "Esa categoria no se encontro"})

        const { name } = req.body

        category.name = name
        await category.save()

        res.json(category)

    } catch (err) {
        res.status(500).json({error: err})
    }
})

router.delete("/:id", async ( req, res) => {

    try {
        const category = await getCategoriaById(req.params.id)

        if(!category) return res.status(404).json({error: "esa categoria no existe"})

        await category.destroy()
        res.json({mensaje: "Eliminado con exito"})
    } catch(err) {
        res.status(500).json({error: err})
    }
})


export default router;