define(function(require,exports,module){

    var Dyer = require("dyer");

    function generate_color(){
        // return "#" + Math.round(Math.random() * 16777215) .toString(16);
        return "hsl("+Math.round(Math.random()*360)+",55%,55%)";
    }


    function Rule(data){
        this.update(data);
        this.color = generate_color();
    }

    Rule.prototype.createDyer = function(doc){
        if(!this.dyer){
            this.dyer = new Dyer({
                doc:doc,
                color:this.color,
                active:false
            });
        }
    }

    Rule.prototype.clear = function(){
        this.dyer && this.dyer.clear();
    }

    Rule.prototype.update = function(data){
        this.data = data;
        this.key = data.key;
        this.action = data.action;
        this.multi = data.multi;
        this.parent = data.parent;
        this.selector = data.selector;
        this.cases = data.cases;
        this.dyeSelf();
    }

    Rule.prototype.dyeSelf = function(){
        var elems,doc,dyer=this.dyer;
        if(dyer){
            doc = dyer.getDoc();
            elems = $([this.parent,this.selector].join(" "),doc);
            dyer.clear();
            elems.each(function(i,el){
                dyer.dye(el);
            });
        }
    }

    module.exports = Rule;
});
