const { routeMiddleware } = require("../../app/Http/Kernel");

class MiddlewareSupport{
    bind(app, route){
        const { name, args } = route.middleware;
        const middlewareClass = (typeof(name) == 'string') ? 
        routeMiddleware[name] : name;
        
        if(typeof(middlewareClass) != 'undefined'){
            this.registerMiddleware(app, route.path, middlewareClass, args)
        }
    }
    group(middlewareList){
        
    }
    #execute(objMiddleware, request, params){
        return objMiddleware.handle(request, () => {
            return true
        }, ...(params || []))
    }
    registerMiddleware(app, path, middlewareClass, params){

        // register middleware into express route
        app.express.use(path, (request, response, next) => {
            // instantiate middleware object
            const objMiddleware = new middlewareClass(response);

            // handle by middleware
            const result = this.#execute(objMiddleware, request, params);
            
            // next process
            if(result){
                next();
            }else{
                // response error when next not executed
                this.#error(response, middlewareClass);
            }
        });
    }
    #error(response, middlewareClass){
        response.send(middlewareClass.name + ' Middleware failed');
    }
}

const middlewareSupport = new MiddlewareSupport();
module.exports = middlewareSupport;