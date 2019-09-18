const mongoose = require('mongoose');
const {user, port, pwd, ip, db} = require('../config').mongo;

// connect to database and catch errors
async function connect() {
    await mongoose.connect(encodeURI(`mongodb://${user}:${pwd}@${ip}:${port}/${db}?authSource=admin`), {useNewUrlParser: true});
}

connect().then(() => {
    global.connected = true;
    console.log("Database connected!");
}).catch(e => {
    console.error("Database connection error!");
    console.error(e.stack);
    global.connected = false;
});