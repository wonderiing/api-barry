import { Router } from "express";
import Crypto from "../models/crypto.js";
import axios from "axios";


const router = Router()


const getCryptoById = async (id) => {
    const crypto = await Crypto.findByPk(id)
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

router.get('/value', async (req, res) => {
    try {
        const pair = req.query.pair;
        if (!pair) {
            return res.status(400).json({ error: 'El parámetro pair es requerido' });
        }

        console.log(`Solicitud recibida para: ${pair}`);

        const endpoint = `https://api.coinbase.com/v2/prices/${pair}/spot`;
        console.log(`Consultando API de Coinbase: ${endpoint}`);

        const response = await axios.get(endpoint);
        console.log(`Respuesta de Coinbase:`, response.data);

        res.json(response.data);
    } catch (error) {

        res.status(500).json({ 
            error: error.message || 'Error interno del servidor', 
            details: error.response?.data || error.stack,
            fullError: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});

router.get("/:id", async (req ,res) => {
    try {
        const crypto = await getCryptoById(req.params.id)
        
        if (!crypto) {
            return res.status(404).json({error: "La crypto no se encontró"})
        }
        
        res.json(crypto)
    } catch (err) {
        res.status(500).json({error: err.message})
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