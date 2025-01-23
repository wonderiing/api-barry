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
import authController from "./controllers/authController.js"
import aiController from './controllers/chatgpt/aiController.js'

dotenv.config();

const app = express();

app.use(cors())
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))