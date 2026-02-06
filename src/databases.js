const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = path.resolve(__dirname, 'databases/config.db');

const configdb = new Sequelize('AO-Chan', 'NQT', null, {
	dialect: "sqlite",
	storage: dbPath,
    logging: false
});

const connect = async (db) => {
	try {
		console.log('Attempting to read configuration database (AO-Chan)...');

		if(!db.getDialect() || db.getDialect() !== 'sqlite') {
			throw "Invalid Database Dialect!"
		}

		await db.authenticate();
        await db.sync({ alter: true }); 
        console.log("Successfully connected to configuration database!");
	} catch (error) {
		console.error('Database connection failed:', error);
	}
} 

const setupDatabases = () => {
	connect(configdb)
		.catch(e => console.error(e))
}

module.exports = {
	configdb,
	setupDatabases
}
