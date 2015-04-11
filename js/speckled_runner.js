$(document).ready(function() {
  var field = new Field();
  field.view.setup();
  field.populate();
  field.changeMoths()
  field.moveMoths()
  field.updateStats()
});
