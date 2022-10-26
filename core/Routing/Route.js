const middlewareSupport = require('../Middleware/MiddlewareSupport');
const Middleware = require('../Middleware/Middleware');
const Pipeline = require('../App/Modules/Pipeline');
const { routeMiddleware } = require('../../app/Http/Kernel');

const POST = 'post';
const GET = 'get';
const PUT = 'PUT';

class RouteSupport extends Pipeline{
    static allUri = [];
    active(app){
        RouteSupport.allUri.forEach(route => {
            if(route.action == POST){
                RouteSupport.attachUriPost(app, route);
            }else if(route.action == GET){
                RouteSupport.attachUriGet(app, route);
            }
        });
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
}

class Route extends Pipeline{
    path = null;
    handler = null;
    action = null;
    middlewares = [];
    excludeMiddlewares = [];
    static currentMiddleware = null;

    static app;

    constructor(options) {
        super();
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
    /** @param {Route} route */
    static #addUriCollection(route){
        // assign middleware when routes in groups
        if(Route.currentMiddleware != null && Route.currentMiddleware.length > 0){
            route.middleware(Route.currentMiddleware);
        }
        // add route stack into route support
        // it will assign into express when server was starting
        RouteSupport.allUri.push(route);
    }
    static register(app){
        Route.app = app;
        require('../../route/web');
        const routeSupport = new RouteSupport();
        app.addModule(routeSupport);
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
        return routeMiddleware[nameOrClass] || null;
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
        }else{
            middlewareName = middlewareClass.prototype.constructor.name;
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
        this.middlewares = name.map(_mName => this.#getMiddlewareData(_mName));
        // register into module app, and will execute when route is ready
        Route.app.addModule(this);
    }
    withoutMiddleware(name){
        name = this.#fixMiddlewareName(name);
        this.excludeMiddlewares = name.map(_mName => this.#getMiddlewareData(_mName));
    }
    #refactorMiddleware(){
        // console.log(this.path, this.middlewares, this.excludeMiddlewares)
        this.middlewares = this.middlewares.filter(_m => {
            return this.excludeMiddlewares.filter(_ex => {
                return _ex.name == _m.name || _ex._class === _m._class
            }).length === 0;
        });
    }
    active(express){
        this.#refactorMiddleware();
        // bind middleware
        middlewareSupport.bind(express, this);
    }
}
module.exports = Route;