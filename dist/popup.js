/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 41:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var $defineProperty = __webpack_require__(655);

var $SyntaxError = __webpack_require__(8068);
var $TypeError = __webpack_require__(9675);

var gopd = __webpack_require__(5795);

/** @type {import('.')} */
module.exports = function defineDataProperty(
	obj,
	property,
	value
) {
	if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
		throw new $TypeError('`obj` must be an object or a function`');
	}
	if (typeof property !== 'string' && typeof property !== 'symbol') {
		throw new $TypeError('`property` must be a string or a symbol`');
	}
	if (arguments.length > 3 && typeof arguments[3] !== 'boolean' && arguments[3] !== null) {
		throw new $TypeError('`nonEnumerable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 4 && typeof arguments[4] !== 'boolean' && arguments[4] !== null) {
		throw new $TypeError('`nonWritable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 5 && typeof arguments[5] !== 'boolean' && arguments[5] !== null) {
		throw new $TypeError('`nonConfigurable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 6 && typeof arguments[6] !== 'boolean') {
		throw new $TypeError('`loose`, if provided, must be a boolean');
	}

	var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
	var nonWritable = arguments.length > 4 ? arguments[4] : null;
	var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
	var loose = arguments.length > 6 ? arguments[6] : false;

	/* @type {false | TypedPropertyDescriptor<unknown>} */
	var desc = !!gopd && gopd(obj, property);

	if ($defineProperty) {
		$defineProperty(obj, property, {
			configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
			enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
			value: value,
			writable: nonWritable === null && desc ? desc.writable : !nonWritable
		});
	} else if (loose || (!nonEnumerable && !nonWritable && !nonConfigurable)) {
		// must fall back to [[Set]], and was not explicitly asked to make non-enumerable, non-writable, or non-configurable
		obj[property] = value; // eslint-disable-line no-param-reassign
	} else {
		throw new $SyntaxError('This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.');
	}
};


/***/ }),

/***/ 76:
/***/ ((module) => {

"use strict";


/** @type {import('./functionCall')} */
module.exports = Function.prototype.call;


/***/ }),

/***/ 414:
/***/ ((module) => {

"use strict";


/** @type {import('./round')} */
module.exports = Math.round;


/***/ }),

/***/ 453:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var undefined;

var $Object = __webpack_require__(9612);

var $Error = __webpack_require__(9383);
var $EvalError = __webpack_require__(1237);
var $RangeError = __webpack_require__(9290);
var $ReferenceError = __webpack_require__(9538);
var $SyntaxError = __webpack_require__(8068);
var $TypeError = __webpack_require__(9675);
var $URIError = __webpack_require__(5345);

var abs = __webpack_require__(1514);
var floor = __webpack_require__(8968);
var max = __webpack_require__(6188);
var min = __webpack_require__(8002);
var pow = __webpack_require__(5880);
var round = __webpack_require__(414);
var sign = __webpack_require__(3093);

var $Function = Function;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = __webpack_require__(5795);
var $defineProperty = __webpack_require__(655);

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = __webpack_require__(4039)();

var getProto = __webpack_require__(3628);
var $ObjectGPO = __webpack_require__(1064);
var $ReflectGPO = __webpack_require__(8648);

var $apply = __webpack_require__(1002);
var $call = __webpack_require__(76);

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	__proto__: null,
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
	'%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': $Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': $EvalError,
	'%Float16Array%': typeof Float16Array === 'undefined' ? undefined : Float16Array,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': $Object,
	'%Object.getOwnPropertyDescriptor%': $gOPD,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': $RangeError,
	'%ReferenceError%': $ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': $URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet,

	'%Function.prototype.call%': $call,
	'%Function.prototype.apply%': $apply,
	'%Object.defineProperty%': $defineProperty,
	'%Object.getPrototypeOf%': $ObjectGPO,
	'%Math.abs%': abs,
	'%Math.floor%': floor,
	'%Math.max%': max,
	'%Math.min%': min,
	'%Math.pow%': pow,
	'%Math.round%': round,
	'%Math.sign%': sign,
	'%Reflect.getPrototypeOf%': $ReflectGPO
};

if (getProto) {
	try {
		null.error; // eslint-disable-line no-unused-expressions
	} catch (e) {
		// https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
		var errorProto = getProto(getProto(e));
		INTRINSICS['%Error.prototype%'] = errorProto;
	}
}

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen && getProto) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	__proto__: null,
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = __webpack_require__(6743);
var hasOwn = __webpack_require__(9957);
var $concat = bind.call($call, Array.prototype.concat);
var $spliceApply = bind.call($apply, Array.prototype.splice);
var $replace = bind.call($call, String.prototype.replace);
var $strSlice = bind.call($call, String.prototype.slice);
var $exec = bind.call($call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};


/***/ }),

/***/ 487:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var setFunctionLength = __webpack_require__(6897);

var $defineProperty = __webpack_require__(655);

var callBindBasic = __webpack_require__(3126);
var applyBind = __webpack_require__(2205);

module.exports = function callBind(originalFunction) {
	var func = callBindBasic(arguments);
	var adjustedLength = originalFunction.length - (arguments.length - 1);
	return setFunctionLength(
		func,
		1 + (adjustedLength > 0 ? adjustedLength : 0),
		true
	);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}


/***/ }),

/***/ 592:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var $defineProperty = __webpack_require__(655);

var hasPropertyDescriptors = function hasPropertyDescriptors() {
	return !!$defineProperty;
};

hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
	// node v0.6 has a bug where array lengths can be Set but not Defined
	if (!$defineProperty) {
		return null;
	}
	try {
		return $defineProperty([], 'length', { value: 1 }).length !== 1;
	} catch (e) {
		// In Firefox 4-22, defining length on an array throws an exception.
		return true;
	}
};

module.exports = hasPropertyDescriptors;


/***/ }),

/***/ 655:
/***/ ((module) => {

"use strict";


/** @type {import('.')} */
var $defineProperty = Object.defineProperty || false;
if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = false;
	}
}

module.exports = $defineProperty;


/***/ }),

/***/ 1002:
/***/ ((module) => {

"use strict";


/** @type {import('./functionApply')} */
module.exports = Function.prototype.apply;


/***/ }),

/***/ 1064:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var $Object = __webpack_require__(9612);

/** @type {import('./Object.getPrototypeOf')} */
module.exports = $Object.getPrototypeOf || null;


/***/ }),

/***/ 1093:
/***/ ((module) => {

"use strict";


var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};


/***/ }),

/***/ 1189:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var slice = Array.prototype.slice;
var isArgs = __webpack_require__(1093);

var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) { return origKeys(o); } : __webpack_require__(8875);

var originalKeys = Object.keys;

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			var args = Object.keys(arguments);
			return args && args.length === arguments.length;
		}(1, 2));
		if (!keysWorksWithArguments) {
			Object.keys = function keys(object) { // eslint-disable-line func-name-matching
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				}
				return originalKeys(object);
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;


/***/ }),

/***/ 1237:
/***/ ((module) => {

"use strict";


/** @type {import('./eval')} */
module.exports = EvalError;


/***/ }),

/***/ 1333:
/***/ ((module) => {

"use strict";


/** @type {import('./shams')} */
/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	/** @type {{ [k in symbol]?: unknown }} */
	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (var _ in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		// eslint-disable-next-line no-extra-parens
		var descriptor = /** @type {PropertyDescriptor} */ (Object.getOwnPropertyDescriptor(obj, sym));
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};


/***/ }),

/***/ 1514:
/***/ ((module) => {

"use strict";


/** @type {import('./abs')} */
module.exports = Math.abs;


/***/ }),

/***/ 2205:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(6743);
var $apply = __webpack_require__(1002);
var actualApply = __webpack_require__(3144);

/** @type {import('./applyBind')} */
module.exports = function applyBind() {
	return actualApply(bind, $apply, arguments);
};


/***/ }),

/***/ 3093:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var $isNaN = __webpack_require__(4459);

/** @type {import('./sign')} */
module.exports = function sign(number) {
	if ($isNaN(number) || number === 0) {
		return number;
	}
	return number < 0 ? -1 : +1;
};


/***/ }),

/***/ 3126:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(6743);
var $TypeError = __webpack_require__(9675);

var $call = __webpack_require__(76);
var $actualApply = __webpack_require__(3144);

/** @type {(args: [Function, thisArg?: unknown, ...args: unknown[]]) => Function} TODO FIXME, find a way to use import('.') */
module.exports = function callBindBasic(args) {
	if (args.length < 1 || typeof args[0] !== 'function') {
		throw new $TypeError('a function is required');
	}
	return $actualApply(bind, $call, args);
};


/***/ }),

/***/ 3144:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(6743);

var $apply = __webpack_require__(1002);
var $call = __webpack_require__(76);
var $reflectApply = __webpack_require__(7119);

/** @type {import('./actualApply')} */
module.exports = $reflectApply || bind.call($call, $apply);


/***/ }),

/***/ 3628:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var reflectGetProto = __webpack_require__(8648);
var originalGetProto = __webpack_require__(1064);

var getDunderProto = __webpack_require__(7176);

/** @type {import('.')} */
module.exports = reflectGetProto
	? function getProto(O) {
		// @ts-expect-error TS can't narrow inside a closure, for some reason
		return reflectGetProto(O);
	}
	: originalGetProto
		? function getProto(O) {
			if (!O || (typeof O !== 'object' && typeof O !== 'function')) {
				throw new TypeError('getProto: not an object');
			}
			// @ts-expect-error TS can't narrow inside a closure, for some reason
			return originalGetProto(O);
		}
		: getDunderProto
			? function getProto(O) {
				// @ts-expect-error TS can't narrow inside a closure, for some reason
				return getDunderProto(O);
			}
			: null;


/***/ }),

/***/ 4039:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __webpack_require__(1333);

/** @type {import('.')} */
module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};


/***/ }),

/***/ 4343:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


exports.parse = __webpack_require__(5776);
exports.stringify = __webpack_require__(9086);


/***/ }),

/***/ 4459:
/***/ ((module) => {

"use strict";


/** @type {import('./isNaN')} */
module.exports = Number.isNaN || function isNaN(a) {
	return a !== a;
};


/***/ }),

/***/ 4634:
/***/ ((module) => {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ 5345:
/***/ ((module) => {

"use strict";


/** @type {import('./uri')} */
module.exports = URIError;


/***/ }),

/***/ 5473:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/** @type {typeof JSON.stringify} */
var jsonStringify = (typeof JSON !== 'undefined' ? JSON : __webpack_require__(4343)).stringify;

var isArray = __webpack_require__(4634);
var objectKeys = __webpack_require__(1189);
var callBind = __webpack_require__(487);
var callBound = __webpack_require__(6556);

var $join = callBound('Array.prototype.join');
var $indexOf = callBound('Array.prototype.indexOf');
var $splice = callBound('Array.prototype.splice');
var $sort = callBound('Array.prototype.sort');

/** @type {(n: number, char: string) => string} */
var strRepeat = function repeat(n, char) {
	var str = '';
	for (var i = 0; i < n; i += 1) {
		str += char;
	}
	return str;
};

/** @type {(parent: import('.').Node, key: import('.').Key, value: unknown) => unknown} */
var defaultReplacer = function (_parent, _key, value) { return value; };

/** @type {import('.')} */
module.exports = function stableStringify(obj) {
	/** @type {Parameters<import('.')>[1]} */
	var opts = arguments.length > 1 ? arguments[1] : void undefined;
	var space = (opts && opts.space) || '';
	if (typeof space === 'number') { space = strRepeat(space, ' '); }
	var cycles = !!opts && typeof opts.cycles === 'boolean' && opts.cycles;
	/** @type {undefined | typeof defaultReplacer} */
	var replacer = opts && opts.replacer ? callBind(opts.replacer) : defaultReplacer;
	if (opts && typeof opts.collapseEmpty !== 'undefined' && typeof opts.collapseEmpty !== 'boolean') {
		throw new TypeError('`collapseEmpty` must be a boolean, if provided');
	}
	var collapseEmpty = !!opts && opts.collapseEmpty;

	var cmpOpt = typeof opts === 'function' ? opts : opts && opts.cmp;
	/** @type {undefined | (<T extends import('.').NonArrayNode>(node: T) => (a: Exclude<keyof T, symbol | number>, b: Exclude<keyof T, symbol | number>) => number)} */
	var cmp = cmpOpt && function (node) {
		// eslint-disable-next-line no-extra-parens
		var get = /** @type {NonNullable<typeof cmpOpt>} */ (cmpOpt).length > 2
			&& /** @type {import('.').Getter['get']} */ function get(k) { return node[k]; };
		return function (a, b) {
			// eslint-disable-next-line no-extra-parens
			return /** @type {NonNullable<typeof cmpOpt>} */ (cmpOpt)(
				{ key: a, value: node[a] },
				{ key: b, value: node[b] },
				// @ts-expect-error TS doesn't understand the optimization used here
				get ? /** @type {import('.').Getter} */ { __proto__: null, get: get } : void undefined
			);
		};
	};

	/** @type {import('.').Node[]} */
	var seen = [];
	return (/** @type {(parent: import('.').Node, key: string | number, node: unknown, level: number) => string | undefined} */
		function stringify(parent, key, node, level) {
			var indent = space ? '\n' + strRepeat(level, space) : '';
			var colonSeparator = space ? ': ' : ':';

			// eslint-disable-next-line no-extra-parens
			if (node && /** @type {{ toJSON?: unknown }} */ (node).toJSON && typeof /** @type {{ toJSON?: unknown }} */ (node).toJSON === 'function') {
				// eslint-disable-next-line no-extra-parens
				node = /** @type {{ toJSON: Function }} */ (node).toJSON();
			}

			node = replacer(parent, key, node);
			if (node === undefined) {
				return;
			}
			if (typeof node !== 'object' || node === null) {
				return jsonStringify(node);
			}

			/** @type {(out: string[], brackets: '[]' | '{}') => string} */
			var groupOutput = function (out, brackets) {
				return collapseEmpty && out.length === 0
					? brackets
					: (brackets === '[]' ? '[' : '{') + $join(out, ',') + indent + (brackets === '[]' ? ']' : '}');
			};

			if (isArray(node)) {
				var out = [];
				for (var i = 0; i < node.length; i++) {
					var item = stringify(node, i, node[i], level + 1) || jsonStringify(null);
					out[out.length] = indent + space + item;
				}
				return groupOutput(out, '[]');
			}

			if ($indexOf(seen, node) !== -1) {
				if (cycles) { return jsonStringify('__cycle__'); }
				throw new TypeError('Converting circular structure to JSON');
			} else {
				seen[seen.length] = /** @type {import('.').NonArrayNode} */ (node);
			}

			/** @type {import('.').Key[]} */
			// eslint-disable-next-line no-extra-parens
			var keys = $sort(objectKeys(node), cmp && cmp(/** @type {import('.').NonArrayNode} */ (node)));
			var out = [];
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				// eslint-disable-next-line no-extra-parens
				var value = stringify(/** @type {import('.').Node} */ (node), key, /** @type {import('.').NonArrayNode} */ (node)[key], level + 1);

				if (!value) { continue; }

				var keyValue = jsonStringify(key)
					+ colonSeparator
					+ value;

				out[out.length] = indent + space + keyValue;
			}
			$splice(seen, $indexOf(seen, node), 1);
			return groupOutput(out, '{}');
		}({ '': obj }, '', obj, 0)
	);
};


/***/ }),

/***/ 5776:
/***/ ((module) => {

"use strict";


var at; // The index of the current character
var ch; // The current character
var escapee = {
	'"': '"',
	'\\': '\\',
	'/': '/',
	b: '\b',
	f: '\f',
	n: '\n',
	r: '\r',
	t: '\t'
};
var text;

// Call error when something is wrong.
function error(m) {
	throw {
		name: 'SyntaxError',
		message: m,
		at: at,
		text: text
	};
}

function next(c) {
	// If a c parameter is provided, verify that it matches the current character.
	if (c && c !== ch) {
		error("Expected '" + c + "' instead of '" + ch + "'");
	}

	// Get the next character. When there are no more characters, return the empty string.

	ch = text.charAt(at);
	at += 1;
	return ch;
}

function number() {
	// Parse a number value.
	var num;
	var str = '';

	if (ch === '-') {
		str = '-';
		next('-');
	}
	while (ch >= '0' && ch <= '9') {
		str += ch;
		next();
	}
	if (ch === '.') {
		str += '.';
		while (next() && ch >= '0' && ch <= '9') {
			str += ch;
		}
	}
	if (ch === 'e' || ch === 'E') {
		str += ch;
		next();
		if (ch === '-' || ch === '+') {
			str += ch;
			next();
		}
		while (ch >= '0' && ch <= '9') {
			str += ch;
			next();
		}
	}
	num = Number(str);
	if (!isFinite(num)) {
		error('Bad number');
	}
	return num;
}

function string() {
	// Parse a string value.
	var hex;
	var i;
	var str = '';
	var uffff;

	// When parsing for string values, we must look for " and \ characters.
	if (ch === '"') {
		while (next()) {
			if (ch === '"') {
				next();
				return str;
			} else if (ch === '\\') {
				next();
				if (ch === 'u') {
					uffff = 0;
					for (i = 0; i < 4; i += 1) {
						hex = parseInt(next(), 16);
						if (!isFinite(hex)) {
							break;
						}
						uffff = (uffff * 16) + hex;
					}
					str += String.fromCharCode(uffff);
				} else if (typeof escapee[ch] === 'string') {
					str += escapee[ch];
				} else {
					break;
				}
			} else {
				str += ch;
			}
		}
	}
	error('Bad string');
}

// Skip whitespace.
function white() {
	while (ch && ch <= ' ') {
		next();
	}
}

// true, false, or null.
function word() {
	switch (ch) {
		case 't':
			next('t');
			next('r');
			next('u');
			next('e');
			return true;
		case 'f':
			next('f');
			next('a');
			next('l');
			next('s');
			next('e');
			return false;
		case 'n':
			next('n');
			next('u');
			next('l');
			next('l');
			return null;
		default:
			error("Unexpected '" + ch + "'");
	}
}

// Parse an array value.
function array() {
	var arr = [];

	if (ch === '[') {
		next('[');
		white();
		if (ch === ']') {
			next(']');
			return arr; // empty array
		}
		while (ch) {
			arr.push(value()); // eslint-disable-line no-use-before-define
			white();
			if (ch === ']') {
				next(']');
				return arr;
			}
			next(',');
			white();
		}
	}
	error('Bad array');
}

// Parse an object value.
function object() {
	var key;
	var obj = {};

	if (ch === '{') {
		next('{');
		white();
		if (ch === '}') {
			next('}');
			return obj; // empty object
		}
		while (ch) {
			key = string();
			white();
			next(':');
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				error('Duplicate key "' + key + '"');
			}
			obj[key] = value(); // eslint-disable-line no-use-before-define
			white();
			if (ch === '}') {
				next('}');
				return obj;
			}
			next(',');
			white();
		}
	}
	error('Bad object');
}

// Parse a JSON value. It could be an object, an array, a string, a number, or a word.
function value() {
	white();
	switch (ch) {
		case '{':
			return object();
		case '[':
			return array();
		case '"':
			return string();
		case '-':
			return number();
		default:
			return ch >= '0' && ch <= '9' ? number() : word();
	}
}

// Return the json_parse function. It will have access to all of the above functions and variables.
module.exports = function (source, reviver) {
	var result;

	text = source;
	at = 0;
	ch = ' ';
	result = value();
	white();
	if (ch) {
		error('Syntax error');
	}

	// If there is a reviver function, we recursively walk the new structure,
	// passing each name/value pair to the reviver function for possible
	// transformation, starting with a temporary root object that holds the result
	// in an empty key. If there is not a reviver function, we simply return the
	// result.

	return typeof reviver === 'function' ? (function walk(holder, key) {
		var k;
		var v;
		var val = holder[key];
		if (val && typeof val === 'object') {
			for (k in value) {
				if (Object.prototype.hasOwnProperty.call(val, k)) {
					v = walk(val, k);
					if (typeof v === 'undefined') {
						delete val[k];
					} else {
						val[k] = v;
					}
				}
			}
		}
		return reviver.call(holder, key, val);
	}({ '': result }, '')) : result;
};


/***/ }),

/***/ 5795:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/** @type {import('.')} */
var $gOPD = __webpack_require__(6549);

if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;


/***/ }),

/***/ 5880:
/***/ ((module) => {

"use strict";


/** @type {import('./pow')} */
module.exports = Math.pow;


/***/ }),

/***/ 6188:
/***/ ((module) => {

"use strict";


/** @type {import('./max')} */
module.exports = Math.max;


/***/ }),

/***/ 6549:
/***/ ((module) => {

"use strict";


/** @type {import('./gOPD')} */
module.exports = Object.getOwnPropertyDescriptor;


/***/ }),

/***/ 6556:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(453);

var callBindBasic = __webpack_require__(3126);

/** @type {(thisArg: string, searchString: string, position?: number) => number} */
var $indexOf = callBindBasic([GetIntrinsic('%String.prototype.indexOf%')]);

/** @type {import('.')} */
module.exports = function callBoundIntrinsic(name, allowMissing) {
	/* eslint no-extra-parens: 0 */

	var intrinsic = /** @type {(this: unknown, ...args: unknown[]) => unknown} */ (GetIntrinsic(name, !!allowMissing));
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBindBasic(/** @type {const} */ ([intrinsic]));
	}
	return intrinsic;
};


/***/ }),

/***/ 6743:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(9353);

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ 6897:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(453);
var define = __webpack_require__(41);
var hasDescriptors = __webpack_require__(592)();
var gOPD = __webpack_require__(5795);

var $TypeError = __webpack_require__(9675);
var $floor = GetIntrinsic('%Math.floor%');

/** @type {import('.')} */
module.exports = function setFunctionLength(fn, length) {
	if (typeof fn !== 'function') {
		throw new $TypeError('`fn` is not a function');
	}
	if (typeof length !== 'number' || length < 0 || length > 0xFFFFFFFF || $floor(length) !== length) {
		throw new $TypeError('`length` must be a positive 32-bit integer');
	}

	var loose = arguments.length > 2 && !!arguments[2];

	var functionLengthIsConfigurable = true;
	var functionLengthIsWritable = true;
	if ('length' in fn && gOPD) {
		var desc = gOPD(fn, 'length');
		if (desc && !desc.configurable) {
			functionLengthIsConfigurable = false;
		}
		if (desc && !desc.writable) {
			functionLengthIsWritable = false;
		}
	}

	if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
		if (hasDescriptors) {
			define(/** @type {Parameters<define>[0]} */ (fn), 'length', length, true, true);
		} else {
			define(/** @type {Parameters<define>[0]} */ (fn), 'length', length);
		}
	}
	return fn;
};


/***/ }),

/***/ 7119:
/***/ ((module) => {

"use strict";


/** @type {import('./reflectApply')} */
module.exports = typeof Reflect !== 'undefined' && Reflect && Reflect.apply;


/***/ }),

/***/ 7176:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var callBind = __webpack_require__(3126);
var gOPD = __webpack_require__(5795);

var hasProtoAccessor;
try {
	// eslint-disable-next-line no-extra-parens, no-proto
	hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */ ([]).__proto__ === Array.prototype;
} catch (e) {
	if (!e || typeof e !== 'object' || !('code' in e) || e.code !== 'ERR_PROTO_ACCESS') {
		throw e;
	}
}

// eslint-disable-next-line no-extra-parens
var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, /** @type {keyof typeof Object.prototype} */ ('__proto__'));

var $Object = Object;
var $getPrototypeOf = $Object.getPrototypeOf;

/** @type {import('./get')} */
module.exports = desc && typeof desc.get === 'function'
	? callBind([desc.get])
	: typeof $getPrototypeOf === 'function'
		? /** @type {import('./get')} */ function getDunder(value) {
			// eslint-disable-next-line eqeqeq
			return $getPrototypeOf(value == null ? value : $Object(value));
		}
		: false;


/***/ }),

/***/ 8002:
/***/ ((module) => {

"use strict";


/** @type {import('./min')} */
module.exports = Math.min;


/***/ }),

/***/ 8068:
/***/ ((module) => {

"use strict";


/** @type {import('./syntax')} */
module.exports = SyntaxError;


/***/ }),

/***/ 8648:
/***/ ((module) => {

"use strict";


/** @type {import('./Reflect.getPrototypeOf')} */
module.exports = (typeof Reflect !== 'undefined' && Reflect.getPrototypeOf) || null;


/***/ }),

/***/ 8875:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var keysShim;
if (!Object.keys) {
	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var isArgs = __webpack_require__(1093); // eslint-disable-line global-require
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$applicationCache: true,
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$onmozfullscreenchange: true,
		$onmozfullscreenerror: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
}
module.exports = keysShim;


/***/ }),

/***/ 8968:
/***/ ((module) => {

"use strict";


/** @type {import('./floor')} */
module.exports = Math.floor;


/***/ }),

/***/ 9086:
/***/ ((module) => {

"use strict";


var escapable = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
var gap;
var indent;
var meta = { // table of character substitutions
	'\b': '\\b',
	'\t': '\\t',
	'\n': '\\n',
	'\f': '\\f',
	'\r': '\\r',
	'"': '\\"',
	'\\': '\\\\'
};
var rep;

function quote(string) {
	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape sequences.

	escapable.lastIndex = 0;
	return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
		var c = meta[a];
		return typeof c === 'string' ? c
			: '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	}) + '"' : '"' + string + '"';
}

function str(key, holder) {
	// Produce a string from holder[key].
	var i; // The loop counter.
	var k; // The member key.
	var v; // The member value.
	var length;
	var mind = gap;
	var partial;
	var value = holder[key];

	// If the value has a toJSON method, call it to obtain a replacement value.
	if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
		value = value.toJSON(key);
	}

	// If we were called with a replacer function, then call the replacer to obtain a replacement value.
	if (typeof rep === 'function') {
		value = rep.call(holder, key, value);
	}

	// What happens next depends on the value's type.
	switch (typeof value) {
		case 'string':
			return quote(value);

		case 'number':
			// JSON numbers must be finite. Encode non-finite numbers as null.
			return isFinite(value) ? String(value) : 'null';

		case 'boolean':
		case 'null':
			// If the value is a boolean or null, convert it to a string. Note:
			// typeof null does not produce 'null'. The case is included here in
			// the remote chance that this gets fixed someday.
			return String(value);

		case 'object':
			if (!value) {
				return 'null';
			}
			gap += indent;
			partial = [];

			// Array.isArray
			if (Object.prototype.toString.apply(value) === '[object Array]') {
				length = value.length;
				for (i = 0; i < length; i += 1) {
					partial[i] = str(i, value) || 'null';
				}

				// Join all of the elements together, separated with commas, and wrap them in brackets.
				v = partial.length === 0 ? '[]' : gap
					? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
					: '[' + partial.join(',') + ']';
				gap = mind;
				return v;
			}

			// If the replacer is an array, use it to select the members to be stringified.
			if (rep && typeof rep === 'object') {
				length = rep.length;
				for (i = 0; i < length; i += 1) {
					k = rep[i];
					if (typeof k === 'string') {
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			} else {
				// Otherwise, iterate through all of the keys in the object.
				for (k in value) {
					if (Object.prototype.hasOwnProperty.call(value, k)) {
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			}

			// Join all of the member texts together, separated with commas, and wrap them in braces.

			v = partial.length === 0 ? '{}' : gap
				? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
				: '{' + partial.join(',') + '}';
			gap = mind;
			return v;
		default:
	}
}

module.exports = function (value, replacer, space) {
	var i;
	gap = '';
	indent = '';

	// If the space parameter is a number, make an indent string containing that many spaces.
	if (typeof space === 'number') {
		for (i = 0; i < space; i += 1) {
			indent += ' ';
		}
	} else if (typeof space === 'string') {
		// If the space parameter is a string, it will be used as the indent string.
		indent = space;
	}

	// If there is a replacer, it must be a function or an array. Otherwise, throw an error.
	rep = replacer;
	if (
		replacer
		&& typeof replacer !== 'function'
		&& (typeof replacer !== 'object' || typeof replacer.length !== 'number')
	) {
		throw new Error('JSON.stringify');
	}

	// Make a fake root object containing our value under the key of ''.
	// Return the result of stringifying the value.
	return str('', { '': value });
};


/***/ }),

/***/ 9290:
/***/ ((module) => {

"use strict";


/** @type {import('./range')} */
module.exports = RangeError;


/***/ }),

/***/ 9353:
/***/ ((module) => {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var toStr = Object.prototype.toString;
var max = Math.max;
var funcType = '[object Function]';

var concatty = function concatty(a, b) {
    var arr = [];

    for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
    }
    for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
    }

    return arr;
};

var slicy = function slicy(arrLike, offset) {
    var arr = [];
    for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
    }
    return arr;
};

var joiny = function (arr, joiner) {
    var str = '';
    for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
            str += joiner;
        }
    }
    return str;
};

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                concatty(args, arguments)
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        }
        return target.apply(
            that,
            concatty(args, arguments)
        );

    };

    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = '$' + i;
    }

    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ 9383:
/***/ ((module) => {

"use strict";


/** @type {import('.')} */
module.exports = Error;


/***/ }),

/***/ 9538:
/***/ ((module) => {

"use strict";


/** @type {import('./ref')} */
module.exports = ReferenceError;


/***/ }),

/***/ 9612:
/***/ ((module) => {

"use strict";


/** @type {import('.')} */
module.exports = Object;


/***/ }),

/***/ 9675:
/***/ ((module) => {

"use strict";


/** @type {import('./type')} */
module.exports = TypeError;


/***/ }),

/***/ 9957:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind = __webpack_require__(6743);

/** @type {import('.')} */
module.exports = bind.call(call, $hasOwn);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

;// ./node_modules/@noble/hashes/esm/_assert.js
function number(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error(`Wrong positive integer: ${n}`);
}
function bool(b) {
    if (typeof b !== 'boolean')
        throw new Error(`Expected boolean, not ${b}`);
}
function bytes(b, ...lengths) {
    if (!(b instanceof Uint8Array))
        throw new Error('Expected Uint8Array');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash(hash) {
    if (typeof hash !== 'function' || typeof hash.create !== 'function')
        throw new Error('Hash should be wrapped by utils.wrapConstructor');
    number(hash.outputLen);
    number(hash.blockLen);
}
function exists(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
function output(out, instance) {
    bytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
}

const _assert_assert = { number, bool, bytes, hash, exists, output };
/* harmony default export */ const _assert = ((/* unused pure expression or super */ null && (_assert_assert)));
//# sourceMappingURL=_assert.js.map
;// ./node_modules/@noble/hashes/esm/_u64.js
const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);
// We are not using BigUint64Array, because they are extremely slow as per 2022
function fromBig(n, le = false) {
    if (le)
        return { h: Number(n & U32_MASK64), l: Number((n >> _32n) & U32_MASK64) };
    return { h: Number((n >> _32n) & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0; i < lst.length; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
}
const toBig = (h, l) => (BigInt(h >>> 0) << _32n) | BigInt(l >>> 0);
// for Shift in [0, 32)
const shrSH = (h, _l, s) => h >>> s;
const shrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in [1, 32)
const rotrSH = (h, l, s) => (h >>> s) | (l << (32 - s));
const rotrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotrBH = (h, l, s) => (h << (64 - s)) | (l >>> (s - 32));
const rotrBL = (h, l, s) => (h >>> (s - 32)) | (l << (64 - s));
// Right rotate for shift===32 (just swaps l&h)
const rotr32H = (_h, l) => l;
const rotr32L = (h, _l) => h;
// Left rotate for Shift in [1, 32)
const rotlSH = (h, l, s) => (h << s) | (l >>> (32 - s));
const rotlSL = (h, l, s) => (l << s) | (h >>> (32 - s));
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotlBH = (h, l, s) => (l << (s - 32)) | (h >>> (64 - s));
const rotlBL = (h, l, s) => (h << (s - 32)) | (l >>> (64 - s));
// JS uses 32-bit signed integers for bitwise operations which means we cannot
// simple take carry out of low bit sum by shift, we need to use division.
function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: (Ah + Bh + ((l / 2 ** 32) | 0)) | 0, l: l | 0 };
}
// Addition with more than 2 elements
const add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
const add3H = (low, Ah, Bh, Ch) => (Ah + Bh + Ch + ((low / 2 ** 32) | 0)) | 0;
const add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
const add4H = (low, Ah, Bh, Ch, Dh) => (Ah + Bh + Ch + Dh + ((low / 2 ** 32) | 0)) | 0;
const add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
const add5H = (low, Ah, Bh, Ch, Dh, Eh) => (Ah + Bh + Ch + Dh + Eh + ((low / 2 ** 32) | 0)) | 0;
// prettier-ignore

// prettier-ignore
const u64 = {
    fromBig, split, toBig,
    shrSH, shrSL,
    rotrSH, rotrSL, rotrBH, rotrBL,
    rotr32H, rotr32L,
    rotlSH, rotlSL, rotlBH, rotlBL,
    add, add3L, add3H, add4L, add4H, add5H, add5L,
};
/* harmony default export */ const _u64 = ((/* unused pure expression or super */ null && (u64)));
//# sourceMappingURL=_u64.js.map
;// ./node_modules/@noble/hashes/esm/utils.js
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated, we can just drop the import.

const u8a = (a) => a instanceof Uint8Array;
// Cast array to different type
const u8 = (arr) => new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
const u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
// Cast array to view
const createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
// The rotate right (circular right shift) operation for uint32
const rotr = (word, shift) => (word << (32 - shift)) | (word >>> shift);
// big-endian hardware is rare. Just in case someone still decides to run hashes:
// early-throw an error because we don't support BE yet.
const isLE = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
if (!isLE)
    throw new Error('Non little-endian hardware is not supported');
const hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));
/**
 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
 */
function bytesToHex(bytes) {
    if (!u8a(bytes))
        throw new Error('Uint8Array expected');
    // pre-caching improves the speed 6x
    let hex = '';
    for (let i = 0; i < bytes.length; i++) {
        hex += hexes[bytes[i]];
    }
    return hex;
}
/**
 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
 */
function hexToBytes(hex) {
    if (typeof hex !== 'string')
        throw new Error('hex string expected, got ' + typeof hex);
    const len = hex.length;
    if (len % 2)
        throw new Error('padded hex string expected, got unpadded hex of length ' + len);
    const array = new Uint8Array(len / 2);
    for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        const hexByte = hex.slice(j, j + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
            throw new Error('Invalid byte sequence');
        array[i] = byte;
    }
    return array;
}
// There is no setImmediate in browser and setTimeout is slow.
// call of async fn will return Promise, which will be fullfiled only on
// next scheduler queue processing step and this is exactly what we need.
const nextTick = async () => { };
// Returns control to thread each 'tick' ms to avoid blocking
async function asyncLoop(iters, tick, cb) {
    let ts = Date.now();
    for (let i = 0; i < iters; i++) {
        cb(i);
        // Date.now() is not monotonic, so in case if clock goes backwards we return return control too
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
            continue;
        await nextTick();
        ts += diff;
    }
}
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes(str) {
    if (typeof str !== 'string')
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes(data) {
    if (typeof data === 'string')
        data = utf8ToBytes(data);
    if (!u8a(data))
        throw new Error(`expected Uint8Array, got ${typeof data}`);
    return data;
}
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes(...arrays) {
    const r = new Uint8Array(arrays.reduce((sum, a) => sum + a.length, 0));
    let pad = 0; // walk through each item, ensure they have proper type
    arrays.forEach((a) => {
        if (!u8a(a))
            throw new Error('Uint8Array expected');
        r.set(a, pad);
        pad += a.length;
    });
    return r;
}
// For runtime check if class implements interface
class Hash {
    // Safe version that clones internal state
    clone() {
        return this._cloneInto();
    }
}
const toStr = {}.toString;
function checkOpts(defaults, opts) {
    if (opts !== undefined && toStr.call(opts) !== '[object Object]')
        throw new Error('Options should be object or undefined');
    const merged = Object.assign(defaults, opts);
    return merged;
}
function wrapConstructor(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
}
function wrapConstructorWithOpts(hashCons) {
    const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
}
function utils_wrapXOFConstructorWithOpts(hashCons) {
    const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
}
/**
 * Secure PRNG. Uses `crypto.getRandomValues`, which defers to OS.
 */
function randomBytes(bytesLength = 32) {
    if (crypto && typeof crypto.getRandomValues === 'function') {
        return crypto.getRandomValues(new Uint8Array(bytesLength));
    }
    throw new Error('crypto.getRandomValues must be defined');
}
//# sourceMappingURL=utils.js.map
;// ./node_modules/@noble/hashes/esm/sha3.js



// SHA3 (keccak) is based on a new design: basically, the internal state is bigger than output size.
// It's called a sponge function.
// Various per round constants calculations
const [SHA3_PI, SHA3_ROTL, _SHA3_IOTA] = [[], [], []];
const _0n = /* @__PURE__ */ BigInt(0);
const _1n = /* @__PURE__ */ BigInt(1);
const _2n = /* @__PURE__ */ BigInt(2);
const _7n = /* @__PURE__ */ BigInt(7);
const _256n = /* @__PURE__ */ BigInt(256);
const _0x71n = /* @__PURE__ */ BigInt(0x71);
for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
    // Pi
    [x, y] = [y, (2 * x + 3 * y) % 5];
    SHA3_PI.push(2 * (5 * y + x));
    // Rotational
    SHA3_ROTL.push((((round + 1) * (round + 2)) / 2) % 64);
    // Iota
    let t = _0n;
    for (let j = 0; j < 7; j++) {
        R = ((R << _1n) ^ ((R >> _7n) * _0x71n)) % _256n;
        if (R & _2n)
            t ^= _1n << ((_1n << /* @__PURE__ */ BigInt(j)) - _1n);
    }
    _SHA3_IOTA.push(t);
}
const [SHA3_IOTA_H, SHA3_IOTA_L] = /* @__PURE__ */ split(_SHA3_IOTA, true);
// Left rotation (without 0, 32, 64)
const rotlH = (h, l, s) => (s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s));
const rotlL = (h, l, s) => (s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s));
// Same as keccakf1600, but allows to skip some rounds
function keccakP(s, rounds = 24) {
    const B = new Uint32Array(5 * 2);
    // NOTE: all indices are x2 since we store state as u32 instead of u64 (bigints to slow in js)
    for (let round = 24 - rounds; round < 24; round++) {
        // Theta θ
        for (let x = 0; x < 10; x++)
            B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
        for (let x = 0; x < 10; x += 2) {
            const idx1 = (x + 8) % 10;
            const idx0 = (x + 2) % 10;
            const B0 = B[idx0];
            const B1 = B[idx0 + 1];
            const Th = rotlH(B0, B1, 1) ^ B[idx1];
            const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
            for (let y = 0; y < 50; y += 10) {
                s[x + y] ^= Th;
                s[x + y + 1] ^= Tl;
            }
        }
        // Rho (ρ) and Pi (π)
        let curH = s[2];
        let curL = s[3];
        for (let t = 0; t < 24; t++) {
            const shift = SHA3_ROTL[t];
            const Th = rotlH(curH, curL, shift);
            const Tl = rotlL(curH, curL, shift);
            const PI = SHA3_PI[t];
            curH = s[PI];
            curL = s[PI + 1];
            s[PI] = Th;
            s[PI + 1] = Tl;
        }
        // Chi (χ)
        for (let y = 0; y < 50; y += 10) {
            for (let x = 0; x < 10; x++)
                B[x] = s[y + x];
            for (let x = 0; x < 10; x++)
                s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
        }
        // Iota (ι)
        s[0] ^= SHA3_IOTA_H[round];
        s[1] ^= SHA3_IOTA_L[round];
    }
    B.fill(0);
}
class Keccak extends Hash {
    // NOTE: we accept arguments in bytes instead of bits here.
    constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        // Can be passed from user as dkLen
        number(outputLen);
        // 1600 = 5x5 matrix of 64bit.  1600 bits === 200 bytes
        if (0 >= this.blockLen || this.blockLen >= 200)
            throw new Error('Sha3 supports only keccak-f1600 function');
        this.state = new Uint8Array(200);
        this.state32 = u32(this.state);
    }
    keccak() {
        keccakP(this.state32, this.rounds);
        this.posOut = 0;
        this.pos = 0;
    }
    update(data) {
        exists(this);
        const { blockLen, state } = this;
        data = toBytes(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            for (let i = 0; i < take; i++)
                state[this.pos++] ^= data[pos++];
            if (this.pos === blockLen)
                this.keccak();
        }
        return this;
    }
    finish() {
        if (this.finished)
            return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        // Do the padding
        state[pos] ^= suffix;
        if ((suffix & 0x80) !== 0 && pos === blockLen - 1)
            this.keccak();
        state[blockLen - 1] ^= 0x80;
        this.keccak();
    }
    writeInto(out) {
        exists(this, false);
        bytes(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for (let pos = 0, len = out.length; pos < len;) {
            if (this.posOut >= blockLen)
                this.keccak();
            const take = Math.min(blockLen - this.posOut, len - pos);
            out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
            this.posOut += take;
            pos += take;
        }
        return out;
    }
    xofInto(out) {
        // Sha3/Keccak usage with XOF is probably mistake, only SHAKE instances can do XOF
        if (!this.enableXOF)
            throw new Error('XOF is not possible for this instance');
        return this.writeInto(out);
    }
    xof(bytes) {
        number(bytes);
        return this.xofInto(new Uint8Array(bytes));
    }
    digestInto(out) {
        output(out, this);
        if (this.finished)
            throw new Error('digest() was already called');
        this.writeInto(out);
        this.destroy();
        return out;
    }
    digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
        this.destroyed = true;
        this.state.fill(0);
    }
    _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        // Suffix can change in cSHAKE
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
    }
}
const gen = (suffix, blockLen, outputLen) => wrapConstructor(() => new Keccak(blockLen, suffix, outputLen));
const sha3_224 = /* @__PURE__ */ (/* unused pure expression or super */ null && (gen(0x06, 144, 224 / 8)));
/**
 * SHA3-256 hash function
 * @param message - that would be hashed
 */
const sha3_256 = /* @__PURE__ */ (/* unused pure expression or super */ null && (gen(0x06, 136, 256 / 8)));
const sha3_384 = /* @__PURE__ */ (/* unused pure expression or super */ null && (gen(0x06, 104, 384 / 8)));
const sha3_512 = /* @__PURE__ */ (/* unused pure expression or super */ null && (gen(0x06, 72, 512 / 8)));
const keccak_224 = /* @__PURE__ */ (/* unused pure expression or super */ null && (gen(0x01, 144, 224 / 8)));
/**
 * keccak-256 hash function. Different from SHA3-256.
 * @param message - that would be hashed
 */
const keccak_256 = /* @__PURE__ */ gen(0x01, 136, 256 / 8);
const keccak_384 = /* @__PURE__ */ (/* unused pure expression or super */ null && (gen(0x01, 104, 384 / 8)));
const keccak_512 = /* @__PURE__ */ (/* unused pure expression or super */ null && (gen(0x01, 72, 512 / 8)));
const genShake = (suffix, blockLen, outputLen) => wrapXOFConstructorWithOpts((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === undefined ? outputLen : opts.dkLen, true));
const shake128 = /* @__PURE__ */ (/* unused pure expression or super */ null && (genShake(0x1f, 168, 128 / 8)));
const shake256 = /* @__PURE__ */ (/* unused pure expression or super */ null && (genShake(0x1f, 136, 256 / 8)));
//# sourceMappingURL=sha3.js.map
;// ./node_modules/ethers/lib.esm/_version.js
/* Do NOT modify this file; see /src.ts/_admin/update-version.ts */
/**
 *  The current version of Ethers.
 */
const version = "6.15.0";
//# sourceMappingURL=_version.js.map
;// ./node_modules/ethers/lib.esm/utils/properties.js
/**
 *  Property helper functions.
 *
 *  @_subsection api/utils:Properties  [about-properties]
 */
function checkType(value, type, name) {
    const types = type.split("|").map(t => t.trim());
    for (let i = 0; i < types.length; i++) {
        switch (type) {
            case "any":
                return;
            case "bigint":
            case "boolean":
            case "number":
            case "string":
                if (typeof (value) === type) {
                    return;
                }
        }
    }
    const error = new Error(`invalid value for type ${type}`);
    error.code = "INVALID_ARGUMENT";
    error.argument = `value.${name}`;
    error.value = value;
    throw error;
}
/**
 *  Resolves to a new object that is a copy of %%value%%, but with all
 *  values resolved.
 */
async function resolveProperties(value) {
    const keys = Object.keys(value);
    const results = await Promise.all(keys.map((k) => Promise.resolve(value[k])));
    return results.reduce((accum, v, index) => {
        accum[keys[index]] = v;
        return accum;
    }, {});
}
/**
 *  Assigns the %%values%% to %%target%% as read-only values.
 *
 *  It %%types%% is specified, the values are checked.
 */
function defineProperties(target, values, types) {
    for (let key in values) {
        let value = values[key];
        const type = (types ? types[key] : null);
        if (type) {
            checkType(value, type, key);
        }
        Object.defineProperty(target, key, { enumerable: true, value, writable: false });
    }
}
//# sourceMappingURL=properties.js.map
;// ./node_modules/ethers/lib.esm/utils/errors.js
/**
 *  All errors in ethers include properties to ensure they are both
 *  human-readable (i.e. ``.message``) and machine-readable (i.e. ``.code``).
 *
 *  The [[isError]] function can be used to check the error ``code`` and
 *  provide a type guard for the properties present on that error interface.
 *
 *  @_section: api/utils/errors:Errors  [about-errors]
 */


function errors_stringify(value, seen) {
    if (value == null) {
        return "null";
    }
    if (seen == null) {
        seen = new Set();
    }
    if (typeof (value) === "object") {
        if (seen.has(value)) {
            return "[Circular]";
        }
        seen.add(value);
    }
    if (Array.isArray(value)) {
        return "[ " + (value.map((v) => errors_stringify(v, seen))).join(", ") + " ]";
    }
    if (value instanceof Uint8Array) {
        const HEX = "0123456789abcdef";
        let result = "0x";
        for (let i = 0; i < value.length; i++) {
            result += HEX[value[i] >> 4];
            result += HEX[value[i] & 0xf];
        }
        return result;
    }
    if (typeof (value) === "object" && typeof (value.toJSON) === "function") {
        return errors_stringify(value.toJSON(), seen);
    }
    switch (typeof (value)) {
        case "boolean":
        case "number":
        case "symbol":
            return value.toString();
        case "bigint":
            return BigInt(value).toString();
        case "string":
            return JSON.stringify(value);
        case "object": {
            const keys = Object.keys(value);
            keys.sort();
            return "{ " + keys.map((k) => `${errors_stringify(k, seen)}: ${errors_stringify(value[k], seen)}`).join(", ") + " }";
        }
    }
    return `[ COULD NOT SERIALIZE ]`;
}
/**
 *  Returns true if the %%error%% matches an error thrown by ethers
 *  that matches the error %%code%%.
 *
 *  In TypeScript environments, this can be used to check that %%error%%
 *  matches an EthersError type, which means the expected properties will
 *  be set.
 *
 *  @See [ErrorCodes](api:ErrorCode)
 *  @example
 *    try {
 *      // code....
 *    } catch (e) {
 *      if (isError(e, "CALL_EXCEPTION")) {
 *          // The Type Guard has validated this object
 *          console.log(e.data);
 *      }
 *    }
 */
function isError(error, code) {
    return (error && error.code === code);
}
/**
 *  Returns true if %%error%% is a [[CallExceptionError].
 */
function isCallException(error) {
    return isError(error, "CALL_EXCEPTION");
}
/**
 *  Returns a new Error configured to the format ethers emits errors, with
 *  the %%message%%, [[api:ErrorCode]] %%code%% and additional properties
 *  for the corresponding EthersError.
 *
 *  Each error in ethers includes the version of ethers, a
 *  machine-readable [[ErrorCode]], and depending on %%code%%, additional
 *  required properties. The error message will also include the %%message%%,
 *  ethers version, %%code%% and all additional properties, serialized.
 */
function makeError(message, code, info) {
    let shortMessage = message;
    {
        const details = [];
        if (info) {
            if ("message" in info || "code" in info || "name" in info) {
                throw new Error(`value will overwrite populated values: ${errors_stringify(info)}`);
            }
            for (const key in info) {
                if (key === "shortMessage") {
                    continue;
                }
                const value = (info[key]);
                //                try {
                details.push(key + "=" + errors_stringify(value));
                //                } catch (error: any) {
                //                console.log("MMM", error.message);
                //                    details.push(key + "=[could not serialize object]");
                //                }
            }
        }
        details.push(`code=${code}`);
        details.push(`version=${version}`);
        if (details.length) {
            message += " (" + details.join(", ") + ")";
        }
    }
    let error;
    switch (code) {
        case "INVALID_ARGUMENT":
            error = new TypeError(message);
            break;
        case "NUMERIC_FAULT":
        case "BUFFER_OVERRUN":
            error = new RangeError(message);
            break;
        default:
            error = new Error(message);
    }
    defineProperties(error, { code });
    if (info) {
        Object.assign(error, info);
    }
    if (error.shortMessage == null) {
        defineProperties(error, { shortMessage });
    }
    return error;
}
/**
 *  Throws an EthersError with %%message%%, %%code%% and additional error
 *  %%info%% when %%check%% is falsish..
 *
 *  @see [[api:makeError]]
 */
function errors_assert(check, message, code, info) {
    if (!check) {
        throw makeError(message, code, info);
    }
}
/**
 *  A simple helper to simply ensuring provided arguments match expected
 *  constraints, throwing if not.
 *
 *  In TypeScript environments, the %%check%% has been asserted true, so
 *  any further code does not need additional compile-time checks.
 */
function assertArgument(check, message, name, value) {
    errors_assert(check, message, "INVALID_ARGUMENT", { argument: name, value: value });
}
function assertArgumentCount(count, expectedCount, message) {
    if (message == null) {
        message = "";
    }
    if (message) {
        message = ": " + message;
    }
    errors_assert(count >= expectedCount, "missing argument" + message, "MISSING_ARGUMENT", {
        count: count,
        expectedCount: expectedCount
    });
    errors_assert(count <= expectedCount, "too many arguments" + message, "UNEXPECTED_ARGUMENT", {
        count: count,
        expectedCount: expectedCount
    });
}
const _normalizeForms = ["NFD", "NFC", "NFKD", "NFKC"].reduce((accum, form) => {
    try {
        // General test for normalize
        /* c8 ignore start */
        if ("test".normalize(form) !== "test") {
            throw new Error("bad");
        }
        ;
        /* c8 ignore stop */
        if (form === "NFD") {
            const check = String.fromCharCode(0xe9).normalize("NFD");
            const expected = String.fromCharCode(0x65, 0x0301);
            /* c8 ignore start */
            if (check !== expected) {
                throw new Error("broken");
            }
            /* c8 ignore stop */
        }
        accum.push(form);
    }
    catch (error) { }
    return accum;
}, []);
/**
 *  Throws if the normalization %%form%% is not supported.
 */
function assertNormalize(form) {
    errors_assert(_normalizeForms.indexOf(form) >= 0, "platform missing String.prototype.normalize", "UNSUPPORTED_OPERATION", {
        operation: "String.prototype.normalize", info: { form }
    });
}
/**
 *  Many classes use file-scoped values to guard the constructor,
 *  making it effectively private. This facilitates that pattern
 *  by ensuring the %%givenGaurd%% matches the file-scoped %%guard%%,
 *  throwing if not, indicating the %%className%% if provided.
 */
function assertPrivate(givenGuard, guard, className) {
    if (className == null) {
        className = "";
    }
    if (givenGuard !== guard) {
        let method = className, operation = "new";
        if (className) {
            method += ".";
            operation += " " + className;
        }
        errors_assert(false, `private constructor; use ${method}from* methods`, "UNSUPPORTED_OPERATION", {
            operation
        });
    }
}
//# sourceMappingURL=errors.js.map
;// ./node_modules/ethers/lib.esm/utils/data.js
/**
 *  Some data helpers.
 *
 *
 *  @_subsection api/utils:Data Helpers  [about-data]
 */

function _getBytes(value, name, copy) {
    if (value instanceof Uint8Array) {
        if (copy) {
            return new Uint8Array(value);
        }
        return value;
    }
    if (typeof (value) === "string" && value.match(/^0x(?:[0-9a-f][0-9a-f])*$/i)) {
        const result = new Uint8Array((value.length - 2) / 2);
        let offset = 2;
        for (let i = 0; i < result.length; i++) {
            result[i] = parseInt(value.substring(offset, offset + 2), 16);
            offset += 2;
        }
        return result;
    }
    assertArgument(false, "invalid BytesLike value", name || "value", value);
}
/**
 *  Get a typed Uint8Array for %%value%%. If already a Uint8Array
 *  the original %%value%% is returned; if a copy is required use
 *  [[getBytesCopy]].
 *
 *  @see: getBytesCopy
 */
function data_getBytes(value, name) {
    return _getBytes(value, name, false);
}
/**
 *  Get a typed Uint8Array for %%value%%, creating a copy if necessary
 *  to prevent any modifications of the returned value from being
 *  reflected elsewhere.
 *
 *  @see: getBytes
 */
function getBytesCopy(value, name) {
    return _getBytes(value, name, true);
}
/**
 *  Returns true if %%value%% is a valid [[HexString]].
 *
 *  If %%length%% is ``true`` or a //number//, it also checks that
 *  %%value%% is a valid [[DataHexString]] of %%length%% (if a //number//)
 *  bytes of data (e.g. ``0x1234`` is 2 bytes).
 */
function isHexString(value, length) {
    if (typeof (value) !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
        return false;
    }
    if (typeof (length) === "number" && value.length !== 2 + 2 * length) {
        return false;
    }
    if (length === true && (value.length % 2) !== 0) {
        return false;
    }
    return true;
}
/**
 *  Returns true if %%value%% is a valid representation of arbitrary
 *  data (i.e. a valid [[DataHexString]] or a Uint8Array).
 */
function isBytesLike(value) {
    return (isHexString(value, true) || (value instanceof Uint8Array));
}
const HexCharacters = "0123456789abcdef";
/**
 *  Returns a [[DataHexString]] representation of %%data%%.
 */
function hexlify(data) {
    const bytes = data_getBytes(data);
    let result = "0x";
    for (let i = 0; i < bytes.length; i++) {
        const v = bytes[i];
        result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f];
    }
    return result;
}
/**
 *  Returns a [[DataHexString]] by concatenating all values
 *  within %%data%%.
 */
function concat(datas) {
    return "0x" + datas.map((d) => hexlify(d).substring(2)).join("");
}
/**
 *  Returns the length of %%data%%, in bytes.
 */
function dataLength(data) {
    if (isHexString(data, true)) {
        return (data.length - 2) / 2;
    }
    return data_getBytes(data).length;
}
/**
 *  Returns a [[DataHexString]] by slicing %%data%% from the %%start%%
 *  offset to the %%end%% offset.
 *
 *  By default %%start%% is 0 and %%end%% is the length of %%data%%.
 */
function dataSlice(data, start, end) {
    const bytes = data_getBytes(data);
    if (end != null && end > bytes.length) {
        assert(false, "cannot slice beyond data bounds", "BUFFER_OVERRUN", {
            buffer: bytes, length: bytes.length, offset: end
        });
    }
    return hexlify(bytes.slice((start == null) ? 0 : start, (end == null) ? bytes.length : end));
}
/**
 *  Return the [[DataHexString]] result by stripping all **leading**
 ** zero bytes from %%data%%.
 */
function stripZerosLeft(data) {
    let bytes = hexlify(data).substring(2);
    while (bytes.startsWith("00")) {
        bytes = bytes.substring(2);
    }
    return "0x" + bytes;
}
function zeroPad(data, length, left) {
    const bytes = data_getBytes(data);
    assert(length >= bytes.length, "padding exceeds data length", "BUFFER_OVERRUN", {
        buffer: new Uint8Array(bytes),
        length: length,
        offset: length + 1
    });
    const result = new Uint8Array(length);
    result.fill(0);
    if (left) {
        result.set(bytes, length - bytes.length);
    }
    else {
        result.set(bytes, 0);
    }
    return hexlify(result);
}
/**
 *  Return the [[DataHexString]] of %%data%% padded on the **left**
 *  to %%length%% bytes.
 *
 *  If %%data%% already exceeds %%length%%, a [[BufferOverrunError]] is
 *  thrown.
 *
 *  This pads data the same as **values** are in Solidity
 *  (e.g. ``uint128``).
 */
function zeroPadValue(data, length) {
    return zeroPad(data, length, true);
}
/**
 *  Return the [[DataHexString]] of %%data%% padded on the **right**
 *  to %%length%% bytes.
 *
 *  If %%data%% already exceeds %%length%%, a [[BufferOverrunError]] is
 *  thrown.
 *
 *  This pads data the same as **bytes** are in Solidity
 *  (e.g. ``bytes16``).
 */
function zeroPadBytes(data, length) {
    return zeroPad(data, length, false);
}
//# sourceMappingURL=data.js.map
;// ./node_modules/ethers/lib.esm/crypto/keccak.js
/**
 *  Cryptographic hashing functions
 *
 *  @_subsection: api/crypto:Hash Functions [about-crypto-hashing]
 */


let locked = false;
const _keccak256 = function (data) {
    return keccak_256(data);
};
let __keccak256 = _keccak256;
/**
 *  Compute the cryptographic KECCAK256 hash of %%data%%.
 *
 *  The %%data%% **must** be a data representation, to compute the
 *  hash of UTF-8 data use the [[id]] function.
 *
 *  @returns DataHexstring
 *  @example:
 *    keccak256("0x")
 *    //_result:
 *
 *    keccak256("0x1337")
 *    //_result:
 *
 *    keccak256(new Uint8Array([ 0x13, 0x37 ]))
 *    //_result:
 *
 *    // Strings are assumed to be DataHexString, otherwise it will
 *    // throw. To hash UTF-8 data, see the note above.
 *    keccak256("Hello World")
 *    //_error:
 */
function keccak256(_data) {
    const data = data_getBytes(_data, "data");
    return hexlify(__keccak256(data));
}
keccak256._ = _keccak256;
keccak256.lock = function () { locked = true; };
keccak256.register = function (func) {
    if (locked) {
        throw new TypeError("keccak256 is locked");
    }
    __keccak256 = func;
};
Object.freeze(keccak256);
//# sourceMappingURL=keccak.js.map
;// ./node_modules/ethers/lib.esm/utils/utf8.js
/**
 *  Using strings in Ethereum (or any security-basd system) requires
 *  additional care. These utilities attempt to mitigate some of the
 *  safety issues as well as provide the ability to recover and analyse
 *  strings.
 *
 *  @_subsection api/utils:Strings and UTF-8  [about-strings]
 */


function errorFunc(reason, offset, bytes, output, badCodepoint) {
    assertArgument(false, `invalid codepoint at offset ${offset}; ${reason}`, "bytes", bytes);
}
function ignoreFunc(reason, offset, bytes, output, badCodepoint) {
    // If there is an invalid prefix (including stray continuation), skip any additional continuation bytes
    if (reason === "BAD_PREFIX" || reason === "UNEXPECTED_CONTINUE") {
        let i = 0;
        for (let o = offset + 1; o < bytes.length; o++) {
            if (bytes[o] >> 6 !== 0x02) {
                break;
            }
            i++;
        }
        return i;
    }
    // This byte runs us past the end of the string, so just jump to the end
    // (but the first byte was read already read and therefore skipped)
    if (reason === "OVERRUN") {
        return bytes.length - offset - 1;
    }
    // Nothing to skip
    return 0;
}
function replaceFunc(reason, offset, bytes, output, badCodepoint) {
    // Overlong representations are otherwise "valid" code points; just non-deistingtished
    if (reason === "OVERLONG") {
        assertArgument(typeof (badCodepoint) === "number", "invalid bad code point for replacement", "badCodepoint", badCodepoint);
        output.push(badCodepoint);
        return 0;
    }
    // Put the replacement character into the output
    output.push(0xfffd);
    // Otherwise, process as if ignoring errors
    return ignoreFunc(reason, offset, bytes, output, badCodepoint);
}
/**
 *  A handful of popular, built-in UTF-8 error handling strategies.
 *
 *  **``"error"``** - throws on ANY illegal UTF-8 sequence or
 *  non-canonical (overlong) codepoints (this is the default)
 *
 *  **``"ignore"``** - silently drops any illegal UTF-8 sequence
 *  and accepts non-canonical (overlong) codepoints
 *
 *  **``"replace"``** - replace any illegal UTF-8 sequence with the
 *  UTF-8 replacement character (i.e. ``"\\ufffd"``) and accepts
 *  non-canonical (overlong) codepoints
 *
 *  @returns: Record<"error" | "ignore" | "replace", Utf8ErrorFunc>
 */
const Utf8ErrorFuncs = Object.freeze({
    error: errorFunc,
    ignore: ignoreFunc,
    replace: replaceFunc
});
// http://stackoverflow.com/questions/13356493/decode-utf-8-with-javascript#13691499
function getUtf8CodePoints(_bytes, onError) {
    if (onError == null) {
        onError = Utf8ErrorFuncs.error;
    }
    const bytes = getBytes(_bytes, "bytes");
    const result = [];
    let i = 0;
    // Invalid bytes are ignored
    while (i < bytes.length) {
        const c = bytes[i++];
        // 0xxx xxxx
        if (c >> 7 === 0) {
            result.push(c);
            continue;
        }
        // Multibyte; how many bytes left for this character?
        let extraLength = null;
        let overlongMask = null;
        // 110x xxxx 10xx xxxx
        if ((c & 0xe0) === 0xc0) {
            extraLength = 1;
            overlongMask = 0x7f;
            // 1110 xxxx 10xx xxxx 10xx xxxx
        }
        else if ((c & 0xf0) === 0xe0) {
            extraLength = 2;
            overlongMask = 0x7ff;
            // 1111 0xxx 10xx xxxx 10xx xxxx 10xx xxxx
        }
        else if ((c & 0xf8) === 0xf0) {
            extraLength = 3;
            overlongMask = 0xffff;
        }
        else {
            if ((c & 0xc0) === 0x80) {
                i += onError("UNEXPECTED_CONTINUE", i - 1, bytes, result);
            }
            else {
                i += onError("BAD_PREFIX", i - 1, bytes, result);
            }
            continue;
        }
        // Do we have enough bytes in our data?
        if (i - 1 + extraLength >= bytes.length) {
            i += onError("OVERRUN", i - 1, bytes, result);
            continue;
        }
        // Remove the length prefix from the char
        let res = c & ((1 << (8 - extraLength - 1)) - 1);
        for (let j = 0; j < extraLength; j++) {
            let nextChar = bytes[i];
            // Invalid continuation byte
            if ((nextChar & 0xc0) != 0x80) {
                i += onError("MISSING_CONTINUE", i, bytes, result);
                res = null;
                break;
            }
            ;
            res = (res << 6) | (nextChar & 0x3f);
            i++;
        }
        // See above loop for invalid continuation byte
        if (res === null) {
            continue;
        }
        // Maximum code point
        if (res > 0x10ffff) {
            i += onError("OUT_OF_RANGE", i - 1 - extraLength, bytes, result, res);
            continue;
        }
        // Reserved for UTF-16 surrogate halves
        if (res >= 0xd800 && res <= 0xdfff) {
            i += onError("UTF16_SURROGATE", i - 1 - extraLength, bytes, result, res);
            continue;
        }
        // Check for overlong sequences (more bytes than needed)
        if (res <= overlongMask) {
            i += onError("OVERLONG", i - 1 - extraLength, bytes, result, res);
            continue;
        }
        result.push(res);
    }
    return result;
}
// http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
/**
 *  Returns the UTF-8 byte representation of %%str%%.
 *
 *  If %%form%% is specified, the string is normalized.
 */
function toUtf8Bytes(str, form) {
    assertArgument(typeof (str) === "string", "invalid string value", "str", str);
    if (form != null) {
        assertNormalize(form);
        str = str.normalize(form);
    }
    let result = [];
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c < 0x80) {
            result.push(c);
        }
        else if (c < 0x800) {
            result.push((c >> 6) | 0xc0);
            result.push((c & 0x3f) | 0x80);
        }
        else if ((c & 0xfc00) == 0xd800) {
            i++;
            const c2 = str.charCodeAt(i);
            assertArgument(i < str.length && ((c2 & 0xfc00) === 0xdc00), "invalid surrogate pair", "str", str);
            // Surrogate Pair
            const pair = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
            result.push((pair >> 18) | 0xf0);
            result.push(((pair >> 12) & 0x3f) | 0x80);
            result.push(((pair >> 6) & 0x3f) | 0x80);
            result.push((pair & 0x3f) | 0x80);
        }
        else {
            result.push((c >> 12) | 0xe0);
            result.push(((c >> 6) & 0x3f) | 0x80);
            result.push((c & 0x3f) | 0x80);
        }
    }
    return new Uint8Array(result);
}
;
//export 
function _toUtf8String(codePoints) {
    return codePoints.map((codePoint) => {
        if (codePoint <= 0xffff) {
            return String.fromCharCode(codePoint);
        }
        codePoint -= 0x10000;
        return String.fromCharCode((((codePoint >> 10) & 0x3ff) + 0xd800), ((codePoint & 0x3ff) + 0xdc00));
    }).join("");
}
/**
 *  Returns the string represented by the UTF-8 data %%bytes%%.
 *
 *  When %%onError%% function is specified, it is called on UTF-8
 *  errors allowing recovery using the [[Utf8ErrorFunc]] API.
 *  (default: [error](Utf8ErrorFuncs))
 */
function toUtf8String(bytes, onError) {
    return _toUtf8String(getUtf8CodePoints(bytes, onError));
}
/**
 *  Returns the UTF-8 code-points for %%str%%.
 *
 *  If %%form%% is specified, the string is normalized.
 */
function toUtf8CodePoints(str, form) {
    return getUtf8CodePoints(toUtf8Bytes(str, form));
}
//# sourceMappingURL=utf8.js.map
// EXTERNAL MODULE: ./node_modules/json-stable-stringify/index.js
var json_stable_stringify = __webpack_require__(5473);
var json_stable_stringify_default = /*#__PURE__*/__webpack_require__.n(json_stable_stringify);
;// ./src/popup.js
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// Import dependencies


// Note: Semaphore libraries removed for browser compatibility

// Dashboard-enhanced popup script for Order History Extension
var currentOrders = [];
var filteredOrders = [];
var currentView = 'status';
var orderToDelete = null;
document.addEventListener('DOMContentLoaded', function () {
  initializePopup();
  loadStoredOrders();
  setupEventListeners();
  checkAmazonStatus();
});

// Initialize popup interface
function initializePopup() {
  var statusView = document.getElementById('status-view');
  var dashboardView = document.getElementById('dashboard-view');

  // Ensure status view is shown by default
  statusView.style.display = 'block';
  dashboardView.style.display = 'none';
  currentView = 'status';
}

// Setup all event listeners
function setupEventListeners() {
  // Navigation buttons
  document.getElementById('dashboard-btn').addEventListener('click', showDashboard);
  document.getElementById('back-btn').addEventListener('click', showStatus);

  // Dashboard functionality
  document.getElementById('search-input').addEventListener('input', handleSearch);
  document.getElementById('sort-select').addEventListener('change', handleSort);
  document.getElementById('export-btn').addEventListener('click', exportData);
  document.getElementById('clear-all-btn').addEventListener('click', showClearAllModal);

  // Modal handlers
  document.getElementById('cancel-delete').addEventListener('click', hideDeletionModal);
  document.getElementById('confirm-delete').addEventListener('click', confirmDelete);
  document.getElementById('cancel-clear').addEventListener('click', hideClearModal);
  document.getElementById('confirm-clear').addEventListener('click', confirmClearAll);
}

// Enhanced data processing with ethers and json-stable-stringify
function processOrdersWithCrypto(orders) {
  // Use json-stable-stringify for consistent serialization
  var stableStringified = json_stable_stringify_default()(orders);
  console.log('Stable stringified orders for popup:', stableStringified);

  // Example of using ethers for data integrity
  var hash = keccak256(toUtf8Bytes(stableStringified));
  console.log('Orders hash:', hash);
  return {
    orders: orders,
    hash: hash,
    timestamp: new Date().toISOString()
  };
}

// Generate object hash using the same logic as objectHashBytes32 from claim-and-prove.ts
function generateObjectHash(obj) {
  var canonical = stringify(obj, {
    space: 0
  });
  return ethers.keccak256(ethers.toUtf8Bytes(canonical));
}

// Check Amazon status and update UI
function checkAmazonStatus() {
  var statusElement = document.getElementById('status');
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    var currentTab = tabs[0];
    if (currentTab.url && currentTab.url.includes('amazon.in')) {
      statusElement.textContent = 'Amazon detected - Extension active';
      statusElement.style.color = '#28a745';
      document.getElementById('dashboard-btn').style.display = 'block';
    } else {
      statusElement.textContent = 'Please visit Amazon.in to use this extension';
      statusElement.style.color = '#dc3545';
      document.getElementById('dashboard-btn').style.display = 'none';
    }
  });
}

// Show dashboard view
function showDashboard() {
  document.getElementById('status-view').style.display = 'none';
  document.getElementById('dashboard-view').style.display = 'block';
  currentView = 'dashboard';
  loadStoredOrders();
  renderOrders();
}

// Show status view
function showStatus() {
  document.getElementById('dashboard-view').style.display = 'none';
  document.getElementById('status-view').style.display = 'block';
  currentView = 'status';
  checkAmazonStatus();
}

// Load orders from storage
function loadStoredOrders() {
  chrome.storage.local.get(['amazonOrders', 'newOrdersAdded', 'lastOrderUpdate'], function (result) {
    console.log('Loading orders from storage:', result);
    currentOrders = result.amazonOrders || [];
    filteredOrders = _toConsumableArray(currentOrders);
    console.log('Loaded orders:', currentOrders.length, 'orders');

    // Check if new orders were added since last check
    if (result.newOrdersAdded) {
      console.log('New orders detected, refreshing dashboard');
      chrome.storage.local.set({
        newOrdersAdded: false
      }); // Clear the flag
    }
    updateOrderCount();
    updateDashboard();
  });
}

// Update order count display
function updateOrderCount() {
  var countElement = document.getElementById('order-count');
  if (countElement) {
    countElement.textContent = "".concat(filteredOrders.length, " orders");
  }
}

// Render orders in the dashboard
function renderOrders() {
  var ordersContainer = document.getElementById('orders-container');
  if (!ordersContainer) return;
  if (filteredOrders.length === 0) {
    ordersContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No orders found</p>';
    return;
  }
  var ordersHTML = filteredOrders.map(function (order) {
    return "\n        <div class=\"order-item\" data-order-id=\"".concat(order.id, "\">\n            <div class=\"order-header\">\n                <span class=\"order-date\">").concat(order.dateOrdered, "</span>\n                <span class=\"order-total\">\u20B9").concat(order.total, "</span>\n            </div>\n            <div class=\"order-details\">\n                <div class=\"order-id\">Order #").concat(order.id, "</div>\n                <div class=\"order-status\">").concat(order.status, "</div>\n            </div>\n            <div class=\"order-actions\">\n                <button class=\"delete-btn\" onclick=\"deleteOrder('").concat(order.id, "')\">Delete</button>\n            </div>\n        </div>\n    ");
  }).join('');
  ordersContainer.innerHTML = ordersHTML;
  updateOrderCount();
}

// Handle search
function handleSearch(event) {
  var searchTerm = event.target.value.toLowerCase();
  filteredOrders = currentOrders.filter(function (order) {
    return order.id.toLowerCase().includes(searchTerm) || order.status.toLowerCase().includes(searchTerm) || order.items.some(function (item) {
      return item.name.toLowerCase().includes(searchTerm);
    });
  });
  renderOrders();
}

// Handle sorting
function handleSort(event) {
  var sortBy = event.target.value;
  switch (sortBy) {
    case 'date-newest':
      filteredOrders.sort(function (a, b) {
        return new Date(b.dateOrdered) - new Date(a.dateOrdered);
      });
      break;
    case 'date-oldest':
      filteredOrders.sort(function (a, b) {
        return new Date(a.dateOrdered) - new Date(b.dateOrdered);
      });
      break;
    case 'amount-high':
      filteredOrders.sort(function (a, b) {
        return parseFloat(b.total) - parseFloat(a.total);
      });
      break;
    case 'amount-low':
      filteredOrders.sort(function (a, b) {
        return parseFloat(a.total) - parseFloat(b.total);
      });
      break;
  }
  renderOrders();
}

// Export data with crypto processing
function exportData() {
  if (filteredOrders.length === 0) {
    alert('No orders to export');
    return;
  }

  // Process orders with crypto functions
  var processedData = processOrdersWithCrypto(filteredOrders);
  var dataStr = JSON.stringify(processedData, null, 2);
  var dataBlob = new Blob([dataStr], {
    type: 'application/json'
  });
  var url = URL.createObjectURL(dataBlob);
  var link = document.createElement('a');
  link.href = url;
  link.download = "amazon-orders-".concat(new Date().toISOString().split('T')[0], ".json");
  link.click();
  URL.revokeObjectURL(url);
}

// Delete order
function deleteOrder(orderId) {
  orderToDelete = orderId;
  document.getElementById('deletion-modal').style.display = 'block';
}

// Confirm delete
function confirmDelete() {
  if (orderToDelete) {
    currentOrders = currentOrders.filter(function (order) {
      return order.id !== orderToDelete;
    });
    filteredOrders = filteredOrders.filter(function (order) {
      return order.id !== orderToDelete;
    });
    chrome.storage.local.set({
      extractedOrders: currentOrders
    });
    renderOrders();
    hideDeletionModal();
  }
}

// Hide deletion modal
function hideDeletionModal() {
  document.getElementById('deletion-modal').style.display = 'none';
  orderToDelete = null;
}

// Show clear all modal
function showClearAllModal() {
  document.getElementById('clear-modal').style.display = 'block';
}

// Confirm clear all
function confirmClearAll() {
  currentOrders = [];
  filteredOrders = [];
  chrome.storage.local.remove(['extractedOrders']);
  renderOrders();
  hideClearModal();
}

// Hide clear modal
function hideClearModal() {
  document.getElementById('clear-modal').style.display = 'none';
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('Popup received message:', message.type, message);
  if (message.type === 'statusUpdate') {
    document.getElementById('status').textContent = message.status;
  }
  if (message.type === 'ordersExtracted') {
    console.log('Processing new orders:', message.orders);
    var newOrders = message.orders || [];
    var existingIds = new Set(currentOrders.map(function (o) {
      return o.id;
    }));
    var uniqueNewOrders = newOrders.filter(function (order) {
      if (!order.id) {
        var baseString = "".concat(order.itemName, "_").concat(order.dateOrdered, "_").concat(order.amazonLink || '', "_").concat(order.price || '');
        order.id = btoa(baseString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
      }
      return !existingIds.has(order.id);
    });
    if (uniqueNewOrders.length > 0) {
      var _currentOrders;
      console.log('Adding new orders to popup:', uniqueNewOrders.length, 'orders');
      (_currentOrders = currentOrders).push.apply(_currentOrders, _toConsumableArray(uniqueNewOrders));
      filteredOrders = _toConsumableArray(currentOrders);
      chrome.storage.local.set({
        amazonOrders: currentOrders
      });
      if (currentView === 'dashboard') {
        renderOrders();
      }
    }
  }
});

// Test function to add sample orders (for debugging)
window.addTestOrders = function () {
  var testOrders = [{
    id: 'test1',
    itemName: 'Test Product 1',
    amazonLink: 'https://amazon.in/test1',
    price: '₹999',
    dateOrdered: '2024-01-15',
    returnStatus: 'Not returned'
  }, {
    id: 'test2',
    itemName: 'Test Product 2',
    amazonLink: 'https://amazon.in/test2',
    price: '₹1499',
    dateOrdered: '2024-01-20',
    returnStatus: 'Not returned'
  }];
  chrome.storage.local.set({
    amazonOrders: testOrders
  }, function () {
    console.log('Test orders added to storage');
    loadStoredOrders();
  });
};

// Test function to clear all orders (for debugging)
window.clearAllOrders = function () {
  chrome.storage.local.set({
    amazonOrders: []
  }, function () {
    console.log('All orders cleared from storage');
    loadStoredOrders();
  });
};

// Debug function to check storage status
window.debugStorage = function () {
  console.log('=== STORAGE DEBUG ===');
  chrome.storage.local.get(null, function (result) {
    console.log('All storage contents:', result);
    console.log('Amazon orders:', result.amazonOrders);
    console.log('Extracted orders:', result.extractedOrders);
    console.log('Order history:', result.orderHistory);
  });

  // Test if we can write to storage
  chrome.storage.local.set({
    testKey: 'testValue'
  }, function () {
    console.log('Test write successful');
    chrome.storage.local.get(['testKey'], function (result) {
      console.log('Test read result:', result);
    });
  });
};
})();

/******/ })()
;