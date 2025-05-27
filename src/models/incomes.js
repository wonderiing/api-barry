import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Incomes = sequelize.define("Incomes", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true, allowNull:false},
    mount: {type: DataTypes.DECIMAL(10,2), allowNull: false},
    description: {type: DataTypes.STRING, allowNull:false},
    date: {type:DataTypes.DATE, allowNull:false, defaultValue: DataTypes.NOW}
}, {timestamps: false})

export default Incomes