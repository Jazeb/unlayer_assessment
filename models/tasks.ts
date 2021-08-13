import { DataTypes } from "sequelize";
import sequelize from "../db.connection";


const Todo = sequelize.define('Todo', {
    id:{
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER(),
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true,
            notEmpty: true,
        }
    },
    title:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    description:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    is_completed:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

export default Todo;
