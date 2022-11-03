const Middleware = require("../../../core/Middleware/Middleware");

class UserRoleAuth extends Middleware {
    handle(request, next, role, permission){
        console.log(`Role Auth Middleware by ${role} and ${permission}!`)
        return next();
    }
}

module.exports = UserRoleAuth;