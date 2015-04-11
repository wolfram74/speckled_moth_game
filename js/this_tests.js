var Test = function (){
  this.butts = "farts"
  this.sublevel = deep(this)
}

// dont test too deep. You'll get stuck in the world at the end of inception. 
function deep(test){
  var API = {test:test}
  API.context = function(){console.log("context");console.log(this.test);}
  API.toot = function(){console.log("toot");console.log(this.test.butts);}
  return API
}

var see = new Test()
console.log(see)
console.log(see.butts) // everywhere!
console.log(see.sublevel.context())
console.log(see.sublevel.toot()) // ha!