// =============utility functions
function merge(baseObject,injectedObject){
  for(var key in injectedObject){
    baseObject[key] = injectedObject[key];
  };
  return baseObject
};

function randomColorVec (){
  var r = Math.floor(Math.random()*256)
  var g = Math.floor(Math.random()*256)
  var b = Math.floor(Math.random()*256)
  return $V([r,g,b])
};

function vectorToRGB(vector){
  var color = "rgba("
  for(var index in vector.elements){
    var value = pad(vector.elements[index],3,0)
    color = color + value +",";
  };
  color = color +"1)"
  return color
};

function gaussianBoxMuller(mean, sigma){
  mean = Number(mean) || 0
  sigma = Number(sigma) || 1
  var twoPi = 2* 3.141592
  var thet = twoPi*Math.random()
  var rad = Math.pow(-2* Math.log(Math.random()), .5)
  var normalDistribution = rad* Math.sin(thet)
  return mean + normalDistribution*sigma
};

function sample(array){
  var index = Math.floor(Math.random()*array.length )
  return array[index]
};

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
// a.distanceFrom(b)

// ============ end utility functions

// ==== object definitions
var Field = function(args){
  args = args || {}
  var defaults = {
    size: 700, // total area of 490000
    population: 150,
    geneSpread: 4,
    clickSpread: 2
  };
  args = merge(defaults, args)
  this.population = args["population"]
  this.size = args["size"]
  this.geneSpread = args["geneSpread"]
  this.clickSpread = args["clickSpread"]
  this.fieldColor = randomColorVec()
  this.mothCount = 0
  this.liveMoths = []
  this.deadMoths = []
  this.view = fieldView(this)
};

Field.prototype.averageDistance = function(){
  var groupColor = Vector.Zero(3)
  for(var index in this.liveMoths){
    groupColor = groupColor.add(this.liveMoths[index].color)
  };
  return groupColor.multiply(1/this.liveMoths.length)
};

Field.prototype.addMoth = function(color){
  var args = {
    field: this, 
    colorVec: color, 
    idNum: this.mothCount
  };
  f0Moth = new Moth(args);
  // console.log("made new moth", this.mothCount)
  f0Moth.view.setup()
  this.liveMoths.push(f0Moth)
  this.mothCount++

};
Field.prototype.populate = function(){
  for(i=0; i<this.population; i++){
    newColor = randomColorVec()
    this.addMoth( newColor)
  };
};

Field.prototype.depopulate = function(effectedColor){
  var e = 2.7182818
  for(var index=this.liveMoths.length-1; index > -1; index--){
    var deltaC = this.liveMoths[index].color.distanceFrom(effectedColor)
    var exp = -1*(Math.pow(deltaC, 2))/(Math.pow(this.clickSpread, 2))
    var threshold = Math.pow(e, exp);
    var die = Math.random() < threshold
    if(die){
      this.deadMoths.push( this.liveMoths.splice(index,1)[0] );
      this.deadMoths[this.deadMoths.length-1].die()
    };
  };
};

Field.prototype.repopulate = function(){
  console.log("population boost")
  if (this.liveMoths.length === 1){
    newColor = randomColorVec()
    this.addMoth(newColor)
    console.log("made new moth in repopulate")
  } else if (this.liveMoths.length === 0){
    this.populate();
    console.log("detected extinction event, rebooting")
  };
  var deficit = this.population - this.liveMoths.length;
  var lastKill = Date.now() - this.deadMoths[this.deadMoths.length-1].timeOfDeath
  if (deficit < 15 && lastKill < 30000){
    return;
  };
  var pairs = [];
  while(pairs.length < deficit){
    var pair0 = sample(this.liveMoths)
    var pair1 = sample(this.liveMoths)
    while(pair0 === pair1){
      pair1 = sample(this.liveMoths)
    };
    pairs.push([pair0, pair1])
  };
  for(var index in pairs){
    var newColor = pairs[index][0].mate(pairs[index][1])
    this.addMoth(newColor)
  };
};

Field.prototype.moveMoths = function(){
  for(var index in this.liveMoths){
    this.liveMoths[index].moveStep()
  };
  setTimeout(this.moveMoths.bind(this), 31)
};

Field.prototype.changeMoths = function(){
  for(var index in this.liveMoths){
    this.liveMoths[index].chooseDirection()
  };
  setTimeout(this.changeMoths.bind(this), 3000)  
};

Field.prototype.updateStats = function(){
  this.view.updateStats()
  setTimeout(this.updateStats.bind(this), 500)
};

var Moth = function(args){
  args = args || {}
  var defaults = {
    colorVec: randomColorVec(),
    field: new Field(),
    idNum: 0
    }
  args = merge(defaults, args)
  this.field = args["field"]
  this.idNum = args["idNum"];
  this.color = args["colorVec"];
  this.pX = Math.random()*this.field.size;
  this.pY = Math.random()*this.field.size;
  this.vX = 0;
  this.vY = 0;
  this.timeOfDeath = 0
  this.diameter = 17;
  var divID = 'moth_'+this.idNum;
  this.$el = $("<div id='"+divID+"'></div>");  
  this.view = mothView(this)
}

Moth.prototype.mate = function(otherMoth, geneSpread){
  var newVec = this.color.add(otherMoth.color)
  newVec = newVec.multiply(.5)
  var r = gaussianBoxMuller(0,geneSpread)
  var g = gaussianBoxMuller(0,geneSpread)
  var b = gaussianBoxMuller(0,geneSpread)
  var mutation = $V([r,g,b])
  var newColor = newVec.add(mutation).map( function(e){return Math.floor(e%256)
  })
  return newColor
};

Moth.prototype.chooseDirection = function(testX, testY){
  var vR = Math.random()*5
  var twoPi = 2* 3.141592
  var thet = twoPi*Math.random()
  this.vX = testX || vR*Math.cos(thet)
  this.vY = testY || vR*Math.sin(thet)
};

Moth.prototype.moveStep = function(){
  this.pX = this.pX + this.vX
  this.pY = this.pY + this.vY
  this.reflect()
  this.view.update()
};

Moth.prototype.reflect =function(){
  var bound = this.field.size - this.diameter
  if(this.pX < this.diameter/2){
    // console.log("reflection!")
    this.vX = -this.vX
    this.pX = -this.pX
  }else if(this.pX - bound > this.diameter/2){
    // console.log("reflection!")
    this.vX = -this.vX
    this.pX = bound - (this.pX-bound)*2
  }else if(this.pY < this.diameter/2){
    // console.log("reflection!")
    this.vY = -this.vY
    this.pY = -this.pY
  }else if(this.pY - bound > this.diameter/2){
    // console.log("reflection!")
    this.vY = -this.vY
    this.pY = bound - (this.pY-bound)*2
  };
};

Moth.prototype.die = function(){
  this.timeOfDeath = Date.now();
  this.$el.off()
  this.$el.hide()
};

// ============ end object definitions

