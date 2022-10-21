const Server = require("./core/App/Server");
const Route = require("./core/Routing/Route");

// initial server class
let app = new Server();

// register routing
Route.register(app);

// start server app
app.run();

// clean memory
Route.clean();