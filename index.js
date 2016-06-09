function createMisc(isString) {
  'use strict';

  function prependToString (prefix,min_len, or_text) {
    if ((!prefix || !prefix.length) ||
      (!min_len || isNaN(min_len) || min_len < 1) ||
      !or_text) return or_text;

    or_text += '';

    while(or_text.length < min_len){
      or_text = prefix+or_text;
    }
    return or_text;
  }

  function readPropertyFromDotDelimitedString(obj, name) {
    var names = name.split('.'), retobj = {ctx: obj, map: null}, ret;
    names.forEach(function(n){
        retobj.map = retobj.ctx[n];
        retobj.ctx = retobj.map;
        });
    ret = retobj.map;
    retobj.map = null;
    retobj.ctx = null;
    retobj = null;
    return ret;
  }

  function thousandSeparate(val, separator) {
    if (isNaN(val)) return val;

    ///just integers for now...
    var ret = '',
      intv = Math.floor(val),
      rest = val - intv,
      s = intv+'',
      start = s.length - 3,
      i;

    //console.log('processing ', val, 'start is ', start);

    while (start >= 0) {
      i = s.substr(start, 3);
      start -= 3;
      if (ret.length) ret = ' '+ret;
      ret = i+ret;
      //console.log('i ', i, 'start', start, ret);
    }

    if (start === -3)  {
      return ret;
    }

    if (ret.length) ret = ' '+ret;
    ret = s.substr(0, 3+start) + ret;
    return ret;
  }

  return {
    prependToString: prependToString,
    thousandSeparate : thousandSeparate,
    readPropertyFromDotDelimitedString: readPropertyFromDotDelimitedString
  };
}

module.exports = createMisc;
