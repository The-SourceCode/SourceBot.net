const {Users, Incidents} = require('./Schemas');
const {markdown} = require("markdown");

module.exports = {
    userData: async function (options = {}, get = null, sort = {}) {
        let users = await Users.find(options, get, {sort}).exec();
        if (!users) return null;
        users = users.map(user => {
            if (user.bio) user.bio = markdown.toHTML(user.bio).replace(/\n/g, "<br>")
            return user;
        });
        return users;
    },
    incidentsData: async function (options = {}, sort = {}) {
        // Find and return what it's being asked (-_id, to exclude the _id being sent with the data)
        return await Incidents.find(options, "TYPE DATE_TIME TARGET_ID REASON DURATION -_id", {sort}).exec();
    }
};
