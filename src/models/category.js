import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


const Category = sequelize.define("Category", {
    id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
}, {timestamps: false})


export default Category;