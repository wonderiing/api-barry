import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";


const Notifications = sequelize.define("Notification", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true, allowNull:false},
    tipo: {type: DataTypes.STRING, allowNull:false},
    message: {type: DataTypes.TEXT, allowNull:false},
    date: {type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull:false},
    seen: {type: DataTypes.BOOLEAN, defaultValue: false}
}, {timestamps: false})

export default Notifications;