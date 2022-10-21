const middlewareSupport = require('../Middleware/MiddlewareSupport');
const Middleware = require('../Middleware/Middleware');

const POST = 'post';
const GET = 'get';
const PUT = 'PUT';

class Route{
    path = null;
    handler = null;
    action = null;
    middlewares = [];
    excludeMiddlewares = [];
    static currentMiddleware = null;

    static app;
    static allUri = [];

    constructor(options) {
        this.path = options.path;
        this.handler = options.handler;
        this.action = options.action;
    }

    static post(path, handler){
        const newRoute = new Route({
            path: path, handler: handler, action: POST
        });
        Route.#addUriCollection(newRoute);
        return newRoute;
    }
    static get(path, handler){
        const newRoute = new Route({
            path: path, handler: handler, action: GET
        });
        Route.#addUriCollection(newRoute);
        return newRoute;
    }
    static #addUriCollection(route){
        // assign middleware when routes in groups
        if(Route.currentMiddleware != null && Route.currentMiddleware.length > 0){
            route.middleware(Route.currentMiddleware);
        }
        Route.allUri.push(route);
    }
    static register(app){
        Route.app = app;
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
    static response(req, res, route){
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
    static routeHandlerResult(request, handler){
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
    static handlerController(arrControllerAtMethod){
        const [ controllerClass, methodName ]  = arrControllerAtMethod;
        // create controller instantiate
        const instance = new controllerClass();
        
        // result method
        let controllerResult = instance[methodName]() || null;
        return controllerResult;
    }
    static clean(){
        Route.allUri = [];
    }
    static middleware(array){
        this.currentMiddleware = array;
        return {
            group: (routes) => {
                routes();
                Route.currentMiddleware = [];
            }
        }
    }
    #getMiddlewareClass(nameOrClass){
        // check type of name is a middleware class
        if(nameOrClass.prototype instanceof Middleware){
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
            _class: middlewareClass,
            args: params
        };
    }
    #fixMiddlewareName(name){
        if(!Array.isArray(name)){
            name = [ name ];
        }
        return name;
    }
    /** @param {Middleware|String|Array} name */
    middleware(name){
        name = this.#fixMiddlewareName(name);
        // attach middleware into route collections
        this.middlewares = name.map(_mName => this.#getMiddlewareData(_mName))

        // bind middleware
        middlewareSupport.bind(Route.app, this);
    }
    withoutMiddleware(name){
        this.excludeMiddlewares = this.#fixMiddlewareName(name);
    }
}
module.exports = Route;