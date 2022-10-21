const Middleware = require("../../core/Middleware/Middleware");

class AuthenticateBasicAuth extends Middleware {
    handle(request, next){
        console.log(`Middleware AuthenticateBasicAuth OK!`);
        return next();
    }
}
module.exports = AuthenticateBasicAuth;