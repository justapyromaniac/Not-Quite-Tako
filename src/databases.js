const { Sequelize } = require('sequelize');

const configdb = new Sequelize('AO-Chan', 'NQT', null, {
	dialect: "sqlite",
	storage: "./databases/config.db"	
})

const connect = async (db) => {
	try {
		console.log('Attempting to read AO-Chan...');

		if(!db.getDialect() || db.getDialect() !== 'sqlite') {
			throw "This isn't AO-Chan!"
		}

		await db.authenticate();
	} catch (error) {
		console.error('AO-Chan bonked me...:', error);
	}
} 

const setupDatabases = () => {
	connect(configdb)
		.then(() => console.log("Successfully opened AO-Chan!"))
		.catch(e => console.error(e))
}

module.exports = {
	configdb,
	setupDatabases
}