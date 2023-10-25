// Lifted from `dexie.js` -- all the @ts-ignore's are because dexie doesn't use ts-strict and has type errors.

import { _global } from "../globals/global";
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

const _hasOwn = {}.hasOwnProperty;
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

const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
// @ts-ignore
export function getPropertyDescriptor(obj, prop) {
  const pd = getOwnPropertyDescriptor(obj, prop);
  let proto;
  return pd || ((proto = getProto(obj)) && getPropertyDescriptor(proto, prop));
}

// @ts-ignore
export function tryCatch(fn: (...args: any[]) => void, onerror, args?): void {
  try {
    fn.apply(null, args);
  } catch (ex) {
    onerror && onerror(ex);
  }
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
