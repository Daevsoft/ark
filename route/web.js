const view = require("../core/App/View/View");
const Route = require("../core/Routing/Route");
const ProductController = require("../app/Controllers/ProductController")
const HomeController = require("../app/Controllers/HomeController");
const Authorize = require("../app/Http/Middleware/Authorize");
const AuthenticateBasicAuth = require('../app/Http/Middleware/AuthenticateBasicAuth');

Route.get('/user/:name', _ => {
    return `<h2>hello ${_.name}</h2>`;
});

Route.get('/other', () => {
    return view('index');
});
Route.get('/', [HomeController, 'index']);

Route.get('/product', [ProductController, 'index']);
Route.post('/save-product', [ProductController, 'saveProduct']);

// sample route with function
Route.post('/login', _ => {
    return `youre logged in as ${_.username}`;
});

// user role route with roleMiddleware
Route.get('/user-role', () => {
    return 'Role Authenticated';
}).middleware(['role-auth:editor:true', AuthenticateBasicAuth]);

Route.middleware(['can', 'auth.basic']).group(() => {
    Route.get('/sample-a', () => {
        return 'This is sample 1 with group middleware';
    });
    Route.get('/sample-b', () => {
        return 'group middleware + without middleware';
    }).withoutMiddleware([Authorize]);
});