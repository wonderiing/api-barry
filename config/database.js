import { Sequelize } from "sequelize";
import dotenv from "dotenv"

dotenv.config();


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.DB_PORT,
        logging: false,

    }
)

try {
    await sequelize.authenticate();
    console.log("Conexion exitosa")
} catch (err) {
    console.error("Error al conectar", err)
}

export default sequelize;