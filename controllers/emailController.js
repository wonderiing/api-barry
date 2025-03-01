import { Router } from "express";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();
const router = Router()
const resend = new Resend(process.env.RESEND_APIKEY);
      

router.post("/", async (req, res) => {
    const {name, email, type, message} = req.body
    const { data, error } = await resend.emails.send({
      from: "Barry <onboarding@resend.dev>",
      to: ["ca223871@gmail.com"],
      subject: "hello world",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #d50000; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Nuevo Reporte de Soporte</h1>
          </div>
          <div style="padding: 20px; background-color: #fff;">
            <p style="border-left: 4px solid #d50000; padding-left: 15px; margin: 15px 0;"><strong style="color: #d50000;">Nombre:</strong> ${name}</p>
            <p style="border-left: 4px solid #d50000; padding-left: 15px; margin: 15px 0;"><strong style="color: #d50000;">Email:</strong> ${email}</p>
            <p style="border-left: 4px solid #d50000; padding-left: 15px; margin: 15px 0;"><strong style="color: #d50000;">Tipo:</strong> ${type}</p>
            <div style="background-color: #ffebee; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <h3 style="color: #d50000; margin-top: 0;">Mensaje:</h3>
              <p style="color: #333;">${message}</p>
            </div>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #777;">
            <p>© 2025 App Barry de Finanzas. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });
  
    if (error) {
      return res.status(400).json({ error });
    }
  
    res.status(200).json({ data });
  });

export default router