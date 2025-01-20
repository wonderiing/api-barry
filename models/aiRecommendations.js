import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const aiRecommendations = sequelize.define("ai_recommendation", {
    id: { type : DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull:false},
    query: {type: DataTypes.TEXT, allowNull: false},
    answer: {type: DataTypes.TEXT, allowNull:false},
    date: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
},{timestamps: false})

export default aiRecommendations;