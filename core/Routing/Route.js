const middlewareSupport = require('../Middleware/MiddlewareSupport');

const POST = 'post';
const GET = 'get';
const PUT = 'PUT';

class Route{
    static app;
    static allUri = [];
    static post(path, handler){
        const newRoute = new Route();
        // get current route
        this.currentRoute = {
            path: path, handler: handler, action: POST
        };
        Route.#addUriCollection(this.currentRoute);
        return newRoute;
    }
    static get(path, handler){
        const newRoute = new Route();
        // get current route
        this.currentRoute = {
            path: path, handler: handler, action: GET
        };
        Route.#addUriCollection(this.currentRoute);
        return newRoute;
    }
    static #addUriCollection(route){
        Route.allUri.push(route);
    }
    static register(app){
        this.app = app;
        require('../../route/web')
        Route.allUri.forEach(route => {
            if(route.action == POST){
                this.attachUriPost(app, route);
            }else if(route.action == GET){
                this.attachUriGet(app, route);
            }
        })
    }
    static attachUriGet(app, route){
        app.express.get(route.path, (req, res) => {
            this.response(req, res, route);
        });
    }
    static attachUriPost(app, route){
        app.express.post(route.path, (req, res) => {
            this.response(req, res, route);
        });
    }
    response(req, res, route){
        res.header('Content-Type', 'text/html');
        let result = null;
        const handlerType = typeof(route.handler);
        if(handlerType == 'function'){
            result = this.routeHandlerResult(req, route.handler);
        }else if(Array.isArray(route.handler)){
            result = this.handlerController(route.handler);
        }
        if(typeof(result) == 'object'){
            res.sendFile(result.filepath);
        }else{
            res.write(result);
            res.send();
        }
    }
    routeHandlerResult(request, handler){
        let params = null;
        // parameter from uri
        if(request.params != {}){
            params = request.params;
        }
        // parameter from url-form
        if(request._body){
            params = request.body;
        }
        return params != null ? handler(params) : handler()
    }
    handlerController(arrControllerAtMethod){
        const [ controllerClass, methodName ]  = arrControllerAtMethod;
        // create controller instantiate
        const instance = new controllerClass();
        
        // result method
        let controllerResult = instance[methodName]() || null;
        return controllerResult;
    }
    clean(){
        Route.uriGet = null;
        Route.uriPost = null;
    }
    // name or class
    middleware(name){
        if(route){
            // attach middleware into route collections
            route.middleware = this.#getMiddlewareData(name);
        }
        // bind middleware
        middlewareSupport.bind(this.app, route);
    }
    #getMiddlewareClass(nameOrClass){
        // check type of name is a middleware class
        if(typeof(nameOrClass) == 'object'){
            return nameOrClass;
        }
        return null;
    }
    #getMiddlewareData(name){
        let middlewareClass = this.#getMiddlewareClass(name);
        let middlewareName = null;
        let params = [];

        if(middlewareClass == null){
            const [ _middlewareName, ..._params ] = name.split(':');
            middlewareName = _middlewareName;
            if(_params)
                params = _params;
        }
        return {
            name: middlewareName,
            class: middlewareClass,
            args: params
        };
    }
}
// const route = new Route();
module.exports = Route;