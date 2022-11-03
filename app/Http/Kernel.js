const AuthenticateBasicAuth = require("./Middleware/AuthenticateBasicAuth");
const Authorize = require("./Middleware/Authorize");
const UserRoleAuth = require("./Middleware/UserRoleAuth");

const routeMiddleware = {
    'role-auth': UserRoleAuth,
    'auth.basic': AuthenticateBasicAuth,
    'can': Authorize
};

module.exports = { routeMiddleware };