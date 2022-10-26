const Middleware = require("../../../core/Middleware/Middleware");

class Authorize extends Middleware{
    handle(request, next){
        console.log('Middleware Authorize OK!');
        return next();
    }
}
module.exports = Authorize;