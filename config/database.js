import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let sequelize;

const isRailway = !!process.env.RAILWAY_ENVIRONMENT_NAME;

if (isRailway) {
  const dbConfig = {
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    username: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    port: process.env.MYSQLPORT || process.env.DB_PORT,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME
  };
  
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password, 
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: "mysql",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  );
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      port: process.env.DB_PORT,
      logging: false
    }
  );
}

try {
  await sequelize.authenticate();
  console.log("Conexión exitosa a la base de datos");
  console.log(isRailway ? "Ejecutando en Railway" : "Ejecutando en entorno local");
} catch (err) {
  console.error("Error al conectar a la base de datos:", err);
}

export default sequelize;