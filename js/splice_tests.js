test = [1,1,1,2,4,6,7,212,32,33,47,39,40]
outs = []
for (var index=test.length-1; index > 0; index--){
  if(test[index]%2 === 0) {outs.push( test.splice(index,1)[0] )}
}

console.log(test)
console.log(outs)
