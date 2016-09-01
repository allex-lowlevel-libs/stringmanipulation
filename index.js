function createMisc(isString, isNull) {
  'use strict';

  function prependToString (prefix,min_len, or_text) {
    //TODO: could lead to errors if prefix is a number, most commonly 0 ...
    if ((!prefix || !prefix.length) ||
      (!min_len || isNaN(min_len) || min_len < 1) ||
      !isString(or_text)) return or_text;

    or_text += '';

    while(or_text.length < min_len){
      or_text = prefix+or_text;
    }
    return or_text;
  }

  function dive (retobj, n, index, arr){
    if (!retobj.ctx) return;
    if (!(n in retobj.ctx)) {
      retobj.key = null;
      retobj.ctx = null;
      retobj.val = null;
      return;
    }
    retobj.val = retobj.ctx[n];
    retobj.key = n;

    if (arr.length > index+1){
      retobj.ctx = retobj.val;
    }
  }


  function writePropertyFromDelimitedString(obj, path, data, create) {
    if (!isString(path) && !path) return data;
    var old = readPropertyFromDotDelimitedString(obj, path, true);
    

    if (isNull(old.ctx)){
      if (!create) {
        throw new Error('No old data on key: '+path);
      }

      var sk = path.split('.');
      old = {
        ctx : obj || {},
        key : null,
        val : obj
      };


      while (sk.length > 1){
        old.key = sk.shift();
        old.ctx = old.key in old.ctx ? old.ctx[old.key] : old.ctx[old.key] = {};
      }
      old.key = sk[0];
    }

    old.ctx[old.key] = data;
    return obj;
  }

  function readPropertyFromDotDelimitedString(obj, name, returncontext) {
    if (!isString(name) && !name) {
      return returncontext ? {ctx : null, val: obj, key: null} : obj;
    }
    var names = name.split('.'), retobj = {ctx: obj, val: null, key:null}, ret;

    names.forEach(dive.bind(null, retobj));

    if (returncontext) {
      return retobj;
    }else{
      ret = retobj.val;
      retobj.val = null;
      retobj.ctx = null;
      retobj = null;
      return ret;
    }
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

  function toIndentedJson (data, indent) {
    if (isNaN(indent)) {
      indent = 2;
    }
    return JSON.stringify(data, null, indent);
  }

  return {
    prependToString: prependToString,
    thousandSeparate : thousandSeparate,
    toIndentedJson : toIndentedJson,
    readPropertyFromDotDelimitedString: readPropertyFromDotDelimitedString,
    writePropertyFromDelimitedString : writePropertyFromDelimitedString
  };
}

module.exports = createMisc;
