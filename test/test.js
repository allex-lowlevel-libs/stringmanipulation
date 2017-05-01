var expect = require('chai').expect,
  allexlib = require('allexlib'),
  lib = require('../')(allexlib.isString, allexlib.isNull);


describe ('Test writePropertyFromDelimitedString', function () {
  var wdpf = lib.writePropertyFromDelimitedString;

  it ('Do auto create', function () {
    expect(wdpf({}, 'bla.truc', 1, true)).to.be.deep.equal({bla:{truc:1}});
  });

  it ('Do not auto create', function () {
    expect (wdpf({}, null, {bla:'truc'})).to.be.deep.equal({bla:'truc'});
    expect (wdpf.bind(null, {}, 'bla', 1)).to.trow;
    expect (wdpf.bind(null, {bla: {truc:{kre:1}}}, 'bla.truc.bla' ,5)).to.trow;
    expect (wdpf({bla: 3}, 'bla', 1)).to.be.deep.equal({bla:1});
    expect (wdpf({bla: {truc:{kre:1}}}, 'bla.truc.kre', 3)).to.be.deep.equal({bla: {truc:{kre:3}}})
  });
});

describe ('Test readPropertyFromDotDelimitedString', function (){
  var rdpf = lib.readPropertyFromDotDelimitedString, 
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
    expect (rdpf(test_val, '1')).to.be.deep.equal(test_val[1]);
    expect (rdpf(test_val, '1.two')).to.be.deep.equal(test_val[1].two);
    expect (rdpf(test_val, '2')).to.be.null;
    expect (rdpf(test_val, '1.1.1.1.')).to.be.null;
    expect (rdpf(2, 'a.b.c')).to.be.null;
  });

  it ('Do expect context', function () {
    expect (rdpf(test_val, null, true)).to.be.deep.equal({ctx : null, val: test_val, key:null});
    expect (rdpf(test_val, '1', true)).to.be.deep.equal({ctx : test_val, val : test_val[1], key: '1'});
    expect (rdpf(test_val, '1.two', true)).to.be.deep.equal({ctx: test_val[1], val:test_val[1].two, key: 'two'});
    expect (rdpf(test_val, '2', true)).to.be.deep.equal({ctx: null, val: null, key:null});
    expect (rdpf(test_val, '1.1.1.1.', true)).to.be.deep.equal({ctx : null, val : null, key : null});
  });
});

describe ('Test capitalize', function () {
  it ('force_lower is false', function () {
    expect(lib.capitalize('testme')).to.be.equal('Testme');
    expect(lib.capitalize('testME')).to.be.equal('TestME');
    expect(lib.capitalize('TestME')).to.be.equal('TestME');
  });

  it ('force lower is true', function () {
    expect(lib.capitalize('testme', true)).to.be.equal('Testme');
    expect(lib.capitalize('testME', true)).to.be.equal('Testme');
    expect(lib.capitalize('TestME', true)).to.be.equal('Testme');
  });
});

describe ('Test thousandSeparate', function () {
  it ('Integers', function () {
    expect (lib.thousandSeparate(1000000)).to.be.equal ('1 000 000');
    expect (lib.thousandSeparate(-1000000)).to.be.equal ('-1 000 000');
  });

  it ('Float', function () {
    expect (lib.thousandSeparate(1000000.3123123)).to.be.equal ('1 000 000.3123123');
    expect (lib.thousandSeparate(-1000000.123123)).to.be.equal ('-1 000 000.123123');
  });

});
