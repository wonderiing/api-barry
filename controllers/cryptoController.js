import { Router } from "express";
import Crypto from "../models/crypto.js";


const router = Router()


const getCryptoById = async (id) => {

    const crypto = await Crypto.findByPk(id)
    if (!crypto) return res.status(404).json({error: "La crypto no se encontro"})    
    return crypto
}

router.get("/", async (req , res ) => {
    try {

        const crypto = await Crypto.findAll()

        res.json(crypto)

    } catch (err) {
        res.status(500).json({error: err})
    }
})

router.post("/", async (req, res) => {

    try{


        const {name, symbol} = req.body

        const crypto = await Crypto.create({name, symbol})
        res.json(crypto)

    } catch(err) {
        res.status(500).json({error: err})
    }
})


router.get("/:id", async (req ,res) => {
    try {

        const crypto = await getCryptoById(req.params.id)
        
        res.json(crypto)
    } catch (err) {
        res.status(500).json({error: err})
    }
})

router.put("/:id", async (req, res) => {

    try {

        const crypto = await getCryptoById(req.params.id)

            
        const {name, symbol} = req.body

        crypto.name = name
        crypto.symbol = symbol
        await crypto.save()
        res.json(crypto)

    
    } catch (err) { 
        res.status(500).json({error: err})
    }
})

router.delete("/:id", async (req,res) => {

    try {

        const crypto = await getCryptoById(req.params.id)

        await crypto.destroy()

        res.json({message: "Eliminado correctamente"})
    } catch (err) {
        res.status(500).json({error : err})
    }
}) 

export default router;