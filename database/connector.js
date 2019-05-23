const mongoose = require('mongoose');
const {user, port, pwd, ip, db} = require('../config').mongo;

// connect to database and catch errors
async function connect() {
    await mongoose.connect(`mongodb://${user}:${pwd}@${ip}:${port}/${db}?authSource=admin`, {useNewUrlParser: true});
}

connect().then(() => global.connected = true).catch(e => {
    console.error(e.stack);
    global.connected = false;
});