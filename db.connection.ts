import { Sequelize } from "sequelize";

const mysql_pwd = "developers"
const mysql_host = "localhost"
const mysql_user = "root";
const db_name = "assessment";

const sequelize = new Sequelize(db_name, mysql_user, mysql_pwd, {
    host: mysql_host,
    dialect: 'mysql',
    dialectOptions: {
        multipleStatements: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000
    }
});
sequelize.authenticate()
    .then(() => console.log(`DB connected on: ${mysql_host}, user:${mysql_user}`))
    .catch(err => console.error('Unable to connect to the database: ', err))

sequelize.sync({ force:true }).then(() => console.log(`Database & tables created!`));

export default sequelize;
