
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../../models/usuario.js";

const router = Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    async (req, res) => {
        const { id, name, email } = req.user;
        let user = await User.findOne({ where: { email } });
        if (!user) {
          user = await User.create({
            name: name,
            last_name: name,
            email: email,
            google_id: id,
          });
        }
    
      const token = jwt.sign({userId: user.id, email: user.email}, process.env.JWT_SECRET, { expiresIn: "10h" });
  
  
      res.cookie("jwt", token, {
        httpOnly: true,  
        secure: true,
        sameSite: 'none',
        maxAge: 10 * 60 * 60 * 1000  // 10 horas
      });
  
      // Redirige al frontend
      res.redirect("https://barry-fs.netlify.app/auth/success");
    }
  );
  

router.get('/get-token', (req, res) => {
    const token = req.cookies.jwt;
  
    if (token) {
      return res.json({ token });
    } else {
      return res.status(403).json({ message: 'No token found' });
    }
  });
  

export default router;
