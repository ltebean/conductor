define(function(require,exports,module){

    var Dyer = require("dyer");


    function generate_color(ctr){
        // return "#" + Math.round(Math.random() * 16777215) .toString(16);
        return "hsl("+Math.round(75-ctr*180)+",55%,55%)";
    }


    function Rule(data){
        this.update(data);
        this.color = generate_color(this.ctr);
    }


    Rule.prototype.createDyer = function(doc){
        if(!this.dyer && doc){
            this.dyer = new Dyer({
                doc:doc,
                color:this.color,
                active:false
            });
        }
    }

    Rule.prototype.update = function(data){
        for(var key in data){
            this[key] = data[key];
        }
        this.elem = $(this.elem);
        this.dyeSelf();
    }

    Rule.prototype.dyeSelf = function(){
        var self=this,
            dyer=this.dyer;

        console.log(self,dyer);
        if(dyer){
            doc = dyer.getDoc();

            dyer.clear();
            self.elem.each(function(i,el){
                dyer.dye(el,{
                    label:self.label
                });
            });
        }
    }

    module.exports = Rule;
});
