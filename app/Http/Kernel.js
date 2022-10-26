const AuthenticateBasicAuth = require("./AuthenticateBasicAuth");
const Authorize = require("./Authorize");
const UserRoleAuth = require("./Middleware/UserRoleAuth");

const routeMiddleware = {
    'role-auth': UserRoleAuth,
    'auth.basic': AuthenticateBasicAuth,
    'can': Authorize
};

module.exports = { routeMiddleware };