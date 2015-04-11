MS.fieldView = function(field){
  var API = {field: field}
  var divID = "field"
  API.$el = $("<div id='"+divID+"''></div>")
  API.$pop = $("<div id='pop'></div>")
  API.$colorBox = $("<div id='average_color'></div>")
  API.setup = function(){
    API.$el.css("position", "relative");
    API.$el.css("height", this.field.size+"px")
    API.$el.css("width", this.field.size+"px")
    API.$el.css("background-color", vectorToRGB(this.field.fieldColor))
    API.$el.appendTo($("body"))
    API.$pop.appendTo($("body"))
    API.$colorBox.appendTo($("body"))
    var popSummary = "There are currently :" + this.field.liveMoths.length + " living moths."
    var colorDeltBar = this.field.averageDistance().distanceFrom(this.field.fieldColor)
    var colorSummary = "The population has an average distance of : " +  colorDeltBar + " color units"
    API.$pop.text(popSummary )
    API.$colorBox.text( colorSummary )

  };

  API.updateStats = function(){
    var popSummary = "There are currently :" + this.field.liveMoths.length + " living moths."
    var colorDeltBar = this.field.averageDistance().distanceFrom(this.field.fieldColor)
    var colorSummary = "The population has an average distance of : " +  colorDeltBar + " color units"
    API.$pop.text(popSummary )
    API.$colorBox.text( colorSummary )    
  };
  return API
}

SM.mothView = function(moth){
  var API ={moth: moth}
  // console.log(this.moth)
  API.setup = function(){
    // var divID = 'moth_'+this.moth.idNum;
    // this.moth.$el = $("<div id='"+divID+"'></div>");
    this.moth.$el.css("background-color", vectorToRGB(this.moth.color));
    this.moth.$el.css("position", "absolute");
    this.moth.$el.css("height", this.moth.diameter+"px");
    this.moth.$el.css("width", this.moth.diameter+"px");
    this.moth.$el.css("left", (this.moth.pX-this.moth.diameter/2)+"px");
    this.moth.$el.css("top", (this.moth.pY-this.moth.diameter/2)+"px");
    this.moth.$el.css("border-radius", "50%");
    this.moth.$el.appendTo(this.moth.field.view.$el);
    this.moth.$el.on( "click", 
      function(){
        this.moth.field.depopulate(this.moth.color);
        this.moth.field.repopulate();
      }.bind(this)
    )
    // console.log(this)
  };
  API.update = function(){
    this.moth.$el.css("left", (this.moth.pX-this.moth.diameter/2)+"px");
    this.moth.$el.css("top", (this.moth.pY-this.moth.diameter/2)+"px");
  };
  return API
};