import express from "express"
import dotenv from "dotenv"
import userRoutes from "./controllers/userRoutes.js"
import categoryRoutes from "./controllers/categoryRoutes.js"
import syncDatabase from "./config/syncDatabase.js";
import incomesRouter from "./controllers/incomesRoutes.js"
import expensesRoutes from "./controllers/expensesRoutes.js"
import aiRoutes from "./controllers/aiRoutes.js"
import notificactionRoutes from "./controllers/notificactionRoutes.js"
import cors  from "cors"
import authController from "./controllers/AUTH/authController.js"
import aiController from './controllers/chatgpt/aiController.js'
import cryptoController from './controllers/cryptoController.js'
import cryptoInvestmentsController from './controllers/cryptoInvestmentController.js'
import googleAuth from './controllers/AUTH/oauthController.js'
import "./controllers/AUTH/oauth.js"; 
import cookieParser from "cookie-parser";



dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",  
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))