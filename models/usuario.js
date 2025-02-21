import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bycrypt from "bcryptjs"


const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: true }, // Ahora puede ser NULL
    google_id: { type: DataTypes.STRING, allowNull: true, unique: true } // ID de Google opcional
}, {
    //Hooks, funciones que controlan la creacion de un objeto antes o despues de crearlo
    hooks: {
        beforeCreate: async (user) => {
            if (user.password_hash) {
                user.password_hash = await bycrypt.hash(user.password_hash, 10)
                
            }
        },
        beforeUpdate: async (user) => { 
            if (user.password_hash) {
                user.password_hash = await bycrypt.hash(user.password_hash, 10)
                
            }
        }
    }
})





export default User