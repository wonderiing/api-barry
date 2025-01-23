import { Router } from "express";
import Notifications from "../models/notifications.js";


const router = Router()

const getNotificationById = async (id) => {
    
    return Notifications.findByPk(id)
}



router.get("/", async (req, res) => {

    try {
        const notifications = await Notifications.findAll()

        res.json(notifications)

    } catch (Err) {
        res.status(500).json({error: err})
    }
})


router.post("/", async(req, res) => {
    try{

        const {tipo, message, seen, user_id} = req.body

        const notification = await Notifications.create({tipo, message, seen, user_id})

        res.json(notification)

    } catch (err) {
        res.status(500).json({error: err})
    }
})


router.put("/:id", async ( req, res ) => {
    
    try{ 

        const notification = await getNotificationById(req.params.id)

        if(!notification) return res.status(404).json({error: "La notificicacion con ese id no se encontro"})

        const {tipo, message, seen, user_id} = req.body

        notification.tipo = tipo
        notification.message = message
        notification.seen = seen
        notification.user_id = user_id

        await notification.save()
        res.json(notification)


    } catch (err) {
        res.status(500).json({error: err})
    }
})

router.get("/:id", async (req,res) => {
    

    try {
        const notification = await getNotificationById(req.params.id)

        if(!notification) return res.status(404).json({error: "La notificicacion con ese id no se encontro"})

        res.json(notification)
    } catch (err) {

        res.status(500).json({error :err})
    }
})

router.delete("/:id", async ( req, res ) => {
    try {
        const notification = await getNotificationById(req.params.id)

        if(!notification) return res.status(404).json({error: "La notificicacion con ese id no se encontro"})

        await notification.destroy()
        res.json({exito: "Eliminacion exitosa"})
    } catch  (err){
        res.status(500).json({error: err})
    }
    
})

export default router