const view = require("../core/App/View/View");
const Route = require("../core/Routing/Route");
const ProductController = require("../app/Controllers/ProductController")
const HomeController = require("../app/Controllers/HomeController");

Route.get('/user/:name', _ => {
    return `<h2>hello ${_.name}</h2>`;
});

Route.get('/other', () => {
    return view('index');
});
Route.middleware(['web']).group(function(){

});
Route.get('/', [HomeController, 'index']);

Route.get('/product', [ProductController, 'index']);

// sample route with function
Route.post('/login', _ => {
    return `youre logged in as ${_.username}`;
});

// user role route with roleMiddleware
Route.get('/user-role', () => {
    return 'Role Authenticated';
}).middleware('role-auth:editor:true');
