const express = require('express')
const http = require('http');
const Pipeline = require('./Modules/Pipeline');

module.exports = class Server {
    express;
    server;
    config;
    modules = [];

    createServer(){
        this.express = express();
        this.server = http.createServer(this.express);
        this.#attachMiddleware();
    }
    #attachMiddleware(){
        const bodyParser = require('body-parser');
        const bodyParserOptions = { extended : false };
        const bodyParserEncoded = bodyParser.urlencoded(bodyParserOptions);

        this.express.use(express.static('public'));
        this.express.use(express.json());
        this.express.use(bodyParserEncoded);
    }
    assignEnv(){
        require('dotenv').config();
        this.config = process.env;
    }
    constructor() {
        this.createServer();
        this.assignEnv();
    }
    #enableModules(){
        for (let i = 0; i < this.modules.length; i++) {
            const _module = this.modules[i];
            if(_module.constructor.prototype instanceof Pipeline){
                _module.active(this);
            }
        }
    }
    /** @param {Pipeline} module */
    addModule(module){
        this.modules.push(module);
    }
    run(){
        this.#enableModules();
        this.server.listen(this.config.PORT, () => {
            console.log('Server started http://localhost:' + this.config.PORT);
        })
    }
}