var Test = function (){
  this.butts = "farts"
  this.sublevel = deep(this)
}

function deep(test){
  var API = {test:test}
  API.context = function(){console.log("context");console.log(this.test);}
  API.toot = function(){console.log("toot");console.log(this.test.butts);}
  return API
}

var see = new Test()
console.log(see)
console.log(see.butts)
console.log(see.sublevel.context())
console.log(see.sublevel.toot())