/*!
 * Materialize v1.0.0 (http://materializecss.com)
 * Copyright 2014-2017 Materialize
 * MIT License (https://raw.githubusercontent.com/Dogfalo/materialize/master/LICENSE)
 */
var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*! cash-dom 1.3.5, https://github.com/kenwheeler/cash @license MIT */
(function (factory) {
  window.cash = factory();
})(function () {
  var doc = document,
      win = window,
      ArrayProto = Array.prototype,
      slice = ArrayProto.slice,
      filter = ArrayProto.filter,
      push = ArrayProto.push;

  var noop = function () {},
      isFunction = function (item) {
    // @see https://crbug.com/568448
    return typeof item === typeof noop && item.call;
  },
      isString = function (item) {
    return typeof item === typeof "";
  };

  var idMatch = /^#[\w-]*$/,
      classMatch = /^\.[\w-]*$/,
      htmlMatch = /<.+>/,
      singlet = /^\w+$/;

  function find(selector, context) {
    context = context || doc;
    var elems = classMatch.test(selector) ? context.getElementsByClassName(selector.slice(1)) : singlet.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector);
    return elems;
  }

  var frag;
  function parseHTML(str) {
    if (!frag) {
      frag = doc.implementation.createHTMLDocument(null);
      var base = frag.createElement("base");
      base.href = doc.location.href;
      frag.head.appendChild(base);
    }

    frag.body.innerHTML = str;

    return frag.body.childNodes;
  }

  function onReady(fn) {
    if (doc.readyState !== "loading") {
      fn();
    } else {
      doc.addEventListener("DOMContentLoaded", fn);
    }
  }

  function Init(selector, context) {
    if (!selector) {
      return this;
    }

    // If already a cash collection, don't do any further processing
    if (selector.cash && selector !== win) {
      return selector;
    }

    var elems = selector,
        i = 0,
        length;

    if (isString(selector)) {
      elems = idMatch.test(selector) ?
      // If an ID use the faster getElementById check
      doc.getElementById(selector.slice(1)) : htmlMatch.test(selector) ?
      // If HTML, parse it into real elements
      parseHTML(selector) :
      // else use `find`
      find(selector, context);

      // If function, use as shortcut for DOM ready
    } else if (isFunction(selector)) {
      onReady(selector);return this;
    }

    if (!elems) {
      return this;
    }

    // If a single DOM element is passed in or received via ID, return the single element
    if (elems.nodeType || elems === win) {
      this[0] = elems;
      this.length = 1;
    } else {
      // Treat like an array and loop through each item.
      length = this.length = elems.length;
      for (; i < length; i++) {
        this[i] = elems[i];
      }
    }

    return this;
  }

  function cash(selector, context) {
    return new Init(selector, context);
  }

  var fn = cash.fn = cash.prototype = Init.prototype = { // jshint ignore:line
    cash: true,
    length: 0,
    push: push,
    splice: ArrayProto.splice,
    map: ArrayProto.map,
    init: Init
  };

  Object.defineProperty(fn, "constructor", { value: cash });

  cash.parseHTML = parseHTML;
  cash.noop = noop;
  cash.isFunction = isFunction;
  cash.isString = isString;

  cash.extend = fn.extend = function (target) {
    target = target || {};

    var args = slice.call(arguments),
        length = args.length,
        i = 1;

    if (args.length === 1) {
      target = this;
      i = 0;
    }

    for (; i < length; i++) {
      if (!args[i]) {
        continue;
      }
      for (var key in args[i]) {
        if (args[i].hasOwnProperty(key)) {
          target[key] = args[i][key];
        }
      }
    }

    return target;
  };

  function each(collection, callback) {
    var l = collection.length,
        i = 0;

    for (; i < l; i++) {
      if (callback.call(collection[i], collection[i], i, collection) === false) {
        break;
      }
    }
  }

  function matches(el, selector) {
    var m = el && (el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector);
    return !!m && m.call(el, selector);
  }

  function getCompareFunction(selector) {
    return (
      /* Use browser's `matches` function if string */
      isString(selector) ? matches :
      /* Match a cash element */
      selector.cash ? function (el) {
        return selector.is(el);
      } :
      /* Direct comparison */
      function (el, selector) {
        return el === selector;
      }
    );
  }

  function unique(collection) {
    return cash(slice.call(collection).filter(function (item, index, self) {
      return self.indexOf(item) === index;
    }));
  }

  cash.extend({
    merge: function (first, second) {
      var len = +second.length,
          i = first.length,
          j = 0;

      for (; j < len; i++, j++) {
        first[i] = second[j];
      }

      first.length = i;
      return first;
    },

    each: each,
    matches: matches,
    unique: unique,
    isArray: Array.isArray,
    isNumeric: function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

  });

  var uid = cash.uid = "_cash" + Date.now();

  function getDataCache(node) {
    return node[uid] = node[uid] || {};
  }

  function setData(node, key, value) {
    return getDataCache(node)[key] = value;
  }

  function getData(node, key) {
    var c = getDataCache(node);
    if (c[key] === undefined) {
      c[key] = node.dataset ? node.dataset[key] : cash(node).attr("data-" + key);
    }
    return c[key];
  }

  function removeData(node, key) {
    var c = getDataCache(node);
    if (c) {
      delete c[key];
    } else if (node.dataset) {
      delete node.dataset[key];
    } else {
      cash(node).removeAttr("data-" + name);
    }
  }

  fn.extend({
    data: function (name, value) {
      if (isString(name)) {
        return value === undefined ? getData(this[0], name) : this.each(function (v) {
          return setData(v, name, value);
        });
      }

      for (var key in name) {
        this.data(key, name[key]);
      }

      return this;
    },

    removeData: function (key) {
      return this.each(function (v) {
        return removeData(v, key);
      });
    }

  });

  var notWhiteMatch = /\S+/g;

  function getClasses(c) {
    return isString(c) && c.match(notWhiteMatch);
  }

  function hasClass(v, c) {
    return v.classList ? v.classList.contains(c) : new RegExp("(^| )" + c + "( |$)", "gi").test(v.className);
  }

  function addClass(v, c, spacedName) {
    if (v.classList) {
      v.classList.add(c);
    } else if (spacedName.indexOf(" " + c + " ")) {
      v.className += " " + c;
    }
  }

  function removeClass(v, c) {
    if (v.classList) {
      v.classList.remove(c);
    } else {
      v.className = v.className.replace(c, "");
    }
  }

  fn.extend({
    addClass: function (c) {
      var classes = getClasses(c);

      return classes ? this.each(function (v) {
        var spacedName = " " + v.className + " ";
        each(classes, function (c) {
          addClass(v, c, spacedName);
        });
      }) : this;
    },

    attr: function (name, value) {
      if (!name) {
        return undefined;
      }

      if (isString(name)) {
        if (value === undefined) {
          return this[0] ? this[0].getAttribute ? this[0].getAttribute(name) : this[0][name] : undefined;
        }

        return this.each(function (v) {
          if (v.setAttribute) {
            v.setAttribute(name, value);
          } else {
            v[name] = value;
          }
        });
      }

      for (var key in name) {
        this.attr(key, name[key]);
      }

      return this;
    },

    hasClass: function (c) {
      var check = false,
          classes = getClasses(c);
      if (classes && classes.length) {
        this.each(function (v) {
          check = hasClass(v, classes[0]);
          return !check;
        });
      }
      return check;
    },

    prop: function (name, value) {
      if (isString(name)) {
        return value === undefined ? this[0][name] : this.each(function (v) {
          v[name] = value;
        });
      }

      for (var key in name) {
        this.prop(key, name[key]);
      }

      return this;
    },

    removeAttr: function (name) {
      return this.each(function (v) {
        if (v.removeAttribute) {
          v.removeAttribute(name);
        } else {
          delete v[name];
        }
      });
    },

    removeClass: function (c) {
      if (!arguments.length) {
        return this.attr("class", "");
      }
      var classes = getClasses(c);
      return classes ? this.each(function (v) {
        each(classes, function (c) {
          removeClass(v, c);
        });
      }) : this;
    },

    removeProp: function (name) {
      return this.each(function (v) {
        delete v[name];
      });
    },

    toggleClass: function (c, state) {
      if (state !== undefined) {
        return this[state ? "addClass" : "removeClass"](c);
      }
      var classes = getClasses(c);
      return classes ? this.each(function (v) {
        var spacedName = " " + v.className + " ";
        each(classes, function (c) {
          if (hasClass(v, c)) {
            removeClass(v, c);
          } else {
            addClass(v, c, spacedName);
          }
        });
      }) : this;
    } });

  fn.extend({
    add: function (selector, context) {
      return unique(cash.merge(this, cash(selector, context)));
    },

    each: function (callback) {
      each(this, callback);
      return this;
    },

    eq: function (index) {
      return cash(this.get(index));
    },

    filter: function (selector) {
      if (!selector) {
        return this;
      }

      var comparator = isFunction(selector) ? selector : getCompareFunction(selector);

      return cash(filter.call(this, function (e) {
        return comparator(e, selector);
      }));
    },

    first: function () {
      return this.eq(0);
    },

    get: function (index) {
      if (index === undefined) {
        return slice.call(this);
      }
      return index < 0 ? this[index + this.length] : this[index];
    },

    index: function (elem) {
      var child = elem ? cash(elem)[0] : this[0],
          collection = elem ? this : cash(child).parent().children();
      return slice.call(collection).indexOf(child);
    },

    last: function () {
      return this.eq(-1);
    }

  });

  var camelCase = function () {
    var camelRegex = /(?:^\w|[A-Z]|\b\w)/g,
        whiteSpace = /[\s-_]+/g;
    return function (str) {
      return str.replace(camelRegex, function (letter, index) {
        return letter[index === 0 ? "toLowerCase" : "toUpperCase"]();
      }).replace(whiteSpace, "");
    };
  }();

  var getPrefixedProp = function () {
    var cache = {},
        doc = document,
        div = doc.createElement("div"),
        style = div.style;

    return function (prop) {
      prop = camelCase(prop);
      if (cache[prop]) {
        return cache[prop];
      }

      var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
          prefixes = ["webkit", "moz", "ms", "o"],
          props = (prop + " " + prefixes.join(ucProp + " ") + ucProp).split(" ");

      each(props, function (p) {
        if (p in style) {
          cache[p] = prop = cache[prop] = p;
          return false;
        }
      });

      return cache[prop];
    };
  }();

  cash.prefixedProp = getPrefixedProp;
  cash.camelCase = camelCase;

  fn.extend({
    css: function (prop, value) {
      if (isString(prop)) {
        prop = getPrefixedProp(prop);
        return arguments.length > 1 ? this.each(function (v) {
          return v.style[prop] = value;
        }) : win.getComputedStyle(this[0])[prop];
      }

      for (var key in prop) {
        this.css(key, prop[key]);
      }

      return this;
    }

  });

  function compute(el, prop) {
    return parseInt(win.getComputedStyle(el[0], null)[prop], 10) || 0;
  }

  each(["Width", "Height"], function (v) {
    var lower = v.toLowerCase();

    fn[lower] = function () {
      return this[0].getBoundingClientRect()[lower];
    };

    fn["inner" + v] = function () {
      return this[0]["client" + v];
    };

    fn["outer" + v] = function (margins) {
      return this[0]["offset" + v] + (margins ? compute(this, "margin" + (v === "Width" ? "Left" : "Top")) + compute(this, "margin" + (v === "Width" ? "Right" : "Bottom")) : 0);
    };
  });

  function registerEvent(node, eventName, callback) {
    var eventCache = getData(node, "_cashEvents") || setData(node, "_cashEvents", {});
    eventCache[eventName] = eventCache[eventName] || [];
    eventCache[eventName].push(callback);
    node.addEventListener(eventName, callback);
  }

  function removeEvent(node, eventName, callback) {
    var events = getData(node, "_cashEvents"),
        eventCache = events && events[eventName],
        index;

    if (!eventCache) {
      return;
    }

    if (callback) {
      node.removeEventListener(eventName, callback);
      index = eventCache.indexOf(callback);
      if (index >= 0) {
        eventCache.splice(index, 1);
      }
    } else {
      each(eventCache, function (event) {
        node.removeEventListener(eventName, event);
      });
      eventCache = [];
    }
  }

  fn.extend({
    off: function (eventName, callback) {
      return this.each(function (v) {
        return removeEvent(v, eventName, callback);
      });
    },

    on: function (eventName, delegate, callback, runOnce) {
      // jshint ignore:line
      var originalCallback;
      if (!isString(eventName)) {
        for (var key in eventName) {
          this.on(key, delegate, eventName[key]);
        }
        return this;
      }

      if (isFunction(delegate)) {
        callback = delegate;
        delegate = null;
      }

      if (eventName === "ready") {
        onReady(callback);
        return this;
      }

      if (delegate) {
        originalCallback = callback;
        callback = function (e) {
          var t = e.target;
          while (!matches(t, delegate)) {
            if (t === this || t === null) {
              return t = false;
            }

            t = t.parentNode;
          }

          if (t) {
            originalCallback.call(t, e);
          }
        };
      }

      return this.each(function (v) {
        var finalCallback = callback;
        if (runOnce) {
          finalCallback = function () {
            callback.apply(this, arguments);
            removeEvent(v, eventName, finalCallback);
          };
        }
        registerEvent(v, eventName, finalCallback);
      });
    },

    one: function (eventName, delegate, callback) {
      return this.on(eventName, delegate, callback, true);
    },

    ready: onReady,

    /**
     * Modified
     * Triggers browser event
     * @param String eventName
     * @param Object data - Add properties to event object
     */
    trigger: function (eventName, data) {
      if (document.createEvent) {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(eventName, true, false);
        evt = this.extend(evt, data);
        return this.each(function (v) {
          return v.dispatchEvent(evt);
        });
      }
    }

  });

  function encode(name, value) {
    return "&" + encodeURIComponent(name) + "=" + encodeURIComponent(value).replace(/%20/g, "+");
  }

  function getSelectMultiple_(el) {
    var values = [];
    each(el.options, function (o) {
      if (o.selected) {
        values.push(o.value);
      }
    });
    return values.length ? values : null;
  }

  function getSelectSingle_(el) {
    var selectedIndex = el.selectedIndex;
    return selectedIndex >= 0 ? el.options[selectedIndex].value : null;
  }

  function getValue(el) {
    var type = el.type;
    if (!type) {
      return null;
    }
    switch (type.toLowerCase()) {
      case "select-one":
        return getSelectSingle_(el);
      case "select-multiple":
        return getSelectMultiple_(el);
      case "radio":
        return el.checked ? el.value : null;
      case "checkbox":
        return el.checked ? el.value : null;
      default:
        return el.value ? el.value : null;
    }
  }

  fn.extend({
    serialize: function () {
      var query = "";

      each(this[0].elements || this, function (el) {
        if (el.disabled || el.tagName === "FIELDSET") {
          return;
        }
        var name = el.name;
        switch (el.type.toLowerCase()) {
          case "file":
          case "reset":
          case "submit":
          case "button":
            break;
          case "select-multiple":
            var values = getValue(el);
            if (values !== null) {
              each(values, function (value) {
                query += encode(name, value);
              });
            }
            break;
          default:
            var value = getValue(el);
            if (value !== null) {
              query += encode(name, value);
            }
        }
      });

      return query.substr(1);
    },

    val: function (value) {
      if (value === undefined) {
        return getValue(this[0]);
      }

      return this.each(function (v) {
        return v.value = value;
      });
    }

  });

  function insertElement(el, child, prepend) {
    if (prepend) {
      var first = el.childNodes[0];
      el.insertBefore(child, first);
    } else {
      el.appendChild(child);
    }
  }

  function insertContent(parent, child, prepend) {
    var str = isString(child);

    if (!str && child.length) {
      each(child, function (v) {
        return insertContent(parent, v, prepend);
      });
      return;
    }

    each(parent, str ? function (v) {
      return v.insertAdjacentHTML(prepend ? "afterbegin" : "beforeend", child);
    } : function (v, i) {
      return insertElement(v, i === 0 ? child : child.cloneNode(true), prepend);
    });
  }

  fn.extend({
    after: function (selector) {
      cash(selector).insertAfter(this);
      return this;
    },

    append: function (content) {
      insertContent(this, content);
      return this;
    },

    appendTo: function (parent) {
      insertContent(cash(parent), this);
      return this;
    },

    before: function (selector) {
      cash(selector).insertBefore(this);
      return this;
    },

    clone: function () {
      return cash(this.map(function (v) {
        return v.cloneNode(true);
      }));
    },

    empty: function () {
      this.html("");
      return this;
    },

    html: function (content) {
      if (content === undefined) {
        return this[0].innerHTML;
      }
      var source = content.nodeType ? content[0].outerHTML : content;
      return this.each(function (v) {
        return v.innerHTML = source;
      });
    },

    insertAfter: function (selector) {
      var _this = this;

      cash(selector).each(function (el, i) {
        var parent = el.parentNode,
            sibling = el.nextSibling;
        _this.each(function (v) {
          parent.insertBefore(i === 0 ? v : v.cloneNode(true), sibling);
        });
      });

      return this;
    },

    insertBefore: function (selector) {
      var _this2 = this;
      cash(selector).each(function (el, i) {
        var parent = el.parentNode;
        _this2.each(function (v) {
          parent.insertBefore(i === 0 ? v : v.cloneNode(true), el);
        });
      });
      return this;
    },

    prepend: function (content) {
      insertContent(this, content, true);
      return this;
    },

    prependTo: function (parent) {
      insertContent(cash(parent), this, true);
      return this;
    },

    remove: function () {
      return this.each(function (v) {
        if (!!v.parentNode) {
          return v.parentNode.removeChild(v);
        }
      });
    },

    text: function (content) {
      if (content === undefined) {
        return this[0].textContent;
      }
      return this.each(function (v) {
        return v.textContent = content;
      });
    }

  });

  var docEl = doc.documentElement;

  fn.extend({
    position: function () {
      var el = this[0];
      return {
        left: el.offsetLeft,
        top: el.offsetTop
      };
    },

    offset: function () {
      var rect = this[0].getBoundingClientRect();
      return {
        top: rect.top + win.pageYOffset - docEl.clientTop,
        left: rect.left + win.pageXOffset - docEl.clientLeft
      };
    },

    offsetParent: function () {
      return cash(this[0].offsetParent);
    }

  });

  fn.extend({
    children: function (selector) {
      var elems = [];
      this.each(function (el) {
        push.apply(elems, el.children);
      });
      elems = unique(elems);

      return !selector ? elems : elems.filter(function (v) {
        return matches(v, selector);
      });
    },

    closest: function (selector) {
      if (!selector || this.length < 1) {
        return cash();
      }
      if (this.is(selector)) {
        return this.filter(selector);
      }
      return this.parent().closest(selector);
    },

    is: function (selector) {
      if (!selector) {
        return false;
      }

      var match = false,
          comparator = getCompareFunction(selector);

      this.each(function (el) {
        match = comparator(el, selector);
        return !match;
      });

      return match;
    },

    find: function (selector) {
      if (!selector || selector.nodeType) {
        return cash(selector && this.has(selector).length ? selector : null);
      }

      var elems = [];
      this.each(function (el) {
        push.apply(elems, find(selector, el));
      });

      return unique(elems);
    },

    has: function (selector) {
      var comparator = isString(selector) ? function (el) {
        return find(selector, el).length !== 0;
      } : function (el) {
        return el.contains(selector);
      };

      return this.filter(comparator);
    },

    next: function () {
      return cash(this[0].nextElementSibling);
    },

    not: function (selector) {
      if (!selector) {
        return this;
      }

      var comparator = getCompareFunction(selector);

      return this.filter(function (el) {
        return !comparator(el, selector);
      });
    },

    parent: function () {
      var result = [];

      this.each(function (item) {
        if (item && item.parentNode) {
          result.push(item.parentNode);
        }
      });

      return unique(result);
    },

    parents: function (selector) {
      var last,
          result = [];

      this.each(function (item) {
        last = item;

        while (last && last.parentNode && last !== doc.body.parentNode) {
          last = last.parentNode;

          if (!selector || selector && matches(last, selector)) {
            result.push(last);
          }
        }
      });

      return unique(result);
    },

    prev: function () {
      return cash(this[0].previousElementSibling);
    },

    siblings: function (selector) {
      var collection = this.parent().children(selector),
          el = this[0];

      return collection.filter(function (i) {
        return i !== el;
      });
    }

  });

  return cash;
});
;
var Component = function () {
  /**
   * Generic constructor for all components
   * @constructor
   * @param {Element} el
   * @param {Object} options
   */
  function Component(classDef, el, options) {
    _classCallCheck(this, Component);

    // Display error if el is valid HTML Element
    if (!(el instanceof Element)) {
      console.error(Error(el + ' is not an HTML Element'));
    }

    // If exists, destroy and reinitialize in child
    var ins = classDef.getInstance(el);
    if (!!ins) {
      ins.destroy();
    }

    this.el = el;
    this.$el = cash(el);
  }

  /**
   * Initializes components
   * @param {class} classDef
   * @param {Element | NodeList | jQuery} els
   * @param {Object} options
   */


  _createClass(Component, null, [{
    key: "init",
    value: function init(classDef, els, options) {
      var instances = null;
      if (els instanceof Element) {
        instances = new classDef(els, options);
      } else if (!!els && (els.jquery || els.cash || els instanceof NodeList)) {
        var instancesArr = [];
        for (var i = 0; i < els.length; i++) {
          instancesArr.push(new classDef(els[i], options));
        }
        instances = instancesArr;
      }

      return instances;
    }
  }]);

  return Component;
}();

; // Required for Meteor package, the use of window prevents export by Meteor
(function (window) {
  if (window.Package) {
    M = {};
  } else {
    window.M = {};
  }

  // Check for jQuery
  M.jQueryLoaded = !!window.jQuery;
})(window);

// AMD
if (typeof define === 'function' && define.amd) {
  define('M', [], function () {
    return M;
  });

  // Common JS
} else if (typeof exports !== 'undefined' && !exports.nodeType) {
  if (typeof module !== 'undefined' && !module.nodeType && module.exports) {
    exports = module.exports = M;
  }
  exports.default = M;
}

M.version = '1.0.0';

M.keys = {
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  ARROW_UP: 38,
  ARROW_DOWN: 40
};

/**
 * TabPress Keydown handler
 */
M.tabPressed = false;
M.keyDown = false;
var docHandleKeydown = function (e) {
  M.keyDown = true;
  if (e.which === M.keys.TAB || e.which === M.keys.ARROW_DOWN || e.which === M.keys.ARROW_UP) {
    M.tabPressed = true;
  }
};
var docHandleKeyup = function (e) {
  M.keyDown = false;
  if (e.which === M.keys.TAB || e.which === M.keys.ARROW_DOWN || e.which === M.keys.ARROW_UP) {
    M.tabPressed = false;
  }
};
var docHandleFocus = function (e) {
  if (M.keyDown) {
    document.body.classList.add('keyboard-focused');
  }
};
var docHandleBlur = function (e) {
  document.body.classList.remove('keyboard-focused');
};
document.addEventListener('keydown', docHandleKeydown, true);
document.addEventListener('keyup', docHandleKeyup, true);
document.addEventListener('focus', docHandleFocus, true);
document.addEventListener('blur', docHandleBlur, true);

/**
 * Initialize jQuery wrapper for plugin
 * @param {Class} plugin  javascript class
 * @param {string} pluginName  jQuery plugin name
 * @param {string} classRef  Class reference name
 */
M.initializeJqueryWrapper = function (plugin, pluginName, classRef) {
  jQuery.fn[pluginName] = function (methodOrOptions) {
    // Call plugin method if valid method name is passed in
    if (plugin.prototype[methodOrOptions]) {
      var params = Array.prototype.slice.call(arguments, 1);

      // Getter methods
      if (methodOrOptions.slice(0, 3) === 'get') {
        var instance = this.first()[0][classRef];
        return instance[methodOrOptions].apply(instance, params);
      }

      // Void methods
      return this.each(function () {
        var instance = this[classRef];
        instance[methodOrOptions].apply(instance, params);
      });

      // Initialize plugin if options or no argument is passed in
    } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
      plugin.init(this, arguments[0]);
      return this;
    }

    // Return error if an unrecognized  method name is passed in
    jQuery.error("Method " + methodOrOptions + " does not exist on jQuery." + pluginName);
  };
};

/**
 * Automatically initialize components
 * @param {Element} context  DOM Element to search within for components
 */
M.AutoInit = function (context) {
  // Use document.body if no context is given
  var root = !!context ? context : document.body;

  var registry = {
    Autocomplete: root.querySelectorAll('.autocomplete:not(.no-autoinit)'),
    Carousel: root.querySelectorAll('.carousel:not(.no-autoinit)'),
    Chips: root.querySelectorAll('.chips:not(.no-autoinit)'),
    Collapsible: root.querySelectorAll('.collapsible:not(.no-autoinit)'),
    Datepicker: root.querySelectorAll('.datepicker:not(.no-autoinit)'),
    Dropdown: root.querySelectorAll('.dropdown-trigger:not(.no-autoinit)'),
    Materialbox: root.querySelectorAll('.materialboxed:not(.no-autoinit)'),
    Modal: root.querySelectorAll('.modal:not(.no-autoinit)'),
    Parallax: root.querySelectorAll('.parallax:not(.no-autoinit)'),
    Pushpin: root.querySelectorAll('.pushpin:not(.no-autoinit)'),
    ScrollSpy: root.querySelectorAll('.scrollspy:not(.no-autoinit)'),
    FormSelect: root.querySelectorAll('select:not(.no-autoinit)'),
    Sidenav: root.querySelectorAll('.sidenav:not(.no-autoinit)'),
    Tabs: root.querySelectorAll('.tabs:not(.no-autoinit)'),
    TapTarget: root.querySelectorAll('.tap-target:not(.no-autoinit)'),
    Timepicker: root.querySelectorAll('.timepicker:not(.no-autoinit)'),
    Tooltip: root.querySelectorAll('.tooltipped:not(.no-autoinit)'),
    FloatingActionButton: root.querySelectorAll('.fixed-action-btn:not(.no-autoinit)')
  };

  for (var pluginName in registry) {
    var plugin = M[pluginName];
    plugin.init(registry[pluginName]);
  }
};

/**
 * Generate approximated selector string for a jQuery object
 * @param {jQuery} obj  jQuery object to be parsed
 * @returns {string}
 */
M.objectSelectorString = function (obj) {
  var tagStr = obj.prop('tagName') || '';
  var idStr = obj.attr('id') || '';
  var classStr = obj.attr('class') || '';
  return (tagStr + idStr + classStr).replace(/\s/g, '');
};

// Unique Random ID
M.guid = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return function () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };
}();

/**
 * Escapes hash from special characters
 * @param {string} hash  String returned from this.hash
 * @returns {string}
 */
M.escapeHash = function (hash) {
  return hash.replace(/(:|\.|\[|\]|,|=|\/)/g, '\\$1');
};

M.elementOrParentIsFixed = function (element) {
  var $element = $(element);
  var $checkElements = $element.add($element.parents());
  var isFixed = false;
  $checkElements.each(function () {
    if ($(this).css('position') === 'fixed') {
      isFixed = true;
      return false;
    }
  });
  return isFixed;
};

/**
 * @typedef {Object} Edges
 * @property {Boolean} top  If the top edge was exceeded
 * @property {Boolean} right  If the right edge was exceeded
 * @property {Boolean} bottom  If the bottom edge was exceeded
 * @property {Boolean} left  If the left edge was exceeded
 */

/**
 * @typedef {Object} Bounding
 * @property {Number} left  left offset coordinate
 * @property {Number} top  top offset coordinate
 * @property {Number} width
 * @property {Number} height
 */

/**
 * Escapes hash from special characters
 * @param {Element} container  Container element that acts as the boundary
 * @param {Bounding} bounding  element bounding that is being checked
 * @param {Number} offset  offset from edge that counts as exceeding
 * @returns {Edges}
 */
M.checkWithinContainer = function (container, bounding, offset) {
  var edges = {
    top: false,
    right: false,
    bottom: false,
    left: false
  };

  var containerRect = container.getBoundingClientRect();
  // If body element is smaller than viewport, use viewport height instead.
  var containerBottom = container === document.body ? Math.max(containerRect.bottom, window.innerHeight) : containerRect.bottom;

  var scrollLeft = container.scrollLeft;
  var scrollTop = container.scrollTop;

  var scrolledX = bounding.left - scrollLeft;
  var scrolledY = bounding.top - scrollTop;

  // Check for container and viewport for each edge
  if (scrolledX < containerRect.left + offset || scrolledX < offset) {
    edges.left = true;
  }

  if (scrolledX + bounding.width > containerRect.right - offset || scrolledX + bounding.width > window.innerWidth - offset) {
    edges.right = true;
  }

  if (scrolledY < containerRect.top + offset || scrolledY < offset) {
    edges.top = true;
  }

  if (scrolledY + bounding.height > containerBottom - offset || scrolledY + bounding.height > window.innerHeight - offset) {
    edges.bottom = true;
  }

  return edges;
};

M.checkPossibleAlignments = function (el, container, bounding, offset) {
  var canAlign = {
    top: true,
    right: true,
    bottom: true,
    left: true,
    spaceOnTop: null,
    spaceOnRight: null,
    spaceOnBottom: null,
    spaceOnLeft: null
  };

  var containerAllowsOverflow = getComputedStyle(container).overflow === 'visible';
  var containerRect = container.getBoundingClientRect();
  var containerHeight = Math.min(containerRect.height, window.innerHeight);
  var containerWidth = Math.min(containerRect.width, window.innerWidth);
  var elOffsetRect = el.getBoundingClientRect();

  var scrollLeft = container.scrollLeft;
  var scrollTop = container.scrollTop;

  var scrolledX = bounding.left - scrollLeft;
  var scrolledYTopEdge = bounding.top - scrollTop;
  var scrolledYBottomEdge = bounding.top + elOffsetRect.height - scrollTop;

  // Check for container and viewport for left
  canAlign.spaceOnRight = !containerAllowsOverflow ? containerWidth - (scrolledX + bounding.width) : window.innerWidth - (elOffsetRect.left + bounding.width);
  if (canAlign.spaceOnRight < 0) {
    canAlign.left = false;
  }

  // Check for container and viewport for Right
  canAlign.spaceOnLeft = !containerAllowsOverflow ? scrolledX - bounding.width + elOffsetRect.width : elOffsetRect.right - bounding.width;
  if (canAlign.spaceOnLeft < 0) {
    canAlign.right = false;
  }

  // Check for container and viewport for Top
  canAlign.spaceOnBottom = !containerAllowsOverflow ? containerHeight - (scrolledYTopEdge + bounding.height + offset) : window.innerHeight - (elOffsetRect.top + bounding.height + offset);
  if (canAlign.spaceOnBottom < 0) {
    canAlign.top = false;
  }

  // Check for container and viewport for Bottom
  canAlign.spaceOnTop = !containerAllowsOverflow ? scrolledYBottomEdge - (bounding.height - offset) : elOffsetRect.bottom - (bounding.height + offset);
  if (canAlign.spaceOnTop < 0) {
    canAlign.bottom = false;
  }

  return canAlign;
};

M.getOverflowParent = function (element) {
  if (element == null) {
    return null;
  }

  if (element === document.body || getComputedStyle(element).overflow !== 'visible') {
    return element;
  }

  return M.getOverflowParent(element.parentElement);
};

/**
 * Gets id of component from a trigger
 * @param {Element} trigger  trigger
 * @returns {string}
 */
M.getIdFromTrigger = function (trigger) {
  var id = trigger.getAttribute('data-target');
  if (!id) {
    id = trigger.getAttribute('href');
    if (id) {
      id = id.slice(1);
    } else {
      id = '';
    }
  }
  return id;
};

/**
 * Multi browser support for document scroll top
 * @returns {Number}
 */
M.getDocumentScrollTop = function () {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
};

/**
 * Multi browser support for document scroll left
 * @returns {Number}
 */
M.getDocumentScrollLeft = function () {
  return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
};

/**
 * @typedef {Object} Edges
 * @property {Boolean} top  If the top edge was exceeded
 * @property {Boolean} right  If the right edge was exceeded
 * @property {Boolean} bottom  If the bottom edge was exceeded
 * @property {Boolean} left  If the left edge was exceeded
 */

/**
 * @typedef {Object} Bounding
 * @property {Number} left  left offset coordinate
 * @property {Number} top  top offset coordinate
 * @property {Number} width
 * @property {Number} height
 */

/**
 * Get time in ms
 * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
 * @type {function}
 * @return {number}
 */
var getTime = Date.now || function () {
  return new Date().getTime();
};

/**
 * Returns a function, that, when invoked, will only be triggered at most once
 * during a given window of time. Normally, the throttled function will run
 * as much as it can, without ever going more than once per `wait` duration;
 * but if you'd like to disable the execution on the leading edge, pass
 * `{leading: false}`. To disable execution on the trailing edge, ditto.
 * @license https://raw.github.com/jashkenas/underscore/master/LICENSE
 * @param {function} func
 * @param {number} wait
 * @param {Object=} options
 * @returns {Function}
 */
M.throttle = function (func, wait, options) {
  var context = void 0,
      args = void 0,
      result = void 0;
  var timeout = null;
  var previous = 0;
  options || (options = {});
  var later = function () {
    previous = options.leading === false ? 0 : getTime();
    timeout = null;
    result = func.apply(context, args);
    context = args = null;
  };
  return function () {
    var now = getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};
; /*
  v2.2.0
  2017 Julian Garnier
  Released under the MIT license
  */
var $jscomp = { scope: {} };$jscomp.defineProperty = "function" == typeof Object.defineProperties ? Object.defineProperty : function (e, r, p) {
  if (p.get || p.set) throw new TypeError("ES3 does not support getters and setters.");e != Array.prototype && e != Object.prototype && (e[r] = p.value);
};$jscomp.getGlobal = function (e) {
  return "undefined" != typeof window && window === e ? e : "undefined" != typeof global && null != global ? global : e;
};$jscomp.global = $jscomp.getGlobal(this);$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function () {
  $jscomp.initSymbol = function () {};$jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};$jscomp.symbolCounter_ = 0;$jscomp.Symbol = function (e) {
  return $jscomp.SYMBOL_PREFIX + (e || "") + $jscomp.symbolCounter_++;
};
$jscomp.initSymbolIterator = function () {
  $jscomp.initSymbol();var e = $jscomp.global.Symbol.iterator;e || (e = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));"function" != typeof Array.prototype[e] && $jscomp.defineProperty(Array.prototype, e, { configurable: !0, writable: !0, value: function () {
      return $jscomp.arrayIterator(this);
    } });$jscomp.initSymbolIterator = function () {};
};$jscomp.arrayIterator = function (e) {
  var r = 0;return $jscomp.iteratorPrototype(function () {
    return r < e.length ? { done: !1, value: e[r++] } : { done: !0 };
  });
};
$jscomp.iteratorPrototype = function (e) {
  $jscomp.initSymbolIterator();e = { next: e };e[$jscomp.global.Symbol.iterator] = function () {
    return this;
  };return e;
};$jscomp.array = $jscomp.array || {};$jscomp.iteratorFromArray = function (e, r) {
  $jscomp.initSymbolIterator();e instanceof String && (e += "");var p = 0,
      m = { next: function () {
      if (p < e.length) {
        var u = p++;return { value: r(u, e[u]), done: !1 };
      }m.next = function () {
        return { done: !0, value: void 0 };
      };return m.next();
    } };m[Symbol.iterator] = function () {
    return m;
  };return m;
};
$jscomp.polyfill = function (e, r, p, m) {
  if (r) {
    p = $jscomp.global;e = e.split(".");for (m = 0; m < e.length - 1; m++) {
      var u = e[m];u in p || (p[u] = {});p = p[u];
    }e = e[e.length - 1];m = p[e];r = r(m);r != m && null != r && $jscomp.defineProperty(p, e, { configurable: !0, writable: !0, value: r });
  }
};$jscomp.polyfill("Array.prototype.keys", function (e) {
  return e ? e : function () {
    return $jscomp.iteratorFromArray(this, function (e) {
      return e;
    });
  };
}, "es6-impl", "es3");var $jscomp$this = this;
(function (r) {
  M.anime = r();
})(function () {
  function e(a) {
    if (!h.col(a)) try {
      return document.querySelectorAll(a);
    } catch (c) {}
  }function r(a, c) {
    for (var d = a.length, b = 2 <= arguments.length ? arguments[1] : void 0, f = [], n = 0; n < d; n++) {
      if (n in a) {
        var k = a[n];c.call(b, k, n, a) && f.push(k);
      }
    }return f;
  }function p(a) {
    return a.reduce(function (a, d) {
      return a.concat(h.arr(d) ? p(d) : d);
    }, []);
  }function m(a) {
    if (h.arr(a)) return a;
    h.str(a) && (a = e(a) || a);return a instanceof NodeList || a instanceof HTMLCollection ? [].slice.call(a) : [a];
  }function u(a, c) {
    return a.some(function (a) {
      return a === c;
    });
  }function C(a) {
    var c = {},
        d;for (d in a) {
      c[d] = a[d];
    }return c;
  }function D(a, c) {
    var d = C(a),
        b;for (b in a) {
      d[b] = c.hasOwnProperty(b) ? c[b] : a[b];
    }return d;
  }function z(a, c) {
    var d = C(a),
        b;for (b in c) {
      d[b] = h.und(a[b]) ? c[b] : a[b];
    }return d;
  }function T(a) {
    a = a.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (a, c, d, k) {
      return c + c + d + d + k + k;
    });var c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
    a = parseInt(c[1], 16);var d = parseInt(c[2], 16),
        c = parseInt(c[3], 16);return "rgba(" + a + "," + d + "," + c + ",1)";
  }function U(a) {
    function c(a, c, b) {
      0 > b && (b += 1);1 < b && --b;return b < 1 / 6 ? a + 6 * (c - a) * b : .5 > b ? c : b < 2 / 3 ? a + (c - a) * (2 / 3 - b) * 6 : a;
    }var d = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(a) || /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(a);a = parseInt(d[1]) / 360;var b = parseInt(d[2]) / 100,
        f = parseInt(d[3]) / 100,
        d = d[4] || 1;if (0 == b) f = b = a = f;else {
      var n = .5 > f ? f * (1 + b) : f + b - f * b,
          k = 2 * f - n,
          f = c(k, n, a + 1 / 3),
          b = c(k, n, a);a = c(k, n, a - 1 / 3);
    }return "rgba(" + 255 * f + "," + 255 * b + "," + 255 * a + "," + d + ")";
  }function y(a) {
    if (a = /([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(a)) return a[2];
  }function V(a) {
    if (-1 < a.indexOf("translate") || "perspective" === a) return "px";if (-1 < a.indexOf("rotate") || -1 < a.indexOf("skew")) return "deg";
  }function I(a, c) {
    return h.fnc(a) ? a(c.target, c.id, c.total) : a;
  }function E(a, c) {
    if (c in a.style) return getComputedStyle(a).getPropertyValue(c.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()) || "0";
  }function J(a, c) {
    if (h.dom(a) && u(W, c)) return "transform";if (h.dom(a) && (a.getAttribute(c) || h.svg(a) && a[c])) return "attribute";if (h.dom(a) && "transform" !== c && E(a, c)) return "css";if (null != a[c]) return "object";
  }function X(a, c) {
    var d = V(c),
        d = -1 < c.indexOf("scale") ? 1 : 0 + d;a = a.style.transform;if (!a) return d;for (var b = [], f = [], n = [], k = /(\w+)\((.+?)\)/g; b = k.exec(a);) {
      f.push(b[1]), n.push(b[2]);
    }a = r(n, function (a, b) {
      return f[b] === c;
    });return a.length ? a[0] : d;
  }function K(a, c) {
    switch (J(a, c)) {case "transform":
        return X(a, c);case "css":
        return E(a, c);case "attribute":
        return a.getAttribute(c);}return a[c] || 0;
  }function L(a, c) {
    var d = /^(\*=|\+=|-=)/.exec(a);if (!d) return a;var b = y(a) || 0;c = parseFloat(c);a = parseFloat(a.replace(d[0], ""));switch (d[0][0]) {case "+":
        return c + a + b;case "-":
        return c - a + b;case "*":
        return c * a + b;}
  }function F(a, c) {
    return Math.sqrt(Math.pow(c.x - a.x, 2) + Math.pow(c.y - a.y, 2));
  }function M(a) {
    a = a.points;for (var c = 0, d, b = 0; b < a.numberOfItems; b++) {
      var f = a.getItem(b);0 < b && (c += F(d, f));d = f;
    }return c;
  }function N(a) {
    if (a.getTotalLength) return a.getTotalLength();switch (a.tagName.toLowerCase()) {case "circle":
        return 2 * Math.PI * a.getAttribute("r");case "rect":
        return 2 * a.getAttribute("width") + 2 * a.getAttribute("height");case "line":
        return F({ x: a.getAttribute("x1"), y: a.getAttribute("y1") }, { x: a.getAttribute("x2"), y: a.getAttribute("y2") });case "polyline":
        return M(a);case "polygon":
        var c = a.points;return M(a) + F(c.getItem(c.numberOfItems - 1), c.getItem(0));}
  }function Y(a, c) {
    function d(b) {
      b = void 0 === b ? 0 : b;return a.el.getPointAtLength(1 <= c + b ? c + b : 0);
    }var b = d(),
        f = d(-1),
        n = d(1);switch (a.property) {case "x":
        return b.x;case "y":
        return b.y;
      case "angle":
        return 180 * Math.atan2(n.y - f.y, n.x - f.x) / Math.PI;}
  }function O(a, c) {
    var d = /-?\d*\.?\d+/g,
        b;b = h.pth(a) ? a.totalLength : a;if (h.col(b)) {
      if (h.rgb(b)) {
        var f = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(b);b = f ? "rgba(" + f[1] + ",1)" : b;
      } else b = h.hex(b) ? T(b) : h.hsl(b) ? U(b) : void 0;
    } else f = (f = y(b)) ? b.substr(0, b.length - f.length) : b, b = c && !/\s/g.test(b) ? f + c : f;b += "";return { original: b, numbers: b.match(d) ? b.match(d).map(Number) : [0], strings: h.str(a) || c ? b.split(d) : [] };
  }function P(a) {
    a = a ? p(h.arr(a) ? a.map(m) : m(a)) : [];return r(a, function (a, d, b) {
      return b.indexOf(a) === d;
    });
  }function Z(a) {
    var c = P(a);return c.map(function (a, b) {
      return { target: a, id: b, total: c.length };
    });
  }function aa(a, c) {
    var d = C(c);if (h.arr(a)) {
      var b = a.length;2 !== b || h.obj(a[0]) ? h.fnc(c.duration) || (d.duration = c.duration / b) : a = { value: a };
    }return m(a).map(function (a, b) {
      b = b ? 0 : c.delay;a = h.obj(a) && !h.pth(a) ? a : { value: a };h.und(a.delay) && (a.delay = b);return a;
    }).map(function (a) {
      return z(a, d);
    });
  }function ba(a, c) {
    var d = {},
        b;for (b in a) {
      var f = I(a[b], c);h.arr(f) && (f = f.map(function (a) {
        return I(a, c);
      }), 1 === f.length && (f = f[0]));d[b] = f;
    }d.duration = parseFloat(d.duration);d.delay = parseFloat(d.delay);return d;
  }function ca(a) {
    return h.arr(a) ? A.apply(this, a) : Q[a];
  }function da(a, c) {
    var d;return a.tweens.map(function (b) {
      b = ba(b, c);var f = b.value,
          e = K(c.target, a.name),
          k = d ? d.to.original : e,
          k = h.arr(f) ? f[0] : k,
          w = L(h.arr(f) ? f[1] : f, k),
          e = y(w) || y(k) || y(e);b.from = O(k, e);b.to = O(w, e);b.start = d ? d.end : a.offset;b.end = b.start + b.delay + b.duration;b.easing = ca(b.easing);b.elasticity = (1E3 - Math.min(Math.max(b.elasticity, 1), 999)) / 1E3;b.isPath = h.pth(f);b.isColor = h.col(b.from.original);b.isColor && (b.round = 1);return d = b;
    });
  }function ea(a, c) {
    return r(p(a.map(function (a) {
      return c.map(function (b) {
        var c = J(a.target, b.name);if (c) {
          var d = da(b, a);b = { type: c, property: b.name, animatable: a, tweens: d, duration: d[d.length - 1].end, delay: d[0].delay };
        } else b = void 0;return b;
      });
    })), function (a) {
      return !h.und(a);
    });
  }function R(a, c, d, b) {
    var f = "delay" === a;return c.length ? (f ? Math.min : Math.max).apply(Math, c.map(function (b) {
      return b[a];
    })) : f ? b.delay : d.offset + b.delay + b.duration;
  }function fa(a) {
    var c = D(ga, a),
        d = D(S, a),
        b = Z(a.targets),
        f = [],
        e = z(c, d),
        k;for (k in a) {
      e.hasOwnProperty(k) || "targets" === k || f.push({ name: k, offset: e.offset, tweens: aa(a[k], d) });
    }a = ea(b, f);return z(c, { children: [], animatables: b, animations: a, duration: R("duration", a, c, d), delay: R("delay", a, c, d) });
  }function q(a) {
    function c() {
      return window.Promise && new Promise(function (a) {
        return p = a;
      });
    }function d(a) {
      return g.reversed ? g.duration - a : a;
    }function b(a) {
      for (var b = 0, c = {}, d = g.animations, f = d.length; b < f;) {
        var e = d[b],
            k = e.animatable,
            h = e.tweens,
            n = h.length - 1,
            l = h[n];n && (l = r(h, function (b) {
          return a < b.end;
        })[0] || l);for (var h = Math.min(Math.max(a - l.start - l.delay, 0), l.duration) / l.duration, w = isNaN(h) ? 1 : l.easing(h, l.elasticity), h = l.to.strings, p = l.round, n = [], m = void 0, m = l.to.numbers.length, t = 0; t < m; t++) {
          var x = void 0,
              x = l.to.numbers[t],
              q = l.from.numbers[t],
              x = l.isPath ? Y(l.value, w * x) : q + w * (x - q);p && (l.isColor && 2 < t || (x = Math.round(x * p) / p));n.push(x);
        }if (l = h.length) for (m = h[0], w = 0; w < l; w++) {
          p = h[w + 1], t = n[w], isNaN(t) || (m = p ? m + (t + p) : m + (t + " "));
        } else m = n[0];ha[e.type](k.target, e.property, m, c, k.id);e.currentValue = m;b++;
      }if (b = Object.keys(c).length) for (d = 0; d < b; d++) {
        H || (H = E(document.body, "transform") ? "transform" : "-webkit-transform"), g.animatables[d].target.style[H] = c[d].join(" ");
      }g.currentTime = a;g.progress = a / g.duration * 100;
    }function f(a) {
      if (g[a]) g[a](g);
    }function e() {
      g.remaining && !0 !== g.remaining && g.remaining--;
    }function k(a) {
      var k = g.duration,
          n = g.offset,
          w = n + g.delay,
          r = g.currentTime,
          x = g.reversed,
          q = d(a);if (g.children.length) {
        var u = g.children,
            v = u.length;
        if (q >= g.currentTime) for (var G = 0; G < v; G++) {
          u[G].seek(q);
        } else for (; v--;) {
          u[v].seek(q);
        }
      }if (q >= w || !k) g.began || (g.began = !0, f("begin")), f("run");if (q > n && q < k) b(q);else if (q <= n && 0 !== r && (b(0), x && e()), q >= k && r !== k || !k) b(k), x || e();f("update");a >= k && (g.remaining ? (t = h, "alternate" === g.direction && (g.reversed = !g.reversed)) : (g.pause(), g.completed || (g.completed = !0, f("complete"), "Promise" in window && (p(), m = c()))), l = 0);
    }a = void 0 === a ? {} : a;var h,
        t,
        l = 0,
        p = null,
        m = c(),
        g = fa(a);g.reset = function () {
      var a = g.direction,
          c = g.loop;g.currentTime = 0;g.progress = 0;g.paused = !0;g.began = !1;g.completed = !1;g.reversed = "reverse" === a;g.remaining = "alternate" === a && 1 === c ? 2 : c;b(0);for (a = g.children.length; a--;) {
        g.children[a].reset();
      }
    };g.tick = function (a) {
      h = a;t || (t = h);k((l + h - t) * q.speed);
    };g.seek = function (a) {
      k(d(a));
    };g.pause = function () {
      var a = v.indexOf(g);-1 < a && v.splice(a, 1);g.paused = !0;
    };g.play = function () {
      g.paused && (g.paused = !1, t = 0, l = d(g.currentTime), v.push(g), B || ia());
    };g.reverse = function () {
      g.reversed = !g.reversed;t = 0;l = d(g.currentTime);
    };g.restart = function () {
      g.pause();
      g.reset();g.play();
    };g.finished = m;g.reset();g.autoplay && g.play();return g;
  }var ga = { update: void 0, begin: void 0, run: void 0, complete: void 0, loop: 1, direction: "normal", autoplay: !0, offset: 0 },
      S = { duration: 1E3, delay: 0, easing: "easeOutElastic", elasticity: 500, round: 0 },
      W = "translateX translateY translateZ rotate rotateX rotateY rotateZ scale scaleX scaleY scaleZ skewX skewY perspective".split(" "),
      H,
      h = { arr: function (a) {
      return Array.isArray(a);
    }, obj: function (a) {
      return -1 < Object.prototype.toString.call(a).indexOf("Object");
    },
    pth: function (a) {
      return h.obj(a) && a.hasOwnProperty("totalLength");
    }, svg: function (a) {
      return a instanceof SVGElement;
    }, dom: function (a) {
      return a.nodeType || h.svg(a);
    }, str: function (a) {
      return "string" === typeof a;
    }, fnc: function (a) {
      return "function" === typeof a;
    }, und: function (a) {
      return "undefined" === typeof a;
    }, hex: function (a) {
      return (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a)
      );
    }, rgb: function (a) {
      return (/^rgb/.test(a)
      );
    }, hsl: function (a) {
      return (/^hsl/.test(a)
      );
    }, col: function (a) {
      return h.hex(a) || h.rgb(a) || h.hsl(a);
    } },
      A = function () {
    function a(a, d, b) {
      return (((1 - 3 * b + 3 * d) * a + (3 * b - 6 * d)) * a + 3 * d) * a;
    }return function (c, d, b, f) {
      if (0 <= c && 1 >= c && 0 <= b && 1 >= b) {
        var e = new Float32Array(11);if (c !== d || b !== f) for (var k = 0; 11 > k; ++k) {
          e[k] = a(.1 * k, c, b);
        }return function (k) {
          if (c === d && b === f) return k;if (0 === k) return 0;if (1 === k) return 1;for (var h = 0, l = 1; 10 !== l && e[l] <= k; ++l) {
            h += .1;
          }--l;var l = h + (k - e[l]) / (e[l + 1] - e[l]) * .1,
              n = 3 * (1 - 3 * b + 3 * c) * l * l + 2 * (3 * b - 6 * c) * l + 3 * c;if (.001 <= n) {
            for (h = 0; 4 > h; ++h) {
              n = 3 * (1 - 3 * b + 3 * c) * l * l + 2 * (3 * b - 6 * c) * l + 3 * c;if (0 === n) break;var m = a(l, c, b) - k,
                  l = l - m / n;
            }k = l;
          } else if (0 === n) k = l;else {
            var l = h,
                h = h + .1,
                g = 0;do {
              m = l + (h - l) / 2, n = a(m, c, b) - k, 0 < n ? h = m : l = m;
            } while (1e-7 < Math.abs(n) && 10 > ++g);k = m;
          }return a(k, d, f);
        };
      }
    };
  }(),
      Q = function () {
    function a(a, b) {
      return 0 === a || 1 === a ? a : -Math.pow(2, 10 * (a - 1)) * Math.sin(2 * (a - 1 - b / (2 * Math.PI) * Math.asin(1)) * Math.PI / b);
    }var c = "Quad Cubic Quart Quint Sine Expo Circ Back Elastic".split(" "),
        d = { In: [[.55, .085, .68, .53], [.55, .055, .675, .19], [.895, .03, .685, .22], [.755, .05, .855, .06], [.47, 0, .745, .715], [.95, .05, .795, .035], [.6, .04, .98, .335], [.6, -.28, .735, .045], a], Out: [[.25, .46, .45, .94], [.215, .61, .355, 1], [.165, .84, .44, 1], [.23, 1, .32, 1], [.39, .575, .565, 1], [.19, 1, .22, 1], [.075, .82, .165, 1], [.175, .885, .32, 1.275], function (b, c) {
        return 1 - a(1 - b, c);
      }], InOut: [[.455, .03, .515, .955], [.645, .045, .355, 1], [.77, 0, .175, 1], [.86, 0, .07, 1], [.445, .05, .55, .95], [1, 0, 0, 1], [.785, .135, .15, .86], [.68, -.55, .265, 1.55], function (b, c) {
        return .5 > b ? a(2 * b, c) / 2 : 1 - a(-2 * b + 2, c) / 2;
      }] },
        b = { linear: A(.25, .25, .75, .75) },
        f = {},
        e;for (e in d) {
      f.type = e, d[f.type].forEach(function (a) {
        return function (d, f) {
          b["ease" + a.type + c[f]] = h.fnc(d) ? d : A.apply($jscomp$this, d);
        };
      }(f)), f = { type: f.type };
    }return b;
  }(),
      ha = { css: function (a, c, d) {
      return a.style[c] = d;
    }, attribute: function (a, c, d) {
      return a.setAttribute(c, d);
    }, object: function (a, c, d) {
      return a[c] = d;
    }, transform: function (a, c, d, b, f) {
      b[f] || (b[f] = []);b[f].push(c + "(" + d + ")");
    } },
      v = [],
      B = 0,
      ia = function () {
    function a() {
      B = requestAnimationFrame(c);
    }function c(c) {
      var b = v.length;if (b) {
        for (var d = 0; d < b;) {
          v[d] && v[d].tick(c), d++;
        }a();
      } else cancelAnimationFrame(B), B = 0;
    }return a;
  }();q.version = "2.2.0";q.speed = 1;q.running = v;q.remove = function (a) {
    a = P(a);for (var c = v.length; c--;) {
      for (var d = v[c], b = d.animations, f = b.length; f--;) {
        u(a, b[f].animatable.target) && (b.splice(f, 1), b.length || d.pause());
      }
    }
  };q.getValue = K;q.path = function (a, c) {
    var d = h.str(a) ? e(a)[0] : a,
        b = c || 100;return function (a) {
      return { el: d, property: a, totalLength: N(d) * (b / 100) };
    };
  };q.setDashoffset = function (a) {
    var c = N(a);a.setAttribute("stroke-dasharray", c);return c;
  };q.bezier = A;q.easings = Q;q.timeline = function (a) {
    var c = q(a);c.pause();c.duration = 0;c.add = function (d) {
      c.children.forEach(function (a) {
        a.began = !0;a.completed = !0;
      });m(d).forEach(function (b) {
        var d = z(b, D(S, a || {}));d.targets = d.targets || a.targets;b = c.duration;var e = d.offset;d.autoplay = !1;d.direction = c.direction;d.offset = h.und(e) ? b : L(e, b);c.began = !0;c.completed = !0;c.seek(d.offset);d = q(d);d.began = !0;d.completed = !0;d.duration > b && (c.duration = d.duration);c.children.push(d);
      });c.seek(0);c.reset();c.autoplay && c.restart();return c;
    };return c;
  };q.random = function (a, c) {
    return Math.floor(Math.random() * (c - a + 1)) + a;
  };return q;
});
;(function ($, anim) {
  'use strict';

  var _defaults = {
    accordion: true,
    onOpenStart: undefined,
    onOpenEnd: undefined,
    onCloseStart: undefined,
    onCloseEnd: undefined,
    inDuration: 300,
    outDuration: 300
  };

  /**
   * @class
   *
   */

  var Collapsible = function (_Component) {
    _inherits(Collapsible, _Component);

    /**
     * Construct Collapsible instance
     * @constructor
     * @param {Element} el
     * @param {Object} options
     */
    function Collapsible(el, options) {
      _classCallCheck(this, Collapsible);

      var _this3 = _possibleConstructorReturn(this, (Collapsible.__proto__ || Object.getPrototypeOf(Collapsible)).call(this, Collapsible, el, options));

      _this3.el.M_Collapsible = _this3;

      /**
       * Options for the collapsible
       * @member Collapsible#options
       * @prop {Boolean} [accordion=false] - Type of the collapsible
       * @prop {Function} onOpenStart - Callback function called before collapsible is opened
       * @prop {Function} onOpenEnd - Callback function called after collapsible is opened
       * @prop {Function} onCloseStart - Callback function called before collapsible is closed
       * @prop {Function} onCloseEnd - Callback function called after collapsible is closed
       * @prop {Number} inDuration - Transition in duration in milliseconds.
       * @prop {Number} outDuration - Transition duration in milliseconds.
       */
      _this3.options = $.extend({}, Collapsible.defaults, options);

      // Setup tab indices
      _this3.$headers = _this3.$el.children('li').children('.collapsible-header');
      _this3.$headers.attr('tabindex', 0);

      _this3._setupEventHandlers();

      // Open first active
      var $activeBodies = _this3.$el.children('li.active').children('.collapsible-body');
      if (_this3.options.accordion) {
        // Handle Accordion
        $activeBodies.first().css('display', 'block');
      } else {
        // Handle Expandables
        $activeBodies.css('display', 'block');
      }
      return _this3;
    }

    _createClass(Collapsible, [{
      key: "destroy",


      /**
       * Teardown component
       */
      value: function destroy() {
        this._removeEventHandlers();
        this.el.M_Collapsible = undefined;
      }

      /**
       * Setup Event Handlers
       */

    }, {
      key: "_setupEventHandlers",
      value: function _setupEventHandlers() {
        var _this4 = this;

        this._handleCollapsibleClickBound = this._handleCollapsibleClick.bind(this);
        this._handleCollapsibleKeydownBound = this._handleCollapsibleKeydown.bind(this);
        this.el.addEventListener('click', this._handleCollapsibleClickBound);
        this.$headers.each(function (header) {
          header.addEventListener('keydown', _this4._handleCollapsibleKeydownBound);
        });
      }

      /**
       * Remove Event Handlers
       */

    }, {
      key: "_removeEventHandlers",
      value: function _removeEventHandlers() {
        var _this5 = this;

        this.el.removeEventListener('click', this._handleCollapsibleClickBound);
        this.$headers.each(function (header) {
          header.removeEventListener('keydown', _this5._handleCollapsibleKeydownBound);
        });
      }

      /**
       * Handle Collapsible Click
       * @param {Event} e
       */

    }, {
      key: "_handleCollapsibleClick",
      value: function _handleCollapsibleClick(e) {
        var $header = $(e.target).closest('.collapsible-header');
        if (e.target && $header.length) {
          var $collapsible = $header.closest('.collapsible');
          if ($collapsible[0] === this.el) {
            var $collapsibleLi = $header.closest('li');
            var $collapsibleLis = $collapsible.children('li');
            var isActive = $collapsibleLi[0].classList.contains('active');
            var index = $collapsibleLis.index($collapsibleLi);

            if (isActive) {
              this.close(index);
            } else {
              this.open(index);
            }
          }
        }
      }

      /**
       * Handle Collapsible Keydown
       * @param {Event} e
       */

    }, {
      key: "_handleCollapsibleKeydown",
      value: function _handleCollapsibleKeydown(e) {
        if (e.keyCode === 13) {
          this._handleCollapsibleClickBound(e);
        }
      }

      /**
       * Animate in collapsible slide
       * @param {Number} index - 0th index of slide
       */

    }, {
      key: "_animateIn",
      value: function _animateIn(index) {
        var _this6 = this;

        var $collapsibleLi = this.$el.children('li').eq(index);
        if ($collapsibleLi.length) {
          var $body = $collapsibleLi.children('.collapsible-body');

          anim.remove($body[0]);
          $body.css({
            display: 'block',
            overflow: 'hidden',
            height: 0,
            paddingTop: '',
            paddingBottom: ''
          });

          var pTop = $body.css('padding-top');
          var pBottom = $body.css('padding-bottom');
          var finalHeight = $body[0].scrollHeight;
          $body.css({
            paddingTop: 0,
            paddingBottom: 0
          });

          anim({
            targets: $body[0],
            height: finalHeight,
            paddingTop: pTop,
            paddingBottom: pBottom,
            duration: this.options.inDuration,
            easing: 'easeInOutCubic',
            complete: function (anim) {
              $body.css({
                overflow: '',
                paddingTop: '',
                paddingBottom: '',
                height: ''
              });

              // onOpenEnd callback
              if (typeof _this6.options.onOpenEnd === 'function') {
                _this6.options.onOpenEnd.call(_this6, $collapsibleLi[0]);
              }
            }
          });
        }
      }

      /**
       * Animate out collapsible slide
       * @param {Number} index - 0th index of slide to open
       */

    }, {
      key: "_animateOut",
      value: function _animateOut(index) {
        var _this7 = this;

        var $collapsibleLi = this.$el.children('li').eq(index);
        if ($collapsibleLi.length) {
          var $body = $collapsibleLi.children('.collapsible-body');
          anim.remove($body[0]);
          $body.css('overflow', 'hidden');
          anim({
            targets: $body[0],
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            duration: this.options.outDuration,
            easing: 'easeInOutCubic',
            complete: function () {
              $body.css({
                height: '',
                overflow: '',
                padding: '',
                display: ''
              });

              // onCloseEnd callback
              if (typeof _this7.options.onCloseEnd === 'function') {
                _this7.options.onCloseEnd.call(_this7, $collapsibleLi[0]);
              }
            }
          });
        }
      }

      /**
       * Open Collapsible
       * @param {Number} index - 0th index of slide
       */

    }, {
      key: "open",
      value: function open(index) {
        var _this8 = this;

        var $collapsibleLi = this.$el.children('li').eq(index);
        if ($collapsibleLi.length && !$collapsibleLi[0].classList.contains('active')) {
          // onOpenStart callback
          if (typeof this.options.onOpenStart === 'function') {
            this.options.onOpenStart.call(this, $collapsibleLi[0]);
          }

          // Handle accordion behavior
          if (this.options.accordion) {
            var $collapsibleLis = this.$el.children('li');
            var $activeLis = this.$el.children('li.active');
            $activeLis.each(function (el) {
              var index = $collapsibleLis.index($(el));
              _this8.close(index);
            });
          }

          // Animate in
          $collapsibleLi[0].classList.add('active');
          this._animateIn(index);
        }
      }

      /**
       * Close Collapsible
       * @param {Number} index - 0th index of slide
       */

    }, {
      key: "close",
      value: function close(index) {
        var $collapsibleLi = this.$el.children('li').eq(index);
        if ($collapsibleLi.length && $collapsibleLi[0].classList.contains('active')) {
          // onCloseStart callback
          if (typeof this.options.onCloseStart === 'function') {
            this.options.onCloseStart.call(this, $collapsibleLi[0]);
          }

          // Animate out
          $collapsibleLi[0].classList.remove('active');
          this._animateOut(index);
        }
      }
    }], [{
      key: "init",
      value: function init(els, options) {
        return _get(Collapsible.__proto__ || Object.getPrototypeOf(Collapsible), "init", this).call(this, this, els, options);
      }

      /**
       * Get Instance
       */

    }, {
      key: "getInstance",
      value: function getInstance(el) {
        var domElem = !!el.jquery ? el[0] : el;
        return domElem.M_Collapsible;
      }
    }, {
      key: "defaults",
      get: function () {
        return _defaults;
      }
    }]);

    return Collapsible;
  }(Component);

  M.Collapsible = Collapsible;

  if (M.jQueryLoaded) {
    M.initializeJqueryWrapper(Collapsible, 'collapsible', 'M_Collapsible');
  }
})(cash, M.anime);
;(function ($, anim) {
  'use strict';

  var _defaults = {
    alignment: 'left',
    autoFocus: true,
    constrainWidth: true,
    container: null,
    coverTrigger: true,
    closeOnClick: true,
    hover: false,
    inDuration: 150,
    outDuration: 250,
    onOpenStart: null,
    onOpenEnd: null,
    onCloseStart: null,
    onCloseEnd: null,
    onItemClick: null
  };

  /**
   * @class
   */

  var Dropdown = function (_Component2) {
    _inherits(Dropdown, _Component2);

    function Dropdown(el, options) {
      _classCallCheck(this, Dropdown);

      var _this9 = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this, Dropdown, el, options));

      _this9.el.M_Dropdown = _this9;
      Dropdown._dropdowns.push(_this9);

      _this9.id = M.getIdFromTrigger(el);
      _this9.dropdownEl = document.getElementById(_this9.id);
      _this9.$dropdownEl = $(_this9.dropdownEl);

      /**
       * Options for the dropdown
       * @member Dropdown#options
       * @prop {String} [alignment='left'] - Edge which the dropdown is aligned to
       * @prop {Boolean} [autoFocus=true] - Automatically focus dropdown el for keyboard
       * @prop {Boolean} [constrainWidth=true] - Constrain width to width of the button
       * @prop {Element} container - Container element to attach dropdown to (optional)
       * @prop {Boolean} [coverTrigger=true] - Place dropdown over trigger
       * @prop {Boolean} [closeOnClick=true] - Close on click of dropdown item
       * @prop {Boolean} [hover=false] - Open dropdown on hover
       * @prop {Number} [inDuration=150] - Duration of open animation in ms
       * @prop {Number} [outDuration=250] - Duration of close animation in ms
       * @prop {Function} onOpenStart - Function called when dropdown starts opening
       * @prop {Function} onOpenEnd - Function called when dropdown finishes opening
       * @prop {Function} onCloseStart - Function called when dropdown starts closing
       * @prop {Function} onCloseEnd - Function called when dropdown finishes closing
       */
      _this9.options = $.extend({}, Dropdown.defaults, options);

      /**
       * Describes open/close state of dropdown
       * @type {Boolean}
       */
      _this9.isOpen = false;

      /**
       * Describes if dropdown content is scrollable
       * @type {Boolean}
       */
      _this9.isScrollable = false;

      /**
       * Describes if touch moving on dropdown content
       * @type {Boolean}
       */
      _this9.isTouchMoving = false;

      _this9.focusedIndex = -1;
      _this9.filterQuery = [];

      // Move dropdown-content after dropdown-trigger
      if (!!_this9.options.container) {
        $(_this9.options.container).append(_this9.dropdownEl);
      } else {
        _this9.$el.after(_this9.dropdownEl);
      }

      _this9._makeDropdownFocusable();
      _this9._resetFilterQueryBound = _this9._resetFilterQuery.bind(_this9);
      _this9._handleDocumentClickBound = _this9._handleDocumentClick.bind(_this9);
      _this9._handleDocumentTouchmoveBound = _this9._handleDocumentTouchmove.bind(_this9);
      _this9._handleDropdownClickBound = _this9._handleDropdownClick.bind(_this9);
      _this9._handleDropdownKeydownBound = _this9._handleDropdownKeydown.bind(_this9);
      _this9._handleTriggerKeydownBound = _this9._handleTriggerKeydown.bind(_this9);
      _this9._setupEventHandlers();
      return _this9;
    }

    _createClass(Dropdown, [{
      key: "destroy",


      /**
       * Teardown component
       */
      value: function destroy() {
        this._resetDropdownStyles();
        this._removeEventHandlers();
        Dropdown._dropdowns.splice(Dropdown._dropdowns.indexOf(this), 1);
        this.el.M_Dropdown = undefined;
      }

      /**
       * Setup Event Handlers
       */

    }, {
      key: "_setupEventHandlers",
      value: function _setupEventHandlers() {
        // Trigger keydown handler
        this.el.addEventListener('keydown', this._handleTriggerKeydownBound);

        // Item click handler
        this.dropdownEl.addEventListener('click', this._handleDropdownClickBound);

        // Hover event handlers
        if (this.options.hover) {
          this._handleMouseEnterBound = this._handleMouseEnter.bind(this);
          this.el.addEventListener('mouseenter', this._handleMouseEnterBound);
          this._handleMouseLeaveBound = this._handleMouseLeave.bind(this);
          this.el.addEventListener('mouseleave', this._handleMouseLeaveBound);
          this.dropdownEl.addEventListener('mouseleave', this._handleMouseLeaveBound);

          // Click event handlers
        } else {
          this._handleClickBound = this._handleClick.bind(this);
          this.el.addEventListener('click', this._handleClickBound);
        }
      }

      /**
       * Remove Event Handlers
       */

    }, {
      key: "_removeEventHandlers",
      value: function _removeEventHandlers() {
        this.el.removeEventListener('keydown', this._handleTriggerKeydownBound);
        this.dropdownEl.removeEventListener('click', this._handleDropdownClickBound);

        if (this.options.hover) {
          this.el.removeEventListener('mouseenter', this._handleMouseEnterBound);
          this.el.removeEventListener('mouseleave', this._handleMouseLeaveBound);
          this.dropdownEl.removeEventListener('mouseleave', this._handleMouseLeaveBound);
        } else {
          this.el.removeEventListener('click', this._handleClickBound);
        }
      }
    }, {
      key: "_setupTemporaryEventHandlers",
      value: function _setupTemporaryEventHandlers() {
        // Use capture phase event handler to prevent click
        document.body.addEventListener('click', this._handleDocumentClickBound, true);
        document.body.addEventListener('touchend', this._handleDocumentClickBound);
        document.body.addEventListener('touchmove', this._handleDocumentTouchmoveBound);
        this.dropdownEl.addEventListener('keydown', this._handleDropdownKeydownBound);
      }
    }, {
      key: "_removeTemporaryEventHandlers",
      value: function _removeTemporaryEventHandlers() {
        // Use capture phase event handler to prevent click
        document.body.removeEventListener('click', this._handleDocumentClickBound, true);
        document.body.removeEventListener('touchend', this._handleDocumentClickBound);
        document.body.removeEventListener('touchmove', this._handleDocumentTouchmoveBound);
        this.dropdownEl.removeEventListener('keydown', this._handleDropdownKeydownBound);
      }
    }, {
      key: "_handleClick",
      value: function _handleClick(e) {
        e.preventDefault();
        this.open();
      }
    }, {
      key: "_handleMouseEnter",
      value: function _handleMouseEnter() {
        this.open();
      }
    }, {
      key: "_handleMouseLeave",
      value: function _handleMouseLeave(e) {
        var toEl = e.toElement || e.relatedTarget;
        var leaveToDropdownContent = !!$(toEl).closest('.dropdown-content').length;
        var leaveToActiveDropdownTrigger = false;

        var $closestTrigger = $(toEl).closest('.dropdown-trigger');
        if ($closestTrigger.length && !!$closestTrigger[0].M_Dropdown && $closestTrigger[0].M_Dropdown.isOpen) {
          leaveToActiveDropdownTrigger = true;
        }

        // Close hover dropdown if mouse did not leave to either active dropdown-trigger or dropdown-content
        if (!leaveToActiveDropdownTrigger && !leaveToDropdownContent) {
          this.close();
        }
      }
    }, {
      key: "_handleDocumentClick",
      value: function _handleDocumentClick(e) {
        var _this10 = this;

        var $target = $(e.target);
        if (this.options.closeOnClick && $target.closest('.dropdown-content').length && !this.isTouchMoving) {
          // isTouchMoving to check if scrolling on mobile.
          setTimeout(function () {
            _this10.close();
          }, 0);
        } else if ($target.closest('.dropdown-trigger').length || !$target.closest('.dropdown-content').length) {
          setTimeout(function () {
            _this10.close();
          }, 0);
        }
        this.isTouchMoving = false;
      }
    }, {
      key: "_handleTriggerKeydown",
      value: function _handleTriggerKeydown(e) {
        // ARROW DOWN OR ENTER WHEN SELECT IS CLOSED - open Dropdown
        if ((e.which === M.keys.ARROW_DOWN || e.which === M.keys.ENTER) && !this.isOpen) {
          e.preventDefault();
          this.open();
        }
      }

      /**
       * Handle Document Touchmove
       * @param {Event} e
       */

    }, {
      key: "_handleDocumentTouchmove",
      value: function _handleDocumentTouchmove(e) {
        var $target = $(e.target);
        if ($target.closest('.dropdown-content').length) {
          this.isTouchMoving = true;
        }
      }

      /**
       * Handle Dropdown Click
       * @param {Event} e
       */

    }, {
      key: "_handleDropdownClick",
      value: function _handleDropdownClick(e) {
        // onItemClick callback
        if (typeof this.options.onItemClick === 'function') {
          var itemEl = $(e.target).closest('li')[0];
          this.options.onItemClick.call(this, itemEl);
        }
      }

      /**
       * Handle Dropdown Keydown
       * @param {Event} e
       */

    }, {
      key: "_handleDropdownKeydown",
      value: function _handleDropdownKeydown(e) {
        if (e.which === M.keys.TAB) {
          e.preventDefault();
          this.close();

          // Navigate down dropdown list
        } else if ((e.which === M.keys.ARROW_DOWN || e.which === M.keys.ARROW_UP) && this.isOpen) {
          e.preventDefault();
          var direction = e.which === M.keys.ARROW_DOWN ? 1 : -1;
          var newFocusedIndex = this.focusedIndex;
          var foundNewIndex = false;
          do {
            newFocusedIndex = newFocusedIndex + direction;

            if (!!this.dropdownEl.children[newFocusedIndex] && this.dropdownEl.children[newFocusedIndex].tabIndex !== -1) {
              foundNewIndex = true;
              break;
            }
          } while (newFocusedIndex < this.dropdownEl.children.length && newFocusedIndex >= 0);

          if (foundNewIndex) {
            this.focusedIndex = newFocusedIndex;
            this._focusFocusedItem();
          }

          // ENTER selects choice on focused item
        } else if (e.which === M.keys.ENTER && this.isOpen) {
          // Search for <a> and <button>
          var focusedElement = this.dropdownEl.children[this.focusedIndex];
          var $activatableElement = $(focusedElement).find('a, button').first();

          // Click a or button tag if exists, otherwise click li tag
          if (!!$activatableElement.length) {
            $activatableElement[0].click();
          } else if (!!focusedElement) {
            focusedElement.click();
          }

          // Close dropdown on ESC
        } else if (e.which === M.keys.ESC && this.isOpen) {
          e.preventDefault();
          this.close();
        }

        // CASE WHEN USER TYPE LETTERS
        var letter = String.fromCharCode(e.which).toLowerCase(),
            nonLetters = [9, 13, 27, 38, 40];
        if (letter && nonLetters.indexOf(e.which) === -1) {
          this.filterQuery.push(letter);

          var string = this.filterQuery.join(''),
              newOptionEl = $(this.dropdownEl).find('li').filter(function (el) {
            return $(el).text().toLowerCase().indexOf(string) === 0;
          })[0];

          if (newOptionEl) {
            this.focusedIndex = $(newOptionEl).index();
            this._focusFocusedItem();
          }
        }

        this.filterTimeout = setTimeout(this._resetFilterQueryBound, 1000);
      }

      /**
       * Setup dropdown
       */

    }, {
      key: "_resetFilterQuery",
      value: function _resetFilterQuery() {
        this.filterQuery = [];
      }
    }, {
      key: "_resetDropdownStyles",
      value: function _resetDropdownStyles() {
        this.$dropdownEl.css({
          display: '',
          width: '',
          height: '',
          left: '',
          top: '',
          'transform-origin': '',
          transform: '',
          opacity: ''
        });
      }
    }, {
      key: "_makeDropdownFocusable",
      value: function _makeDropdownFocusable() {
        // Needed for arrow key navigation
        this.dropdownEl.tabIndex = 0;

        // Only set tabindex if it hasn't been set by user
        $(this.dropdownEl).children().each(function (el) {
          if (!el.getAttribute('tabindex')) {
            el.setAttribute('tabindex', 0);
          }
        });
      }
    }, {
      key: "_focusFocusedItem",
      value: function _focusFocusedItem() {
        if (this.focusedIndex >= 0 && this.focusedIndex < this.dropdownEl.children.length && this.options.autoFocus) {
          this.dropdownEl.children[this.focusedIndex].focus();
        }
      }
    }, {
      key: "_getDropdownPosition",
      value: function _getDropdownPosition() {
        var offsetParentBRect = this.el.offsetParent.getBoundingClientRect();
        var triggerBRect = this.el.getBoundingClientRect();
        var dropdownBRect = this.dropdownEl.getBoundingClientRect();

        var idealHeight = dropdownBRect.height;
        var idealWidth = dropdownBRect.width;
        var idealXPos = triggerBRect.left - dropdownBRect.left;
        var idealYPos = triggerBRect.top - dropdownBRect.top;

        var dropdownBounds = {
          left: idealXPos,
          top: idealYPos,
          height: idealHeight,
          width: idealWidth
        };

        // Countainer here will be closest ancestor with overflow: hidden
        var closestOverflowParent = !!this.dropdownEl.offsetParent ? this.dropdownEl.offsetParent : this.dropdownEl.parentNode;

        var alignments = M.checkPossibleAlignments(this.el, closestOverflowParent, dropdownBounds, this.options.coverTrigger ? 0 : triggerBRect.height);

        var verticalAlignment = 'top';
        var horizontalAlignment = this.options.alignment;
        idealYPos += this.options.coverTrigger ? 0 : triggerBRect.height;

        // Reset isScrollable
        this.isScrollable = false;

        if (!alignments.top) {
          if (alignments.bottom) {
            verticalAlignment = 'bottom';
          } else {
            this.isScrollable = true;

            // Determine which side has most space and cutoff at correct height
            if (alignments.spaceOnTop > alignments.spaceOnBottom) {
              verticalAlignment = 'bottom';
              idealHeight += alignments.spaceOnTop;
              idealYPos -= alignments.spaceOnTop;
            } else {
              idealHeight += alignments.spaceOnBottom;
            }
          }
        }

        // If preferred horizontal alignment is possible
        if (!alignments[horizontalAlignment]) {
          var oppositeAlignment = horizontalAlignment === 'left' ? 'right' : 'left';
          if (alignments[oppositeAlignment]) {
            horizontalAlignment = oppositeAlignment;
          } else {
            // Determine which side has most space and cutoff at correct height
            if (alignments.spaceOnLeft > alignments.spaceOnRight) {
              horizontalAlignment = 'right';
              idealWidth += alignments.spaceOnLeft;
              idealXPos -= alignments.spaceOnLeft;
            } else {
              horizontalAlignment = 'left';
              idealWidth += alignments.spaceOnRight;
            }
          }
        }

        if (verticalAlignment === 'bottom') {
          idealYPos = idealYPos - dropdownBRect.height + (this.options.coverTrigger ? triggerBRect.height : 0);
        }
        if (horizontalAlignment === 'right') {
          idealXPos = idealXPos - dropdownBRect.width + triggerBRect.width;
        }
        return {
          x: idealXPos,
          y: idealYPos,
          verticalAlignment: verticalAlignment,
          horizontalAlignment: horizontalAlignment,
          height: idealHeight,
          width: idealWidth
        };
      }

      /**
       * Animate in dropdown
       */

    }, {
      key: "_animateIn",
      value: function _animateIn() {
        var _this11 = this;

        anim.remove(this.dropdownEl);
        anim({
          targets: this.dropdownEl,
          opacity: {
            value: [0, 1],
            easing: 'easeOutQuad'
          },
          scaleX: [0.3, 1],
          scaleY: [0.3, 1],
          duration: this.options.inDuration,
          easing: 'easeOutQuint',
          complete: function (anim) {
            if (_this11.options.autoFocus) {
              _this11.dropdownEl.focus();
            }

            // onOpenEnd callback
            if (typeof _this11.options.onOpenEnd === 'function') {
              _this11.options.onOpenEnd.call(_this11, _this11.el);
            }
          }
        });
      }

      /**
       * Animate out dropdown
       */

    }, {
      key: "_animateOut",
      value: function _animateOut() {
        var _this12 = this;

        anim.remove(this.dropdownEl);
        anim({
          targets: this.dropdownEl,
          opacity: {
            value: 0,
            easing: 'easeOutQuint'
          },
          scaleX: 0.3,
          scaleY: 0.3,
          duration: this.options.outDuration,
          easing: 'easeOutQuint',
          complete: function (anim) {
            _this12._resetDropdownStyles();

            // onCloseEnd callback
            if (typeof _this12.options.onCloseEnd === 'function') {
              _this12.options.onCloseEnd.call(_this12, _this12.el);
            }
          }
        });
      }

      /**
       * Place dropdown
       */

    }, {
      key: "_placeDropdown",
      value: function _placeDropdown() {
        // Set width before calculating positionInfo
        var idealWidth = this.options.constrainWidth ? this.el.getBoundingClientRect().width : this.dropdownEl.getBoundingClientRect().width;
        this.dropdownEl.style.width = idealWidth + 'px';

        var positionInfo = this._getDropdownPosition();
        this.dropdownEl.style.left = positionInfo.x + 'px';
        this.dropdownEl.style.top = positionInfo.y + 'px';
        this.dropdownEl.style.height = positionInfo.height + 'px';
        this.dropdownEl.style.width = positionInfo.width + 'px';
        this.dropdownEl.style.transformOrigin = (positionInfo.horizontalAlignment === 'left' ? '0' : '100%') + " " + (positionInfo.verticalAlignment === 'top' ? '0' : '100%');
      }

      /**
       * Open Dropdown
       */

    }, {
      key: "open",
      value: function open() {
        if (this.isOpen) {
          return;
        }
        this.isOpen = true;

        // onOpenStart callback
        if (typeof this.options.onOpenStart === 'function') {
          this.options.onOpenStart.call(this, this.el);
        }

        // Reset styles
        this._resetDropdownStyles();
        this.dropdownEl.style.display = 'block';

        this._placeDropdown();
        this._animateIn();
        this._setupTemporaryEventHandlers();
      }

      /**
       * Close Dropdown
       */

    }, {
      key: "close",
      value: function close() {
        if (!this.isOpen) {
          return;
        }
        this.isOpen = false;
        this.focusedIndex = -1;

        // onCloseStart callback
        if (typeof this.options.onCloseStart === 'function') {
          this.options.onCloseStart.call(this, this.el);
        }

        this._animateOut();
        this._removeTemporaryEventHandlers();

        if (this.options.autoFocus) {
          this.el.focus();
        }
      }

      /**
       * Recalculate dimensions
       */

    }, {
      key: "recalculateDimensions",
      value: function recalculateDimensions() {
        if (this.isOpen) {
          this.$dropdownEl.css({
            width: '',
            height: '',
            left: '',
            top: '',
            'transform-origin': ''
          });
          this._placeDropdown();
        }
      }
    }], [{
      key: "init",
      value: function init(els, options) {
        return _get(Dropdown.__proto__ || Object.getPrototypeOf(Dropdown), "init", this).call(this, this, els, options);
      }

      /**
       * Get Instance
       */

    }, {
      key: "getInstance",
      value: function getInstance(el) {
        var domElem = !!el.jquery ? el[0] : el;
        return domElem.M_Dropdown;
      }
    }, {
      key: "defaults",
      get: function () {
        return _defaults;
      }
    }]);

    return Dropdown;
  }(Component);

  /**
   * @static
   * @memberof Dropdown
   */


  Dropdown._dropdowns = [];

  M.Dropdown = Dropdown;

  if (M.jQueryLoaded) {
    M.initializeJqueryWrapper(Dropdown, 'dropdown', 'M_Dropdown');
  }
})(cash, M.anime);
;(function ($, anim) {
  'use strict';

  var _defaults = {
    opacity: 0.5,
    inDuration: 250,
    outDuration: 250,
    onOpenStart: null,
    onOpenEnd: null,
    onCloseStart: null,
    onCloseEnd: null,
    preventScrolling: true,
    dismissible: true,
    startingTop: '4%',
    endingTop: '10%'
  };

  /**
   * @class
   *
   */

  var Modal = function (_Component3) {
    _inherits(Modal, _Component3);

    /**
     * Construct Modal instance and set up overlay
     * @constructor
     * @param {Element} el
     * @param {Object} options
     */
    function Modal(el, options) {
      _classCallCheck(this, Modal);

      var _this13 = _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).call(this, Modal, el, options));

      _this13.el.M_Modal = _this13;

      /**
       * Options for the modal
       * @member Modal#options
       * @prop {Number} [opacity=0.5] - Opacity of the modal overlay
       * @prop {Number} [inDuration=250] - Length in ms of enter transition
       * @prop {Number} [outDuration=250] - Length in ms of exit transition
       * @prop {Function} onOpenStart - Callback function called before modal is opened
       * @prop {Function} onOpenEnd - Callback function called after modal is opened
       * @prop {Function} onCloseStart - Callback function called before modal is closed
       * @prop {Function} onCloseEnd - Callback function called after modal is closed
       * @prop {Boolean} [dismissible=true] - Allow modal to be dismissed by keyboard or overlay click
       * @prop {String} [startingTop='4%'] - startingTop
       * @prop {String} [endingTop='10%'] - endingTop
       */
      _this13.options = $.extend({}, Modal.defaults, options);

      /**
       * Describes open/close state of modal
       * @type {Boolean}
       */
      _this13.isOpen = false;

      _this13.id = _this13.$el.attr('id');
      _this13._openingTrigger = undefined;
      _this13.$overlay = $('<div class="modal-overlay"></div>');
      _this13.el.tabIndex = 0;
      _this13._nthModalOpened = 0;

      Modal._count++;
      _this13._setupEventHandlers();
      return _this13;
    }

    _createClass(Modal, [{
      key: "destroy",


      /**
       * Teardown component
       */
      value: function destroy() {
        Modal._count--;
        this._removeEventHandlers();
        this.el.removeAttribute('style');
        this.$overlay.remove();
        this.el.M_Modal = undefined;
      }

      /**
       * Setup Event Handlers
       */

    }, {
      key: "_setupEventHandlers",
      value: function _setupEventHandlers() {
        this._handleOverlayClickBound = this._handleOverlayClick.bind(this);
        this._handleModalCloseClickBound = this._handleModalCloseClick.bind(this);

        if (Modal._count === 1) {
          document.body.addEventListener('click', this._handleTriggerClick);
        }
        this.$overlay[0].addEventListener('click', this._handleOverlayClickBound);
        this.el.addEventListener('click', this._handleModalCloseClickBound);
      }

      /**
       * Remove Event Handlers
       */

    }, {
      key: "_removeEventHandlers",
      value: function _removeEventHandlers() {
        if (Modal._count === 0) {
          document.body.removeEventListener('click', this._handleTriggerClick);
        }
        this.$overlay[0].removeEventListener('click', this._handleOverlayClickBound);
        this.el.removeEventListener('click', this._handleModalCloseClickBound);
      }

      /**
       * Handle Trigger Click
       * @param {Event} e
       */

    }, {
      key: "_handleTriggerClick",
      value: function _handleTriggerClick(e) {
        var $trigger = $(e.target).closest('.modal-trigger');
        if ($trigger.length) {
          var modalId = M.getIdFromTrigger($trigger[0]);
          var modalInstance = document.getElementById(modalId).M_Modal;
          if (modalInstance) {
            modalInstance.open($trigger);
          }
          e.preventDefault();
        }
      }

      /**
       * Handle Overlay Click
       */

    }, {
      key: "_handleOverlayClick",
      value: function _handleOverlayClick() {
        if (this.options.dismissible) {
          this.close();
        }
      }

      /**
       * Handle Modal Close Click
       * @param {Event} e
       */

    }, {
      key: "_handleModalCloseClick",
      value: function _handleModalCloseClick(e) {
        var $closeTrigger = $(e.target).closest('.modal-close');
        if ($closeTrigger.length) {
          this.close();
        }
      }

      /**
       * Handle Keydown
       * @param {Event} e
       */

    }, {
      key: "_handleKeydown",
      value: function _handleKeydown(e) {
        // ESC key
        if (e.keyCode === 27 && this.options.dismissible) {
          this.close();
        }
      }

      /**
       * Handle Focus
       * @param {Event} e
       */

    }, {
      key: "_handleFocus",
      value: function _handleFocus(e) {
        // Only trap focus if this modal is the last model opened (prevents loops in nested modals).
        if (!this.el.contains(e.target) && this._nthModalOpened === Modal._modalsOpen) {
          this.el.focus();
        }
      }

      /**
       * Animate in modal
       */

    }, {
      key: "_animateIn",
      value: function _animateIn() {
        var _this14 = this;

        // Set initial styles
        $.extend(this.el.style, {
          display: 'block',
          opacity: 0
        });
        $.extend(this.$overlay[0].style, {
          display: 'block',
          opacity: 0
        });

        // Animate overlay
        anim({
          targets: this.$overlay[0],
          opacity: this.options.opacity,
          duration: this.options.inDuration,
          easing: 'easeOutQuad'
        });

        // Define modal animation options
        var enterAnimOptions = {
          targets: this.el,
          duration: this.options.inDuration,
          easing: 'easeOutCubic',
          // Handle modal onOpenEnd callback
          complete: function () {
            if (typeof _this14.options.onOpenEnd === 'function') {
              _this14.options.onOpenEnd.call(_this14, _this14.el, _this14._openingTrigger);
            }
          }
        };

        // Bottom sheet animation
        if (this.el.classList.contains('bottom-sheet')) {
          $.extend(enterAnimOptions, {
            bottom: 0,
            opacity: 1
          });
          anim(enterAnimOptions);

          // Normal modal animation
        } else {
          $.extend(enterAnimOptions, {
            top: [this.options.startingTop, this.options.endingTop],
            opacity: 1,
            scaleX: [0.8, 1],
            scaleY: [0.8, 1]
          });
          anim(enterAnimOptions);
        }
      }

      /**
       * Animate out modal
       */

    }, {
      key: "_animateOut",
      value: function _animateOut() {
        var _this15 = this;

        // Animate overlay
        anim({
          targets: this.$overlay[0],
          opacity: 0,
          duration: this.options.outDuration,
          easing: 'easeOutQuart'
        });

        // Define modal animation options
        var exitAnimOptions = {
          targets: this.el,
          duration: this.options.outDuration,
          easing: 'easeOutCubic',
          // Handle modal ready callback
          complete: function () {
            _this15.el.style.display = 'none';
            _this15.$overlay.remove();

            // Call onCloseEnd callback
            if (typeof _this15.options.onCloseEnd === 'function') {
              _this15.options.onCloseEnd.call(_this15, _this15.el);
            }
          }
        };

        // Bottom sheet animation
        if (this.el.classList.contains('bottom-sheet')) {
          $.extend(exitAnimOptions, {
            bottom: '-100%',
            opacity: 0
          });
          anim(exitAnimOptions);

          // Normal modal animation
        } else {
          $.extend(exitAnimOptions, {
            top: [this.options.endingTop, this.options.startingTop],
            opacity: 0,
            scaleX: 0.8,
            scaleY: 0.8
          });
          anim(exitAnimOptions);
        }
      }

      /**
       * Open Modal
       * @param {cash} [$trigger]
       */

    }, {
      key: "open",
      value: function open($trigger) {
        if (this.isOpen) {
          return;
        }

        this.isOpen = true;
        Modal._modalsOpen++;
        this._nthModalOpened = Modal._modalsOpen;

        // Set Z-Index based on number of currently open modals
        this.$overlay[0].style.zIndex = 1000 + Modal._modalsOpen * 2;
        this.el.style.zIndex = 1000 + Modal._modalsOpen * 2 + 1;

        // Set opening trigger, undefined indicates modal was opened by javascript
        this._openingTrigger = !!$trigger ? $trigger[0] : undefined;

        // onOpenStart callback
        if (typeof this.options.onOpenStart === 'function') {
          this.options.onOpenStart.call(this, this.el, this._openingTrigger);
        }

        if (this.options.preventScrolling) {
          document.body.style.overflow = 'hidden';
        }

        this.el.classList.add('open');
        this.el.insertAdjacentElement('afterend', this.$overlay[0]);

        if (this.options.dismissible) {
          this._handleKeydownBound = this._handleKeydown.bind(this);
          this._handleFocusBound = this._handleFocus.bind(this);
          document.addEventListener('keydown', this._handleKeydownBound);
          document.addEventListener('focus', this._handleFocusBound, true);
        }

        anim.remove(this.el);
        anim.remove(this.$overlay[0]);
        this._animateIn();

        // Focus modal
        this.el.focus();

        return this;
      }

      /**
       * Close Modal
       */

    }, {
      key: "close",
      value: function close() {
        if (!this.isOpen) {
          return;
        }

        this.isOpen = false;
        Modal._modalsOpen--;
        this._nthModalOpened = 0;

        // Call onCloseStart callback
        if (typeof this.options.onCloseStart === 'function') {
          this.options.onCloseStart.call(this, this.el);
        }

        this.el.classList.remove('open');

        // Enable body scrolling only if there are no more modals open.
        if (Modal._modalsOpen === 0) {
          document.body.style.overflow = '';
        }

        if (this.options.dismissible) {
          document.removeEventListener('keydown', this._handleKeydownBound);
          document.removeEventListener('focus', this._handleFocusBound, true);
        }

        anim.remove(this.el);
        anim.remove(this.$overlay[0]);
        this._animateOut();
        return this;
      }
    }], [{
      key: "init",
      value: function init(els, options) {
        return _get(Modal.__proto__ || Object.getPrototypeOf(Modal), "init", this).call(this, this, els, options);
      }

      /**
       * Get Instance
       */

    }, {
      key: "getInstance",
      value: function getInstance(el) {
        var domElem = !!el.jquery ? el[0] : el;
        return domElem.M_Modal;
      }
    }, {
      key: "defaults",
      get: function () {
        return _defaults;
      }
    }]);

    return Modal;
  }(Component);

  /**
   * @static
   * @memberof Modal
   */


  Modal._modalsOpen = 0;

  /**
   * @static
   * @memberof Modal
   */
  Modal._count = 0;

  M.Modal = Modal;

  if (M.jQueryLoaded) {
    M.initializeJqueryWrapper(Modal, 'modal', 'M_Modal');
  }
})(cash, M.anime);
;(function ($, anim) {
  'use strict';

  var _defaults = {
    inDuration: 275,
    outDuration: 200,
    onOpenStart: null,
    onOpenEnd: null,
    onCloseStart: null,
    onCloseEnd: null
  };

  /**
   * @class
   *
   */

  var Materialbox = function (_Component4) {
    _inherits(Materialbox, _Component4);

    /**
     * Construct Materialbox instance
     * @constructor
     * @param {Element} el
     * @param {Object} options
     */
    function Materialbox(el, options) {
      _classCallCheck(this, Materialbox);

      var _this16 = _possibleConstructorReturn(this, (Materialbox.__proto__ || Object.getPrototypeOf(Materialbox)).call(this, Materialbox, el, options));

      _this16.el.M_Materialbox = _this16;

      /**
       * Options for the modal
       * @member Materialbox#options
       * @prop {Number} [inDuration=275] - Length in ms of enter transition
       * @prop {Number} [outDuration=200] - Length in ms of exit transition
       * @prop {Function} onOpenStart - Callback function called before materialbox is opened
       * @prop {Function} onOpenEnd - Callback function called after materialbox is opened
       * @prop {Function} onCloseStart - Callback function called before materialbox is closed
       * @prop {Function} onCloseEnd - Callback function called after materialbox is closed
       */
      _this16.options = $.extend({}, Materialbox.defaults, options);

      _this16.overlayActive = false;
      _this16.doneAnimating = true;
      _this16.placeholder = $('<div></div>').addClass('material-placeholder');
      _this16.originalWidth = 0;
      _this16.originalHeight = 0;
      _this16.originInlineStyles = _this16.$el.attr('style');
      _this16.caption = _this16.el.getAttribute('data-caption') || '';

      // Wrap
      _this16.$el.before(_this16.placeholder);
      _this16.placeholder.append(_this16.$el);

      _this16._setupEventHandlers();
      return _this16;
    }

    _createClass(Materialbox, [{
      key: "destroy",


      /**
       * Teardown component
       */
      value: function destroy() {
        this._removeEventHandlers();
        this.el.M_Materialbox = undefined;

        // Unwrap image
        $(this.placeholder).after(this.el).remove();

        this.$el.removeAttr('style');
      }

      /**
       * Setup Event Handlers
       */

    }, {
      key: "_setupEventHandlers",
      value: function _setupEventHandlers() {
        this._handleMaterialboxClickBound = this._handleMaterialboxClick.bind(this);
        this.el.addEventListener('click', this._handleMaterialboxClickBound);
      }

      /**
       * Remove Event Handlers
       */

    }, {
      key: "_removeEventHandlers",
      value: function _removeEventHandlers() {
        this.el.removeEventListener('click', this._handleMaterialboxClickBound);
      }

      /**
       * Handle Materialbox Click
       * @param {Event} e
       */

    }, {
      key: "_handleMaterialboxClick",
      value: function _handleMaterialboxClick(e) {
        // If already modal, return to original
        if (this.doneAnimating === false || this.overlayActive && this.doneAnimating) {
          this.close();
        } else {
          this.open();
        }
      }

      /**
       * Handle Window Scroll
       */

    }, {
      key: "_handleWindowScroll",
      value: function _handleWindowScroll() {
        if (this.overlayActive) {
          this.close();
        }
      }

      /**
       * Handle Window Resize
       */

    }, {
      key: "_handleWindowResize",
      value: function _handleWindowResize() {
        if (this.overlayActive) {
          this.close();
        }
      }

      /**
       * Handle Window Resize
       * @param {Event} e
       */

    }, {
      key: "_handleWindowEscape",
      value: function _handleWindowEscape(e) {
        // ESC key
        if (e.keyCode === 27 && this.doneAnimating && this.overlayActive) {
          this.close();
        }
      }

      /**
       * Find ancestors with overflow: hidden; and make visible
       */

    }, {
      key: "_makeAncestorsOverflowVisible",
      value: function _makeAncestorsOverflowVisible() {
        this.ancestorsChanged = $();
        var ancestor = this.placeholder[0].parentNode;
        while (ancestor !== null && !$(ancestor).is(document)) {
          var curr = $(ancestor);
          if (curr.css('overflow') !== 'visible') {
            curr.css('overflow', 'visible');
            if (this.ancestorsChanged === undefined) {
              this.ancestorsChanged = curr;
            } else {
              this.ancestorsChanged = this.ancestorsChanged.add(curr);
            }
          }
          ancestor = ancestor.parentNode;
        }
      }

      /**
       * Animate image in
       */

    }, {
      key: "_animateImageIn",
      value: function _animateImageIn() {
        var _this17 = this;

        var animOptions = {
          targets: this.el,
          height: [this.originalHeight, this.newHeight],
          width: [this.originalWidth, this.newWidth],
          left: M.getDocumentScrollLeft() + this.windowWidth / 2 - this.placeholder.offset().left - this.newWidth / 2,
          top: M.getDocumentScrollTop() + this.windowHeight / 2 - this.placeholder.offset().top - this.newHeight / 2,
          duration: this.options.inDuration,
          easing: 'easeOutQuad',
          complete: function () {
            _this17.doneAnimating = true;

            // onOpenEnd callback
            if (typeof _this17.options.onOpenEnd === 'function') {
              _this17.options.onOpenEnd.call(_this17, _this17.el);
            }
          }
        };

        // Override max-width or max-height if needed
        this.maxWidth = this.$el.css('max-width');
        this.maxHeight = this.$el.css('max-height');
        if (this.maxWidth !== 'none') {
          animOptions.maxWidth = this.newWidth;
        }
        if (this.maxHeight !== 'none') {
          animOptions.maxHeight = this.newHeight;
        }

        anim(animOptions);
      }

      /**
       * Animate image out
       */

    }, {
      key: "_animateImageOut",
      value: function _animateImageOut() {
        var _this18 = this;

        var animOptions = {
          targets: this.el,
          width: this.originalWidth,
          height: this.originalHeight,
          left: 0,
          top: 0,
          duration: this.options.outDuration,
          easing: 'easeOutQuad',
          complete: function () {
            _this18.placeholder.css({
              height: '',
              width: '',
              position: '',
              top: '',
              left: ''
            });

            // Revert to width or height attribute
            if (_this18.attrWidth) {
              _this18.$el.attr('width', _this18.attrWidth);
            }
            if (_this18.attrHeight) {
              _this18.$el.attr('height', _this18.attrHeight);
            }

            _this18.$el.removeAttr('style');
            _this18.originInlineStyles && _this18.$el.attr('style', _this18.originInlineStyles);

            // Remove class
            _this18.$el.removeClass('active');
            _this18.doneAnimating = true;

            // Remove overflow overrides on ancestors
            if (_this18.ancestorsChanged.length) {
              _this18.ancestorsChanged.css('overflow', '');
            }

            // onCloseEnd callback
            if (typeof _this18.options.onCloseEnd === 'function') {
              _this18.options.onCloseEnd.call(_this18, _this18.el);
            }
          }
        };

        anim(animOptions);
      }

      /**
       * Update open and close vars
       */

    }, {
      key: "_updateVars",
      value: function _updateVars() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.caption = this.el.getAttribute('data-caption') || '';
      }

      /**
       * Open Materialbox
       */

    }, {
      key: "open",
      value: function open() {
        var _this19 = this;

        this._updateVars();
        this.originalWidth = this.el.getBoundingClientRect().width;
        this.originalHeight = this.el.getBoundingClientRect().height;

        // Set states
        this.doneAnimating = false;
        this.$el.addClass('active');
        this.overlayActive = true;

        // onOpenStart callback
        if (typeof this.options.onOpenStart === 'function') {
          this.options.onOpenStart.call(this, this.el);
        }

        // Set positioning for placeholder
        this.placeholder.css({
          width: this.placeholder[0].getBoundingClientRect().width + 'px',
          height: this.placeholder[0].getBoundingClientRect().height + 'px',
          position: 'relative',
          top: 0,
          left: 0
        });

        this._makeAncestorsOverflowVisible();

        // Set css on origin
        this.$el.css({
          position: 'absolute',
          'z-index': 1000,
          'will-change': 'left, top, width, height'
        });

        // Change from width or height attribute to css
        this.attrWidth = this.$el.attr('width');
        this.attrHeight = this.$el.attr('height');
        if (this.attrWidth) {
          this.$el.css('width', this.attrWidth + 'px');
          this.$el.removeAttr('width');
        }
        if (this.attrHeight) {
          this.$el.css('width', this.attrHeight + 'px');
          this.$el.removeAttr('height');
        }

        // Add overlay
        this.$overlay = $('<div id="materialbox-overlay"></div>').css({
          opacity: 0
        }).one('click', function () {
          if (_this19.doneAnimating) {
            _this19.close();
          }
        });

        // Put before in origin image to preserve z-index layering.
        this.$el.before(this.$overlay);

        // Set dimensions if needed
        var overlayOffset = this.$overlay[0].getBoundingClientRect();
        this.$overlay.css({
          width: this.windowWidth + 'px',
          height: this.windowHeight + 'px',
          left: -1 * overlayOffset.left + 'px',
          top: -1 * overlayOffset.top + 'px'
        });

        anim.remove(this.el);
        anim.remove(this.$overlay[0]);

        // Animate Overlay
        anim({
          targets: this.$overlay[0],
          opacity: 1,
          duration: this.options.inDuration,
          easing: 'easeOutQuad'
        });

        // Add and animate caption if it exists
        if (this.caption !== '') {
          if (this.$photocaption) {
            anim.remove(this.$photoCaption[0]);
          }
          this.$photoCaption = $('<div class="materialbox-caption"></div>');
          this.$photoCaption.text(this.caption);
          $('body').append(this.$photoCaption);
          this.$photoCaption.css({ display: 'inline' });

          anim({
            targets: this.$photoCaption[0],
            opacity: 1,
            duration: this.options.inDuration,
            easing: 'easeOutQuad'
          });
        }

        // Resize Image
        var ratio = 0;
        var widthPercent = this.originalWidth / this.windowWidth;
        var heightPercent = this.originalHeight / this.windowHeight;
        this.newWidth = 0;
        this.newHeight = 0;

        if (widthPercent > heightPercent) {
          ratio = this.originalHeight / this.originalWidth;
          this.newWidth = this.windowWidth * 0.9;
          this.newHeight = this.windowWidth * 0.9 * ratio;
        } else {
          ratio = this.originalWidth / this.originalHeight;
          this.newWidth = this.windowHeight * 0.9 * ratio;
          this.newHeight = this.windowHeight * 0.9;
        }

        this._animateImageIn();

        // Handle Exit triggers
        this._handleWindowScrollBound = this._handleWindowScroll.bind(this);
        this._handleWindowResizeBound = this._handleWindowResize.bind(this);
        this._handleWindowEscapeBound = this._handleWindowEscape.bind(this);

        window.addEventListener('scroll', this._handleWindowScrollBound);
        window.addEventListener('resize', this._handleWindowResizeBound);
        window.addEventListener('keyup', this._handleWindowEscapeBound);
      }

      /**
       * Close Materialbox
       */

    }, {
      key: "close",
      value: function close() {
        var _this20 = this;

        this._updateVars();
        this.doneAnimating = false;

        // onCloseStart callback
        if (typeof this.options.onCloseStart === 'function') {
          this.options.onCloseStart.call(this, this.el);
        }

        anim.remove(this.el);
        anim.remove(this.$overlay[0]);

        if (this.caption !== '') {
          anim.remove(this.$photoCaption[0]);
        }

        // disable exit handlers
        window.removeEventListener('scroll', this._handleWindowScrollBound);
        window.removeEventListener('resize', this._handleWindowResizeBound);
        window.removeEventListener('keyup', this._handleWindowEscapeBound);

        anim({
          targets: this.$overlay[0],
          opacity: 0,
          duration: this.options.outDuration,
          easing: 'easeOutQuad',
          complete: function () {
            _this20.overlayActive = false;
            _this20.$overlay.remove();
          }
        });

        this._animateImageOut();

        // Remove Caption + reset css settings on image
        if (this.caption !== '') {
          anim({
            targets: this.$photoCaption[0],
            opacity: 0,
            duration: this.options.outDuration,
            easing: 'easeOutQuad',
            complete: function () {
              _this20.$photoCaption.remove();
            }
          });
        }
      }
    }], [{
      key: "init",
      value: function init(els, options) {
        return _get(Materialbox.__proto__ || Object.getPrototypeOf(Materialbox), "init", this).call(this, this, els, options);
      }

      /**
       * Get Instance
       */

    }, {
      key: "getInstance",
      value: function getInstance(el) {
        var domElem = !!el.jquery ? el[0] : el;
        return domElem.M_Materialbox;
      }
    }, {
      key: "defaults",
      get: function () {
        return _defaults;
      }
    }]);

    return Materialbox;
  }(Component);

  M.Materialbox = Materialbox;

  if (M.jQueryLoaded) {
    M.initializeJqueryWrapper(Materialbox, 'materialbox', 'M_Materialbox');
  }
})(cash, M.anime);
;(function ($) {
  'use strict';

  var _defaults = {
    responsiveThreshold: 0 // breakpoint for swipeable
  };

  var Parallax = function (_Component5) {
    _inherits(Parallax, _Component5);

    function Parallax(el, options) {
      _classCallCheck(this, Parallax);

      var _this21 = _possibleConstructorReturn(this, (Parallax.__proto__ || Object.getPrototypeOf(Parallax)).call(this, Parallax, el, options));

      _this21.el.M_Parallax = _this21;

      /**
       * Options for the Parallax
       * @member Parallax#options
       * @prop {Number} responsiveThreshold
       */
      _this21.options = $.extend({}, Parallax.defaults, options);
      _this21._enabled = window.innerWidth > _this21.options.responsiveThreshold;

      _this21.$img = _this21.$el.find('img').first();
      _this21.$img.each(function () {
        var el = this;
        if (el.complete) $(el).trigger('load');
      });

      _this21._updateParallax();
      _this21._setupEventHandlers();
      _this21._setupStyles();

      Parallax._parallaxes.push(_this21);
      return _this21;
    }

    _createClass(Parallax, [{
      key: "destroy",


      /**
       * Teardown component
       */
      value: function destroy() {
        Parallax._parallaxes.splice(Parallax._parallaxes.indexOf(this), 1);
        this.$img[0].style.transform = '';
        this._removeEventHandlers();

        this.$el[0].M_Parallax = undefined;
      }
    }, {
      key: "_setupEventHandlers",
      value: function _setupEventHandlers() {
        this._handleImageLoadBound = this._handleImageLoad.bind(this);
        this.$img[0].addEventListener('load', this._handleImageLoadBound);

        if (Parallax._parallaxes.length === 0) {
          Parallax._handleScrollThrottled = M.throttle(Parallax._handleScroll, 5);
          window.addEventListener('scroll', Parallax._handleScrollThrottled);

          Parallax._handleWindowResizeThrottled = M.throttle(Parallax._handleWindowResize, 5);
          window.addEventListener('resize', Parallax._handleWindowResizeThrottled);
        }
      }
    }, {
      key: "_removeEventHandlers",
      value: function _removeEventHandlers() {
        this.$img[0].removeEventListener('load', this._handleImageLoadBound);

        if (Parallax._parallaxes.length === 0) {
          window.removeEventListener('scroll', Parallax._handleScrollThrottled);
          window.removeEventListener('resize', Parallax._handleWindowResizeThrottled);
        }
      }
    }, {
      key: "_setupStyles",
      value: function _setupStyles() {
        this.$img[0].style.opacity = 1;
      }
    }, {
      key: "_handleImageLoad",
      value: function _handleImageLoad() {
        this._updateParallax();
      }
    }, {
      key: "_updateParallax",
      value: function _updateParallax() {
        var containerHeight = this.$el.height() > 0 ? this.el.parentNode.offsetHeight : 500;
        var imgHeight = this.$img[0].offsetHeight;
        var parallaxDist = imgHeight - containerHeight;
        var bottom = this.$el.offset().top + containerHeight;
        var top = this.$el.offset().top;
        var scrollTop = M.getDocumentScrollTop();
        var windowHeight = window.innerHeight;
        var windowBottom = scrollTop + windowHeight;
        var percentScrolled = (windowBottom - top) / (containerHeight + windowHeight);
        var parallax = parallaxDist * percentScrolled;

        if (!this._enabled) {
          this.$img[0].style.transform = '';
        } else if (bottom > scrollTop && top < scrollTop + windowHeight) {
          this.$img[0].style.transform = "translate3D(-50%, " + parallax + "px, 0)";
        }
      }
    }], [{
      key: "init",
      value: function init(els, options) {
        return _get(Parallax.__proto__ || Object.getPrototypeOf(Parallax), "init", this).call(this, this, els, options);
      }

      /**
       * Get Instance
       */

    }, {
      key: "getInstance",
      value: function getInstance(el) {
        var domElem = !!el.jquery ? el[0] : el;
        return domElem.M_Parallax;
      }
    }, {
      key: "_handleScroll",
      value: function _handleScroll() {
        for (var i = 0; i < Parallax._parallaxes.length; i++) {
          var parallaxInstance = Parallax._parallaxes[i];
          parallaxInstance._updateParallax.call(parallaxInstance);
        }
      }
    }, {
      key: "_handleWindowResize",
      value: function _handleWindowResize() {
        for (var i = 0; i < Parallax._parallaxes.length; i++) {
          var parallaxInstance = Parallax._parallaxes[i];
          parallaxInstance._enabled = window.innerWidth > parallaxInstance.options.responsiveThreshold;
        }
      }
    }, {
      key: "defaults",
      get: function () {
        return _defaults;
      }
    }]);

    return Parallax;
  }(Component);

  /**
   * @static
   * @memberof Parallax
   */


  Parallax._parallaxes = [];

  M.Parallax = Parallax;

  if (M.jQueryLoaded) {
    M.initializeJqueryWrapper(Parallax, 'parallax', 'M_Parallax');
  }
})(cash);
;(function ($, anim) {
  'use strict';

  var _defaults = {
    duration: 300,
    onShow: null,
    swipeable: false,
    responsiveThreshold: Infinity // breakpoint for swipeable
  };

  /**
   * @class
   *
   */

  var Tabs = function (_Component6) {
    _inherits(Tabs, _Component6);

    /**
     * Construct Tabs instance
     * @constructor
     * @param {Element} el
     * @param {Object} options
     */
    function Tabs(el, options) {
      _classCallCheck(this, Tabs);

      var _this22 = _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this, Tabs, el, options));

      _this22.el.M_Tabs = _this22;

      /**
       * Options for the Tabs
       * @member Tabs#options
       * @prop {Number} duration
       * @prop {Function} onShow
       * @prop {Boolean} swipeable
       * @prop {Number} responsiveThreshold
       */
      _this22.options = $.extend({}, Tabs.defaults, options);

      // Setup
      _this22.$tabLinks = _this22.$el.children('li.tab').children('a');
      _this22.index = 0;
      _this22._setupActiveTabLink();

      // Setup tabs content
      if (_this22.options.swipeable) {
        _this22._setupSwipeableTabs();
      } else {
        _this22._setupNormalTabs();
      }

      // Setup tabs indicator after content to ensure accurate widths
      _this22._setTabsAndTabWidth();
      _this22._createIndicator();

      _this22._setupEventHandlers();
      return _this22;
    }

    _createClass(Tabs, [{
      key: "destroy",


      /**
       * Teardown component
       */
      value: function destroy() {
        this._removeEventHandlers();
        this._indicator.parentNode.removeChild(this._indicator);

        if (this.options.swipeable) {
          this._teardownSwipeableTabs();
        } else {
          this._teardownNormalTabs();
        }

        this.$el[0].M_Tabs = undefined;
      }

      /**
       * Setup Event Handlers
       */

    }, {
      key: "_setupEventHandlers",
      value: function _setupEventHandlers() {
        this._handleWindowResizeBound = this._handleWindowResize.bind(this);
        window.addEventListener('resize', this._handleWindowResizeBound);

        this._handleTabClickBound = this._handleTabClick.bind(this);
        this.el.addEventListener('click', this._handleTabClickBound);
      }

      /**
       * Remove Event Handlers
       */

    }, {
      key: "_removeEventHandlers",
      value: function _removeEventHandlers() {
        window.removeEventListener('resize', this._handleWindowResizeBound);
        this.el.removeEventListener('click', this._handleTabClickBound);
      }

      /**
       * Handle window Resize
       */

    }, {
      key: "_handleWindowResize",
      value: function _handleWindowResize() {
        this._setTabsAndTabWidth();

        if (this.tabWidth !== 0 && this.tabsWidth !== 0) {
          this._indicator.style.left = this._calcLeftPos(this.$activeTabLink) + 'px';
          this._indicator.style.right = this._calcRightPos(this.$activeTabLink) + 'px';
        }
      }

      /**
       * Handle tab click
       * @param {Event} e
       */

    }, {
      key: "_handleTabClick",
      value: function _handleTabClick(e) {
        var _this23 = this;

        var tab = $(e.target).closest('li.tab');
        var tabLink = $(e.target).closest('a');

        // Handle click on tab link only
        if (!tabLink.length || !tabLink.parent().hasClass('tab')) {
          return;
        }

        if (tab.hasClass('disabled')) {
          e.preventDefault();
          return;
        }

        // Act as regular link if target attribute is specified.
        if (!!tabLink.attr('target')) {
          return;
        }

        // Make the old tab inactive.
        this.$activeTabLink.removeClass('active');
        var $oldContent = this.$content;

        // Update the variables with the new link and content
        this.$activeTabLink = tabLink;
        this.$content = $(M.escapeHash(tabLink[0].hash));
        this.$tabLinks = this.$el.children('li.tab').children('a');

        // Make the tab active.
        this.$activeTabLink.addClass('active');
        var prevIndex = this.index;
        this.index = Math.max(this.$tabLinks.index(tabLink), 0);

        // Swap content
        if (this.options.swipeable) {
          if (this._tabsCarousel) {
            this._tabsCarousel.set(this.index, function () {
              if (typeof _this23.options.onShow === 'function') {
                _this23.options.onShow.call(_this23, _this23.$content[0]);
              }
            });
          }
        } else {
          if (this.$content.length) {
            this.$content[0].style.display = 'block';
            this.$content.addClass('active');
            if (typeof this.options.onShow === 'function') {
              this.options.onShow.call(this, this.$content[0]);
            }

            if ($oldContent.length && !$oldContent.is(this.$content)) {
              $oldContent[0].style.display = 'none';
              $oldContent.removeClass('active');
            }
          }
        }

        // Update widths after content is swapped (scrollbar bugfix)
        this._setTabsAndTabWidth();

        // Update indicator
        this._animateIndicator(prevIndex);

        // Prevent the anchor's default click action
        e.preventDefault();
      }

      /**
       * Generate elements for tab indicator.
       */

    }, {
      key: "_createIndicator",
      value: function _createIndicator() {
        var _this24 = this;

        var indicator = document.createElement('li');
        indicator.classList.add('indicator');

        this.el.appendChild(indicator);
        this._indicator = indicator;

        setTimeout(function () {
          _this24._indicator.style.left = _this24._calcLeftPos(_this24.$activeTabLink) + 'px';
          _this24._indicator.style.right = _this24._calcRightPos(_this24.$activeTabLink) + 'px';
        }, 0);
      }

      /**
       * Setup first active tab link.
       */

    }, {
      key: "_setupActiveTabLink",
      value: function _setupActiveTabLink() {
        // If the location.hash matches one of the links, use that as the active tab.
        this.$activeTabLink = $(this.$tabLinks.filter('[href="' + location.hash + '"]'));

        // If no match is found, use the first link or any with class 'active' as the initial active tab.
        if (this.$activeTabLink.length === 0) {
          this.$activeTabLink = this.$el.children('li.tab').children('a.active').first();
        }
        if (this.$activeTabLink.length === 0) {
          this.$activeTabLink = this.$el.children('li.tab').children('a').first();
        }

        this.$tabLinks.removeClass('active');
        this.$activeTabLink[0].classList.add('active');

        this.index = Math.max(this.$tabLinks.index(this.$activeTabLink), 0);

        if (this.$activeTabLink.length) {
          this.$content = $(M.escapeHash(this.$activeTabLink[0].hash));
          this.$content.addClass('active');
        }
      }

      /**
       * Setup swipeable tabs
       */

    }, {
      key: "_setupSwipeableTabs",
      value: function _setupSwipeableTabs() {
        var _this25 = this;

        // Change swipeable according to responsive threshold
        if (window.innerWidth > this.options.responsiveThreshold) {
          this.options.swipeable = false;
        }

        var $tabsContent = $();
        this.$tabLinks.each(function (link) {
          var $currContent = $(M.escapeHash(link.hash));
          $currContent.addClass('carousel-item');
          $tabsContent = $tabsContent.add($currContent);
        });

        var $tabsWrapper = $('<div class="tabs-content carousel carousel-slider"></div>');
        $tabsContent.first().before($tabsWrapper);
        $tabsWrapper.append($tabsContent);
        $tabsContent[0].style.display = '';

        // Keep active tab index to set initial carousel slide
        var activeTabIndex = this.$activeTabLink.closest('.tab').index();

        this._tabsCarousel = M.Carousel.init($tabsWrapper[0], {
          fullWidth: true,
          noWrap: true,
          onCycleTo: function (item) {
            var prevIndex = _this25.index;
            _this25.index = $(item).index();
            _this25.$activeTabLink.removeClass('active');
            _this25.$activeTabLink = _this25.$tabLinks.eq(_this25.index);
            _this25.$activeTabLink.addClass('active');
            _this25._animateIndicator(prevIndex);
            if (typeof _this25.options.onShow === 'function') {
              _this25.options.onShow.call(_this25, _this25.$content[0]);
            }
          }
        });

        // Set initial carousel slide to active tab
        this._tabsCarousel.set(activeTabIndex);
      }

      /**
       * Teardown normal tabs.
       */

    }, {
      key: "_teardownSwipeableTabs",
      value: function _teardownSwipeableTabs() {
        var $tabsWrapper = this._tabsCarousel.$el;
        this._tabsCarousel.destroy();

        // Unwrap
        $tabsWrapper.after($tabsWrapper.children());
        $tabsWrapper.remove();
      }

      /**
       * Setup normal tabs.
       */

    }, {
      key: "_setupNormalTabs",
      value: function _setupNormalTabs() {
        // Hide Tabs Content
        this.$tabLinks.not(this.$activeTabLink).each(function (link) {
          if (!!link.hash) {
            var $currContent = $(M.escapeHash(link.hash));
            if ($currContent.length) {
              $currContent[0].style.display = 'none';
            }
          }
        });
      }

      /**
       * Teardown normal tabs.
       */

    }, {
      key: "_teardownNormalTabs",
      value: function _teardownNormalTabs() {
        // show Tabs Content
        this.$tabLinks.each(function (link) {
          if (!!link.hash) {
            var $currContent = $(M.escapeHash(link.hash));
            if ($currContent.length) {
              $currContent[0].style.display = '';
            }
          }
        });
      }

      /**
       * set tabs and tab width
       */

    }, {
      key: "_setTabsAndTabWidth",
      value: function _setTabsAndTabWidth() {
        this.tabsWidth = this.$el.width();
        this.tabWidth = Math.max(this.tabsWidth, this.el.scrollWidth) / this.$tabLinks.length;
      }

      /**
       * Finds right attribute for indicator based on active tab.
       * @param {cash} el
       */

    }, {
      key: "_calcRightPos",
      value: function _calcRightPos(el) {
        return Math.ceil(this.tabsWidth - el.position().left - el[0].getBoundingClientRect().width);
      }

      /**
       * Finds left attribute for indicator based on active tab.
       * @param {cash} el
       */

    }, {
      key: "_calcLeftPos",
      value: function _calcLeftPos(el) {
        return Math.floor(el.position().left);
      }
    }, {
      key: "updateTabIndicator",
      value: function updateTabIndicator() {
        this._setTabsAndTabWidth();
        this._animateIndicator(this.index);
      }

      /**
       * Animates Indicator to active tab.
       * @param {Number} prevIndex
       */

    }, {
      key: "_animateIndicator",
      value: function _animateIndicator(prevIndex) {
        var leftDelay = 0,
            rightDelay = 0;

        if (this.index - prevIndex >= 0) {
          leftDelay = 90;
        } else {
          rightDelay = 90;
        }

        // Animate
        var animOptions = {
          targets: this._indicator,
          left: {
            value: this._calcLeftPos(this.$activeTabLink),
            delay: leftDelay
          },
          right: {
            value: this._calcRightPos(this.$activeTabLink),
            delay: rightDelay
          },
          duration: this.options.duration,
          easing: 'easeOutQuad'
        };
        anim.remove(this._indicator);
        anim(animOptions);
      }

      /**
       * Select tab.
       * @param {String} tabId
       */

    }, {
      key: "select",
      value: function select(tabId) {
        var tab = this.$tabLinks.filter('[href="#' + tabId + '"]');
        if (tab.length) {
          tab.trigger('click');
        }
      }
    }], [{
      key: "init",
      value: function init(els, options) {
        return _get(Tabs.__proto__ || Object.getPrototypeOf(Tabs), "init", this).call(this, this, els, options);
      }

      /**
       * Get Instance
       */

    }, {
      key: "getInstance",
      value: function getInstance(el) {
        var domElem = !!el.jquery ? el[0] : el;
        return domElem.M_Tabs;
      }
    }, {
      key: "defaults",
      get: function () {
        return _defaults;
      }
    }]);

    return Tabs;
  }(Component);

  M.Tabs = Tabs;

  if (M.jQueryLoaded) {
    M.initializeJqueryWrapper(Tabs, 'tabs', 'M_Tabs');
  }
})(cash, M.anime);
;(function ($, anim) {
  'use strict';

  var _defaults = {
    exitDelay: 200,
    enterDelay: 0,
    html: null,
    margin: 5,
    inDuration: 250,
    outDuration: 200,
    position: 'bottom',
    transitionMovement: 10
  };

  /**
   * @class
   *
   */

  var Tooltip = function (_Component7) {
    _inherits(Tooltip, _Component7);

    /**
     * Construct Tooltip instance
     * @constructor
     * @param {Element} el
     * @param {Object} options
     */
    function Tooltip(el, options) {
      _classCallCheck(this, Tooltip);

      var _this26 = _possibleConstructorReturn(this, (Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).call(this, Tooltip, el, options));

      _this26.el.M_Tooltip = _this26;
      _this26.options = $.extend({}, Tooltip.defaults, options);

      _this26.isOpen = false;
      _this26.isHovered = false;
      _this26.isFocused = false;
      _this26._appendTooltipEl();
      _this26._setupEventHandlers();
      return _this26;
    }

    _createClass(Tooltip, [{
      key: "destroy",


      /**
       * Teardown component
       */
      value: function destroy() {
        $(this.tooltipEl).remove();
        this._removeEventHandlers();
        this.el.M_Tooltip = undefined;
      }
    }, {
      key: "_appendTooltipEl",
      value: function _appendTooltipEl() {
        var tooltipEl = document.createElement('div');
        tooltipEl.classList.add('material-tooltip');
        this.tooltipEl = tooltipEl;

        var tooltipContentEl = document.createElement('div');
        tooltipContentEl.classList.add('tooltip-content');
        tooltipContentEl.innerHTML = this.options.html;
        tooltipEl.appendChild(tooltipContentEl);
        document.body.appendChild(tooltipEl);
      }
    }, {
      key: "_updateTooltipContent",
      value: function _updateTooltipContent() {
        this.tooltipEl.querySelector('.tooltip-content').innerHTML = this.options.html;
      }
    }, {
      key: "_setupEventHandlers",
      value: function _setupEventHandlers() {
        this._handleMouseEnterBound = this._handleMouseEnter.bind(this);
        this._handleMouseLeaveBound = this._handleMouseLeave.bind(this);
        this._handleFocusBound = this._handleFocus.bind(this);
        this._handleBlurBound = this._handleBlur.bind(this);
        this.el.addEventListener('mouseenter', this._handleMouseEnterBound);
        this.el.addEventListener('mouseleave', this._handleMouseLeaveBound);
        this.el.addEventListener('focus', this._handleFocusBound, true);
        this.el.addEventListener('blur', this._handleBlurBound, true);
      }
    }, {
      key: "_removeEventHandlers",
      value: function _removeEventHandlers() {
        this.el.removeEventListener('mouseenter', this._handleMouseEnterBound);
        this.el.removeEventListener('mouseleave', this._handleMouseLeaveBound);
        this.el.removeEventListener('focus', this._handleFocusBound, true);
        this.el.removeEventListener('blur', this._handleBlurBound, true);
      }
    }, {
      key: "open",
      value: function open(isManual) {
        if (this.isOpen) {
          return;
        }
        isManual = isManual === undefined ? true : undefined; // Default value true
        this.isOpen = true;
        // Update tooltip content with HTML attribute options
        this.options = $.extend({}, this.options, this._getAttributeOptions());
        this._updateTooltipContent();
        this._setEnterDelayTimeout(isManual);
      }
    }, {
      key: "close",
      value: function close() {
        if (!this.isOpen) {
          return;
        }

        this.isHovered = false;
        this.isFocused = false;
        this.isOpen = false;
        this._setExitDelayTimeout();
      }

      /**
       * Create timeout which delays when the tooltip closes
       */

    }, {
      key: "_setExitDelayTimeout",
      value: function _setExitDelayTimeout() {
        var _this27 = this;

        clearTimeout(this._exitDelayTimeout);

        this._exitDelayTimeout = setTimeout(function () {
          if (_this27.isHovered || _this27.isFocused) {
            return;
          }

          _this27._animateOut();
        }, this.options.exitDelay);
      }

      /**
       * Create timeout which delays when the toast closes
       */

    }, {
      key: "_setEnterDelayTimeout",
      value: function _setEnterDelayTimeout(isManual) {
        var _this28 = this;

        clearTimeout(this._enterDelayTimeout);

        this._enterDelayTimeout = setTimeout(function () {
          if (!_this28.isHovered && !_this28.isFocused && !isManual) {
            return;
          }

          _this28._animateIn();
        }, this.options.enterDelay);
      }
    }, {
      key: "_positionTooltip",
      value: function _positionTooltip() {
        var origin = this.el,
            tooltip = this.tooltipEl,
            originHeight = origin.offsetHeight,
            originWidth = origin.offsetWidth,
            tooltipHeight = tooltip.offsetHeight,
            tooltipWidth = tooltip.offsetWidth,
            newCoordinates = void 0,
            margin = this.options.margin,
            targetTop = void 0,
            targetLeft = void 0;

        this.xMovement = 0, this.yMovement = 0;

        targetTop = origin.getBoundingClientRect().top + M.getDocumentScrollTop();
        targetLeft = origin.getBoundingClientRect().left + M.getDocumentScrollLeft();

        if (this.options.position === 'top') {
          targetTop += -tooltipHeight - margin;
          targetLeft += originWidth / 2 - tooltipWidth / 2;
          this.yMovement = -this.options.transitionMovement;
        } else if (this.options.position === 'right') {
          targetTop += originHeight / 2 - tooltipHeight / 2;
          targetLeft += originWidth + margin;
          this.xMovement = this.options.transitionMovement;
        } else if (this.options.position === 'left') {
          targetTop += originHeight / 2 - tooltipHeight / 2;
          targetLeft += -tooltipWidth - margin;
          this.xMovement = -this.options.transitionMovement;
        } else {
          targetTop += originHeight + margin;
          targetLeft += originWidth / 2 - tooltipWidth / 2;
          this.yMovement = this.options.transitionMovement;
        }

        newCoordinates = this._repositionWithinScreen(targetLeft, targetTop, tooltipWidth, tooltipHeight);
        $(tooltip).css({
          top: newCoordinates.y + 'px',
          left: newCoordinates.x + 'px'
        });
      }
    }, {
      key: "_repositionWithinScreen",
      value: function _repositionWithinScreen(x, y, width, height) {
        var scrollLeft = M.getDocumentScrollLeft();
        var scrollTop = M.getDocumentScrollTop();
        var newX = x - scrollLeft;
        var newY = y - scrollTop;

        var bounding = {
          left: newX,
          top: newY,
          width: width,
          height: height
        };

        var offset = this.options.margin + this.options.transitionMovement;
        var edges = M.checkWithinContainer(document.body, bounding, offset);

        if (edges.left) {
          newX = offset;
        } else if (edges.right) {
          newX -= newX + width - window.innerWidth;
        }

        if (edges.top) {
          newY = offset;
        } else if (edges.bottom) {
          newY -= newY + height - window.innerHeight;
        }

        return {
          x: newX + scrollLeft,
          y: newY + scrollTop
        };
      }
    }, {
      key: "_animateIn",
      value: function _animateIn() {
        this._positionTooltip();
        this.tooltipEl.style.visibility = 'visible';
        anim.remove(this.tooltipEl);
        anim({
          targets: this.tooltipEl,
          opacity: 1,
          translateX: this.xMovement,
          translateY: this.yMovement,
          duration: this.options.inDuration,
          easing: 'easeOutCubic'
        });
      }
    }, {
      key: "_animateOut",
      value: function _animateOut() {
        anim.remove(this.tooltipEl);
        anim({
          targets: this.tooltipEl,
          opacity: 0,
          translateX: 0,
          translateY: 0,
          duration: this.options.outDuration,
          easing: 'easeOutCubic'
        });
      }
    }, {
      key: "_handleMouseEnter",
      value: function _handleMouseEnter() {
        this.isHovered = true;
        this.isFocused = false; // Allows close of tooltip when opened by focus.
        this.open(false);
      }
    }, {
      key: "_handleMouseLeave",
      value: function _handleMouseLeave() {
        this.isHovered = false;
        this.isFocused = false; // Allows close of tooltip when opened by focus.
        this.close();
      }
    }, {
      key: "_handleFocus",
      value: function _handleFocus() {
        if (M.tabPressed) {
          this.isFocused = true;
          this.open(false);
        }
      }
    }, {
      key: "_handleBlur",
      value: function _handleBlur() {
        this.isFocused = false;
        this.close();
      }
    }, {
      key: "_getAttributeOptions",
      value: function _getAttributeOptions() {
        var attributeOptions = {};
        var tooltipTextOption = this.el.getAttribute('data-tooltip');
        var positionOption = this.el.getAttribute('data-position');

        if (tooltipTextOption) {
          attributeOptions.html = tooltipTextOption;
        }

        if (positionOption) {
          attributeOptions.position = positionOption;
        }
        return attributeOptions;
      }
    }], [{
      key: "init",
      value: function init(els, options) {
        return _get(Tooltip.__proto__ || Object.getPrototypeOf(Tooltip), "init", this).call(this, this, els, options);
      }

      /**
       * Get Instance
       */

    }, {
      key: "getInstance",
      value: function getInstance(el) {
        var domElem = !!el.jquery ? el[0] : el;
        return domElem.M_Tooltip;
      }
    }, {
      key: "defaults",
      get: function () {
        return _defaults;
      }
    }]);

    return Tooltip;
  }(Component);

  M.Tooltip = Tooltip;

  if (M.jQueryLoaded) {
    M.initializeJqueryWrapper(Tooltip, 'tooltip', 'M_Tooltip');
  }
})(cash, M.anime);
; /*!
  * Waves v0.6.4
  * http://fian.my.id/Waves
  *
  * Copyright 2014 Alfiana E. Sibuea and other contributors
  * Released under the MIT license
  * https://github.com/fians/Waves/blob/master/LICENSE
  */

;(function (window) {
  'use strict';

  var Waves = Waves || {};
  var $$ = document.querySelectorAll.bind(document);

  // Find exact position of element
  function isWindow(obj) {
    return obj !== null && obj === obj.window;
  }

  function getWindow(elem) {
    return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
  }

  function offset(elem) {
    var docElem,
        win,
        box = { top: 0, left: 0 },
        doc = elem && elem.ownerDocument;

    docElem = doc.documentElement;

    if (typeof elem.getBoundingClientRect !== typeof undefined) {
      box = elem.getBoundingClientRect();
    }
    win = getWindow(doc);
    return {
      top: box.top + win.pageYOffset - docElem.clientTop,
      left: box.left + win.pageXOffset - docElem.clientLeft
    };
  }

  function convertStyle(obj) {
    var style = '';

    for (var a in obj) {
      if (obj.hasOwnProperty(a)) {
        style += a + ':' + obj[a] + ';';
      }
    }

    return style;
  }

  var Effect = {

    // Effect delay
    duration: 750,

    show: function (e, element) {

      // Disable right click
      if (e.button === 2) {
        return false;
      }

      var el = element || this;

      // Create ripple
      var ripple = document.createElement('div');
      ripple.className = 'waves-ripple';
      el.appendChild(ripple);

      // Get click coordinate and element witdh
      var pos = offset(el);
      var relativeY = e.pageY - pos.top;
      var relativeX = e.pageX - pos.left;
      var scale = 'scale(' + el.clientWidth / 100 * 10 + ')';

      // Support for touch devices
      if ('touches' in e) {
        relativeY = e.touches[0].pageY - pos.top;
        relativeX = e.touches[0].pageX - pos.left;
      }

      // Attach data to element
      ripple.setAttribute('data-hold', Date.now());
      ripple.setAttribute('data-scale', scale);
      ripple.setAttribute('data-x', relativeX);
      ripple.setAttribute('data-y', relativeY);

      // Set ripple position
      var rippleStyle = {
        'top': relativeY + 'px',
        'left': relativeX + 'px'
      };

      ripple.className = ripple.className + ' waves-notransition';
      ripple.setAttribute('style', convertStyle(rippleStyle));
      ripple.className = ripple.className.replace('waves-notransition', '');

      // Scale the ripple
      rippleStyle['-webkit-transform'] = scale;
      rippleStyle['-moz-transform'] = scale;
      rippleStyle['-ms-transform'] = scale;
      rippleStyle['-o-transform'] = scale;
      rippleStyle.transform = scale;
      rippleStyle.opacity = '1';

      rippleStyle['-webkit-transition-duration'] = Effect.duration + 'ms';
      rippleStyle['-moz-transition-duration'] = Effect.duration + 'ms';
      rippleStyle['-o-transition-duration'] = Effect.duration + 'ms';
      rippleStyle['transition-duration'] = Effect.duration + 'ms';

      rippleStyle['-webkit-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
      rippleStyle['-moz-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
      rippleStyle['-o-transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';
      rippleStyle['transition-timing-function'] = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';

      ripple.setAttribute('style', convertStyle(rippleStyle));
    },

    hide: function (e) {
      TouchHandler.touchup(e);

      var el = this;
      var width = el.clientWidth * 1.4;

      // Get first ripple
      var ripple = null;
      var ripples = el.getElementsByClassName('waves-ripple');
      if (ripples.length > 0) {
        ripple = ripples[ripples.length - 1];
      } else {
        return false;
      }

      var relativeX = ripple.getAttribute('data-x');
      var relativeY = ripple.getAttribute('data-y');
      var scale = ripple.getAttribute('data-scale');

      // Get delay beetween mousedown and mouse leave
      var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
      var delay = 350 - diff;

      if (delay < 0) {
        delay = 0;
      }

      // Fade out ripple after de�������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������������T��IhIBLy���Ze�i.K��WLts2�r;SBeS��"`b�fd}��M��m&	ΫL'�o0  �$
�����9S��d�l�r[��p�պt�e�o{�ڠ]���=�6kS���l�Ws,[.g+���]ɗ�=ߺ$��b��1!�n�w�{��U����S�a6����D&�Z#�:�<[�Ȗ�/�%0�h��7!�<�/�F�/�P����XO�>T����Zeq�
WHJ���R��˨���h�pZ����p���L7a���ɮ��X?(����g5L��	�0��̝�e�������B_��QbD¼�����O=���Х���Rި��V*/��X�������Z�:BH�&������W��sH��Q#؁q��P��z����e���Da>�UVR�=i�� zh��TMև	i�y�5񦤤�����,7È���F�;H)@��&�H[wJԲ����J˻fU�}ȡ@�U*c����SV�~�X��E��RJ.���c��^�Z����9z<�r�r@�њ������������X�`���m�?n)r,.��fL�.*���x�_�{d��1���`N/ŽH�%�C��+���2W��v=�[DU=����N;N�|�y9�ʍB�k�E�+��������:&O.�_���Ȋ�$���o��FFP���Փ��I����,͹������X'��Ո�z�:�N��*�(��d&�-��x�Q���5a��y9j$̩q�lH� P�J�җj5�,?���q;�˸�_*(Tc���\<E�?��~Ǯγ^�-��>pzqC�$ܮ�۶��֩<�g��b���~�'+R��&��<MD�!�P^�[��y���DnV����(<�UE�Gϕ���"}l��������;T�-AĮ����@�I���wG�kz!�^��S-<��oZ|[8��T d���MofRZ���?DLiCR�i������
7:�a]�%��v��@}��l}|�W�}�$�]NA,Ѱ���8F4966��F�|L>��1^iq$���Jc�Už{�����:ʃOVf�����+��X)�UN7�t7�� ���4i/��?vp֢��{&� �mSj�rifD���˟��x#��T�b���]�*�ԢPB���((m�KA�#i���������� 1e5�����[����0<�.��U�d���#N����Sdt����,7�lS7���S������(n�LG	��������U�l�l�O�! uɫHKG����d^v��ׂ�፼�<w��v�v���GL��b�0i��h�"���~��A���۷�����пNР�`xQ�[�>F]چ�^���Ç 9���~ X[�}Q�����GTG!ŕ0�P�|ڪ�(���WW\�0|u�4EIx���*N��٣���W�A2,ѣ}
��U<[�sb]J���-9N��ܪ�����В2O�]�.�!<-�3`[gd��S�G8K�����xW�ûD�����:�VI�ąc�E�3��7��gGe���Y}���t�����4V�i��vH�p��x�v�и���:\=�4�b���1�<!��yya�,K&� r�_�iZ͗������z1�wc���c�y
P�DȠN���v
?c:�♃��4���X���\ǘN�'?�/��$�B ���bQ$��9�~Y��љ�i���Ï�y��`��|�s}]Y��	8WM��]����>.�b$6>�*kb͂j����[n-D\dq)�B��Q�'
�C�� �@��b �?,���o;�4�Q<Fi��}d)�7$^+������5��?�XB>�{ǖ�s1�/�c6��֨�����Z����!�z�7�K���C7��NS�R;8�w��+�i���~�ϋA=Y?#�� Nt����ha��B��\O��E���r���ʑa���q'�o��1GH�bӄ����n��^��k5d;$v���kj�W��!3;$w��2� ?�M+��ޖs&I|� �-�P���n�Ls10w����׏K:�Ԁ�~85��	[ф�ߙΪ�/5��+jv����g"��:R�)�T�H	�XK)��G\�n�MX�1={�{M�~/��W����"��sv�!�#���C���TGNɯQ%������e�T�A���*s�a�-��UW�R�z�4�|K""ƃ?��LG)��
Bd�Ӱ�4��,X�j�7̇Yl���+�ETV����>�$�܍���Sŵ>{��㓚.�eK��h�Ťd�=<�ռ��謐E����p��H��ήK1�d@$A9_u�U�+٢�ɑ�&{|��*�t��*Ʌ0���c�N�*���9�+@��٥.���mr�LQ"��ƀI,Y��n?�d���B�C%aZ��f��x��$bB�ZQ?9�EM����
���H��[n�}~��)�ޔM�ǐ;�f:!-������{xX�7�y0���䴩4�C��:���5��[��\3c�-k�N������ˣ��@�fB�6�bG� ��'� Ǒ�ԁmtK10�U��؈�_��3��nn���K����U��9P�kD4�^�@@O�0�M�{�J���*k��>��#!p-��c-ѡ�,�ɺ�a����C1Yuh��˷KBu�
��F�L�	��� .�yH��� ��;d��������e�͒��Qѡ�2�j&|�����Q�I(��tޛ�ά���/|�Opԑ2�2Ҿ#\��8���TS��'��00�������Pj�|�B�@��bZ=�	��߳��Ț��@�NLJhB��Ͽ��3޶��vp#˓�|t�ڟG�� �*���r�+��Z��r���ʕ�N�9Nq,�l&�R� j>��{��XDH�1T9��&��֡�7�:|�0A�,����x?j)�|��aS�7!3�;ȑЅ:��TSŐ%����,��Q�ZS�D簨ԡ��&'5�H�~�(<EZ���uhr���c�>n�%���ʸ�b����!��<����h�\�1���1���̂�
mRn��ķ�x�c�u�ز��}����@�=��6%�W��1f'������t�1*����)k�~��a�;������ȼB���Z��ΜEv�p�e�	��
�N;D���ҵNN#��	�.��/�7 o�p���>#��tS}ZϷ�>�<��=�+�:&�h�� ��]�-j���!�OۜZ�b�Z	3eA�O����ȡQ����yjȃ;x�PU�|�$G&����j�-{%�98���c�A�,�xy�%D!�,I�f��\�j;�L�@���0�����@L����>/.����P�������g҄,H�_j����d�3��s\4�U����9���2�����&$2�����W��5�>�����%|B���J~��}D���{�g�ὣ�h�g|�;+���je�|<�lX�>F�dsD��BR��T���V����x*��ڷ�y6;��(ޒ�/��f(�.�l�Տ0�4�
>?��a��W()e?/m[�1�ux��Mς��0k��g�bX�n�0VyYE2dEc>\*��8E��d(2�$��"�D��D �P���Մ�s}�T�	 iv
n]�	��* �/��L��rB�M�It���SJ��U9��#.x����y�ߍ#�6=�/ߓ*�^�F���ػ? l��7�
@0� �� w��HS��&���B��9���r3k��:�����5�?Zk�����*�4n��!��y��V�0����Y�;��HKL6� ۈ��Ok!��~�CDBb���` �0��W����nL>>DP����,IF7aن)ٷ0_?G��Ɋ������UCEe����g�k�\��̗�0�=�M����~}�&!�~8L�(|I6M�>�$�����_�B�"�v�H���ߗT$��N���/��y&-�tN���Q�Z8g��pԶS̳f�z�-�(�O��'ȥ��������z��|#�:UZ�@�Qf���95?7L�����V�=3*���hĚ�I'ٛCS����Ŝ�A���Z�ĕ?�/F���%��O,����W����X:�R�/���n��q��=��㆝T�0w�}�V���p��D��hM������^��a�b���x�^V-k7!&�[Y�-�@�6ń�����ߤ����:���y6�-T����2{QX�-f)e�z�6!r�*�E��!�y�{�i;��\�G�M�-'j�-�4[�jg��4�krV�h(ǟ+�f@ �^ӗb�`�ء���DA�q���H~����5T�r�֟�\�Ē�2$�H�9%����|%�ȿ��t��	�����������;����Z��f)�Җ�i$�?=`�0C�:*u�Lz5��7V�r�[�%|dF=��诌p�X\�Z�����1s�i�q�������=��D8k���4�둔��~[�1���UZ
ba�6��Ȏ���o�M�}��V�V�+�M�㾚�_a��V�[�!g�k���%�t��l9Ϳ�zs��?[��x8��8�G��]�]}�i(7m���%��qwr��%<v�y����"��\�f��gZh&��S@9�m%�j:o2�(�Ҝ�S,�I��tpO���F����s(h�g�[�u٬7����/}��d���~��b��b�6����/�־����������S��u��xY��HE������u�/F��f]��nO��UM7��c����
>���M��XMZ?b�W#=�� D-��j��P7%ǠL1A&&i�W~ T�W$:����N��i|��Z�ͳOo��
�G�F����dP)t��P�g�ͷ��
��s��q�-��kO����\!�w3����5U�^���b*H��{�O����J'FE΃�>"z!�C#X[�!�!��@�&Ц��%�ap�6�л�,+�2G�.:�o[�7��_dJ]���mf�@J� �oj�SWJ�)��j�*��ln��:O�2�$1�տ�;���l�j\��R�-3/z�6�6������u���n|�"s2�Z�~���,{�ƴ�G�M{�]�T~���4��iυ�dXo���I�v\.��k0Q���xZ�n%��3E�T�g���OID٦~X�L�|�:1���Ռ��'���A�Z�$z�X��s$B�Pm��|Fp�,�)�M�Wְ*��+�^��#z>6��r�6�G)z���q_Nu�k��8���ק������ovBQ���1�Bn��淞Fmyt��{��k��CKT�e}8A�8�?R]f�y*��.Lpeʎ���Q�e�ϩ^>�[r��~�l�F�*a�~��Erg��Ul�S���(�~1�z��s�0�"���G#D�4��
׽�|�bV�
g9����2���5Ҳ]�錻����G�dV4�f�3'�l�g�%5 ��{��TE6����P�4�NZ��t�l3h�k�(��[C����I�+�Z��U)��Ї��r�l�a����^�:��x��<�"�EÒ��+N5��#
UGJB���Ų3��8��o<��|rB�{�q�S8����e�QH|�h!�p\:7>]b��E޶Z�-���~��}�)~8H��<�Y��$hLI3��Hs_F�mA�U�Gɤ"�����>.!0�t��I�������T&	�a1z&N��Snu���y@E���tO��1Bbf}<���I9o�D��ͤ����M���U�Ҡ19�7y-� :A��/�r��K������K�B��
��x�B����E?i��z�z�k����x/�+|��9n�{Τ�p�C���^6���tΪ������:�e�ι� ��d�\��OK� 6?-/"�E�(�v;S���i��n �|��>��1s��eM�!-��kR��X1�}��y�j�ٵC�r@�����yx>`�W /�st#6����D',��Z$��u٭*?[B}�J�p5t�)<��\�YL�����Q��K������	ޯ���y/U=��O�:�F�N��+kYr`~��W^(�b��, ?/�a�\������Y�;5C�kUZ��d��%���k쐰C6j�@���A�6���!��/iHjU��Te�9���];#nxA��%U�n_�M���"Hj���7q���Oo��.��A��}�/:���=J.cn��J�,g�ָ7oP���/���*�A*�7S�E:��/ut*�,�.�f��[�p��UR�Ir'��ȏ�=����T�JG�3���2LO��KM��3��h��)�>�˫������t��\��q�Jr,�bE�o!JESĎ�}{��U�F�Kt!bNs����)�7����8ƓJE'!�5�٠ 4���Z��E����-p��fg�&2p�H��.�2���eD�r����U�1�/�9�N<]�KN{���RI�È#t��*�3Α~�L{aÌd�zyu�`r1uhk9;��ub����;��H1!z��ݷj�.���`7���K�(,$a�*t���]� � >�#�<�BTc�8L]��#���K��-�)8y��	��үM��*d�׍�<9
��߄1��V�{Qj�S�J{
 ��S���Ɩ�dm�;W��V�_��IF����>,�.IMN���b���"��s���K�f��Y&�$��	��M�*zx�hD���]�"�����5ݓ�.��>f{���m�� �j}��(�����ϗ�1���i�!�<*bӐ�|/�BePip��ǒ�F��8��}z]���=?��i*�ܑ�C7�KE[�0���㏿4��\{U>���&^,����k�m�v�<���;���{d��m>U݉r0?��07}>�A=qD����d��&X�PbL��`��yqh{��*�<x�ڎu7geI���X`���x`���B�Fߩ�y���5(���`����)_�9���� ���QW��C�Q`)LAl��� ����J� �0�y��%�j�{��鯜yR�����f�vM��\p�׋e.CNi�;돉:ɖ0'�\�N�c!��Mp�b������
S,Ms���{�R[६+j�͏ˈ�� �
�k�p�3�
�L��H�/��_�FkTX�/��f��c� �A�b��$�e�n6_9�D)5ƛ�Ln>��~�K�s�\��b�k�(m�"TJH�ӎ��6����?����4{g����⽈�����R���<,�	����0z٤$�D&�~��/��'g΃ȒBx�$�|e�0|��p(VX�H��d?N���0��A+����4y�\Q"[��߃��!=R��ZB|ky�-���a멙yb���a�[�6���o
e�u)�e��r�y����[�r[(����C�ʫCm����S��a#I�(	@X:��Q(��\�q�r��[Dl*����@�G�AuiJ�* =�(b>$���@u�+Ķy)�8?F5�8��֡9R�A����Qh�-�+��e/Z$�Sb&�k��m�^͝���b�c�߃�&�aQT9�f�p;&U���eh���q:��_����� ��b�Lc �1����k}���p�3��Lb]�[�ې�ˬG���a�5zg��+�I�l��<K�eۺ{EN�|��u]��d�����1_����94b[���z(��h�0���$�6] �4O�Q3�\��
��of�Qu�8���]��vzQ��ә���7��0�{��Qق����J2��+d�Eu�p�%rsH~\d��p9��Z���ۙ�uw�3�����т�lv������gʄv����!F��	���3h�U^3/9E���"���A�pD��i��]`:9�3�i)����خD�r�A�9:�H}����&�P�D����3��������Wq������P6MC���*�3�����%�S�Ӫ9^ae����A��ka2�qa��W���[й���	kcrJ��9���p��Ⱥ��6B���^��E<�C��2�3�D]Lol��0���x|p���&g��j�ß��P"��;Aݝ��W2o�V��X|ySJB�#Y~�$�Xaz *���3E��%�b��u�G��-�Ez䃦0��+I�j�n�%�m����ɠ�F��E@�UqX��>�Wox�S���ߙ��=�x��:����f|�٠�|\���u�o;�bt	}��ݪj��Q�4W7s���	�BJ����C��{K�C-y�7 Yg�^���ƶ�Vd�����z�j��̱Oq�A�Qc�-��O��Bl�sp <���9���Z�
�)�9F+7�m����tr@��lOC����;M�����:�6��)�t�)e�h�MDN���&�ߒ}}OD�8�N��Q�.�V@�{��0����OH���:c>G��u��6s!�`��z\4M��MO2M_���La�sѓmf&[y�}**^F�68'$�jĻ�q�6�H ��-����g���E�\��YӡBxL�b-�"�Lk.xI�:v9�����;t+�?�6鬂�@�p�|�>�6>(~�+)�]E�$(�{vF���5�(�:��ڹ�͍����SU��T�j�l�̬>=���Rt�=X(DM�G{k����=�&�╽g��`"�_�`��W���D�yL�%if�j�2/�@snnL�.7�'ٱ'W������8�Xlf���a�W��|̨Z�x"�G���'�� �t�M$�7i=M#��Lo^���&��Z%[����H;��g�Gj�T?�
��?��v�լ��Q�����+�$�Γ���jd?B>O$�M/٦Q�U�K�#f�0inK��{&\��D�ӿ����LϤ�}�V �9�n��g�.�adv���F�i��0�=��� ��# nT��/���Z8+ʍ �gZ��}klp�x*Y�V�C"��fP�Xg��L���A3,��|1m�M/
�I��
�B#���sxC�������O��<�V�\N�;&z��zG�Ͼ��9�Z��'��[�pA�*D<*�#5�i�E�'�:�
H��Fӭ2}��k1O�"&xS�8oD�#�/�X�耷��h�\�h�XĤD���g��+�]����G
������t{��9�5v:�g�$UN������9߰R|��xH�:�%͛"��-1��м��$�[.��&!���byXd�,��3go��B�o
����0��C'߀E�~N\��6�_Wv�����ބ�s�<�s����D���oQJ4��x��n�d��T1W�u��9!cV�NN�vA${���HG���.��*�/�~����HE��v�Y`ki�lb������es�V{D�2z]&[��J����b�������8$[ºDq�ˡ-�V�ul|^�a����I/#����0?r"R�I,�3�'��K2P��Br;�L��N��5�S6�~���p����MŻ�h�1�^?���r�b�~)wF�)�f�Y�D��(5�h-HË��ψ�Z|�.36|m��������|���i��>u�,5=�y�Z���u{��u�	X���6�����ٌz;�� t	�!ݡ����-�]PVlM��ȥ� �t̑#�K#�-��y[�R���}���F"&��i6fi���1��#m��f ��7�!fe�����O�9�#�ܝ��M������x����6>ɠ8Ed@H�bj��ľ�w.eVB2ϨB#��Ƶeh"|6OVf��d\��[+�E�B���,8�g��̹5B��CJ(��?��gX��A�m���k����F�Kc�^�W�,v�!j�S��38vi�8N@,/۝j��<���z��}ʧ�[F1%}~��׫�$vc�4 ���Z&ф8�Mg�!��R���	5�I�:���tlBo[���@�ʳP�n��:����4��7���E�O��\K���o⹶���_�d"���C�4�~�t���ɚ���a㊍i��{#�?�U��/]	�.�3<TS�$��(/ۦ�m�kf%lQ$sۊ4�$�U`���������ĚMwؒ�pB�	�*L<jU���(��=�ͣ_^:(�i��n�)c�I�<c��ݡ>_�W=��pVU�\��3� �.�i6�w̡�6������g�����v�YӉ�/��b$��QW�}��ӫ�*|�t�����}!���+B��o����k�X~&N��H�P�08����aj��JN�� ��bw_rbLh�Z
Q�ma��I����B�V����MF��;B8�l?�Xq����眏ƲI���Xg�Y9��w�ԑ�2W���=�cx�]��C$�\UT�Q�E3��w�P:�GE:vBq�j �xӢ_m��P|�88t��궪�	���sʌ�K�Κgd.f��pl�K��N�e�eN8�ȭ��"�k= ՚�����	�¯��Ί��������4�����G�f#��i���
Ξ�/���0����|�bgmrɼI�Wp:���S6�7|T[��y�`$���˽�:k��qv���o#�ɶ��]'��l��QR�*o]�kp�^�x�A�P#�~��QTC�I	��R�m N��0�W����bs�8t�O�
y����#������q�v`^k��p�{߿����i5��v���R��/>Zn��R���A�r�.L]��&��Nay��x�ӔL��b�;��8(�+�K^����u𹤲�$�(̳�(��R���6u;��0ΥO�__bFE�0��I�XM�TRҿM��L��r�9����I��Ȉs樆#x��a�E�Fu~�������zt+��G�'�4�q�ه��V�.�Y\��G��?�?E��`W��,>��<z�Z��d��L�g}μ�ڑE��-q�WuR@�i�/ǉ<w~���uUH/�U<E��We�߬�,p���`��^��`7T����:@(�m�v�K����-ڨg�`M��Uh8�5��%�W�Ör�9�;y�^\-�B!��@.�-�t�o���(�0��@���;���y�ع��_WD��Ả���3�x����!��gW�OfJ�s�7��bE�J����a��Bje�e�>q.�I�����9k&�\ޯ�HhN��	�,h4ۯ�0"��zjNniܓ8������VqpS�c&gap�=,�����U��'�V�����l�H�X��k+1����9\7'澪v�z����wg�XvڧFH�3�-��P�Nz,"�ء�M�Y}b��1E�2<�3�_u����~߫q��}�?��F/c���w��?����d����I+�+~h3�Y�b�����\�i

�jB���)N�&�/��I��x�ޜ7oۃ�p�Uax�3�!�ː�#-���T���n�DϙE���؄5cKC@-V�n%�<7���*�{��'�]]��'Q� �(��]�p�.��o��B���Ƽ��'V�$�v�]���.��"�=im��s8���(|����W�x)g��J�e��2D��i֩_��M�s�9�Ѿ=��J���^p~�۱�%�TT_�>QɪF���T��?ڮ�e]kw4ʾ�E:���6�}��~�ovNC�b�i�1bfnr�	2�s*ί��l�:0���am��7�s��n��$���JV.��҂�éR��V}5%,�"�`��Z�7:�v=pnFӠԻ?�aN���\�d>$�9�P�≘U���BV�N$g�����OG9����,�1c�e�1��K���r��Xƾ�b�2��vܓ�E�u���8_L��<�1�vnĉ.��@4"%~�����"�C���` �ok�3���Mߠ`��$�-%�YC��<�1a7[l�_q�����*&�̾�~Tc+����?�g��#��九���� �_�~w�$x)?��RLkp��"��DG(K��V������%t�Y@�G콼g���@�,r�7$���4���Ws�%˔����AId�=���
/="}�/��<-�dxuZ/�\���9b�[ 8{����fT�D<��ij׹�3�ʙ�
�OE��#� R�W��b�|U��{��@��|P��<F��0z�d�6jC�S
)v������VX�WT*|���0*�(k��|
���p�e4m%7|���N}��TM�CȪ�c�"���M�Z}��׌:�7����1e��/���t<�Q�Z�,�qw��p8�(�>1p������3~-���Cq��Z
pH����{>_�z�M���+q�ԣ�	��Z���>�g���$�{\���p螡�Rq5i
�O5;�*t������WF}����nO�&�lN��Iť���*3�@�����c�Kų�����x06`��\�Ss��g�(����\Y�_��sGh������R��"1�:�K�V8���P�J4�����k���	�� ����$a:��`�"	1#>_E��*����Tv�ک�p9���9��
(��i㲝gz��i�؜H{r}��h�Ԡy��<��z���q���|Z��VU)ӵL;����"r�a8����5���؝�J����U1]*���{>4�Rzз4��&̽�?����vy�3kz-�ۗ2�̎%��h��o�*�RM`V`YM�f�O/k$g�����[�t����>�E��v/�=)�O�X�v�Q~D�r�=~�Z`+aS���`���2�Ɋ 5��4���3up�z{�ND<�SX��pR�C8ԣ�@�t�쵊��?뭠�j�S���cZ�)
�y����Q�3�f�Z���j}�x���]g
�\{�t(����ꬩ��f�:ɰ�����)*���^OT��a�l����`e�
�C)����0���J($`�+*j�h2���O��+)�(��˩��2b+��'`��"����4Q�ѣ���)���������#2Z�q>�CџXp�<O��������I�h�k�����tM��S��V�KmGLZ���j���̀&y�+��%ʋA�C��?��Ewi�I�����PXN��/�����V9��u�^�LG�W�%�������g'6��OaH����u��2�{�b�΁��7����M��m|vS���"ԛ�,�/���Y����������,�1lq�����m�O���P^��~�VLv��;?v�����M���3���\�2s㟨� =�M�'%)P͏�{[C>��>����%�VLP��8�"�����X;��H�<W���лB�cQ�;r,wp��ϡ�ij���t�f�@����(4��U8:ٯ���@L{��N�{}NKS�A��Ql|���y�N��hM=qkO[����=���v�>~I?�Ve%���xM�[(?S�MΫe�]�@���ԥ���P�r�/ ���
w>G�W��P�Tʉ�zy*����{�V C�tZ]E���,���FV�R	�Υ�������ؕ�kȡrB����#���F��EM����������a+y�h�d����I��3��Q���-��A���$@)K߳�'�W����l��N~?D�#$q �}��`�RZ��?BQ��>6YG֋qu՟c����#n�Q��@��WG<����
��_Nf����&{(9҄��ҹ����Z�r��<z�"$��i�a
�Pd8*tL�j�*�aƩ\��p����ÔI��p""��7L˒�2o����?�����ψk�I��f��ʲ��?��1��֨�z��ϯ+���E�|��k#�����|Y�:�+#נ������pVy�|���{�w���=.�:��v����eox��Y�#�������Q���?+ рQ
�4>���ֹ��O�2�du�G!�eL8\1�-�H���6JY��h�Y�_�sohd1�k]��̗����dÎ=�����4��_u�Pfe��;��=��o�iK����V�ve �H���@mV*�3����_��Ƒ\OZ�A�p�,���⢄�N?s���0��Z�11��#�ȹW?��������TU�P�7�9Q=n�I�O��Qm���^�l{������>�Y����
q���l���?��ا�Q:�R����>P[u��w7aɿ�뤖Z�3�Rwco�)��"��o X���O.#i�����(9���C/2�軭p`��=�))����M�5�e���!�̭�u~�ݩ;�33�"�?�o�%�{C�8��!��z�mS�_���Z�73��#+���䑸��f� �3��>o�g;�Q�+���9+3��8����gBb�5dzH�j���ҏ���n���Κ3���q���o6ʄ8'��?AHmyEvB)�e<L���֎��{F�� {�a_��B�|���j 7�`��1�HC*�*��Zc�]t�ly-u1:����O�Wx=i�Eg7�lhO?֎��s�i��%�q@�\#
 Z�/
j�&���f���!{U�V�f��N:qsY�3ٟ\P%�1�� �+��SS:�i3����hv�o�'|�|:f�cl�s�<2�a��|Nl�+�����@��F�Z�W�-zB�29˽�^t�A'�O]y�}�/�r5��7���I�<���A�?����{�GV2 ڟ��Ñt#<,cl�a-U��L�!�29 m�g�p�W�@t�1��qc�?�� �SZ��U[��dV[	m�G}����4��n蠷CQ�����x�O�P;����,5����(�mr(?]%��$J�����s���l�p�""\!�,��{��}=SS�溾�}�+An@�1��U4ֳ�[j/`��c��06�D�d�V�ڼD��Vh����5���C+X�7��������B���o�Q�����@������,!)������P!$*&ҏ�_sWjk��uL��Z�E�9�
��:C��d����V�J��WQ�%�"}���֕���ea:y7�C��/�j��W}�)��U�ߋ�������҂���/FEq�?����~�%3�4'��(��v�U3���&��yG\pݗ������A_�S0�3����a�����e�a%�3p@+��� Be�j
��H��gJ;���>;����#�5."5���f���;%�덉���eo@��y��}�HQ�������^���~�Y�A�uY0�Q:���,ҥ��z�7����z�m�P�B� �&D����@�Ng����_eh����,N4[K0�do:�̾{�%����\��E�� �Md���X;�C�S
��
���ԨRG��M��N �0t�`�aQNr���W�������p�E�ez�*M\���n'ۄ���(�P&��?�;U�������S>U;�N+vw7�O-�wt��R�z�a���M�x�嗲�T�!)�cfk��YX3����M�^L,�� ��R�SLU�FW��b�;ǋV�3^��c������Ύ+�u#H�飄-ENy�[�/4��*�X��z����
9�����e������qɧ_`��J~F��MA�?�63��S,�
�T�M�Ϫy�[I�����Fp�Y:;\�ʻxt=�g��ۚ8�kVM	L��w��XBl>��=%ߵ�.�T3uIʗ�����g �p=(��Q���j��R���k���$}�׬+�_����Vvp��g�N��7=jD����7�roi<vm�š�C�=(�0�ϫ���R��L�$�*�z_�����U��A�.������`��&��{UA.��̢6��B��p��,[_�b�=I���}��@0��ސ���eJ���Y��������!7����Wz�Y���n'7��a
���$7R� ����RO��]���{��A�	�+"iqU�2��RV���6�g����(��
��j�A�q����p�\C��$�������)�`,�s��SKu�˖���D�E��ژ�!����Bݟ�%i�+��y�qc�2���� ��^�͞�?�R��K����?	���wf$���G*�_�����j��˟=))�rBq��۵������G��է�Wj�g@�dy_�|t�+��yj!op��/C7r���_a��E�S������{E���B�((���.��e�mVI�d�u��zX�,��O-��_����Fq ��"�ψ��c��Ob�d�%f�2����wk�v���ҕM�*�ɩ�s�u�4��7}2����*U	D�#9�	R�G�+��jz��w���`�e'<L�u���i��&v~��Ka�&e� �C-b?Sm�Ρ���G��"6O'dW�́O)4\��Y)3iK�a?L?�؅;'H~��*�̢� �
������y���e��8��po�5�.{h�e�HHQ
w��?gU vk��ey2g��[�u�x�WU|��M�=b����'�*�eV����zG�)�$ԙ'# @��d+52$C;�����+�K�2���^k�7$~[�₥��Đ2�iL�7�����^���T\��L���_-�����ea�'��\�맆�"�}h�5�+I N��HO\�����o�Y{�����I}�3�F���������`Z�"���]Z���Yǅ�F�._�8PYҟ:|KԸk,=@��9���%=\ɪ�t$X��Y(fE��Ԃ�GJ���}1��tZ=~�@�w`�a��_=7����A�=h�w�}��~G;Z�nw{�:��	<ҵ����V-cO��{DP���_"��Jj9B�?z��7�����<�'��N�U���}W��j�^�����3�і�e���(ɾIj)%|ڳ�?�M��! ͥS������<���u�P.�MPZE*6z����zEI�6����i��fW5���_��-��ΡF����$P/�����e��􈆰7�hz�wIE�YS�3`Tfڨ�� ��)����?�Kò�k{�L75�~��ZT���W�9�LQj���D���ց��qX�hp)+�B;^�ӱQ�f7�VwǠ�'�0D���h)��s�	��%/D1��~�6J/����϶�A�I^7{#���u�9//�u�C��䷸�}����cH0�U�.A-^�|����nߺa��T>����(\�]#ʫ&��O��o���B�W�$	ȿH	�!'��U�W,��<�<2��.�݋����Ί���y��X5n��Dp\b��I���_����CY�	q�Rf:���[�-_���j(@-0]dMI�B:�_�?��"髀桐u%m�`Z�1�dS�Ꞁ����&J�&�����VS�m//K�@]U�3�5<!k��K�uSw�<�~��/���%�� "O��h��et?\�Y��OW�WA��t�7�9�?����X�-}��X��Y-ebN����v�#Ui]^�]��V;����{w�Y������2ZV �8�Vu�E�\�j�xl[�Zg3�PD���L��;c��Z��D��J3�@�V��9�)ҿQ�5�ʶ\T��J�
;����|�&�|��i�9'}_d�[o�eʟ�C
_�R��cLg�c�9��T��9�_�lA�9A�z�@��8�(�w�l��(xE�4�-s-n5�߭�X��Sq��C�Uj��qux���3E4����Of}��>:I���͇�B�Ě�ZT�h	
���R�DKӤ~mV=��g�RU\m��t�w�q)�\J�76������Ede�t���z����~M��g6��Y�<��%g U�>Qp4������/����-����"ɝ)E�i�̎>��'z�MQ��$0Hg�#���4R���p�5��yz���x��,-��XM�HO�N_�i�KJ�a�^��;1�P���>�8�x}��1~�V�5�� �զS������Z��`*T����j)d΀�'^�3�L�u��2�K��)+16%�┒C�)n\����y�����u��ۉ��p�Hi�RVTj��&2������#B��nt�2�5�Ǘ���j�zm�MS0���j�� ����y��]�����q�$���ذY�.G	y�Z�N�NV�������ב����Y];�	����2Yeu�Y�d���u�>�:T8�yR5�M@M��w�<��R?^ʫ�����uWN^�/F��IQTp
�X�i��Tqf^Hݤ
.^��H�.��Ow-�j G ܑ_婻��<�$*c���,@}F̃�!Ʉ�����U�I�Y�sۯ0E����aT�}O{�$� ^�)E�u-�Q�9e���qgbĂ�!�B�����L��G-P赉�e8FN�z����H���L�޻k������Q��FH�G�B<�H\�]��2�/�ݞ��M�q���� ��,�[[���~B��<w◡K]�E��<A8���CJceu�(œ�w��h���\<��Ե�b��a��M7R����+���G������E ̻Vx>�+�����m�	�4� �t���	�B}}��`~:r���G$]�A�`G"��ip�EW�&5�	����ւ��o�a�Ɂ�D��h�JK"�l��3G9��A�A��p��y����dx�*�%v2�J���}������mgB�ya��n�y �4\��W��D��������,�
�|�) z���e�#���g��x��:�q��'�[���qEU�'��&�@��^�}qhq~��������A�RR��;���p���P{oKg�̂^��c=�6�ʕ�����f�������@ �Yo���E��Эq���+�ʭa�@"�=�}�������@�ݤ�K
.�\�-j�\qw��BcV�[�-���ۤ 8LА�;3�RQ����;iU�Cvq��RAxꬬ+�P/�ֵ��ҮW��38��8(W
h�zN@�;,�{98X��Ie3�	�a��T𦸡(���v?(ģ~p�����̾���������?��h;�Ҟ��Cf�%����k��ib�9�Z**�Fg���X�H>��o4Ȥh#�1^g ��}*�z}��90��N�0�
����/IO�M�CD&_	:���j���|�DvH;�8�~+?�eÜF�`lӢ�u��{g����H�`�j
�6K������[�$!�z
?U.4�ʻ�ӈ��vώM�Y��Ѐ��50A]�i��L� ��B]�G5����`�y��4� G�x����hD�Z֑yB�����~Ǥ(0���Zv�@ſ
��� ���������<��@u�N�!;H�4�����C���$C��M7(��E2ɘ恃�c-���Yh<F#k���H�AM�?���e�W��t�en9M���rٟ9ƒB��u[녏v./xJ�5��߼X�}�c�EE����e�x%ک/���pYp�r"
#���i89a8��݅�ph��x� A����Q��(�>(����8<��x��8����qnٝ궕��:�.�B�P��[]�?�����Ӆ�����!t���bL���<Ԁ�� ��K���1�r��y�ᐦ���/Dܔ K]O�*/�g�ͣj �|Ԋ�8��9���hI��D�&Ts�Bb�a�$�)�,�|.�3ĄL�M~�.渐80�L���_��vT��c2dj[k9����G5�eK�y�׼��:��<�g{��,��/�J�yM�^Α�=���d��>0�d�~֛;�*I��X�Q3���o������ğR��q���x���%����ܱ��3��W)�O���&i���8������;��{x�)%� ��)6jV���D��˅�K�)]eh�dT,�{�#q��:ж�T1�]d[��<S˻�7����-գ2�ܞ\�p��bh�zU��F|�}�Vc�]��:;�"|�����e�Nm��󯶏j�$>�	5Ո������ |T��z�(�;u[T��)��etڐ�Й�h6�0wL��"j*X�B9�F���Y�0���"�\���t��s�U��r����n}O1�W�_�P1G���H��D�J����J�
̷t�ڹ����#�6~N���V�Y�Ǣ6��S�/AF���2]���?cE��Zgz+vƟu�~P!8%k��2��L�o��7����=�9h5Dn�w"�s�� �����gk�;R���;���q � 0      �.�
�.�������������Ż������.�࢚0�    q/CA�E�@��ĺe�r�w&�$	�Cd*۶�>H@Ε��`�Ēf3�I�E�NjA&]���)      2  /2_~���x<!���l*,��~L1Hէ뻱G�G����%�/����� 0yC45l��F�H�BD���$⹺A��ga�;uS��!��@!����&�q���[�#Ez��2�r�$8��v�>�W��(!�^�����`�<F�7�����5$���+�k��K�)���\<��"I���l��A�iDr�pd�mQ��z9��@��-�����C�"�2�X8��z��k�U�S3��w�2� ���j��u�M*i�0٘a�Ǐ�"��
-Qw�Z67>��c�E�|�`]yi	�L��ѕ�a��|�~��ۛ^]�b�b�Q62����)ɩ �#PW�(޸"?Q�?=�=��Q��'�|�6�����5�t٫aebO�l���<]��� ��ka��iB#
}��z��p�Y���_��~2٧3B䂋a�8t�^�(����1E�OK;E*�m��K3�w��Yۯ���ܭ�"Um�%�~�3�O������/gC��6'�~K冼����z��r�"5hO��{N�݀���)-���7����� C�5e<���r�N鯣F�,�=���1�S�����C��P �����'h���1=65C�*p��F�����{q��q�4#85�PL[,ӧ��J�,�wi�g�h}f�~�Я����2��ѿ�AO������L&6ދ9�+`6���ơ����z;�־�,8~i8��,k椹zUh=�SJ��EYN[�e�G�x���O+���Ne�r��ò�^mk�T?�����I�s0��"���Rl�l ����z����*e4K��	L�u|8��C� �v�GD&@'~�;~����g9��HW_�̯�O�] �9ʧH�v��ȳ-iB��LR��9g�b_��ܧ3a��#`��	 *��q�u�����������rNk����K֩�r;g蛸���]3��
�����VֳoyD��Fq��HSt넷����q��u/�����}6��Y�EŘ���*�L,����k�+�؁���Dv�*�Y,m_��w� �SW!Tn~���\��<`//jSR�����p�9��g��OJE&��E�Ty77,��� ��Y�ѽ����m�t�՜#&�A� #�C4�������y�Qm�dM)=�٠�ӫܲÕ<������=i6r���\[�ʊ�1
4h�'6 ��-4գ�U�m�wqW�-�@�_.�5�OԤ�KB�/���7�ۗ�<�2j�p�C'����K��{�7];�5�8x%���̩%����LZns驄�)��]�^K�\>��P��njQj��	��>�����k���P-�L��S��:0�Q�N>�I
�����F�/2��	����5�����M6�yeڂ5x$F[��.3��b��d���-� `��m-K�¬Μ�Ā{�i9�6�R+��qJS���:-��r��>4\�,�C���Y�o�5�E��'c�N���
�u��n��g?��ÃS	���x��~�րx���]k��\ ot�k�-]����[ ;A91�`��0e�����6���ubs4�����()�¥I�d��}��
hl��S3����xPjfU��S�>��-��"�&h.�X�Ҵ6���S�ц��cyd�kF������%�G��9����qxd~'P� �4�:�a����|�8x��2�`w8������h�IG�S!���fU��#�=�C�$��������N9��G/hLwz ��DS���T�qMyt���"�-W;$��j3�l&P�nu� x �#��"�8����_就k�xT����i7c��i�T���K��ң�cEuf$��~�\Ϗ%G����Qmb�?.�c$�V�x���8��X���.�7�V�I�+]m�c�3�X�lp���+����u��hQ��r�6n=��2<�}F��.f?�у�'����gОDu�Ɲ�t9��-�<#�:�l��tc(� �ۃ+ �x�W����^�Ao��[B�G�_w/��>~L9�+����~rL���[�{P@��e�<O���ԛ�����넠j ��*���GPc�+~�s�wgX�ƽ����(k�օ����n�~]m�P��᥶.��p��4.�&6�Q!�V����@,M�G�9�Mw��դO�����?n�#zD=�>򱧋��6)� �4�1Pb8'ǜ� �R��$��5Q�Y��kk�BM�Q��ڶ���"�e�ہ&�9^�<���P�9k��=��6���^�2�d��2Z	�;��4�mif��2PA^j�n��	ḣ�H(r���U�q D��lr�z��Y�������VW��]e�ʅ��Uª{�������R8���3
�L�ٰ�%���$�HΊ�L'�5����We�S-�glne�S���Q��88U1̹ύ%�R��,����n�ip>��u��V,��=�'�G���'P)�M��vM�P��=O|��U��(w���Z��hr�Pe2ڋן����y����6H�Fܗ���_��{���7o�DT�A�� �:u@�޻�(u��Gd����Ø��^氣����T׊�T���u���5\��A�k8�
��[�*'���:k8�@I_;���]�-���C&S��tT����M?J4ͼD�{�"��'d5O�*�"�G&�: $�,e#�-�HD<[�Vj^>��Q!=�t?��o&�+���bO�{�R�o�����A)Ǎe�14� ���X�ÚM����5]�79���wE�4�~���3(F"��c�QS LλP|2�O�"�X�p뉭� HB�r��Æ�Q<�W���n��gn�׺�ӽyJa��02��Հ�UȨ�(k�2��ie��s���x�wF/ww^
�	$
���g�	��[�U�Zʀ`�vgOQΓ�h���+�CzojUR��r��U&TV��FC�{J��W(�G8ji��S�����K��zqM��=.���5�8l���4u�}5�g��T|�u@?g�(�Z:`q�$lr�,2�*�,�U�JGL��
f�q��>�4���x�Ng�7�O�/�b[���~�D��������1{�>�ƹ���*�[��2�1��:�vm�"Uқ6"�Bz��֠}a��ܡ�eK���*AnNt7���2�%�1Ʈ��K�AJ�Ep�O�,-v�_O�eC�p��<���A�Q�^X'M�{���$P��S�/ ��\4��F�����E?C~��WYO[���&5�L��p��JQ�zu{p<���rR�ًLɬJ�)*D�2�r0��ZY��A��0e�Ƶ���'����n���9�m�w=N:a�a�P��0�A�.�#3�B���?V��2�4*��J|��dbe�3�T�<\�2e��	*}�"o�|��rM��0��x��g�ZO�;bh����$���P?���!�خx�<�x]6'�Hq(���z=%���Ts�M�1�`�� �P� �����-���N�
Sq3�@?,	a+oT�:���y^�#o�Y�Z�� ��sU|���z�����>�ї���)���
9p(���p�����"�W���'�������)��(0��7n���C\I�M�Y�Ռ�rY�1`�F��t�=b]���2o��ˠ/��ގm9�@{xҼ��S[gZ�	Z����o�j��;��éa���}E#{�G����k�Y;b$���{��Í����8s��
�,�������lά��?��s�rS"���}UGr�mM)��� �j[p�]�"��s��O��$���l&7��b�<n�w�KUY -�wf��l�R����3C�����2��ѤA#`_!s����������~���҉���d��7"Z�ʍ60Ȅ'f��ܽ�̮}��+��%��֭��q�`�&o�R�q��V@i7�b����m��3�s��}t�LQx�2ɶB<�ŧ�cQ�oA��E겁�������EG�*>�ߠ"�qC.�����l1��H���&��������_wtbe�o�+����n/n�S�cw��J�>1��b��T���۴?f�"Hē��Ч�`f�\�����w�`R ~]�_˕{���7��?�� ��x�k�3m�4�w�}�2�,�ms�ֶ�q��W�-����H��&� �hA�k[RZtp�u����A��F�xi[��=(DT�!m��0�C,��kU~M=[ѹV<b�����E���6���9�F�#��b?(��}>j�[~.S������Ͻi�B�dƾ���|▮�{����C���8g���?��^�ni?�?��9�x�|������:��R��3X�Ԡ�`��)/k�/u8]��??�&��~����U&�T\�@�Ǎ��m?C��_�����+�>�aP��/L�_xT;��GK�<��܋��ff�������g�_�N��p�gGm�q��6�&5d���yZ�����P��PUArL���X���\1҃`(h|%����/B�|�<���%���H>1���g��Fނ����k��QB��gY�n��%}�m�U���G��F߰�s��5�)4�`��=ލ��ù�<1��GLٗ����Jtb�΂�������Nn��!Η�*���
]oq�DF.>)�.{�<�>v�x�i�a�=���xW?�nR���B0�����23��(.(2/T��\���?��wP���=���#cE ���wG����0���MU��B���V_l㋽m>��5r2�����f��uV���7��eK�  H)/8�ץ�e�����j�R��"�:f�%��Z:�=�#�A�����E���y� ��tS�#ܝND� @����`܍&�x������oӺ �����D�3w�Ts�d�����������u�:_�=��B~�����T�-�	J�������0p*@W":b|q���� ��(���#Y����:g'��Q��5뎌����o_��"�_�7�S8�O��1�kȧ�Z�E�����Ӊ�d��v҆�}˯�z���W�\�=�̓Sd�XΨ���cUSNu�R�i�'T�pJ��b6�?
]��8�od˩������\����g���o}x4B�զ6�a��E攌�!�~�������"���z��ŬѠ��R��m�M^�=g^~�\㯌��\����SC�VqRK^��U�V�&�������k`L���5�V�93^���7��%�X�d���<���ߺ�Iu8�	��T ���ͽ�P���k�V �����(f�|���l�?�ł�:�@cÀ�f";���R1��=v���|hv�f��w�3�4���hׅ0_e�����E�ͪ�Ű�9�d��c���A��-8웼M���ZQ��}\<�ݯ�`�A2yk㎥�>U)�k�l���֍�����hFP�՟�<,ܣ����,u�?1m���s�*ۭ8�A-m�V|\9�����#ޤ7����R�x�r��hB-4���$K��.z�t:�zFUF�Ӡ�����OŬ���f�4�N���������, C�P�����������ZJ`�0B�(��ԙ��a=4�?5S)���~&e�-?�Ƌz�m7�f&�-5r�h��A2��Ú�5V�4"��]b����ǁY�21� �����@��ɡˣ�(��.��X��>���vҗ)
N��߿�y0(۰��۔�,A�5(b�Xwe8MwL)^#��=�8?u2�� uo_���?��U�ȋ���d��x���c�y��_�>����P]g�C3<��
;k�Az�y;l�'_7(U���	���pS4,*���K��,fvs���)�i;\�� ��Q�
HIjZq.������+J�۞��E�߈��/B�ƨ�q���1�EARsk���������(}6��ANy~�I�[E�ׯwu��&�E�7µ�Y��r@hC?`����y���^������E�Ѣ#���'H����ab�S>@�k�̻\�޿��Y�����G����pe��6U%���j9W�rᘣ�I��W��C��Ӓ�)�lz]/ƺ��� ��3�=�Ѱ�������M�~NjY٢���A>f,&]�r�����������j9�>�I�ĝ������7,0���$贮(���%q,���/��f+�6* }����a(X����as� ���I:�"�C�QHN� _.����������X7-��<ËS� � ?����j4P{���~&,f��U�\��v)<⥅P�$�uz�W>	�`�`gW��Q�-;�[���(�)#�Pâ��B����g�д��7��
����*I���,�B<I��=*�+��2��ک\υa���� �I�����M&���H���I���'h��]�!-���0�Z��VSGv�r3A�%N�3�t���|��'dy��y��Rb�8�}lM�&Q�����h��Z���v��W�����j?��K�m�ߤ��~o�hƍB� �W�#I�?_��*�+Vd�O5�����sؽb2���_����_�B?'�����������'f�%��������LO��#Q��8��}v�� �kk	?f*�h�&�?��۪��g?����$a�g������5S�?����Ic��#�\��V���g�9 -s�S��P=Ub�L��ê$g�",�ww�ܖF�z�9�<7���>�*�ϹT��/(�{���>��{q��������'�6�RA6޿�������ѿk@��À�����Hu����v�n �����C0���Hшߥ��E���ܟ5��'�&���[E�����W��q��x������a���_*����X����Y��w��F؎Ir�2�yE�qfOІ�w8�-�1i���.ο���8k�4�3�H؁�t��$����"�I�9��"JZ�\(�+����~i��@��74�_���F��#σQ�d���,���ަԜ��������F�ƅ&����F���C���=�.�p~���k-���|�&|�
�x���{v����.�Z��)���-/� �ad(mA�@��:��1���R�V����g���f���_<e�҇�qĻ���~�]���{_��`��\Zͻ%d�1-XR ��o�N���O~���Gs���w"<�ץA����_�qUҒ)��Y�Yy�Wy�c��@�������o�gb��G��(����`���6���o�6�7��AF/3�"�����M	�nD�����
��ژb��݇��]"����UUn�������̳�N[��ȟx��J�&v�h<P�ϯ)ה�[P�5vX���`����(�3#��Dٿ�LR�M��%1Q6�,=&u�����9��|�<�+Y���>�
��aNj��v�8&�A&a�� �-�Y�LN�d�m� ���������;���3`��#�kgء4\�h���QH���
����)��ޮeT0���W��s?�ۊ����<�~Qf����x�-@�6���&X������(Dʡ�Lˇ=�{@�k��`�R����,(�,ʒ�@��Z�v�X��6�&y�������Tđ��ޒ�
�� ����]���Q�r@�����$�`_�I��ڧ���@>2�$�o��=�W����/5���r�d�r�Vδ�_�������L����Ia��Y��`��������={t{H�$�JV��i�$C�v~77�>|�Ya2w|"f���|gj��C����K�lod�!>BN����10F+#}v���zf��!!�Z���9+����ʎ�1�n2�I��Ƃ~��ѪƓ`	������R��}�}� pf��AO�rm��nk|�_���W�>Q�����i�攕s�5�5s�g�Q{L���;�L1gA�:!��G����"�98�#��^�R4+�m�tf�db�t*�,sH!�vS^��12}C�z ��h�P��y�.:�B�H[K�q/��j�*����������卧˶J�2&&v��a64����z�E*	�C��h���m�e9���U���}����e��iJ�X ,ʆ���D)�ݓ���)�ͥ�&E�q�Xj���|?�7s雖d���c���0���]w�b,�D���;o��t͢\D���_0c�v��o\�����U3��.�'���f�Iޑ��,�lj�8!sf��"�,�UCC��獨�{)8��l��9_���+��+��G���4��@ۯ�~;��m91(<�.�>�
p�Y�Uu'W�T9�Ke��o�M�.��]Y�Y{~��as�n�]t�'O�5�t���Mn����-V�ԝEfh����pǎ�(����'��'؆��wh��`Cj�:qX����*C+	��g���!�AC�
g��*� �U�*U���W�|vf�La~ٝ���n����-)�\O�p�5��h-�A����01^�R@oH�Q�h�Q�q��x������&��q��:�bq}fy���:�{+W�5�J�$�* 8����D�i5>�����'��Y;�B9��Af��M=/�"�����jB�	�&!��p/������{n��ms7[�?ܼ�`D�2��J�|ϒ��Y�י��Z�٨k�h��v�4(IV�W�a��t�c�P�"�f0�ɥ�eT���I�$�����Vxϓ��m��~��q�k����	�덢գb��տ�R�G�]@�|T�~MB���OOx^�7���4Yԑ)B3!xm?u.�Q� ���Lٮ����NE�`�F����f�T0'#��s�����dx��SE��o�@����ὄ�F7G�$���A���먴�)�l�\���t�;�u%�.6���?�k���2g�>K���47���c�t�����i�|�{P ���}������{D�m�ܙ
��c����e(L|ށ���������ͺ�K� �Q�5򝬳����
��d��Z�s�c߇YENv�63J�)��G�k�1f�$��f>�9C�����b�G�k��-�m���[?���(I�3���=�m�	#x�E�B��4�2�$u,�d�ˆ��	�~�(;И=���d�Ϧ��Y�k] w�
��@����<�Xm*2��a�n��ڬ=b�����4�J�}IQ��V@ ��� � �y-0Ol��p��*D�d�7��ү�X[cQ��ǂD�q�y���Y����b��������\����#����\��3~�U�JY��W-�:*praۙ��M;���|�Fs}>��ۂ�X�N��an3>�)҃cU �N�]��冗�4�:5̛,|ߨ>����쑔���%b��z4Ō�#i����k�)B�ӤSߐk�Ք��x5��#�A�{K~B��4�9�J��;���Uxu�)N51����~�}@3$'�����&��˼?����rŕY�/:�4��>��o� w�]���FL��!=]UA^�'2�����v��y*5��Yl��}�����)��^��xLɄ�KE] A��B�x
Z��eθ�͹��hQ:�ap�'J�Ĵu�xj(Ӝ��A7p�w�G
N��΄�e�<�z�%K=C��$�J���x����[E��n;�a���S�!�QD�av�%L��1�Vt���nϒ�?^nn-�ߦ&z����*,��zaZ�]��
��*��0�U{z<Ǉua>U]hU�>�|)�'8�������2]��k��H����=t9p��	���*��~�F(S�7K��` Ͱ����9agj�Vu�,g��G9��M��	R5V�l��{y6)a���	��w�3��#���Q".g:�	Z1��lJ��s�s��+ύ,�<A*v����94���Yͨ�0�ܨ!�iO:U_&v͔�lF�݈H�����[s�Gb� ��;&���pG�%�=1�:^���֓���>��+�`��4Þ]S0`؂��K�v�i�`�`����p��n�d��g�8 �xA��u���r~�w���H"T�gF?e��m #Z%��.�����wb6�~��]�a6�ڵ^�Y�p_��w���/7m��5� B�y���v~�6��M��-yTqI�r�Lg�6I)�:ta��Ŕ��9.�r!�~�%P�xV�wn-��Ը'�c�>v�.�abuf��:F�rE��� ]m\+��"U� _�B��D6��\��/�b5��Tӏ���2���Gj[�ēϞ�`ap��j�f`�O�E2v�`E�����U�E/
����|���ΰ2s�q篝h�=��QW���Q��Oݏ���d7�wfvofV���t�J">��?x(`��7Wk�^մ�,���蚡�K�(d�d���C�zŴ�mѰ�pUC��l�QK�8D�G�F�����7v�*�����eW����;�'p��lKdw}3 ��a��z`���
xPJ��Xç����(��T6Q�$'4��}_�Q����wlW$#sm�~������x��k��t�w�x���aͭ�#�8P�e)�����tA���&�ی�n>�����"{&�bҕ��B�'�͘f����裓��h@���VV���P��Y�����tn��ዌ�~ح���~�P��p����Nl����Qh&A�e�砙Xi%�t��4�%;j��!=/P�]\�I�{�C���aUmi��3���w�q��T�)J�s�SPIĴ�iʺ��zBnc�@	�?�	� �����m:ۡ06q��w�U�@�!c�,b�Ҿ&��C�sߊ`�v51���w�OZ�)t�!�I�WH��bΜlm�x��c�*}������-Ȣ�as)�L��
��9#�k��rKMŰ�5��f<�}>Q�S�C4?ii&�Ū��� ���f F��^?x������{6�t-BS�+.��͟h�7�c�$�6�\nڃ�0w��͞��z ^sgB��@E/�T�д�G�����u��r���&W��_�5��liQM@�;8����d�S7���&�w�*��Fc�3�6u@�1�{�Ƹ���� 3/wq|��Y�ƹJ�eL;�������pB�֯`U)�+�z>�y]~���\n�rk�^_.��(!f�������ɾD�۴&��8z�u�c*���(�Ԑ����Q�ȥE�z�u!���v��.a�D��Z��X1�FHu���:�<crq��a쫉������a9%�!'��4`�>֑�F�Q��}Ƌ�I�ӗ��%��~}.�@"=�f���'���>�ȑ�Ma[u֑�ܻ,���R�WfJ�͸ukxz0�vm�!��Oš}r@�t��_��_�s����sW�f�fQpZB������N���̶Z�wl5�E>yǠHl	�������$nO�ZW�c���¬X	u�mYU7�q+��Q����)8%�/H��]wJ��c�}[���YF.�g�'ӻ(�K��ڬ�/����'�|����:#�� � ���n�B���ٿ�����e�y:�k	TC�nb�� ����2%�%���77�Uq���Ʀ�Fv��Rz���I��g�z�o��qI�A����bτ1�D!���c"z�I�> �A�	80�����!�B�g�_"`�p�����Y:���U�繴;����(��e�ʰ�#o�����c��l��( �"<|��u�G��c���8=� ��XX@D����`��wM�\���0���#����I�?�˿H����& ��v���#��z��b���v�h:$58 � ~� l�K
� �X�" ��hx� R�X¤�_SC�<�.��_��p �ߎp��������)��ӓ�r:�{�D`Ŗ�u�"%��dLBAq��%�C��1I�b ç�'>����_����6���&h5�n<���˿s�����6�{�O]A�`���3�G�#��\\�3qXo�m�%�v.�� �M�����m"��.�)ay<]1\-x)�� �����l[>�,!>v.}:��q�B��_>uH�^~�~cY�׶�d*;I����~H�r���C[��5����r3����S���h����R1�z�}_Ϯ�6k��@�7�7���/w3>��)M(l��ٟO�
���¯�?�>�Tt�\\���\����-��^�]��/�����Ғ��@�����-��&\�15���P@�k8�\���$	|<�\���]S��쀹CC��`��#|F�aS�S����@� l�� �� |mc�*��3O+~�BF��3y�푲sB�R�s1s����0F(퓣��˨�}99�Ua��Q�@�rL��Pe(�%J�(��J'=��S��ē�G�#��ĳ454u��?���H��$$2���;z��"������
�)�����{
���Ϡ�=�����1vH`S����^����ъ�S)1�q��%�jHs��|�}�������ޱ`eu�������D�&�QT�m���fq����nm��?��=U��M�L���J8b	�#��OHN�e���1T��}���d�e)�a}!��}�AȞ'��"6iA@_�B�B�Bz�lka��"����t�R���q5�3f�T,����Z1}�Z:��U|��s
:z��vN�d�"��^�ps�
ʋ���u��<�v�v�}��<T5��|i8-��X:P�́�|p^�U�b��Y�|��F���(ͦ�Kѫ�y��N���-͒!�;2��\�0<»d�$��%�
r�R2t*t���[����424���j����jLhXQ����)ڴ�T!i"4�T��l�gvV�4�_<��e���vg]K�ނ���ꎔ� j0��m �0Sa�{c��Q]џ�a*���������Îe�Ij�Bt%;���E���H���H����>^R�h,h	����sO:*�[p]�+���u���\�Jվ+�U{��j�
�U0��
��j�
��4���9�t>tژ��I+枺�Z��*�j��������KU���|��QϱO '��-A�Q�����h����4����D��[8�>~~�p���-�$�t�_�-v��p��и�Re%G�R��h����-]��2��\�-?�:#N&-(�I	CY�B������f�I�\Ё�6c+��ϧ�*��ݵ��*��l��*��>1ΞC���ٝ�s�b-e�E+C���
�4����s��5�7�<_
��8 �G��.`��qWxۣ�6]����y��#ڧ�g���a<�:�~��8̘��o	l?���u��5a�	�K�\��lI��'��P\���D�Z��U(����L�Fs�T�odeda|u�T�����.Έ2�ThNM�bm���ó�/�)�+�X�tkƛ躡���*��������|��y��b��B�.����L�`r�ɕ҆�y��c#x>-�����/Qt�v��Y}YS9�G�ƃ�R[����ö1ڈ���/�ǅ��ʯ���n�@�.���P�*����I�L�V��ä�o�	#i0I�O�ÅY�-e3����l��F�O)���)imMY�*��4��I�T�A�Mk!��R38��TީHmR��n�pknY@·� �73�V�����5;We�ơDi!t�$Ş�	�5�� �����#Tt���+9�;L]ߙb`��/9��OkG��K���Q�� ��ib�i���W�X�۴ޡ`��6�O:O�O�O��1�ʍ�؟��0�i�aԛ����is�m����������߉�YOuG	ٽ�#�ВL��~Ô�>]c����5�p�O������r��)�"�%G���6ݺ�u�����N��0��� �~��!S�N�DiTN�e�kլ$�C����:��XQ��?��yK.��9�^]B����E�9m���vm�P;�� ���m8k�lC~ekj�=��+J)U������;�*-���Z�R]�ǚ։�և�x�`bˢW��O�;�`6���V՝����\�UO��ǏEϏȚ�*�k����DV�4�[CSQ�����kQ'��3�(��8*+N�0�rfiht����}BꏊlS`s��P��L��7?�'7��%%�n?���߸��Ӿ��s�-/�Y�Q���rr����Jw$zc��N�Ȏ����/�������*�%2��;�Ӑ?Ru��!ۣ����5����w?o����pjT���3���|$�\4�5\�\��ʪcq��`iH4��Tu�@�p�9#��SP����2-��	�Q>f��،��:�"R\��P*���q!Y`���=Wn��2���? ��s�ҋ�JI��j-u��6���W���edsW��������2���8/�}�W�t�[�
��m�[������}�Gm�� �yǺ�B�ң~yA?_J^�_-6ј��-w�=/mE<�lr��ǅMEW�zO���`�]҄S~>�b��4�8��6����qxO���	��<`Hs�&�"���k��V�{wi����-?�.�}o����s%�>�} �!�6d#�\"����1)�7m�Ji���.g��F�	����.����@8��"��!h|�0E]NxC�*p=X�w�P4��2$�� ���z����cq8?+7��0��F�C��=��4e*�A�U��^[��ߕ�a4Bw
30��� ���e�Z���Hn�>T��c���W|v��b��<K��3=A�ߺ��%������k�m�`�����u�X�s�@�*�Vf��5��	�����|�,��6yW YBL��)���J��%$@~�����W�1(���LϪ1�چU��Bk��rGHl�)�ȯo�o���J2'k�ƙbگ������]%��O���_�`l�xP�xx0�k�Ic79��b[!��>�~�3�%���o�ֵ,��V�TC��WLڻe�"^B�<IR��>��:��
��B�`V~~V��m����$F����=��؁O�Wל׸�]S-�<t%C+�c�kDġ1���Մ����m�M�JC-+¶fj���؛�C�v{�}?˳���cOU�&2i�w_1jx|"��򨃃EE�^�Zy��+���\)�Lהu�i4J�Ǧ��lCp^?7�S�*�z�$e�/�{�[!۽��2ui��s���T_��jѪpz��|g��CP�[rn���� ��1Ǣ9�����u����=2ֱk)U�Lu���m)k���Ӿj�%�f��ES��%��_��o'$�XP�)��_���#�w�2�ⅼ���m����ӗ�K	ԟEZ�����u��1��zz�ǔ�:y�#���G7{/��>�7IO2�+�i�4
DȬy#�n�;Ӽ��Ty1[ݗn /��`�/#t�P{7i��Z�`j�\�O�Ǹ��*��R��'MIy7�����2��3T�|,D�
����d8}U.�T�o��K�fˋG�ޟ'�OĹ��He���]��a����#-� �˶�
Wr����<Ŋk�x�� �f&7K:sq�+K�S�� o��"X�%Yi�E�^cʋ���g�p��gk=�o�:�����-���c��P�O���A�)�����7�NZ9����wl0��$���)�F��C��*Ϙ-��L�
��xl����+��<�z�8�Z�[�+�"n�y$��)�Nn���}?��,���፲ѫ�E"���y�Y���L\�qQ{��7c��c��f�9����SV�L5^ǭN�/�{��~��ف���l�K��~�y?n��!@B�*r��'y�x� cj.WH-R�)���������K�W%�̪`Q�a�+ΖȾ�[o@*��p�MhͰ�=.���J
�K�@��ti�I\���~�����	p�븂��nCa�> ��y�'V���{���笯�5f��O/�ȣr�<������S㾾n=�sD�5���o0���a=AɚZXD�@Z0|�����?��S�Tg�f_U�>
h�z.����&�J4��N�O#eWpȢ�u�]�.I;�6�]�o�����<������1��_�^}�\��*u\oڬ���ؙ�$�(�Sq?���*�!,���>��4E<D0�K?�ևx�E��[a�ҟ��"n���q]G��د�|�i��q,Z�~׿���z�e����6��1ڊ��� �%��C�������VU@�hl\�z(��������O�\̹1),��
~��;�F7�S�F���Ѯ�7�>�����)]pK;�A����]�<sH�w�����C��j�R���0o��:�T�������o�y�ޜ��pbc1���f;�ڬx��?�IA�r���]��p\#����LwOM�y�BW <�����N�L���1�Gv�ƵAw�tŽ��8�T���6A��/1����J=eXIb(T��T2��Vsü�F7u5ˁ��V�g�cc4���]�4B�eia`���6;-E+�4���
y�����������`6�z����y�^y;�2C�Lھ{U�4!!�k����&ʟ���`][Rxl�-9���X�����֟�A����G�dIt;��K��j�9hZ��;��3��̦C�c�Ps�+_��k--H��|<mk<�z���~���r�N�O%�g�3��ws�H\[�o���j���@̧7o�L��e�a��v��鋟B����+{c` U�b�D��Wc�vS�{��(	�i���Y��K*s��*P�fK_�F�����>��~�.G��ԣG��-�-w�x��X16�j_�͉�!�+Π�`�W:�����H��u�.6Dq���\�ah{z��?��"�׽�U��Y��[Ϭ� Ô�����<�h�`5�^kN0:?|�?i��`�/C�<���T�^ɱ�~�~�#��*j3�����nb���Ma����D����m`{>��ASu���˿y�g��y�j�T�7�\*ف[��mp����n�DIR%�v�#��a�s�L:�i=�@aw��j-i����B��vyOw��d����U��cR�'#]؛�K� Ms����U�LVr��њ"�zڈ�����N1�F�������o=n��#�g)M<�z��FIT?ԗn:Tu*�0|�A]S_��Q*�(Si����ƳN�z-�K����Ə���J���ь�~g����
$��W��H��~i�����KZ� �2Y���� ��m!��������l����J��ߨ��.�E,�F��c�m-��L��c;���h�=6X6���'KbCj�������b��J�m��M�"�_ӊ�����ܷ�5E�~ϗO8]ҕe*���u�?�<�Jcm�V]�Ƞ��nB<}�Ө�*^���O�=��L��
�
���!�g�� }�s����W\˖j�\isk�7&��[�z�f�jDui�۾�8E�݂W����/9��|�H�9ا%�ء�V�۳ewC��i��ÜZ���D\�~]׋@B�n?�%nLE����(�z��GLP��<A-���Wv`�P���a�s���+��O\�ԧ8�$��㕶!ʥ]y���Hz�K�,J����1���~A,�� l��S���¹6���U'��h�q�L&κ��+-Q��u��Y���0��X��kG���v���y�a�֊P�6�7�����z/��Y��w!Rf�@�_��D:T��� ����c�t�l����<%k���S��Dz�^?��+�i��B�d�I.�������<<�[y{:��u�X6�f�B�{�4���\�嶪VȈօ�R]���9������Һ�b��cP�5d'gؒב����yG!�EyT"=�_(�L��L,�D�\H��-$6�C�!�9��m�/��-`�R���6��"��Kk��z]]q� #`	 ��3��1y�Ξ��نc����8��Ǡδ5mj��H^Ξ�
��Aꗑ��>�A�d&#�[��QM;-י�������?j=�\^�f<���D�Y�xk��CB�k>k��<�G�oC;1��$�o�8��j3�����M��J�1����8��5��%?`Rh�dS�[yx����1oiX��EaʵNY���Y	��D�X4���CQ��`w1V$r�B`gn
G�����Mj~�U�3��({�P�p���Z��E��r���	�{���?�����V��\���	�B)�*ݘ�v��]2ڙ�h;�.��?���Ϋ��|�����iQ��k�`�#�n��^;�����o��
�(�I�/�A��ȧ��Q�z������Ze]�����-�g�e��oCg�m=tjW�x ��E��T�x~iy�y+��Y�M���i�A�q��͕/Sڳ����M�5JkN��p
���A�Od�Q:���YNl���-}G���\�����h�+��r���$��1j�.\�p�3f�����֚~;�����H0W��\M�Vq�A >⬁�TQBS��FI��ab/Hx�ӥ!�,+���H�y���t*�	�(mb���?.U�և�g�P���b^��t�V��4	�	̤����<>�y/!�KM��/�"��a:���(}uz�h�#��r�,�����V�۲�G���M�*{���T}_-v���N��mJR���G��ĵ��x3��C�%M�+	AI8=�V�2~�l�nk2�M�	���O�!ɼJ�,"dp��e�:���Se�S׊p܈N�o7M�l�-j
d/�������$�-���y��x��{�1�?/,��
ȧ�վ��]{�h�!�hZz��,�-qtT8��3ڤ\I�R��}9{Q��B@���>)4���T�d�-�~W�ػ�o���/��,�#w@�_,�<+��O�Z~�`^�ppbPQTC`)]-��
	�Q����vQ�"$U�qt��>���K��P8���I@u-�F�ו���2�,�(��g���M�v(�v�v�P��A�`��8�}o&/J�u*cؚ��'\��sQ�J�Ă���y�=,~���_�Ϗ�u��p_��~jX^��ޟW�l�c�e�P�[|5�,qO��
�;�󐿀U���_ԡ�Cn23J;�c�F���M ��K?�xdw$R�*2���� ��X�vT�
�fV6|����As4P��m�ȫ6C���_��t����:�n�����+�QI!G^�~µ��V�ur�(ۻ|&K��,.�xl��r�PX4߹�uA��=[��=
	H��X�㊌�W��i�)�n�����U�����")�)X_��
z��O�^��&��n�(L%� o
!��߯"�%I��<�\1�WKZ�М���ɾ"�pS���v��Е��Y-k�E�;�`���h�����9�[��z�]��T������61gr��t��M��wG�y$�h�咂&�#J��@D݀f�t��(g�PTF��r�R!�����V��Z��>�:���S3�ه�.�}%[A߁T����<�j�k�O��g�����M�a�x����1I//rN̾n�¯h\h�l�x��*��D/L@���v$�KA4��-wظ�����F�}k��[�^c�RO1��o4pv1�.����k���p?�k���a\`d����S`�lP͠J%�g�0�̙��p?�r����y	��|�%1��$���e�/�BO�dI��afz8��>���0Q��a�`�nȤw��5�HT8z��/!e�yTi�_Ѡ�&��I�]�rB?���w_�E�*��ׂ��nD(ܛ��`��A��= ��?�L-�Oqb�B��I���d�:4���I'����D��V�e�z9�iIvg��k�3��;`���P��9}rd.Y0ls��I�r5�'�������^�-k[i���Vs��$��Y�yS	�9��fl���
F��G���+>o(��kg�o�/:�2oI{�ٸ&�غ*'{>�ЯG�4�%�H�BJ�ƈݯf!�zK�ޟ�GNu��\�NԾ=qܓ*�-�Y�������eQ�)�9�p�R��Y�+&/#�L���Wx�XsW���
�O��Wc�,�5w$�mw?��}q��m,Cr)d�9ƥ�̼.��$+��2]�$�h�M��N��x�Q٩�0 ��L�Ez#�9 ��Z�N�73gR�E>Y<Q��A��0 �s7A�T���[K�<���j���Ŝٶ%���%=`AB7%���-���N��}�x��a�f�D�К[���cpn���Ƭ�a��񽳀�.=Z�f��Jv%�2l�x��:K5���{n�0bO�T{ۇ!����S�������F���1��hꇕR�((!q�t�C{�Md���ɠ8o�H��"�]R�������{��%�Zl�����QO]'1=�[���="�� 9[���`�-ʾ�(�>�!����� ����.�8�|����ꅪ�)��f-��Ap��B/>�,tUE�t����ɡ��S�f�9���oU�)V5�Fq�U$a]�I��?Y��K�_:���㊊�
�A�^3~:y��\��Z�r�d)s��=�A�H�"L-�f]$�+�a
�4$ԭBƧ>MϾ����O0���ˏJ	�ڿ�_�]Z�=w����k�Qw��#��"�u�]@Ѫi3g:O����� �J� �Z���Z����2��HA�O��[q訇��=*�������p4H��%�<S;'�MM$�}���͵���B�ݳ�����M�ى���]�B��p����zg�M�#!�}	Œ��ũM� n�aF3��!�}����?�6fdQJ~��9\�n{5F"]�tJ��>S���C��!�*���r�ļ��zXu�K�kW-�h��4�~"�!�?��%[E3�j�,"���?2�B�o��߂�B7۫xF�����s$���t�Ϧ��E�����)ٳ���S��h!ɓ��� 侂�ç�7���P��vp�R�xZ������:w`,^%lN�j�����`Z-bD�pYhB���Cڰ��|�T��e���,�ѱpMjwud9{�zny�b|������o�9D��ppQA�Sq�$��1��ұ�C��8�m�b��y�8\��%��ȇ@{4����Y񤦡�G�����(�q����8��=��dP�hQ18B�!I� !;֗/o��(�>1x�~#�iX��`h����a�M���,Ζbp�m�dy\���|�H�1M:�(mL���DLSz~�Tg�'K�YsOs�&Hޮ"aPJ�^��pT{T��+^'�\�T8����)�s�8�
����@P{#�= ������,�8n�'���DO�T�
>���7)�n*�4��J�;%������&G����3<��2��<vr��5��;�9��%�� me�����=ʥ�6��.�5�=��kS�p@��q ހ�쪀��Ѩ�J���_��4ү@T."�2}�x�H��T<�ۼ���r5���V�:��L���B�E���C#B�����MĂ�)��
+�F��k,F}،V*iK�'Vo����
����ݒ������5�	~��yܬ�.a�Ƈ����S,P6_b��Bf��x�����E ��'���gM��aI�K���`��n���W����`\���m��_]��2V:�����R���O۫���>�
�=��񏫏Z1�w������qKqP%y�"ѻ��3��G�'m�č8N�4�	6_�̟L�Y�x���8�}���tRN2\������@.��KQ-�Qn�s/9T��S��=��9����i�c膺�/��ɕ�i�NB�k�A9��h�7���;�_շ� ��K�yy�;�g/"���(������+���N�<A
�1�J���P��m�߳�'l
����V1�Ryi�Xw�E�w����i����ٚ�g���Z�!��lm7;\4�|S�����Ԉn"��_,��@���ӿr��~���]�MX�W�<�n��yNw��z�k��,Q�%�Ծ�I��z�������1S�l���?mDm���>��p�@A��d�Q*Ϝu��6(�E��ݞ�|�|�*�H����Q4s�k�@y�c?L��}�yx<���f���]ן�#�ի	�Q�U��J�O@nWg4և@m�4��">>�e��{�l�9�ݞ�3���M�?�}������^mSR����n�P'CC!�H�O�@FRCX�;E���ܞ&J�Q2l.�BC�%��2,?�����"|���9gW�q=d*��_�S��I��6XCو��\x�kV$T�m�.��)kcZ9�V+? ^���2UH�;��b��y@A�CYHD�wO��F�!�v��/��9��3�y��)/� �lŻ!ԏ�k����8����-]1��լO~�e�]�zC��u��@q<K��x&. �Z7!�ʹf�����Y
L���z4��yw�����+�a&�G���S��zrP�I:a4�M��e�� {fNy`���B����c�y�? ����Wި�K�]P�������S	�W��-Ӄ�	��`�n�倢r��K��#�]_�(Ti�ݎ���GܐjԨZ��w������u��������� ͡9�[s�~�x.�!O��b8*¡Y�&�:��S�mL�\�-䞳�VJ�_?��+����jP��G7��v�}��p�o�|-�R�>�֢oQT��ݗ��6E����;��fszwPre���g�k�{�@LV�Li*R�U#V�ߞ��D�ϳyH��$j��q>5ҭs2޼�BT_�%`�T}��ƍ�Y��^��sHOk|>g��	֫ǭx�G����x��Bg���+{��i��M���OK��x|^��������P�EIoe�_1^c)D	�\��t#I���Юq�9WLK/�ߖ���D���w-���nc���0��M�g^�p��j�ԱC/�l8Yk�p�����~�7@�L��4�I�e����6%��D]�ߪ��0�b9�N�>H���f Y�ѱ3��hX�B��ӿL���:A�mr�:� ��3��|�4�^j5��-p#��:*/��'+�L��ߪ��N�U&�O�~���@����j*/s:�7�{������]�J�Y8^�a���p�Iu�>�Ƚ���%" g�ު��.�VGY#h���q�h�ش�-R��lE�e�� �=I	�"��Z�GDv��SC��n��f��>�F�#"�t|jo��p�%�q� �9c��G��]�&����>��6��6)~̾��Br�W�UƵ`� �p���Lj�C���宸���BNx,�hҦ��P-a�ؤ+Yeۿ()��6E{$p�����+0�t��<�g=���M�zu��fa]*���1�"��c�V��v(�'��4
�Xf�\	�_�Af\����EA���lM��ޫDhY�f_f��-^�l�K��QΓ�y�0����KȈO����U�8����'�0��۶�`ڧ�ԯS�B�H
% 7q�ύ�y{˕�#Jc�
�؜P�A>-q [�u�����}���O>[ӈ��lDv�/�Z]��qJ-�ӷZ��PL�=�s��B<�� ����Ŝ��}��?NB�V�k޶�LZ��ro�h e1�~I`L)����~%_��o l,�\w"S����.�'��A�͆dK^�T`C���E��ި����I�6��{b���ŋ���P/��6���UR��g^|l~�մ�DG����"���?wE�6~�ql�Vl��&��o�M�S�Q�P��43&A�E��pw�6y,�D������S��A�}8�vb�1J���W߈���*�Qrl���q�Jf��e�&9�����&J�!�yWܑCn��G���]Zsk�QI8)��h�܇k�D�n�{u*?��X6�ئ��t];GP2Mw�s�\U����ڰ0���~XCOM�_�o�\�'����}l�4����LV�՟6p���W+��~��gK�΄_ߤ%�Bpp~(�K.j����o����t���nvD�o���ٙ����n�T;�\�oC��<�ha>"��ց�vI5�'}3����Ӑ̱��8k���I{;rQ"�1y�ǷF�DF�b������1�nlٓt�ׯ�?�G0�[J�|CtM[C��Ǵ��������Ci���4o���`�Q��}æ���/:�&^�n�C�½>�\�������Y��?(
]t����>ٕ�Rr ���!jX+�)�r����C�y�	�$g����!��\)�W;,$X=єD+	seX�^������Gg�.L��[�KMn9(��^n��%�+�G��`��ٯ0���aF��Hp4��Z��`���(\�¥�C��Z��	��!{�o5�:�B�*�(�V���DM9x� ��L@�S�Z��Zy<L/̴��9�����#�O�щ�#t,*o����և�*��lc?�XSO��u���v���+��VC̺���<N��.>,�_��G'��}�
��M���Uz ���f��	�E�z�x�0��Zf�k&�{E\l�jZh��]{E�?���:�r��d�(t��.���uR=<��3a�З�Kt�JKb8�,��ߞ�j���P�T%��N�7X�`�
�]��R���G�'/�澺W�o`?�ɭ�l�'*ǖ�.
�Q�YB�]r�>��>`�$*D�0�b�.⿯��ζC���s0��"�c�V~w���J$��g���(�kܫ���7R��c�m��\�%���� ��(�<�R�
���A�[��0�~W;MA ]U\��=��rzJ��+$�%ڟp��ܛ�q�ni�#�CM��e�^�Ϝ��\�]g�)���eV�%�����lx:��u���GH�Ùy��zR\o����	=��&��|s>x�;� '����X��+��K	���D-�h�P�����c^D�b�8�=�f����aB��h0���^��])����n qQV��X�>�ɓ��D�h�g�
a8|xq�X����md�3�l<w9A�VY~Ԣ�C�J�d�
��ɂ�HEL3����_��c������\���i;��S8 t5��3u��6*��RC�+/�1
B�R � rr|�ŒR�RcX�`(�{DC�_?3*�I񢤗�w��'�E|n�F9,�4��7(�w��H;���7�:9��ra���P��M�nF�����xE��P��}�����P�Rz�f�!��D�����ۥ�=U����c�'��}��
i�W�Was?�GGS֬I����l��XH�-�篫6�k�	�' ��D��:>��)��%Z���!��K���D�_����4O�6M�g�/+F!��D��i��4@��&>-�é��j�*�E�O|f/H�~c3c�Ѝ�(鰍�=��~\�y��Qg��ț���}Ў�J�˳�\��ڤn�� ��22p߿�9-8�H�e{�	;��#�LUTQ@$�%���S�N��3�M&���4�ٗ,P$��mN���PHRX��V ����@]���F���l�X�4-�%a�ñ�U��s�`[hѯ�rP�X�L�{�x7TBy��I�>܅�����4��`F[�	(��n�#�O7;�a�L2FR=���I=֤,I#C���u;��}g� >QUdG2C� 獕�"���
L�{	,Tk�ݥ}����yt� H��8~�a'I�ف���,#Ϫ_P�-�\��*<�zS�=�2ؘ��S�Yjr jF@)�M�X5$\�3���h�p�<��I�g���T(���)74�hm�8��X��*D�Ud0B���:�yqYΖ������;�q���c��e��Ì�8/�(�`�7;|�M}k��2׬�ϯ�K���"\i�v/Gv��t�̲g�QQr�\�(�j�;:ă�Ӕ�I���	�H_K�O��ʟ���P)$8HH5'�y�g�n����qba^K�l���PR#����?�ۓ�����r�Ʋ���1>9�\�� �V��~�
��6T�d^��6(�!���b�5��q���@*� OC�+�>[�����A�<�l�	�٠��h�Я�?�6��������I�����5#�p��I�s���}��� /�=Ώ�b_���|N�6�ŕ��)`��YF���>R
��)�K/�e<���G#�Y�+Og�z4��/rsG?Ǘߌj�N�g�����ZM�t�R	w���ߑ!t�w���L?�,��s�_� �߻�5�N�����]���"�V�(ȱHMI�۶�H��>NǄh���,�WP9}�������0/u��R�+�@ԡ���5ν�"�����@�2i4�A��1��B����	(�L�Иi�A~k���5oi����v7X��>{X٘ζ�z8�LFt��?xf�J䲨�,�Q^+O7D˯��:p��U��i�8�x-�W�vK�f�N�����? ��s85��m�]s��d�'�У>'	�Xܗ���֭ρO�	*Hh��.���5L���Y��d����8���enaa���ƚ������>�5Bt=�d�u\�,�:ϳYf����������B3ßu���޺a�4g�9&rle�[���>i�*M�H)2չ�������"7�����c^v}v��h*��7����l��xp`�I?,Qv���f���L�na�C��"�:vVl(ra§�<�j&�}V�8�&��1 �7�1� {6	>{M�Yi:���K�aBX	ȼ�E>��֯,w�q�&5C�8��G>�D�����ez��5�yEm3�2�
?Gp�U4�:�zB���Q��P���:p��x��q���1�VϔHH-_����)	h�?G�ts�ѡ����k���gI�lL�߃��u۴SF�^-_� S=�����{s()�A�鈩�^�'��)3Վ�i��V�#3c���􈬣a����j(��'��s�W��I�n��*
�ۺ�q������kM��m4�_\��5���p�a�Օ����6*[�	�챺�	��<c�Z�CqT��ƅ!8B� |���h="�2^���$�z��d@T$�w�m#_�`����O�ljE�I;CP;�R��d���#�Sp' �����	""�>b(j_1��r�g�e���98���s�oQ� ?�A|�"ܽGN��臜����En�w��`-]���4�\CC>k�yT]L�23K�0�dD��/j2���_�&�˴%�LK�������?r��}�R��G.j�J:4&3a��97jK�3}`��_�5UjL��v$ R��cI@��G~�b�,�����d�.CkNI<�����S\�j��b�R$�]���9{��~�I35�1��umu]s�zO^ A���&��7r��33�:H0�dљ �'��S��0A���)�*�ͬ��tƠ��K�$�Ӣ�%)�U�_3��>���'v�h�'�}QU��S�D�m��/�����P{i����S�fu����ѵ6�x��!���2��H�+Ă��4�b-Ce�:���@$L˘�
y[v��.(��oq��^{�{���_�yö�2��V�)!���hִY��)Ǟ�~< �����LP��@����1������tc��U��'��>,�5��:��]�&�?U��\~n�
-D�($%����@t)�
��>*�U�N4W˛ԹOu�%��1�I����3߶w�ٰ�������34+(q(h�9�t��զ\��ѐ"��Z�L��ׯ-��_���Y��붊����	�,�ذ����j��?��m�0r剬�;<�|� *�)�y�a;��+b����бg��HC1w3����ȯЧ�%�ؗ��F))Ȣz��o"E�V*��|�ǘM��E���d\jtO>@8O^���٬&����u��t�n�ؓ�4�I��S��w�S�{�h�wI �%���b<pO���b��kUĒ�(!�#q<�	�w��#y|P���W�ƣ�W]㉉�/������?U����Q+�Dq8��7�H�����q��*	�A��<X�C})#B��#f�$~�891�Hb�	�s~��Z�E�7cJp�7��~݊3B嗞i��3=�#>�ʜ��� ĳ�֘sz���􅢦~3d���fk���������� �2,Y&J��̂���gF���H4�8�_��8+���P���1�}0QF�2׌��i'6������!�t�<�؀���%���M����|`��6o�v��<�\y��㚿
�,���t5��Ķ�i��.x�2=���������e*/��,�����ە����&vv|3|�1������R2�W��o�� �3� \��'L�6B $�E,bs2��=�w_p����h�!���_������.��wߙUD)y]�E� ,��)O�j�KG�a�*�$5~��.���Z�*dC(��F��o�L�snHq��D�jO�m�,�ߴ��I�<4�_�	�y��1�ˢOǹ��3��Z(��D�_�n��|�c�T�{�0>���ݽ�a(�\��0r���q�W���Qi��1)W�U�jY˻c��֋�?�8�r/�0�P�%�$A}����T`	H������p>Arb��� ���X�&y`�ƄߗE��)8�8*oQb�W5\}on{�E�E�L���ˑ4�Rµ�T��Vi����+Dk^�9�ľ.̕-��4�x�I�+� ��?���/��xɋB6���_�Q��?���r��2���������π����Ym�;\��������&�K9بN%s��������`^�[w<5�k �X<��*\��x������]�C��F]H���#5Ko5M�Uq��}�AJx��6c���2e��tC��`�줗ƹJb��U�_*GF#�E��ʈm��R]�0ՎK�/�v����E����O_Û��%��p��pQe}�3l��ߘ��%d����i�r~�<�;�G�u#��ť�+�u�Z��Y�=�}�J��Ӝ��� �U}x�0d��r�u^?�&ݲp��"ҧ7	����@d����fe�{BO���a����R,A��Ƨ��6�]3�M�c�ܐ�Cb=rl�k��a�r:MHGYo�7Oų�Pw?��!+e�Z�d�y��bGϋzL1kz�Nz�d�x��5��%�j�O�abZ�8��V�V��ͼ�f�㜳լ<��nt���(2�mQ'~n�խ"��%dmV3�������6`V�|7aH:�U1:���H@%�i�����A�G��1�Tn��6��T����h�dR��f�I�k�d�,c��� �����pKL����g���Ř�<��}��C$������y
��6P�H�JOۭ��� #�`�ad��x��x�7��M�C��g���c)��'mz�ꢺ_T�6z��>��&$�|�6,�)xWpaa:߈������k�껓�%�de�H���co��2^f'��hF��
�4�I��.E��awmێ�e�+�����E�m�լ��v7/����5��U?�cEo��x�>�h���G��g$п'���P�/�6���vY3�j3��x��I���1��W�M/�:�D��h�e���s�]�Q�q2-o��/]&�=T��	��<��Z��Mز=�a���@�G���!B(BW����<�Ч`,h��`ǖo�r
�dj��q���$]T$s��_:�|��<C�r]
UY�R0l�]��g>�EI|��ީ<��J��0̹v��赢�n���l��)�p���M�ދ>�t��� ]�UƺW��f������#�9��)ıM]��8�4�6^W�'�S����-�~��~��$ު0���U���?Y�@�K>���6��˒z�|�1�,���}� �{��8���&a!{�=��3Fy��j�x{�X��!��1�Y����6�<�1����4�����&Xa7�c�[���˂����I�'(Q1�`ӌ�/�1Ʋ2���$�b�j���i�?��3%��&���\-b���=y���&�	�K��}P��2��w<d�	�)E�@"�G�L�4reE�,�ʩ�G�zjr`dy[�S<���&Y��h�$�V�Z�8�R��BO�(�@T��6x�c	�<�qw������>zd0���q���v!~��KñO	����h�썡`� ���֊pȞÄTꐳ��o>������@�e��o�;#���1�I�q�M�_�;��D
fpw(j �3���V	��u�m�7��󶙛6nv��DL�V;��3_�]�]�C�:�+����	�0���_�&��t��A*R�.0��#�9(:(���Z�:PRQ l
m�ҜIN����9;���au����ڻ�6gq�8�������\�۴��ھ�g34���BH��bZ͑؆IH����P7�fzv��9x�A� �]5?��kH{�6��4��1V�#�WV��q�I5
��Fۯkx����7�*h�,$R!��:�x�<K��bN�2v �J$)E���o���	�[�}�#c-��A��},G:�j޼nI�H��D�]�1�o>��+��Zm!���j����v��!;���6L`�`���寍���/�v�o�QZ�!<��H+�E�f�|n�� �}<�c�a����-�O��ƿ���qk3�[��Y��v�ecպs5���^���0L �tN��2E��~&OC4�J+ ����"lF��6��}�go~f�� �I���x�����3_"��ql��m�|c���o�w�)����u�!]���b�*�Rx�AE�5nCa.�&a��4I=����� ��aL"햘8��A._�O��-t���Y�Y���&��l�,����4�!U���hn�3��:���K�������i�gώn��[<ː�2x������t�)��g�<��M��Q�%e'�Yp��%�� �(�2O�(uVo�G�N-9��+Ǣl;/�Й���X`��%���������q=�$R=���5u�\c�}�9������Vd��K�5ֹE�|P��I�D��|-��Pq��B�āQ�t&��h�Fg��C��=��=M� [q�Q�jꯛ���k#H8"�k�܎�u,Ley���'6Y?'���EU�.ϫR��2�Y�݇.O���t��gω�2����E-��Ԟ>�r5�=:�B4���%�S�ײ�f����G�j(Q ٤^��p�Ř�����c�#�pP˼fl�ä���7c$
\��?&��N�2���اvcJ`?bڊ�7n�Y�$U��?w�=v���Ǥg�6��:�~������	��K�w�U���W����R��5��)DH������������L�C��u�y�z��O9���8��F�q{���Q$|��YB��<m%�����z<��n��}���lx��*�^�dp��2q�'�@�
xas��Q��@Y��Kp3�"�YY��ݵ.���n�/F��$31���3�����j�J�~vDڳz��-��`����R�W%:<��B�CZQ��MhM�1�I��G�%G>��h��i*B3&��-�^���G4�/�L*S�a��e��C�搊E�6��h���E����P�s<ʼW�uIt�a��|Wg6�i�mV����]&W�h�be����HL'߸n��g0{O �a�t���߬U8����y�&<�Ğ������MۍH����n~t��u�ú��a�X1�V!���'�=G�{�T!�5��ɯ0Q��ݫ�G@��	(#��J	2
�@�h�S�u����i͢p��v�<q���,�R�F��퐛�)� V�<���zn�����i����L8v�"T���׿ֲ�PN�"�qI�kH�Ln�f�[xȮi�?�� �7@T�q�����9���Y�Rj��DB������l�QJKE8ql�j��#�E�c{��e;�� �op�nC��<�z�W��O����I��޶��ϛE�_[��q�_`'��6����ܟ딽��#��H)?����]*I�;Y@虸_t�w��-��$�E�7{��$��ء�����r蒟)K21���l_��PE��E�a߱����i1��y������[oC4��l�U��7q�\���H`��t�ˏ��R�q��}�tT6ܶ5)I E*�U*Ԇ���\Eo6 �?!��T�ؑږ#����lJ����H�=bb�G�2X#���?�U�����	o9V7J�/��֤��#m<"�g���҉WM>!�hj��!�x�@M?�S���� ��-�*�Jn������-�\��&?+�
���!SjFvإ�n��\>��nQ�yk�V]� 6 0      �*����������������ݥ�ܻ�������3# �  �yR&�{(Y����YE](9�:��|R��dD��'����%tR٢�E�@;ǐe�B`�J      @C��־�������i}F|�����_�fx�7��Q���hO�g.�/�dL�̃��XL�������(�Y����WiCd�D��*�c}��Yx�����69���eSXQ�G��T�/�ȶ��F�ԣ�^��IyM$�>c[�8�A<u�l`r=��4`���S����tG)4w�-:���*Y�a����76xw�����o�p�����Y��oCO�f�Bا����!������.���'!E�q:�g�0�l�u&���hL8�t��gj>B�E�q�zA����QU#�8�i��D�Ϟ�#���ρk�H�!���,���o����L(r~���N�P����U$�u%#`k��I���Ņ���O�������v7/s��g���8��S�o+��{3񛛹��{������9�:,�s<�"Xp��et�B��WU)�����޼p�ڐ��Ĥ���op+(��������Y�6�=�֚�7ZC��uV�xv�*5� lX�a�4�TV�}��Ӏ�u����l�Jm�w-�T��N���
����g?��: j�My=�pޙ����2��ĳi�`ʃt�)6ɶ}�C�pФjt��>�b8��"\*��E/�HQ>���J��:3���^쵂�	� QY�B8�(
���X�B�V�k�ȻgNBq��N|H����"<)~�
�,�f3�<�J���q>(�ia*�����GѮ6R�X�2�,�:~��F�{7;�a2���j�<$�E��eqn��2��L�ƕ�(*i��q_����a��Ɋ�� �s�_�z�;���[9.�N�T3�B��kn�g���팘�n�R�)�.�H��P(��_��Z񈨮���9�[�0ot��M��Խ gM��B#�0zk��z�X)�s��[G �q�����m��ߟ��g��7n�9�Ŵ��<T�]0��V~�.}���^����a�����Ż�D}Cn���# (>7�����1F/��n�J��� sݗΧ;H&7N]U�����*+��}���e��*Qm���󰼡8�<C$��ȋ��Ug#���Ñ�p��D9�<m�<��N6ݼr}��<4>×�gsK7�劷D���l�n�[��q8��J�
(��<7Xoc�P�q�_�h�6X�߄V=L�D���/>3�gJ�d!��6�y�;�t�"O�.�>\�ȼ���dv�k@T��H4�����9��˗�VH�̺��Z邏��$�z�lɬ��U�U�<��߳�w\˱��f5���'�q|�C�,�(RÄPAw����]��R*{i&�2�wI9�9�����~_���J�O��*�m�6ʼ뮄�f���XIWeC�c �-��EI#??�S���s�z�A@J%q�d��si5\��N���%A'��d=��_�(�>~�!��.�� �q�$u����&����=�JL��ƨ5n��巵�i���k�)	�)ј+]���#Ķ�I�&��I��%S~�K������R����3g�̽�\ս�0q��X��`$<˜V�3j�Dy�H 7�Fb�ዬqX_vV�~�Al��m=�ΤQ�?�,�׺4����؊����[;��Mx��5�b�p�Mp�O�E��R�CC*gZ���F�έ7p�#��y�3��j� �Ծ� ��L�-�UʑԊ��H�q6�z��q&��9$�#��Y�(H�U�}p�h�(�t�g�����K�q�Vv�5ϟ2D�x�7aP��y�@�ҍL��j�?���D��m?ϛ�F~?�6�V�`��@%%z��z����Tp�If�W�1
~Ь���w��i7u���QqI��HF�����[x�~��o���ࠐ����r_��a87FF�,����a����զ�*�u����U�o�����0�}(>݊6T;���4G[�ݼ��ꀰO�E��,�]�@]�&��I$������P>�!8L=u�z-�����_�h:�A�ۤ�M��E����
�v�=d��ʍe��
4������K���e��E6�TC�(5|�7-�V5s��3��vvR׊�h
ז���Tj����mH(!�\4�|��S��#�1!�MS�R�E��vL!tӯS�
�+4�a��{�r,�^AAg�H�h�J���o��y6�^��S@!0@����I�r���x�be;	SYs�r�������[��`\T�ZLhyl���9p������9��'O�W� w�I#�����`������[�H��st2�K܉�~���a��#����rcnn�:�5r/su�a��w��; �}p�l~&؝'��OORl�.��&�H{�Ov��%����e��L���$��d'H���{� ;$����g�^��'͏u9����:�5�D��C�\ �����zͭ�����Rέ��ktc>�c�i�k�̼��?�Q4���G�����$=�������/��։���W�����vk�xu9���;E>я�|�ۣ����9�S�K��T�̤��~�Aԣ#%s���e�j+(�2�1�FN)��^�*ME�m߻�K�Z��ԵG'F���͵W�n[nȴ�}<���(ҁ���~�"2��ZО0�"3�E)��nb��]g���p����T���V��X��a��SY'>�c���������	�`:}�����_��������u�R�]LR�l�G�IA��/�t��m���8Ѩ��=?J���sK�.:	]���@�L�L��"r����_@]�ua,�w���,�Q0[��h;�1~�MJ����9�}���־�旇o]�W�A��Ӂ�ju��'C�N� �:��=�Xt
����) 	;��yO����6���T �PD��4Ex�U�eP"���,$�@��80�N��<3�wx]��q�I!)�6c@'��	��L{�~D�D�dsG�)��g��)�S��Z&����,�[�{�_�{z�n��@���Y��?��"���ϲ�����;�AxZsս��k������=@��P/Ǵ>^�([%d�,��TJ�5g��etu�䅸��氶v����Z[ �����f6�"ǎn�;���z����8C����z��(q��:w��6�҅Y�|}Sa'�Ӣ�x�,��_��X �=_� �G���%$�h�5�H��g��m��tX�ocfղ�`t}NTE%�01�7�����Ig������Šs��J����1a�+���@۾ �^Yy�Gf��:N�����"[��Ԛ��0 ��gO<@�$4Lw��[%�r�&�>V� ä 9\8��Ľ3��tf�O�O�D��a˦��.®�H���Q V���%_,���nE�C��� &���_�9]��qyZ�F��`��p;�[M�W����yhiӀ(�	o�Ks8:>�-��{&<p,��MS���\�㡐�he��Ƭ�+�͢���!m����r��xB���ݵ�O�0tn����Vy������������E��n�-�m�"͒�WF��q�jPq&<��Ъs1�Ы���\`0
.e�X��+W�GϤ3Z��N�QJ���R�j�ӒuE	&�+(��ٿ��x=��)�H�J����χh���֕(�6`���"4xGj�:�9�ex���ȴ��n��6���ق��L�ʍ��x-ч�ʸ�r�-߼�ID���B�(� �b�c:�tҐ��KBm.���#wp��y�����g�h��u�.�CyG�W����&t�@��w9�!h���>����Kd��QY�ͱ�O��i��\^Q^.�Q1�B��y�ý�+��P�`�c}.T��L��씍2dBimߪb�[G�����S�N0�Z6����=��dp�t\��f'=�/$��P��������K�v�O8*r��j����Q����wFIj;�)��W����*�oÇ�¯Q7�x�wH�ӷ�5~%w��u����IK:Lj��"���=.E�(؎�@$0tlp�/��k�E��g�e!E#�j��-�|(,�c#�M�����?���L	.�6v����AJ}	�E[�t#C�#C�\�EaU�Ͼ!^�'��	5�qo�c%��#G�������뱘�,<����D�������2^����OZ�o�Q��~�{�ko0o��<BG�|j_{�}|�q{�L��m�z�:�r�^\G��] �a���a6p$,��Pl�U�����)_	I(��$d>)gRf䁩���a���� '?���r�N��#l�1���<d�6�?��6�ߦt�z�9��f���7�+W���ח\N��7U�7xͦ:~�b�2�i�̳�}®V���<5�}@�2_:���i_,��|�ˎq��⑸���I���Q�Iy��L0���ҥEe�YBI�JG$�����Ī��_��JI\K+�uG��&���Q"��P?�,���W���4�P�QM6.�_j��o�!�m��Y�ǽUvj�Q���x<s[���ĸ���0`�_����N�ۥ|X����篯m�>�Q%)�KӾM=���Q]~n[�GT�TRG0���Je��aA�pp+h�0�!�[���_�E��?t5F Z�(92�?����Kf��6_cEޭgޛx��P[��#�g�?�8A��F��ݿ$���LtP��>=>�s�ڵ���s��Rǝk�eǤ�Ϸ����JE����^�t[s���/Ҥ�(�2\Z޽�GI�3_NRp���o��9�a��e��Ѫ��XH��?��70��Ȯ6�Az�g8K�(s�"v��!�
OBܖ�f#���!�"!�ל]g�b�QIҔ��������k��U%J~#�]B�ܔD�G�;�M,�ˇW����0x�ƛ�O��6 i,��I��&���S5��������͜���G��X�*��
���O�9�	2�R	�1���d������ҍ��w�J�%�焪LC�v�VʉF*�t��N?�o]��$+�]���ƨ)Ł	�1B��i�K��{�W��ρII����*��VV��0-HP�-��L؅ՙM*F�xv���\9�y��Y\�sJ>j�a�Q�}Ƚ��B�юK��������Ȥ��k��C��?�'�M�Ϳ5�b��)�sA���tk�@���YXˏQי�MP6���a2��倝Ⱦ1ω���x'��Y�I姿�L�O��Fӓ_n�J�>ٺ�x���vSf&t�ZmE�\���8��9</�갵S�=,���0-�gb���~s㘽��e�M~M+���x`�A�+]Mg݁�D}���G��c�\I��C����xR=�ёK���44`N|����X9�ڏ�ihd��W&����@ k�U���Z;�n�$?Wu�@�i#1�IMh���h3�bSK��mzy-mJ��[����}o���Q�#e���".F�v4����{�^$h�k!З����a3m��t��͒��GO�����{&��>�d�o�zx��CX2�4,l���~��+�P�S�橧����|{�eĘ���tQv%�h�� ��Je����H�o����%�O��k�hC̛���I���w����H�~~Z|�s F�`�����B��t6e�k�J~��F�
�L����E��%�1�<,���3Ɠ�!�����_RZc�6%�s���c~�|8�I�jwG�-!΍��V�ճva�>��=���f�sҜL��W`�ט~RZ#&M<A+�H�b�m�5�JdK�B�K�7�����u4?�I����*���
�!̀�;G���3��>�ʔ4->�`���%Wv"�E�!3��:�vy��0���I%a����zt��Z�ۧ����3ƙ���o���j�sJ|��xq:NB�`过w �w��tAl�v���!�?���W�)Z>{J�����8�cU�� �&�4�)����I�HMV<3`�h��b���K����fJ�dT�����8v��T0 ������W~mf�����C;'{��H�hvۇ��p�+�c5��? ���N��}�d�S�d���r�`�y��*��W{n*��r��-B�����h��b�#A~ڶR	T& :4�y*�Y���~������;o��a?���Dk<�__���U��K�����{��e�w8gI�f;�#��`1��ʎ9z������eý�
 �-Ɛx���D�
�mjH�ۏ�k��,�	�cq�Ƿk��*�~*Ѽ-�K��:1-wo���^i�(���<oO��>7��6��ֺ�i��/���Z�tscQ���Z�P��O�VCnW9 A���(1Y֮��ǅB)��_�h��O���'i�#r!�O�<U�<h'\����M��c��[О|o"�=t�x��9���*�¦��]��r��uH߮��GLJ�"dY�5EZ��.ۃ�Z����9s��,�F�p���*����|nC��lI�]�#9v��'��q�.�t}��"�n�	����f 6�ls��@@w1���7uAq��5Eߩ�m�\S��U7���x:�l��J/�7̧�?^��آ�i�n+����P_��y;/��Yo�wh$l����w�]�K�-<c�f��/�E�/����zmM�=�e���pՊ��y�1�˹M5,���jzF�1�Z�rR���1�N$C�/A7E�֟-
��w0=�Nݣ��b���1}�ǲ��"��O�O�/C)�t��Y��+��������4�\�N{�R;M�v��k��=�c��'�_{�C[��8�4����h�|R�(�n�D�@MJ	Q1����7V��ٳ��/W�O2��� ���k������� �c)���dq��,���>1�3���#�4= ��Aۀ� x��!�m^ɇ��zW���xi�]%B�A��.� �Y0��f����{�&�t�}?;���?$-�O߹+q���{2����?�2gdx#�a�0|�u��9 �|�r���Y.u<�zh,������!�s�R��q���0��D�֨���������H2���r(6|.;=�"j���D����*c�9ž��)�^���J_��H|R��f]����r���8rGO��Fdv5���7u�U��hfoW�S4�<�`�bK���y�_x���g�>Y���!'�L����cS4�Y3@qq���o�:
��a�X�c�k�,�/Y���ѭ�P�;�����$���#V�����k`��?���x ��&��j�N'u���It:e(6]������C���:4��+S��{g!�����;W�E�Z��7��6���	�\l����o{5�n{1�:�\0�[��,K��[ �p��6�1��&c�/�sS�ɏ553.�������I��Ǣ{mBC��b�2�IOb]_j`�ޯ��>��8���L�"Br�i��
��8�H^5��A���P#L�P�Im��g�H.��.��od W�G4��z�Dv^�$��:ߖ�}��λ�4�=����N~����&����ζJ<�J�E�����ؘ���z貳YYe�?�a��nթr#t�$��9:��߹����-��0PB�t8�<צ��V�p_�,J����Gk
�+�[���$���n�X?�R�V���6�Y���u����[Ё����ke{��W�X�Y1N�4oM���`b��ꀊ��k�=X�^��=v��Qd���\��O���
C.L�ݲ�YB�[�8�Q���gs�u���A���y�.#��!���C�ϢKt�Ύ{�tVw���qϢʅ���q�aS�u����"U9%? (��68T����}��aD�Oa5a$���`�I���մ<����MWS�|�%�V��}�S,OxBS.�F=`���n�V}���MU!.�.�j�Y�T�P��3"��#,�I���~0���C�����n�����<�ۍ��H)����M��F���7�íu���A9\�|��}�lZ�j �[����'���!_���b��Ҷ9�`�)��\�اؘe�����>}mV�Ʌ�k�&���lm͇��>��P�7�&KkG	� $VΪ��|(dmwF���� h�@��3�sw�~�{��,�*ð8'�b����|In���F�{2�d�8�z3�\������;=t-̇���q��qY����L\6��n<@�c_e�$0���rd��إ��+�v���}����'];�y������y&!���s��ęK�n�B�o��u%̌��ǔM�?��B���+F�����;�~�<Zn:��V f�=�po��h��CS��D�$-��^Yhu��=�^q��So��Ϧ�ǛU8A������ף�����q_ͤ�A��s�� ���=�_���"D-�� �'i�*a�����P�0�[_����#����ٻ��J����r�Jc�����%A7�.���d�a�W*4;H��3x_lY��!zes�&��5�E�<���I��j��e���-yk�I�V�P�����}�̦��{�*�ji�B��fIBv�������U��Ö_����0w\d}j	6%;�!�fc�ɘ��-[����d��o��y�t*P"��⌓����4�JG
�ػ�Z�I5m0���L�W���S�c!�5���������<O��x!�:���:��O�ꘉ]���=4|���]#�C�(>iՇDC�z�x��a��w�d�;	@6�����s��Ň��
q�(�fJ��`ޑZ6�%��پ�'�G\O����xڼ/�w8��t2�!U|F͚׍2�#"��HE�d�vk�F����ʻ#��A*���Ȍ[������ڕD�x;�ҏ�d�Rū�Z�j�V5K���	9>��!C�h�*�a�Y_
�9�P:4�@N���(.U@���FE�z��y��t�G��}��Tw�CU\�i1;m��E.=��1Q4�H/v7%r昖��-r:�{  �������$����͍�czv��:�����@rq�¾]��	�?	X��^c���O��#(�_9���C9��P��8��,�"��B��Vc	�ʠP%o���Ԟ���8;��-�4���l��j���eox]T�Ğ`�H�f--�"��j�&s��4�&-�ۑ$bɤ�w��;'T�C�����ڴ��ҭ3k荔
;��A��I&L�y��{:�cȧ��C؀�ԶlAqS|S$5K���WE}��k��X���a�sJ�mV�_X�n��N��
9��, ���|6� ��������9n�Q�w� #��6�h���cW�6\��{{��_�r�V����jj-�[�ߵ����Z�m�P�;��+@E~7�����A,��G���~��h%>���78���-j��
�Vb�YX2{пq���%45�Z���/Z?U��n��!���?�5�a���UP�����>s�{Ժ����.���K5�D�s�#�~�I�t�l��y�fxv�{�w�.�,����^ZF�����kd
�T?i��*��=,���[R���Y�aj,ȥTv�E&�� �O[!�9�M,.����BZ)��m�z�~�}�A���Ȼ
\$Tr��]�U���ȫ\��?1��z��n6^ܯ�����K?=&i��]�5|�� ����%{��Ŷ�ۢN�V���ߕy��͈�β��	�M��cG(�V/�h&ۭ�������?~k�?uGP�ZŽ��i�n��ʣ�p�&�V0_��i16ʾcX��ݡ�ZJ� �^��Ȅ��'ZJ&unq�A�"�hj����1�A�=�ZUP{����Uh����(慢����Nw`d�)��;_\��Т#<�h~��=�z�v�����.X����Z���k#6�Zο����g���߄����I�N(��Pݨ���Z�d^�g��3R��_5�ʳ㿽����4p[n�{�����eϽP�Ǵ$�MhE�`��)��L�|��:-���wNcx���iP�����ca����r���<���hU-pQ����_��`����~�	.�Y��댕��&�l�;ɭP5[
@؎�Ƒ�	=d*tc�k��{R��%��r���/c��G�U���?#����?y����L��~��]���B	��@?*j�t��0�fl�������m���=��:�˩� B�2��<j�|�K8d�����_H���_� �Lr�-�ʮ��1�D���e��cda��"kn���u7��$^� +�xF9�ג�?�@�_�3p(��ј���r��/�O�_��-��i=ɂ�޿��k���4����5&7T�a�3
�t�q
gfhŉ�W�g��dB���% � \L�L�2��د���1��8J!ox��3`Ng�>s�3��FG�����W�|xe&�6��"JIS��F�������ѯÈ����+�to{rr��Ր[�Pu2�}��9{��L���&s�yWp�@�㷅"�-�h���,p��|RUY,K9�W>�FJxK���bm8�ǓƮ�^^�ѹh��ќk�r/���ۂ=wG&��F������__b6���K��n�z�/���=:��������u���$�,�`C�N�§u���~=6����]*��<dMo�}��Y9�0/���5��Έ��$��Z���`���VC>�.l�Q+���8I~n��f�&�+>�޸��D��5��_�dμ�R���^\C��Q���\�RR��e��{����G���ޯ�y�������T����(~����d��M`��լ����	@wuY���՞ؐ�p����14��c�Qdk�7���wG��ʯA��.�<f�nf۾R��z>M�J�^f�����0���+m�e����@�v�ȫ	e��g���S��ƛUy��Y[���:i7p��|@��-Hƃ�c�M�U��]f�����{s�w��:R"]g��w����{s��6�]N}̅Ux'�����2�>񊎧��ؼ���m�x?3���ߏ���39�$��@Eɒ��ֆ��Bo�ilSO�A�f�^&�e�ӧQ�*E�k6��~��+�$L>i��ztW�q�K�ǯ�k���Dz��F�6�ǹ���0�'J	i�@��dX+E��Y�����p��w�c3�ʐ�Fk���;|��;L��"�#�W\��!	��t��(���n��W��ư%�n��|	%1x����'w���x=���P-���
6/D�*���r &�.>����O�}�h�[n\��n,���]H�!�V�F_`�ڷl�Âo�� �n�����o�f٣���	�,($5�q�M9:qg�xoM���b����Z"��/��;��WK�0~U'�R�t2�q�J�-߰��hVp��&���,�D�x< �Ӈ�U"Q{T�	�s�_�B	ⲻǌ{j�p!]%�`���/�p���{|k���*+<nՅPƖΑ8D"�=�[�Q0J���+D����
��dި��_*î��si���G"A���Q����Ϻ�}����>ߧ	�������W���g�%Aڎ��*�4v�6��))�i<m��-.��@���V�Ӳ!�����cy1�5��lh��T��ۙv�)���xɴ_���s���x5M߭����)S��.�8oD�����L���N6(�����S�kz�z �<�y�Ӎ�t�_�����J\؎I����kJ2�5_��u�*�K�ј��P�GH%o�3gWko��ݪ��1g;��3Օ������r����_�����*׎�"��F's���읮J��"9���[k��W�=�ߚ�
���_,��� ���9��Aa�' �c�ȈՒ9ri����Cv#W�>U����<Z����j�ae��ńNC���Z,c^�W���;k�+�3�{�Čw�E���!�S�����kL�5R�\�������1Dd�����u�x��<�12J��NT���:m0��c�-�P� )�M�u�ج��L��� ���"S�y�?�M�yv��z�V�⪰,�����:\�ؗ',��'�5��x��M��9m��&:X6T�����Sd��2>u�3�{�N���yO8.�j�uG��~��k��B73�Me"�c_��Xl���t�c˛�ă��T�kV�yT���8�(��F�]!CV�c���t����ҩ?jl�r���(�� ׀��*`�Σ�t���с�s�(��������Z�R�o4O�~R5�jo����� G�6�q�S-�����
��*{�Z�bA���H�h���6�6�?�<���a<`^N�,�����8�C���vq	�Ж��;$��?�"�(�^�2=s�{"g�c@���9�$�Ƿ5���Q.W�Q�v�v�
acJ��A�z�׸�(����*���&����^��;��UKu��7�Zv��,�����Ԥ�&;�D�xQ���4����p�Ո���[�U�)�C�	@���)��v*�U��
�n��%A}/���9�Z���4��_��	�@�a�d��V������YL�x��px�Ax����wL�I��1���C`Un^[�󆪼x�Ƹ���x2n�H��7k����6{��޸3��������������E��2��z�<K�Kl�ؔ��F\w�z��y�Y�8 ��7��Z�4�yF����q�Z&���j?���B�X\�D���
�n��q@h@Xw\����d,ݦ*ٖ-l�Q
K�p�+�]m~t�~&����,A���`�1rϱ
�ł`�TX�O4_W�_�I�=�ժ�_W�>D�K������l��/������\�Ĉ����qI�;*FDђ�_ڕ�dwV{�0dd������ל�F�R)OW�^��E��sϡ@�,T[�j�!�Γ��4U$��]U.�r���B�����3Lvut�U��,���=��׆�W��:{\�t����gW���&Gv�� -f��+�B�B ��3�ۃD��|��.{��q�D�&��x{,�͑G�C�x�C�e�c�OD�uc��J�`ߕ�=��R6	��ưj���;H��®a�sZ�&�+r�)3�#�kAL�:��8Z6s��g8
vO3��#�NOŘ8��~�ʁ��s�.���o�r��B�r;�r�{�UZ��̓�\ۼ��p�â��v�)d4 ��"3m��E�'��A �������wB֌;F2&�N��xQ�`?��XY��'�Z�9��ROU��t��{������ ��X�͍��f�>�'F|
��$�9�	*pN�".^�04��I$���ZV�C�ɘ��ި�v[�wt�=��P�Į5dĘv�h��:��б�Q�4���	����2���0��N�#|K���F�Q�@{����hۇձ�!��{�܁���:w�s͆!���i���D�3$(f�Ľ�c/�͛��'b̜��?��/ۡ�\�:���gݘ�u9V����l$sY��,f�}��CM7��7@j��ajqhA�
�\Hd]CgN��63ʾT{R��*�=;"��1�]��v���SF��M!���Q��);��Y���/{�z�=�/>Hd�>''����������!2�+i/Ə �$�@=6��Ҟ'���~�븡>Z�}3*�Xc_�(�q�F�!�hJ���lD�{��kF��D)���̏�����\c#���t�	*�W���h5��BI��hE�'�#�m����;
�>[Q~�'p~�V���u#�<w�m_~jsі��G�kc�%��( ��y|����E��G*'��ȴ凤$�4�SXK =7?&�T��9�Z�ъ z�}6E1����zi�t6R���+���hC$�Z�҄:����sq��(�>��4��jD��y�=<�7�5��&ba���2�gG۷����ѢȘ?��'/���$s!rWXM+����Y�[}!Ҷ���
��y����m���k�����|N(n]s5�I��b�Y�o#����x�OՁ7�k@.G�$��&�5��nP�#�r,؇��NPU�����`��-��qn�Ҩ.H�aOZ�Ȯ���G+&�ӗ�L���xZR!��Q��^��h��g�2gˡo���*F�Ė?����k�Z����f���lt�0���84�" W-7�bL2����]m����K�AFI�J�l����rƾRd���&8���ZG�����*��k���{Ɔu�=��G�ϕq=3�9��E�/��m?�e���G¸�<���u_�{�%+�L")�$Fw�9��(/ˍ�٦�n��fnk�j�x�M\�5��еSgv�V�M)	}��(e�t�86���E+�=x8m���ݖ�K�0��;��Fww`fr�z�C]k~r�{�>���Ť/?��[�[��q߃�=�)���bsǰh��m�m߄�� �Zӻ�ʼ�Rþ��N��e<!3D�w^V���*�����]� ���(��9ͫ��w��V���Ë4��1������=F<]�e��@5g���Lѳw�Y�c���\2#��L6��UOУ��i��<��qX����z3Di�`��	ek�0�B�>�<���	1�,��͵�ȇV�?��t p�v\y�Q�\xø ���s���;��}Z3��=���Z�,���i\`��-��&t~�B������8����F�CF9ҿ���R����څ����Ȍ�#na��͊�8��-a��"���,��U��`�N�y��ϧ?2g�� 	H�$ .s�b_hœ-�i�糂b�1�}�u��c���;�Ws��2k���+�yt%D��ެ��:�5����'7�%��7����Ml7jh�|�^��?.h��}�';E� ,#�f�"��kϰ���/[�N���5����Y��8P��󏛂�w�����,��Y����b��^1��b/�Ǜ�-�r",o� ��6� (&��bfd�Ka�H}Q��U�Ie	��yH�5Y	2����6лؿ�8�H���,�i��I�σ����=jno��m�c���D��C���텐\m�Yj9"�W]�����hN����׮%���e�w�-k�X�r�f�t��	�(�7U@�@uB�O��S�df�N�5�Ř�A��K�
��/���_A �i)��հa�ـQ�ApQ�!�i��r��{���8��C����hNS�#e{�rL��FC^�.�}P�hM�\�j���@�Dz���"���V>��:m���t�I�9��*�u���ݚR�XS��ײ�i���/�3U���;Z���*���9��!��61,��x�}H�JXi@�5+"�5��	���/��sіaq�X��;J���� )<�9�w�L���ˋ��nc��V�خ��Sj!���fh�����v����IFޢ\A�V�K�({4��Ϣ���0"���^�H��[�/���G��P��"6��㨱$�;����r��Y���ʻR�5uf%TJ�$8��\�4�ߊ���!)�?S���4�	ӈ!�N��$)�(���Ne�,�#�����u�������&�ޮ����:�*�@OJ.������+�GN
����9��|`019�e�[��R{�UOu�Ղc�J�лB�l�/�F��Yl�Bb.�����P�KH)����ҦPR��0;�9�g�8ƁC:O~���i�Oӝ�˙p��b�gY`*��i�3��`8��r�\:��h�2�t�8��t$��w�p��ԅ r5��zE\���� o?��e��^� ��	� Ty�I��4 􃼏I s����,���i(�hr���&9ؑ-�ϐr&�^cl9�K�m�4��1*E"�K���v����׃0�������k2XvrW	��Q$���;�u�l�U�+�#����ɣ]oڲq<FwxXď�����`|�KUB�z ��v�2YWC:L�9m��h�ѽ@+����E@�2�  kOn����(�wA������x�,8�}�R��]��knW
{_43P�+H�	��'}x-��+wM��s�EC�Qh4�ݻm�p9aJ�!@��C�������:�g������,�ɝ�PF�O�9���/W��� �{U~��&�\󊻲y�o���>
h%]K<o��dN�k�����U����'����`Zc*��F��Ξ0
t4r�^ܕ���a�r\_��$�-���u��`�	��q��q���`��r׮��J����x��=!bN1�� ./������C����a�A�")�8#o���]�L�W���$���ǲwVɷ�����z�(�I��=�@�8��ȝ�'z ��y���7��y��Q��qWܜ?�mb\�Xy�>ЇF�ۦ�NQ��	���I��r�!@�s��{ZMavE�=�@���\�˳n-(t(ˋr�
�\�m�K�b}8�l�E�}ܼNZ������\$Ug]�M�!���]R�VZE�{�Vf�H���
"R�Y9��v�VT1m~�xp�zʰ�8����~m��=(&�/[�@h�E	.9����n;5�t��6�g��k��XVJ}c+���
f��������IuO�-��xZ�]#�`N�y�o�Fg�������t�r��y�XȰ�\�0·�iK�-��G�ɀ7æ��8�!��ic�S�G�,>���ף��<����P�_� ��۾�X�6��D
+���:��M�5�!L���݂�<�2����^:�5�/��d����F�̡��]<)�VXm���o�	�6a4��x�GǨ�hrz >�Ķdc�%�cӉ�G�3/A�gw�H 0��yo:��h�
����6E�����fp���&�cI!SQ=o{��u��Q����1?�P�X�H�oy�x鸑��]���@z���9��X�I�.����ŝ@eR�!��ܝPԕo���F��_`�����h��g�����޽2���c��#DC҃0��IQ#�a���N��j*�-�W�rJ(f��We���=*�2�Bj�:z�\(�i�ɶr�n�>���o/���痿zj�ľ�:.���G�Qe.��Iڦ�Tz牤dxL-�^��x+~�N}�_����s/P"��Y�������p�����#�F��,�ֲ��m�$����Z��\O���,BfE��)��}eȻ�w���8��Nr�u@������ VҲ ���g!by�?���z��C�{��;�J�bZ�����@V�>Re��\p$��J ��*��{!P����*�]Z���f����H�i��H�:����b}���g�[þt��U�}�?�P�e̡��>́{�bS�g(�2#&0n�h��H1�?�����[1�s^7R�?���\Y�l�P�qpbعu[���Ф�˫#��p�tA��	����L��]g�J7ƴ�,w�x�G�>3|̕�^�]s��<�A~��WC�m� ꀄ��.���x���n�S�.#V�o��l�x.�:��Ilwq$ty7ݯ֊/�s���a��h5J�w�vA+ c.�rEs\�պ
	�����kI64���#�@_��K�)���j*�9A�c�\��b�E��U�)�0C�o{S��㻤�]5�?r_����<�Y���:A����ۜ.��ur��c+�b*�����a�7�@4l,��Bm9��I%�e�D���&v���Z�#d��ʒ�����N^g��0��K��S�<.�s�M��U�4j�l#6�C7�P+ݒ��ީ[�D�� !�#A�eO�
<H�+1�z��
o�OY��7��t	E����̓��Uj^I��J�ߊ�s�Ţ_�c����H%���!��)�P�!ʟH�=
���=h����p��x�#�ʁE�Q��T�Qz��\�f'܏��ǩ��G�~ƃw�Ǉ���g-�qc����d�I�q�}~\E{M>����h�����ɘ�&Q��3Cw-6�k�����qA\��D_	M���2���ʶU��ēd(�p�0Cx�?�+���\���I�(җ1���]�n���穯e�����ߩ�Lc�'��:teP|�����C��+�d�G�V^7`��f�8y��~(�֮uI�(���A%�8�)���X�I�͙E�B���)[ɯc]N��v�ٷQ���L��rno�^ �O�«�$J+��?��pޏ�LZo*�e�f(j�� #.1g�D8 �ߟި�����o�i�o���.�����kG�B }�jK�#47웾M$b���TZ�'�'H�?�M���%]i�h5"_ 8%����_<-撡j�
.��Hg_�Պ����כ��Mi}�<��/�B��0N�Z� F�Q�=�j��>I�<��Vӊ��J�0�K�W���I:��ĥ�T'я\��B����9C��������l��ǭ��b.���I¼��ª�R�����rl���[���DM��F'���%5����uP���v��O>���~^T�~���'���pk+5��p=Ǧ��a=�zc��
�d�l�z�ȼΨ7!�7kGO����&�s�1��Q�@D-�����҇��1��I� ��5J�7��~SN(�~sg^���9��ޖ��2��%C��?�*2�c42�zB���k��'
�`*� �i!���c��V�#�=6�`%Y{�,k0D�qpm͙���xN]#}������E!6i�'��5��c�H<��ihP�8��JH��F4�+C�7vn�����.	�jL>D/+�e�g�8�V}e�Ė�-̨Q���������Z�>�=����0ʹ�+1��B��ѷc"Ԥ"�!#����Q���
z9 ����C(�#��-$ҩ��cd �yw]���M���9�]�s����fq4R��~fӔ�ftx��(���f��3q7�,�ǒ����]�?s��r�����̶�C��`������$%�����q��_��_h���'Ë��qh/S��-�en%9t�ͪdD�E4߶�a钢�ewz;�.��8	0xUr��+���W�^daJ�$p�&$Є| P$;[i���z�Q,��b�^	Iײx=�c�t�iA�GjR����k�H����$��$���l��ׯx	����)�McP���2��Z�scC�uhe��N�p�♀����2]�G�<	]/�2����N�M���	
���Ǒ�R�����F�O����\l�g�,������& ���~�󠺸� �O�l���P�KK%h�:8�-=I	�/A�������V��z��O�>���B���!��0����)r����=Rc(�&R����d�&�*��&?��W�8�;�	����LM0��$�+����T˅hW��Gxt���b�r|�X��lfny���v�M�8����`[���WE����6�b�e�|��
@�6Θ��jl<��0�O��`�w_�]��g�s=a�U�w����R�<y-����m����G�`V�O�1sّiw���I�ɃW�Y)��}��2N 輰�{�.I1<�Ib�����B	�71��2�J3� L�����N%!�rؗ(�Į�X)'�/�?�+��H�����6������vM-�b���6tK"L,�ܨ/��V<�<G=R�/*���]E�� ei�L�{h~����lG��JJ�ʪ���$��D��^�er�{z�A�0e���'�?��ҟ�Zt��㽶����'��0r���:E�i���!�������VLy�uDɶ��q��Q�SI4i�ϗ���`�;�KW@p�{0l��$
��1)b��@���k�
���'O���7�]BB����Ȅi�N����a0�HΒ��b��-�h^�f��Zx�'qB�P(H��F?S�V���2�u )!�CJ����6�����l�"h�{�J:���j�f��:��!��.ث�m�� e����>"η�� ���<�<�~�0M�i�Ղ)i^[h�B�k![WDM��oƨ�mX��rׄ�_?��Q?"BOM��i���<1:}�
9)�!���c��S��љ��<�7�n������2����Si�y�cs!��o�����7� 5��?���#�Q| �!U>�.Y�z�.��IC3V���m!C~�]E2a��')��V�����պ&�r*Ȯ؎ v��`�i@��\��,���E:�5�id�h/P���V}��������#o7���q �������ߢ�X�@�q����t�x���˽EK�L�]�	j,��(o�tл� �AF�G/h��v�~�O���zO隆<4�U�$�;�!��?��,��)��9b{��Q}�Z��٣6�y���={�x��v�mf�d�[6s��	gsuF$ 4Ea��Ʊ�w����wAZtd)�oo?��(x��H6W	`e�5(���K� ( �Уim�R6h�w��iۼ 6(Ψi-)��甀��=\Tq���-��Q���d"ePʿ9C-����[1,&P�^��R#ǻ�lv���s���� u\�T��k�$DW�a�4�Ӛx���#�O��L��+��mχ~N���l&9O��7C3���eVV��WN���6��#y.�]n�O[��h>Y�@2�ޟvJwI ��\уhL�I��w�$�b�}��-ϑЧr����5�z����VK�Y�u)/���T7f	����.1  ��P� ��Ɵ��(��BxjCΆi$���P R��D�=��t�b�kxs3'"X����7��Z��9R����g�e��}]�eA#�<�T^P��*Jl��C���w���?Y�X��`��+^��#����G��X�KZ���/k���l�4���}�:X9�6G'Fwj~}�6����?�o|����'�6_Z����}�6����?��N2�4��ȇ�@1h�o�2�I�7����ݻo�F�Pv�~-l�W�z,��у�N0�Mn�0u�>6Ax�]Z�\A���s�Hf��ZB=bb��)r�I� #cאs�*�'�+k�^��%��)K=3�* r�jCy�V����Ճ��c���u�h':ҬJ�B���Y�|B���� K�r�}o�9D��?C�����}؄�h�"Zpq���[u5vܷ�Τ�h��H���9���i�ֿ��v�tw}F(��6=:M"G|��j|Al!�=�=����d�um�OJ,&9{���Ʌ�7���8wBLgګkg�O>��l�m�c馊W���#h'�b�Z���Èf���'-�޵�B��6��g��>���_���ܾ7"�n���~����|�v��r���x���{O^�iC�|E�"��<��@;9�ʊkc����Jz>��Qgz`0DE�s*��'l��$���uq!x��Ɋe�v�l��;q`��Eé�7.�o6�k���&�	v�ɣ8�q���ߠJ�,A 9<2TN:���L��T����9��V���y�7�ɐ.���U�Ѝ�%��Ա��1x�J�~�� $�=�6�@�i��\�#˲yr��j]Λw��X��(��(t��y�Ӷ�K7�>�W��X ��ڎ�0	)G
���J 
6��YD�8d�wx�Y视\���Tۃ�ֆ��pqG��,�sW�Ӗ�z��>�pb�:�Y}�͋��9��� xIM��q	�лvG���4.z���>�֋ڊ~}`{�Q��r>Ǹj��j��Ǧw��gK�/���_H�D���8>#��
E�|��Yo�*ڏ��l�'+�[�q폻���x��{i���~�mR�������� ���׬��_	+��E�I`n�����v�O:���Q��g����6�g\�P�M��o�-Yq�֛Ê�u�2�0|����>����5,4�hT$�@�ߗˑ�� �4O�h�P�s���{d��d+��B����H�6�{�����%}ٯN����ߍ��� ��u?Ͷ�e8����dk�Ugj
����q.�����Gd�UMv���|Iн��Ї��=�nw$<�����CN�5��+�$�D��%�ƿ"&Z^�v�x��e��9�{��+H	��7�V���4`"S_�KCrum�֐p�x�1��e�{�M��jFpi�ȴ���e��,t��jf��?�<�n	>x��?�������622��&�4��rͪ�1!��[X���ez3�6�y< L�ӿ�hu�6�i㙪�0+�Nb��ă��, ��v�q<T¹��^Z>;��v|r�׶mD�fFl�-�i,�檔JF�t���q0���ö��=��V���5���
I�$
:Mi� �Nh�\�28�2�5�u)0o;���VB0�4��l8��i笈�,Z2�Rm<�@f��=���p�;�.� _m9���M�&��ċatΒ Od�?�^x[�_9�5 \q�ظ#0�Z^��t4����:4�|��޾\�۶Wt�T]�Kjʨ#�r������J�za���`��*��i8�q6��f����L�%�������Bel��8��w�"�7��$��AB��܂c�E��P��4��=��v���	l����>��������RfbS]Ig��I��m��*��@{�̕G�Տ� �v��=Dw�/WT8@��FWEJ���OUW�/��k�\-���A��6)�7pF�����8��0B�Ԉ(D��q���WM,T����'�~b���h���<"�rV[5*����� b�M���G�T�/e[� ��R�L�'��F�Bh���o6����rT76����+�+߯�D�]�Ţ+Vjeo�W%�����{��c�-|}���*���5Wc���R�"4�n��k����zyb"��B�&=A-k:SU-��A������K͓C��/��.��*��Vo�$���O�/�;��ů��Y�5]F{��o<=?�!�~r*��3�p���{�ᛙU7P�༴2�r!y'7.}r%�
b�$m��y�A�"P@��M��Č� �FwZ��,H����TS�ӑ���7>V�%wGi9,��R�������I}6����H[W�F���.��Fv��u��J�,�h:k��_ծL�o�4җz��H%��!?6��ݮO�����=8ъ� �A,H�y\ħ�~/lY�d��7�q{��{��a~�P}�
�7);L�FTJ��f��|��2Q}���t��2~I����O����@ه,�+�vI��}3����[���oD"n�����|�������y�@�����8��)
;*��[������6ъ������'��L|�f~��%{��gK���o����
|�%[�^i�WV�j:���`TpN�D;�Lz?^H]�hČ��<�D*�VM��iŉ����&�r>,��B�O}�u��U���)��c�ɏ'��D�Gl�s����7�����m��Ai�Q��6Ը�ָ�,�/��p�(V�$I��u��q�����0pP0=@���LM1�9��`Gg�MÅs\{�d����|�Z�P5>�c!�X���W���\�D��o��Q����w��-Ie��k�}�*�a�W �p��P��it�(�H7Հ:��3�^�D���0���S&�Jmt�ݫkӤ\w�ky�I���uݪRJ]�/G ��L��cq:o��'oYs�L�4�1�"jm�So?'EÚ9E/̳]��s)�}"�~�w�R��0#�O��m��0��*���g�$r��3g�
���I����	�?�\3�!ѝ��rI�쮙ԃ��Trx�Zz(���ZI�6h#*�|&Y���v�[���g�L�U ��<G������}�����7f�T\�[2G4-�P ��J��	��|���En������&z��nm|Ö/���'��K��P�,����)5
�<vN#�sR��m�V^�=���p�5 E��h�)�����o�<$W�>�#+;��]^&��"�#9xI�^y)��L�A+����C�r���X_E!��#�W+�2bETaN/�O�-�`=N��Z�k��F���&��R� :2�Z����Y�|h�R�Y�~��HQ��D��֣ha��|�v����V�����A����r��	I���.Fc��A�,�č�-��p����O���o�<E���F�z@���G�(��:x����0������þ�	M��*
�-;�����@@�L'��%�T�M��R�o�5ّu�ץ԰�W]�>�U��1s���6a_��MĶօ�8�?��:7�dy(T�H�ً��`�H	Bn���^��d�]��SgЀ�4��%���B���tqov�0ir��?6�\ ��"`�i�+#��(.�T����q,k*~O��:��	#ҹ�����������dEɡ�M?�Ȓ��Ym�\E��>H*�Ä�A\��̷��/��%�b(�\��ϪXf�/�:y?�~�z�����cH}�c�O�h���\�n#�FvE"r"�#����b7A#�κ�X�7���ʴ$>��Y2��NA���_���m��Г�B��6�D�*��B_��Yk��OL�d!r�QE6g�JE��"��f���>�;���a>��/@��o�U�$9����I��ϸ��CD�\����n:����4x���9�[��T�lo>�}��Bg��ɡᓲ��s9���;��#C�d2�[�©ѵ����l��}Q͒L��3F���2��Y�@�P�_w��y�����O���/��[шTuMm���|zm���E�1��P�~$�
�{��,��l���gY�NU�pt������.���~j���`F�f�t�D1me{��<� n���Ҭ�2��?�5�N��O��:Cj!M� �\�Ǖ���cJ�ٟԬ��7�7L���K�֌�E���ӼP��\R+��BT
0�K���Buw�e�v�=)���)�d;W�t���Sū�`m�#WnS�t��yJ��s����~��Tl9dTCY%&of��6�Ñ�6������.�=���U7��dڢ0�RQ�k������IvLF��\�L�z��C� ��L���lLEme[�߈��ɾ<s�[���:��~������%��^ +ԣ��9���ƀ�����B�$x����I���5�d7뢆��/@�ͬѪ��<{p|T��|�$�%��}r��U�����Tn��^n�o˞*>�ӝ�ڛIUoNZ6�cP�Tk�6I�~��uR�~��I[���}�D0�jS����TM���n*SC��8�C��� o�Ҳ�D��-08� ӭ6`8(��<�3FW�T{gv̥)��/�vw����U�"�|(�rԄG�����΁� �aP�<ɤ��3j�B<��z��9��j��`���ҷ�GO/NѨ��!U(��G����5s�}��0�A��Z�w��_a�4?�״�S��7��+��\����Ri�d!�*+-m2��U4B'���.B���\��=�w��}N9X��Ȼ�S�ԖgSĬ�C��.I�[���9�O��kݏ���w����Y����f0%s`�5k�XJh���F��a!��*�g���5UV:� +8����ʿ�`����tn��4oV��k����n.��S�D�Ub-	��5R���û�~g���y5%�؟�Z&���ោ	�~-�x��V��32x�g�{��"��;3����7g|�/������w*X��#���,����jJ\c��,�*�-1��Ԃ�ؔ�F�E�Z������AW9�6��
���*�ryh��	�d�)�T�f|0G>�(�&�-�r���J��X��@Z��L̛J�b1�V� j�GD����q.��M�czZ�[��T%e�{�*���Q�ᴜ��O1������	l;	���Mt��	�Zq�T �ֵ��tt�0`��mί��r�;�.�����@l�x}fa�Ķ��wq����y�̍�V=�����#�(#O��	��� d_U��� Ь.
R��"hWTN���v6�ڊg���*6Z�w�)�{6J��忌��ז��]��[^�G�&��5�3c7+_�1�U��i	�2��s�����	��du��C�e��߇��U������z��i8�Z?躸O���C�-��'uҦ��Ps�BgWC�m��5�PpĞ.������g���N9H���拹V�R��~_�^�p.ԉ-�<�4�� ��It�Vi�%TA][��mT�������߯�]g��ޭzb%m ���P�;��������L��
�Vy��&zh:�*�q�;�Jz�eT�r�+�m繁���b�[���	-���q��5- ,#\���
*�GR �O`~��i����bJ
�lN�k?��#��f�֕6���V��`d�M�%O���%h��>��ީ����l�fDr���x�}���V�����ȯ�+T��V^�%�'�~�P��7h_����=���uH���G�H��7��������֥�M�9���K�9V4l�oѷ�	�v_:�db��m�9��>\���<taǆP�����\���-����-A�;��K>?Ī��C�EA�F��g8� �y�� �}-������hگ�rɟ������
��P���b���Q	TU�W�۳e߰}�)�D�j�����uأ
l����DǶTJd��0O�	ܣ�T��������t���J�n�+� @e��|?_�#gӁ� ��K#��	��xk��Aݝ|X~|cm@�"!}���b'G�X����]��,?�t���c^]g׍ �nS���GA֟c�0Q����v���X;�A;O@
�.3iDŦ~�I� ,(��U ��]������žf�� �s�Z_��6c�}Iǁ�೴���n,��n5= ME����a� �	r��D��GT�qU�5T�jusY�@FXH���ڏ�lW�Y*x�')
��x[$�|Jy�;1�>½����ϡ��6�XQ�kS��CT<`
ґƢ��U��3j�ph�ᐇ�d���m)�3\]R����V�͝b������!s1&P��ww�����a!��)�UD��P��&c��2�Evul�0�iƳ*@�h69���q�N`�%���}����Ҳ2��bk�^	\7�'��3��'g��,p���*�bD+�/��-�p��'j�6^�������g��'��\�dp�dԿ��P�g��A�h��2�8�Y��-��lѰ��!���Ӱi�g>���mZ�G����N5r�v�<��N�W�+��3p�����c��#�۵����fx�ɼ K�c������أU- �kh�+����T"���ʡ	�k
M������o3����@��Q�ʸ�C�nP߱l�Z��lx���^ַ��"��!���|0N!6���6����c1~�`�P��<| �_-�*AJ�N00�F���1��3��Q+�6!��ZUWm%�p�'�{�X�9�����2s�4�Qe*^_0fMM�;�QǗ��NA6����7<�k���/\�u��ޣ�=[���~%�h	"L�R��:�<4in���7l8�sI�I��)�B�7H� 1WҾ^0//6鶓�U�	��-A�/ $�}����{�o[�.��scѸ�m�J2�3�w�Qʨݸk�+uޏ������`�d�^�1(l4g�^��~�y�g��W�t����9��U^D���T�Z�U0~u%(��j1���ѶL��m��v�!���&����=�D��,�����h�-��zv���-��,1f�J�h�O�]8G<n�K�VqI��n8���`��(Su�hFu�ub�������K�� �l�j���*� �xF��ʑSM�HV�Ѿ��CئбAЙ~��޽�W%RI`����K�zQ��onSy�SL�e�/}���zn6/76�[Z�4�]��'�)�`��B��=M.vD�z����/.�=4�4࢕��`����f1��ɦ_(��-z�T��$���kzQ,�>9	��0�eVX*S�J��o��wU��1��ev�jq:8Ww}�BǹNnTw_��"V/��)�|�ӛ�ZQ+\���M��nW�L���&�U_�e��O,ls���4�4���Ť�wu��j�j�쯫�]u"q`��kN�������fX@�a���!���я]�̽�Ǚ�������wN塺�(����������~�*j��j�w��~{�5GnI25�*�f5Ϋӹ迼5`�դ�����^�;$|-���{=�t��\5^���6F�X�G9�0f��Cu���;�S� "W�X��4yP~E�C�˻�f�%�>���;x$u�����߱ۡ֜<f_�����AJ��SA�������:���I���.k���^0����c�.�D%ZA�j^�ułt���Ej]���u1���r��b6���2d��w ���<c������ �hY�����Ε�7���i���#��J��NwX��zު�)�9H�pk���E�S$P�sX$��*H��}69��BF{�������)��y�/�D��sǪH�RϮ4��(j�ؾ'�̔A��Z�YL;�e2P*��H�N�	��JQy<n:���)y���H��|Kc��7^FT��i�*��mG�Zw	ľ��:�5Q�#�hOm��t��j?x�*"�����,k�cA��AX��Rc�QT�%t�����%���a��d�`P��W�
��o� @�b�ST�Q.d�d	&6�^� ��6&G�Af�X����E�|�٭�1'u$�!,�J�%���@�ot'�啻���]0�JmXx�;c�����IM��c���eg����vuwt�-����rzu�������R��p�4'���/�<��B��݇�8�zD�r[y�Z���:E��T�к�	�bd
�)�#pQXZEy�͍mp�_����eT�i/���`�Senn!r2�הIh�$��z�w����0!�Ak��{�6�d�l��>���}��J�Ed�ꊊZ����,����T�>S?�f�������3��qY7�p�<G�|�F:���+���6ZM>�z��A �PYM# ���0��b=J?$\\mG�!��:�=ޟ,����H���bS��03�*��
 ��������vEcu,�7��i�k�183õ�58	K��H���
��0}âE`�irz��K�7��CY9�!Y�f���I�x����*׳M�ļj���$�ڹ@�F�C��r�*����)S��m�F4#P�"�#P���'釢~x����¤�=$�|�~�h�?4�f2j�|���
��a�oX��U�����NF���3��\bI3�&8~����.j��?y���C@� "��5�ny;����|]�*�l K�����a�+gI*O�=>DE���P�%J<�G#�7�6��]�O�C-.��\"w�'��{���=0�A=o���o�v�!c�%�!���ȿbG;�Z��U��z'C��'�	;���1�$�L��밢�6��i�����3�>|���Ӂ+u�?ań�h���L������v0���g	 ��:���Ʌ)s$I��%���c~��q����^_����o%���8����h8N��]=Hia������[Ւ&s�ԉ�>o�򟹢�=���M��SI�M%� Ú���R�f���(�Ѱ�_��/���L�C-��H���嵾}+l��֤�9�*eL�i]8�a�#���H�D,`R���W��d�V�]�P�#i�������E��Q��\���^�B�᪸�/��<�?��ų�vY�E=.^f)��X��(ڝ'H��]�s0q�k�\_g�*V}Qb���%AՋ-:=���(Aye_�K�4���X��8��P����D���%��6����NsQR'|�e�ä,_`����� iJ)7e�1d$3����b�G��o�=�B|��ԥӭ]
l��p@vS�W�_��+6|�f�3[�r���T[U�V�� P�d�}�՟|@vT/�CNlQ'��E��h3�F�a+*v��Dww'>]��侤�@θ�zh]':�V�&��Ѓ=sm��+���P]����|±i47��H����(�?*�����,bգ�)3�.�"#oʍ� �ԉ<Z��2%!�À` 
n�ъ.�V�,�Σ̳�#�(R��2�k&�j
@�mw��5��;n꼷0Zuq�^�Q��#d&��d��Ǹ�$�\��i�fƟ�NA@�t�؏Դ`U�T�S��ґ���LF�x����R}r�`R�����	7y=�y�g�r�� Hw8�OH�'U���"x���>=' %%k��6�e;���J��(F�>��l����7pZ A����2��R�|C{��ެ�0��D=8s��KM&z�2{��8+¶�X���!'C����rNc����Í:T�� ��qI�S?FTV_�Ը�� @IN���}pv���gt�-?M9L�m���`-3)�[kxJ\���1�-2b���V�/)�#��)T[�N�1���kY�'�M��MF�E�Y��9~�fAcY`̹�nX,B��]�һ�����C~�AQ�=(1g^���%���|�s2���3��ϐ�cQ�#c4��RG!~�>�HK�\Y�88����ޱ؀����ڌ4����7�u��Z�x�~d���.w�t���ށL@7�w��h����=mQ�Z����Aw����nܑC�7IT��Ԑ�V�X�����I�\[g������ѣ�^�犲��tD���p��Ll�1�lB��ࢢѨ��82C|b�K���h+/q��,���SFo9�'�S�R܍;�@a9=s%�9�ACh�I%���T,?�H�E�6!�	�Px���M��<��`_��a�&P|q�������+3ݦ���u^��&s���ҥ�M�V�*H���E$���H�~��"�x]���`����_��]-��}����f)��q���6L�G%s�"L����O��V`(�?'me�.Z��x1 u�н�M�k /���/b��aW�e���������Qz�'CI�#�L��Ŧk  C�[-8�@�;e�|�s�0��Vx.��q��C�z]ܓ�m�q�3���R��Ҫݟ�����rt7&q	9��}	�����5����{�#��a�e���:�I�(�V�$OW�4�"��X�����÷u�p=�����Xk��?�|)�����/���*����:�|��K�i7i.���)��ڦ��m́8 X����x�[�ݳ�n eTO�|�'��ЌTM��<4�*fǺ�iV�jJÛ���gI���~�Ϯ��A㬇f���3�3�_�{|�:�aMR�K���~�<|J"E:� K:����w�n��/�0	��q�HV$���4�$��F ���/x�I��3e�~&@w�l៕��U�O5͜*�d��fJB�F�$�L�V�0��Xa�F�Ц�lӍ;e�IͷT񁿺MsNpo_IZ4T����H+3�.�Up�����۟�w��)�Ԝ���"���Q������+����^����ct�|�`^
.A��*���{��C�>h�h�#�����y׈Q��e3��y�R��i�VG�zBe�����髮��"�	bF~����I�����>���y2�'R�����\���aWΙ��qK�ܸL���hJq\�`wގn'���ȼT�����]��G �dv�G�%M(Ic��r8���`Ѫ�����������
a�!FF���$�W�ATџ���(ӥK^E^?$�&�Q�<��曾�Q�bנ��&O���j�N\�i�p�a?�N�,��m+�^0�Q�6���),p�e(_��N�9�ֲa���Jz��ē,q��L�+��W�K>�+��I��Ҹ�&��%���m��D8;���D�ˑ��>��k�A���u.j
2q�$���O����f���Qv�eGڴ��h��Wa��U�Z�g�k���#�t��l9ο�zs��E]��
x<��<�C �񶄾���Tf�2�O���r��8v�y����A4��^�f��gXj(��Q�L���O���5�7��vSi�R+�I��tpO���F�����P�[п���X	ny&��_�П�A%k������1F�Z[�ә_���}��i���W�(R�a'�l�]�G��Q�Cn��_�&EF�M���Z]�N, �6(��G䏙�����8��8w�3���1|��=.^t��BR5����Ԝ�p�����;�pa����P��i�N"�jA|{틯:�4�6<�{A� v�P��Ё��Ix����7-::z�΀�x����1/���-�y�=��Ϋ���M��y�l�R`i
��]r�(�J��N��X�uF�F�0�{򽎁HC�ޅ��8MD�Pe�J�������U�%�bS\����_��pӺB&(n�C�y��oЖ�����HQ�u�Wp��#c����R#]M�;�1z9G�jօ�k�3�8z�.®Q�h�0��{8�O��g�Q0�e�w~om[��gNg���tŶՈ	,��Bq�G�7���h�[�s�L�z9�N�8�T2����]|r�&��6�HWkǯ��K��P�_�[�O��4=̊����ء)ܸ3���K8dY��=LK��A�2d���_�/:\_���l{ٶ|�G�����d��+MB���W�÷>@6���}C�n�9Qkd�,��.��6�-aaq	�z�k��kJ���9�<�G�\6��xw�$���!�Vִ�dw-�zX;�_�~�0�!�~�ݚ��&:����pxj�T:�*l:%]�ya��ѭB.#���g�_}��?wv"1{�4�RdǇD��t�N�Ɋ-r�jt���*,�F!�V[�//��ן^�љ�(M�Ho$Ic@t�w9�dŅ�<�1��rY,,��K�0s���{nܮNi�D�b+GĿ_r�V�j�_ZC��"�@�U�E$�i�����̭����x���82}G�&����Yn �m$�5I���#��<i��j�~t3��Q����w�o��HW����Y"G8���x�u���x���z�,޹p/��s,-��왇�L�$��&�0�j�G��$7��2y���j���\�|O��!���������o7�5�tķ�i	�,O[L�����¿y���?�#��Rx��E4je?�رL�s<G�������2���˳D�e!vs]�D��y��zb��'�k���$B|�@��+�D
�~��e?���������8w�a�ZZ��k����2lI�>�j˩>�~O�sB<�v�gE-�^�z%�4��;M� 4�w���AK\.��c�i�����G���O?��V���7�����f�����o.cmm�F[;
�#�y���� ��X��E����I.����ş}���\�)�i�=%�c�c;�#��jԱXn���%�Z��=�J��o=�$�L�5Ȳ6�y��;2�?��D�6��ĥ���)�'�=�I�Q-�\ocv��Z�*ae%�b�����p-�v�2#;9���j��ӵzO�{����q{v�zI��gA܀l6j�V��&f�X]��X7n��cbw�d��6��믈�byUY�_Τ�>�VPL��fI���cx�Oqmv'��ܪfۯ��LOi�˘_+`i����8����Y���e���!��ᱣ#�y_=��=[�|6���/�ms�,�S<%ޘ�z�J��Z�`�,H�VC���߮D���⮟�`��	u7��B;����D���3x�����_���uM.ve�Hs�M"H�V�����QkX\�h�{D�#�Ư?�#��}\��)�4�W�=/��ҩꍦ,���M.VC��XɡV��Ѡ��d$c?�?>^�Rŝ�/�V$9F��Z2��l�x5�<x�<1���&KY�$ٔ���;֤�k-�j$��-�D��F��a��t^��՛q���J�	������ʪ���	����ݺ����D�E�b�U2
V�#?�%"�P7̍X�<^2Tnf?��i��6R)�d9�A��V��
��$y�"˓H��":�D����a�HE�~���ۍ���JE)A���&�\����"H��$�T�F4H��b�&�һ���:�a�D�밢�p&�6L.�Mcz��񊄄�@��#7d������&�xɨ3��0�ռjA�����y��Əl�p��v��N����m� "3}]W��!�K�`�D���� tzL�Ԅ��~��<(�%�?A.,Wܜ $��c9r����d�	��l&�#\�AX����P��z�}�L�%UJK��[���	���$rm�����L�>�w��)�Co��bBIEqLΊ&
G��
z;����!۫�`���{Yt7�^MD�m������Ѭ/�o����ة�a���n�
n��ŭf78��
4�y3�u
2�.+�/�C�`@LG����43%:	q]�ɦԳ���+?�"=&���\�`�#;��H��5�"�7�����N���0v�4��Vgz�1[�����FCF q˘NA��e#��ݱ|o��y���#4�����"���5=e��+����j��,	u.y��R�~�K��M!�4eI͗5��}���#�����(s :kw��IR����]�R�~8�E9�J&,z%m��JY��_� jA:u�a�<��ha�G|���U����.?	����2��~%��(G�ޖ�1�5Q�ؖ�&��K�3�a���d[�Te�"��4ej��5cA,���ZHYm�7���A�H�R���~E�B�Ո��3d��5Y�J��j���BA���pO[�a2CV��+N�s߻-���@�C����qqѧ����-����P�˞�6�Ւ��%%�dc����IK.O�w�Vˉϱ�j�p��,:sy����*[��� ���d&?�Y�"^ּ�L��Wg��]�i$� �ө�Y�A\U�۾_&�G�I&A5o���D�.�����n�-z;@�poS���D�D�k!��rd�'�XL�A�is�8�D��W�~f!*ط����_�~cc�\������`�䋓Ț2��%�i�X����u�z�Sj���ì�j�s7��\��Z���{Ȓ��a��jCr�F�y3"cVI�$�Ng}��a�� �v� �Y�����	��>��z��\6�����ײ8�9��������M$�z�3iO���:2����p���s�pן��hyHtN���_�����v��_��}6������k��*$�$��J���so��D	��"	u�ȑE&�b,k`��Ĳaj�wLI84�He,�M�<|���%��vye�jUܖ�☸,�_�ć�wrx�t�ϸ��^�E�9��*h���^�I���a~qSS�R��\��,�6����&�V�ܬ<�da�i���l��h��o˷	��)ا�}w����ۛ�s�vK+�2떻�xq&G�8j�By|,�|.��&phj?�����8~d:lf�u�M'c�8o>W��ݨ>�$��ü�jM�^훜@ab��"�B.�C._@2�
G�؟��H��&�e��y�J���/~H��2�޸-�Lnr���&q��󧢧�I�'����5����mˀ������6�9"�~����y��ַhs��u���<���ڍ;(�wXZZE�\�d�ơ���M�
Y����^� �l��ю���B�_��^����+�d�r��4�?v�mJ����A�a	�	מ��c�(c�䐖lt*���ٵx�����ےӶ�i�BI��W7�7wRs���[�6e��iܼvG����:�<�1Gn��l��|aL�./�?�B�pD=,:\I��\��3��������C������E;�!o�Pg��Wp��٪�m���p"�~��`�SY��:4}@j޺s����c6n�̆Ez���D{m�����;��"韥ղ�l�N�;7=sVm��G]�x�qds�!)Y�0�ĝ���Fir��-㻯�?{�&�}������D`W�M,�&&"F��v2�|x�u�dG�����rl�B��
��iJ®-Vcjj���$��@A)H$�ۉ��G��Ǔ���Uq�*��]�z+�+8��O��ժ!g�Ȳd066NW�t�~gw��xdt2��A���;�]����?�F�g���ǎ��`�Q�5dl��Vo7�� ��ٖ7�@�7'�k��|���:���l�,ܨ�`�l����Ѧ�z�uV�L![���;�-�ޠǿx�fg�x%�}��~���D��D������>,?,�+g%v.�(	q�9��x������Wp�����OJ�g�9��.Y�U�ID�:o-�lY���
]5	��cn��Y�N��;]-�!�kڝ]��pot|�\,Y�F��#j��*.]��{K+8zx�ϜA������fL�
�E�$��2��5*>����?�	^~�u<v������
� ?~Yfֺ��	Bf������M˫U9�|��Tv�?0!���p��6"_����¼�e&:��WI�?r�	��� �����"�)�4YB�4A�#�\��s�0��{X|hS�$��'���x�<�8�=z��kX%�Q'L�f�Ŋ��-�'L�\��Ve&�S�?��c]�����G�u��Ƀ%��b1!O�� q��w�Z����.i��Y�"���s�#�B0)e��-��	�S�⃏Es<���?w���G���s�MT7�|��r3��Ҫ#��e��PEEv�ϣ?9���K������#97��Y�հ�}���	$Si
�8j�L������Z���"�����^��џz�q,-�%$�Ê�o���$.��	p��1���]�����P}�a�V�%S�z�C˱�}�H�?[�k�R�Ɲ�hv�8[�r{(���Nwnp������t����P����l4�a�B �ڎ�ve���{+�I�+3�Ϻ�>��nT�h��$�1B)n"�lÄ���4��Av�A�s�x�6K�F���\�ku��,����䴸�f罄�o!�|Fp�][֖����,ZCc�����?����i��;����<��hmi�{-s,X=�B���C%�=���/.Ȍ�GΞ��Ρ\���&+��r\�;;�$V�n��:#��VtF��a��|�3�r��r�S#��5Z�84`�beu>����"k�"Wi�u5�7A
-)��5wO�/ٛ�#�"Eܨ.��; ��k��8��EӣMF*҇ʂؘ[����R}��r��
�~�(��a��\����E��Otj#��ۢt[��a�>�}�����6'+�Q��e|r���
R�X��W>{4�t�ݚ]��(;�P��k�"U���	���%ԣd�9=:�r/��!}ic*\�yG�\��$�*k���h��V�xs��-��0|�q�v#�џ 뾿���� ��8ii�ui��@F�|�ge�]o}����w�"�N�HN���X+�L
&�䀉�]�\�^�#���#�u�B�d"��Ւ�(�p>��;^o"C� ���|�m{4�]\F���1�7ʕ���%V��Ɨ�}�XF�ƀ��I~>(��0���zk#~$�_p���F�/:YqH"Xtع�-���m�$�|a�uUK�k����[�OF<���e1��"R},F���Z��u�x=#Y"���u9���H��ɊC�bA���UW��t%X^����-������>"����
�.XoCmt�;7h�K%$�̅קY����-Ǟ�!4��[�A>�� ��4)0��-��HO���؀f��0��a�4ѺHX�HCo�&7S�8r��|��Tk-���`:��T���������XXZ�>��u�Lx��p�Hե������m�.�����	��V��]�~c�]��y��d83�����4!3j٤��7��Ĕ��J$j��mf1��@?bܯ�dc"�f��Ҿ�(�M��܄�N�HQ;�E���qVv]�5t=\޾V^��>�ݕ�\�R�v�tDB�[�х�&����V�
��]����'SRCҭHG2��NH+\�9�W�2���q�++k2��{C���'"Z�5zG�H�*�5�F`��0]�$a��'�)��]�<����i���/ I�+O`�!�<CZ��a��\���T��xs�(Mx�]����e�~�&���c=��3���%*��*��תU��9>y���2R���Ƒ��Led���藠����8�������8�w'O�)$�=$���������D��&�߱^��e;q��L?L�ܑA��\9��uv����A��$�A؏:�!�f_�rSf�JF�
�)�?�ng�@�y?��=/�w�nǲ���Q}��Q>����b�ZU���g�a�X��z]�3gr�e���E�[2��AF2���ϳ�8<3��o��>&���I��Wqk6��E7,���v��-�d���'>��}a/_Eڭ"C��0/��xs���*�!AdH�?�\��ܓ���g����`�H^�j����8�{b���a�D`�A�m�X,��C�/`-_A�]&�1���	�	���;�+w�P��j��{N\�"9���EJ�y C*iKNDj�}�.�V�vtFO��}�!����&*岸o����C矑"��+ȸed�r��%"MQ��sŨ�X#Peʑ+^`��������<�kn��;36O���Q����Ic�����L�H�#7>	�2�D�.Rāl�(S��IoD��\s��M�3�>"uؼ���i������?�)�\6�j�*��m����m�3L4R�v�N�݉8[�"Y���'Q(1�XK�$��<�r)�z��c�;2������y���Y��i��/g׿��W��//��"��$�y2�j�mi�
��͵Е�����^v�8����?�%�:�i�U��r�֚d�S�q!����1	��ގ �wk�s�Ԉ5���Rq_��8r�
>�t'I��{��F��5�
�yO�7���C���<����@����Mڇta����&�W�W�bTA�I���W���B��`i{o7���=H��qp�pd� >�~wVQm��6�tR0D�V��z�*d��J��l�7����y�'��Lf
�C��dy��][��XA�1�Ɋ���_���\NJI�����l��y4ܩǯ��:�W1;�(#J�m����F�ܟ�9��C���l=����n��!�H�j.�j7��:�v�ȓD�����Te�R�[���vl��Ê�$�x���g��;���8|(��G����!�V�fS�B�|E�8���o��s��SN��|������M�2����91�;'���,ӽ(�Ղ��Y�/�˃����J�+>w�11�͆L��f&�N�f[ә�(�
�E`��H޾u�$f�x�C\��J��k��C�.��v%:���7����Ny+�-�9��x�0�[8�aG~���G^���ͽ�m���t=ۑ��=�q��=R+�dS��"�k`����R-�zh-�B1L�5��K�bg%vAl\,��rV�AT�*F�Zͫb�@E�B�"�[x+����JE�zX�m��
���t� 
�Pi˦&D����D�P�q�,��V�(6G�ИX��h4�l�S(�/j����IQR�u�}�������?xT�]�.�u��{t��;�*�4A�t�蚠k?]E�����uF��
]Kt�ӵ��A�b�U�F�Z�v�J�@1
�9+u��
�AL�'�tU�����Щˊ~	�K�?+�Ak�ݲ u������IZ��ā ���Rr(�pf���N��?X�j� :�C1�Є�B�Q(� 
�D�P�(J�B	�P(A
%�B�Q(J�B	�P(A
%�B�Q(� 
�D�P�(J�B	�P(� 
�D�P�(J�b�� �o�
xY0p    IEND�B`�    �PNG

   IHDR   K   K   8Nz�   gAMA  ��7��   tEXtSoftware Adobe ImageReadyq�e<  qIDATx��|�$�u߹�^]������c_\qIˡ)�-Ǌ(	�?�=�A�$ȗ��%�y ��9��"M�4�]�HqC���r���~ջ���9��{fIEYiv�c��[3�����9��;�;LJ	u{��+����ͽnJ%F����x���Ԫ�^��K��������noo`����rv�x�G#hδ��<�����h4���^oB؇��ٜ�$�a��gW�V���7^���k0y0���i0��s�6��KK��{���K�	��=�=\�L��.���W�,����=�K��k-,��Ngos0{�a�C?���+��q� ��$����q���}0���0��i>��Sߓ��G�,+��dZ�F�R���7D{v�a`GQ��q
�������ˎm��Y���%d�������l��b0��;�E���F`n!�h���=�?B�2��� ���B�D�J��@w8��R�Tx�Ve4d&���,��9��L���#@2�i��6c0�ir!�.5v���#$p=�{�n�e��̒���l�!0�p�G�v���x��Z+Y/�O��Q<Xb����HE&D��) >�A�B�IeEx�I���9�2��[�Z~���LS�)�Lm;K�4K��,8��i�m�%rP'�Oo�",�4�D����7sE��4�Kx��_�'	������认{
)z�^& t5�J��$�R�6�"���������K$k�÷p�h�:�/I�$F�Kd�"�'J�%L�h�D�u��EI�2�b,afo��=�H?}���LJ����Y<�oŏ)��I#��d<�%�MO�`F�UF��_�s��'d�+Cw����K�B�������U&�c|J�ͻW�(b���i��s������Uf�?��;Ѻr'�Mz^���E���D���\SP�+���M�+�U�f������ J�63<�,U_��<�D	>��#kbDUL>���ҽX��9@BV�d��5�r�&�?�����|Wl��h���
I���Oв�X�4��`�ɣ�2/�ܧ{&�ǄH�(�T�����	�*�$����h�[�Pd)Xq������(��Ѕ��|0�r��������DD%�_z��	(*(L\�HBq����!�(��9�MS�ܚf'���1e���O�3u�,?i�T��'P�ϔ����Pq��ž�X��1k�<����:"�D��T�N�'jY�l���:�I���e�fۖ��F	#����ԅٜ�1|I횒���WHRM��!��x���L@�ƠP}��}���I���d�z� ��'D��7�K%M7�|���0"()�I���PSC�5��LF"�B���Ї���)��)Ǒ�N�iƳ���#��G��90�DWMx5WY9k���j�C�sfgg��ʙ �S�%�io�0a�L3x54��]E�(�HH�>J_.)�#�/T0�\y�rC�+�"���������۷kTr��g�U����0<�ve������4P�]��Sv�N�Sz>%vcz�-���ύ����,IL�]汙pʊ'OX�YqP2�H�2X<z<Y����~�[���?kkk~v����x4�Pm���Q�(o\W��-QyK�2��Sɺݮy��k�J�ZZ������0� Y�+i�s@Q�`�s�?�$�鰬�莤�br���Ri��y�/��PEk�������L=�ӑ�X��`�Z�9���{��0����B�Q��^�:���9������;w��~}��lp�)u��,�&IBnU �,$���YJrK�"�Z��^�t�2���O�E�8�4�KO]d�g��eS�Q=�|��R���cW�z�r0�4�v��V2t�8���w8b��l����q�|��L���T�i�
R�r�R�����^�?�~�k+|ey	���7]x�fT�� C�T�I��ΜY`�٦��އ���4t�./��FR������[7?���FiS��ZSQ;��)&�ZQ|rB�bY	C!X�R�ӓ��Hb�3�4��g�v{�%a��C��F�§e���&�L�,�b�.� �ή,hh��$�͏n&a@�Ղ��r����U�w9	��c��rx:�;YQ�)�]YUɶ��df�>7�֨
��&!h@ɢh�E5;*�}(��-�c���M~�Ɖ����xoO6�58ႉ�.�Q�j���d�zJf=�N?)a���T>"�2�E�s�(Nx�\℀��f�Q�R���v�D��Oi�T'�J ��{F#�}���W����?����[o(h�r�a�9|:ɹA<�~(?)V��Lj��ɪX�
�&F[�Q-Eᙤ	n)ZJ\2����!�Rω�� t}�!��ƪ�)����d�;��^���6Q��L{�$�2��E����2�z�F*t	�]�ˁ��$��h��������X5qAJ	N�[�8f����&�K�K�SZQ䙘%�J��F�Q[�W����T��aM7P6!d�eq��q������N|�>��	$��˴�Q"� H�B"-�E��+�z`ۦVǨy�������~-�ܒd�(�a�D�=>��?�
hXx���H��~*"`hS ��+����� ��)�s5O`e9�@��9`T���B��B9g� ��	�\F�6�L��;�����kEa�c�N��TT�9LC� �/�T��7�2Mנ(����a��SqdI�R:,�-B�$�!�����,����2�q2�0�$���<�_anX�z�Hx-�m��P�l8W[�A8���$[XEM-���κ��#�n���J��zM)7�

�w�H���x ������?�!4>�{|ܫ"��a��n�ܑ�lJ=�G���r�"L�P�H�x����G#�}h���X�����ZK�����-0K%V�8��d��`g�s�-%R��4���@�Q�� ft��&$z�՟0����E�,�Ll˒�x\14IV�קD��t��*2�늈������v�|4�e�W���K0tG#�̴[��I�uv!ayq����� e��'c�"�k@g�>�CP>����耠���	�d=EfX�u����SM��GW*=٬����joС�"a�Hg�%�pk�	6�ଳ%s,��v{�����{cXZ܃�>�u>X�(w�2��w�;A���<��ixA�<^�R-cz�`Qr]�%�f�Q����5d�����M�'>4¨#/�i�]�%�>�6D�����l�B˪�������<W}Оi�x8b�D�B+��tu��mXIj`dhB�Ȃ�fZc�D�H��i�[8X^���tա�R�y��!5Ouf*խ^����5S�aR�:G�'��ῳ�����F+�`��]�s���x�e�C~+;TX���@���yNPw�L�0�|6�C��a�!$�w��e� Tr �b*̦���1��.�6�}�欃�P�dl:e���}XX�@�L��P�eUr�C�8�d�:�R@�5徸fӒap�H���։+�E�"����<P]�
O��t0��l��PI>�oAo8�g�}��:t{������X��y$����t� !��I��}E��H �d��q"N���0
6	'� �����YQ��*s2&M72�t����S�� �S���MI�n�Z���m�a$l�s_��\�(���<l�va��I\���T<$�4�[��xn�T]��Ȅ���M'B��wC�	���dF�����/��:T�dJq{x�#�L��@�(�*l>���o߁�VZ�2���ƀ1���`(1����,[�-�}l��%M��J� E-�d�T�/��"c �;�㏦iqґ�"�q�I�X�>���V1��2�
�&�'�dljP2,���y�
��ސ��=�6j�ٞ�f�!�I���6߄�]���,�ga�ۇNp �M�`��"���9$�Dxa,M͆h�G�Mh5?��qő�:G��vȗ���������eBɶ0,́<��g��[w��ζ}_��<l��9�����,ķ"%j����Pj�=����#�}ʡ�Ah5�`�'ҩ��A�t��)pC��I�+"�Ę�y��m޹s(��"�-�t�ޥ�"�8����<�\�����&�&�1�c����<��^^�c�em���֪K�j����sE�c�9q=�$L��ȦS4��R*���a��dmqf�؅Z���n��W���*�R	�"���R��(]���G@�D�5�Ss����h��I�Á�ù����P�W�wUHvGc�z��%�z��,�H3Ps?x�Mo8v}����5Y�(��#�*�D��=U�R�Ѽ���z4�ՙm�����kEI�J<>���e��pGv 03L�=Fq��F�v*��|���Q�Utxq��1A>���\?�裛@=>]YU��GaR~)�ъ-�ƾUq�����Fb?X�$/"xT�ך৾�H���vC+C
���(f숱v{\`���W45��P���`�ѕ����G�(��L��֥�%9Ա	��s̏L�\ovv�d��L�'c�����g��{��P�U��/Jdە�R�G1���J4BM<j�5�/'�4��Ab������g�i�|��ٱmr��&J���l��Rт&�J��S���U~��ߧ�G���|�c�f{��(�s��'�A�=ɲ�� �jj�Q5D�tÊ3fv��(cz��oӖ� LN�oR5=>V�N�" ��P�7K*yf=O`i��Kn޻�q$Z��1�$����WP+�4����O�d��O��~��t��Œo-,�bη��?�'��كZ�VW�H����tA���( ��T��ը��l���{b<��Ng����徦q
:L�FJO�
�y4�>F����K����{;���3�kW>���w����D��� @�*܇� CI�R=Q3��fꍖ�����}������9���̌[m�\����l�D�����b��B�����[��������潗_}~����>���õ�o��7�|�K_���5ձ�<OM���/*���5�,f�i]z�(�E��s��v:f�RaTm�tk8��ޓj?G�)M�?5���3�����X�~Bˢ�Ŵr� �X�RXI���V�}���ވۘ;����������hs��������<�ѽl�A��7�{I� j'�c�w#���nv�?�n��� Ү<�X���v����~���HG�U��#PE9GܧMI���[׮�,�p��c,���m���9]=W�
!Mnϯ^��u�«o�>�T*��l%��Do������%��ˌ����"�L�5��>��U�V�מ�*��Ux��G��܎i9�ZRm�}�b�;*8�O�Y�����᩿��*�J�I�z�U��J�''����,3Cj�g���˵�׹ws��Ƿj�m�\�L]����`����I��������h6i�+W�ܹu���_���:���j��T2_+�Tӕ�G@@���"����嬬��ʼ�F�+x2��{L��p!C~�t����a���u��u�N�뺙�!1?�)75�&)���2k��������ȋe�\�"Ȇ�c�a�H�ʃ�,*��?���SW.���z�JΉ��:i�8G�)s6qGu?�^�Լ��5���Ac8(��UoԷ��7�$�h�� �� pk|8}_���T㚣Ӣ(}BH�Q��2X�I�(�8L��i\�?{Y�ԟU%�|�XT�g?,oa�RN���� r��IZP����5��zsn��y�ƴ ��CFV�5�f�tZY�h����g�%�n��@ϧ*��%��޸�H
c�E؉���3���Hi��BY�d���`T��d�E S��!x)4O�񹆾�3��,NMz��E]�����0S�FK�sFW�E������m��Ԛ���v2NhY�R�fc:kAb	�z$� �}�e9��H��=��_��C].rU��̦���!�%�� ����R�]��R�#`�Z]�aP��~���TQ�X��+��hZ�44c0��g�)�Q%?J�a��1-�/�T@p�4%��6+4��0y�T����°�	�δ0IV��"imq�^�6��Ly��?�~�s2�㣼�q��l�7��P׌L`�eU�d�h�F��(r� �A4
�8�S�j��"/�|��x����%8j��#B����"�b�c��ڝ�������f4�_C_�d	�bf�8:nv)�z�T��X���_�����啕������V�Ncf��V����H�!�J�$Kqf^ƞ?�����Ҕ*�:SǑ�"E�<+f�'���DJ���첰���L�(�uV�ߋ�j?9�'S<>��2�8w�#G����(�y4v2�G�B�'�)����Oiv��/|�0?;��Ϭm|c���7g��_�F*$�� iϤi~���h|���Q8tC�)q�Nc��ZLF�'Әr��u�h����M�p6qa
<ީ�GU8�y�M���nI<���T�������@�\���ַ��]^�����?��fZ�K+s}��7W־�jϟ3Juh��]K(<g�8�9w�wp�v�za�ߏ��E��h�&52t�� �ZW�o�#��8* �d�V�j�
���ż�8y��L�T�#�F,ōw�#�O�)��7Q���~����S*��e���w^:���?h�f~pquf��Kg����ƹK�\Y[����l�a6�='�k�ke*�'��ξ�����Q�����	�}�Q	G��hy�t��M�l>�j`�̘�#�,��K���G/^�qF���&ғ~Z���0�K��,,��#��?�އ����W���Sq�����m\�������♳������lnn�z�*-hrǣ��;p�;{���At8�?B��:7���	VH	vl��".>Y!>��v�$���+o]�,� �q�`�����c���m:r'�8j��=�����R��}e�=�O����ڹ߼��S�X?w�o�/-�8�:T�ucna�y驴��"��nw�����w���D��j�����ֲ�" ��@b��,��x\ޫo�-T�!�����@U�#�Eா�"�..*�c(�B����?��o_���m^6����3��r���X[����9��hA�ִ���W�I����A���������0a���TF�bh��G{���`B�g���^�&��I��j0���:f�J#)}�MG��e?x�]��ې>�������x�����ҟ��Zm��}����_���זVV� hPm:��hV�q峊���?�y���ŗ���Yz(@w����G�x1x��Q��)�I�)�:������e���7ֻ���n���^��0T�7V7~��g�|�܅˿5��<g;0��њ_h'����;�����u�R�$ICi�޵�WSUd���=A�~6�9hlZ��E-���� f�e���P/q9�>|����ׯ��-�2����n\���K���Z�ߠ�q���^����0��C.�2]�_㍔z���Xu����5"Y	*��ݼu�� �`j����k�[[������Qm��Ͷ�����&���Vb	���?�� ĩ�g���QG�O�3tx��07;��k�*���n���K7MJ>��/޼zC����2�/�_�~����e�mu*K�O�� �[3�j�T�ߒ�6�c��Z�	n�W� �&��0ݙ&    IEND�B`� �PNG

   IHDR   �   �   �X��   gAMA  ��7��   tEXtSoftware Adobe ImageReadyq�e<  ��IDATx��I�$Kr&�f�ŞkeV�����m(Đ"�D�^x&o�Rx�!OO3<�@p(��� �Ơ���j˪\c_ͨ�f�n�U����Q���xxD�g��.�
�5�/�����"���������/{��/�� ������������/��K�M<���]�o�dY�� ����܂�zI<������Y^�W�>�h5K|�|8M{��4���Q����*�U8�>8?�O����~�ӟ�aAG��u�^�$���~�(���B���0��tP�%\<x��F�`8�s���/�~���;Nb�pzvƏ/�5~�����>.����y|��'|UU�w�cp!�(��1�|�-|\�o�������υ�o��Ӄ�p��Q���;�+�c��O���������o���>��x�������o����b�y����~��?�����?���'x��9$�Y�Q���x�.^�{{������_�����w���O���s�ҿ�/��_���b��&M�f�ť�*��-�:D�*Ib-�\�V�R��yq{s���J㤷B.��.�:��^/�����)^�/�]���ނ�N^��_��w���bqp}}}��i\��@����zRVe���r���?�H�e�-qS|�1^�¬TQ�fA'�!�<�'
�e�&`��ݩ8��@9�`�;��S<�k�/�<�-�K]U��0\㉒�*�J����*E�����o��\.�h������;�H�}���e��>G4Ey^Ȫ�h��.^�n��u�w�Y�p��i��-�8�Q����e���E!T�kB\�C�)J�+��%.��ԫ�:��#�T!�"��[�ɢ[�nU������"�ɷ �Y!<�^���9޶`������W�(�}�T�6�Q�dw�0��N�KU�����������Ï�"���(4.U^���/
�Tx41	���9�ҁ�('&C����6"�k�#|�?�O�C4D+ȥ����xN��*ʢ���[�@�(�pH#�M��%�w��3�6��f��	 t�/�`�+,�n�שׂ�"j��R���T�j�6݆�м�-[��D���Xq톸R�c�U��p�W�-*B@�1���UyQjD�F�L�+G�#w��TH�	C ��4.t�(QK����}��=蹚����0n�!r�pTt�JD�b'��S�MdE�7���Y:Y��K�eK7��j.��7WWK��I���?��+ᱞ1��2��U�#��hϕ�'��|BB�D�un�a������!��]զ�~�ANA�#(��
9dv~-͢Ѵx�oAQ*��;�~>H��A�w!���BF������.ˣ4G��k��NXTt`:� �EF�����cP���	���*�M�U|�����*��U�;F����Oe�pI	3'���%�,M�!���VUYM�|��,��B`�=��#I��Ӳ��U�t�ӹ�<^�_�Ϸx�5�nb�@��� ����s�h�ofsBۃ�e��0K@xx��6�g�O���,!Y��h
_�)u��*4�Rl���X�)�1�z�\�.~:B+�_�糁�lϞ='㔣kJ!�%:�$E�u��������M����� K���_{��&�� �O��Z�zٛ��63���n��Y��~��Sh�,r�hT��+�� ��	Q2�_���}:�ȥ"VbPb�H�G�ƚ)�x�V!px�/���(KP��D��hޠ��``-���m"���V��XN�P��c�>��*�*r�J�7����V��翠C�𐛨���sY(U����v�\.~����U �n�<���3Y��u��1,{���}A�c��I�u�2�u��ꯗ������|p�ƚؽ�V��P����&�	��ze����^���d�NԝW��DMH�"o�����D�+�;?c�<'2gdr#ƍR6���ż�ˏ@��t��7��ٰA�[͚�M�����U��!�S�_��g3�s:�R���d�������x.9>��)>-�6�j�Z�����n��"�%���non���s��9R�aʑ;!�=@�F��E�����uov��F���f� o�#`~C�_��!#B�&�G��*��Ah|;�Iˁ$��v�Bv����'� ��>�:Y!
N��K�("Gt�Q%A{b׺=�j|��7~_���X�u7+�!��n]�#��J��c�SEb�yHV��&��r��.I$IY�E��Veyw������W����os���
]����N��nGx��+Ǖx4\F�P39b�q�������X�!-��5ϔ��=��m����`Ç���tx�qo%(�J �l�`�R���h6Ŕ�%r8t�C1�u��(�y(�ǘ�B9�k|��v��p��\�04%:��A	t�d�f��l~��#tӞQ������a����xDE׼�.nv��j�G�͈ ��lD�5����n�7��D��A�x�*	�<Y#� �'�j�JS(�C�;�j������rB�U�B�N1�*H�UNR��q�/��T��K���c��r1^��#|n4:8(֋yU@�)��D�ox.�ߋq�ճ�s���>-i/����ش ���1X�+t+�ǈvĬ}n�_��υ���gK �DsH?��$�h�'�Al@3&"d�� J�>ĉʒ8	E�ɕ���!e�g���X t���z=�,���̒���Q+�M~5��ox_�7��ׄ�|����T�
z	P^�X�<qֆ~���Z�І*Z+��-�b��|k'����s�uxǁ��i��5 l�(���n�6�⊭%%f�R������<��\}P9%Qu��x���(�lQ����H1/S�Ƚ� ��
v�_^���Ԣ;��7&4&ab�ar�pǕfeQ����!W!���#n~Ⱥk�Z._m1u�����}�n�� �Z],��!hk��_D���$�&xE���{6C<��"�0�g_<�O�BQD$���$g�x�������ͬHw!6S��E�]$��Tv��"C��oD�)���#6��G�w,~?sXǝ}+�Z�>�j�j�������~�5��w�-&6��&���D�jg����:���oI�5��}�\w��޵�r�C�Ȯ�j+�P�o��'*?����fq���5��R�����\ ݰ���-��޻qi��s�ߛ]�����m��vMdۂ�XGU�md,goΕ�&�b*7�v��ӏ{�ѯ�I���r��5���k�����yL��xaWu����	h��"��(����i�-�Q� 8K����Ք+f�.��e�u��Kip���&�u6k��w��b�w�����*^�j�[���d�.Vw�c2�����) D�wY.]��mܭ�x\;���PݰU���a�ɺC�[�ȳ������F��ߪv���:�`�|��&���Dw����\��M�W]��'۹�혲�>C���J�0�+gf���k��]�Im��^��s�D���[�f�W~���\�\o=����,�.���<<��Ǿ.�n}��su�¼��s5lW�nan�hW���k�-b�� �94TU�$J�
� hvS�xW [��h�R�V�!%I�ʡ(ݔ��U+��`^`�|s�?�U�����}n��R�3u��q���8/�!��~b����ES|�1�3󻓂��6 ��Ju�%:;��\5A%Pƽ"��7t`����۔��D�޲> }'˙���E�m�pr��Y{�F9���5��!`�lT�5�� ���R�H54��ނ��K��6НO{Gi�ݴ��v��ߍ��q�:7�FsLB�,�{���~�����pD�\����+� �G���[��vq�*v�pi�Z�{�oA:M*Z���[��=7s;�����;��~e��k�v����^��$�=k`¥hC���,�t�@H��R�F��Of�<ȮPt+!^�X'��Hi���9?W�}���u��֠�q~�x����ۇˎ,�V	Ư�_<�cf��¦Z�}B ��U�r4u5#m���h�_��(o�mY+��Jߨt*Ut'�.����H��&�e���K�_u>U?��m<[8 ��}�b�z[Q�!��1л�a+QmEP�ts,�vg�iE�ڔǖ��� �-�v\Eah0��6a֏ne�A�H^��p���UM���KN���+�ZÙ[ܮj����oY�tu�IFЯ���>Q�u��_�w��W���w��{t`�a�$�������""4�li�gn8�u����󸸿Ex�P5%��2���Ȫ�h�Z�X�8u��i���$$���{ս� ѯ'���e+`_K^��us#�ǿ���X����̑(�f��L�I66:~�z���Z�U��_��]U���1�'5(:�-5�T;��e9w�o���f�X;²���oX�;��ۏm���yE�3�h��:���_�B._h�Ń��:���.)�!� -'��_�d���!8�����Bk��,���;ts���Wxِ=@�'q��-Jۍ����]K�����A�pY����\ǩ
Va� ��Ot\J���Y�1��P+p�,�`����14֣]ꀽ)#q�l[�~5�;'J��Ԣ����y�[���n�BuоX��~5ߞ��^���~_��7��u� ��8�a��)�	��2N��X7J���-d�Bqߪ��O�&�A��xc�BqM}�_�^cI{��c ]c�w�w�]5��譮w'T� `��^�A��Ɛ���W����j����ȑ&]�1��I/��DPc8-vr��h�c� �:�^��%qV�lv�J
"V�����G�+G�F�Jm��:�Н��v�O5nRmNa����_5Lĺk�K�}.��1��s���p+�۠�Źݧ�z"-��� ���a! �����C�n��MFPK ���x�vDs�7��^wQ�hPV1�̢T�ʁ*�AY��*)�g�T_�"�N�_��P�a߆/�7������}��X�����vv*�|��I:W��}���o�Lag9����0�~/�z�GH���dnx�34l��M��!Tτ��$�Hr�lK��)g�]S�;���ZD�DJTqQ��,r<n
"�x![�_�[�Ŏ�fV��-�ю+��aG��&z��U{��B��`����"�}���@��Y��C���v*�t��I��j<�(����&��뺸�q��4�1H��H�;�_7�Q��/�����_Y\�Y]�%:x){^�ra0�n����ֆ�Zb��J[ ϳ�[��Z��[�o
PD����v㳻*��v���A��돆�12����V^\\7�wAY��$~�d���?��������1�+nb���k���	�Ƀ@�KI�Bˎz;��Q:{4()�4F��ACD�|
v��IC[M�+��Pv�yJ��NXv�3�k�����%�>��w�5���G�L�S�G��:z��E����p6�I�<(AÃ5�(�
�:<<� ��T�{ W:��2���lͼ�&�E�'W�������F��>��91D��7 Y�,����bK|Z�Z���t�Z���&��f��g9���sB��&���-rW���4F�;_�|7[c7"j7ywo4O�on��������у��SF�x�n,J��+H5�,>#��(��S���ʸS�A�20�}��!��f4V>�{�g%E:)Ҵ���!��V4�-x�+Z��u�k��q{S�[����tZ��b�� ���Ub�_�w�Ug|j��^<~�8y�V����Z�# 0zI�(4����ڤ	:�J;��r{���ߠ*���'!��5�l��5��f�[����2=�Z�䨩��h
S�1��4(���	r���EH�ڳ�^V��j�m�	t�������*�߻X_kط���Fd�t��p4qqM~��_$��k��}xp� &�	�U4+�f���o-��fS.Vˬ�K�K��Ac�
A��4&��o�U��ecB ւ��3+" �� ��ƔR��qua6�U�
�4�t<t�TEb�Z���
���Ig�
a�\��qv�Zf�Mʈ�ס��>��5�Av[�ץ����{�!���	.���~�����:8y� ��.UI/�ޠ� ����{w7/./��,ې��,����<vJ$hiB|.�1h�0��91ҿ�Jn'�J줇e����TH�����]�D�(���\���qL��,�r�
��G?��9���x4Q�ɸ<88��áB�Ǜ��TD�]�K�MbG+�6�s�^�Ƚn�7�C{�6Qo��� y+�N�������Fz@�]&�i���!��9��ǳ�]p~v�|��H��=^i�a(C(�\�|y�_\���4�9SAF�?���j����"%��@˂;|������ߙ�sE
D=$��!R��"�Tb�/h�"��=��,w��y��zr0Q��yz).//��Ϟ�.ꓓ�����(��IV��0�Mk&�i+T��D�CV���]�A.�Ʊ^�r!�Z��	hݗL�o ��z�Z/��z���`����p:���>b"��;�������Z,���_��@ 	\����iв�m��U��P�6�9�{A*�q�sL��]aB�%*v�^ɕ����R@�e��U:S2�(I��O�ZQ`�:?Xl֛$�hiJRsGp"�.^^DW�����1>�<��8HW� ��k+�nl[�CU�MK5��f �n̅؇y�F��UGl��w�0�Ih%t��x8�LF��F�^��b?�O>���SD�ɭ!�[����E������g���Dc���M�� U$�F$[P���J�$��Gro�C��lY�B:q���4Ka���6�IL�����HC�h�Yd�Y�*�ő4<σ�����(���E֪��J��*,� M�>��Š�
���h�HhEtZHl��j��u+�Ѥ-�2�4�R~�� �:��3g��-MW<��?����iL��\d�gP4)
x\_]�g�U�;��ᑐ���B&`� �N�X�A��1���@w��2�el���q�h���.O���Y�a���|����x�z���$���מ�6k���:�����z=u����3�2Ӡ�O���tW��ǡ(�s�G7�FD�J��]�����a�U���c��:'}G���-O�_hB��x0Lp����4M�>�I��Ĭ�n�z��/��Pw7�z0���w�l�s��,�~���g���P�x<⼈?���i����:���e����c�^}8}@y�.�����[5��	��5�Y�e�q��kB�j�t�TY������i�\��F|[��4q33�
�*�����b&����T�>݉3��K6 ���[��t�繐o(Imt�]�g�ם|�*�� �^�܂��ʳL"I|�h�0S�;uQ�|��R����D����Ҡ�`~!���O>�D<z���r�VK.KYS��������Jms&.3gw{{ �B�π;�ݾ����l��oo�t���4���t	e�t����[��p8
p�r��%�&b��������E/]�`9������U��v�K�#��i�{خ�/V|;�f�I�=��W7[��aҋ�7F^A��(_>xp�шǎ��Q���Pӻ[998D���&Cwg��f#�0~�H|���ݱ��)�\�ͅ���]�[���<%�r���b��&�j�r5E��x(�!�����É���r��WWW0���xF�X�t�6�z5'�nW���"ՌQ��x�"xILY����ˋ1�D$��h� ��7(K�z/�������f�5g��B�����0�|+�Z�\uuu]���kP�Yprz�ML���w�B�=8�|�1�&#A��"���J9�-����P�FD�P����Gu���=�!��l�(�HA7�v4���S<��|��R�fsU�e���0�z1�ZU��(@��gmI�'�`�КtVd?{��x5�V������P~��8�J��TaF{���DaS=�[���.b�#����Q��U�\� �SX�g��������	,.B�@�o�����z��M�5����[!^�����ʰ��Ve�vS��=�ʭ1�Fȸ/�W!˂�L�[��` ���g�Qf��j���
��z��@�KOo�K2"��@��w� �����<Y�7����!��Eo8��5��V�uү��_i
��c�S%� y� i������z̈́o�մI㸇�U�F;�\#%h�r� G.�n]��2�V��}�{b0��r� ."�'��9����܊(6��+B��:�Tg�'��iN�]JT��Ӗ��Y�s��������ӧ����F�_��@�Z_�|I'#�M�W��Kؽ�|��x�\nV��R���J����yi�K�v8��u�3���aJw��@�$��#���5F�1�H���%�(��\.(��� �E7G˱^����3���q���+��0H�C���הV՜bSȺ
^�\���ҼE�Q{WF���=�g���*�ܗ�ެa2����������
��v�۔������?��!+#\q�w<<8�����,E�>���Q.à�n��e]H�r�[F\{��B��]�]~S-H�;-��~/9�Aǲ��VQ�?���,��䀉�|���z-?��#��g��4����I7��p"Gl�Wʮ��g�)A��11_���Чv�'�1'b�E�w|m�{�"(toon�nz�N����]�O�Jx��J��ŋ��ի3��H��515^�}qzr�^�D'�����ql�O���+ڹ�˔�x_�����]�uO}��lp����\<���'yu)̸b�ry������E@�cC���9[�t�Ɍ���R��W%[7t{*����g�4��֎��	Գ:�~ym�M�$�m�;\^]A�����<::�E��Y��C#H�</��+Fğ߃0��]�(@K4{����:/�1Z��~]�'T�Y�	L�F�g	yW����ѾLZ#i�n����;bc=�[lޥ��z�@��w5"���N����s�,�7HU2�5L_D�<b���L����@5�:�Q�9��*�iX2H �3� �ε_m����I�)>Y�l��ˋ�x[��������l}n@�������?�y��9�2}),�H��p(х�1�k���8K7	~U����3�G��+�iJ��5ݭ�u.~�a���0t-�@ ���C�ǅ@}���|y1�J����fS'״M�U�d���B��!;��ksuJV]����(y>���K� ����)3���~W���S0�p.�����V�Ͽ%�"R�(ђP$��/�=U����fKS'��&����~�U�Io���.g�#t�(��}-_�P4��l��[���Xo�(%��!1��̭���T�sZ�A0��$���8�~p.(�J�+w�� E3��j�	�"T����D�U�x䉵A3(���˱��hnA��C�uD�X0��=�Jh�_^����-|���-#����c�R��Dܼ����_�u���_�����������t�6��H��6NW����!k��2�^)��X��M�%�\!��vY��:��K
��'*G��4�"�(K�@�A��>x��O��ʶ�
�$�P��&�-Lq�I}l#�Y�ȂU�R�Zt�^!�~p��n��Zn�SQ�r���nno(R'>��c:_ywsW!-D��b�ZDO�<ɮ�o��(<::�H*�K����`�g��I��o(�e��6����loA�'ok�jw[Z�	���+4��6do0�2�4�p*u?9=A�b��D���/�v�mbL�@������5/��O�8��b[��;��I�)S&�\	��3����q"�楊d�T�M�D��w��mC��բ�S�I�d�^DE���lQ>~�����ˌ#dĿ�@��j�/��������6VC��q-�=@޲��q�R�bk ���~%��{�,�Љ.C���ӌ���x<����*�L1��B���+�pa�J&�DqI=�v3@������.�zgUX��Y��T�z9[�D�ϱW���j�D ���y�w���`4��4!�� �el���"{QI�7,q'�H@CWK�u��u���� |�oxcִ�ue�|��[���m2!�SxB!i��yA�ڛ�*H�~�^��9>9慃�1\�U�*�}Um�rV�,Nrz�P�~N�)�˅�F�Gm7�h�Au�˷*P�����'Y$��>�����3>�O>���?Y�܈�WEm֋�2B� �&L�3��^��M98ЊQ�NĪ���I�[����߫�&�6&�dt�Hh��4'�]��`����ZL�Z,��<Oŋ����s!�1v����P�U�
/QظJ�k������[��ڞ� :�Ï���yi\�~ �����Z��Ï>��Q����1Z�b��r.���vm�-8��I_�Y1X/�C�J���F�o���A��$>h~�3nJi,�o�F}�OO7k��� �1`>�qؗ�����ȕ)	������l~�aMdA���H!��/���"/|) �9�.*UG�4V���]���&�Ɂ��Z����>�ʞg�i�>\8�8�C!���3Α(�O!���c�.gqQ����4�)�3H��W��b>��	~C��{�F�� q������3�RxH�DdC�\ն��<�*e�7 R��tü��sAuL�*U�S����<v	2�7=-/s((�.�����܈}�E�`�hE�tgv���6�V�/��9)/������6�)������|����,&)?B��\��
���D"L��.k�"�I�*���f�"�Қ��J�n]�M������T�;���0;4��{�������$��FR�	}����`8�Ų�>9"�\���Y��ZeI{�����,G�	.&�0	��B��s��k�r���LF?��ܶ���p$��ך��"p��D!ͧzq�7�<�ࡤ��G�YhI��:�vbS�i[��ޛ�{�*�\�&F[KtD��3!���b�]WNS�&W�~�9��v��\&������d"�6�3������-���i��I���"Gص[�ƒ$�ùa��M庯'�ݎ=׆�'��J�mtMY�+q�58��ܯ(D����d4g�L��ܣ�ێe�YtL��	[����
?�Q��q�o��{��0.+�Nf�됴�����![��KJ(�OM�Tge��u��i]^��y���-U���ʴ��fey��)���\c������f�s�3|�h/B帅k�m,�n,�{ଡj�E�h%0����-��� m  RM)�,�tM�����K�!_�2"��|:;�#Wj{��A��(���Hǡ�)���>4z	4AVr�+E�����KE����q�'�*�4� a��^T�r����Wy�U6)WUεW�e�X��\���@]����c�������wSΡ�̺j �BwuJ]��[��Q��t^����qzr,�^���8���:0탺��$�z�Z����h�\�ֲ5hj+=��o���U�״#Pu�%��m�Ib���=@�A�Vi��^!�ǈ،yi��K����x��%�vg.��;��]-.�'��6UFս�H�\*���j�֡3�JYK��9�Z��zT&��u���c(�H	ҫ�K8>:�~�\RAJ)dET���:��9ϖ�>�E(ߴZ�G�W�[��m��� �Ȃt�,\�'И�/�L$�*����F�8������bP<CkR��S���q7Ҁ�bB�U]h�Rr�����G���v��jZo}�I���8uy��ri�X
0Ю�QU��G��rv��Y ͖��}����kqz|&�!�F��U����ӛ̺��#�gc�Z.F6	�L2"� �k/�{�6�����	�E�9%Ȉ��%�O�a��օF���Z�%WF��l=J
��rתN��a��`J:*�Թg�H�cte�54|��R�EaK���d$����z�u�*�܉�� �r�:�ȃ[��~�#<�d 霉ǅaB�H<n΅��*�<�$�yQD���WWfjx�~�˽�����T�#;��h>Q�7����X�@\8��'��p��Uz���
�0�=��)�U��/-�(=����� �p���jFbG�p��A�lbک�� h��ԭ���ږ�)��ЍX��+U�exl(�~H���a��
氌.�'���T�x��WB�$��SYf)������)���F�X�z�F�5S6DDn�{�-y/��[5 �1�u%F]����2./�;��4�R�Ɖ2�1[��j��i���C8�'�i��Z_�,[�5ɹBW���նrDX�Ū�W�D7�-H^�YH����̦$�j����`�\�@P�$��q�~=?�$um)�W��'\�s��&��b`P�7� ��e �d/��]B�{��ῐ�E��Y��^�y����)X�6�Q΄���)l6�$�; ؋�j���ۢ�{��,Hk&���RF���4S��f1~�EQ��ċD@u�Ak���%�38A��(��ݮi6���+��+��5�thJ-\�I�^���o�=-F�-�\I�|�J�Mg�w#��z:��1�ah~�h<bSv㬋�\��v�Q�dYb���BŔ=��+��h5d��@P$����!�-�:�Yr�>�����M��E�]�n���e${�:4#��):���֫^�gq����˽������%h�z2
U�JH�^�xcL���Frt3�
��}��%�lI��n�)Z�),(ԥǮW��#�u�h���uB�܏0�I�������bb�$=�)���KA�n2�Z����NO�cqr|Į�/�B6�E�)�d_��-
����s�-YY�BW
�}��� ��_�ƫ�SЪ�b�����/fל �!��C�Ke9Q`��*�8$+�K���(E+���݀î�w{��@x��F@��J����E�˪��ˤY0����'��|���;t�f����#y�;�����;x���y���i�8�~�������KB���t�Н4gd4p"D�6��Ů�G<)W���L_]�hҺ:yp�^��<xΦ���X�?��8�`�.�x[� 	S�b��b�>���@`,�\њ�U��-"��)��O�D�;E��(4��E�	+U��(f���!ܔ�֫U29<
���}�{�v� ����-�t�h��H��U��<u�&�X�@�E����D�>E���u>8�gp���������6h�\,[��	��Ɯ�;0F��|u��B�h^a�b�D�+�K��%��Xl��ӧ+����'��~���.J�yW�hC�\�J��!�Azoh4�C! !wj�����@Ao(�r**a��>
N�j��	�?�ZDq�ɚ�f0�0�����>��G�)�T���� yga_��������ɲ�n^x���ħM�uԌ���� �A$K�9<[_�+˃�|� ���#�������_�I>����M����_Zi�Ii$
L�>U�fyi�
�z- ��<�*dM`�&�'�"�H�n*�9\k],����J�T����o��s����C�U Xȝ�a�.c�J���Q���A|���+���D����K;I36���NW�KR��آ�3oJl�{����\V�%��ě2�q�2B��B����I��L~� �$"Y�^,.a����:������O��)<]�d2?G����~��M;d���`��J�X1�� ��
�,M�
�I��	_)'�U������k������N��)�P������n�9��2DN�ch�}�8C`C7*,�(ii�Q����q��$�/!J>f�ˣ�ȤzO�k��� �ϖ�f�N�ءN�<����x{"qf��)�F��cJXyQ[���n�����qku7�{0�\%Z�M��/��bM'|��������p���^ɹ����c����f�)��\�u�}H���2����!��Q�K��'M!��b~�狥��r����е�S.�7��(Х�b��ψB��$A�Υ��)�N�R*|}Y��9+ "X4n*H�����2�����n�o���¹�g��
v@���x��\�e��z��b?@�mD� (ͪUM=�/�����I&���*	]�� �%�8.lof�L��a�1�E�v�e��_,Vp���G�3x48���߅���*�:G����L4-"JR}�c�NYp.���W��E��
^<�:[�|�!�1/:�ԥ�RhyD��il���X����#���,��	�!UF�@����fP�v�S�@��3�*�h����(�A�Uhs)b��,J�@�s����|C:��D��*6�!x�=f�nz.Y麈�~��; ���5�T�e�����v��i�>���l�@�m*�ʟs�Lص�y�B��1g�?>����:C.�	e�k/I�J��/�y�pPU�p7�Ae��}It7��x}u�a��h��C�i� )�T��z#zz.bA�1T(B�腨��R�6��$*�v�IJ.LC���A�\)�%�"���&ӨԣK�$P0��1����*
d�V�ŖU�N� �le��в��EVF��Y���u�b0v��6�y�Ej'��D[�So�q���`/���A�]qʕ,�5&�H�d�7�R�0�Q��9�j#lNg܅7�
AY5�0/����?�Et{{˼����D����Es�Rч�Y�J��Da�����{��@|�4�'��"AnV�� H�z����6Ňd=���+-l
8@yđ7P����h9]�Z��$
3w1K7��Mxz��� o=�n4�[(��F����pu�P�fƍ7������dw*�R�EE�^TH4�#�F��^;ߤ�+�������z��È��oJ�f5�����ϱd�spxh5���g�҉\�ABQ�x���e���Sw��!��o �׈*t��	�t�@Y�u0����!m�f���)aZuM��"���D��F��D���9M���Ԏ�7�n���F�ϟ���ʱ��k���dk<A-��W��%���a`��/���ȝ	��F�Q�P�(��ww|�r���K�!i�Ņs�(9�C���<S�2��^L�����v��s(1[��̠PB�ܥ
�@�0��5� ����QC�TF�����,-l�m�U�j�8�&�k�z�Y
6���s�NFxT�TF���w�����y�Fp�݉xk�-�{���I�jG�jrP�l�`i(ʁX�N�ʹe1D��M�̅�1hݹ\��`s��n��N;FCs3ʌS��!	�� �[�pxr7W� +p��y硙x�.
��9Z�A00��4�9�(�p�K�z\�?$�A�q.������o�햿ltU�o�2Zb���Sx-qg��:�'�ɡ�*2�J�_���.�,�҅�;‱�Ҕ�7���j�0�y��k��s��1oT�jD9ZyhƝ)J��b��\D��)(�{3pG u�P>F�m�h	��?�C8B��/�0A_/�p{u	�Ƥ����<�db����2ӽ���&^A�*�v�(���M��uT (Z'��s"̥-sאF�*���ZV޴7eqZ�yGA\J�"�����X��L#2 ��t C+���t#ۿ�EK*��WҸ[�'1��S���&��(�p�	sW#��*�㼌ٳ����!�|�-]�N`9��L>G*�������##�E+�ѭI��F��"v�'��3t�f.I[��鋷�Vঃ���:ö�D�֬�4�}��M�P�?�BJC���r�m���wbC��3[����������L"�2�
ք&����t$�Z��o3o���yb�A�-�+5o�d�d:�XT�O��;�v4�|6���<y�+ 1����f�inz8X�����5����ud��keU]K����w�:vmbE @�S��}�����87z�p�S�4�_�MZ���q���B�U��x����2�BK�P1Q�،ӚF�('��,�{e�jJ�m�����U=�Z�A}&h�D���n��upt��+X�f��l�tH��S��M���9������dw(�[�&w`�Zl��Q�,�w�Zs�k�Q4�mߓ�t7 �=tz�M��'�d^Y�
�R�릤�[�L4%>�˒:+�t�9�X�g�~/�;/�h#Z�"�/A�!_ɖ�`>»�Λ(������ﲞ� ��N�.YA-� 7(�e\/gFe�(q��\�{tzʕ��m�d����"��b���>� �8�!h��kOꓪh�Fe'Ӓ��
|��9�ž]��Z��OT5�v��&7a�*EK,)�,[t��Ժ��3/�$����	���$U�����z[��d�3�ʖ��+UR�R`�����kӂ#u�@�AZ�f�]�Mz9d��π ��R�B���ѕ�qG]�)�q��k��)O���T�Ee��;��Vez{��p�8������O��ϿO���^k<���<���L��جQ�`�U�^���q�U�Z����-"[QO���E�P���,� ��sn��GY>�J���Zt�R����X�І�����$t?�6D��"����W~HN0W���V��B�Y;镻Cl��%nt�%\ġ��]�ì'�hI�Y��؂��&�a2sp�����CX��L�c$�A��W�No�9�Ç��z,�����;vw6��y�8Z!e��V�͍�`1��g�'-�<P���(�����LTKِ6%-���:�v*��R k������¿�PQ7� ���=Ix�N�+�����y�� �:�Z��,���1.����]��JH�6�+	������V[%-t���L�"f����$abeL�$L��E=�$Ơ�� p��sSR�w]��]+Wu|xx���MV��v��\�ŧi)��S� �ۊz؎k��z����9�P�IV����jx
����:PN�j��{kf����]�n'5�Ŋ:�j�_GܷuvO��t@V���Pc-f]T9uB��?0�T<P�A!�_mY��je6#M���Q1��k˷��.H�ו�k��mZ"'���1E�qx0�-n𾴢)ɮ����j%Q�͚�MN��d 0      =/$/yW��{����{!ދ^�����*�^$���f�f �  �j��z��GҘ{��8���06 yTq�P`�E�X֔U~Hk��s9JE��@ r9�C)Bd @"�R�"@$��    # @D0��'�r�� ��D�~��ik�̆m�Ʋ��^QF�rE����=������D"ѯoJ!
��痰y��X���o��M�1������+�L�=|���sغ�i��$�aF�`l�8<��.�0V����́��g���+��'k�0�y!�8��k��dހp����i���r�@�ۢ�7���J|�U�ġ�Ɲ����מ���p��:%�HAm	��y|%u�D����b��>	���� �+�QbX�*-�,�C��6[�=5��;Z�ѻ��wѦ`���Vv���I����΄cU���_ml^��JJq��ĘY������������� ���K��q� �R��չm���f��:��OhjGI�
�����9����;�cl��)�LU�T���
6y��t�jh�мu�}_r�>�^ּ�����)'���_��6g����m"�r*� �m����;�[���cPT�����w�Y�b�.����n��)7��BV�Z����5���dok��ƅo�h��=_�9����� ���r�y@Y���4<]��su��jɲ�r�;(Ir%�na!uf�0�����iQ"��ww����
1��eX�"�3Hs���S�IS=�#�rl�t�L��]bfC��Nm��t�%�Y����,U�YJ�9R�Hxf��aތ���.%���TG��=UNMx�a/����nM��"K�&����\9D�ߝ(d����ťV�1����,�nҀt&-Z���!�f�0��n`j S�ղ[E�>_-U�ϫ��.�9
�c��:�Ox���s����ف����w��a8d����2V�����G�1�VӔ���N��Hm�����Opf u4`#��d����={+���vƂG3�4^5�  �ǻ��0Y&��0��#����/V���H�	��r4�b��6�	��g��C��I���y'���n��ސ"�o�F`�e�;����Q3�yW!o�m5
V��u~�n���X8WYBVR�p1O$��t���2}��1
�e�Y��i/�t駱y�*��ݗ�>�T�GT�$$���-��:U���Sg, ŉ>�썒��g�ǊH��^ܦ��v+S&�jX���X�1��O��N�M�j$}A�'+aF��O����3t-�zi�7�jP�A(�ryq�I������P�2
��u���{�����H�3F,E�Nx� {p�)�yY#k��[�����58D��L��[F�,T��������zI�#AeZ�*��y��I��- u�z1�E�A����{1ϣ�=�r%��J�E$((y,Kӗ_��h�G"�@�l���U�q��!���w���^��z�m),���R������8�r&s~t�LS
X�p��G���h�K�4$�d�<�)a&�%��sڔZ\zF��T�)lk��#sm����"�+���F����S)9#����A�´1����HJ�S �s�8x�l���"L�ʍ�h��	hD�l�r�-S�"n���	'8"�fuz�J�Gh��W�����)����+ﳨ(r4V)����a�G���T���/���{����Yh�fŰ�K[h�`qMz���	3�H�*6��RO+�=��d �z4K�;�_�~�¨zr��231p���o�Y�d��2��%z!-u{�g���,�>c0����0IL+������;Ԭ
��%0Uq(��!�f�S�Ei>��7[�9���1�G�g�����K�X�<��Iu�M6\!�1N�1�r�]�َ-Y�'ӺKD�of>O�8�wLiy��Uj��|x��|� ���9�g���6�;�'�rE �䢣�����~�H}���~����x�ospU�T'�躍����'���(&��pʗm)1B��S�|lS�@�YLa���Z㸔���F8���IA�F�M���
�+�����H�9�d�G��Ԯx���%.fT�}Su���g� �޽�OG^���2��U�O�"�d����ի)�p�V���~@!_J�JK�E��#|wq^�������7a�3dTА�M���<0���8[@ Ji^!xR�(qhNj��R�໼E̐e��ʑ���2ܨ�p͉��b�i"&E\���sz���8}361Ik��T[��N�
C/��A�."-��m����VX͊�Ħ����K0�^����/3�����|��p4��><�Յ{S���F�ҴHŰ��ƀ��e����4��cɑ3�_��<$ܚEwu�}PC�	�5���������1-��Ԫ1)��/9�h���z"bDz�5Br�p��*M����sfޤ�r)023�6)N�Jl���v	�ؙ����UvjL{!��L=���^�0Q�@B�h��0��v1T� ����v��-��I��N��8�3��Oԗ2��:F=8Da~&�<ﺭ�x���醋�q�Y�릳�t�+mO�*�#d�G83!4��YM"K�A�6�$��m����&W�� 0���:�F,����~Bϴ=}[1�������]R��xiw?�s���[�b�8�9��A�ߐ��=/�_����;��Fi.1�j?_�H���ub���ۉ��ڪf�B���c
�°�)a�JRۇ�{dȒ�dL�RՉVX����7��w|)��@w�uA:ޅ-���e������P�7��a��1ق��O�;W�o)����#N#���[xD� ۱BQ葤)���kf�����z�Ke���TnW
2Vt��'�紆��<�%�#V1OcV7��Dڮ�.�:����z�2���eA���%O����v10AL�ֲ޶�|{�V�|���)r^ŵ_�.��Q��Z	���f��E	rx�Z�d�A��w�GR�w7���8���0EM�=�����
�Tq�D�#�UwD��΀��&�V�����It�{[s7�@�9R��@�k����)ϖUZ\�)b����8>/��K�]~�����3L6�`����p"#q��F�K��Gb� ��i箐s�����e�
��z�~�֕2(�L4��v�Ք�Y�{YЀL�#��{!x7��+�	�s`k�34���ߠ� �}V�i�*��BE���`�z�B&�A �\E��<�c>�m�>��;�osy>_N��O`}���l�Y���������K���
��9j�����ɕe�E������h��&2�����c�֫����%aD��#�鞍A~�E�L�xƴ
7�4�R��a��+I��&��V;Û��SL1�&3Z
=8�.��{�<�Bk�g��R�x"�h��ɬ��ޫN(N���<^��D���K���(w b�z�:f����z�B�P.�/7�QN���=0L5��Sd�M��fS-m_ێ{.3d�R���~�E�&�m�k��7#�[*=gs��R�ff�C���䫊�V��>���w�F�D[;n!>@foB�'dN�=�_j +lyº��:� �*�BD�Žf�Bl-�>�̎꟫`�K�0�S��]�6y�����)3g�)^��/��R�:Q��3D�j����۔x��M�n��)�)��	�R.���k���,�`��3��W�W�Μ���ݹ��<����4,?����tP�a�I޵[7v� ��HXX���֮�u�|��],�fQ1p�{}?�rI�_O�q����� B�J�֠��U�6_�^��l���初ǃ��9�5U���P'ك'\�u�phs^�_
������l�|���ٞ��7�QX�Ij9�D�ՔBy�hA��p4���P�Eg��w�Wh��25�DK�EIH�ceʷ�u�(u{�
���q���g�ǵ���
��q{�'Ue~iI�D��q>Z��\�v�G���h��6��zަ~L$������ȉыyu��j�/��־��g�]�j[.<���uP�\-���%�#w�����Ćg��W���f��3�QC=�=�`�]v�M�*�Ht�۱YJ7����4�����9�U�a!��j'�U��R2������mS#��-��h̔��.���?M�Br�F+9/pwB�|�����{��`ǎ4B�-��;����e'3�1´u��q�^V�v2����S��
���rU�*&�8Qŉ_/��Ė� #��$|O��UN��Gk�����j W�6��4 X+}^�Y��HX��y�X No�xK�]D����`zl�\2/'�eo�Q�Q��=����"��]���D����on	�}�*oVa8�z�,ߜ�J��p��'�����6u.�ޏ`�,�A�^��-K�yá�Z�kL��J0R�ʐ}��ѥ]�d	-�H`�ǩ���kCn�Q�	��$1��]�����_fl,Θ-�2�	tC�w6�&.7�N:�!�G����O��p�cD�FZ�+a�qb�ȓY����&[�����{���J���).��j~�o���t����cU������ M����tV�z��{^�����s��*�$�Y��BW7p�ݬ�9�6��3w#MwdёI}��*��@�{�� �(T����Zj�K�aa�yA%G�S�/.��-+��@���q��;��i_�2�Z+���@6��%�y��+�'&�I�N����$+���ծ�����������a�`��������J��Ft�61ڔ�� g1.����n�߈����j�X��W�=mCg_�n����@H��6�;�%�Ì'��2S����-]����xHF��KECU0� ��/�ټ��u�޼W"���u�+q9�"\��TviP��W���px�sl#L�_Ҳ�A��}7b�<�nKB��PP���������<�G|�Ъ�I���ʡu���{��y2nF�5f̝7���]�N
�H:1vd��*���8���� }�*����������L�*UI	�;j�A�H�I"�%Bl3��C�jD1�z!�.|٨V�8$�|��յ��KUPQ��%:v!��n����c�����u�`Uc�F�(����Oh�˳�y�PSF�Y��N�����t�N]��#b����Цa������C9��<KS'SJ��f��U@1����r�	Ϧ�u=U�)���:����}��5#�fFo	N,S���	���G�N��Gi9ձ��΍�>
f\~4)�5��H��v����	"|���J<�^��?4�F8}V�@�?G~�ȭ߃:+����������@j�D��\�:�1%��� V��*�.L�~c�_���
E���o]���e���Ǣ0�m���i��P�S[,;ƭ]��ݱ7�P��m�:ɫ��n��A�v��ʺ��0zR�K��Y?�2�)���XB�	!*�b��X�@^4�Q=�x��v���2]�q��Vn���X�#��|�7?m�$�Zq^�?u`�
���x�;���l�>�g�=`?Ξn�+��N�Ͱ+�G���h+�����&��>>Ax����+xt`Q�vPv���|h�jU����d�UM��`�k��<l�=h���6b!�s�A�g�� J����x1�;���*8��O.G-�ms�̼�?�B�WvE��j�4U�=
�9o�
��g�1�mV���Г�2��z<2����Omm�X�	�����z0P�4$���݁�*�$	V5uK	6��p�(�D�\.1�&��
"�z����y�Ik��rp�G�Q�[~o��qw3.��V����L�������A�4�,�Z�ګ6�A�M�s�G������h�^�>ÈH+Fp��c��T>�%߰�
i/�?�� �d	���I�KOT}A�G�BY����'L�F�O7k�3B���b��h����E�"��XB��9�T�j��nl����V�[��\	��59-��x~�Z��h�j=�Uq�{���;���̲��Zob{�����օ�NVH�L�u֥Y�F���"��U�(�0 2_8�-�˨e�j��B$��tj�P���$c�z����	'P�!�lJl�1樭fG�}�|e�3g�.3�f����UP�1��sa-z˜4y��A����j������> ����u���h���G����}�:z�9�;�BF -)�D(��b�L���]���IF㭼�<�\/��y�ڈ2��ސ,�W���L�b�\gq�!��;�c
�����?��w�Rf�$ਲjC��o�Dӹ.+QA"m���ͻ��(M#!y�Ʈ�x���ؐ�2��xOk���2|N�,/)�.��n��ﳢ��\��5d���MSyM�����T%�b�U*�P�>Ln�h�;i�!(	x��U�c$&�77q{��hW	FfVv�􏰙��22nV�F7����B���z4����ZN� ��"�`�H�C��ӗ�Am�l�h�<R閸�|�z�Fy��H�=&�]2�%߀A[�of<�;j������Uk�kA�Z� �����ŋn�j���o��6��5���В��m$!��-���o���v��}��z^ ��\�սXT��Օtls��j�Pb�656�t���� E	���9H<!�z��i�2/&���-ڡ��U��z$��<��	�">re8����
�����R�� N;�U�oL�k��{�fm5S4��'��]�O4/��]H���=��؂iг�y�r���CB���z�4����r{�M5ݽfS<�VV��,��0�2U�e�,�@��@��l��G4i