import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


const CryptoInvestments = sequelize.define("crypto_investment", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
    amount: { type: DataTypes.FLOAT, allowNull: false},
    currency: { type: DataTypes.ENUM("USD", "MX")},
}, {timestamps: false})

export default CryptoInvestments;