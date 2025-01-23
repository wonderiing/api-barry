import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({error: 'Acceso denegado, no se encontro el tokeb'})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch(err) {
        res.status(400).json({error: "Token invalido"})
    }
}

export default authMiddleware