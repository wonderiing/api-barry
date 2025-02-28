
import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../../models/usuario.js";

const router = Router();
dotenv.config();

const FRONTEND = process.env.FRONTEND

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

    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "10h" }
    );

    res.redirect(`${FRONTEND}/auth/success?token=${token}`);
  }
);
  
  

export default router;
