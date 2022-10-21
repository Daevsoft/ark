const view = require("../../core/App/View/View");
const Controller = require("../../core/Controller/Controller");

class HomeController extends Controller{
    index(){
        return view('index.html')
    }
}

module.exports = HomeController