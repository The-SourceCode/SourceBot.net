const {Users, Incidents} = require('./Schemas');
const markdown = require("markdown-it")({
    breaks: true,
    html: false,
    linkify: true,
    typographer: true
});

module.exports = {
    userData: async function (filter = {}, get = null, sort = {}, options = {}) {
        let users = await Users.find(filter, get, {sort, ...options}).exec();
        if (!users) return [];
        users = users.map(user => {
            if (user.bio && !options.html) user.bio = markdown.render(user.bio);
            return user;
        });
        return users;
    },
    incidentsData: async function (filter = {}, sort = {}, options = {}) {
        // Find and return what it's being asked (-_id, to exclude the _id being sent with the data)
        return Incidents.find(filter, "-_id", {sort, ...options}).exec();
    }
};
