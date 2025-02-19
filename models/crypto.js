import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";
const Crypto = sequelize.define("Crypto", {
    id: {type : DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false, unique:true},
    symbol: { type: DataTypes.STRING, allowNull: false, unique: true},
}, {timestamps: false})

export default Crypto