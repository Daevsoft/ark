const UserRoleAuth = require("./UserRoleAuth");

const routeMiddleware = {
    'role-auth': UserRoleAuth
};


module.exports = { routeMiddleware };