class Middleware {
    #response = null;
    redirect(path, code = 202){
        this.#response.redirect(code, path);
    }
    constructor(response){
        this.#response = response;
    }
    // for incoming request
    handle(request, next){
        return next();
    }
}

module.exports = Middleware;