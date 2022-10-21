const express = require('express')
const http = require('http');

module.exports = class Server {
    express;
    server;
    config;
    createServer(){
        this.express = express()
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
        require('dotenv').config()
        this.config = process.env
    }
    constructor() {
        this.createServer();
        this.assignEnv();
    }
    run(){
        this.server.listen(this.config.PORT, () => {
            console.log('Server started http://localhost:' + this.config.PORT);
        })
    }
}