import { Router } from "express";
import aiRecommendations from "../models/aiRecommendations.js";



const router = Router()

const getAiRecommendationById = async ( id ) => {

    const ai = await aiRecommendations.findByPk(id)
    return ai
}


router.get("/", async ( req , res ) => {

    try {
        const ai = await aiRecommendations.findAll()
        res.json(ai)
    } catch (err) {
        res.status(500).json({error: err})
    }
})

router.post("/", async (req, res) => {

    try {
        const { query, answer, date, user_id } = req.body

        const aiReccomendation = await aiRecommendations.create({query, answer, date, user_id})
        res.json(aiReccomendation)
    } catch (err) {
        res.status(500).json({error: err})
    }
})


router.get("/:id", async ( req, res ) => {

    try {
        const aiReccomendation = await getAiRecommendationById(req.params.id)

        if(!aiReccomendation) return res.status(404).json({error: "El query con ese id no se encontro"})
        res.json(aiReccomendation)
    } catch (err) {
         res.status(500).json({error: err})
        }
})



router.delete("/:id", async (req, res) => {

    try {

        const aiReccomendation = await getAiRecommendationById(req.params.id)
        await aiReccomendation.destroy()

        res.json({message: "Eliminacion exitosa"})
            
    } catch (Err) {
        res.status(500).json({error :err})
    }
})

export default router