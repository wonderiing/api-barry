import OpenAI from "openai";
import { Router } from "express";
import dotenv from 'dotenv';
import authMiddleware from "../../middlewares/authMiddleware.js";
import aiRecommendations from "../../models/aiRecommendations.js";
dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_APIKEY
});



const router = Router()

router.use(authMiddleware)

router.post('/', async(req,res) => {

  try { 
      const {userId, message} = req.body

      if (!message || !userId) return res.status(400).json({error: "No enviaste mensaje o userid"})
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
        
          const answer = completion.choices[0].message.content;

          const recommendation = await aiRecommendations.create({
            query: message,
            answer: answer,
            user_id: userId
          })
          res.json(completion.choices[0].message);
  } catch ( err ) {
      console.error('Error in /chatgpt route:', err); 
      res.status(500).json({ error: 'Error al procesar la solicitud' }); 
  }

})



export default router;
