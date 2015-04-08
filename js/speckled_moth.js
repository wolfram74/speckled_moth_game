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

function vectorToHex(vector){
  var color = "#"
  for(var index in vector.elements){
    color = color + vector.elements[index].toString(16);
  };
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
    this.addMoth(newColor)
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
    }
  };
};

Field.prototype.repopulate = function(){
  if (this.liveMoths.length === 1){
    newColor = randomColorVec()
    this.addMoth(newColor)
  } else if (this.liveMoths.length === 0){this.populate()};
  var deficit = this.population - this.liveMoths.length;
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
    this.addMoth(pairs[index][0].mate(pairs[index][1]))
  };
};

Field.prototype.moveMoths = function(){
  console.log("field moving")
  for(var index in this.liveMoths){
    this.liveMoths[index].moveStep()
  };
  setTimeout(this.moveMoths, 31)
};

Field.prototype.changeMoths = function(){
  for(var index in this.liveMoths){
    this.liveMoths[index].chooseDirection()
  };
  setTimeout(this.changeMoths, 3000)  
};

var Moth = function(args){
  args = args || {}
  var defaults = {
    colorVec: randomColorVec(),
    field: new Field(),
    idNum: 0
    }
  args = merge(defaults, args)
  // console.log(args)
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
  var newColor = newVec.add(mutation).map( function(e){return e%256} )
  return newColor
};

Moth.prototype.chooseDirection = function(testX, testY){
  console.log("pointing!")
  var vR = Math.random()*5
  var twoPi = 2* 3.141592
  var thet = twoPi*Math.random()
  console.log(testX, testY)
  this.vX = testX || vR*Math.cos(thet)
  this.vY = testY || vR*Math.sin(thet)
};

Moth.prototype.moveStep = function(){
  console.log("moving!")
  console.log(this.vX, this.pX)
  console.log(this)
  // debugger
  this.pX = this.pX + this.vX
  this.pY = this.pY + this.vY
  this.reflect()
  this.view.update()
};

Moth.prototype.reflect =function(){
  var bound = this.field.size - this.diameter
  // console.log(bound)
  if(this.pX < 0){
    console.log("reflection!")
    this.vX = -this.vX
    this.pX = -this.pX
  }else if(this.pX - bound > 0){
    console.log("reflection!")
    this.vX = -this.vX
    this.pX = bound - (this.pX-bound)*2
  }else if(this.pY < 0){
    console.log("reflection!")
    this.vY = -this.vY
    this.pY = -this.pY
  }else if(this.pY - bound > 0){
    console.log("reflection!")
    this.vY = -this.vY
    this.pY = bound - (this.pY-bound)*2
  };
};

Moth.prototype.die = function(){
  this.timeOfDeath = Date.now()
};

// ============ end object definitions

$(document).ready(function() {
  // main();
});

function main(){
  var field = new Field();
  field.view.setup();
  field.populate();
  field.changeMoths()
  field.moveMoths()
  // debugger
};