/**
 * 元素识别器
 */
define(function(require,exports,module){

    function Identifier(doc){
        this.doc = doc;
    }


    /**
     * 
     * @return 是否可以通过简单的选择器唯一的识别
     */
    Identifier.prototype.onlyOne = function(selector){
        return $(selector,this.doc).length == 1;
    }


    Identifier.prototype.identifyMulti = function(elem){

    }

    Identifier.prototype.traverseParent = function(elem,selector){
        var body = $('body');
        var parent = elem == body ? body : elem.parent();
        return [this.identifySingle(parent),selector].join(" ");
    }

    Identifier.prototype.identifySingle = function(elem){
        var selector;
        if(elem.attr("id")){
            selector = "#"+elem.attr("id");
        }else if(elem.attr("class")){
            selector = elem.attr("class").split(/\s/).map(function(cls){return "."+cls}).join("");
            if(!this.onlyOne(selector)){
                selector = this.traverseParent(elem,selector);
            }
        }else{
            selector = elem.get(0).tagName.toLowerCase();
            if(!this.onlyOne(selector)){
                selector = this.traverseParent(elem,selector);
            }
        }

        if(!this.onlyOne(selector)){
            selector = selector + ":nth-child(" + ($(selector,this.doc).index(elem)+1) + ")";
        }
        return selector;
    }

    Identifier.prototype.identify = function(elem,opt){
        elem = $(elem);
        if(opt.mode=="single"){
            return this.identifySingle(elem);
        }else if(opt.mode == "multi"){
            return this.identifyMulti(elem);
        }        
    }


    module.exports = Identifier;
});