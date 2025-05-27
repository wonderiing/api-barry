import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";


const Expense = sequelize.define("Expense", {
    id: {type: DataTypes.INTEGER, allowNull:false, autoIncrement: true, primaryKey: true},
    mount: {type: DataTypes.DECIMAL(10,2), allowNull:false},
    description: {type: DataTypes.STRING, allowNull: true},
    date: { type : DataTypes.DATE, defaultValue: DataTypes.NOW}
}, {timestamps: false})

export default Expense