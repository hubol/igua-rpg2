// Lifted from `dexie.js` -- all the @ts-ignore's are because dexie doesn't use ts-strict and has type errors.

import { _global } from "../globals/global.js";
export const keys = Object.keys;
export const isArray = Array.isArray;
if (typeof Promise !== "undefined" && !_global.Promise) {
  // In jsdom, this it can be the case that Promise is not put on the global object.
  // If so, we need to patch the global object for the rest of the code to work as expected.
  // Other dexie code expects Promise to be on the global object (like normal browser environments)
  _global.Promise = Promise;
}
export { _global };

export function extend<T extends object, X extends object>(
  obj: T,
  extension: X
): T & X {
  if (typeof extension !== "object") return obj as T & X;
  keys(extension).forEach(function (key) {
    // @ts-ignore
    obj[key] = extension[key];
  });
  return obj as T & X;
}

export const getProto = Object.getPrototypeOf;
export const _hasOwn = {}.hasOwnProperty;
// @ts-ignore
export function hasOwn(obj, prop) {
  return _hasOwn.call(obj, prop);
}

// @ts-ignore
export function props(proto, extension) {
  if (typeof extension === "function") extension = extension(getProto(proto));
  (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach(
    (key) => {
      setProp(proto, key, extension[key]);
    }
  );
}

export const defineProperty = Object.defineProperty;

// @ts-ignore
export function setProp(obj, prop, functionOrGetSet, options?) {
  defineProperty(
    obj,
    prop,
    extend(
      functionOrGetSet &&
        hasOwn(functionOrGetSet, "get") &&
        typeof functionOrGetSet.get === "function"
        ? {
            get: functionOrGetSet.get,
            set: functionOrGetSet.set,
            configurable: true,
          }
        : { value: functionOrGetSet, configurable: true, writable: true },
      options
    )
  );
}

// @ts-ignore
export function derive(Child) {
  return {
    // @ts-ignore
    from: function (Parent) {
      Child.prototype = Object.create(Parent.prototype);
      setProp(Child.prototype, "constructor", Child);
      return {
        extend: props.bind(null, Child.prototype),
      };
    },
  };
}

export const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
// @ts-ignore
export function getPropertyDescriptor(obj, prop) {
  const pd = getOwnPropertyDescriptor(obj, prop);
  let proto;
  return pd || ((proto = getProto(obj)) && getPropertyDescriptor(proto, prop));
}

const _slice = [].slice;
// @ts-ignore
export function slice(args, start?, end?) {
  return _slice.call(args, start, end);
}

// @ts-ignore
export function override(origFunc, overridedFactory) {
  return overridedFactory(origFunc);
}

// @ts-ignore
export function assert(b) {
  if (!b) throw new Error("Assertion Failed");
}

// @ts-ignore
export function asap(fn) {
  // @ts-ignore
  if (_global.setImmediate) setImmediate(fn);
  else setTimeout(fn, 0);
}

// @ts-ignore
export function getUniqueArray(a) {
  // @ts-ignore
  return a.filter((value, index, self) => self.indexOf(value) === index);
}

/** Generate an object (hash map) based on given array.
 * @param extractor Function taking an array item and its index and returning an array of 2 items ([key, value]) to
 *        instert on the resulting object for each item in the array. If this function returns a falsy value, the
 *        current item wont affect the resulting object.
 */
export function arrayToObject<T, R>(
  array: T[],
  extractor: (x: T, idx: number) => [string, R]
): { [name: string]: R } {
  return array.reduce((result, item, i) => {
    var nameAndValue = extractor(item, i);
    // @ts-ignore
    if (nameAndValue) result[nameAndValue[0]] = nameAndValue[1];
    return result;
  }, {});
}

// @ts-ignore
export function trycatcher(fn, reject) {
  return function () {
    try {
      // @ts-ignore
      fn.apply(this, arguments);
    } catch (e) {
      reject(e);
    }
  };
}

// @ts-ignore
export function tryCatch(fn: (...args: any[]) => void, onerror, args?): void {
  try {
    fn.apply(null, args);
  } catch (ex) {
    onerror && onerror(ex);
  }
}

// @ts-ignore
export function getByKeyPath(obj, keyPath) {
  // http://www.w3.org/TR/IndexedDB/#steps-for-extracting-a-key-from-a-value-using-a-key-path
  if (hasOwn(obj, keyPath)) return obj[keyPath]; // This line is moved from last to first for optimization purpose.
  if (!keyPath) return obj;
  if (typeof keyPath !== "string") {
    var rv: any[] = [];
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      // @ts-ignore
      var val = getByKeyPath(obj, keyPath[i]);
      rv.push(val);
    }
    return rv;
  }
  var period = keyPath.indexOf(".");
  if (period !== -1) {
    var innerObj = obj[keyPath.substr(0, period)];
    return innerObj === undefined
      ? undefined
      : getByKeyPath(innerObj, keyPath.substr(period + 1));
  }
  return undefined;
}

// @ts-ignore
export function setByKeyPath(obj, keyPath, value) {
  if (!obj || keyPath === undefined) return;
  if ("isFrozen" in Object && Object.isFrozen(obj)) return;
  if (typeof keyPath !== "string" && "length" in keyPath) {
    assert(typeof value !== "string" && "length" in value);
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      setByKeyPath(obj, keyPath[i], value[i]);
    }
  } else {
    var period = keyPath.indexOf(".");
    if (period !== -1) {
      var currentKeyPath = keyPath.substr(0, period);
      var remainingKeyPath = keyPath.substr(period + 1);
      if (remainingKeyPath === "")
        if (value === undefined) {
          if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
            obj.splice(currentKeyPath, 1);
          else delete obj[currentKeyPath];
        } else obj[currentKeyPath] = value;
      else {
        var innerObj = obj[currentKeyPath];
        if (!innerObj || !hasOwn(obj, currentKeyPath))
          innerObj = obj[currentKeyPath] = {};
        setByKeyPath(innerObj, remainingKeyPath, value);
      }
    } else {
      if (value === undefined) {
        if (isArray(obj) && !isNaN(parseInt(keyPath))) obj.splice(keyPath, 1);
        else delete obj[keyPath];
      } else obj[keyPath] = value;
    }
  }
}

// @ts-ignore
export function delByKeyPath(obj, keyPath) {
  if (typeof keyPath === "string") setByKeyPath(obj, keyPath, undefined);
  else if ("length" in keyPath)
    [].map.call(keyPath, function (kp) {
      setByKeyPath(obj, kp, undefined);
    });
}

// @ts-ignore
export function shallowClone(obj) {
  var rv = {};
  for (var m in obj) {
    // @ts-ignore
    if (hasOwn(obj, m)) rv[m] = obj[m];
  }
  return rv;
}

const concat = [].concat;
export function flatten<T>(a: (T | T[])[]): T[] {
  // @ts-ignore
  return concat.apply([], a);
}

//https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
const intrinsicTypeNames =
  "Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey"
    .split(",")
    .concat(
      flatten(
        [8, 16, 32, 64].map((num) =>
          ["Int", "Uint", "Float"].map((t) => t + num + "Array")
        )
      )
    )
    .filter((t) => _global[t]);
const intrinsicTypes = intrinsicTypeNames.map((t) => _global[t]);
export const intrinsicTypeNameSet = arrayToObject(intrinsicTypeNames, (x) => [
  x,
  true,
]);

let circularRefs: null | WeakMap<any, any> = null;
export function deepClone<T>(any: T): T {
  // @ts-ignore
  circularRefs = typeof WeakMap !== "undefined" && new WeakMap();
  const rv = innerDeepClone(any);
  circularRefs = null;
  return rv;
}

function innerDeepClone<T>(any: T): T {
  if (!any || typeof any !== "object") return any;
  let rv = circularRefs && circularRefs.get(any); // Resolve circular references
  if (rv) return rv;
  if (isArray(any)) {
    rv = [];
    circularRefs && circularRefs.set(any, rv);
    for (var i = 0, l = any.length; i < l; ++i) {
      rv.push(innerDeepClone(any[i]));
    }
  } else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
    rv = any;
  } else {
    const proto = getProto(any);
    rv = proto === Object.prototype ? {} : Object.create(proto);
    circularRefs && circularRefs.set(any, rv);
    for (var prop in any) {
      if (hasOwn(any, prop)) {
        rv[prop] = innerDeepClone(any[prop]);
      }
    }
  }
  return rv;
}

const { toString } = {};
export function toStringTag(o: Object) {
  return toString.call(o).slice(8, -1);
}

// If first argument is iterable or array-like, return it as an array
export const iteratorSymbol =
  typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
export const getIteratorOf =
  typeof iteratorSymbol === "symbol"
    ? // @ts-ignore
      function (x) {
        var i;
        return x != null && (i = x[iteratorSymbol]) && i.apply(x);
      }
    : function () {
        return null;
      };
export const asyncIteratorSymbol =
  typeof Symbol !== "undefined"
    // @ts-ignore
    ? Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator")
    : "@asyncIterator";

export const NO_CHAR_ARRAY = {};
// Takes one or several arguments and returns an array based on the following criteras:
// * If several arguments provided, return arguments converted to an array in a way that
//   still allows javascript engine to optimize the code.
// * If single argument is an array, return a clone of it.
// * If this-pointer equals NO_CHAR_ARRAY, don't accept strings as valid iterables as a special
//   case to the two bullets below.
// * If single argument is an iterable, convert it to an array and return the resulting array.
// * If single argument is array-like (has length of type number), convert it to an array.
// @ts-ignore
export function getArrayOf(arrayLike) {
  var i, a, x, it;
  if (arguments.length === 1) {
    if (isArray(arrayLike)) return arrayLike.slice();
    // @ts-ignore
    if (this === NO_CHAR_ARRAY && typeof arrayLike === "string")
      return [arrayLike];
    if ((it = getIteratorOf(arrayLike))) {
      a = [];
      while (((x = it.next()), !x.done)) a.push(x.value);
      return a;
    }
    if (arrayLike == null) return [arrayLike];
    i = arrayLike.length;
    if (typeof i === "number") {
      a = new Array(i);
      while (i--) a[i] = arrayLike[i];
      return a;
    }
    return [arrayLike];
  }
  i = arguments.length;
  a = new Array(i);
  while (i--) a[i] = arguments[i];
  return a;
}
export const isAsyncFunction =
  typeof Symbol !== "undefined"
    ? // @ts-ignore
      (fn: Function) => fn[Symbol.toStringTag] === "AsyncFunction"
    : () => false;
