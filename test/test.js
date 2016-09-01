var expect = require('chai').expect,
  lib = require('../')(require('allexlib').isString);


describe ('Test readPropertyFromDotDelimitedString', function (){
  var readPropertyFromDotDelimitedString = lib.readPropertyFromDotDelimitedString, 
  test_val = {
    1 : {
      two : 2,
      three : 3,
      four : {
        five : 5,
        six : 6
      }
    },
    11 : {
      twelwe : 12
    }
  };
  it ('Do not ask for context', function () {
    expect (readPropertyFromDotDelimitedString(test_val, '1')).to.be.deep.equal(test_val[1]);
    expect (readPropertyFromDotDelimitedString(test_val, '1.two')).to.be.deep.equal(test_val[1].two);
  });

  it ('Do expect context', function () {
    expect (readPropertyFromDotDelimitedString(test_val, '1', true)).to.be.deep.equal({ctx : test_val, val : test_val[1]});
    expect (readPropertyFromDotDelimitedString(test_val, '1.two', true)).to.be.deep.equal({ctx: test_val[1], val:test_val[1].two});
  });
});
