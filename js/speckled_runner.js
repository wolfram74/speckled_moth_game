$(document).ready(function() {
  main();
});

function main(){
  var field = new Field();
  field.view.setup();
  field.populate();
  field.changeMoths()
  field.moveMoths()
  field.updateStats()
  // debugger
};