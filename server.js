const Server = require("./core/App/Server");
const route = require("./core/Routing/Route");

// initial server class
let app = new Server();

// register routing
route.register(app);

// start server app
app.run();

// clean memory
route.clean();