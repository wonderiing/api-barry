import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import syncDatabase from "./config/syncDatabase.js";
import incomesRouter from "./routes/incomesRoutes.js"
import expensesRoutes from "./routes/expensesRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import notificactionRoutes from "./routes/notificactionRoutes.js"

dotenv.config();

const app = express();


app.use(express.json());
syncDatabase()

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes)
app.use("/api/incomes", incomesRouter)
app.use("/api/expenses", expensesRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/notifications", notificactionRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))