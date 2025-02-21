import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let sequelize;

try {
    if (process.env.MYSQL_URL) {
        sequelize = new Sequelize(process.env.MYSQL_URL, {
            dialect: "mysql",
            logging: false
        });
        console.log("Conexión usando MYSQL_URL exitosa");
    } else {
        // Si no se proporciona MYSQL_URL, usamos las variables de entorno tradicionales
        sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                dialect: "mysql",
                port: process.env.DB_PORT || 3306, // Usamos 3306 si DB_PORT no está definida
                logging: false
            }
        );
        console.log("Conexión usando variables de entorno tradicionales exitosa");
    }

    // Intentamos autenticar la conexión
    await sequelize.authenticate();
    console.log("Conexión exitosa");
} catch (err) {
    console.error("Error al conectar:", err);
}

export default sequelize;
