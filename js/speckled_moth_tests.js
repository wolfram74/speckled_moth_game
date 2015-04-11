// you clearly love tests. Thats fucking awesome!!!!
describe("The field object", function(){
  it("Can be created", function(){
    var testField = new Field()
    expect(typeof(testField) ).toBe("object");
  });
  it("Has population parameter", function(){
    var testField = new Field({population: 100})
    expect( typeof(testField.population) ).toBe("number");
  });
  it("Has size parameter", function(){
    var testField = new Field({size: 450})
    expect( typeof(testField.population) ).toBe("number");
  });
  it("Has gene spread parameter", function(){
    var testField = new Field({geneSpread: 10})
    expect(typeof testField.geneSpread ).toBe("number");
  });
  it("Has click spread parameter", function(){
    var testField = new Field({clickSpread:5})
    expect(typeof testField.clickSpread ).toBe("number");
  });

  it("Responds to populate", function(){
    var testField = new Field()
    expect(typeof testField.populate ).toBe("function");
  });
  it("this.populate sets up initial moth population", function(){
    var pop = 5
    var testField = new Field({"population": pop})
    testField.populate()
    expect(testField.mothCount ).toBe(pop);
  });
  
  it("Responds to depopulate", function(){
    var testField = new Field({"population": 1})
    expect(typeof testField.depopulate ).toBe("function");
  });
  it("Depopulate does not effect moths with disparate colors", function(){
    var testField = new Field({"population": 1})
    testField.populate()
    var safeColor = testField.liveMoths[0].color
    var targetColor = safeColor.add($V([125,125,125]))
    testField.depopulate( targetColor.map( function(e){return e%256} ) )
    expect(testField.liveMoths.length ).toBe(1);
  });
  it("Depopulate does effect moths with similar colors", function(){
    var testField = new Field({"population": 1})
    testField.populate()
    testField.depopulate(testField.liveMoths[0].color)
    expect(testField.liveMoths.length ).toBe(0);
  });
  
  it("Responds to repopulate", function(){
    var testField = new Field()
    expect(typeof testField.repopulate ).toBe("function");
  });
  it("Repopulate restores damaged population", function(){
    var testField = new Field({"population": 3})
    testField.populate()
    testField.depopulate(testField.liveMoths[0].color)
    testField.deadMoths[testField.deadMoths.length-1].timeOfDeath = 0
    testField.repopulate()
    expect(testField.liveMoths.length ).toBe(3);
  });
  it("Repopulate restores badly damaged population", function(){
    var testField = new Field({"population": 3})
    testField.populate()
    testField.depopulate(testField.liveMoths[0].color)
    testField.depopulate(testField.liveMoths[0].color)
    testField.deadMoths[testField.deadMoths.length-1].timeOfDeath = 0
    testField.repopulate()
    expect(testField.liveMoths.length ).toBe(3);
  });
  it("Repopulate restores destroyed population", function(){
    var testField = new Field({"population": 3})
    testField.populate()
    testField.depopulate(testField.liveMoths[0].color)
    testField.depopulate(testField.liveMoths[0].color)
    testField.depopulate(testField.liveMoths[0].color)
    testField.repopulate()
    expect(testField.liveMoths.length ).toBe(3);
  });
});

describe("The moth object", function(){
  it("Can be created", function(){
    var testMoth = new Moth()
    expect(typeof(testMoth) ).toBe("object");
  });

  it("Mating produces a valid color", function(){
    var p1 = new Moth()
    var p2 = new Moth()
    var offspring = p1.mate(p2)
    expect(vectorToRGB(offspring).length).toBe(19);
  });
  it("Choose direction alters", function(){
    var testMoth = new Moth()
    var oldV = [testMoth.vX, testMoth.vY]
    testMoth.chooseDirection()
    var change = oldV[0]!==testMoth.vX || oldV[1]!==testMoth.vY 
    expect(change ).toBe(true);
  });

  it("Choose direction alters it's velocity", function(){
    var testMoth = new Moth()
    var oldV = [testMoth.vX, testMoth.vY]
    testMoth.chooseDirection()
    var change = oldV[0]!==testMoth.vX || oldV[1]!==testMoth.vY 
    expect(change ).toBe(true);
  });

  it("moveStep changes it's position", function(){
    var testMoth = new Moth()
    testMoth.chooseDirection(1,1)
    var oldP = [testMoth.pX, testMoth.pY]
    testMoth.moveStep()    
    var change = oldP[0]+1 ===testMoth.pX && oldP[1]+1===testMoth.pY 
    expect(change ).toBe(true);
  });
  it("moveStep does not move it out of bounds", function(){
    var testMoth = new Moth()
    testMoth.chooseDirection()
    // var oldP = [testMoth.pX, testMoth.pY]
    for(var i=0; i<2000; i++){
      testMoth.moveStep()
      if(i%500===499){console.log(testMoth)}
    }
    var bound = testMoth.field.size
    var inside = (testMoth.pX%bound === testMoth.pX) && (testMoth.pY%bound === testMoth.pY) 
    // var inside = ((0<testMoth.pX)||(testMoth.pX<bound)) &&  ((0<testMoth.pY)||(testMoth.pY<bound))  
    expect(inside ).toBe(true);
  });
});

describe("utility functions", function(){
  it("random color vec only gives valid colors", function(){
    var valid = true
    for(i=0; i <300; i++){
      var vec = randomColorVec()
      valid = valid && vectorToRGB(vec).length === 19
    };
    expect(valid).toBe(true);
  });

});