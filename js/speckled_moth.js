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
    population: 95,
    size: 600,
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
};
Field.prototype.addMoth = function(color){
  f0Moth = new Moth(this.mothCount, newColor);
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
  console.log("starting depopulate")
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

var Moth = function(idNum, colorVec){
  colorVec = colorVec || randomColorVec()
  this.id = idNum;
  this.pX = 0;
  this.pY = 0;
  this.vX = 0;
  this.vY = 0;
  this.color = colorVec;
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

Moth.prototype.die = function(){}

// ============ end object definitions

// $(document).ready(function() {
//   main();
// });

// function main(){
//   var fieldSize = 600
//   // $("#field").css(
//   //   ["height", "width", "backgroundcolor"],
//   //   ["800px" ,"800px", "#ff00aa"])
//   $("#field").css("height", fieldSize+"px")
//   $("#field").css("width", fieldSize+"px")
//   $("#field").css("background-color", "#ff00aa")
//   var liveMoths = []
//   var deadMoths = []

// };