function createStringManipulations(isString, isNull, AllexJSONizingError) {
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

  function valof (obj, prop) {
    if (obj == null || typeof obj == 'undefined') {
      return obj;
    }
    if (prop in obj) {
      return obj[prop];
    }
    if (typeof obj.get == 'function') {
      return obj.get(prop);
    }
    return obj[prop];
  }

  function dive (retobj, n, index, arr){
    var nisin;
    if (!retobj.ctx) return;
    try {
      nisin = n in retobj.ctx;
    } catch (ignore) {
      nisin = false;
    }
    if (!nisin) {
      retobj.key = null;
      retobj.ctx = null;
      retobj.val = null;
      return;
    }
    retobj.val = valof(retobj.ctx, n);
    retobj.key = n;
   
    if (arr.length === 1) {
      return;
    }
    if (arr.length > index+1){
      retobj.ctx = retobj.val;
    }
  }


  function writePropertyFromDelimitedString(obj, path, data, create) {
    if (!isString(path) && !path) return data;
    var old = readPropertyFromDotDelimitedString(obj, path, true);
    

    if (isNull(old.ctx)){
      if (!create) {
        throw new AllexJSONizingError('NON_EXISTING_KEY', obj, 'Property "'+path+'" does not exist on');
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

  function thousandSeparate(val, separator, options) {
    var ret, intv, f, s, start, i;

    if (isNaN(val)) return val;
    if (val == Infinity) return val;
    if (val == -Infinity) return val;

    options = options || {};

    ret = '';
    intv = val > 0 ? Math.floor(val) : Math.ceil(val);
    f = (val+'').replace(intv+'', '');
    s = intv+'';
    start = s.length - 3;

    separator = separator||' ';

    while (start >= 0) {
      i = s.substr(start, 3);
      start -= 3;
      ret = join2StringsWith(i, ret, separator);
    }

    if (start != -3) {
      if (ret.length && !(start==-2 && s[0]=='-')) {
        ret = separator+ret;
      }
      ret = s.substr(0, 3+start) + ret;
    }
    
    if ('decimals' in options) {
      f = Math[options.rounding||'round'](
        Math.abs(parseFloat(f)||0)*(10**options.decimals)
      )+''.replace(/\..*/,'');
      while(f.length<options.decimals) {
        f = '0'+f;
      }
      f = (options.decimalseparator||'.')+f;
    }  
    ret += f;
    return ret;
  }

  function toIndentedJson (data, indent) {
    if (isNaN(indent)) {
      indent = 2;
    }
    return JSON.stringify(data, null, indent);
  }

  function capitalize (strng, force_lower) {
    if (!isString(strng)) throw new Error('Not a string');
    if (strng.length === 0) return strng;

    var lead = strng.charAt(0).toUpperCase();
    if (strng.length === 1) return lead;
    var rest = strng.substr(1);

    return lead+(force_lower ? rest.toLowerCase() : rest);
  }

  function join2StringsWith (deststr, srcstr, joiner) {
    var realjoiner = deststr ? joiner || '' : '';
    return (deststr || '') + (srcstr ? realjoiner+srcstr : '');
  }
  function multiJoinReducer (joiner, result, str) {
    return join2StringsWith(result, str, joiner);
  }
  function joinStringsWith () {
    var args = Array.prototype.slice.call(arguments),
      joiner = args.pop(),
      ret;
    if (args.length<1) {
      return joiner;
    }
    if (args.length<2) {
      return join2StringsWith(args[0], joiner);
    }
    ret = args.reduce(multiJoinReducer.bind(null, joiner), '');
    joiner = null;
    return ret;
  }

  return {
    prependToString: prependToString,
    thousandSeparate : thousandSeparate,
    toIndentedJson : toIndentedJson,
    readPropertyFromDotDelimitedString: readPropertyFromDotDelimitedString,
    writePropertyFromDelimitedString : writePropertyFromDelimitedString,
    capitalize : capitalize,
    joinStringsWith: joinStringsWith,
    querystring : require('querystring')
  };
}

module.exports = createStringManipulations;
