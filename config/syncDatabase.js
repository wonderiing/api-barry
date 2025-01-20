import sequelize from "./database.js";
import { User, Incomes, Expense, Category, Notifications, aiRecommendations} from "../models/relations.js"

const syncDatabase = async () => {
    
    try  {
        await sequelize.sync({ force: false})
        console.log("Conexion a la db exitosa")
    } catch( err ) {

        console.error(err)

    }

}

export default syncDatabase