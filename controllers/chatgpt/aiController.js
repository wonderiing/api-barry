import OpenAI from "openai";
import { Router } from "express";
import dotenv from 'dotenv';
import axios from "axios";

dotenv.config()

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY
});


const router = Router()

router.post('/', async (req, res) => {
    try {
      const { message } = req.body;
  
      if (typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ error: "El mensaje debe ser un texto válido" });
      }
  
      const deepseekResponse = await axios.post(
        'https://api.deepseek.com/v1/chat/completions', 
        {
          model: "deepseek-model-name", 
          messages: [
            { role: "system", content: "You are a financial expert. Answer with precise investment and tax strategies." },
            { role: "user", content: message },
          ],
          max_tokens: 200, 
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`, 
            'Content-Type': 'application/json',
          },
        }
      );
  
      res.json(deepseekResponse.data.choices[0].message);
    } catch (err) {
      console.error('Error en la ruta /chatgpt:', err.message, err.response?.data); 
      res.status(500).json({ error: 'Error al procesar la solicitud' }); 
    }
  });

export default router;
