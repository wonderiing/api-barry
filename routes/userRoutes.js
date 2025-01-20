import { Router } from "express";
import User from "../models/usuario.js";


const router = Router();

//helper
const getUserById = async (id) => {

    const user = await User.findByPk(id)
    return user
}

router.get("/", async( req, res ) => {
    try {
        const users = await User.findAll()
        res.json(users)
    } catch (err) {
        res.status(500).json({err: "Error al obtener los usuarios"})
    }
})


router.post("/", async ( req, res) => {
    try {
        const {name, last_name, email, password_hash} = req.body
        const user = await User.create({name, last_name, email, password_hash })
        res.status(201).json(user)

    } catch (err) {
        res.status(400).json({error: err})
    } 
})

router.get("/:id", async (req, res) => {

    try {
        const user = await getUserById(req.params.id)

        if (!user) return res.status(400).json({error: "El usuario con ese id no se pudo encontrar"})

        res.json(user)
    } catch (err) {

        res.status(500).json({error: err})

    }
})

router.put("/:id", async (req , res) => {
     
    try { 

        const user = await getUserById(req.params.id)

        if (!user) return res.status(404).json({error: "ese usuario no existe"})

        const {name, last_name, email, password_hash} = req.body

        user.name = name,
        user.last_name = last_name
        user.email = email
        user.password_hash = password_hash
        await user.save()
        res.json(user)
        

    } catch (err) { 
        res.status(500).json({error: err})
    }
      
})

router.delete("/:id" , async (req, res ) => {

    try {

        const user = await getUserById(req.params.id)

        if (!user) return res.status(404).json({error: "Ese usuario no se eencontro"})

        await user.destroy()
        res.status(200).json({exito: "Usuario eliminado"})


    } catch (err) {
        res.status(500).json({error: err})
    }
})

export default router