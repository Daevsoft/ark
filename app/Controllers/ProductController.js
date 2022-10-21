const view = require("../../core/App/View/View");
const Controller = require("../../core/Controller/Controller");

class ProductController extends Controller{
    index(){
        return view('product/product');
    }
    pageOne(){
        return 'This is page one';
    }
}

module.exports = ProductController