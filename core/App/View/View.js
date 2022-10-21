const fs = require('fs');
const path = require('path');

class View {
    filename;
    filepath;
    #content;
    isFile = true;
    resolveFilename(filename){
        // must html
        if(filename.lastIndexOf('.html') > 0)
            return filename;
        else
            return filename + '.html';
    }
    constructor(filename) {
        this.filename = this.resolveFilename(filename);
        this.filepath = path.resolve('app/Views', this.filename);
        this.renderContent();
    }
    renderContent(){
        this.#content = this.filepath; // TODO ! its just sample to check filepath
    }
    getContent(){
        return this.#content;
    }
}
const view = function(viewfile){
    return new View(viewfile);
}
module.exports = view;