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
    testField.repopulate()
    expect(testField.liveMoths.length ).toBe(3);
  });
  it("Repopulate restores badly damaged population", function(){
    var testField = new Field({"population": 3})
    testField.populate()
    testField.depopulate(testField.liveMoths[0].color)
    testField.depopulate(testField.liveMoths[0].color)
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

});