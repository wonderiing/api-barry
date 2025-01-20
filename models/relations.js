import User from "./usuario.js";
import Category from "./category.js";
import Incomes from "./incomes.js";
import Expense from "./expenses.js";
import Notifications from "./notifications.js";
import aiRecommendations from "./aiRecommendations.js";

// Relación de Incomes con User
User.hasMany(Incomes, { foreignKey: "user_id", onDelete: "CASCADE" });
Incomes.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

// Relación de Expenses con User y Category
User.hasMany(Expense, { foreignKey: "user_id", onDelete: "CASCADE" });
Expense.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

Category.hasMany(Expense, { foreignKey: "category_id", onDelete: "CASCADE" });
Expense.belongsTo(Category, { foreignKey: "category_id", onDelete: "CASCADE" });

// Relación de Notificaciones con User
User.hasMany(Notifications, { foreignKey: "user_id", onDelete: "CASCADE" });
Notifications.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

// Relación de AI Recommendations con User
User.hasMany(aiRecommendations, { foreignKey: "user_id", onDelete: "CASCADE" });
aiRecommendations.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });


export { User, Incomes, Category, Expense, Notifications, aiRecommendations };
