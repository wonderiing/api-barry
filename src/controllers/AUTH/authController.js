import { Router } from "express";
import bcrypt from "bcryptjs";  
import User from "../../models/usuario.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = Router()

router.post("/register", async ( req, res) => {
    try {
        const {name, last_name, email, password_hash} = req.body
        const existingUser = await User.findOne({ where: { email } });
         if (existingUser) return res.status(400).json({ message: "El email ya está registrado" });
         
        const user = await User.create({name, last_name, email, password_hash })
        res.status(201).json(user)

    } catch (err) {
        res.status(400).json({error: err})
    } 
})

router.post("/login", async (req ,res) => {
    try {

        const {email, password_hash} = req.body
        
        const user = await User.findOne({where: {email}})
    
        if(!user) return res.status(404).json({error: "Usuario no encontrado"})
        
        const validPassword = await bcrypt.compare(password_hash, user.password_hash)
    
        if(!validPassword) return res.status(401).json({message: "Contraseña incorrecta"})
    
        const token = jwt.sign({userId: user.id, email: user.email}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
    
        res.status(200).json({message: "Login exitoso", token})
    } catch (err) {
        res.status(500).json({error: err})
    }

})


router.get('/validate-token', async (req, res) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({error: 'Acceso denegado, no se encontro el tokeb'})
        }
        
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            res.json({message: 'Token valido'})
        } catch(err) {
            res.status(400).json({error: "Token invalido"})
        }
    
})

export default router;