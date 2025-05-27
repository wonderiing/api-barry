import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./src/controllers/userRoutes.js";
import categoryRoutes from "./src/controllers/categoryRoutes.js";
import syncDatabase from "./src/config/syncDatabase.js";
import incomesRouter from "./src/controllers/incomesRoutes.js";
import expensesRoutes from "./src/controllers/expensesRoutes.js";
import aiRoutes from "./src/controllers/aiRoutes.js";
import notificationRoutes from "./src/controllers/notificationRoutes.js";
import authController from "./src/controllers/AUTH/authController.js";
import aiController from "./src/controllers/chatgpt/aiController.js";
import cryptoController from "./src/controllers/cryptoController.js";
import cryptoInvestmentsController from "./src/controllers/cryptoInvestmentController.js";
import googleAuth from "./src/controllers/AUTH/oauthController.js";
import reportesController from "./src/controllers/informeController.js";
import emailController from "./src/controllers/emailController.js";
import "./src/controllers/AUTH/oauth.js";



dotenv.config();

const app = express();

app.use(cors({
    origin: ["https://barry-fs.netlify.app", "http://localhost:5173", "https://barry-front.vercel.app"],  
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true,  
  }));

  
app.use(cookieParser());
app.use(express.json());
syncDatabase()

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes)
app.use("/api/incomes", incomesRouter)
app.use("/api/expenses", expensesRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/notifications", notificactionRoutes)
app.use("/api/auth/", authController)
app.use('/api/chatgpt', aiController )
app.use('/api/crypto', cryptoController )
app.use('/api/crypto-investments', cryptoInvestmentsController )
app.use('', googleAuth )
app.use('/reportes', reportesController)
app.use('/api/send-mail', emailController)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))