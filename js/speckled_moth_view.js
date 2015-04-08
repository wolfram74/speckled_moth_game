function fieldView(field){
  var API = {field: field}
  API.setup = function(){
    var divID = "field"
    this.$el = $("<div id='"+divID+"''></div>")
    this.$el.css("position", "relative");
    this.$el.css("height", this.field.size+"px")
    this.$el.css("width", this.field.size+"px")
    this.$el.css("background-color", vectorToHex(this.field.fieldColor))
    this.$el.appendTo($("body"))
  };
  return API
}

function mothView (moth){
  var API ={moth: moth}
  // console.log(this.moth)
  API.setup = function(){
    // var divID = 'moth_'+this.moth.idNum;
    // this.moth.$el = $("<div id='"+divID+"'></div>");
    this.moth.$el.css("background-color", vectorToHex(this.moth.color));
    this.moth.$el.css("position", "absolute");
    this.moth.$el.css("height", this.moth.diameter+"px");
    this.moth.$el.css("width", this.moth.diameter+"px");
    this.moth.$el.css("left", (this.moth.pX-this.moth.diameter/2)+"px");
    this.moth.$el.css("top", (this.moth.pY-this.moth.diameter/2)+"px");
    this.moth.$el.css("border-radius", "50%");
    this.moth.$el.appendTo(this.moth.field.view.$el);
    // console.log(this)
  };
  API.update = function(){
    this.moth.$el.css("left", (this.moth.pX-this.moth.diameter/2)+"px");
    this.moth.$el.css("top", (this.moth.pY-this.moth.diameter/2)+"px");
  };
  return API
};