function gaussianBoxMuller(mean, sigma){
  mean = Number(mean) || 0
  sigma = Number(sigma) || 1
  var twoPi = 2* 3.141592
  var thet = twoPi*Math.random()
  var rad = Math.pow(-2* Math.log(Math.random()), .5)
  var normalDistribution = rad* Math.sin(thet)
  return mean + normalDistribution*sigma
};
function trial(){
  sample = []
  for(var i=0; i<10000; i++){sample.push(gaussianBoxMuller() )};
  sample = sample.sort()
  bins = {}
  for(var index in sample){
    var value = sample[index]
    var bin = Math.floor(value*10)/10
    if (bins[bin] !== undefined){bins[bin]++} else{bins[bin]=1}
  }
  var plusFavored = 0
  var tie = 0
  var trials = 0
  for(var i=-35; i<0; i++){
    if (bins[-1*(i+1)/10] > bins[i/10]){
      plusFavored += (bins[-1*(i+1)/10]+bins[i/10])/2
    } else if(bins[-1*(i+1)/10] === bins[i/10]){
      tie+= (bins[-1*(i+1)/10]+bins[i/10])/2
    }
    trials++
    // console.log(i/10, bins[i/10], "     " , -1*(i+1)/10, bins[-1*(i+1)/10], bins[-1*(i+1)/10] > bins[i/10])
  }
  console.log(plusFavored+"\t"+(5000-tie)+"\t"+plusFavored/(5000-tie))
  return plusFavored/(5000-tie)
};
trials = []
for(var j = 0; j<30; j++){trials.push(trial())};
// console.log(trials)
for(var key in trials){console.log(trials[key])}
// console.log(bins.sort(function(a,b){return a-b}))