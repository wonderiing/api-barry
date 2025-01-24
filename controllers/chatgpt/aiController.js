import OpenAI from "openai";
import { Router } from "express";
import dotenv from 'dotenv';
import authMiddleware from "../../middlewares/authMiddleware.js";
dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_APIKEY
});



const router = Router()

router.use(authMiddleware)

router.post('/', async(req,res) => {

  try {
      const {message} = req.body

      if (!message) return res.status(400).json({error: "No enviaste ningun mensaje"})
      const completion = await openai.chat.completions.create({
              model: "gpt-3.5-turbo",
              messages: [
                  { role: "system", content: "You are a financial expert named Barry. Answer with precise investment and tax strategies." },
                  {
                      role: "user",
                      content: message,
                  },
              ],
              max_tokens: 250,
          });
      res.json(completion.choices[0].message);
  } catch ( err ) {
      console.error('Error in /chatgpt route:', err); 
      res.status(500).json({ error: 'Error al procesar la solicitud' }); 
  }

})

export default router;
