const { routeMiddleware } = require("../../app/Http/Kernel");

class MiddlewareSupport{
    bind(app, route){
        let handles = route.middlewares
            .filter(_m => {
                // removes middleware are exist in exclude list
                return route.excludeMiddlewares.filter(_ex => {
                    return _ex.name == _m.name || _ex._class === _m._class
                }).length === 0;
            })
            // mapping middleware functions
            .map(middleware => {
                return this.#assignMiddleware(middleware);
            }
        );
        // register middleware into express route
        app.express.use(route.path, handles);
    }
    #assignMiddleware(middleware){
        const { name, _class, args } = middleware;
        const middlewareClass = (_class == null) ? 
        routeMiddleware[name] : _class;
        
        if(typeof(middlewareClass) != 'undefined'){
            return this.registerMiddleware(middlewareClass, args)
        }
    }
    #execute(objMiddleware, request, params){
        return objMiddleware.handle(request, () => {
            return true
        }, ...(params || []))
    }
    /** @return {Function} */
    registerMiddleware(middlewareClass, params){
        // return handle function of middleware
        return (request, response, next) => {
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
        };
    }
    #error(response, middlewareClass){
        response.send(middlewareClass.name + ' Middleware failed');
    }
}

const middlewareSupport = new MiddlewareSupport();
module.exports = middlewareSupport;