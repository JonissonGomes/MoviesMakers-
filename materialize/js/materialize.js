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

      // Fade out ripple after deÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ®TÉÔIhIBLy²»¯ZeÜi.KŞÑWLts2Âr;SBeSÏğ"`b¯fd}ü MöÒm&	Î«L'¹o0  ˜$
•À‡şÙ9S·­dl×r[¹­pÜÕºt¥e‘o{»Ú ]ĞîÜ=Ï6kSÔØÁlWs,[.g+ƒçÆ]É—²=ßº$ÙbÜÑ1!ğnÿwŒ{±„Uò…——©SÊa6†À®­D&·Z#†:½<[ùÈ–ı/³%0Îhı¥7!•<÷/ŠF¾/³P‡ŸØØXO´>T‘ÖäåZeqİ
WHJ¼ø¥RáòŸ¶Ë¨†Üìh¯pZî‰×p¢ôí•L7a°ÚìÉ®¤ÈX?(úûıÔg5LÔ	0éÅÌÕeˆ¨€ÀÏáÆB_Ôí‰QbDÂ¼çÍĞÇÈO=ª™±Ğ¥†¹¦RŞ¨àV*/ƒ½X°šÀõ£§ÚZØ:BHò&£¢˜öÜõWÊÀsHùëQ#Øq±±P½Úz¥áöÒeáÈÿDa>³UVRğ=i±ë zhÔãTMÖ‡	ièy¹5ñ¦¤¤´ıë¨ğ,7Ãˆ‰½ĞF–;H)@°Ç&¡H[wJÔ²¨‚÷JË»fU÷}È¡@ŠU*c¾–•®SVô~ëXÚïEæÆRJ.”¡İcÁÕ^¦Zé¥à¸Ê9z<£rûr@¶ÑšÔù·©¼¢ŞäèÕÚXå`àm¾?n)r,.¿ÕfLú.*­œ¸xÒ_½{dõ1§¥`N/Å½H¾%§CùŞ+‹«±2W¯²v=å[DU=®‚ğæN;N“|óy9°ÊBÁk©E¤+£Ùú§™Ÿí³:&O._½÷ôÈŠş$«ÿÃoˆçFFPŒş£Õ“ŠØIö«©,Í¹¿ú±˜•©X'øÕÕˆzÇ:şN­Á*¦(Çäd&æ¾-öÌxĞQ“¶5aßÍy9j$Ì©q­lH¯ PµJ©Ò—j5â,?®ïŒÂq;Ë¸É_*(TcÒØÆ\<E?‚Ç~Ç®Î³^ù-­š>pzqCÅ$Ü®ÊÛ¶ÛÌÖ©<g ÍbçĞá~ú'+RêÌ&ĞÔ<MDà!¦P^ı[·Üy•±ÖDnV˜¯ßÒ(<îUEˆGÏ•±›˜"}l°÷ÜÌ÷ıµ;TØ-AÄ®ç÷“£@—I©§ëwG†kz!Ã^ÁÉS-<¿ÀoZ|[8³“T d¥àMofRZ«ıè¨?DLiCRªiĞşÇ‚ª
7:ça]%‚µví®í¼@}‚¢l}|²W¹}Š$]NA,Ñ°İşÓ8F4966ªãF®|L>Ñû1^iq$Âü„Jc¼UÅ¾{úìÓšš:ÊƒOVf°”²µè+ X)­UN7øt7ÜÈ Å½•4i/Ú÷?vpÖ¢è{&” «mSj•rifDèö¾ËŸ¬¿x#éÂTòbü©í]÷*ŸÔ¢PB‡ı²((mäKA§#i¬¼ÁŞõ¦¸†ë 1e5”éå óö[ª¯‹§0<’.ØÈU¼dÎÇìÂ#N‹ğ€öSdtğËÇì,7élS7ú•˜S•Áë¹Ê™É(n˜LG	Á¬øÉõªÙĞUâ½lí…lßO¶! uÉ«HKGüè©Äd^vö·×‚á¼¤<w²«vvÆ©GLú„b¶0iöîh«"ùØü~ÙİAú£îÛ·îÎïâÜĞ¿NĞ ğ`xQ‚[ú>F]Ú†ö^“âä†Ã‡ 9–Ìï~ X[É}Qà‡³ªªGTG!Å•0¿Pë|Úªš(ˆùëWW\Á0|uÁ4EIxâıø*N›Ù£íëıWòA2,Ñ£}
­òU<[¢sb]J”¼¶-9NâòÜªù—äĞ’2O ]ß.ì¯!<-¤3`[gdÖëSšG8KİÿüªxWùÃ»D®¡²±¨:úVIÁÄ…c½Eê3ş£7“¯gGe¦»ñY}»šÙtÅºÂå4Vµi¡vHêpÒÁx“võĞ¸ß™é:\=‡4›b»±Œ1Š<!í‰üyya´,K&œ rÛ_àiZÍ—½ÛŞòñz1¨wc„Š—cÔy
PŠDÈ NıˆÖv
?c:óâ™ƒÕÆ4ı´ùXš—á\Ç˜Nö'?Ñ/¥»$…B ¯–¾bQ$¯á³9½~Y¤†Ñ™Òi«šÃ«y²û`÷Ñ|s}]Yåö	8WM‘Ú]…Ôú‹>.´b$6>à*kbÍ‚j”äÕ[n-D\dq)BáQô'
ŞCÃÿ ™@¯Ùb ­?,’õŠo;ó4ùQ<Fiâí}d)ì7$^+ûÿ—¶‹5ºÂ?¯XB>¹{Ç–ìs1ğ/ïc6Å÷Ö¨»»äø»ZÛö !öz’7çKø¼óC7ÿúNS¬R;8Ğwõ®+äi˜ÒÊ~šÏ‹A=Y?#‚Ó Nt¯Îì‡òha æBİÄ\OŸËE‡¤ôr§ÂÄÊ‘a¯÷q'ºoÀš1GH½bÓ„šÛò‡Øn©ã^ó´ñk5d;$v²øÆkjèW×Ê!3;$wïı2” ?™M+şâŞ–s&I|™ İ-•P€×ÑnLs10w´»â×K:³Ô€İ~85Äˆ	[Ñ„Ÿß™ÎªÏ/5£½+jvğóäg"’»:RÀ)’TäH	‘XK)ù›G\ßnâMX1={€{M›~/ØÇWÆõò÷"á¹Ïsvó!¥#…²íC„ÅìTGNÉ¯Q%šú¼ÚÊÜe‘TëAÇÌê*sÈaçª-‡˜UW¤RÅz˜4”|K""Æƒ?ˆ˜LG)™¼
Bd½Ó°‚4­,XÒjŞ7Ì‡YlËÉã+ÒETV„å>Â$ïÜ²à¢üSÅµ>{Ğúã“š.˜eKşÈhèÅ¤dÜ=<İÕ¼ŠÂè¬EÔÀïØpğØH†ÊÎ®K1ƒd@$A9_u¨Uµ+Ù¢úÉ‘á&{|½±*Ôt°î*É…0´ùŸcˆN›*ÀÖê9£+@£êœÙ¥.§ÏmröLQ"ŠñÆ€I,YÔÓn?ƒd½³ãBC%aZ¶Ôf£›xÆØ$bBèZQ?9ÍEM¡ğ–Ä
Œ¶H„¶[nö}~ˆ¤)©Ş”M´Ç;Şf:!-Ôîøø©£{xXÉ7y0¿¶…ä´©4«C›û:£Ö5˜˜[¦ÿ\3c‘-k¹NÊÑ²µ‹Ë£’@°fB¾6ÒbGÆ «š'Ÿ Ç‘ÏÔmtK10™Uå×Øˆˆ_½¾3îænn‚ÃåKô”¼•UÇû9PkD4ê^Ä@@Oº0‰Mâ{âJ÷“Ÿ*kÁ„>şã#!p-ŒŒc-Ñ¡­,²ÉºaëêÀ©C1Yuh»ÉË·KBuÇ
™±F¢L	ÖèÃ .ÎyH‘×ß ø;d´¢¤„«àæĞeÙÍ’ú”QÑ¡™2·j&|ê ®ö»QãI(İötŞ›ØÎ¬ºøË/|¨OpÔ‘2Î2Ò¾#\¦ñ8ÿçâTS”ñ'¯³00ˆÿ’´ŠPjò|ŠBø@âÚbZ=œ	ğÌß³¹¢ÈšÏŞ@òNLJhBôßÏ¿¸‰3Ş¶•£vp#Ë“Œ|tòÚŸG¸â ®*³ r’+ÅâZ«írêêéÊ•ªNó9Nq,ïl&ŸRÌ j>íß{”¶XDH‚1T9«Œ&ŸÈÖ¡ñ7«:|„0A¾,û´x?j)­|ñ”ıaSÊ7!3¸;È‘Ğ…:ô¸TSÅ%§›óÆ,ŸÊQâZSDç°¨Ô¡£&'5ÊH´~¨(<EZ¢õé·uhrëú·cá‡>n”%¨œ¨Ê¸úbˆ„¬–!”í­¹<¥¦‡Æhœ\1ùŠÁ1â—¼Ì‚ÿ
mRnÓìÄ·€xçcÙu¦Ø²éÜ}ŞóÉÈ@ =©¹6%ëWîÅ1f'š™ìÅÄàt‹1*óé½ÚŞ)kş~„a÷;åÙƒö•—È¼B¦›íZÉğÎœEv»p”eëˆ	’¢
N;Dˆñ³ÚÒµNN#ş	Ş.½›/é7 oŸpœ¾õ>#ğ—€ÖtS}ZÏ·Õ>ä<¿à=á—+ß:&¿h”¿ ÃĞ]ò-j¾³¢!ñOÛœZ•bîZ	3eA†OÃû¦şÈ¡Q“¤²ÒyjÈƒ;x¬PUë|æ$G&ÖÍûéj­-{%†98µôè¤cáA¦,…xy¾%D!Æ,I¾füì\Ÿj;×L¶@¼¬è0®¬…–”@L£Øİ>/.¸ÂùPƒíñÔˆäÉgÒ„,Hã_jİù®¿dó3ğØs\4“U‚ÀĞ9ú Ä2ãÍÈŠ“&$2Á‘ª¯‘W˜é5£>çëÊõ•%|B•˜æJ~üŞ}DëìĞ{g÷á½£‹h±g|î;+úÁ‡ješ|<¬lX­>F‘dsDÛëBR•áT¯™«V‡¿¹Êx*’ÎÚ·ôy6;Ãó½(Ş’¬/¿Ïf(….élÌÕ0Í4’
>?÷éa°ÙW()e?/m[ò´1¾uxÜ½MÏ‚Ğò0kû˜gĞbXün¨0VyYE2dEc>\*ùÀ8E¯©d(2¢$ñÑ"šDˆÉD ÖPòŞÏÕ„»s}¿T	 iv
n]æ	ÏÃ* /“ËL·‹rBšMItº´³SJàÛU9µâ#.x‘Èİyß#Ë6=®/ß“*ï^«FŒ€«Ø»? l§™7Â
@0û ç¶è w¤î£HS€Ù&‘÷½B•¦9‰ı£r3k«Ç:óßÎŠƒ5ı?ZkÿÀşÀ­*Ç4nıø!ÕÿyâùVî0ê¸ò¹ÚÒYÑ;ÙòHKL6ü Ûˆ¥›Ok!Ôó¶~ÉCDBbù“í` ÿ0ÈìW÷„¡ÕnL>>DPª”è,IF7aÙ†)Ù·0_?G£ÊÉŠßÀµã¦Ô×UCEeßËÂôgÕk²\óé—Ì—¾0›=êM¥ƒÿ¯~}ö&!ê~8Lš(|I6Mœ>ƒ$ÿÀÿò_ÿB´"‚vñ®H«…ß—T$–“NŠ÷†/¿èy&-¼tNäçÍQZ8g¥¶pÔ¶SÌ³fÊz™-ø(“O¡Ğ'È¥ú£êÀ“ù­èz‚Õ|#¨:UZ­@¹Qfì÷è95?7L•¦¤¶¶VÅ=3*×ıÄhÄšÁI'Ù›CSÜîĞå…Åœ›AŠ…šZóÄ•?Š/Fàó¯%şô†¸O,¹úòÿWµöñÿX:¾R°/†— nÿ•qğò=õÒã†T›0w´}VÀİñp´ëD‰¬hMŒ²áşĞ^üàaşb–€õxÊ^V-k7!&Ë[Y¯-è@6Å„ı¢§õß¤åËéÏ:„İæy6€-TøÙğÇ2{QX›-f)eºz¿6!rÛ*­E¡!Åyç{İi;²”\âGğ•M-'jæ-İ4[Ójg´„4²krVƒh(ÇŸ+f@ İ^Ó—bÙ`şØ¡¡¬–DAÈq•ÂÖH~ù…5TİrúÖŸõ\ÕÄ’Ä2$ÌH«9%¤ÚÔë|%¸È¿Ÿ›tÂæ	¥©ì¯µšÆàÖú•;„Àæá—Z‹çf)Ò–éi$ã?=`ë0Cù:*u¯Lz5•Â7VÏr[‚%|dF=¦òè¯Œp›X\ÍZş«œêŞ1s­i„q²Ü÷ÿ¥È=¶ëD8k¡ÖÆ4Œë‘”Êˆ~[­1»¹åUZ
ba¡6ÙÛÈŒ‰ÂoŸM²}ŸüVÃV+³M¯ã¾šŸ_aâôVÏ[‹!gÁk†%âtØël9Í¿ôzs‹ş?[´Òx8ÉØ8»GÃù]¾]}êi(7m™ˆÏ%ŒÁqwr‡é%<vöyÕò£Öä"úö\fÎßgZh&‚SÂ˜@9Ÿm%Új:o2»(ì©ÒœîS,°IÙtpO„êôF­úŠ÷s(h®gß[ëuÙ¬7¼“©È/}şÏd©Ğ~àÇbışb‰6·‡éÌ/¯Ö¾¾Şô¡ÅØëƒÉĞĞSİãuÜîxYÖÂHE¡ˆÎöÒuì/Fó¢£Ÿf]¿†nO–ğUM7¨¹cÅîÌù
>¡½MÒìXMZ?bÛW#=¯ß D-¸‡j¦P7%Ç L1A&&iÚW~ T™W$:›è¼áÃNŞói|ÙÙZ¥Í³OoŞ
ÔGÎF²…†¾dP)t¼PœgÙÍ·ƒÓ
ĞÃsÁÇqÌ-…kOÊëñĞ\!Òw3€Ì÷å5U²^€¥b*Hú¥{üOÆäÿĞJ'FEÎƒÛ>"z!ŞC#X[³!¹!¯ä‰@üÂ&Ğ¦’¢%ˆapÙ6İĞ»Ä,+‰2G±.:ÿo[ñ7‡ä·_dJ]¸ù¼mf‚@Jü â†ojØSWJº)Œ´jû*²lnô¥:O·2Ù$1ÓÕ¿²;¦…l¦j\´­Rú-3/z›6ë6ì‘«è…±u§Ù¼n|™"s2¹Zæ~Ü÷Ö,{¥Æ´–GÇM{á™]ÿT~ººÛ4‰òiÏ…ÚdXoÂ›ŞIüv\.—òk0QåŞõxZÜn%‘‰3EƒT¿gú§¤OIDÙ¦~X–L‘|†:1†ÃìÕŒÏÛ'›°ÓAøZ$z°X«Ñs$B¤PmŸŒ|Fp»,¸)—M‹WÖ°*µÇ+´^…‘#z>6ñìr6¢G)zşÂöq_Nuºk³ó8ÓÎë×§” ¦³ÛÌovBQ¯ÊÏ1ÓBnåµĞæ·Fmyt†®{ Îkƒ˜CKT“e}8A—8×?R]fäy*‘µ.LpeÊ§™ëQße§Ï©^>µ[r¾ä~ã¯læFÇ*a‚~ƒ†Erg«éUl¼SŠÂò(æŒ~1µz—Çsê0Ç"çñ·G#Dö4øİ
×½”|¶bVê
g9Š‚ô«2¥©‹5Ò²]ÜéŒ»•‰œòG©dV4²f×3'–lßgÒ%5 ÷Í{ÅÊTE6»©ÍåPó4NZíÉt¹l3håk—(‰Ÿ[C¿§³®I +äZÒòU)¡…Ğ‡²árõl€aÒáóÖ^ö:ÚxšÃ<˜"ˆEÃ’õÅ+N5´äÂ‘#
UGJB‘œİÅ²3îò8½üo<¾Ó|rBÚ{®qí¾S8Îè†÷eƒQH|¶h!p\:7>]bû“EŞ¶Z-ÛâÆ~¢ò}º)~8H´<ÒÂœY–ë$hLI3ÒİHs_FŸmA›UGÉ¤"œœ¾­ê>.!0ßt¬ÍIĞÊøÂù¿ò”…T&	¨a1z&N®çSnuÎëåy@EŞÜòtOºõ1Bbf}<©ÏòI9o‡D‰íÍ¤úàŒåM˜ùóUáÒ 19ˆ7y-Ù :Aú×/»rÙÅKûİáí¼İKBä
ıx±B·ãÆE?iúùz÷zìkšßö¹x/«+|Öê™9nŒ{Î¤ópƒC¨ì…^6ÓÏÛtÎªœ˜ŠĞáô:‰eÌÎ¹Ò À¤dì\â’OKğ 6?-/"üE½(‘v;S§”ğiîän ¯|íö>»Ğ1s±°eMŒ!-¨´kRÄîX1¼}×ÃyğjöÙµCÈr@“¨ö™Åyx>`³W /Õst#6Ëúä¾ÌD',—ÌZ$ÌÚuÙ­*?[B}ÅJßp5tÖ)<úÛ\×YL¢‘¾ˆQ“ŸK¬áà„Áç	Ş¯Ïºïy/U=ŠçµOï:ïF¿Nš+kYr`~¡µW^(şb–Ş, ?/…a«\©•‘€ÀµYì;5CökUZ°»d‡¸%¯ëî»kì°C6j¼@‹›öAã6›Ú!Æ/iHjU–ÓTeù9÷†ı];#nxA÷•%U…n_ÌM§İš"Hj•Ä7qÃÛøOoâé.­ŞA¡ø}î/:•Ï=J.cnášëJ÷,gËÖ¸7oPİ­Ä/Å£Õ*ÈA*ã7S±E:ê¸/ut*±,ğ.şfë÷[Òp³ßUR Ir'«íÈ°=”¯»‹T¦JG3 ­å2LOƒáKM³Ò3»°hâÅ)ª>ùË«ƒ²ƒµğµğtò•“è\à«‰qğJr,ÎbE£o!JESÄ£}{ó‰şUåFšKt!bNsêÂÊë)Ÿ7œçüÄ8Æ“JE'!¾5¼Ù  4œåüZ‘áE©€Ÿ«-p•Ôfgé&2p¹H˜Ø.Ö2ÁïõeD‹rÍÈ†ëUµ1Ì/İ9°N<]„KN{à†çRIªÃˆ#tºÆ*ª3Î‘~åL{aÃŒd‚zyuè`r1uhk9;Úîub£’º­;ºøH1!zœãİ·j¨.º˜`7ØêĞK(,$a€*tñåå]³ ¡ >Õ#¢<ÀBTcĞ8L]…•#³¯å‰K÷…-š)8y·¶	ğ‰Ò¯M”ş*d¼×‡<9
È¤ß„1—¦VÄ{QjéSÿJ{
 ¶ÅSúœÖÆ–Àdm÷;W˜Vå_¸äIFÒªŒŠ>,ş.IMN¡íb½Ñ÷"†Ës¢ÖİKØfÊ’Y&”$íÀ	êÏMœ*zx³hDúÃò]¹"–üÓêğ5İ“‘.´Ì>f{®²·möë új}ÑÙ(²—ĞåÄÏ—×1Öô“iø!­<*bÓ’|/òBePip½ÜÇ’§Fàòº8}z]‡“ö=?’i*ËÜ‘°C7ÚKE[ä0ƒ„‚ã¿4„Æ\{U>¬ïû&^,ı¶İŞkÒmÉv‘<Ò¸ì;‚´à{d¾Ím>Uİ‰r0?¸ã07}>ÂA=qDü¼óÅdôÔ&XœPbL¤ğ`§€yqh{²¸*Å<xÑÚu7geI”±¤X`œÖé‘x`§ÉÈBŠFß©¸y˜úì5(ïÖÉ`®¯¦Ë)_Ú9ˆ¬¡ß £°QW†ˆC…Q`)LAl©ÚÀ ü®éêJê ìƒ0yÀ%Üjµ{²öé¯œyRÀì–è×ûfµvMˆã\pç×‹e.CNiæ;ë‰:É–0'ı\ÌNå½c!úMpÚb½ÛÎËµ´
S,Msúˆ…{ŠR[à¥¬+j×ÍËˆœÆ ·
Çk„p†3ë
ÈL‹éHƒ/§ç_ÍFkTXâ/ê±Ÿfõä‘c± ÒA”bÄ$‰eón6_9ıD)5Æ›ŞLn>çÎ~ŒKŸs…\»µbŸkô„(m"TJHì…ÓÚç­6˜¹í?İÀıÅ4{gäÇïÈâ½ˆ¯ñö§R€€ô<,¤	’ ¶Ú0zÙ¤$ŒD&Õ~™‘/™ú'gÎƒÈ’Bx†$ë|e×0|ºØp(VXÔH´£d?N³™ğ0ŸîA+ø«¢ô4yˆ\Q"[§Ûßƒ÷ñ!=Ræ×ZB|ky½-•‘Ÿaë©™ybÏÏ©aû[‚6‹şÆo
eúu)úeÖğr§y³­ÿ[³r[(¯ó÷¶CøÊ«Cm‡ş¸‰S†¥a#Iï(	@X:˜ë»Q(’ì\ğq¡rªµ[Dl*ŠÛÍ@İGêAuiJå* =¤(b>$§Ê@uÂ+Ä¶y)8?F5Ë8ªÕÖ¡9RúAªì‘ÅÛQhå£-•+ıÂe/Z$ÈSb&ãk¾şm¨^ÍÚÖıb¬c·ßƒÆ&µaQT9£f£pÍ¾&Uöÿ•eh¿ı×q:™Ê_úŒ™ù‰ ¥ûbÏLc ë½1œŸõÕk}»¸ñpØ3¸İLb]¦[±ÛßË¬Gˆ¡±aÇ5zgêº+–I–l³÷<K—eÛº{ENí|÷Üu]ÌìdÆá´îÏ1_¨€‰š94b[öËöz(ï£ÿh•0ü´â$¯6] ˜4OİQ3¬\µÉ
œçofåQué®8·ŒŸ]ü–vzQ·àÓ™ÊÒô7çı0æ{ŠıQÙ‚×ËßÙJ2õ+dÚEu÷pÉ%rsH~\dæìp9Ñ×Z®¼úÛ™ëuwñ3Ïà×äÔÑ‚£lv„·Ëøµ gÊ„v¸„àÊ!FÇ†	•¯®3hğU^3/9E£¤˜"ì±¥AœpD¼‹i’ê]`:9±3îi)àÈÉìØ®DŞrÈA‚9:·H}¸¬±ı&ÅPöD¹­Êì3÷³ô–‘¹óWqŠ¿ Ô ŸP6MC³ö“*Ÿ3  “Øè%S¤Óª9^aeÉ’ÃúA´Òka2µqa„‰WÄóç[Ğ¹¼‡¾	kcrJé·Õ9õ¤Ñp˜ÙÈºö’6B¢³š^¼ºE<C’ø2¶3D]Lolš¿0½´›x|p½Òì&g­jĞÃŸÚóP"»À;Aİƒ¤W2oİVõX|ySJBîš#Y~€$¸Xaz *‰Ÿò3E•Ö%bŸu¾G‰¥-íEzäƒ¦0°Õ+I¦jœn„%âmŞéœ É ÁFó÷E@ÑUqX´à>áWoxëS„óÚß™›à=àxìô:‰äğ×f|İÙ ã|\íÆÎu†o;ãbt	}„ÎİªjèêQÌ4W7sÓû·	”BJµÁ½Cœö{Kà¢C-yğ7 Yg–^üûÕÆ¶ŞVdú¹»Š¶z†j»›Ì±Oq¢AÃQc§-ª±O‚×Bl¦sp <˜‰Á9˜âöZä
ä)ô9F+7mı¤Ÿ£tr@³«lOC§ÑÕï;MÛÓôúÖ:Ì6¡Ø)ít‘)e½háMDNçÑ¦&Úß’}}OD8çNŠQÖ.´V@»{¾0³·òİOHû÷:c>G¨Äu¬é6s!ÂŠ`—šz\4M¾„MO2M_ÙõõLaÃsÑ“mf&[yğ}**^F«68'$ÌjÄ»qçš6¯H ¾¡-¼ÅÌügöóæEÛ\ŠÁYÓ¡BxL›b-Õ"§Lk.xIµ:v9äõ½Òş;t+ñ?¶6é¬‚ü@÷p‰|İ>ñ6>(~ª+)œ]E¤$(¤{vF—5®(ì:–šÚ¹‚ÍçÛõá‚SU¨ÌT÷jÅlßÌ¬>=£âÓRt=X(DMîG{kíø¿õ=Ü&â•½g«²`"œ_“`ÃéW“”ÙD¸yLÆ%if‚j2/ì@snnL‚.7ß'Ù±'W«¾‡Ÿ“8ŠXlfÿ¯¶aâW«Ó|Ì¨Z˜x"”GÍÚë'òÇ ºtìM$7i=M#÷ûLo^Ãñµñ&™”Z%[ÚåŠö±H;‰¬gúGjåT?’
Š¡?íÇv¼Õ¬¿ıQ¶‹Ÿì¡+³$ÜÎ“·Õjd?B>O$ÈM/Ù¦QÙUáK©#f‘0inK·©{&\§ÎDßÓ¿­²à½LÏ¤Ì}ÄV ³9‘n²¼gÅ.Õadvƒº²F‘i…Š0À=£¥ ³Ï# nT·â/ÍòåZ8+Ê ÑgZ—Œ}klpåx*Y V‘C"ƒıfPâµXg‘îLùèìA3,ı|1m¨M/
ñ¿I‰Ú
©B#úßêsxCË™Èû‚ü¶O»‚<ŞV·\N½;&z©‚zGµÏ¾•¶9 ZØ'Áÿ[ŸpAï*D<*¬#5§i‹E±'³:âÂ
H˜ÍFÓ­2}È¾k1O«"&xSµ8oDÆ#îš€”/ûX´è€·Ë†h\ÅhşXÄ¤DûŠgŞî„+Ë]îÌğª¡ÈG
¿éåïÜ×t{Æó9Å5v:‡gÂ$UNÂˆ÷¤¾ü×9ß°R|¿·xHš:Ì%Í›"‰š-1…äĞ¼æ$òŒ[.Ïø&!ÖğùbyXd°,çÿ3go˜½BÛo
 ±ˆå—0¶­C'ß€Eª~N\Å6½_Wv¡Š²åÿŞ„ÙsîŸ<–s‡°£ƒD–†ØoQJ4µÕx¿ønìdÑäT1Wåu¡¦9!cVNNÓvA${õò»í¼HGõ.©•*ó/ô~£ÂÎÔHEÍv¤Y`kièlb€âÀæÈì·es¼V{Dï2z]&[¶ŠJ‰äÆîb¡áğ²µËÈ8$[ÂºDqìË¡-§Vüul|^Óa¬ûÔI/#ƒª0?r"RÊI,Ñ3Ê'ßÀK2P¹¬Br;·L“ÉN¹¥5S6ü~ó§Â°pô·­MÅ»Øhƒ1ï^?Î‰Ñríb~)wFª)‘føYãDê÷(5ıh-HÃ‹èÉÏˆÚZ|à.36|m€¾œĞÇãÍÓ|®ò™i¨ï>uë,5=î¥y¾ZŸ¯u{–ÿuÛ	X²–ç6„¾Á¥õÙŒz;¥ò t	†!İ¡Íãˆ-ü]PVlMÃÈ¥˜ ítÌ‘#K#“-Á¸y[©RàĞØ}ş¡ÿF"&¯Ôi6fiË‰ê1‹ø#múâf ¦”7¸!feà”ÜâŒOíª9Ğ#‹ÜÃÁM¾òßñÃâxáåİİ6>É 8Ed@H¯bjœ»Ä¾âw.eVB2Ï¨B#ÊâÆµeh"|6OVfÙæd\™¡[+ÀE…Bõ§,8êŸg™éÌ¹5BâÊCJ(ƒÉ?ûÉgX¬éA§mï¼ôÂk·…÷½FƒKc¯^ÑWĞ,ví!j…S¦Ó38viÑ8N@,/ÛjëÔ<ÎÔâzû™}Ê§½[F1%}~ø×«¨$vcî4 ·áó©‹Z&Ñ„8ëMg‚!³—R³Šı	5ğIš:—ÀÃtlBo[ÜÔò@ÀÊ³Pênú‰:º„¡4£Ÿ7ìÑíEşO¾Ñ\K¤®Œoâ¹¶ÍÈÁ_Šd"†ŞÚC4ç~Õt—•ÅÉš–õä¥aãŠi½æ­{#¦?ÏU†/]	š.3<TS¤$¡”(/Û¦òm–kf%lQ$sÛŠ4Æ$‹U`¼Æş…„éÿ™úÄšMwØ’¶pBÖ	€*L<jUñûÓ(²´=‡Í£_^:(öi»nû)cØIß<cªÎİ¡>_ŞW=£“pVUø\»æ‘3 ½.éi6ËwÌ¡›6«¢¸ªØgÉş‚•¾v´YÓ‰Õ/¼¸b$©³QWØ}ÚÖÓ«Î*|˜tğ‹Èü€}!•×Ó+B¹üoœ•ˆkˆX~&N’ÒHP¶08Èç«ÔøajÁ—JNÚÄ «Šbw_rbLhºZ
Q©ma²“I™ êB­VÅ´—ƒMF‚Ä;B8êl?ŸXq•Çü‘çœÆ²IÔŞñXgıY9‰Ów®Ô‘’2Wÿ’ğ=ãcxç]™şC$‹\UTä»Q’E3ãwÖP:ï‰GE:vBq¼j åxÓ¢_m°P|88tßì»ê¶ªª	¿‡İsÊŒ¤KÃÎšgd.föŒpl÷K¼ÉNğeŒeN8’È­œÔ"Ók= Õš£¼¬À€	“Â¯ÊÓÎŠÄÜàƒ¡Íæô4æåì¼½GÜf#ãÌi†—ø
ÎÙ/Óé0Ò°Éó|ÍbgmrÉ¼I¾Wp:ÜğS6¬7|T[–Üy¦`$œÌÎË½¶:kÊÑqv‡’šo#ËÉ¶Îô]'ËôlàˆQRë*o]°kpŠ^áx”AôP#õ~ôšQTCäI	´•RŸm Nƒî0ğW¸ñÙæ’bs–8t·OÍ
yô¾“é#²Íßğˆ¢qÊv`^k¹pº{ß¿Äø²i5æøv‹åâR”ê/>Zn˜Rº»”A€r¯.L]«½&Œ³Nay£èxßÓ”L¤ébµ;¨…8(Å+ôK^ÃÀÂáuğ¹¤²ğ$×(Ì³’(ĞüR¢éÛ6u;ü‚0Î¥Oú__bFEî±¤Ë0ÜÕIïXMËTRÒ¿MøßL÷½r‹9ÛûˆÓIäçÈˆsæ¨†#xå¹a¡EÅFu~¢¹½¤³Õzt+¬ğG¾'É4‰qšÙ‡ú–VÖ.×Y\İÒGÃ ?Ÿ?Eö½`Wü›,>”¨<zèZùd›ÇLÍg}Î¼£Ú‘E§îµ-qõWuR@Ïiü/Ç‰<w~¿ù…uUH/æˆU<EêêWe·ß¬ƒ,p£†â`ÑüÂˆ^ùÂ`7T¯çÔá:@(öm×vâƒK²‰È-Ú¨gÎ`Mö„Uh8à5åÄ%ÉWÂÃ–r…9ïƒ;y…^\-ÑB!¥¼@.×-í€t¤o‚ìù(¢0ˆô@ı¬´;·ãùyóØ¹¹æ_WD‘ƒáº¢ÇüÍ3x—Çâä!¼gW¯OfJ•s¶7ĞËbE×J¨‰–ËaªàBje±eç>q.·IŒ™»Úé9k&¤\Ş¯üHhNú 	©,h4Û¯£0"¥zjNniÜ“8ôƒ¥„•VqpS§c&gapŠ=,ô—·‚ÂU‰’'¥V·ÃıŞÕl“H¾X…Ñk+1½öÜğ›¾9\7'æ¾ªvÓzƒšÙwgXvÚ§FH3Ú-ŞÎP¼Nz,"ÁØ¡™M„Y}bëã1E€2<Œ3òµ_u›ú–´~ß«q„Ù}?¦ôF/c—˜·w¿å¡?©±»Ídšı£´I+î¥+~h3¦Yàb’¹Ÿå—\©i

°jBú­µ)Nï&ù/ªŠI¤ˆxàŞœ7oÛƒ¥pèUaxè3ë!­Ë÷#-ãüç·TÙÖşnÑDÏ™E©©›Ø„5cKC@-V–n%†<7·§Ø*”{¨é'×]]çÙ'Q© ¼(£š]”p«.äÍo­‡B€´×Æ¼¤‡'V£$¤vÍ]ıï¾.£Ë"˜=im´×s8¢»Õ(|ÑîÀŞWŒx)gï‡üJ’eÄê2D™¿iÖ©_¬M˜s×9öÑ¾=¿¿JÀƒÑ^p~ºÛ±Ì%…TT_Á>QÉªF´ˆüTéÜ?Ú®Õe]kw4Ê¾½E:çú¶6æ}ÛÁ~àovNCÊbÍi²1bfnrå	2Ès*Î¯˜ßl:0÷¨şam™Æ7Ùs µnø$¯ˆŸJV.“ä¬Ò‚æÃ©RÑõV}5%,ç"›`¢äZÊ7:èv=pnFÓ Ô»?ÔaNÇş†\Ÿd>$Ş9¼PÜâ‰˜Uş¥‹BVöN$gÚÑâşë OG9ª€ô÷,ú1cÃe¦1ÑöK¾®”räœXÆ¾‹bê2 ÇvÜ“¾EßuÒîç8_LİØ<Æ1™vnÄ‰.Á«@4"%~¬Ìş¹˜"çCÅìğ` …okÂ3×ú²Mß `—ğ$¹-%ÎYC‚‡<•1a7[l½_q¥ïô·Ê*&µÌ¾ù~Tc+–ááí?ñgÏş#”ä¹—õü— ñ_’~w±$x)?©ŒRLkp¯ï"èÂDG(K¸ÙV˜ÆãËÏò%tçY@ŸGì½¼g‹Æ@,r•7$ğÜï¤4àÂùWsº%Ë”½•›úAIdº=¬Àİ
/="}Ñ/÷Ÿ<-ñdxuZ/Á\ô´£9b [ 8{“ÊÅfT˜D<±™ij×¹ 3ğÊ™ä
ËOEÒ¯#½ RÂW‰ÿbĞ|U²º{§Ü@³£|P‡¯<F‰¾0züd…6jCè°S
)v‰ŒüÙíVX¦WT*|š÷Ã0*ü(k»‡|
•¶¦p®e4m%7|·‡ªN}˜ÍTMéCÈªÁcÑ" æÉMÍZ}ÏÆ×Œ:œ7ã¾óÜ1eşÔ/÷œt<ÃQ²ZÇ,ƒqw¦p8”(>1pŞÜÍù3~-è¼İô†Cq¦€Z
pHÊÄâ­Ó{>_ãz÷M©ç¡ë+q¹Ô£—	…ŠZ›ú¸>íg…Ÿö$å{\â¼í¨ñºpè¡Rq5i
¿O5;‡*tÿÒïõş¿WFÂŒ}¼¦ÍõnO®&ølNÚIÅ¥êÍ*3Œ@› ÔÑÀcÿKÅ³ü¿ØÇx06`ËØ\¢Ss±ûg±(›ÿ˜ı\Yà_ÙÊsGhÿ»Şñÿ­RÚñ¼„"1ë:ğ»Kë¹V8³òæPÙJ4éÚÙñ¯ÜkÉÆ	‹¶ ¯Å‰$a:°á`Á"	1#>_Eâü*š´»šTvøÚ©¤p9¨«è»9œÖ
(‡éiã²gzøÓièØœH{r}ûÍhœÔ yÏí< ˜zÁçŞqşş¬|Z”ÃVU)ÓµL;³¨¡ô"rÊa8ş…ÓÈ5ô‘ñØ´JÄô—U1]*ù‹ş{>4ŸRzĞ·4Åÿ&Ì½ï?ºùæÀvyÑ3kz-¤Û—2¨Ì%‘»hÀŞo”*ñRM`V`YM™fĞO/k$gŸ›ª£©[·t¿°Œú>îE™èv/ƒ=)÷OşXävšQ~Dór=~¡Z`+aS” ­`³«ø2ÊÉŠ 5ƒè4¦ªÔ3upÜz{ˆND<–SXµï¥pRÆC8Ô£Ù@ÌtÌìµŠŒã£?ë­ ÕjÎS‡øòŒcZú)
ôy¤ÂèÏQë3ÔfÖZñÑÏj}»xÛşÌ]g
æ\{‰t(€»¡‚ê¬©àçfº:É°şáôÕŞ)*”†¾^OT¡éaªlù¯”Ü`e¾
¤C)¤™ÿÑ0æ«ÌJ($`š+*j‹h2ï¿õ–OèÍ+)¿(ÚáË©ø©2b+Åí©­'`¿§"¿”ÜÌ4QÑ£ˆ©ê‰)ÓÈëÔÕÿÍÏÂ#2Zÿq>ŒCÑŸXpú<OÂıùõíü­àIÄhÔkş÷ÿ„ÕtMĞıS×ÁVÿKmGLZ¿Á”j¼İÅÍ€&y¯+ûã¿%Ê‹A¿CÓû?ªÃEwi³I«·úğşPXN¾/ô¤şóñV9ôşuÿ^íªLG»Wÿ%š«àèÄòüg'6ˆÿOaHÂæüßuŞù2Á{ÁbÿÎ¿ä7û‡¿¦Mü™m|vSÔÖÿ"Ô›•,½/ª•şYµöãÈàü«ü¶,å1lq±€­Øém˜O»²¿P^ÌÜ~ãVLv¿½;?vìøˆ„¤M¢÷±3ş±˜\ğ2sãŸ¨Ù =úM¿'%)PÍı{[C>šŒ>¾õ†Ò%ØVLP¡ß8û"÷öŒŠÁX;½ÄH¥<W¼ÎäĞ»BæcQ ;r,wp‡ÑÏ¡©ijø÷”t¼fæ¨@»Òú(4•ÖU8:Ù¯€£€@L{š³NĞ{}NKSËA¥°Ql|åŠ³¦y£N·ÎhM=qkO[ö›ŠĞ=âö¡v¤>~I?«Ve%¸ÅƒxMç[(?S¤MÎ«eÓ]ÿ@— ÓÔ¥ê¸ØPÄrö/ ‡¼
w>GŠW‰P³TÊ‰·zy*®‡ş¸{V CğtZ]E´†Ö,‹¤’FVõR	ÒÎ¥²œâ¤ş¬‘Ø•økÈ¡rB­îüÿ#­·ìF‘ÁEMáö»èõ«Ú†âa+yİhd²®À¼I›¿3œÿQÁÄğ-ŠÛA®§Å$@)Kß³ç'ğWñÓìîløN~?D´#$q Õ}•”`ÜRZÙÉ?BQª°>6YGÖ‹quÕŸcõªÔ#nÅQ«‹@í¿ÌWG<€×ÿó
¢ _Nfş©ŞÉ&{(9Ò„ñšÒ¹œËàúZˆr¼’<zÇ"$©Ãiûa
ÿPd8*tLĞjğ*ºaÆ©\­ÀpÈ’¯Ã”I£ˆp""ŒÔ7LË’ã2oà•ˆ?™¸õ‹ŠÏˆk£I»f¤‚Ê²ô±?«Ç1ËÃÖ¨Âz¶®Ï¯+ÕèÑEÖ|Àï¯k#ÿ‹ÿ““|Y·:Ó+#× Şã÷ šÄpVyì|ôäó{÷w½Ãë=.ò:Ü¥v¶àòŠeoxÿõY #ÃüÿÀµÙQ®©?+ Ñ€Q
Ô4>¥ø¯Ö¹¦üO…2ÃduÿG!£eL8\1¦-öH×æı6JY€®hY¨_¦sohd1Ëk]ö‰Ì—¿Â—úğšdÃ=¶†ı”©4ö_uéPfeŠò;¯=µúoÉiKïó÷ÄVÜve H®”€@mV*Ù3ûàıÅ_ù‹Æ‘\OZúAâ¬p’,´­Êâ¢„ƒN?sÍûÎ0µ¡Zî11¦Í#ÜÈ¹W?‘‚”’ËûßËTUÛPß7À9Q=nœIÍOú§Qm¦Ğø^ƒl{İñöãÒ‡>õY‹‚¥Ñ
q«ÿólÃşØ?•ŠØ§¸Q:ÜR°ùí¶ú>P[uÊÆw7aÉ¿¹ë¤–Z®3ÍRwcoÔ)Ÿÿ"íâo Xö­ÜO.#iúÖÛôÙ(9–â¥åC/2üè»­p`Ã‡=ê))ÙÕÔMë5ée»şÀ!•Ì­Æu~“İ©;ç33»"Ø?¯oß%÷{CĞ8•È!é½ÿzümSÒ_Ãõ°ZË73¯×#+â¨æä¸ä‘¸ğê™f± å3åÆ>oóg;ìQè+ÿ§ë9+3ó8®¶£õgBb‡5dzHï¬jßô¿Ò«ñÉnåÊüÎš3ßèšqıÉÕo6Ê„8'íÖ?AHmyEvB)’e<Lîê´ó˜Ö¹ğ{FªÈ {øa_ø“BŒ|ä³ÿ›j 7º`ÁŒ1ıHC*µ*´×Zcì]t´ly-u1:Øç¥ü÷OˆWx=iõEg7‹lhO?Ö§†sæiï%Åq@À\#
 Zñ/
jº&Ÿ¦¼f­¡!{UÇV®f”‹N:qsYÒ3ÙŸ\P%º1ì¯á ã+ÄèSS:á—i3øƒööhvØoõ'|ß|:fæclœsÒ<2îaÒğ|Nlş+×íÿ‚ª@Ã×FëZ«W²-zB¤29Ë½Ó^t»A'ÈO]yÒ}»/Œr5¾¨7”Á£Iı<”ÅAä?¬Òã{ĞGV2 ÚŸ²ÎÃ‘t#<,cl…a-UïÓLÅ!ô€29 mÆgôpªWü@t›1ĞöqcÓ?ş‹ üSZÀ¡U[ÄàdV[	m¼G}ƒÚ¯÷4Öénè ·CQÈìü™ºxƒOÉP;ºÜßÕ,5¤Œµó(±mr(?]%üş$J«”¸¶šsé­îĞlãpç""\!,ª¡{Ûù}=SSŞæº¾Ö}‰+An@Ç1©ÚU4Ö³ë[j/`úéc×Ü06íDşd×Vî‘š„Ú¼D®VhÉëÅç5‚Ÿ¦C+X7‹ä‘®•BÍıËoÁQ­Ì®¡‡@®õ†ÚÂõ,!)Ùø–¥‰P!$*&Ò¾_sWjkòùuL¢ÔZšE9¼
”ï:C©½d°ÏõèV¬JÙÚWQ©%¦"}ÿ¤Ö•ıàea:y7ĞCàà/ójñÈW}¡)¡éUÀß‹¿¤ĞÉÓó”¦ÊÒ‚úàà/FEq¨?­úì~ë%3 4'¨(×vèU3ùŠ«&„©yG\pİ—ŠæùÜåÎA_å§S0¾3†ÿĞ¨a¥ıµÕeõa%ñ3p@+¦ÒÚ Be¹j
ãªËHáÅgJ;¾÷Ë>;»©¸‹#µ5."5§·­f³ŸÏ;%äë‰”’ıeo@€úyÊò}‰HQåôËıéÜË^÷Ş~ÀYì‰A´uY0ãQ:§³­,Ò¥ƒáŠzŸ7¾¸çúzÜm“P·Bñ »&D·’‚³@„NgüüàÏ_ehÈğô¸,N4[K0˜do:âÌ¾{‡%˜œù¼\ˆ¼E´  MdœßĞX;İC™S
’Ä
ØØÔ¨RG²M§úN õ0tÕ`ÑaQNr†¨¨Wûˆ‘±¿¤Áp‡E¯ezš*M\‘Òn'Û„ƒ»ğ(ûP&åê»?ş;U¢½¦‘äæS>U;N+vw7÷O-ãwtù¼RâzâaíãÕMx‡å—²†T™!)±cfkÄÍYX3ÛÖÙöMëˆ^L,Üõ şR®SLUç„FWÔµb¼;Ç‹V 3^­Çc™ãñşÆåºÎ+ëu#Hé£„-ENy’[ƒ/4 Ö*÷XºÏz”ù—
9Œ®œŒğº«e½†£¤¦ŞqÉ§_`³„J~FıœMA„?–63ôÊS,¡
TËM¿Ïªy©[IïúÆêñFpY:;\ÓÊ»xt=ûgë¨øÛš8õkVM	LŸwáîXBl>ä¶ø=%ßµ‹.âT3uIÊ—š†ÿêÔg °p=(òQ£¦ùjôÇRÌÖÓk–„Í$}Ë×¬+Ç_¨„ØùVvpûgãNö“7=jDÙï¿¬7›roi<vm“Å¡™C±=(ï0Ï«©ÆÄRø©LÙ$¡*Ûz_õ¹©»áUîÃAî.ŞäÑÅëü`ê¥Î&ŒÈ{UA.ÕáÌ¢6¯ÒBş¾p¢º,[_€bª=Iõİ}ƒÛ@0ãÍŞõ ÕeJõÜàYÊ÷óÆ¾†ä!7õ—ºËWzåYÃÓân'7ïĞa
åÅé$7Rô óä·ú»ROÏ÷]­½Ù{½àA§	œ+"iqUš2‘çRVÕşÜ6«gßâ€ò(¹¶
ÄìjáˆAÁqıÅà‘pº\CšÎ$ìöäù²ªĞ)ÿ`,¬sçÏSKußË–ùÎäD¬E‘üÚ˜ß!åèô•BİŸ¾%i+µ·yğqcß2¶ˆÔÒ ô¸^şÍÍ?ÿRõì¯K”†€·?	ìâ›wf$¬ëG*·_µ§£ïjòšã£ËŸ=))½rBq±±Ûµë÷¼¦ÈGˆïÕ§¢WjÆg@Údy_ò|t´+ı£yj!op±Ä/C7rêÌä”_a¯ÕEêS¹ÿïôï¢¯¢İ{E°¦ºBÙ((Á§.¶±eêmVIÏdu´èzXû,šõO-§¹_ºœõìFq ìä‘"ØÏˆìÈc•–Obûd¹%fÈ2ÔÈÒæwk¸v˜åğ¿‰Ò•Mã¹*ÙÉ©¾s¢u•4èş7}2‡†ˆ*U	Dê#9	R¼Gô+•Àjz­w—‡˜`ÖÂ•e'<Lßu§‡iş‹&v~ªÈKaÖ&e³ ™C-b?Sm½Î¡¸œšGıÃ"6O'dWßÌO)4\¡óY)3iKa?L?ˆØ…;'H~¤º*ò™Ì¢Ø í
Õà“”äyŸˆòeÁü8ÚèpoÃ5¸.{h«eHHQ
wôØ?gU vkøËey2gÈò[ëuğxWU|«ŒMû=bµÁÏ'©*äeVÑÓòİzG)š$Ô™'# @©Ÿd+52$C;œûÁôı+ÿK×2¾«Ğ^kÙ7$~[ßâ‚¥³¸Ä2®iLí7¼ëŠÚÚº^ıÃT\ßüLÙÿ¯_-¥‡—•ìeaÛ'’Œ\•ë§†û"ñ„}h²5½+I NŒHO\”èòªÁåoöY{À õ­‰I}ø3†F¢ˆ¢¿Ûğ¿Â›éü`ZÆ"¾úê]ZµŸçYÇ…ÎFÏ._’8PYÒŸ:|KÔ¸k,=@ÊÙ9«òé%=\ÉªÎt$X¡»Y(fEºøÔ‚ÅGJÑ“ğ¦}1ş’tZ=~è@÷w`áaî†ÿ_=7“‰ØA»=hÿwÓ}ıÚ~G;Zînw{ëœ:­Í	<ÒµäùêV-cOıô{DPŸ…Ô_"Áë‚Jj9BÒ?zêÖ7¿‰®¹¢<Ê'ÎéNêUßÅå}WéÁj^ßŞªÉÑ3ÁÑ–Ÿe™É(É¾Ij)%|Ú³Ì?‡MñĞ! Í¥S‰´¸¯¢ã¸<ö˜Ëu¥P.«MPZE*6z”®‹€zEI®6úæõøiïßfW5³í¹_µî-¬ÉÎ¡F¦ûõ$P/¤ãì³üeìôˆ†°7èhzÛwIEÉYSŸ3`TfÚ¨ÑÛ Á«)ŠàÜÌ?­KÃ²Ÿk{ÅL75¹~£ùZTô¿œWà9ÅLQjóíÉDš³­Ö‚†qX¶hp)+ëB;^ÔÓ±Qöf7“VwÇ â'ë0DÌé÷h)ìës½	Àı%/D1¼ã~­6J/£³¥ûÏ¶«A¨I^7{#Àâuú9//ıu¨C¸Šä·¸¢}Áğô§cH0ƒU¦.A-^»|‘ÅÀ—nßºa©²T>€ŠÈÎ(\ë]#Ê«&áÉO…o…’•BäWŞ$	È¿H	²!'îé¸UñW,óã<ñ<2öç.ãİ‹·¯†ÅÎŠ„¡Õy‚§X5nü˜Dp\b–ÛI½î–_É×¢CY	qRf:åÀÓ[ÿ-_œÁ¿j(@-0]dMI¾B:Ê_í?º "é«€æ¡u%mƒ`ZÖ1ŒdSâê€«÷°¹&J¤&ËâÆÇâVS¢m//Kâ@]UÛ3¶5<!kğöKÂuSw–<˜~—¹/•ªÏ%à” "Oğ›”h—ıet?\ÓYöŠOWÖWAù†tê»7Û9ñ?İÑÑÙX°-}õ¶XïğY-ebN©À®v¢#Ui]^ÿ]€åV;ˆ‚ë²{wäYŸŸ™Ï­™2ZV ó8©VuŠEŞ\”j¸xl[ïZg3ÁPD®Ô’L§÷;cè¶ÏZ¹ùDòÅJ3‡@ÊV«ñ9×)Ò¿Qğ5ÿÊ¶\TõæJÉ
;å²ˆ”Æ|å&ï|Ï”i¡9'}_d“[o‰eÊŸâ­C
_åR›ŒcLg»c¯9êã”T¹´9–_êlA–9Aôz×@ğú8ê(¡wŠlÁı(xEì4‡-s-n5Óß­XñSqCŸUj°quxÊÖå3E4‘ú¢ÜOf}‰æ>:I±éÍ‡B»Äš¦ZTã®h	
ÌÄßRèDKÓ¤~mV=Ìïg‰RU\m¨átw»q)ê\Jé76¼ªÂûƒè·EdetĞÈ®z“°ô~M›œg6±ÃYİ<ù™%g U¥>Qp4«ÒéùÄÿ/—¦á€Ò-–€•Ë"É)E×iï¡Ì>÷Î'z‘MQ¦”$0Hg¤#ßÀÚ4RôŸèp5‰é±yz¿îx¡ˆ,-šÆXMşHOıN_áiúKJ½aË^õÑ;1…P†şª>ÿ8Âx}½Ÿ1~“Vğ5ğë ğÕ¦S„ºÎÖüÎZ˜º`*Tƒ‰âöj)dÎ€û'^È3ÂLÙu2ãK¿)+16%é´â”’C–)n\îòÜyÌÊÌuŸòÛ‰ëÜp•HişRVTjçë…&2€¥úŞâ#BäÓnt‰2ê5ÏÇ—±÷šj“zmÆMS0éôÊjˆ ‘¼¼ yıú]ëöÙÓüqê$Œ¼°Ø°Y®.G	yãZÌNêNVƒ¿İõµ˜×‘ûÒîÁY];¤	ëù¼‰2Yeu¶Yâd¾¿óuŸ>Í:T8îyR5ÚM@Màç€wÒ<ÈÉR?^Ê«ÍÖó¯ëÔuWN^€/F»ôIQTp
ÌXÄi…©Tqf^Hİ¤
.^Œğ£H³.£¨Ow-èj G Ü‘_å©»¥£<¦$*cóÿ€,@}FÌƒÖ!É„÷¢”ÏÔUIıY’sÛ¯0E«œ§œaTî}O{¤$ú ^Ö)Eşu-úQ¨9eŞÿ€qgbÄ‚!‡Bïå–âúËL‘ÄG-Pèµ‰ e8FNèz‹«ÜÀHú´ÂL¬Ş»kËû˜ÜÍâQ˜ãFHÿG‹B<ŠH\]µˆ2ã/Åİ˜ëMÚq£âí× †À,£[[»ó~B£<wâ—¡K]üEˆŸ<A8ïŸ³¼³ØCJceu–(Å“¯wå€ÔhâÚû\<·€Ôµ•b¼Åa¶˜M7R‘¼øä+ôÀŸGš˜¨ÿE Ì»Vx>õ+ÙßöıÑmî	Ò4ö ºt¡“È	¨B}}Œù`~:ræâG$]ä’A¼`G"†ipá“EWŒ&5‡	±èàıÖ‚·İoó£±añ¸‰ÉDÑåh†JK"›l‰Ú3G9ßàA±Aˆp¢øyàœÙÍdx*É%v2§J…å×}¯ëı“ÊmgBùya‘¬nİy Ü4\œ‡Wš©D–Ì÷§¤•Òğ,¿
ı|Ï) zÀÕµe·#ç½úï”‡g–—x°:Îq‚š'ì[ØØåqEUØ'ˆ‚&@ˆ^Å}qhq~¹º ”“˜¾ŠARRñ¢¬ò¥;àéÃpù°ÿP{oKgÅÌ‚^¡Ëc=à6”Ê•ùü¶’‘fÒà‰û·€›@ ûYo¸ˆçEúØĞ­q½´Û+–Ê­aƒ@"‹=•}ñÖ÷ğø¹™@İ¤¦K
. \ú-jÃ\qw˜†BcVó[™-ƒı™Û¤ 8LĞ³;3ãRQÈ•¶é;iUÉCvq¥¶RAxê¬¬+ÖP/…Öµ’óÒ®W‘¤38Øë8(W
hÏzN@É;,ˆ{98X«ÔIe3ê	¨a•¡Tğ¦¸¡(³­v?(Ä£~pàõ¢ÇÊÌ¾Öü­÷ñİüÀç?Š‘h;¢ÒÍ­Cfë%äÇÒk˜™ib÷9çZ**ÍFgöô—X²H>›øo4È¤h#ƒ1^g óÊ}*·z}ı90À”NÉ0å
¯¥§‹/IO»MŸCD&_	:Ÿšj¿”¥|ÿDvH;Ÿ8Š~+?…eÃœFß`lÓ¢uŠ{g ÏÇé®Hó`şj
°6K İÄ‘Èï[Ÿ$!z
?U.4ÀÊ»ÔÓˆÄÒvÏMÄY¨ºĞ€¨½50A]·i”ì—L» Ñ„B]G5Ïáæş`ßy±Æ4ø GâxÈÂÓÀhDĞZÖ‘yBÈşç©Îû~Ç¤(0ö–ùZvÊ@Å¿
…—Ò Ãƒ‰¢çâ´ïğ<¹Š@u÷NĞ!;Hğ£¦4Àº€ÎşC‡½İ$C‡çM7(°®E2É˜æƒ¶c-şƒYh<F#kãúìHAMÅ?«úÉeÖW¯‚tùen9Mîßç‡rÙŸ9Æ’BÙüu[ë…v./xJ©5¿«ß¼Xî}ôcØEE¨›‰ƒeÀx%Ú©/¬êé¨pYpÛr"
#»¡éi89a8Æøİ…“phŒéxÏ A —ÃÍQ©ç(Â>(ÌÒÃå8<ıµxÊß8…•»ÕqnÙê¶•µÓ:ş.ËBÒPÕÃ[]Ï?¡¯–ÿ–Ó…¦††ïâ!tÀ‘«bLßõ¶<Ô€ºÂ §ğœKˆ­1Érÿğyøá¦©Ôÿ/DÜ” K]O²*/óg´Í£j „|ÔŠÜ8Ç9ƒµó¨hI¢ãDÔ&Ts§BbÃaã$œ)ä,¦|.ò3Ä„L÷M~š.æ¸80áLŸĞ_¨ıvT«c2dj[k9…ÂûäG5eKüy—×¼Â¯:ø<Şg{âå,”¹/äJ¨yM^Î‘ä=¿Áìd°ì>0şdõ~Ö›;‰*Iº½XŸQ3ù¦o‚ÓüÉèºÄŸR’ñqÏâØxÁâ×%’æÇØÜ±¸¸3ÇW)†Oë³Ø&iö…î8‚ Ÿ¾Ÿğ;¯¦{xñ)%‹ Òÿ)6jV³€—D åË…şKİ)]eh°dT,²{ª#qäÿ:Ğ¶®T1¾]d[Ïñ<SË»É7½«Š—-Õ£2§Ü\üp·ábh’zU†ÀF|}Vc¬]†•:;®"|üÏÏûe¿Nmáøó¯¶jñ$>	5ÕˆÂŸö¦ŠŠ Ù |T•àz™(¨;u[Tóİ)”íetÚŠĞ™†h6Ÿ0wL…Á"j*XÙB9æFĞúõY›0¾Àš"Ô\˜«t¡ sîU³¶rÅòêøn}O1ĞWò_«P1G¦ªH©ÃD»J»Ÿü­J…
Ì·t»Ú¹ª£µ#à6~N±¿´VéYÆÇ¢6½ªSÓ/AF‰Ë2]¢·‹?cEØØZgz+vÆŸu„~P!8%kÄ¾2—ÁL½oøæ7»§Åå=°9h5Dnä‘w"©sö¤ »àÒgkƒ;R—Åë;‚°øq € 0      á.î
î.İåİİİİİİİİîÂÜÅ»»»»‰…î.±à¢š0³    q/CAE“@íĞÄºeårˆw&”$	ªCd*Û¶§>H@Î•ûù`ĞÄ’f3é—IšEÍNjA&]Šº¢)      2  /2_~¿Ãüx<!ŸáËl*,ëÜ~L1HÕ§ë»±GG•½–î%Ú/®Òéú 0yC45lüµFÉHñBDš»Ê$â¹ºA¸Ÿga†;uS³‚!„î@!Š²«Ê&”q»èË[±#Ez”È2årµ$8üŠv¯>ûWÎÓ(!—^âÙÀ¿ `ƒ<Fã7ĞÁËşĞ5$àÌã+ûkÔÇK‚)‹¬Æ\<¦¶"IËÁÌlÄìAßiDr’pdÚmQÙöz9÷ö@ø™-³ªï´ÁüC "2ÍX8”¶z”®kšU”S3»wò2À …ºçjÊó§u«M*iø0Ù˜ašÇ"İ€
-QwÏZ67>”ËcEü|`]yi	ÌLÎÊÑ•­aÙá|„~“ÓÛ›^]˜bŠbËQ62ŠûŒ×)É© Û#PW©(Ş¸"?Qå?=ì=­×QöÎ'ß|×6Š“ıÿ5­tÙ«aebOğ½ŒlìŞŠ<]ËÉã ªÇkaÀiB#
}æÒz´¥p¿Y¹¹ô_÷ó~2Ù§3Bä‚‹a¹8t«^º(ÕÅôì1EÔOK;E*mèõK3¨w¼ÉYÛ¯›¹ÌÜ­°"Um%‹~ç3²Oíò¿úÎçÈ/gC·­6'Ô~Kå†¼í®­ëÔÉzÏÅrô"5hO®{Nê¾İ€æı)-°Õò7ş«ÊƒÉ Cë5e<ÂŠÚrÊNé¯£F¥,ß=·Ëó1ÖS—ûíÁ¬C›ŸP ÏÊäÓÂšŠ'h¶ŸÃ1=65C *pÉõF‘¬«Ïí{qø­qÕ4#85çPL[,Ó§ÆÌJé,àwi«g»h}f‘~òĞ¯Œèöì€2–‹Ñ¿ıAOßú¡¢âL&6Ş‹9Ì+`6İÔüÆ¡ĞìŞìzÍ¾´Ö¾®,8~i8­é,kæ¤¹zUh=ÅSJú‹EYN[²eºG˜x“¸O+­¦âNeÍröñ­Ã²è^mk•T?åêôœ£I‡s0Èå"ıî˜öRlêl ´ºÑ×zåôìß*e4K±‰	Lu|8½†C² v¬GD&@'~ ;~ƒö©ªg9×ÜHW_ïºÌ¯˜O¬] Ù9Ê§Hôv‡È³-iBöşLRÇú9gêb_½¬Ü§3aö¨#`ªØ	 *¹şqÇuòî¹¦àÌìÔÛ÷™rNkª²¯KÖ©Ğr;gè›¸®éñ]3Œï
éô¨‹ªVÖ³oyDãFqºÌHStë„·–éÍÉq¬ë…u/¡ˆş¢}6˜®YØEÅ˜Âô*ÅL,°¸¾ÅkÈ+—Øö°çDv¿*ÇY,m_‚Şw  –SW!Tn~ öÖ\·<`//jSRÑŞÑÁ·p×9ÿg—OJE&»àE…Ty77,¦¥Î ÕĞYÑ½µ˜Êç¬mëtˆÕœ#&ñA¶ #îC4ˆ€üµ¸ ïyõQm÷dM)=ÜÙ ªÓ«Ü²Ã•<ƒçÃÒíí=i6rÖòú\[ŒÊŠ1
4hİ'6 ´Ò-4Õ£ÚUmÑwqWƒ-Ó@û_.À5ıOÔ¤¼KBÊ/¼îü7‚Û—Æ<ª2jàp¢C' öÔÛK§{‹7];î”ó5Ô8x%›„ëÌ©%Çá”Ïæ«LZnsé©„Å)óå]¯^Kı\>é§óP·ênjQj–ú	üÊ>‹¼÷şÚkğ®åP-´L›¡S¥¥:0îQšN>ÊI
‡ì«ğF¢/2¼ó	Ö¥÷é5¿µ¡Å”M6×yeÚ‚5x$F[úâ.3ø¸bÕúd’æÉ-Ê `œŸm-K‹Â¬Îœ´Ä€{’i9•6©R+Úì qJS¤œ:-¯Ér¾Ğ>4\ø,âC¨™ĞY†o‡5ÒEÁ'cÌNªÛè
‰uŸ•nƒÂg?‡—ÃƒS	áû·xìË~µÖ€x¹Üú]kŒ¤\ otªk-]®ŞñÙ[ ;A91¼`Óå0eŸ¾øıû6š½öubs4ù‚Óâ()ŠÂ¥Id¯Ó}Şá
hláÂS3—•xPjfU¶†SÕ>©»-ü"¹&h.ıX£Ò´6¼şSƒÑ†ìĞcydÂ‚ßkFßììĞÚÃ% G÷ñ9ûöë¹áqxd~'P¥ ™4‹:ñaÆÎÕò|í‚8x‡Õ2ã`w8¢¤ÎÑõ™h…IG×S!î¬××fU¬Ó#ì=¦C$’ª½•‚ãÅÃN9–²G/hLwz áˆêDS˜ŸÜT¨qMyt¨‹ö"-W;$ù¥j3·l&P¡nuï x “#Á”"Ã8 õ’ë_å°±kçŸxTùÒòÏi7c¨°iëT·õ¯K€¥Ò£øcEuf$ÔÎ~Ë\Ï%GùùñŞQmbü?.Üc$¢VÈxÚÈò8÷ˆXÂ—Ô.ğ7ÌV¥IĞ+]mÙcÛ3”X‰lp¦¹°+¯ã˜ÆúuåõhQÈêrª6n=º—2<‰}Fææ¤.f?ïÑƒœ'˜òögĞDu»Æªt9âÀ-“<#²:ÒlŒ«tc( öÛƒ+ âx›WØüùó^‚AoÓÈ[BÎGÔ_w/‚Ä>~L9£+ ™¨~rLÿŠà[«{P@Öe“<O®‹ëÔ›ùş·ªë„ j ¶æ*çÂèGPcê+~áswgXÕÆ½û² (k±Ö…—šğûn¾~]m¼PÓÙá¥¶.¿¶pà®á4.”&6©Q!V²©à@,MÙG•9ÛMwô„°ÜÕ¤O”¤ôª?nŸ#zD=€>ò±§‹öæ£6)ê… ‚4ä©1Pb8'Çœ‹ ßR÷›$ƒè5QİYı¦kkÿBMÜQÑŞÚ¶ëı"ºeÏÛ&Ö9^´<ŠÁ“Pˆ9k€ß=»ˆ6ÓÛı^¥2dƒÃ2Z	°Í¾Ëú4½mif­Ş2PA^jšnÑõ	á¸£æH(rù™¿U½q DãìlrÄzîÆYç÷ÉùãÅÆVWú]eÔÊ…–õUÂª{îú—©œ¬úR8¬¿ø3
áLøÙ°ï%ÛÃË$ŠHÎŠ“L'¡5”¥¼¹WeóS-Ïglne¤S»»ÎQ­°88U1Ì¹Ï%øR£…,«•¨Ùn€ip>ı”ußõV,¦€=¹'äGôÖå'P)ŒM‡­vM¿P”á=O|µŠUùô(wªòZµÏhráPe2Ú‹×ŸÔäÏÄyºƒ­Ë6H×FÜ—º«‰_å{ïôø7oÂDTÄAĞØ Ğ:u@ÍŞ»â(u†äGd¤‚™óš²Ã˜Š—^æ°£®›šT×ŠªTšÀÖuº£5\èÛA Âƒk8
öÆ[Ó*'üèÀ:k8é@I_;ª¶ß]ÿ- „©C&SûÔtTÔçéêM?J4Í¼Dé{†"¢ô'd5Oãª*Ñ"±G&å: $Á,e#ã-ÇHD<[ºVj^>û×Q!=•t?óĞo&°+˜áïbOº{şRïo²ĞÏÒÏA)Çe÷14Ô õªœXÁÃšMúõä5]³79ÜÄÙwE–4±~ô­ñ3(F"à‹cÕQS LÎ»P|2ÉO™"°X•pë‰­Ş HBŞr›îÃ†§Q<¨WÆøÜn×Ògn¸×ºÊÓ½yJa¬”02€ìÕ€„UÈ¨ô(k‚2šñieôÑs¯Õ÷xçwF/ww^
¤	$
Ì‡¢gÁ	´[ÎUÙZÊ€`´vgOQÎ““hÉô™+şCzojURÔúr„äU&TV´–FCœ{J•¥W(ğG8jiœæS£”ó™ıKŠÈzqM§“=.øÔÄ5 8l‡ôå4u¥}5gºêT|˜u@?g¡(¼Z:`q†$lr›,2Ü*Ø,šUJGL¡¦
fÕqË>ù4•ÏxÀNgõ7¹O÷/×b[¯Ûæ~ÒDœšù²©”ò—1{µ>ÖÆ¹³Š‡*ß[›2©1Ã¯:øvmí®"UÒ›6"BzŠ…Ö }a¹ÿÜ¡¥eKµ–„*AnNt7ÊöÓ2ì%í 1Æ®Àà¥KÅAJŞEpãOĞ,-v½_OÙeCúpÓÌ<¸AüQ÷^X'Mø{¡“Î$PÜßS / ²à\4¡ÈFÜâŞğûE?C~ıWYO[ğò¾î“&5ŞL§ßpš£JQµzu{p<úí”ßrR»Ù‹LÉ¬Jó)*Dª2Är0õŸZYÖà¶Aˆ0e‹Æµ€”'³§·çnúü«9ëmîw=N:a§aÇPïã0Aâ.§#3úBÎÖÔ?Vı±2ä4*ŠÀJ|ÍÃdbeÂ3T¶<\­2eü	*}û"oÈ|¿örM¡‘0“Éxªg¼ZO½;bh´Ô$¨¹P?‹Òâ!»Ø®x¹<òx]6'İHq(ğğ· êœz=%öäÚTs·Mˆ1µ`ƒ± ĞP™ ¡·¾¿-Îı Nö
Sq3”@?,	a+oTÂ:Àæ®y^´#oûY¶Z•• ÊñsU|¦¬¹z¤µŠÓù>şÑ—šñˆ)ğìÕ
9p(ëşğpş˜ºı×"åW±õÅ'°‚ÖÿÔìğ)”Ú(0ªë7nÎãºë¢C\I§MïY€ÕŒÖrY€1`ºF¾átÔ=b]ğºÒü2o÷Ë /ôŞm9ò@{xÒ¼øÿS[gZ©	Zÿ¼ÑÁoÚj·Ù;î™ËÃ©aÏÇÔ}E#{‚G­Ñô¾kïY;b$âæĞ{…ÄÃ‘óèá8s³Š
ë¡,‹€íŸî÷†¿lÎ¬ÿÁ?ğıs¸rS"áÛÚ}UGrñmM)™öˆ ˆj[pÎ]ï"¹Ös´çOà˜$©”îl&7»íbó<n•wÇKUY -—wf©¨l²R²Ÿßÿ3CúøÏã2ÀõÑ¤A#`_!sĞ´ÂâŞÂÈ—®Ò~º‚şÒ‰ú´¡d¶«7"ZúÊ60È„'fµéÜ½ÍÌ®}•ñ+µ‡%·ËÖ­Ğìq«`÷&oÚRñq´ÖV@i7ıbİèÃ¾m—¿3Æsû„}tìLQxô2É¶B<Å§cQšoA‚ªEê²¹ïÁ¼²ëùEGŞ*>ß "ıqC.ˆËœÚûl1´ñH‡±Ò&®¾¤û™ì_wtbeoß+¾ëáõn/n¢Såcw«ÉJ>1‹†bû‘Tïä‚Û´?fî"HÄ“’ëĞ§¾`fÛ\ÀÓçæ×w¡`R ~]‰_Ë•{­±ã7Æı?© ¨Ÿxÿkî’3m†4²wŠ}•2¨,ïmsÅÖ¶€q¥¾WÅ-¸æ–İH¶•&Õ ÀhAçk[RZtpÛuáçüÜAõÊF¡xi[ÖÅ=(DT”!m¸Î0ıC,Å­kU~M=[Ñ¹V<bòşö»ûEÏıÜ6¡úø9àFß#¥ªb?(Æô}>j½[~.Så³ş—ÆÏ½iŸBódÆ¾ßÖ|â–®¾{¸ÍÙıCªªÅ8gõˆÆ?îı^êni?¬?™Í9µxñ›|ÜÀë÷¯Ÿ:±òRê‰‚3Xè…Ô ı`Êø)/kî/u8]µ¦??£&«®~›ıŠ£U&›T\·@áÇ„ím?C±Û_“çË÷¨+õ>ÿaPßá/L›_xT;æàGK¸<àÙÜ‹¥Éff€—ëì¯õgË_ÑNŠşp©gGmßqÓù6ü&5d©ôñyZ†•ì¶¦ñP×øPUArL‚±Xà›Û\1Òƒ`(h|%û…ò÷/Bü|ì<Àãı%ßÊ©H>1Ø¤ÏgÎÍFŞ‚ê¸škªèQBßgY©nãÕ%}Ém×U»á¾çGÍÁFß°ºs¿¯5¿)4À`ä¯ß=Ş‚õÃ¹¡<1øGLÙ—ôÔÑÈJtbßÎ‚³Ûøƒ‘€ÕNnâ—!Î—º*ø¤£
]oqØDF.>)ë¢.{<ô>vÇxåióa°=“ßÄxW?İnR•Üó˜µB0‚•µêÖ23«(.(2/T·–\©ÿ»?ßÃwPÖçÖ=‚‘´#cE à‹wG®§¯ç0ñ€ ÚMUÁ¶BèØèV_lã‹½m>Ôù5r2–‹“õŞfÇÉuVŠõó7ÊeK¹  H)/8á×¥êe»´úº™j™R…Ò":fÔ%ÿ³Z: =#üA‚·†¼µEØëŸúyè ×âtS#ÜND° @Œ´¨å`Ü&æxÓõ½©—ÕoÓº â˜ÿüš¡DÖ3wÁTsÍd¹®µ³¬¹€¼ÿÖùuÅ:_Ğ=¾–B~‰˜ÜêÄT-ı	J™ø½‹ôĞ0p*@W":b|q¥µøœ ÿö(»’Ÿ#YÍ÷àÜ:g'†ÔQï‹5ëŒ³’Ëİo_Û"è_»7ÄS8ÒOâŒÒ1ÄkÈ§–ZíEÂû›‚¡Ó‰ÿdçÎvÒ†«}Ë¯£z á¡ñW\İ=¨ÍƒSdêšXÎ¨ªÊécUSNuæR²i¾'TëpJ›¤b6Ô?
]ş¹8üodË©¿©’•µ©\ª»òÃg®°Ûo}x4B‹Õ¦6ûa”ÉEæ”Œ–!û~ğï¹óø¯½"ÕÌ´zÎÅ¬Ñ ûğ¥R÷³mŠM^Ñ=g^~†\ã¯Œı\î¼ø¸µSCøVqRK^ìUòVî&§›ôŞâòk`L¼ó5úVÅ93^Íõî7¹Ö%ÀXódÌîñ<ùñÛßºIu8ª	ÂşT ú„ãÍ½ªP±ÍkƒV ‘ô·Ğğ(f²|´ëÆl¾?”Å‚«:µ@cÃ€¾f";®‡ÎR1›•=vÁöÙ|hv•f³˜wÔ3©4¶²ñ‰h×…0_eŠ‚ÕøÑEÆÍª«Å°9dŠ¾cáøîA¤ê-8ì›¼MÿÉÑZQ›Ï}\<µİ¯„`ñA2ykã¥‚>U)àkĞl¿›í…Ö·‘´«´hFP‚ÕŸ¬<,Ü£ªÿğĞ,u³?1m³±sÛ*Û­8úA-mÚV|\9üäÍÜş#Ş¤7ı‚‡¸R¤x²rê÷hB-4¿Ô$KÂî½.zŒt:ÛzFUF†Ó óôõ…ŒOÅ¬«‰çfŸ4×N—¿‚Ùôóèğ, C…P‡Áá¼òş÷æõôZJ`š0Bö(•”Ô™â•Ûa=4œ?5S)×¶ì~&e¯-?®Æ‹zâm7Ÿf&Ü-5rÓhÆèA2«ŞÃšæ5Vä4"ñæ]bü¨ÀÇYó21é Ãùíöä@·´É¡Ë£‹(˜¼.¾ñ¾±XˆÛ>Î¼ÍvÒ—)
N®¦ß¿y0(Û°õÛ”¡,Aà5(bÒXwe8MwL)^#ÙÉ=Ã8?u2»­ uo_ğü?›ºUéÈ‹æ˜dÀúx‰ú¦c­yşã_³>‡éÁ‡P]g×C3<´Ô
;kÎAz„y;lò'_7(Uìû¤	Àö–pS4,*ŒÎÚK”¬,fvsï¯Ä™)i;\ú² àÆQ™
HIjZq.—ƒ€«ñ§å+J£Û™õE¸ßˆÒ£/BíÆ¨ôqõ¸ä1ÍEARskÔ¥¨ºªô†§ï(}6í¶™õANy~´I[Eõ×¯wuëë­&·E£7ÂµY‰§r@hC?`‡Û¢†yªüİ^š¿ıß¬ãEäÑ¢#°ÎÊ'HŒ–ü†abñS>@ÔkÊÌ»\ÖŞ¿­”YüîÅ§ÁG§å³óÕpe•š6U%¬¡ƒj9WÂrá˜£µIÆÉW±úCÉöÓ’à)ğlz]/Æº÷±ã£ ¶â£3ä„=ÍÑ°¢¦’¶©ÒM¢~NjYÙ¢©ùŠA>f,&]¡rè¿ö›±¾Œ‘£´â¤j9«>¢IÄ–ÿ˜¨¡É7,0ª ±$è´®(ÒÀË%q,ÉëÎ/Œæf+£6* }ƒÎÀŠa(X††Ÿ˜asº š¯¶I:ö"òC÷QHN“ _.¨­ïäš¸ òşÑçX7-Š‘<Ã‹Sı ğ› ?¦²©ˆj4P{ùóì~&,fÛîU¬\ïÒv)<â¥…Pç$ÌuzªW>	ô`‡`gW½¥Q»-Í¾ñ [«‹ (á)#÷PÃ¢ÄõBùêèáºg¨Ğ´üå7ª—
„·ñï*I²Œ•,ÓB<I«ú=*‡+™”2—’Ú©\Ï…a™¿ı† ¥Iø¦ÂŞ“M&šÀÓH·ÿ‹IÖ§¨'hÎÿ]Ñ!-ğ˜‡0Z…VSGvµr3A÷%Nñ3½t½ª|ˆí·'dyœÿy‹ôRbü8¨}lMÕ&Q‰ÿÿ¾h¬éZÌêãv½WÖığÚj?ºóŸKÕmíß¤‘ğ¥~oÿhÆBù ˜WÊ#Iâ?_ıœ*‰+VdùO5ºÊîÿ©sØ½b2±ôĞ_õò İó_ÊB?'óæÿÁÿíÒ”«Çã'fÜ%ğ‰ñ÷ùïùLOş×#Qÿ‘8Áñ}v¬‹ õkk	?f*ëhÿ&Í?ş«Ûª±®g?ÿ¨Ïé$aë§g®şı“¨£5SÛ?İÿØÇIcÖÿ#ê\é÷V‰¨şgß9 -s¿SİüP=Ub¬L£şÃª$g½",ĞwwÜ–Fåzÿ9˜<7 ™Ù>ì*íÏ¹Téı/(ª{ì”ù¿>—†{q†ÿÖ¡ÜõÿÁ'¶6üRA6Ş¿ÿ­¸şˆãÑ¿k@ùşÃ€ÖçÒñûHuışŸ´vÿn ’ÆÚüŸC0ãÿ»HÑˆß¥şEÖÿ‘ÜŸ5¼é'§&øıı[E‰íÈÿÉWşøqçßx†şßâôòa´Œ½_*«¼åˆÃXûŸÜYÚwÿïFØIr°2â—yEºqfOĞ†˜w8ã-¨1iı»¹.Î¿‹¹–8kİ4î3¿HØütÕïˆ$òèâş"ıIê9èÛ"JZ°\(ı+Ø†ˆ›~işı@àù74ƒ_—ù¿FÄ#ÏƒQİd€ş½,„€ŞŞ¦ÔœŞÂüåÅ¥öÖFÄÆ…&Ö÷ÅÌFàÙŞCÔÄó=÷.–p~µ—k-ş‘¥|¢&|è
€xªúá¨{vä‰ô¼².úZ’ï)‹Äğ-/ì ×ad(mA×@æŠÈ:ÆØ1²§©RÀV©§à•g»­´fÔô‡å_<eëÒ‡´qÄ»—¡“~Ç]·¿¶{_¿Í`¶\ZÍ»%dê1-XR —ˆo¦N–ÔO~ªùŸGsÖşw"<Ü×¥A¹Û’ã_õqUÒ’)ÇıY…YyÙWy¼c×È@ÌÇôô‚Ûéğo“gbÊÉGö(õ”Šò`¦ƒÎ6ÙñĞoÑ6Ğ7íëAF/3±"îºŒ¦ıŞÃÛM	‘nDƒêïÿÖ
À°Ú˜b–£İ‡–]"ÊË©ËUUnÔÚô´¸¿µÌ³­N[«¿ÈŸxó¨ÿJÈ&vóh<Pç’Ï¯)×”‚[PØ5vX¸­¼`åÀïÎ(Ô3#›¹DÙ¿ŞLR§M§‚%1Q6»,=&uÓ÷²ù³9ø»|®<Ø+Y§¢>ˆ
ÁëŠaNjêøvÅ8&‹A&a–õ ‹-‰Y÷LN‘dém– §á”ı¥ç¾¤Éà÷;ü·Í3`¢•#ãkgØ¡4\©hÛÓğ°QHÀÖ
Ôí‘ÄÌ)ÜãŞ®eT0µ¥ÒWú“s?×ÛŠ«…¶ÿ<î¨~Qf–¾ûÁxã¹-@Ş6—½Ã&Xá’®“ÄôÈ(DÊ¡·LË‡=ö{@å·kŞå`ïR¢ôäÀ,(ä,Ê’û@ÍöZğv©Xêõ6Ø&yıøöµ¼…ŒTÄ‘Á™Ş’ 
±€ èğ±”ê]°©ûQÊr@Í²šŠı$¼`_ÂIñ«Ú§Ö×í@>2Ò$êoõì=ì°WğêíÒ/5µ«rªd°rùVÎ´Ğ_öêÀÔü…ÜLùüÌøIağ‰Y‚Æ`½áàßòè·ÚÖ={t{HÔ$€JV‰¢i$C»v~77Ã>|¸Ya2w|"f¡ö¯|gjéÎCöÌ ¾K lodå™!>BNø§°°10F+#}v°Î×zfÄï!!çZ”µÊ9+ªš©¦Ê¶1¡n2ÆIÛÌÆ‚~…ÑªÆ“`	Èæ—åÆÿœRç}Ş} pf×ÅAOºrm¸™nk|ê_‰ùÉWÈ>Q¤ŠĞ´‹i—æ”•s¶5—5s‰gõQ{L¦ïú;«L1gA:!³ÏG‹–Ùë"”98æ#±®^‹R4+çmİtfë¶dbµt*ä,sH!ŒvS^¦®12}Còz »hèPıÙyœ.:ôBH[Kºq/ÏşjÜ*÷¯‚¹öÄ’§ËÍå§Ë¶Jº2&&vÛØa64ğæ÷êzŞE*	‹CËËh¡îØmÊe9Óí¢U©¬ô}öŞ»›eú®iJïX ,Ê†™‚ÜD)ÂÌİ“†ŒÄ)¿Í¥‰&EĞq¥Xj­óŸ|?ë7sé›–d›ä‹c¦Ç0¢Ğä]wä†b,ÎD±àÜ;o³‘tÍ¢\D‹¾ä_0c¨vìío\ÒæÙèU3àˆ.Š'è†áñf»IŞ‘äÇ,ljÎ8!sfÚÃ"Ø,ŞUCCú¯ç¨Œ{)8ÂÑlÍø9_®¬+­Ì+½ƒGàü¨4î®Á@Û¯­~;¬²m91(<—.¯>ï
p²YÂUu'WİT9Ke¥«o·M‹.ÅÓ]Y®Y{~í¿ÏasÕnÔ]tÓ'Oõ5àt…°ÂMnºäÊÜ-VùÔEfhõÆÉöpÇ›(Š»çí'´'Ø†šÀwh·°`CjŞ:qX¿ª“ğ*C+	Ãğg²²Á!ÀAC²
gÌÆ*È ÜUÅ*U»ƒ´WÀ|vf³La~Ù÷ÑÍnĞÌı²-)“\OÃp5½£h-»A‘…Ÿç01^¿R@oHûQíhÉQÕq’ã«xú‹òá÷ê&Ëúq³Ã:úbq}fyö»:½{+W„5÷J®$¨* 8™™€˜D‹i5>„¿ù®‡'”¾Y;…B9¾ØAfÎ—M=/ôˆ"­Í°£jB™	É&!§£p/ÚÆÿ‹Ÿ{n‘Ìms7[Ö?Ü¼Ç`D²2¸ÓJí|Ï’ªY¦×™š¾Z³Ù¨køh†‹v½4(IVúW±a™¹tc¶PÄ"ó²f0¸É¥¶eTŠ´ëIã$—Ş×êòVxÏ“íòmíğ~„¥q•k½¯Îö	¨ë¢Õ£b¶áÕ¿íR¯Gß]@Ö|TÅ~MBÀªËOOx^ğ¹7›•±4YÔ‘)B3!xm?u.öQ½ Ôä÷LÙ®±€ºÅNE¼`ã»Fˆ‡·¨fÚT0'#ìÕs™¡ËìádxîüSEö§oå@¦Ø÷Œá½„¥F7GÓ$ÒÀèA½äëë¨´Ù)‰lç\àÕátø;éu%¶.6€Íñ?ŠkíÊ2gŒ>Kúâø47ùª”c‘t®ŒìÄæi|æ{P ¹éÇ}Ï™şËÃÉ{DÛmÃÜ™
›õcàÀæe(L|Ş€ÔŞüê¬Çí¯¥ÍºíKÎ ˜Q±5ò¬³¶ØÓÄ
Œ¤dóÚZµscß‡YENvî63J³)ã¾Gkø1fì$Ôäf>à9C´¯²Áb’GkÕÈ-­mµÌ×[?†´(Iµ3”òé=ÙmÓ	#xÒE B’4ı2±$u,àdÑË†™Õ	„~„(;Ğ˜=ç¯ÿËd§Ï¦•–Y¸k] wä
óÂ@¢—Éª<¾Xm*2Àëa‡nì°Ú¬=b„·åŞ4ˆJ¶}IQ§ƒV@ ˜¯‡ ” ªy-0Olùøp‹º*D¹dª7ÊÂÒ¯òX[cQÄÑÇ‚DÑqŒy÷¯óY´±¢¶b–¶©ñ‘Ÿ“‹\„ıÍ‰#¡Òíş\¨Ã3~”U·JY¿¶W-»:*praÛ™Á´M;Š¡Ì|˜Fs}>÷¬Û‚ôXúN»—an3>È)ÒƒcU ÎNµ]´·å†—4è:5Ì›,|ß¨>€ù¸§ì‘”…—È%bõİz4ÅŒÚ#iĞÕçşkİ)B Ó¤Sßk›Õ”™İx5“¡#‹Aş{K~Bâé4ñ9ÆJ„¸;…‚£UxuÙ)N51…òòù~º}@3$'™·íó¯&ØÅË¼?ÎË°æ˜rÅ•Y¿/:¹4µ„>§ño wü]—»üFLÔø!=]UA^'2¢óû˜ˆvªy*5®áYl¾‚}¸ÏïñÊ)’Ò^ª©xLÉ„ˆKE] A°BÜx
ZƒeÎ¸²Í¹çÆhQ:”apß'JîÄ´uˆxj(ÓœîÖA7p¿w¶G
N¢àÎ„Ìeı<Ìz½%K=CÖõ$ŞJ úÛxˆò†øù[EÉğn;¸a·ÄÈSĞ!ÎQD‘avñ%Lšà1ûVt–õ—nÏ’ı?^nn-¾ß¦&z¢éÇĞ*,¢ÿzaZğ]Íş
¯è *úú0úU{z<Ç‡ua>U]hUÎ>Å|)ı'8¡“…ø¸òÈ2]ø§k ¶H¹»½ä=t9pÕä	·«ğ©*ËÛ~»F(S­7K ¢` Í°¼¢ÃÕ9agjÂVuÛ,g ¹G9˜‚M¼Í	R5Vğlôİ{y6)a¨Šì¢	­Ñwê3é#·‡çQ".g:Ğ	Z1ØâlJ‚ÙsåsÀ´+Ï,Ç<A*vØÈÁ°94‹§¤YÍ¨‘0ÖÜ¨!íiO:U_&vÍ”ólFšİˆH¸Á‡ü[sŒGbÄ ¤±;&àâÇpGĞ%Ş=1ú:^ÙØÖ“Ãá˜>¶+œ`¿»4Ã]S0`Ø‚şìKv‡iµ`ã`úŠØİp½ë›n”dÚîgÄ8 ”xA³¿uá”ûr~±wô÷»H"TùgF?eçÀm #Z%½•.‘†ÿ€Şwb6ì~€ó]õa6Úµ^‚Y¾p_øÄwæÇé/7mñ©¥™5º Bšyğ†®v~½6¿M “-yTqIšr”Lgà6I)°:ta€³Å”¹Æ9.Ær!´~Î%PûxV‘wn-ÀæÔ¸'Ìc¾>vÎ.ìabuf‚:FárEå ´ ]m\+‘Ç"Uà _»BïóD6óÙ\°¹/Õb5—›TÓø¹2³ÄĞGj[ÉÄ“Ïê`apÊŞj»f`OÜE2vò`EØ¥¶ˆˆUãE/
«»³·|ÜİéÎ°2s§qç¯hÜ=£ÉQW±¢§Qœ©OİûôÔd7æwfvofV¸Öt«J">”ü?x(`ıá7Wkè^Õ´Ö,âÁ¦èš¡ìKû(dÇdÚåÎCšzÅ´şmÑ°àpUC¢ğlìQKÂ8D‰G¯FŞŞÕü²7vÍ*¤†£ïßeWñüŠ¡;¦'pÕ¡lKdw}3 Øà»aùÅz`˜ñ£É
xPJÂÆXÃ§¾Øâ×(ıT6Q‹$'4ô¬}_ÿQĞô¾şwlW$#smÁ~›Éë‘ıµ—xãík¦tëw¾xœÀ¥aÍ­#ğ¿8PÏe)€…®“tAØ¶õ&ºÛŒn>ºü¥–¬"{&…bÒ•“ÎBÃ'¿Í˜fºŒ˜»è£“Åşh@ÍÓÉVVò¨ÌúPôıY«ˆ™õ‰tn—ôá‹ŒŠ~Ø­Îãô~–Pì…óp‚™×ßNláË¢ôQh&A¢e¸ç ™Xi%ıtšè4¸%;j“ï«!=/PÀ]\Iò½{ÌCŠÅÄaUmi–£3À¨Íwšq¹½T«)JÂs¶SPIÄ´ìiÊº¹·zBnc…@	Ò?¶	ö ²¿°Åm:Û¡06qşwïUÈ@ˆ!cÉ,bùÒ¾&¸ñCÎsßŠ`Œv51÷öÅwOZâ)t¬!¾IĞWH‰ĞbÎœlmæ¸xœ•cô*}üº—ı†ä-È¢´as)ŒLûë
¹ü9#Òk’»rKMÅ°Ş5¡Œf<‘}>Q•S¢C4?ii&˜Åª™¤ ÕİÇf Fîâ^?x»Œµšâ‡ã{6ót-BSô+.«ÛÍŸhÈ7§c½$Û6 \nÚƒ®0wúïÍºz ^sgBĞş@E/ƒT‘Ğ´G§„½™uü˜r‡‘ &Wãß_Ä5–ÍliQM@Æ;8òçéÎd±S7¼™±&Šwğ*µÂFcŒ3‘6u@€1Š{ŒÆ¸‰çá±È 3/wq|Âï·YãÆ¹JœeL;ı™æ»éáèêpBøÖ¯`U)Ã+™z>òy]~äõ\nÃrké^_.·Ô(!f…¦Ë™ŒÿĞÉ¾DÛ´&¸8zËuÈc*¾˜(ÑÔÁ¾Q²È¥E¸zŸu!²„‚v¡ã.a±DÇĞZ¥—X1µFHu²…ãº:‚<crq÷Õaì«‰²§‡±üa9%Ö!'¬ı4`¶>Ö‘ùFÒQ®ò}Æ‹ãIØÓ—¼É%º£~}.­@"=ÿfú°Õ'İã ç>”È‘àMa[uÖ‘¨Ü»,ü‚ÄR¹WfJüÍ¸ukxz0Ávmå!öóOÅ¡}r@¿t¶Ù_Á_Ís¢™sW€f“fQpZB³¹ÿ™Ì÷NÆÅì¬Ì¶Z¡wl5–E>yÇ Hl	²”èú¿³$nOÑZW“c±¨Â¬X	uímYU7êq+ŞQ €†ø)8%ª/H¢ç]wJ›ßcŒ}[ÿùıYF.¯gÏ'Ó»(ïKìßÚ¬ö/Ææÿ'ÿ|Ø¸ÎÜ:#¡ñ „ ù÷nƒB±÷ŸÙ¿ÖĞûÿÏeúy:æk	TCınbÁÿ À’¿Â…×2%¥%µ±µ77¬Uq÷¶Æ¦ÖFvîìRzÌééIÂÛgİz¨oĞèqIÍA¢‰°§bÏ„1ÃD!¡°è³c"z—IÔ> ŒA¨	80—˜¸ŠŞ!´BögÇ_"`§páö»§³Y:­¸şU¾ç¹´;ò¼˜õ÷à(’éeŸÊ°Ñ#o¿úÑòşcû¨lğí( ¬"<|±»uÄGñÉc¹¹õ8=À °XX@DÂÁ­Ì`˜ÜwMö\üíá0¾Íğ#¬ÛíIõ?ˆË¿Hü€“& ×ğv—€Ê#¯úz€åb“ìıv­h:$58 Á ~Æ lK
£ €X¦" Âhx  RˆXÂ¤†_SCû<¬.ñï_‰p  ßp«ÇÀÜä‡ÿó )“ò‡Ó“îr:É{³D`Å–‚uÀ"%²¡dLBAqÀÉ%²C§«1Içb Ã§ï'>ïğ¢Ûê_ŸÃÏÅ6ŸÆ¸&h5ï§n<æø»Ë¿s¬‘øïÃ6Î{‘O]A»`°ÙÛ3”Gá#ÈÓ\\‡3qXoİmê%ív.ú¿ ÅMèØîèím"èŞ.«)ay<]1\-x)ö³ ÿëğúél[>,!>v.}:±çqÆBã×_>uH±^~á~cYˆ×¶‹d*;ÂIÈæù“~HérèñØC[ÒÒ5¯ır3ğ ‡SöÂh’ŸğÂR1›zÆ}_Ï®â6kœ«@Â7€7¶Œí/w3>¯¢)M(l­‘ÙŸOÖ
Èğ“«Â¯Ï?Í>TtŠ\\”‚Ü\êø…˜-¿^]‡/…Œ½­¶Ò’¾@’Ôâ•-æ&\À15Çú†P@°k8î\¹˜´$	|<À\Òƒ…]S‰“ì€¹CC÷Á`¦ˆ#|FËaSÇS¹Æ@• lĞ£ °Ÿ |mc‹*ßÓ3O+~¬BFèï3yåí‘²sB¹R¿s1sˆ½ŠÜ0F(í“£òëË¨°}99ãUaÙõQí@™rLöõPe(ğ%J½(œJ'=ö—SçíÄ“€GÑ#ÁÅÄ³454u?Éà‡H·È$$2ıŒè;zä"óö²Şö®
—)Á”¡ç¢{
„İÃÏ ¯=ˆ‡ĞÄÅ1vH`S•ùÉì^¤”¦ıÑŠâS)1øqìö%°jHsò|Â}¹½»ı²±Ş±`eu©¶ÓîÉíÄD’&ÜQTÀmÃıÀfq‰„â¢ì¯nmÊÛ?Šğ=U›¦M®L¨ù‚J8b	¿#¢ÓOHN‹eŠ±õ1T²›}ÿÈê¤dÉe)ïa}!¾¤}ÀAÈ'øë"6iA@_¬BÎBµBz¸lkaòô"Ãÿİìt˜R›™‚q5¸3f”T,‚Á€Z1}µZ:‡†U|ÊÅs
:zÕvNd…"ºú^Âps·
Ê‹Ôäuò<ã©v©v}”™<T5µµ|i8-¼æX:PìÍ¤|p^øUèb¸»Y“|ü¬Fáè(Í¦‹KÑ«ÔyØãN¾ö-Í’!é¤;2”ï\º0<Â»d£$ö¬%ì
rÔR2t*tˆ”‰[ˆ¦öü424ô¨jï—§¤èäjLhXQ²À©û)Ú´ÚT!i"4½TåÓlãgvVî4í_<‹—e„¹ªvg]KáŞ‚—¿ÿê”Å j0ÂÀm Ì0Saß{cƒ¸Q]ÑŸşa*ÅòÙÙúô‚ä–äüÃe¼IjîBt%;¾òÑEÓô÷H§ˆH‡’‘é>^R©h,h	‘ÿÿsO:*á[p]+»³ûuåÖë\ÕJÕ¾+ÖU{•´jœ
ÖU0¦
“Šjê«
ˆÒ4ÄôÖ9Öt>tÚ˜šäŒI+æºìZêñ*jÍÔÃÍõÏŒ¢KUŒ´÷|÷ÖQÏ±O 'Èş-AÚQ¥–§›ï‰h‰ª´®4¦·ÅÓDïñ[8>~~pÕ†ã-º$®t¢_Ô-vÜÏpğˆĞ¸ÏRe%G£RÚ¸h»ı­‹-]¹ò2’µ\·-?:#N&-(œI	CY’B…ìö¼‹ïf¢Iæ\ĞÌ6c+½®Ï§”*ÆÑİµò¸â*Åúlùš*÷µ>1ÎC–£Ù£s£b-eí¬E+CüŠü
«4©¶¨…s¡ç5ÿ7ÿ<_
²8 ÃGÅÇ.`ÇşqWxÛ£“6]ª½È«yÁÈ#Ú§İgšËÖa<¿:ë~÷Ñ8Ì˜°o	l?€ìÏuäªÛ5aÈ	”KÔ\¾˜lIÁ—'ËùP\»¸ÿDşZÿˆU(µ Ò¥LàFsÊT¤odeda|uÂT‰©§š¦.Îˆ2ŒThNMÒbmÏá¯ÏÃ³²/´)ì+ñXÀtkÆ›èº¡€¢÷*ÈÁ£™¤òÇ|“á„yÈ„bˆB†.˜®Š‡Lò`rôÉ•Ò†y’Éc#x>-„¥åó–ä/QtˆvÄşY}YS9G‚ÆƒãR[è×ÈØÃ¶1ÚˆÔæê»/ÕÇ…•‚Ê¯¦õ¼n¬@š.²”¤P¸*ƒöìIªLVÀÄÃ¤‹o„	#i0I‹O‰Ã…Y§-e3ÇÃçºîl÷×FÀO)£ı)imMYÍ*ÛÂ4„¶ITà©AìMk!š‰R38©¤TŞ©HmRŸnŸpknY@Â·Ô ·73õVø”ÕÊë5;We Æ¡Di!tÄ$Å„	´5÷š ­°õäş#Tt–—ø+9ì;L]ß™b`…Ù/9¬OkG³çK×ìùQôğ õ•ibÉi’¿ÙWÎXşÛ´Ş¡`ÆÁ6ÅO:OOèOîâ1ÕÊıØŸ“Ó0ÄiíaÔ›Á­¦×isâmƒ ¦ š‘šÃŞÁß‰ÖYOuG	Ù½Ş#±Ğ’LÙĞ~Ã”â>]cŸš™”5p›Oœ„¾¶ï—òrãö)û"¯%G¶ÏÚ6İº÷uÂÆú†ıNºî0»Ôù ÷~¦¢!S¶NÙDiTNéeõkÕ¬$œCïœ³¾‚¯Ÿ:¼ÀXQİÑ?“yK.÷‹9›^]Bùãı½EÊ9mçìÕvmæP;®ö Œı¤m8kÓlC~ekjş=½Á+J)Uƒ¦»ßÜ;Ê*-ÎşÎZR]ÅÇšÖ‰µÖ‡Ùx¯`bË¢WÓÕO”;Ï`6ãĞ×VÕ®«¯÷\§UO´åÇEÏÈšŠ*ÑkÑï ó„ûDVé4Ë[CSQ–éÊáŸkQ'¬û3Ê(¦ø8*+NÙ0¿rfiht²ãÛá½}BêŠlS`sÊËPœ­L³ç7?ã'7“Í%%Ğn?ï÷ãß¸¨¾Ó¾º¶sÁ-/èYïQ¹áÔrrã×ÛJw$zcóªíNé¡Èïóóø/ø”ÿéÒùª*ß%2½ù;‡Ó?Ru­ş!Û£î÷óí5ÿû½œw?oİ÷ü£pjTêÕî3§ñÿ|$¥\4–5\áŒ\¾÷Êªcq Ÿ`iH4ÁßTuŞ@á“p¦9#ôªSP¿·Ã¥2-ÿ÷	®Q>f…¾ØŒ’º:…"R\ÜÕP*÷ãÆq!Y`»¤=Wnÿ2Îõ”? µŒs¡Ò‹”JIÛí¾j-u—¿6»¦ÑWëİedsWàŠªİŸÿ¢Ï2áıó8/ÿ} WÔtş[€
æşmü[âÏäüØñ}Gm¿ö ©yÇºëBğÒ£~yA?_J^®_-6Ñ˜ßò-w‡=/mE<ölr¡áÇ…MEWzO·‚ç`‡]Ò„S~>¨b™İ4¦8…İ6ÓÍüšqxOØéè	ÀŞ<`Hsî&–"¸†ªkáçVÇ{wiôÀ¾’-?Ë.Ü}oøÚÇÚs%Ã>€} ô!áŸ6d#Ü\"ÙÚÑÓ1)ş7mÛJiø§Ï.g„ÑFª	—‚Œå.óıÆÓ@8Øğ"‰¶!h|°0E]NxC„*p=Xâw¥P4¿Œ2$ÑŞ ˆˆõzÍ“¡çcq8?+7éµõ0ÇÑFòC‹«=¾ş4e*«AÈU´ä^[­«ß•«a4Bw
30¥£Ö ²¿e´ZíôìHn©>TêÜcÚ‰†W|vÛ¥bì¼ß<KÆ3=Aİßº¶Ÿ%°ÓıââkÅmı`èş›ààu”XÚs¸@Ó*›Vfê¿5§ñ	´§Òö°|ì,ŠÑ6yW YBL›û)‚ëçJ¯Û%$@~—”–ôüW½1(»’LÏª1ó»Ú†U”ÎBk‰¿rGHl‘)ÃÈ¯oŞo°÷ŞJ2'kµÆ™bÚ¯Ûœº¶Ÿ]%„¦O³¡ó_€`l•xPëxx0ÆkÕIc79„©b[!¡ë>¶~‰3…% ÙñoåÖµ,§±V®TCàñ˜WLÚ»eñ"^Bü<IR»>‚ÿ:Íµ
ãÒBé`V~~Vğ·ïmÖöï…¸ì$FõËïµ§=îÃØOĞW×œ×¸î]S-¶<t%C+¿c÷kDÄ¡1úÑüÕ„ûœömõMéJC-+Â¶fjÕİÅØ›øCèv{²}?Ë³ĞÁô‹­cOU&2iŞw_1jx|"üïò¨ƒƒEEâ´^ÚZy›®+ÍÀÊ\)L×”u±i4J„Ç¦û©lCp^?7âS¾*ïz$e±/¦{™[!Û½«œ2ui­ßsÖÎóT_¾´jÑªpz–ù|g‡ˆCPî[rn‰°¡ Ã1Ç¢9“ìÂ”Äuàîµ‚û=2Ö±k)U§LuÜíém)kÜÙáÓ¾j°%Ñfº×ES¹ñ%Æ÷_¤ûo'$ÜXPú)¯õ_…ğÃ#øwÍ2Åâ…¼À¸»mÃÉàéÓ—‰K	ÔŸEZƒ§ì–ÕğuÛË1ñázz¡Ç”ë:y÷#ïóÚG7{/û˜>‚7IO2+ôiô4
DÈ¬y#¨næ;Ó¼éˆTy1[İ—n /`˜/#táP{7iÛç´Zó±`j¬\ë§O£Ç¸ÕŞ*ÂµRÌÓ'MIy7©ñşùò2”û3T™|,D˜
õ‰õŸd8}U.ÆTã´oí°¾øK†fË‹GõŞŸ'‡OÄ¹¾ÑHeÃƒ]µaêñöí#-ô ‡Ë¶È
Wr…»À¸<ÅŠk¼x­• »f&7K:sq+KæS¿² oò¥’"XÀ%YiğEõ^cÊ‹š£ÿg×pçÌgk=õo‘:æÑÆı¸-öÈìŠcïÇPôOú·®Aû)íøßü¿7ãNZ9ÛÜëÎwl0À’$«±)„Fò‰øCòÁ*Ï˜-¸·LÓ
‘ïxl¸üóŠ+èİ<¨zî8Zş[Œ+Ö"n”y$—Ê)ŸNn¯·Õ}?ğ,÷ºá²Ñ«¤E"ù©µy‚Y÷ŸÛL\ùqQ{âó7cäò‚cıÎf÷9¤úíSV÷L5^Ç­NÍ/é®{ÖÊ~À¡Ùìö¹lÙKúù~y?nÓŞ!@Bæ*rè ì'yóx† cj.WH-Rß)“§¬®¨ŠæÅíKŸW% Ìª`Q‘aÓ+Î–È¾å[o@*ëÓpËMhÍ°Ã=.úJ
·K¾@­ó¼ti°I\ºşé ~Ãçìÿ”	pæë¸‚ü”nCa§> Œîyó'V˜Ô’{µèÓç¬¯¶5fòŞO/ëÈ£rÿ<ÔãÿãÒËSã¾¾n=ŒsDñ5®«Òo0ä¼ëİa=AÉšZXD@Z0|öû™ŠØ?ô‚STg»f_Uİ>
hız.ƒë¦Æ&‚J4–éNïœO#eWpÈ¢´uí¼¨]¿.I;Å6æ]ÕoÇâõ¸ã<âóù®ë¿÷1´ö_Ô^}µ\ıÖ*u\oÚ¬ õÓØ™ú$î(¾Sq?‰ßÕ*³!,üÊç>†ğ4E<D0ûK?ñ‰Ö‡x¾EÒÙ[a¹ÒŸ›ß"nÉìq]Gê©ğØ¯¿|Øi¶ªq,Zº~×¿Ë×†z…eÃÁ¦•6¾‹1ÚŠ£„ß †%ø®C€¦®ÛëËôVU@¾hl\Æz(¸äÎÏ©°€Oø\Ì¹1),ÓÀ
~ºÆ;ıF7²SëF×¤ÀÑ®à7ü>™Éİöí)]pK;…AÇÃûğ]³<sHÚwÿÏâàˆC„­j¦RÕÒß0oñ«ó:ñT‚•óí×o¹yÆŞœ§pbc1º±•f;œÚ¬xš°?æIAérøÖ]£ˆp\#îöƒ§LwOMyªBW <”ã™ıï‘N£Lÿ‡Œ1šGv‚ÆµAw tÅ½€Á8†Tôı•6A²É/1ğğù’J=eXIb(T‘ò”T2åêVsÃ¼F7u5Ë–›VÒg†cc4ŸùÛ]Ü4B“eia`‹¥ó6;-E+ğ4ŞÓë¤
y»­¤íÑïõíù‰í`6¢z½œ°ó–yÅ^y;†2CºLÚ¾{Uô4!!‡kş•“é&ÊŸ©­µ`][Rxlö-9ãá—ñXÅëÕİËÖŸåA¿ÇêÑG³dIt;¾‹KÚÜjå9hZ¬÷;Éå3úĞÌ¦CñcßPs¿+_ËÄk--H´Ñ|<mk<‹zü¢ú~†›®rÿNãO%ŒgŠ3©åws×H\[¿oıßØj¦ÂÒ@Ì§7o„L·êe¯aĞÏvæâé‹ŸB‹‘â+{c` UÏbòŒD«åWc±vSí{ÿ¹(	³iğ˜¬ÓÂY–úK*sô’*PÍfK_Fûª·İ>ì®¢~±.G¸´Ô£GÚä¼-Ê-w¾xÄX16¬j_èÍ‰ÿ!š+Î ‰`ËW:šôöŒ¨Hõ·u.6DqÎ\¼ah{zŸ‹?à "À×½ÿU—ĞYöÙ[Ï¬ª Ã”ä‰Úßİ<šhˆ`5µ^kN0:?|¸?iêğ`‚/CŒ<’›ÛTÒ^É±Ú~~ó#’“*j3õ¤‚ŒnbœøMa“ÿ£Døµ»Ğm`{>ÏğASu›×øË¿yÑgßùyéjÙTİ7¯\*Ù[Îåmp»×ìÒnñDIR%µvÖ#úâa’sï¹L:ÿi=¬@aw†âj-iäŸèô‰‚ÜBŒ½vyOwô°dŸĞèšU†¦cRó‚'#]Ø›¸Kì Ms–İùšUÔLVrê¨Ñš"ÎzÚˆÏø‡şÖN1²FšíÇÎë÷o=n‡ü#‘g)M<Øzñ£÷FIT?Ô—n:Tu*ò0|ÚA]S_¦ĞQ*½(SiíÑÓÆ³N†z-ŞKÙùŞ‰Æ¿çÅJü¾©ÑŒı~g¡· ­
$´¬W´ËHÚè¹~išÁˆü€KZç ÷2Y†ùŠÆ ¯Úm!¯¦ûªÛÍÉşlëôóªŠJ­ªß¨¢¨.®E,ôFà—cm-ÿËLºšc;‰Š—hÃ=6X6ÊÙñ'KbCj‹õ²®ÜÇúb»™Jm°™MÅ"«_ÓŠŸÌööÁÜ·Ã5E¶~Ï—O8]Ò•e*“Š’u?š<®JcmŸV]È ’ nB<}äÓ¨¡*^•³ûOÿ=ÃøLÃì
Š
ı…‹!“g×… }²sæá—À™W\Ë–jö\iskÜ7&°ù[‘zfÇjDuiêÛ¾¼8E¿İ‚WÉöæÚ/9Ÿ¦|êH´9Ø§%Ø¡ÄVíÛ³ewCáìiø´ÃœZŸàD\ğ~]×‹@BÀn?¬%nLEÀ€¦„(‹z³˜GLP«<A-ìø“Wv`–P”Ààa»sÙêÓ+ÜO\Ô§8ù$ÿ¡ã•¶!Ê¥]y¡şHz¹KÜ,J¢„À»1§¡ò¡º~A,İÆ l¢â™SùäÕÂ¹6û‚ªU'ÂÇh…q½L&Îº†‹+-QùÛu¼¢Y«¼‘0µ„Xª£kGı±›v§ÿ“y‹a¶ÖŠPÄ6î–7ÒĞœ®ız/‡‹Y¥îw!RfÄ@˜_ıßD:T«‰ê º‘‡Àc¼tÀlºîòŒØ<%k…ğSİšDzŞ^?˜…+é¦iûÕBÅdşI.µï¢ù«ïü<<×[y{:·¢uÒX6ùf•B“{ 4õÎÂ\Ğå¶ªVÈˆÖ…øR]¥¹‹9‡»ôÇû½ÒºûbÈÇcPñ5d'gØ’×‘ º·óyG!‹EyT"=¯_(ñLŒıL,²Dª\HÅú-$6øCê!õ9¾ˆmè/¬ú-`œRÙËö6¼Ÿ"…ŞKk‚Ñz]]q­ #`	 ’—3ş¼1y¤ÎîßÙ†cÀÚóì8ùÖÇ Î´5mj˜éH^ÎÏ
ÓîAê—‘ËÏ>ÅA‘d&#å[ÖïQM;-×™—’ˆ¯è–ØŞ?j=×\^­f<…¼èD¼YÉxkïĞCBê„k>k‘<¤G„oC;1½Î$ßo¦8­Ïj3ãØßõ±M‘ÃJå1ª‹Çÿ8¬°5øüî£­%?`RhĞdSÆ[yxÜúÃş1oiX³ŸEaÊµNYıöÒY	âòD²X4‚®€CQ—ê`w1V$ráB`gn
Gàß¡òƒİMj~¿U»3­š({ùPšpí¡ÌZÁ“E»ìr®íõ	Ç{óéÎ?šÅáÈïV±¶\·´£	ïB)Ù*İ˜“v®ë]2Ú™¥h;’.©Õ?“‚‹Î«·´|¶¹ûãiQÓãkÿ`Š#˜nüÎ^;½–óÓo 
¸(ÇI„/µA¬»È§ÅùQ¡z–½ö´÷ıZe]¡ïİİ¶-Çg½e°ŠoCg»m=tjWìx ’ÇEçÅT±x~iy¥y+â¦çYÂMÎÌ°i‹AÍqœäÍ•/SÚ³ÖıËØMÇ5JkN¾p
©œ’AOdÂQ:ö‰YNlÿÚÖ-}GšÙÊ\ãàşúûhò+©ˆr•Ñ$ÛäŸ1jÜ.\üpñ‰3f¾—”úÅÖš~;ïğôı÷H0WæÚ\MĞVqˆA >â¬ÑTQBSÜÀFI’²ab/HxùÓ¥!,+‡œĞH±y£Úùt*·	Ã(mb¶àâ?.U¯Ö‡Ägá‰P¯¨¥b^¸tàVÌ4	ˆ	Ì¤êÊ•¯<>üy/!ŞKMîÖ/¢"´‚a:ïïå˜(}uz¨hë#Â×rÒ,òş°¼ñVÍÛ²†G«†‡MÉ*{¼¯”T}_-vÀ‰ãN¥¯mJR¶†GîåÄµ¢Øx3‡àCÍ%M‹+	AI8=îVÛ2~Ÿlşnk2ŸM	¬¬ÓO¦!É¼Jğ,"dp³êeÆ:€¬üSeS×ŠpÜˆN»o7M“l“-j
d/Óëóá®œ°$Ç-ù†ÌyÕÁxİò{¨1´?/,µ„
È§òÕ¾½¢]{‹h•!hZzâÿ,¤-qtT8Üí3Ú¤\I’RÅí}9{Q¨şB@Ãı§>)4—âÀTëdÃ-«~W„Ø»µoœÜæ/°Ä,ã#w@ì_,ö<+ŒÓOZ~¨`^ÏppbPQTC`)]-§¹
	ûQºô¨švQ³"$UqtÙí>åÁÃKíÖP8ğõÙI@u-˜Fñ¸×•Şâç2‚,†(©«gÅœûM†v(æv¿v–P‚âA‰`Ÿ¿8‡}o&/Jƒu*cØš·¿'\£ŞsQ¾J¸Ä‚¢œyÀ=,~¸üş_ÜÏ¾u’­p_‘›~jX^øÆŞŸWÁlÂcÎeğP€[|5ş,qO¶×
¿;¨ó¿€U·²İ_Ô¡ÏCn23J;Éc¡F¦ˆÂM —ÂK?ºxdw$R¨*2”¾ÇÍ ı Xæ¾vTı
ÈfV6|î²´ë»As4P”m£È«6CôÇí_æ‰t•©Óğ:…n§õüÕ+ï¯QI!G^ú~ÂµâÊVÜur¨(Û»|&KöÎ,.óxláÀrÃPX4ß¹…uAÔÜ=[…É=
	H’àXãŠŒˆWÁ†iø)õn÷è¶±óïUÉğÈ¾Ñ")Û)X_´ÿ
z†ãOñ^‰&•Ân¦(L%„ o
!¶ùß¯"š%I¡²<Û\1œWKZãĞœ©æóÉ¾"špSÆü¸v¾şĞ•ãÀY-kıEÃ;Ú`÷´»h·ÕÁÓÔ9ç‚[ØÈz—]ˆûT¦ûóè¯ı61gr·ªt€ŠMåœÏwG¨y$úhÀå’‚&Ø#Jàá@Dİ€fè¢t’ü(gæPTFÙîr†R!„÷ñİVöËZ²>Â:æİÙS3¿Ù‡‰.î}%[AßTãüëö<ïjôk«O¿åg·Ïú–MÉaÃxïÚ°ï1I//rNÌ¾n€Â¯h\h¸l‡xÖÎ*†äD/L@µÖëv$şKA4†ñ‡-wØ¸§¿˜¦ÄF‚}kÿ³[±^cÉRO1ıo4pv1İ.¶´àÚkç½ëëp?Œk¸š…a\`d‘‡òÈS`µlPÍ J%Œg¢0åÌ™šÜp?îˆrš­æäy	Ëâ¯|›%1–î$øeĞ/BOÂdI øafz8üù>ªşë0Qõâa“`¤nÈ¤w£¸5ºHT8zîû/!eúyTiÛ_Ñ Ş&˜ó¶IÌ]ÄrB?ŸÇùw_«E°*Ã‘×‚‡nD(Ü›¸¬`ÕïAı= ä?òL-é¦OqbòB’‚I£Ğódé½:4ªè™I'Ä¼ÂëDúêVíez9ÓiIvgã·kª3¾;`™ë„ÖPëã9}rd.Y0lsÅÌIÏr5Õ'š“½úª¿á™^œ-k[iø¤ÛVsÈô$ù÷YâyS	ò9Œâflªùı
F“èG®›‰+>o(Òòkgoú/:ÿ2oI{âÙ¸&ÄØº*'{>„Ğ¯Gâœ4ä%ôHÃBJÆˆİ¯f! zK¾ŞŸ­GNu»ÿ\®NÔ¾=qÜ“*Î-ÊY„¦›ĞÈÿÜeQ¥)×9ÒpºR½æY‹+&/#±Lô¶Wx·XsWô™
±OÌËWc­,©5w$ªmw?õ‚}qÙÇm,Cr)d¡9Æ¥÷Ì¼.öô‰$+‹®2]¼$­hîM¼Nâ£ÙxÛQÙ©ï0 –‘LÕEz#ò9 óÄZ¸Nœ73gRåE>Y<Q­ôAçÅ0 ès7AÛT¹³ [K‰<«•ĞjÁ¬ØÅœÙ¶%®°í%=`AB7%şØä-º¤ãNî÷}ËxŸÏaÕfD¹Ğš[ô¥ÎcpnÎò½Æ¬ıaÒêñ½³€À.=Z£fıüJv%Ç2lîxŞş:K5†‹•{n÷0bOöT{Û‡!¥¹ “SÏÈíäĞïÂF½€1Ãé¡hê‡•Rê((!q÷tîC{ùMdàˆöÉ 8oèHùå"û]Rıó—ô®åı{¢Ú%¨Zl•ö€¢ğQO]'1=Ò[ğî×="†Æ 9[£¼ş`Û-Ê¾‚(ã>¼!äÑ’ÿş ¤–Ù“.ö8‰|òôäê…ª‰)º¸f-ü†ApØæB/>“,tUE×t¥¤ãàÉ¡áÁSªfÄ9µğoU«)V5èFqÚU$a]ÔIçä„?Y—îKü_:¸ããŠŠó
¾Aú^3~:y‹\ÃÉZÊrèd)s»=ÙAìH…"L-şf]$+¦a
†4$Ô­BÆ§>MÏ¾¢ÓÒO0ŒŠØËJ	ëÚ¿†_Ë]Zõ=w»—¡¦kèQw¤Ô#üé"”uš]@Ñªi3g:O…Œ§Å ‰JÍ è¼Z ¸ZŒ¤ ã2¶§HA¶OØÃ[qè¨‡µè=*¦ÊğÏÄìİp4H££%¦<S;'†MM$Ü}®ïíÍµÈ‘·Bïºİ³Üì÷ËıMÜÙ‰ÛÍÄ]ŠBÇÔp¢¡¹zgæMÍ#!Ë}	Å’¤áÅ©M€ n©aF3ñ»Ş!ë}Şˆ²»?Ğ6fdQJ~Øå9\»n{5F"]ÉtJ‹´>S·ŸC×È!ğœ*¤Ír§Ä¼Á÷zXuêKŞkW-ŞhÁø4‡~"Ë!–?‡ü%[E3®j¯,"£Ñß?2€B¤oøßß‚éB7Û«xFäİ÷äØs$õîÚt‡Ï¦ˆÀEÊâ­ôŸ)Ù³©´SäÉh!É“‚ˆŒ ä¾‚—Ã§ù7—ÆÿPèÊvp¿R‰xZöì›ãâó:w`,^%lNÌj¬•á±`Z-bDpYhBÇòÂCÚ°‹â|ÊTƒœeÖóÎ,ÛÑ±pMjwud9{¤znyñb|«Š’¯´¸oğ9DÈØppQAÅSq»$»Ñ1ÛùÒ±›C·å8¯mâbßy8\¥Ÿ%’çÈ‡@{4ùˆ»İYñ¤¦¡ÂGå‰¹Á‹(—qê»±ë8ù¢=°¼dPæhQ18B¥!Iñ !;Ö—/oÅî(éŠ>1xŸ~#ûiX•®`h°ò¦ÒÕaàMÑã§,Î–bpşm–dy\ÿ¯Æ|¯H 1M:„(mL×ùÄDLSz~ßTgä'KÓYsOsı&HŞ®"aPJ¢^ª×pT{T¶Û+^'¬\ÔT8‡‰—Æ)s«8½
 ¯Àˆ@P{#ª= ¢„«ğè¼,‹8nö'èú¨DOëTóŒ
>ó¿Ğç7)ún*–4úøJ…;%¥µ­ú€œ&GùƒóÃ3<¤‚2Ãï<vrÒ¢5óÂ;Ğ9¢â%´ˆ meö£‡”â=Ê¥ˆ6–î.¦5Œ=‘ìkSÑp@¦İq Ş€ÿìª€ÍÒÑ¨ïJ§Îã_úù4Ò¯@T."é2}ıxàH¹ÛT<æÛ¼áÎİr5¥®¸V:ª¸Lõ­ñB‚Eª¸C#Bà””ßMÄ‚)¹“
+«Fª‰k,F}ØŒV*iK÷'VoÍüô›
øƒ˜äİ’‡ƒà×ñÖ5	~ˆÇyÜ¬ú.aäÆ‡ñø‚ŞS,P6_bºğBf¥Šx’œì ‰E áÎ'©øôgMÆãaIïKï¡âÍ`®ın„¦ÇW¢Úé¸`\ÄûÿmÊş_]ê‹‰2V:Şû½‡“RÈí»OÛ«­’>­
£=ü«ñ«Z1 wçè–øô¬¼qKqP%yÕ"Ñ»ïÆ3“àGñ´'mî§Ä8Ná4¦	6_é·ÌŸLëYöx‚²‰8÷}ÌûıtRN2\š¿üÆ@.œÌKQ-Qn¤s/9TÆÔS…Â=ˆ„9ì…Áši÷cè†ºî±/ş¥É•µi†NBòƒk³A9ß»h÷7šç¡;Ø_Õ·ª ôKƒyyş;¤g/"ÍÎ(ıµ²¦å‹÷+­º›Nİ<A
Ì1ˆJ»ùìP°Šm»ß³à­'l
ÎôÉ’V1€Ryi±XwìEwêöœši’‹ÖËÙšÉg±ÊîZ¤!»Ìlm7;\4Š|S£½æô±Ôˆn"õº_,¯‰@À©©Ó¿r¶Ù~‚şş]»MXğW¡<İn«ŞyNwŠ˜z±k¦‡,Q›%ÁÔ¾¶I³…zÇõçõŒµ1SĞl€õ?mDm¢Ìè>…²p—@AŞñdÕQ*Ïœu·‚6(ÕEŸËİÑ|Ù|¬*ÜHÆÆèßQ4sÔkÍ@yÖc?L¨ã}²yx<…½»fº¦¢]×Ÿî#ÏÕ«	—QÒU“ØJO@nWg4Ö‡@m‘4£ø">>¦e´{Èl‹9µİî3‹öŞM ?}‹İéöÀå^mSRë€ nÓP'CC!«HæO¬@FRCX‘;EûÙàÜ&Jê¸Q2l. BC¦%†ç2,?ê¬şŒŒì"|œ¸º9gW´q=d*Öæ_›SŒÇIùğ¯6XCÙˆ–ü\xİkV$T´mà.ëÒ)kcZ9êV+? ^¶»á2UHø;ÿìbíıy@AÃCYHDÂwO˜òFŸ!ùv½ß/–¿9¼Ù3Õyõ¦)/ì °lÅ»!Ô¿kúëÖ8àÙÙê-]1å­ĞÕ¬O~ÌeÕ]‡zC¹éu´ˆ@q<KÌñx&. çZ7!ÂÍ´fî¸´Y
L˜Óìz4ííyw·™˜ƒğ+Ša&ÆG‘ô“SÃøzrP‰I:a4±M÷¼eø¼ {fNy`±ßíB¢±÷Ìcùyº? ¯ª¹ç¿WŞ¨K•]P¿›»‡Ïö´S	„Wêê-Óƒü	ÙÊ`Önîå€¢r¾ÍK¥‘#Ş]_Ü(Ti’İàÖàGÜjÔ¨Z©Èw¡èÇÀÕuôÀøÑÆõš‚‡ Í¡9Ğ[s¿~ƒx.ù!O‰…b8*Â¡Y©&Ì:èáSãmL‚\í-ä³ŠVJÎ_?Š÷+ù‰ÛåjPÿÉG7ì¥ñvÎ}ûåpèo¬|-‘Rœ>µÖ¢oQTÆÔİ—‰ë6EÇêşÛ;ÔÙfszwPre•êg³kò{Ü@LVÅLi*R‹U#VÁßï°êDÂÏ³yHòú$j”£q>5Ò­s2Ş¼üBT_‘%`ÊT}‹àÆYšÅ^öÖsHOk|>g¸ß	Ö«Ç­xâG’õ™¼xÄæBgã´î+{ûåi´—Mò‘OKøÂx|^ ¨ııŒ¼íÎP«EIoeÙ_1^c)D	å\ÏÆt#IÔå‚Ğ®qö9WLK/Çß–ôöãƒDƒ’w-Á“ ncŸâş0§›Mğg^öp­™jÔ±C/ôl8YkåpõâÇ×È~Ø7@²L…ï4ìIße‡˜·ú6%®£D]¶ßª´«0Ìb9Næ>Hë–İÿf YÕÑ±3ÃâhXÿB­¡Ó¿Lÿ»•:A—mr´:Ç ¶Ì3ø|—4ô^j5’à-p#¬¨:*/şâŠ'+ËLÕßª„ƒN‚U&êOÎ~˜‰Š@ÓıÁj*/s:7{“şª²]œJ¹Y8^ôaû p’Iu“>›È½‘¹ğ¨%" gŒŞª‰•.äVGY#hû™ßqÂh¾Ø´Á-R÷ŒlEËe±´ Ñ=I	©"‡ÆZàGDvÏÕSC©ÈnåëföÂ>ºFô#"¤t|jo‰µpå%…q³ 9c±êGøÆ]è&çõ¸º>à÷6Í6)~Ì¾¾”Br„WÃUÆµ`é œp«ûûLjöC†ˆšå®¸†û¤BNx,¼hÒ¦®»P-a‰Ø¤+YeÛ¿() ‚6E{$p¨†¥®Ã+0ªt€ë€<§g=ÉâÖM¶zuÎÙfa]*ŞÍ1™"ÿcúV—¬v('ñò4
 Xf\	§_ÆAf\¥Í×ëEA¬àğlMÂÔŞ«DhYîf_fñâ«-^¬l’K„ûQÎ“èyö0·ˆÚªKÈˆO´Ÿ²óU¦8ˆ‚ëÏ'€0§•Û¶ô`Ú§åÔ¯S“Bç¨H
% 7qöÏèy{Ë•€#Jc·
±ØœPôA>-q [­uôèõ€}ÉÀòO>[Óˆ‡ÃlDv“/¢Z]ú£qJ-šÓ·Z”„PLí=•s¤ıB<¢« óƒùüñÅœä}õ“?NBÄVÆkŞ¶¨LZã²roùh e1â~I`L)°õó®Ê~%_¹Òo l,Ó\w"S£ŸÜã.·'¬ÙA¯Í†dK^·T`C•¦‡EûæŞ¨šš°èIêš6Âú{bïìĞÅ‹ËäP/£ñ®6€ı±URªÏg^|l~»Õ´ÓDGáê¨„"ô¢¬?wE‰6~¬ql³Vl«©&’€oûMÒS¼QãPöø43&AEÂÃpwô6y,ôDÌîºÔıí®S™ùA•}8“vbÍ1JÄ÷èWßˆÆ–«*¾QrlÅöØqşJf¦¢eÏ&9ºŞ «ˆ&Jğº¯!»yWÜ‘Cn½´GùÉâˆ]ZskÜQI8)¨h­Ü‡k•Dšn¾{u*?¾ÉX6¤Ø¦¶t];GP2Mw“s¶\U¹“óãÚ°0İÆ~XCOM°_ïo†\Ä'÷ÜÄ}lº4ºƒÙÏLVåÕŸ6pçÛ”W+Ù×~¯ÇgK±Î„_ß¤%ÒBpp~(ÜK.jÀ•ßÄoë­œÁt‚×ènvDo¯“ÈÙ™²ÅáËnT;\àoC©‰<”ha>" ˆÖãvI5ï'}3¼ ›«ÓÌ±œ8k·°˜I{;rQ"Õ1yçÇ·FşDF™b³ıéêÈ1•nlÙ“tÖ×¯œ?çªG0œ[Jš|CtM[CğÌÇ´»®ÉäîğÅÈCi»é¸Æ4oÚĞà²`¨Qìíˆ}Ã¦ÓøÃ/:ı&^n¢CşÂ½>Ù\·ÉÇÏù¯YŞ?(
]t·§éš>Ù•èRr æ¤üï!jX+è)ær‰ «ÏCöy…	$gœş!‹İ\)‘W;,$X=Ñ”D+	seXî^¹ºÿçˆòÄGg‘.L½æ[ÀKMn9(¾ƒ^nşä%+íGµë`—‡Ù¯0¾ŒaF¶“Hp4†„Z¿œ`ö…á¢(\“Â¥ŠCŠôZ¿‹	›»!{ïo5É:„BÎ*’(éV»÷¼DM9xş ÷ßL@øS¹Z¼ŸZy<L/Ì´ÊÚ9Á¯ìí#éO£Ñ‰ê#t,*oÑâ°öòÖ‡…*Ÿ®lc?¨XSOˆ u£™¡vğôÀ+¨ÚVCÌºĞö±<Nœƒ.>,€_„ıG'¨ò}˜
µšMô°¾Uz ªœÀfİ‡	·E­z…x…0‚÷ZfÎk&ƒ{E\l†jZhı×]{E·?ÉÙÓ:™r¤µd½(tÒ×.¢„ïuR=<†3aœĞ—õKtÈJKb8ó,½‚ßåj¸èÌP‚T%ŒèN7Xª`™
Ñ]›óR†ƒ©G¬'/§æ¾ºWÌo`?ŸÉ­‹l'*Ç–‚.
ÎQÛYBÆ]r÷>§êŠ>`áš$*D™0ïb‹.â¿¯©°Î¶CÜ±‡s0š€"£c¶V~w›ÈÁJ$†g‘‹ö(²kÜ«÷šé7R»cóm¶\%‹ šÚ ò»(ï<ÍRŠ
«ÖA¯[úÊ0º~W;MA ]U\•Á=Öë‰rzJ—­+$›%ÚŸp·ÊÜ›´q…nié¼#„CM´e§^µÏœ…Ã\«]gÒ)ÎøïeVÑ%Ÿíâlx:ÎØu¯©ùGHÆÃ™y‚µzR\o»ö±ı	=’•&øÛ|s>x³;Í '‘¶©Xáá+ØşK	ªÄ÷D-µhÂP’ô²£Äc^D‚bÁ8æ=Òfµô—¬aB¥€h0«±Ñ^Ùà])ëáêÄn qQVŒåXà>éÉ“ÁÆDÔhåg“
a8|xqùXûœ„Èmdğ3²l<w9A‹VY~Ô¢îC½J´då®
‰É‚HEL3¦‚³—_Œîc ¾¨éè\âÇîi;ÀâS8 t5“—3u°Ğ6*¬šRC+/á1
B„R æ rr|ç§Å’RóRcX²`(ç®{DC×_?3*è®Iñ¢¤—­wâìµ'ÑE|n«F9,Ú4¸´7(Úw¤¬H;–Á²7ò:9óëraĞËëPòöM·nF“ØûÃÍxE°™PøÀ}ëô”¨õPêRzòfÙ!¦÷D…ıóñÌÛ¥‘=U§¬úõc§'À¢}ƒİ
iˆWôWas?ÌGGSÖ¬Iÿ×ïlúàXHí-…ç¯«6äk¯	' «„D…¬:>Êì)Œñ%Z“ÛÜ!ÙÔKø“D_­×®4Oô6MªgÖ/+F!ÇÎDŞòiÀ™4@¦Ó&>-éÃ©çÃjÖ*îEç‚O|f/Hã~c3c…Ğâ(é°×=Áı~\î¦yôQgÁ¢È›õëÎ}ĞÂJŠË³ä\ëËÚ¤n„¨ õø22pß¿ê·9-8ºHäe{	;ÅÍ#ğLUTQ@$Ô%›ÌòSÔNĞå“3M&öÃö4ÔÙ—,P$‹ömNäöÂPHRXÂ¨V ‰ÒıÖ@]ÃÛÍFğƒlüX™4-ª%aÃ±ÊUÉßs`[hÑ¯¯rP•X„Lá{Øx7TBy¡œIò>Ü…éµØÙ4µË`F[°	(Ñé§nÃ#ÑO7;ça¶L2FR=ÊI=Ö¤,I#CßŒ­u;»Õ}gé >QUdG2C¼ ç•¢"µ‹…
L¸{	,Tkáİ¥}  ¤é€yt¨ HçÙ8~Ía'I¶ÙÔ°×,#Ïª_Pò-¬\ëâ*<İzSÉ=2Ø˜°ØSÉYjr jF@)ÓM´X5$\½3„°Óhäp¢<ä¬îI¬gñúØT(‡¬à)74»hmï†ˆò‡8¶åXç¬*DÄUd0B¥ğî:úyqYÎ–î×ÅÁ¾ÂÍ¾İqı«–cÅë¢e´àÃŒĞ8/ˆ(ª`é7;|‰M}kºÚ2×¬¦Ï¯’K˜Ùı"\iÔv/GvêtÜÌ²gQQrØ\ş(™j›;:ÄƒÓ”ÕI¤Úíˆ	ÒH_K¡O£ÙÊŸ©ÛP)$8HH5'Õy—gºnºÙÓâqba^KålÁÒÇPR#´¸?îÛ“ŞæƒÏëær¬Æ²ÜÒñ1>9Ã\« ÎV—â¸~Õ
ÊÂ6Tàd^ßÌ6(æ‚!ö¢å„bí5¢qÀƒ@*· OCè+®>[£•ÆÌAî<¾lš	†Ù —ºh®Ğ¯á?Ğ6€£˜¾û€«I‘êÏá5#ÊpÁËIÇs­ñó}°íÜ /Õ=Î¶b_¡˜ç|NŒ6Å•¼ı)`ğYFØüš>R
ÿ·)’K/ëƒe<ó¡¿G#»Y¯+Og€z4éÂ/rsG?Ç—ßŒjë³N©g±ü¼¼ZMªtÂR	w†æäß‘!tøw«¡ñL?Ñ,ô‡s®_· ¤ß»Õ5÷N‰½¾¥Š]İŠ³"âV‘(È±HMI Û¶¯H…È>NÇ„h€äï,­WP9}Ì¾öİÕçÊ0/u†ÉRÅ+¤@Ô¡·úî²5Î½"ÂÈÆúş@˜2i4çAÙÆ1¨¶B©îÚı	(£LøĞ˜i€A~k¡Â5oiˆû²ƒv7XİÄ>{XÙ˜Î¶áz8ò¶LFt»Û?xfşJä²¨¾,ïQ^+O7DË¯î±æ:pÚÃU¡ÿi®8¥x-‡Wà¬vKçfêN™ö¿‘ñ? Òès85ÆÆm¨]s…Éd²'ùĞ£>'	€XÜ—‚ËØÖ­ÏOÊ	*Hhşã.­–³5Lì¡¿Y¾·d­¦«À8ÄÔëenaa¦úÆšªî©©àÆ>×5Bt=»d›u\ò,Ñ:Ï³YfüÁ×Éüâ¹ğéÏB3ÃŸu÷ü¼Şºa4gí9&rleÕ[ÓÓÑ>iÄ*M¼H)2Õ¹ÈøúÀ"7Á´Í ‹c^v}vıÀh*íû7”„°Ôlöèxp`‚I?,Qvè‚¼fÜÈêLÎnaCüŒ"Û:vVl(raÂ§Ú<Öj&Ñ}VŒ8­&…ÿ1 7µ1Ü {6	>{MñYi:¥‹öKèaBX	È¼ºE>‘ÉÖ¯,wqè&5C²8ëóG>ÄDÃë¿ı®ezæß5ÆyEm3¹2‚
?Gp‘U4:âzBåöêQıƒP÷ÒÉ:pÁøx»çqÙú¾1ÆVÏ”HH-_™³Ùä)	h—?Gê„tsØÑ¡‘°À†k®¦×gI¸lLîßƒ¨×uÛ´SFö^-_« S=š¸íëÒ{s()ÚA»éˆ©¯^«'®õ)3Õ¯i§V´#3cÛáÒôˆ¬£a¦õÇâj(«ã'¯ÓsãW±–Iönå¥÷*
®Ûºƒqÿ¹¹›íkMŸÁm4é_\ú¿5ÍıçpáªaÿÕ•ÔÔÿ6*[Ë	•ì±º‘	Œ‘<c¶ZËCqTöÆ…!8B¦ |À‡Éh="2^©ØÕ$ÅzªÛd@T$ƒw»m#_ı`…‰ÖO‰ljEñI;CP;ûR’d£©·#«Sp' ”ƒ½§ª	""‚>b(j_1µÈrµgã©e–³98›ûs‡oQı ?A|Œ"Ü½GNıÛè‡œ…ïçÂEnÀwûö`-]¡€»4\CC>kâyT]L¼23KŸ0ßdD©¸/j2Øÿ•_µ&ˆË´%°LKù ¨ğÜÈ?rñş}­RŒ½G.jóJ:4&3aÜè97jKæ²3}`á_•5UjL¾îv$ R°°cI@½ÛG~ÍbÂ,®³ìÄódò.CkNI<—üôÁ­S\¹jÄébÚR$î]™ó¯ß9{…ø~›I35€1½umu]s¬zO^ Aòúõ&ï¤Ş7rş›33â:H0¥dÑ™ „'¤…S”òœ0A¼ÏÉ)¦*äÍ¬ÄtÆ š”K¢$íÓ¢ˆ%)úUÔ_3…‘>ÊåÎ'vƒhÑ'Ü}QUêåSµDãmŠ¤/½âçÌµP{i•‚ÒÃSÁfuÁ²¹Ñµ6¤x ¼!ìÿ2…œHÕ+Ä‚ÉÅ4Ôb-CeÁ:ÎåÃ@$LË˜ù
y[vƒü.(›oqÈí^{{½ïê‹_—yÃ¶ù2ĞşVæ«)!Áœ¼hÖ´Y¯ğ)Çá¼~< ©ßÊŞÉLP¸›@²–ù•1°Ÿ†˜–tcº„U­û'•Â>,Ã5†¡:‰³]ÿ&é?U¡Ğ\~nÜ
-DÕ($%©ùôà@t)ä
š•>*·U…N4WË›Ô¹OuÊ%úí«1öI²£„3ß¶wªÙ°ìûÃÓöéªÒ34+(q(h¸9ët¿ØÕ¦\§Ñ"’’ZÃL«Œ×¯-¯×_˜–ôYç¨ë¶Šµ„„º	Û,‚Ø°÷ñõÊj÷Å?¡mÂ0rå‰¬§;<¥|Ø *›)¢y¿a;•ª+b™ÀäĞ±güïHC1w3˜¥Š½È¯Ğ§œ%—Ø—™F))È¢zöèo"EÏV*‘Ò|¨Ç˜M‘×EàşŸd\jtO>@8O^©Ó÷Ù¬&½Òø©uŸ»tÛn½Ø“ı4I²·S„w—S›{ºh¼wI ÷%ğ´îæ–b<pOŸ€øb½±kUÄ’„(!Õ#q<Ì	öwëÃ#y|PÕÂ‚WœÆ£äW]ã‰‰³/ÖØş’ŸÛ?U¿ÛÄÃQ+”Dq8Âà7ùHŸı°úÍq›½*	şAÄ<XÆC})#Bˆû#f¡$~à891àHbŒ	øs~ˆÕZEÖ7cJpì7ƒÃ~İŠ3Bå—iŠ÷3=Õ#>âÊœ°‹œ Ä³äÖ˜szŠ‘åô…¢¦~3d¯ÉŞfk¹ÖúÎõ´˜ªƒå ®2,Y&JÍˆÌ‚«»œgF­³¤H4å8À_ÑÆ8+‚¦…PŸ²‹1•}0QF¢2×ŒãÕi'6™Á‹½é!òt†<ğØ€äó¤%ÕöÍM‚­à|`°µ6o¸vû‚<š\y“€ãš¿
Ÿ,€Ót5éËÄ¶àiáÃ.x«2=¾ÖÿÜ±¿ñèèe*/©,÷™ÓöÂÛ•á¡ªÔ&vv|3|À1òş¶ö‰ÌR2ôWüÅoº¿ È3° \‹„'L³6B $E,bs2­ò=´w_p§ØÇæhú!¡áË_ Œ¿¿¹ƒ.’Øwß™UD)y]“Eü ,¤²)OŒjŸKGÙa*ø$5~“‹.íòÅZ¤*dC(©àFææo¸L×snHqºòDïjO¶mä,òß´µøI<4„_©	Íyşñ1†Ë¢OÇ¹ÿÅ3ààZ(îóDÏ_nûì|œc°TÙ{ó‘0>ö®Õİ½Îa(‘\Íã0r¦´qÂW™—ŒQi›¦1)WöUÌjYË»cÂáÖ‹´?§8úr/Ï0¯Pò¦%ÿ$A}†ÜÃÛT`	H¤ÉÏÄïp>Arbÿ­Í ÜíXÇ&y`†Æ„ß—E¦)8æ8*oQbØW5\}on{íE€EŸLµãË‘4üRÂµ³TªçVi¡œœ÷+Dk^›9ûÄ¾.Ì•-§ì”4øxÌIé+à Áã€?¨ÜÀ/òˆÃxÉ‹B6†ª»_ÀQâİ?‘éÙr¬2ùãÌô¼âŒñéÕÏ€î»¿ˆYm®;\ÕÎçˆÀ™Ãòñ&K9Ø¨N%s©Š¿ö„ÃÁ`^Â[w<5×k ¯X<Úø*\øáxş“—ƒ]ÙC£F]H°¿î#5Ko5MŞUq€˜}ĞAJxá6côùÂ2eô×tCáá`¨ì¤—Æ¹Jb‹U³_*GF#ÁE–¬ÊˆmôÖR]Â0ÕK¸/v„İÇåE®ØÁê–O_Ã›«ö%™ÉpôÎpQe}é3líàß˜%dÒëüíiçr~Ÿ<å;áGÅu#‰ìÅ¥®+¶u¿ZØY»=¥}·JõõÓœá×« ƒU}xÖ0d›r¤u^?ö&İ²pÎü"Ò§7	˜óüî‰@d°ëá»Çfeÿ{BO½¹¹a¸–òR,A¸ıÆ§òş6¢]3ËM®cøÜËCb=rlèkœæaór:MHGYoáŒ7OÅ³¼Pw?º!+eòšZì¦d¥yñ¸bGÏ‹zL1kzÔNzÔdªx÷õ5±˜%¿j…OÒabZµ8÷ğVîVãÙÍ¼ì¿fÃãœ³Õ¬<«ªntÍš¿(2‰mQ'~nğÕ­"İğ%dmV3Ç÷¢Ïõ¡£6`V‘|7aH:îU1:™ãËH@%ëiÑàÀ³¦AÄG±Ë1êTn×Ï6¤ÅTœíÂıhdRœfæIùkédâ,c“‹€ ú·ÊpKL °˜Ìgû°óÅ˜È<™ƒ}¿±C$°ŸÔø¤òy
–ô€6PÈH‰JOÛ­ºïİ #’`×adÀè­x‰è¸xö7½‰M CÏgæğîc)´¿'mzê¢º_T»6z©ï>äÒ&$¦|Ú6,ø)xWpaa:ßˆì³¸†ğƒkçê»“—%´deşH‹ÿécoßó2^f'»ÒhF–‹
Ş4¦IÁì.E®awmÛ÷e¤+ı¯—›ÉE€mìÕ¬Êşv7/„ªøâ5¬ÕU?ÆcEoöœx>Ähš¦ûG•˜g$Ğ¿'’™ˆPô/²6âÕÚvY3Áj3ÕÓxë´âIç°ÿÿ1ì½²W½M/Î:ÅD¬ƒh¥eïÍæs¢]¨Qëq2-oÍ/]&¦=T˜ì	§è<²ÜZõöMØ²=ƒaŒÀº@¹GñÛã‹!B(BW¯¤ÕÓ<ÅĞ§`,h¡`Ç–oär
„djØÆqş‡×$]T$s°_:®|›óˆ<CÏr]
UYìR0lî]„ùg>’EI|çÍŞ©<üŠJÄã­0Ì¹v¯‰èµ¢ÌnºØÕlœç)½p„¹ßMæŞ‹>µt‹¸ø ]ÈUÆºW‡óf­ÖäÙâö#°9‚é)Ä±M]½¹8ö4Ñ6^Wà'üSŠâ Ëı-~ƒß~à$Şª0­¨¨U¾¡¤?Y´@­K>Ğá6¢ÛË’zÏ|ñ1§,¾À¢}¹ é{¼ö8²ûú&a!{ê=«ê3Fy¨èjòx{‘X É!Æğ1ê®Y‰¯¨õ6›<»1÷“²û4ëË×åÇ&Xa7Øc[·ïçË‚‘¤ã¶ÒI«'(Q1Ò`ÓŒó/™1Æ²2ØÂšØÌ$àbâjŠ´¹i…?Òá3%ÑÏ&š \-b³Ìò=yÑŸ&“	”K³±}Pãş2„Ïw<dê	ø)Eà@"ÚGÃLè¨4reEìÂ,ÙÊ©ÃG„zjr`dy[ŸS<ğı‚&Y¨h¦$êV´Zí8â…RÑïBOé³(é@T´ß6xÅc	ş<ªqw©úŒ‚Ÿ³>zd0›åã³qúÔùv!~âÆKÃ±O	ùşó¸Ùhì¡`› îŸïÖŠpÈÃ„Tê³ê÷o>íğßèÂÈ@„eøóŠ˜o‡;#ÔÌÙ1¶I½qÁM‡_;ÌòD
fpw(j Ÿ3ä¼ÌV	ğ¼u‘mğ©¥7åëó¶™›6nvšñDLÿV;›Ç3_¯]]ËCà:ğ+¹ğèÉ	¼0­ËË_×&«Ót¿’A*RÄ.0•ë#ÿ9(:(í—áÃZâ:PRQ l
mªÒœINªŠƒÌ9;ƒªßauñ±è˜İäÚ»Ø6gq†8ïéó·´ï¾å¥¦¦\öÛ´â‘Ú¾Ùg34‘•BHúĞbZÍ‘Ø†IH®”ƒüP7ÈfzvõÈ9xöAÎ ‡]5?àä–kH{ì6ØÒ4íŞ1VÈ#“WVÈÛqÌI5
×FÛ¯kx‰£¬‹7Ğ*h™,$R!Èş:»xö<K”£bNÑ2v ì˜J$)E±·ÔoÙÍ	ä[›}ğ#c-ÜËA÷ã},G:îjŞ¼nIúHÁšDÜ]ø1äo>Ê¡+·ïZm!ø“ºj”µ‡˜víî¯Ú!;ÉÌÎ6L`†`–×å¯œ·ö/Öv¾o÷QZÍ!<ÒÄH+±Eäfš|näÜ ·}<cµa÷ÚÓø-’O¿øÆ¿øÜáqk3¡[”ÎYÏÅv¦ecÕºs5¸ü›^¯ÄÁ0L µtN¨Õ2E¶õ~&OC4İJ+ ‚ì÷ß"lF™Ã6ü}¤go~fËÏ ´I¡º—xëı´Ü3_"úçqlìÄmĞ|cù«Òoëw¡)«µ½Íu³!]¬è†Çbı*¹RxÒAE¦5nCa.â–&a•ò‚î¥½4I=ñØÅÒÁ ±aL"í–˜8²A._Oÿ-t“¢ŸYŸYÙÉı&âÆl—,÷¹”¤4ü!Uı¡úhn£3­Ø:Òç®K¹æíäàïi„gÏnı [<Ëç‹2xÃõ×ÆÍİtš)ˆ€gİ<£ĞMâÖQÒ%e'ƒYp˜õ%†… °(…2O(uVo×G›N-9†½+Ç¢l;/Ğ™šòùX`üğ%ï¹®¦¥¾İq=á$R=¯ää5uï\cà}Î9¯çöş½ğVdñÀKî5Ö¹EÍ|P‰¸IÓDüã|-ù›Pq÷ïBáÄQÌt&îİh¼Fg âCŒ×=‡Ô=M¾ [qúQÛjê¯›óÿçk#H8"ßkÀÜ¹u,LeyÚ°ı'6Y?'œşüEUä.Ï«R“Ø2ğYıİ‡.OÀ„„tÿgÏ‰Ì2›§ğÿE-ºüÔ>úr5æ=:ÁB4˜…Ù%áSÄ×²fşîøG­j(Q Ù¤^¤„pßÅ˜ıú½æ¡c#©pPË¼flÃ¤¶Ÿ7c$
\ùº?&‘µN¾2˜ÀªØ§vcJ`?bÚŠİ7nËY$Uô¢?w½=vó¶–ÜÈÇ¤gÜ6çŠğ±:Ô~Áù†óš‰‡	â³ÂK½wÑU¹«¦W‘óĞRæ¸5¾)DHáöèˆıƒ˜¸Ÿ…•ºÕLç¢CŠãuòyûzŞàO9’±»8©¼Føq{í€±Q$|¼YBî©Ñ<m%†²»¨z<§æ‰nª´}‘Ñ÷lxìê„*•^›dpÈÿ2qº'‚@Ü
xasÀ„Q‡œ@YÕğ±Kp3À"‘YYÊØİµ.–n½/F¥°$31¬§˜3ùÓ‰ï°j‡J¤~vDÚ³zÚ÷-¡æ`ûüñáRÄW%:<£åBCZQ÷MhMí¬±1ğIºê¤Gİ%G>¤hµ•i*B3&Õí-Í^•…ÅG4Î/ÁL*S«aí¿e›¿CÈæŠE»6´½h±¬ÔEéÜùÊPŒs<Ê¼WÏuItøa½³|Wg6Éi–mV èÊö]&W‘h°beíŠ“¾HL'ß¸nƒ´g0{O ¯aìtòÿÕß¬U8‡ˆÂÍyû&<øÄ½Ç÷’©£MÛH¹æíän~t±çu´Ãºïæaì¬X1ïV!õº·'´=G÷{™T!†5œæÉ¯0Q–İ«ÀG@îş	(#Ÿ…J	2
©@ÛhÑSèuì ÚöiÍ¢pãîvß<qü Í,èRîF¢†í›ğ)ı V€<îíÎzn÷ÊòëÏi£¬µL8vïŒ"T¦¨Ñ×¿Ö²÷PNˆ"¨qIÊkHŠLn¡fé[xÈ®iÓ?ŞÒ ‡7@TŞq…£úè”9 ÈYêRj—˜DB€àšƒèîlƒQJKE8ql½j®İ#•EÚc{©ëe;¦ß ÛopÿnC¤<êzÁWıóO¡ÇåIáüŞ¶¦ÿÏ›E…_[€Ëq§_`'£Ÿ6²‹îóÜŸë”½¤˜#÷‚H)?öşšä]*IÔ;Y@è™¸_tŠwèÀ-Ğß$ÜE”7{£³$ŸöØ¡œ†Ë‹Ïrè’Ÿ)K21»Èl_“ÏPE¿°Eçaß±àÙØõi1çÙyŞõŒóõò[oC4†äl¨U•§7qÖ\³±ÆH`ûëtáËìÖR“qñÎ}àtT6Ü¶5)I E*İU*Ô†÷Œù\Eo6 í?!¤ıT’Ø‘Ú–#„ú˜ŞlJÃÀÂúHˆ=bbüG2X#¢£?ÈUõ¶°ô»	o9V7Jº/É¨Ö¤¤#m<"é£g¹½ˆÒ‰WM>!´hjñø!Šxâ@M?’S•†”ß ñê-ã*¼Jn³ØÒú±¼-\‹±&?+†
 İí!SjFvØ¥ÜnûÙ\>æóš’nQ¬ykœV]Š 6 0      î*İÅİİİİÅİİİİİİİÜİİ¥»Ü»»»»€»¢±3# ¸  âyR&”{(Y”µ””YE](9“:¦¨|R” dDúş'ı¢›´%tRÙ¢ìE÷@;ÇeíB`áJ      @C„ÊÖ¾şşÿş¤Èéi}F|Ãïò§í¦_Õfxã7¼ÈQ¢’ïhOg.Ò/òdLºÌƒ‹åXLú»®“ë(YÙøˆıWiCdD…ñ*Ûc}˜¤Yxõ…ÂÎ69‡’îeSXQœG¹Té/ë‘È¶ˆÏFªÔ£¢^È×IyM$º>c[é8ãA<ul`r=Ôã4`¡€×Sñ¾ößtG)4wÅ-:ÓöŞ*Yˆaü–Éú76xwÿô©®Úo±pöåäÏYìÍoCO¸fŞBØ§ëü¤œ!íà„Æş´.‡ˆØ'!EÉq:Åg€0lu&‰õühL8ë¦t—³gj>BæEâqÌzAÓâùúQU#Û8òiı™DñÏœ#¶³ÏkêƒHØ!¬îÜ,ËÅæo«™„äL(r~™ø£Nê¼P½ğµ÷ÃU$Òu%#`k²IÉĞäÅ…İùò‚“OµÊéîíÔÃv7/sûœgâèü8¯èSÑo+ÖÃ{3ñ››¹öö{óö«©ÚÁ9ê:,•s<‹"Xp¨íetòB“•WU)¤óÕ„Ş¼pùÚ’ıÄ¤ ½Çop+(—²°°™õ«ÜYÂ6õ=ÕÖšˆ7ZCòîuV‡xv®*5ù lXáa¦4ªTVå}ÿæšÓ€÷u«ˆç¢õl­Jm¼w-T³ŒN¢ÚÆ
††ª—g?ƒ—: jóMy=¸pŞ™Àô§Ç2å™­Ä³i§`Êƒtñ)6É¶}ôCÜpĞ¤jtˆé>àb8–é"\*àŠE/×HQ>÷Í‹JïŠÕ:3Šéì^ìµ‚ª	± QYêB8Ò(
è¹ÀÊXÈBøV…k®È»gNBq–ˆN|H¡å‰³"<)~½
,Åf3ë<çJå¨¨q>(Üia*÷ÌËé¶GÑ®6RëX”2µ,Ã:~ÖF»{7;¢a2“„¬jç<$ØE»eqn©ó2®L¦Æ••(*i‚µq_·ßèÃaõÉŠáä á s€_äz¶;ïÖ×[9.ÕN˜T3ÓBÉÆkn§g¬ÁëíŒ˜«n¬R¡)Ù.HÉÀP(À­_ëé¨Zñˆ¨®–›9ä[0ot´íM˜Ô½ gM€ÀB#œ0zk×ó’zÓX)sŸş[G íqõª¯çm‹­ßŸÿ·gùú7nù9ŒÅ´±Ø<T]0€V~….}Æğô^å™­‹aí«ÒèÏŒÅ»•D}Cnç§îÔ# (>7ö‡Ì…¶1F/‰nøJ×ñ¼õ Âšsİ—Î§;H&7N]U…Éº²à*+ÒÍ}–ÔŞe‹*Qm±×üó°¼¡8ş<C$ëãÈ‹øğ²Ug#ÊÏêÃ‘Æpèˆ°D9÷<m³<öõN6İ¼r}î‰ï<4>Ã—ŞgsK7–åŠ·DßÙülùn‡[ÁÄq8ÕÕJ°
(÷Å<7XocæPéqŒ_àhŠ6X«ß„V=LÏDÀ½¾/>3­gJıd!Ìß6ŠyŞ;°tì"Oœ.ó>\ÅÈ¼êÛİdvËk@T›ÒH4Úîö“Ë9ë¿ Ë—¼VHıÌºíãZé‚ÁË$ÿzÏlÉ¬ËÕUUÏ<Çíß³Çw\Ë±¬àf5Êı›'šq|¾C‡,›(RÃ„PAwÉùğİ]¯©R*{i&¦2µwI9€9Œ˜¶˜Ş~_İúÉJôOíèŒ*¹mû6Ê¼ë®„îf²ÑâXIWeC™c ìº-âÃEI#??ç—S¤s–zÓA@J%qâd˜Õsi5\‘¶NÌ÷%A'½ãd=¾õ_±(›>~€!¥ª.´ Òqß$ußÄîî&ÒäÇí¨¤=›JLÑêÆ¨5nÜøå·µ¸ií‹Ôk·)	½)Ñ˜+]£¤#Ä¶ÏIÉ&õáIˆÊ%S~¡K²¼“¬¿ÁRïËÀ“3gûÌ½—\Õ½ã0q¿èX×İ`$<ËœVò3jDyàH 7ïFbÀá‹¬qX_vVÍ~ŸAlëï“m=¿Î¤QÏ?ñ,·×º4¾ºèğØŠ£šÃì[;¦MxÛû5Übp¸Mp¢O¥Eş’RŞCC*gZ¶Á‹FÁÎ­7pÄ#‚°yû3œÈj˜ öÔ¾¬ —L«-–UÊ‘ÔŠóïH°q6‚zŞáq&òÚ9$»#Œ‘YÇ(H„U}pÀhŸ(ætÎg¥ºõÅKôq†Vv¨5ÏŸ2D‹xí7aP”àyà@îÒL§—jƒ?ŸÖ–DÆüm?Ï›îF~?ù6ÏVî`ëâ@%%z»ÿz˜¸ø¯Tp¾If„W“1
~Ğ¬ùówë¯îi7u™íÑQqIêÜHFÒ¶ÎÈÙ[x˜~´÷oÕØÕà Ğãr_´Ïa87FF±,èøÇİa˜Ù÷äÕ¦´*‚u‘ºõÀUÂoŞú‚ùñ0€}(>İŠ6T;üş4G[Ôİ¼ƒã¸ê€°O§E±Ù,®]ú@]É&àÀI$™¿†”ÀİP>°!8L=uÖz-¿µ¶Û®_±h:£AïÛ¤MüE£ŸÉı
‹v¶=d‚ÖÊe¹Ü
4úñÚëôÂK¢¦äe¥E6ıTCÔ(5|Î7-ÑV5sƒú3×övvR×Š¢h
×–“åËTjê¹òú¯mH(!¨\4Ü|··S¿â#§1!„MS¯R€E³vL!tÓ¯SÉ
‘+4ÎaîÎ{ır,Ò^AAgîHßhêJÿı×o²òy6Ç^—¢S@!0@¯æ’–I‹r‘†îxšbe;	SYs•r©¡âÎ¯©å[œĞ`\TŸZLhylŞûõ9pùº©÷®Ä9ßÏ'OƒW¾ wíI#‘³éîĞ`Á§÷½Ş[ûH»Íst2„KÜ‰İ~‡ÉÆaŸ#ÇÏ÷òrcnnª:ü5r/suï¦aÊÂw“; ´}pl~&Ø'ãêOORlö.ö–&±H{ÉOv¤Å%ûÑı×eÇL€³ª$½d'H­ª{¿ ;$ÄÁ¡ğgá^Â£½'ÍuÂ”9³ä†–:—5ÍD„ùC”\ ù—ååzÍ­Éÿóàó‹ŸRÎ­şÊktc>¿cçi¬kƒÌ¼Áê?¤Q4ÍêéœGâÀ™$=Ë “ÁñÃÓ/ÔçÖ‰ËãäW¥Ÿäæğvkáxu9Ğù¬;E>Ñ¥|ØÛ£ù¥ÉÊ9òS¹KåóT¡Ì¤­~ÿAÔ£#%s¤‡¨e‰j+(ˆ2„1şFN)±Ğ^â*MEÎmß»ê¦KÖZÊÔµG'F¦’«ÍµWî›n[nÈ´»}<ú¡•(ÒÇÊÉ~‰"2”ßZĞ0ë"3¤E)„—nbÔó]gú‘´p–Œ¬áƒTÉÊùV¥°XÌñ a¬ñSY'>¯c¨·”•¡õ¾§ò	¨`:}ª±”ûŞ_İúúñ÷ô»ÂuŞRŞ]LRël¦G’IAıŸ/€t‚Ûm±åŸ8Ñ¨¢Æ=?Jæ²³sKî.:	]™€–@¥LÜLÜÑ"r¦€‡Ö_@]ua,wÅ¸”,÷Q0[†©h;û1~ÊMJÅ›Ìã9œ}õ¸Ö¾§æ—‡o]ÆWí½AĞÂÓ¡ju×é'CÒN¯ :öü=ÇXt
ÁÓà²) 	;¢¬yO¸·…œ6“åå®T ÄPDüÅ4ExU¬eP"æŠ,$µ@ãè80ÅNÛı<3¸wx]Šåq¢I!)’6c@'‚Ş	õÁL{¤~DÙDñdsGÖ)ëÄgƒÌ)«SÑúZ&øû¤ı,æ[ñ¢{‚_÷{zønŠ@Éì¶÷YÜ½?ãÜ"Ç’±Ï²Ôç£ôë’;ŒAxZsÕ½ùÎkşê‹¤úŞ=@¯œP/Ç´>^ë›([%d¤,æïTJí¸5gşçetuşä…¸öµæ°¶vêÌúÔZ[ º–­îÿf6Ë"Çn¼;¾ğz¥Úöş8C­®åµz”(q—·:wûµ6óÒ…YÏ|}Sa'šÓ¢»xÑ,÷—_½¨X Ş=_· ·G«ƒ%$ğhÛ5èHÇég¢m»¢tXßocfÕ²¯`t}NTE%õ01í7ş¾ÿ·Ig·–ß·›²Å sø¨JòÅÂµ1aô+°…Ñ@Û¾ ³^Yy¸Gf¼Ï:N‚ØÈœö"[ğûÔšÓÚ0 ®gO<@ë$4Lw€[%ÑrŞ&í>Vú Ã¤ 9\8‘£Ä½3ŒÅtfÙO²O¢D¨¨aË¦£Ø.Â®H¾£šQ VÜœ%_,¤§únEóCÍ÷  &ÆúÙ_¤9]ıçqyZŠF¿ù`‘Èp;ù[M„WÃîİÀyhiÓ€(³	oºKs8:>é-Şç{&<p,«îMS£ş•\Éã¡‡heÜÈÆ¬¬+—Í¢¬ß÷!mâ–ıÄ´r€ñxB§ÿ¯İµ›O©0tnìÎÓÈVyÏã¯©´«‚è—‹ëˆñEëá‚nÛ-°mµ"Í’ÏWFàæqjPq&<——Ğªs1ˆĞ«÷Éó\`0
.e¡X‹£+WGÏ¤3ZÛÎNÎQJ‡ïRòjœÓ’uE	&ö+(ÇñÙ¿˜Õx=‰ç)”HöJş†‘ñÏ‡h·©Ö•(˜6`­ˆ™"4xGjñ:¢9¢ex·ÌìÈ´ÿônì‚6º©óÙ‚ßõLŒÊ”­x-Ñ‡ôÊ¸õr¡-ß¼óIDÊ×ç•BÔ(á b–c:—tÒÔóKBm.†Ş#wpÈëy«¢´„¡gÔhêÜuêŒ.×CyGäWíşï¼º&t§@¯®w9á¹!hÙ²ş>‹¾¬ªKdüQY›Í±ŞO¿°iéã\^Q^.›Q1²B¥¾y¼Ã½ñŠ+¦Pœ`ıc}.Tòñ¸L¡¦ì”2dBimßªb¥[G•Åö…„S¯N0›Z6òìú´=ÑÃdp‚t\Œàf'=Õ/$ÜàPŒ¤ı®½¦€¡KÏv›O8*r‚Êj¦òÎ Q¡˜¿wFIj;Œ)éÂW¼Äø”*ÏoÃ‡ËÂ¯Q7ÏxáwHáÓ·Ó5~%w¼Äuá³¾á—âIK:LjÀá"–ı=.E‡(Ø¼@$0tlp»/ù·k×Eõgˆe!E#Œj«ù-è|(,úc#©Mî»»æ?ÕèÚL	.ø6vƒ¼¼AJ}	ãE[æ¹t#C»#CÚ\†EaU´Ï¾!^º'ô	5’qoĞc%“Ğ#G¡ˆåîìÎã¢ë±˜ë,<À…ĞD”·«‡’ˆ¦2^¤ÑÎç¯OZšo…Q–Â˜~î{÷ko0o¹ğ<BGˆ|j_{Ó}|äq{ÑLùÉm¢z¹:”rë^\G¸Ç] ¨aŠ»¨a6p$,­ıPlÔU…Š›ñß)_	I(²$d>)gRfä©ïÄèa¢‘‡Í '?œÿÁr£NÂÅ#l‚1ÍŞÕ<dÊ6‡?Òâš6áß¦tz 9ŠĞfÓìÙ7†+Wï×—\Nóú7U°7xÍ¦:~¿b–2ŒiüÌ³Í}Â®V¥ô¨<5¨}@•2_:´¯ài_,Êê—|ÀËqƒíâ‘¸›ÒèI©üôQIyĞßL0¨•‘Ò¥Ee¹YBIJG$Á¯¥áßÄªªÊ_ÅòJI\K+ëuG£Ü&»¼‹Q"³şP?é,—ü–W¡”‡4PQM6.æ_j¹£o‘!«m†¾YÀÇ½Uvj÷Q–’ßx<s[ÂÉõÄ¸•ø0`š_”›À¢N¼Û¥|X¼äŞÅç¯¯mª>¶Q%)®KÓ¾M=§½ËQ]~n[¾GTõTRG0©¥ÏJeÉúaA¼pp+h¾0×!Ï[àêÆ_ÖE?t5F Z„(92Ú?”õŠKfĞÀ6_cEŞ­gŞ›xíå•P[ö»#¹gö?å8Aÿ½F»Ôİ¿$ÍĞşLtPÔ’>=>ÍsÚµÈÚ÷sş¿RÇk–eÇ¤é‡Ï·ûÿÁ¼JEåÌùÂ^©t[sğ¸à/Ò¤æ(é2\ZŞ½¨GI°3_NRpûšo†í9²a¢óeíÄÑªåİXHÁã?ğï•70­ôÈ®6ÒAzóg8Kô(s€"vÅè!¡
OBÜ–öf#÷Íñ!Ş"!¾×œ]gÉb–QIÒ”òŒ‹ñ´ä¢ü»k¼šU%J~#]B»Ü”D²G;ÇM,Ë‡W˜–©ê0xİÆ›ùO¿É6 i,à½ÇIÕş&¦œ¿S5®½ ÍñöíÍœ£ãİG÷½Xğ*­ƒ
˜æOè9ó	2¤R	Á1™çÅdÿ²‹¸ìâÒû²wÏJí%Çç„ªLCÒvŠVÊ‰F*ôtêÎN?³o]‘$+ƒ]¬‚Æ¨)Å	ğ1Bí¶iÄK™Î{ÂW™”ÏII°¹£Ö*‡îVV©0-HP­-µ‹LØ…Õ™M*FÚxvúŸß\9Ñy¯¿Y\ŸsJ>jËaÏQ·}È½¿ùB“ÑK÷àù¬˜ÊùºÈ¤‹kÂù‹Cöš?ï'±MüÍ¿5ôbù)ªsA²¬Âtkï@ÖõğYXËQ×™ÀMP6ø†ì¦a2ğå€È¾1Ï‰’™x'–¶Y°Iå§¿éLƒO¡¥FÓ“_nãJó>ÙºäxƒÕÑvSf&t½ZmEÇ\Ùßìš8ğÜ9</Ïê°µSÂ=,±Ÿè0-¶gb†ÑÜ~sã˜½âĞeÔM~M+‹ıÍx`ÇA½+]MgİŞD}ÊùŸG¨ƒc½\IÊÌCş˜•£xR=ÂÑ‘KŠ¢Ø44`N|³ÌòÈX9øÚêihdÎW&áóÁÆ@ kİU©³œZ;Çn¸$?Wu™@üi#1ÙIMhº‹h3”bSKôàmzy-mJûò[óÅİÆ}oƒúñQˆ#eê¬".Fév4ÿ—ôÔ{Ü^$hék!Ğ—ãÉş©a3mºÄt“ÿÍ’§«GOø÷Âîû{&®éŠ>›dùozxÜÜCX2ÿ4,l¼Ûı~œ+øPÂSøæ©§Èâ©°Æ|{eÄ˜ÙÔÄtQv%ï‡hÉÔ æJe»¤àşH¿oúŠ”æ%ÊOâèk†hCÌ›¼¢I¡°˜wƒàõ‘H’~~Z|Âs F‘` şöñè›Bıút6eÄkØJ~ª£Fñ¸
ÑL‡•ÿE %å1ô<,õƒÖ3Æ“—!£…šÀ_RZc®6%¦söÇc~“|8ŸI˜jwG”-!ÎæïV»Õ³va¯>©ó=ØéìfsÒœL½¬W`—×˜~RZ#&M<A+­H‡bmÎ5ØJdKBÂKŒ7ÄÕ«Äu4?÷I‘³­˜*•Åã
™!Ì€;GîŒÕ3€Å>•Ê”4->Ñ`œ£§%Wv"¸Eó€!3ÀÊ:›vyÌè0•ÕI%aÉñşztÏéZšÛ§§¿Ç3Æ™ôãùoÍàÄjîsJ|áıxq:NBñ`è¿‡w äwÿ‹tAlõvè‡â!î?ÍŞöWı)Z>{Jô±ÿÄí8“cU÷ù §&Ê4æ)ûåÌIöHMV<3`´hí¶Íb åÙKº–…fJ dTÀÔÀÜğ8vğéT0 òÑÃñ˜êØW~mf†Şìù¦C;'{Ğæ HˆhvÛ‡ÎŞp¾+‹c5ö¤? ™ŒÒN°‡}ÌdøSŒdû¼ÇrÉ`Œyÿï*¹÷W{n*ÅÑrü÷-BÛïü³»hşêb”#A~Ú¶R	T& :4¼y*­YşÛÀ~ìı·×ÿ;o‰Ôa?¼ÔDk<÷__œ¬UöÑK¯ÜÊËÁ{½Ïeİw8gI·f;á#ûÎ`1øëÊ9z­ÊèéÖîeÃ½–
 Ë-ÆxòúD¤
â mjHµÛŠk×,¸	ŞcqÃÇ·kÍ®*Ÿ~*Ñ¼-™K»›:1-woª·Ô^ió(¡¬<oOİ>7ÍÈ6¬ÛÖºÌi–á/ì„ªZÒtscQ«¢¢Z´P»÷O‚VCnW9 A©ËÙ(1YÖ®ìøÇ…B)¯½_éhîßO¢«É'iÿ#r!’Oç<U´<h'\·¿‹M¨ÙcĞÍ[Ğ|o"¼=tÅxÁì9ûÒÔ*´Â¦µÕ]¿¦r¼©uHß®ƒÃGLJæ"dYá5EZ§.Ûƒ¿ZÑó³´Äñ9s«,F™p¬Š*ùÕë|nCŸ»lIï]Ü#9vŸ·'óÄq¶.Št}îø"›n—	 ŠÈñ¯f 6éls“È@@w1Öû‚7uAqÎ5Eß©ømˆ\Sƒ÷U7ôğÿx:ÁlÊÊJ/Å7Ì§ ?^†Ø¢°i±n+¾²ÙP_ìÏy;/»YoÖwh$l¿‡€Ûw›]Kê-<c‰fÅà/ÊEû/úÜ×ÉzmM½=¦eùñ®pÕŠÔÔyş1ıË¹M5,«ı›jzFˆ1İZrRôüƒ1ıN$CÃ/A7EëÖŸ-
ŠÅw0=ÏNİ£úÓbÉâ1} Ç²Ÿ"¬O†OÇ/C)ºt‰íYüø+êôÆÆıÑö¾4Û\©N{ÚR;Mëv«Íkğ´Ì=Ücş'÷_{ŠC[®ı8Ó4ºÂé±ä“h¶|Ræ(´nñD@MJ	Q1÷‰ÉÂ7Vñ©¤¨Ù³¨ø/WO2•¥ß ş‡“k‚¼ûœ‘ è c)¨¨ÁdqŞé˜,÷Áò>1Ñ3šîÈ#º4= ©ŠAÛ€Ê xƒä!±m^É‡ü•zWÓóÒxi’]%BÓA†á.á¼ Y0Ğf’“ôë{Š&ït•}?;·úÏ?$-ĞOß¹+qÏå{2öï˜î?Ë2gdx#»a°0|ĞuÂô9 ô|ìr´‚¹Y.u<€zh,»Èñ‰À¸À!œs›RÁ­qÛ­è0·™DãÖ¨¤¦˜ØßúÄûH2ş„r(6|.;=Ã"j¸†äD³°µÉ*cà9Å¾ãÚ)÷^ÏñöJ_ØÒH|R¦¨f]ˆš£ßr‘®—8rGOšúFdv5À¼Ó7uàU¼´hfoW³S4¨<×`„bK‘èyÿ_xÿªgÿ>Yü÷Õ!'şL’éÖí¶¿cS4™Y3@qqø³ğo—:
¶ëa²Xõcòkƒ,˜/Y°ºÇÑ­çPœ;Ùú°ìÅ$Ûïæ#Và—ö„k`È?í™âx Úé&ÃÚj¿N'uæá÷It:e(6]Ğ÷ğ˜İCôÊ°:4şë+S¾’{g!àëŠšğ;WøEôZºï7ªî6ıùÃ	¸\l¿ôÒo{5İn{1ßî¸¿:Œ\0é”[÷İ,K½é¸[ ›p‹ë6µ1ƒï&cÊ/·sS÷É553.‰¾³­éø†IÛñÇ¢{mBC§óbº2¡IOb]_j`½Ş¯÷æ>Ùò8ßá«ÍL„"Brÿiøè¬
şğ8ÿH^5™ğA§ıºP#L¡P÷ImşĞg¹H.Á†.¼šod WÉG4”çzÓDv^÷$èë:ß–Î}öÎ»±4¸=úÉğÁN~è·Ì¿ì&”ÃõúÎ¶J<J°E­¡Š¢”Ø˜âäÕzè²³YYeã¿?Ña˜™nÕ©r#t·$Øá9:åéß¹´Ëï×-– 0PBüt8–<×¦üV”p_º,J’¸¿â´Gk
Î+À[µ†$ö³ønºX?íR™VŞĞæ 6„YŞŞíu‡Ïñö[Ğ±öş„ke{üWğX¦Y1N4oM«õ³`bıªê€ŠâÛk‚=Xš^Åå±=váÎQd²ª¥\Û›O¢îà
C.LÀİ²µYBã[¬8úQşşëºgsÆuÀ¨Aø—„y¶.#»!¢®°CÀÏ¢KtÉÎ{ÎtVwœâØqÏ¢Ê…áÖq«aS¤uÿÏÛó"U9%? (†¶68T…±ˆ‹}ŸÆaDÖOa5a$ÙáÜ`ÑIÿ…€Õ´<ıªœîMWS¾|Ø%î™VöÉ}şS,OxBS.³F=`Šn¾V}¤ÙÊMU!.Œ.ÕjåY¸Tã¼PÂ…Øü3"­ÿ#,ÍIÀòÓ~0ì›üÈCØÀ“ØánÂÖèòâ<œÛ¾ĞH)œ­‚äMì†úFˆôû7îÃ­uÕòï£A9\è|æõ}‡lZ—j ç[™ğ·¤âñ'¤”Â!_¡¸—böİÒ¶9Ç`Õ)ê™ô\‹Ø§Ø˜eåÈåƒŒï>}mVéÉ…”kş&ËÑ×lmÍ‡¡”>™“Pô7¥&KkG	ö $VÎªÀ|(dmwFò¯—Ä h¸@¾À3ò¶swš~ƒ{åã,£*Ã°8'©b’—ªº|InòíÚF¦{2¡d³8–z3ó\Şıº©æü;=t-Ì‡¤ÈØqØ‰qY†ó«æ½äL\6¼¹n<@Òc_eÛ$0²Üúrdí€ïØ¥Úï©+v¶½}¶¥Şì'];ªyı‹õù±ìy&!îéĞsËåÄ™KånèBÕo÷Çu%ÌŒ¾¨Ç”Mº?’ñB‘£¡+FªÿŞÄ;Ÿ~‹<Zn:ıïV f¡=÷poîæ‡hõãCS‚ˆDÎ$-Ü^Yhu‡­=‹^q”ôSo°Ï¦ÏÇ›U8A×ò³é…óó×£´°ù¯q_Í¤õAŞÜsê›è ÄÅø=è_Â÷Ü"D-•ª ´'iø*aˆ‹ñ…ì¢ãP­0Ô[_âë÷Ü#õñïæœÙ»¼ûJãøÂërşJc½¶û‹à%A7™.Ú×Êdãa¥W*4;HéÓ3x_lYŠë´!zes¼& ¨5Eù<ÏùòI½àj÷úeıòÜ-ykÙIäVëP¥ú€™}¿Ì¦™¦{Û*Öji§BŞúfIBvüõ¿Àµ¬ÊUççÃ–_ÿı±—0w\d}j	6%;ú!ëfc¼É˜ÛË-[µ÷şødÑÀoº©yŞt*P"’áâŒ“ïú‹İ4ìJG
äØ»ğZ©I5m0Æ˜ÈLWÆÍÕSÇc!î5ñ„¥´§«ê’‹<OÛèx!Ü:ÖÁö:„×Oëê˜‰]åí½Ç=4|¯ú¥]#æC­(>iÕ‡DC±zğx©aüÖwdÑ;	@6ö¯“‹üsù˜Å‡ıÉ
q¯(ÎfJÿè`Ş‘Z6ï%¾úÙ¾'£G\OÃßÅxÚ¼/Îw8ÌÊt2Û!U|FÍš×2Œ#"âÜHEådªvk‚Fõ²šìÊ»#è›ŞA*ŞÆÏÈŒ[ ²„‹óøÚ•DŞx;ÁÒæ©dÀRÅ«ÁZŠjÕV5Kÿê	9>íé!C†h×*®aßY_
×9ÛP:4è@N´¥™(.U@­®‘FE‘zˆÛyÌÁtGÉ}ÁƒTwÍCU\­i1;m€‡E.=¿1Q4òH/v7%ræ˜–Œä-r:Ó{  §ª³Ç$ã°ô’ÈÍÃczvöº:›±–‡¾@rqóÂ¾]Î€	©?	XŸ·^c”÷ÊO¤ß#(¥_9çôC9ÿ´P£8òÜ,ƒ"ç»B”Vc	¢Ê P%o³›ñÔìÍë8;·‡-Ö4¢Íl€üj´®eox]TıÄ` H‘f--œ"çûjæ&s¼Ù4Ò&-œÛ‘$bÉ¤Çw·Ÿ;'TõC°‰º‡¥Ú´‰ÊÒ­3kè”
;ƒíA´ÊI&Lóy‡÷{:ÙcÈ§†ğ¬CØ€âÔ¶lAqS|S$5KÉÖñ‹WE}ç”ökõÜX»²aå¯sJ…mVÈ_Xàn ËNÕı
9ßÊ, »½|6® –€Š±Óóà•9n¥Qçw #Ãö6Áh·ğ“÷cW›6\ß{{¹Š_ÖràV†ú¥ûjj-¼[Æßµ¶ø¾ë…ZŠmÌPÁ;ˆÎ+@E~7©ÓìéA,·ÖG®¾~øÿh%>Ôäß78æòŒı-j…»
şVb–YX2{Ğ¿q‡¡‰%45õZÌç×/Z?Uº·n¼™!ï´Éõ?ò5‹a¤¡ûUPİòùÅ>sÖ{Ôº”°¦ì.üœÇK5®DŞsµ#ü~¿Iæt±l×Øy¶fxvÖ{ïwÇ.±,ïÊÌó^ZFËÊÆıÈkd
¿T?iôâ*òÊ=,â¦[Ráò×Yáaj,È¥TvñE&ÎÅ ŞO[!Û9’M,.„ª¨¦BZ)¨îmæ²zó~è}ÚAüÖÆÈ»
\$Trğş]÷U¨öÈ«\“ç?1¾“z›–n6^Ü¯×ú÷ÀèK?=&i¢]Â5|µÿ ÅËêéŠ%{­˜Å¶í»Û¢NÿVŸ‡Ÿß•y™¾Íˆ³Î²÷ª	»M£œcG(§V/áh&Û­·Æ÷¾¾Ôù?~k£?uGPúZÅ½¾÷in­ôÊ£úp&‹V0_Œşi16Ê¾cX·¿İ¡ùZJ¹ ß^î¿ÉÈ„»è'ZJ&unqëA”"‰hjÿ‰®½1ôAÔ= ZUP{ ª£ä‰Uh¡ôÍö(æ…¢ÀÓïÒNw`d)—Ñ;_\º¦Ğ¢#<Ôh~ïš=Äz™v‘éëçğ.XÌÕá®îZ™şük#6±ZÎ¿ÙÎçŒßg¼Úôß„¦¶’åI‡N(ŒìPİ¨†©ÊZÈd^åg°‡3R‚«_5Ê³ã¿½¶Íï›Ï4p[nõ{ú³çÑùeÏ½P‘Ç´$ MhEä`‡ë)â°LÉ|Ñ:-øƒ®wNcx´ÿºiPÏàû´Öca¼‰†ÏrîÍú<¨“ñŒhU-pQ äö¤_­ô`ôï× ~ï	.ÛYÏëŒ•¥É&ğlÀ;É­P5[
@ØùÆ‘ 	=d*tcÖkı€{R±Ş%»–r·ıã³/cÓæG¨U€¾…?#‹†•?yÓ²›ÜLŒ†~°à¡]á¸ë°B	Øó@?*jØtÃÖ0ò—fl²æıÇÄ÷ç–mÖùú=¡Ş:«Ë©× Bëš2•“<jÖ|şK8dà›ªß_H§ï_ãœ œLr˜-‚Ê®Úó1ŞDûªìeú¼cda¬œ"knåû¤u7êÿ$^í +ëxF9˜×’˜?ê@–_ù3p(²ŠÑ˜º€Úr¼/æO³_ÿé-âÈi=É‚ÅŞ¿—´kÎíĞ4¬Šÿó5&7T…aü3
ªt”q
gfhÅ‰ùWŒgØdB¥„¹% Å \L¥L©2ËèØ¯×÷¬1Éû8J!oxªù3`NgÅ>s†3Í×FGìç÷”ßWÑ|xe&å6"JIS¶¾F¾¢éúâÆíÑ¯Ãˆ·î×í+Êto{rr§Õ[¥Pu2î}Èî®9{÷ÑL×Ëñ&s˜yWpß@öã·…"ö-êh—íŞ,pú†|RUY,K9ĞW>šFJxK€Ä÷bm8ÛÇ“Æ®å^^†Ñ¹hËÏÑœkòr/¬àÛ‚=wG&©ãF¦¬ùµÖÔ__b6ššKİn§z²/şòŒÚ=:ÎÜØÖÖÚëÎuú£íœ$Û,‰`C»NÙÂ§uèÔË~=6Ÿ¬î†Ğ]*ıãœ<dMoú}€ÛY9Ä0/«º¥5‚¸ÎˆÀı$³ÊZ©ÂŞ`ô±¬VC>Ğ.lŠQ+õ§–8I~nÆöf¥&¢+>Ş¸·DÂÌ5ë¤_½dÎ¼…RŠÇø^\CÚó¢Q¬™¤\§RR¿eÉÙ{‹Ç÷¢GŠ«óŞ¯ç¯y·»¥°§ÑT§â½Ùõ(~µÆ®ïd‹ÌM`‹ÖÕ¬§éÆÈ	@wuYÅóÁÕØÅpèÉëã14ÚÇcQdk7¿‘ëwG§ÒÊ¯AÖã.ƒ<fã¬nfÛ¾RŒÏz>MJÕ^f«ç»ÊİÓ0½§ı+mÄeö»ƒ@¢vÒÈ«	e“àgà²ÍŞSø›Æ›Uy€ÑY[ƒÆó:i7pû›|@‚ç-HÆƒ cÄMâU²]f……¾àı{sÄw‰â:R"]g¶Ğwô”ÛÄ{s¿·6†]N}Ì…Ux'‘öÒÊÖ2¼>ñŠ§óªØ¼¹ŸÒmòx?3’Ò®ß“Àß39ç$¨¢@EÉ’ÇÖ†¿ÜBoşilSOŒA fã^&ŸeûÓ§Q²*E´k6òï~£ê+„$L>i„ƒztW•q¶KÃÇ¯¶kº¯öDzÙğ§FÆ6ÂÇ¹êõ¥0â´'J	iü@ÜğdX+E¯¢Y“—¡›ïp­üwâc3†ÊøFk…¤´;|òğ•;LËï"ÿ#©W\çø!	ö–t¶ì(·†ïn·W³ƒÆ°%•n€Ç|	%1x’Îşı'w½™şx=äüòP-×ææ
6/Dƒ*øûÅr &ß.>¾ïâÛOá¦}ºhĞ[n\Ù×n,†Ó×]HË!ÓVÛF_`¶Ú·l©Ã‚o¿ü nšœö°ëoÊfÙ£ú­Ô	à,($5qÖM9:qg½xoMê áb×îÃ¬Z"œµ/íæ;‘òµ¾WKĞ0~U'ÃRt2Øq‘Jô-ß°´ hVpàê&¼»ö,ƒDÛx< „Ó‡°U"Q{TÉ	ôs_ÙB	â²»ÇŒ{j™p!]%†`†‚†/Ñpáÿ {|k§ÜÎ*+<nÕ…PÆ–Î‘8D"å=Œ[§Q0J¸ë•ş+DÁ÷€
¹dŞ¨¥¹_*Ã®øÎsi¹‹×G"A¹ÖõQšÂåïÏºÜ}¥…”é>ß§	±ìÈîÖÒæWŞÕìg·%AÚšâ*Á4vé6Øû))Îi<mè™Í-.½‰@œòáŸVÃÓ²!‘ñòúócy1½5©¿lh±ÃT†á¼Û™v¼)©”ÆxÉ´_ô¶½sÀãúx5Mß­ëÍÀ»)S‰Ú.Ú8oD‡ƒŞôLÖòíN6(èõÃÚÍSñkzÅz ô<Üy™ÓÙt_’ËåÙÆJ\ØIï¹úâkJ2›5_–áu´*ºK·Ñ˜ª‡PàGH%o•3gWkoßÕİª©1g;¹¬3Õ•çü™¼×Óröş¢ã_šù‡Ÿ*×Æ"ûĞF's»æ¢ì®J¢¨"9ùş²[k¶ºWí=á¯ßš¡
‹’Ê_,ïŸ°©°¿ ¢Šˆ9–ÕAaè' ¥cÏÈˆÕ’9riÁôñŞCv#WË>U‰ê­Ô<ZÎËË°jìaeƒ½Å„NC§¿üZ,c^¶W‘ºæ;k¶+Æ3Ğ{·ÄŒwâ¦EºÈ!¥SÛ×ÎòùkL×5Rø\•¯„ı­øÎ1Dd¿­ú•İuµxû<í”12J‹´NTÚËäŠ:m0…cÚ-™P¥ )ÔMõuñØ¬Ÿ·LàöÂ šï›ã"S›yñ?’M¿yvıäzVŸâª°,ø‹:\ÔØ—',¿ò'ô5äxàÜMŒˆ9m°µ&:X6T‚½‘ßSd˜á2>uü3å{ğN¼˜ÀyO8.şjÄuG¬è~û²kÉB73ùMe"¿c_š·Xl÷†ét•cË›ûÄƒËÀTékV‰yTÁ´¿8º(¬ûF½]!CV¯cŸ’útë˜§§Ò©?jlùr÷ßá(Ù­ ×€¸·*`­Î£î’tµíÈÑ¬sø(ãı‡Øï×óë‡ZüR¦o4OË~R5¿jo˜ú­‡ GŞ6ÀqïS-¨õ—ˆº
Ÿ *{¢Z·bA€¨ HûhĞ«¾6ê6¾?ğ<½ Ça<`^N¼,ÔáıŸ8’C¥ÅÀvq	øĞ–òâ;$Æ×?¤"¼(ã^Û2=sÇ{"gÜc@­«Û9ã$ßÇ·5û©’Q.W¸Q¤v¡vŸ
acJĞùAzÁ×¸ø(ŒÆÀ¥*¥Œ&ş£÷^Ÿ»;ÀàUKu”Ô7ÏZv·´,¢¯ŞÓÅÔ¤…&;éD¶xQßè€Š4úƒóïpÃÕˆğñ€„[U×)‚Cë	@¿Œïƒ)Ÿ’v*ïU­´
ınöÕ%A}/Á¾ó9ãZÓîä4ùí_åş	ª@ÑaŞd½êV•ÿŸÔ¾ÛYL¿xÌùpxÊAx›ËÃwLôI‹Ã1’²í¬C`Un^[¯ó†ª¼xçÆ¸®Ÿ•x2nÂHÖı7k…°¥6{·¥Ş¸3ØÇ¬ˆ³ĞÕÌû¢å„˜ºîEêà2º¾zî<KÒKl¦Ø”ÇìF\w©z„¸yíY8 ù¥7ˆZÑ4ÇyF±ª½¶qôZ&¤»”j?ùòÆB–X\¨D£
ínéËq@h@Xw\ç‚ù–d,İ¦*Ù–-l”Q
Kpı+è]m~tú~&“ÜéÎ,Aÿùù`¿1rÏ±
¥Å‚`ÂTX¶O4_W²_ÛIë=›Õªê¶_Wª>DÈKáİò•Î±çlõ/øŠ«Ÿòü\ÙÄˆß¢®¾qIş;*FDÑ’è_Ú•ÖdwV{ı0ddØÿÏÔñ×œŒFºR)OWÉ^úˆEÅè¼sÏ¡@Í,T[åj!ÄÎ“à4U$×Í]U.ƒr·ÖÇB½Ìóı·3LvutŠUÜö,¹íß=îı×†ÍWÂòÔ:{\ŠtŒ¸¿ÍgW÷ğü&Gv·– -f’ø+æB€B ¹òŸ3¸ÛƒDµ±|ö¹.{èÖq¹Dö&íªéx{,‚Í‘GóCüxÈCˆe¬cşOD™ucõÀJ•`ß•¯=¯¤R6	“äÆ°j•©é©;H²ÓÂ®aúsZ®&ë+r€)3â#œkALó:ô‹ì8Z6s«Šg8
vO3çæ#„NOÅ˜8‹¶~ÖÊáìs×.¶¦«o‘r‚†B‚r;îr{ÈUZ›ŒÌ“Ş\Û¼˜·pñ¡Ã¢¯ÎvÎ)d4 ŒŸ"3m”¼EË'î¦àA ùÀ‹û¼ŠwBÖŒ;F2&ÔNÓôxQİ`?ª„XY®'ÄZ¦9Â‰ÃÛROU­¾tŠ©{¬¥Õÿê®æ¶ ¿²XôÍùïf­>¯'F|
Ôı$Š9	*pN".^§04ùI$ºäòZV½C¿É˜¡Ş¨Ïv[Âwt®=¢ÒP‘Ä®5dÄ˜vÉhö:ŒÖĞ±×QØ4¿ †	å²Éà2‚éŒà¼0§áN#|K†àFçQ­@{‘ª¿İhÛ‡Õ±ä‡!ó¶ø{¨Üä»Áè:wösÍ†!Åàiıè¨àD’3$(féÄ½¶c/­Í›Êò'bÌœ¶’?ã»Ú/Û¡”\–:–æ¨Ãgİ˜òu9V¾¦…l$sY¹ü,fÀ}ˆ°CM7½7@j¼‹ajqhAç
¾\Hd]CgNÍÔ63Ê¾T{RÀ¡*ç=;"½¤1ô]øóvşìÂSF®•M!òñ™ıQÆŞ);øŞYÁÃÆ/{®zõ=ê/>Hd²>''é°ú†õøØØ ğ¢!2³+i/Æ ¿$¹@=6õ‚Ò'áö‰~øë¸¡>Zæ³}3*ÑXc_ç(Ìq³FÒ!‚hJÕÉÓlD´{ô™kFÃÚD)Â•Ìë¡¼œ£\c#¤–§tá	*ùWõ™áh5Ûå†BI“úhE¸'ä#•mÚûÂÄ;
>[Q~³'p~šVáòu#ç<wËm_~jsÑ–¯´Gîkc›%™‹( øÓy|ò–ş¤EÏâ¹G*'÷ŞÈ´å‡¤$é4ÇSXK =7?&ëT´ò9ÙZÊÑŠ zĞ}6E1¼úÅÈziµt6R§ÿæ+ÛÜhC$ıZ¯Ò„:¿ƒªşsqœ(§>Áô4šÀjDèİyí³=<Ï7Ù5Œç&ba“•Å2¤gGÛ·­ÿŠØÑ¢È˜?ô'/¯û$s!rWXM+ª•¢¾Y„ï£°[}!Ò¶‡ 
¸üyÃÍÍm®ÎàkàÇëıõ|N(n]s5áI‘ÏbèYéo#ÁÆÌÉxÈOÕ7îk@.Gñ$“²&¦5‘¤nPİ#ƒr,Ø‡Ù÷NPUà‘õ±š`ñõ-ıİqnûÒ¨.HéaOZÂÈ®ùô—G+& Ó—ÒLáêÆxZR!ŠÖQÃ^¿Áh£¤gò™2gË¡oæÁÃ*FÆÄ–?û¨›†kÄZ óÁ¿fËÒ÷ltµ0£Ñô84ë" W-7õbL2ÇÑ¤™]mÉõ¶ÜKåAFIöJØlÖõ—ĞrÆ¾Rd‹®&8°Ûó¤ZG¨‚‹»ê*âõkòÃÌ{Æ†uø=À¾GæÏ•q=3¹9ÓE²/µÌm?e²üöGÂ¸ <™’Èu_ø{¥%+ïL")Ò$FwÕ9®‚(/ËÀÙ¦Ùn„ñfnkÊj»xûM\õ5ÇûĞµSgvüVÓM)	}õ•(eØtß86Àö—E+Ê=x8môí«²İ–èKí0£Ô;´˜Fww`frãzÅC]k~rÿ{»>úµÄÅ¤/?úû[È[âÀqßƒª=è)ğ–ëÚbsÇ°hãÙmäˆmß„À‡ „ZÓ»÷Ê¼ãRÃ¾À…NÔÕe<!3D¨w^V¿úÏ*¨ˆ›¦ş]Ÿ ·øæ(Ê‰9Í«ëÄwî”áV±é€âÃ‹4ı‡1²Æ†§êü=F<]­eø¯@5gÿŠÕLÑ³w³Yüc¿êÙ\2#î×L6‘“UOĞ£ö¥iµÌ<’ŸqX¨¯ÃÃz3DiÌ`ö¹	eká0œB˜>†<ÅìŒÛ	1é,ÔİÍµÑÈ‡V¿?·ê²t p×v\y›Qâ\xÃ¸ Ìê»sêê;½İ}Z3ËÌ=©Š·Zå,¬«‚i\`¹Š-Üç&t~ËBçÊËÙÙî8‘äî‰›F˜CF9Ò¿óõ¯R‹¼¹ÑÚ…ãöŒéÈŒ‘#na®—ÍŠù8 ‡-a–í"Ÿûş,‡«UÉ„`ÄNáyÉÏ§?2gÃ 	Hù$ .sè©b_hÅ“-±iÒç³‚b–1‘}åu•ñc’…ù;ĞWsÅô2kéœ—+äyt%Dü¶Ş¬†ò:ı5™¾šü'7Ş%­ 7ãóÜMl7jhÄ|ê^?.h‘©}à';Eà ,#fÒ"®ÕkÏ°õ¾½/[¬Nğ¦ÁÓ5»„ŠYõ¸8Píßó›‚ÿwõ ®µÃ,¼‘YÄÊÖæb¼à¯^1Œb/÷Ç›˜-ör",oµ •ï6À (&äíbfd×KaêH}Q†µUµIe	òÕyHÂ5Y	2¼ÒÙ6Ğ»Ø¿8¬HŠóé,ÊiºìIÃÏƒ¯ƒÛË=jnoªõmæcø£D©¿Có“Øí…\m¹Yj9"ÇW]û»°ôÕhN‹¦½¦×®%Åñøeşwœ-kX£rüft›Ú	á(à7U@‹@uB’Oö«SÅdf›NÌ5ÒÅ˜›A‘øKÒ
ê È/ãôÛ_A üi)§ÊÕ°ağÙ€QÚApQ¿!ó™iÀr®ù{ô·8¤ÁCûëëÇhNSİ#e{«rL¥„FC^ì¡.¯}PühM\ŞjˆşÏ@´Dz²‹—"‰†äV>§¸:mü„˜t‘I•9À›*ÄuóÊÿİšR¹XS×²Ôiüóó/Å3UŒÀí¦°;Z¸ÁÃ*„¥½9çÜ!ß÷61,ö½x²}HãJXi@°5+"º5êÔ	ËÄú/‘sÑ–aqİXı²;Jú‰ö¨ )<‡9÷wLıÄòË‹ĞÏncĞVÖØ®¨„Sj! â·fh±ñÓÔÊvöÙºñIFŞ¢\AÑVñKØ({4íğÏ¢ïÎó•0"½ıñš^¯HŠ•[Ò/¨¨åGá­èP€Ÿ"6¹€ã¨±$©;‚ç¹Árğ†Yµ±ÃÊ»Rä5uf%TJÉ$8¬\î4úßŠ’ù‹!)Ş?S²ì…4ä	Óˆ!ĞNÚá$)’(äõÃNe’,À#À«½ù¬u÷º»ÕÃèã&¹Ş®š¼Â‹:´*Î@OJ.™°„§ş+’GN
½îíì9äÅ|`019eŞ[éåR{øUOuÛÕ‚c©JöĞ»BÈl¡/ÁF†Yl—Bb.¾Şôè€P¥KH)¼™µÒ¦PRâß0;È9ÀgÜ8ÆC:O~”Öıi€OÓòË™p“‰b¥gY`*†ë¼iö3—æ`8æärÇ\:šÓh¯2¦tç8¿êt$ÁÅw pùñÔ… r5ÁªzE\¬¬§‰ o?ÈùeÀ§^ñ öŸ	Ü TyI¹4 ôƒ¼I s®¿ıŸ,«Öi(òhr®Âá&9Ø‘-éÏr&Ã^cl9¡Küm±4¦ì1*E"øKŸ³©v€£àÜ×ƒ0ªñàäåÊük2XvrW	”ØQ$……ó;ªu¬lUà+©#—ÓÓäÉ£]oÚ²q<FwxXÄ‹£ÅÅâ`|¸KUB«z övö2YWC:LÀ9m¾h×Ñ½@+ˆã‡Ñ°E@Ö2”  kOn…‡ Ù(²wAÄÍÂŞàÂx§,8í}ïR³]û¤knW
{_43P†+HÔ	»¾'}x-¦È+wM‘Õs‡ECŞQh4Äİ»mp9aJ­!@ÒıCÉŸ¸¥ãã‡:³gö÷ÿõÿŠ,¥ÉˆPF¸OŞ9 ©ê/W°ÀÁ {U~ÌŞ&\óŠ»²yºo®à¹>
h%]K<oĞÒdN¦k‘’ŸğãU½½ØÅ'ü¹îæ`Zc*Æò©F¨ñÎ0
t4r°^Ü•íïêa÷r\_­°$ş-³‹Şu”Ô`û	ÏëqŸ¹qü¿Ò`äór×®“ë“JĞ÷¿úx®Á=!bN1Ÿñ ./Ô™ĞÔC‚©¦‰aõA")Ò8#o©íô]‹L…W¹âÕ$¨«­Ç²wVÉ·ô èÓŞzØ(şIæÁ=²@š8“È'z òó¸yş¥À7şİyıªQüÙqWÜœ?†mî®³b\ìXy­>Ğ‡FÉÛ¦î£NQò½Æ	¬º®Iá–ì®rœ!@s’¬{ZMavEİ=Ó@ÉÀÚ\ÿË³n-(t(Ë‹rü
Î\ğmõKöb}8ÈlğEû}Ü¼NZóáõÊàÌ\$Ug]°MÅ!ı×ş]RVZEé{²VfˆH³†ş
"RÁY9£òvªVT1m~Õxp„zÊ°8÷Øş¨~mçÄ=(&×/[@hËE	.9œ³™n;5âtòÄ6Ìg¨—k·‹XVJ}c+ÎÜË
fˆº¦™® IuOæ-‡ÖxZ¬]#é`Nûy£oëFgšˆ®ºğßtˆrÔîy–XÈ°¿\®0Â·iK¸-•ÀG¡É€7Ã¦—‡8»!¶ˆicSèGíƒ,>ŒáÎ×£ßÛ<ÇÀı·Pİ_Í ³‡Û¾®Xí6·ÖD
+ÚÅè:©ÖMö5´!Lÿªäİ‚¡<ş2œ‹Ëÿ^:¬5ü/ŒdıæÁÂFÙÌ¡±ô]<)¸VXm€öå˜oü	¶6a4®xë·GÇ¨§hrz >½Ä¶dcò%ÔcÓ‰°G˜3/AÓgwœH 0É¯yo:–šh‚
¿¡¡¹6Eó›˜ÚÖfpÿ›”&ÔcI!SQ=o{·øuŸÓQôııı1?ñPïX†Hïoy…xé¸‘¾ ]•ÈãŒ@z¡ƒ¦9´ÃX¸IÚ.™ÔƒÅÅ@eR¼!›‰ÜPÔ•oÿïÿFû’_`“¨ãÚãh»óg»¤úüŞ½2¼·³c’„#DCÒƒ0˜éIQ#Ûa‡û”NÑèj*®-ÁW·rJ(féıWe†˜ï=*’2”Bj¿:zÙ\(ŞiíÉ¶rïnÚ>‰•o/£¿¢ç—¿zjöÄ¾¦:.íÀGèQe.ÉÔIÚ¦ÊTzç‰¤dxL-ş^‚Âx+~ãN}È_¼¼øås/P"¨šYƒıü÷²ÔçpŒïìÄ“#ÈF„×,ªÖ²æÒmÌ$àŒÿ™Z±µ\O˜…¶,BfEÏğ)‚º}eÈ»ßw‘ş’8––Nr”u@óû°ñà¥ù VÒ² ¸äúg!by?ƒ‘ûzÍğ¼Cë{›€;ıJ³bZÁïÌëÁ@V¹>Re¶–\p$œøJ ÑŞ*ÕÔ{!P™«˜¤*â]Zëõ¡f˜¥ïäµHûiµàHõ:¤×–¿b}øıËgº[Ã¾t§î±Uõ}ğ?šPÀeÌ¡ô¬>Í{ˆbS¢g(Ü2#&0nóhƒ¤H1¥?Öûºİì[1Ús^7RÊ?†”İ\YléPŸqpbØ¹u[ÓÇùĞ¤ÉË«#ÿÂp‘tA»‘	‚¸‘×LìÎ]g™J7Æ´ú,wéxíGÙ>3|Ì•¾^¶]s½û<‰A~ñ÷WCëmŒ ê€„‡—.«ü©xº¡Şn×Sù.#Vño¬ël©x.Ä:ëªIlwq$ty7İ¯ÖŠ/Üs¤šÌa®Ãh5JÇwÄvA+ c.šrEs\ĞÕº
	‰óçôkI64ÄñÊ#ğ@_ÀûKÜ)ƒ¸¼j*Ó9AÚc†\Üò³bÂE¶³U)„0Cøo{SäÔã»¤¼]5«?r_÷¾…ü<ŞY×Âò:Aõ¤ØÌÛœ.œòurËıc+ıb*’›ÿÔ³aÀ7‹@4l,‰ÊBm9ÎÅI%òeïD„¼¸&vÁ–àZà#d¿ªÊ’¯ÿÖN^g—ë0èK¯ùS³<.‚s¼MĞÂU4jêl#6¿C7£P+İ’ÔÿŞ©[°Dºä !¥#A’eOÃ
<HÑ+1ÂzÎÎ
oÿOY¢ê7½èt	Eş¨Š©Ì“ æUj^I®ôJËßŠ¶sêÅ¢_Ôcé‘äÓÃH%¿çø!†Ş)¨Pî!ÊŸHİ=
íÄÊ=hÅò´îpñx•#¼ÊEQÓäTÍQzëˆß\Ïf'Üô²Ç©ƒ¶G§~ÆƒwèÇ‡—ëùg-ëqcåäú dËIµq}~\E{M>Ééš§h”Ÿø±ïÉ˜Š&Qëà§3Cw-6ìkæšïëÁqAÂš\óÿD_	MËáÍ2¤¸ÓÊ¶Uş¸Ä“d(äp¨0Cx­?Ê+™áÆ\ºáóIà±(Ò—1¬šô]ªnÜù¤ç©¯e©÷š¸¶ß©ÄLc»'–Â:teP|ğÉÀĞC¦Â+Åd²GŸV^7`€ªf™8yÊá~(èÖ®uI€(©ÍA%å8Ó)ßÑäXæI€Í™E‡Böæó)[É¯c]NùvÉÙ·QŸÁåL÷ÖrnoÃ^ §O‰Â«Ó$J+ıÙ?‰ò¨pŞÑLZo*eòf(j±• #.1g¯D8 ößŸŞ¨Î¯ïÀçoài›oÏıç.ˆµ‹’kG©B }ŠjKÍ#47ì›¾M$bòÉĞTZÇ'¾'HĞ?•Mô¿ˆ%]iãh5"_ 8%«ƒ û_<-æ’¡j‡
.»òHg_ßÕŠÁêÚ×›Œ¥Mi}ı<ï“œ/¨B¯î0N›ZÎ F½Q…=ƒjöù>Ió<“–VÓŠ‹«Jéˆ0ŸK‹Wò°Ï’I:±©Ä¥îƒT'Ñ\¡õBéÆôú9C–‰ñÿ¹Ç”µl®í˜Ç­“ßb.Ç×çIÂ¼ÌËÂªçR™£¢şârlœµº[—şßDM½ÖF'¸€Œ%5ıı¹§uPıôÚvëéO>‘ó¨û~^Tâ~„¡'šÌÄpk+5·p=Ç¦»§a=œzcö
Ódl¢zÈ¼Î¨7!Ã7kGOê—ÿí&ìs’1úªQÕ@D-¢‡ÎØòŸÒ‡´£1¯ıI« “Ã5J‡7‚—~SN(ğ~sg^—ñ9›Ş–ÅŞ2¬%CËÁ?™*2ªc42å‰zB­‚¤kÔê'
‚`*ü ¿i!®Âá§cµÚVÓ#•=6ª`%Y{ã…,k0DĞqpmÍ™õõúxN]#}šùÿ¨ºíE!6iÜ'Ñá¬5éúcÏH<“£ihP¥8ÊåJH”F4+Cÿ7vn¯¾°Îæ.	ÀjL>D/+¸eâ‡gÿ8›V}eÖÄ–÷-Ì¨Qµ®ößÁı¿ÂZ™>=‚ŞÒó0Í´–+1è±öB…Ñ·c"Ô¤"–!#’Óâ³ãQ­Üş
z9 –’€‚C(Š#ÉÇ-$Ò©€ôcd ƒyw]•ü„Mõåù9„]Äsˆöæßfq4R€ó~fÓ”Ìftx—Ï(Œ¿¢f“º3q7‰,£Ç’í§÷à]½?süÉrœŸŒ…øÌ¶ŠC´`Ùÿûéùÿ$%ªù÷òáq„ñ¤¶_ÿÜ_hàáË'Ã‹³”qh/SúÉ-­en%9t³ÍªdDµE4ß¶Öaé’¢Ãewz;.¸Á8	0xUrµó+è‰ÖW^daJ¼$pÈ&$Ğ„| P$;[iÁâ¤zï¨Q,‡Áb¹^	I×²x=£c¾tÔiA¡GjRõç õk”Hİï¯µ$ˆÉ$™Ìël«î×¯x	ùĞÅÿ)”McP¢ø¡2ş¶Z«scCúuhe®ÿNp—â™€‚ßË2]¦Gí¢<	]/ó2úÖèğN¬MÀ²˜	
Úà—Ç‘òŸRı £ıƒF‘Oƒ®„õ\lç§g·,õ÷ ÿå& §Ï~¹ó º¸“ ĞOßlÅïÓPİKK%hî:8®-=I	ü/AĞ—ª“‰ÛâV„Óz©Oç>Ğÿ„BÁÚÃ!íç0±í÷Ÿ)rÂÃ‚=Rc(İ&R³’ìİdœ&ı*©&?ÀÄWÜ8¾;ú	éŠéÔÊLM0š§$©+²‡š”TË…hWµşGxtÜşÈb…r|ÛXöìlfny½Ø¸vÜM¨8€ÿÓí`[ÒÖ­WEÌü§º6Œb›eØ|Úè
@®6Î˜õ¯jl<üì0ÒOÑ†`´w_Ï]ÔŠgñ¶s=a’Uw¸É™©R›<y-õ‡¨•m°ü¡õGÊ`V÷Oî1sÙ‘iw©ÊÇI—ÉƒWÎY)ÇÄ}ë2N è¼°­{.I1<¯Ib–ÿ¨¯½B	ï71é€2áJ3œ LÇèÙïßN%!’rØ—(¢Ä®âX)'İ/Ğ?ê•+ûèHı°„ˆØ6ÙÁàÜî±vM-™b¯¦¡6tK"L,áÜ¨/¢üV<î‹<G=Ræ/*³šÄ]E º eiéL¬{h~ôÀ†’lGŒÔJJÊÊªÊÓô$ÀˆDà®ö^—er¶{z±Aş0eô¤ÿ'¶?©ŞÒŸˆZt¹‰ã½¶¯×ßÒ'ëµ0ræçú:Eêiê¾ñü!´ïÌí¿„©óÁVLy‡uDÉ¶íÇq´æQSI4iãÏ—²×`³;öKW@p½{0lˆ‹$
¤¡1)bĞ¡@‰ñókê
ô”ú'O‡“¢7å]BBäˆÕÈ„iŸN‰£À÷a0«HÎ’ŸòbüÉ-éh^³f‘ŒZx­'qBšP(H­ÛF?SûV¡å·2àu )!ÖCJ¢’×É6•´¡­Ól«"hÊ{­J:ø¤’j÷f±ß:ÿá!ôş.Ø«úm±Á e‘šö¯>"Î·—ƒ ½ë<£<¼~»0MiğÕ‚)i^[hí­B•k![WDMà×oÆ¨ÕmXºÇr×„Ú_?úÉQ?"BOMûîi ²é<1:}ğ
9)ê£!ç¨Æc©ÆSÎÑ™Ÿ—<è7§nàãö²ÔÊ2³»ÓÓSi™yÙcs!•ëo¯ú‚Şû7¬ 5íÇ?³ºÁ#€Q| Ê!U>‡.YçzË.·øIC3V©¯Œm!C~¡]E2a¼æ')¬VÍÇÙÒÍÕº&‡r*È®Ø v“í`äi@‚\âó,§ûñE:‹5àid÷h/P«õËV}İÌ¢ÖÇù½ı#o7Áı¼q Ïú«¤ßÿúß¢™Xß@’q©Ş’ótÎxüŞøË½EKØLÛ]š	j,–(oıtĞ»ß AFÃG/hå²vø~áO›¼ızOï§œ<4–UØ$ë;ê!ÜÛ?á, Ï)­Š9b{ı¦Q}­ZÜêÙ£6ïyíøô={èxúÚvòmf¬d“[6sûû	gsuF$ 4Ea·ˆÆ±¸wûÙËúwAZtd)Òoo?ùÙ(xçH6W	`eÊ5(¯ªKŠ ( …Ğ£imÎR6hÎwü•iÛ¼ 6(Î¨i-)»­ç”€ˆ=\Tq½»Ê-·ã…Q­¤ò¥d"ePÊ¿9C-öÂÿû[1,&P·^óşR#Ç»ÈlvàîØs·¿ u\øT†œkâ$DWña»4ğÓšx©àÀ#ĞOš†L¶+ƒâmÏ‡~NïÄıl&9Oà’7C3–üèeVVïËWN¼·¨6Ğè#y.‚]nÏO[èãh>Y@2ÕŞŸvJwI éá\ÑƒhL’I™ßw¼$©b¨}ã-Ï‘Ğ§rÛÔğ¶İ5€zôş©ºVK­Yıu)/‘ø¥T7f	ÌôÂı.1  §Pé€ ñ÷ÆŸ´à(ÎÄBxjCÎ†i$¡P Rü¤D‹=íítbkxs3'"X´çï™ì˜7éZÁ¦9R¤ÔãØgíeßç}]ÌeA#¾<úT^P˜‘*Jl²˜C¸ªÌw•¦¶?Y™Xêâ`‘Æ+^ÈÍ#‰ÚåÜG‡âX§KZ¸˜˜/k–—çl³4ıôù}ì:X9ê°6G'Fwj~}Ù6ÛáêÙ?£o|ƒ®´ 'Ã6_ZŸÂş¸}§6®‰¾õ?¸İN2§4şèÈ‡ÿ@1h¤oË2ìIµ7«¨’İ»o FÂ‘ßPv¬~-lÉWŒz,ŸšÑƒN0¸Mnş0uæ©>6Ax‘]ZŒ\Aˆñs˜HfÅËZB=bbıÆ)rIÌ #c×s†*é‚'—+kÅ^şõ%«×)K=3ê¿* rÛjCyƒV·—öìÕƒ¶ãcƒ×ÿuêh':Ò¬J‹Bœ¬€Y|Bë“ÑÀÉ KárŠ}oÔÂŸ9D„ş?C‹ù·áï}Ø„Ùhõ"ZpqıÊã[u5vÜ·ØÎ¤˜hœÈHœŞÊ9«âÈiÍÖ¿¡ÆvÏtw}F(µò6=:M"G|”¸j|Al!Å=¨=Š»ÆídíumøOJ,&9{¦¨äÉ…Ë7ö›à8wBLgÚ«kgÁO>¡¶lÎmÉcé¦ŠW™Ø•#h'ÇbßZ¬º¨Ãˆfú«'-÷ŞµùB¯í¶6Æægÿî>øù­_†¨‚Ü¾7"±n“€²~’€„Ç|˜vÔör¿†Ÿx¬ÆÏ{O^¹iC|E¢"¨¿<“Ä@;9²ÊŠkcÖûû¥Jz>Æ¡Qgz`0DE¬s*À“'l³ƒ$¥Œ…uq!x½äÉŠe¢vì´làÒ;q`„šEÃ©¹7.†o6ùk¬³¹&¾	v†É£8¯q‘¿ßß J§,A 9<2TN:³ğÂL®ïTòÑÂş9ŸèV·üˆyŞ7§É.öşUáĞÒ%šÓÔ±øå1xÆJö~±† $É=À6Å@øiŠ“\’#Ë²yr´­j]Î›wƒ®X€(÷‹(tÕìyêÓ¶è—K7‡>›W¹´X ™ÕÚ°0	)G
 àJ 
6ğYDƒ8dõwx¿Yè§†\¦£¼TÛƒ»Ö†ôápqGğ«Ó,´sW‹Ó–ÿz´Ğ>Õpb³:×Y}œÍ‹¢Í9¦‡ xIM½‚q	Ğ»vGßôÔ4.zˆ€”>‰Ö‹ÚŠ~}`{óQÀÓr>Ç¸jæœâj”ÂÇ¦w£ÙgK§/¬ºœ_H›DéÈ8>#‚ó
EØ|¡ÀYoü*Ú­Ölî'+’[Âqí»Öß§xùá{iç¾Âª~×mR¥Òùƒ”ó¡¾îß ÏÍ÷×¬®¡_	+‡™EI`n„ã´¢şvçO:”‰ì¬QÔí°gÔØÊĞ6ãg\ÎPŒMªÎoè-Yq›Ö›ÃŠ†uü2Í0|¯ÉÆè‹>‘ƒÿü5,4ˆhT$û@¤ß—Ë‘Çá é4OæhÇP‰sâ¶ÌÛ{dšÇd+¯üB¿ÊßíHÕ6“{ÑåôİÙ%}Ù¯Nøô¥Ãßàæ ğ‰u?Í¶Še8¬Úéèdk³Ugj
õÚşÎq.âıÖ™áGd¡UMv¤Ÿİ|IĞ½—ŸĞ‡˜=şnw$<ş‚„òCN³5¡·+Ÿ$ŸDõÏ%ØÆ¿"&Z^»vÌxš‚eÒá9®{¯¿+H	ªã7ÚVŠ«œ4`"S_±KCrumè´Öpóxˆ1©½eë{‘M•òjFpi½È´•Òìe»ß,tªìjfÓÍ?¼<í§n	>xŸû?ìÉÔßİŞ622©Œ&¾4ärÍªé1!ïû[XÚéæez3­6¨y< L Ó¿›huŒ6òiã™ªª0+ÛNbêÀÄƒôÒ, ®Óv®q<TÂ¹êÑ^Z>;ÔáŸv|rô×¶mD¡fFlÒ-Ài,Èæª”JFêtÿÏŠq0ÌùÎÃ¶”İ=ØÃVòğÈ5õı¤
IÃ$
:Mi… ÃNhö\ 28è2ã5ìu)0o;­ûæVB0¼4Şöl8’iç¬ˆİ,Z2¨Rm<ÿ@f¯˜=®™›pª;™.‘ _m9†˜ÓMÆ&¤¾Ä‹atÎ’ Od£?İ^x[_9–5 \q¥Ø¸#0áZ^é“Ót4–€¡…:4¾|ÏŞ¾\³Û¶Wt–T]¿KjÊ¨#ƒr¯óû­–—J½zaÆÑ×`˜‚*Æèi8Îq6îÅf’¨·êLä%‰¦…´·À¹Bel€ô8êÇw·"¯7Âó¦$À¬ABÕ€Ü‚cîE»ïPÉÍ4™Ğ=™Ëv¬·å	lÁÿ«>©²á—ûşàRfbS]Ig«I‡¡mıè”*ãå@{¯Ì•GĞÕÁ ïvÛÑ=DwÃ/WT8@—•FWEJºˆ‚OUW«/·œk‹\-¡ªóAŠĞ6)Æ7pF˜üÕæ²8”‹0B¬Ôˆ(D¨Œq¼ÊÉWM,T–¸òì'ä~b‚¢ñ›h²­<"ÁrV[5*Šõ„áÑ búMÌ™ÓG¤Tü/e[ ƒèRÍLÀ'†”F¢Bhª¢âo6Ùáƒ–ŒrT76úı¹Ú+½+ß¯æDÃ]©Å¢+VjeoW%ï¬ğåÂ{¶„cå-|}ó¦¡¡*Šé·æ5Wcú÷¬R"4‹nªékËÀ’zyb"«ñBÜ&=A-k:SU-ôòAÂŞı‹ÍüKÍ“C¬–/Ÿ´.íØ*•õVo°$…›©O—/Æ;ÄùÅ¯ÏÏYŸ5]F{ù‰o<=?ù!•~r*³Ì3Ípøÿ {œá›™U7Pà¼´2ír!y'7.}r%ş
bŠ$m¦—y€AË"P@ª±Mì×ÄŒ” ïFwZÉß,H£›¨ØTSÅÓ‘™÷ú7>Ví%wGi9,…éRª‹ûºáøßI}6ª¢™¨H[WÂF‚‰.şÎFv·§uƒèJà,îh:k«ã_Õ®L¡o“4Ò—zúÉH%ªº!?6« İ®O¯Òêà£æ=8ÑŠ¤ ¹A,Hœy\Ä§Â~/lY€d¯‹7‘q{ÍÔ{¤Ía~ÁP}«
µ7);LñFTJšôfµÖ|Œ2Q}¯÷ÿtŸÌ2~I÷ñš‡O…ëı·@Ù‡,µ+şvIÿÕ}3–¶¹¿[†ÅúoD"n÷£ÁÇ|˜÷£±ì‹ä¯ûyü@¨¨¾¸“8øŸ)
;*Ôî[ó½Ê¾´ ¦6ÑŠš›¦œú'±‘L|Ôf~«%{±ŠgK®Ó”oìâãÄ
|ö%[Ş^iÚWV´j:‰À´`TpN”D;šLz?^H]‘hÄŒ¿”<°D*ûVM¸ìiÅ‰¸éàá&å•r>,¸«BÓO}°uŠÇU¥º)µ“cœÉ'§¬D¾Gls³†»Ğ7‡ƒ›‡Ùm¡ÏAiØQ¬­6Ô¸ÔÖ¸è·,„/ú©pâ(V»$Iœ¾uıŠqÅìäøé0pP0=@­şªLM1Ã9ø`Gg‡MÃ…s\{d®·”…|õZÏP5>ªc!«X‡¦“WÒÂ÷\ôD›±oŸãQÏßïÖwùù-Ie»ûk©}Š*æa×W ç€pÙäP¨³it(H7Õ€:‰ğ3ï^ÿDš¶¦0ãÅ£S&÷JmtÁİ«kÓ¤\wœkyÂI¯÷©uİªRJ]à/G Šç¹L¦—cq:o±È'oYs—L–4Ú1ğ"jm•So?'EÃš9E/Ì³]¸×s)¸}"ã~¢w£R¥0#ÑOÀımÕä0ê¿å´*‚²¨g¶$r™3gƒ
À ÆIŠş‹	¡?×\3â³!Ñˆ×rI‹ì®™Ôƒ¶òTrxZz(ã½îèZI±6h#*À|&YîùívÛ[ÿ’ËgØLÛU ®ˆ<G‡‰Ìàƒ}øüú·â7fêT\ì[2G4-°P ‘ØJÀà	§ƒ|´ÀÉEnäè•ÉƒøĞ&zŒ›nm|Ã–/ôìĞ'á”çŠKºèP,“Êâ©)5
–<vN#äsRäœÉm·V^ =©—îpè5 E°âhÙ)İ¶û¾oÔ<$W >ò#+;ûĞ]^&¥é"‡#9xI‘^y)Èâ´LµA+‰°ŸëC¾rùõX_E!ØÔ#§W+„2bETaN/¡O“-†`=NŸíZŸk¦ÖF§åç&öÎR— :2 Z¹©êÂY¨|hÄR”Yé~ù©HQ¥®D€ëÖ£haÄÀ|ÿv Šø¼V’‚¤½»Aõıóãr”ö	I¤„˜.Fc›éAë,ãÄŒ-«²p®¾¥ÿO¥ƒ˜oà´<EÅšíFÒz@Î÷¡G‡(˜á™:xç¶¥Ÿ0­±¦¥š­Ã¾ğ	Mâç*
Ô-;“°¬Ô@@‰L'ü‡%ûT™î‚—MàİR›o”5Ù‘u„×¥Ô°ÌW]ä>é”U´’1sßçÑ6a_¶MÄ¶Ö… 8Ø?€Ö:7‰dy(TĞHĞÙ‹Àƒ`¢H	Bn„º¬^”d´]“íSgĞ€Ş4—%ò‡¼Bš†ƒtqovê0ir½?6©\ ¿„"`ài+#çÊ(.ÓTäèıŒq,k*~Oˆñ:°å	#Ò¹¨Á§±èÓÏÙÿÇdEÉ¡M?ŠÈ’ùÌYm\Eµ¦>H*åÃ„A\¾ÈÌ·ºï/ªš%¸b(Ò\ö²ÏªXfØ/ˆ:y?£~è…z’›éğ–ªcH} cƒO¤h¶­ª\Şn#ŞFvE"r"ı#ƒÆÍôb7A#ÜÎº¡Xë7’™ıÊ´$>’ Y2ÌõNA¡ÀØ_Æâ…mú—Ğ“¸B¿É6ŠD*¿¶B_òÇYkéÀOLõd!rQE6gòJE¬"íËf‡¶>;÷ãÓa>ïÏ/@¡€o”U¨$9§ÔßI–æÏ¸ğåCD˜\²›êán:û—–ß4xÜø˜9…[ºÏTÏlo>²}áşBgåÄÉ¡á“²‰†s9éÉò¤;øÈ#Cëd2[ÇÂ©Ñµæ©Ñââƒl³î}QÍ’Lƒ3FûÏ2¢²YÌ@ÚPú_w Ëyèğ¬ÁíÂOáÄü/Œ²[ÑˆTuMm˜€Û|zm§°ó¼E¿1ŞÔPé~$È
Ë{™À,‰ûl¨ÈàgYÃNU†ptöÀ‚ü±¦.Æø´~j¯Ì`F»fßtíD1me{•ú<ß n±™ÃÒ¬ó2òÕ?ö5™NŠÚO€‡:Cj!M® ö\¦Ç•óÕğcJ…ÙŸÔ¬éè7ù7LÂ‡ÅKçÖŒ¦EêÀèÓ¼PÅÿ\R+ÊüBT
0K‹”ÚBuwğe®vô=)©­)Èd;WŸt¾„ğSÅ«š`mÏ#WnSêtœ«yJÅßsÅûØÙ~ÉÂTl9dTCY%&ofÒÅ6¡Ã‘Ç6†·“»Ï.¹=€ÿ­U7…³dÚ¢0ûRQÀk«­¤²æIvLFçØ\‘L¶z…ÚCÉ ÊèL¥¨lLEme[İßˆÉéÉ¾<s£[¨şç:’ô~‘ÉÛ­ê%™µ^ +Ô£‘Ù9©óçÆ€ÄÁèáóBè$xš¿ÏïI­–­5‰d7ë¢†ŞØ/@ÇÍ¬Ñª”ó<{p|T´õ|©$È%ó•ä}r‡ÎUŠ¶ØÒTn†^n²oË*>ÃÓ§Ú›IUoNZ6åcP–TkĞ6Iá~Á¸uRÉ~ø¸I[ñüÍ}ÀD0ÚjSã Èë÷TM©ÒÙn*SCıƒ8½C§ú‰ oõÒ²çD»±-08» Ó­6`8(³İ<š3FWëT{gvÌ¥)Øú/ïvwğéúìU½"û|(ÔrÔ„G²ƒ¨ìÎ¥ »aPé<É¤é÷3jÎB<’ìzÛ÷9ò®¾Ğj¢«`·ÀÒ·¬GO/NÑ¨Õò!U(¹ÄG¤òù5sí}Íå0üAç®ÖZÿw½º_a­4?î×´—SÓ7Ñÿ+üÓ\­Â—¡áºRiàªd!±*+-m2‰ñU4B'™õÄ.B²Ûè‚\ôò=ÚwÑİ}N9X®œÈ»±S•Ô–gSÄ¬¹Cƒ­.Iæ[¥Ãı9â¸O³Ôkİ£ÉşwşÏÉÔY“Ìï¤f0%s`’5káXJh£ü´FÙûa!ÂÒ*éŒg¬5UV: +8°˜¦ßÊ¿`£øùÕtn»¢4oVÑÉk’‰–ºn.ˆ“SÀDöUb-	ÇÓ5RÿõÃÃ»˜~góò¹y5%ŞØŸ§Z&Ÿ½áŸ„	è~-©xÌñV¡÷32xÎg´{â¢"¯º;3”âíı7g|í/€­¾¡³§w*X€¹#ÿÔØ,ùâö¼jJ\c­è,ò´*â-1öòÔ‚€Ø”«FŒEÌZ…›¹ÑÆ‘AW9á6æà
‹”’*‹ryhêòŸ	İdÃ)úT´f|0G>‘(­&Æ-·rÖÈ÷JùÒXßæ°@ZŸÖLÌ›J³b1ŠVº jGDê˜üÙá“q.‡ŒMczZÒ[›šT%eš{*‰ª¬Q—á´œƒÖO1šõ¿µ§Ë	l;	ÂãşMtõ‘	æZqëT —Öµ¥€tt¥0`¾ºmÎ¯†ÎrÏ;¯.«˜“Æ@lûx}faÁÄ¶½ìwqîÿÿyøÌûV=€«Îîõ#á(#O‚ç	¿µæ d_UĞê«ÿ Ğ¬.
R¨í"hWTN—½™v6íÚŠg¶£¨*6ZÆwƒ)‰{6Jåªôå¿ŒÕ×–åò]òß[^ÔGÏ&ñÆ5†3c7+_á1ÕU–µi	˜2«…s§€ü­Ï	ª©duÇ¯Càe¥ß‡é¦U—æÂÚÕz¹›i8òZ?èº¸OĞğğC¿-ˆŠ'uÒ¦‰ì—Ps—BgWCşm¢«5ÜPpÄ.–ú°ûÆÊgİ§®N9HÇûÖæ‹¹V×RßØ~_‰^€p.Ô‰-•<®4®… ¥¦ItãViÅ%TA][ ¦mT¡ §µ¯’Ëß¯¤]gÛÿŞ­zb%m “ÂËPü;»»–Á—çLÃà
¯Vy©&zh:ã°*œq“;«JzöeTÿr£+ÿmç¹ÉÚŠbé[ò™ÿ	-ıœûqÆş5- ,#\ûÿâ
*ıGR ıO`~öˆiïÈöÎbJ
lN­k?Ìæ#µæfÔÖ•6öÖÜVíŸÿ`dåMï%OàÙÏ%h€‹>‡ëŞ©ü¼€çl„fDr³±±x¡}¢¡V·º˜ŸÀÈ¯Ç+T»•V^°%û'±~¯P¿7h_Óù™›=ÙîÃuH½·•G¿Hëù7˜úµ…çÂÖ¥ÛM•9–¨ÏKí9V4l oÑ·§	ˆv_:ŞdbÒÏm§9¯§>\şÍÛ<taÇ†Pü® \ğä›Ï-€Èò—ü-A¼;àÉK>?Äª»™Cà¯EA×F§®g8 ÆyÇÄ ’}-ŸòÏÁşîhÚ¯êrÉŸ¸ø£·Ûâ
¨ÿPåªøb¤ÈÿQ	TUÛW×Û³eß°}ğ)ºDÓjÈÏñ¶õ¯uØ£
løõ¿˜DÇ¶TJdø¼0O¡	Ü£íTÃçÑóç˜ÓòtõàÒJÚnö+ù @eÌÇ|?_Ş#gÓ¯ æÄK#Á‚	‰¦xkíAİ|X~|cm@ù"!}“¤Íb'G¡XŒÛÁŞ]»ä,?³t‡ÏĞcïš—^]g× ënSğÂÜGAÖŸcĞ0Q®›ìùvı½×X;¼A;O@
ó.3iDÅ¦~«I˜ ,(Á†U §ü]ğÿ±ËéàÅ¾f‹µ •sáZ_˜Ö6c®}IÇéà³´×Ìén,õún5= ME¿ÚÿÇa¬ “	rõìDÀ‹GT†qUä5TïjusY€@FXH˜ÏçÚ£lWìY*x')
ù³x[$|Jyï;1‹>Â½ïğœßÏ¡Ÿ™6…XQ¯kS²‰CT<`
Ò‘Æ¢ğ£ÎU†ó3jøphìá‡ó›dòåïm)ı3\]RñÊ÷ñVùÍbı¦ñøºŒ!s1&P»äww†«ëÿşa!Àµ)—UDÖÎPÂĞ&c­Ä2‚Evul‘0•iÆ³*@h69ßıªqõN`ó%µ„ò}ÌÏõ€Ò²2‚³bkì™^	\7†'‰Ü3ÏÆ'gä­õ,p³ÒÔ*šbD+°/¤™-¦pö…'j6^‘Š¶©Ë×·g™Ñ' ¬\ÍdpÍdÔ¿±ßPêgÊıA‡hî‡Û2å8òYš-ù’lÑ°òç!®ÜèÓ°iºg>¼Şî½—mZşG¡ÛÖßN5rávî<ú¾NÃW¹+ïö3pºş¯±øcíÂ#ØÛµº³……fxæÉ¼ KÀc£€œşò‰ÛØ£U- khÀ+º¥Â’T"”‘Ê¡	ëk
MüóŠµ¯o3Äö•¦@›†QªÊ¸ûC„nPß±l’Z¶ålxşè^Ö·ññ"Àø!¯ªê|0N!6†»Ô6†—¡Ìc1~¬`P‡¥<| ¸_-¦*AJğN00—F”Ïú1¢Ã3ÆÅQÂ„+æ6!”ÏZUWm%ípê‡'¾{‰XÃ9ª ŸŸ¼2s¾4©Qe*^_0fMM’;¶QÇ—£¤NA6–¾½ï7<ï¹k©º¿/\Şu°ÄŞ£¼=[ØáÜ~%¿h	"L™R»Ï:…<4in‹ŞÑ7l8´sIÿI˜­)‘B©7H± 1WÒ¾^0//6é¶“×UÆ	¼á-Aà/ $š}‰ü³{®o[Ñ.à®íscÑ¸³màJ2º3×w´QÊ¨İ¸k+uŞ°±“È¶Ö`¾d¾^¶1(l4gĞ^†ä~ûy€g‹€WÕtÃÃüŞ9ìÍU^D­ÈÎT‘Z³U0~u%(ÁÌj1ÒéæÑ¶LÎämøªvÔ!´Ïï&¢øş=ÁDô÷,âîóê‘†h¬-²ªzvŒ“À-…„,1fñJËhÜOî]8G<nûK¦VqIân8úŸÎ`®ö(SuähFu´ub„·Šª–êÎK‚Œ ælêjÈÒØ*À áxFÏØÊ‘SMíHV¼Ñ¾ÏçCØ¦Ğ±AĞ™~¦©Ş½òW%RI`—®¿‰KÜzQà¯ÕonSyüSLúeî»/}äõızn6/76«[Zº4Á]¹'é¢)Í`·à«B¤é=M.vDz£Êä/.®=4¸4à¢•ƒ·`ß—¡óf1³ÈÉ¦_(ëÙ-zíTŠú$‡‹®kzQ,õ>9	‡Í0ÓeVX*SğJ‰Şo¹wUŠ1¨˜evøjq:8Ww}ÆBÇ¹NnTw_š»"V/¾é)Û|İÓ›½ZQ+\¬¸¨M¥ nWÎL¦©Ú&ÁU_ÖešÓO,lsÏõş4É4øËÉÅ¤ÈwuÂÌjµj¬ì¯«×]u"q`¯™kNÜäÓı³ÎüfX@åaÂÕÕ!ŒòôÑ]‡Ì½öÇ™‡““ŸıwNå¡º¯(Áïïâøó¨ÁèŠ…~µ*jš¿jšw¶ş~{ğ·5GnI25Â*†f5Î«Ó¹è¿¼5`ÕÕ¤¤ÕÔõ¾^‹;$|-ô {=´tšÌ\5^öŒÀ6F‘XÖG9‚0f²â”Cuï‘ÂÓ;ÑS¸ "WØXÊÒ4yP~E†C¶Ë»ËfÖ%ù>±†;x$u®ÅÊà²Ôß±Û¡Öœ<f_ĞÑÂäôAJüÜSA ©™– À…:€¥úI²ÀÁ.kµóà^0¿©¬c„.¤D%ZAÊj^ôuÅ‚t³èÆEj]¾ö“u1èüârôèb6õôı2dù§w ²î<cúá½è¿şò ähY ÍïÒáÎ•7½™€i½÷Ì#®¡JáãNwXŠüzŞª‡)é‡9Höpk¯í÷E²S$PísX$¤ÿ*Hªæ}69ñôBF{ÇË÷ÙàØĞ)çòyù/´DåµùsÇªHñRÏ®4üó(jØ¾'•Ì”A˜ÿZñYL;ùe2P*¡¬Hğ»N±	ª™JQy<n:ìóù)yâš¡H‹»|Kc’·7^FTÅûiï¶*à—mGùZw	Ä¾•ú:‡5Qé#êhOm¬µt”ªj?x“*"ÖÉßÎÖ,kÓcAÚíAXç³Rc„QT°%t™¤§ÙÉ%›€aèúd€`P‘éW˜
ÜÖo¤ @ÙbŞST±Q.dæ£d	&6»^± Ûç6&G©Af÷X·´³E†|ØÙ­‚1'u$¥!,¹J´%Ãõ¶@¶ot'äå•»·¿¶]0öJmXxÖ;c²¯ˆµ‰IM‹ùc°òéegˆï™ÑÙvuwt¾-òÚÌrzuƒŒ‚İÃú°RÓ´pš4'øœƒ/±<üĞB¶çİ‡¡8«zD¦r[yõZ¶À®:EüÀTßĞºË	¾bd
©)Â#pQXZEyñÍmpğŸ‘_‘¹àeT‡i/ëÚİ`“Senn!r2Ñ×”Ih¼$†–zí‘w€ÿıá0!İAkØ¹{ó6¿dÓlÂê>èßÔ}ô°J¼Ed»êŠŠZ£ßÕä‹,‡ĞÕÛTğ>S?êfàæõìèÌô3¼­qY7›p°<G¶|ÆF:¿ +¶ÍÎ6ZM>Òz¼¹A ¸PYM# ÈØî0£Œb=J?$\\mG”!¾Ü:¶=ŞŸ,éÆŞÚHèÅôbSïÆ03Æ*ªó
  ‰ÉöıˆÖvEcu,É7­iûkó183Ãµ58	K˜şH¸˜íŠ
åÃ0}Ã¢E`Çirzı°K¤7§ÓCY9‰!Yòf½¿âIÅxœïèÊ*×³M¸Ä¼jŒÔï$¡Ú¹@âFôC¸órù*¬ˆµˆ)SûØm¹F4#Pà"‹#P€“ˆ'é‡¢~x»òüÂ¤=$€|ö~´h„?4ßf2jò£‰|ÒäÚ
ÙäaàoX¼ûUùÿìîØNFöõš3ö©\bI3·&8~ÚÆÇâ.jşî?yªÒ·C@÷ "ïÏ5˜ny;‡òşé|]‘*íl Kœ¡üa®+gI*Oú=>DE¬ÔôPÁ%J<ÎG#•7ú6Šê]öOÅC-.––\"wê'¬©{Ô®ˆ=0 A=oÅ×o÷v§!c£%“!©“İÈ¿bG;¾Z½ÙUÁ›z'Cùà'³	;±èË1›$ÎLÏ¿ë°¢®6ÑñiÒˆÎ´â3>|÷ÅÁÓ+uÀ?aÅ„®hÃĞñLéÖé™Òà¶v0õæ‘g	 “»:úÀ”É…)s$I«¿%”ÄÎc~ï÷q§¬˜^_ş¯©Óo%»Ùê8ŞÆâh8N´İ]=Hia¬Æû€‘[Õ’&s‹Ô‰Æ>oöòŸ¹¢š=óˆÙáM¥®SIŒM%Å Ãš‹ºŸR’f…ø¢(°Ñ°ß_ùè/³“¨LÆC-úÑHûÑŠåµ¾}+lèÍÖ¤¤9Î*eL­i]8ˆaŞ#ìïÍHÎD,`RˆèŞW¾ÿdˆVÓ]¯PÑ#i¹ŒÃ¯£¢ŸE¼Qğü\½€^ŠBÑáª¸Ø/è‚<–?„Å³¨vY²E=.^f)±×X‡š(Ú'H‚´]¾s0qækÜ\_gÔ*V}Qb¹–‡%AÕ‹-:=ü…¤(Aye_õK÷4…ĞâXñî8ÑåPŠš×ïD¶›ê%¡ó6šº˜ÕNsQR'|¢e²Ã¤,_`ï½¢¢ iJ)7e®1d$3Ÿ‘ÕóbúGù¯oº=ôB|Û‘Ô¥Ó­]
lîíp@vSWØ_°ú+6|ÈfÖ3[Çr­•³T[U—Võ€ PÌdŒ}•ÕŸ|@vT/‰CNlQ'”ÀE®¯h3£F¬a+*vèò›±Dww'>]²ªä¾¤Ñ@Î¸Øzh]': V÷&†ÔĞƒ=smô+—üP]ø÷”‡|Â±i47²Hº®Ì(ë?*ƒµ±¨Å,bÕ£í)3á.Õ"#oÊğ™ ®Ô‰<Zó2%!°Ã€` 
nì’ÑŠ.‘Vô,ÀÎ£Ì³#÷(Rü¡2·k&Äj
@Ümw£Æ5“Ñ;nê¼·0Zuq—^ùQŸà¨#d&d¤ıÇ¸Ì$ò“\‹ŒiĞfÆŸ½NA@ tÎØÔ´`U‚TèS–Ò‘–ëæLFè•xö€R}r¸`RÁ»À 	7y=yãgÛrêâ Hw8½OHÉ'U¿¿Á"x€øÃ>=' %%k¥Ô6ºe;õµóµJ•œ(F´>â˜ØlÅš¸7pZ AĞàèÅ2åîRÛ|C{††Ş¬è0ĞÁD=8s¿œKM&zÄ2{ùâ8+Â¶ˆX”Üï!'C÷ÉĞÑrNc§œŒÎÃ:TÌ ‘ÏqI¹S?FTV_ÊÔ¸Š¤ @IN¢õé·}pvëú¿gÂŒtà-?M9L”mö­ø`-3)Û[kxJ\ÿŒá1É-2bòâÅVˆ/)#˜ş)T[ÙN³1ÿáÁkYî®'å£MïŸMFáEÈY½Ò9~¯fAcY`Ì¹înX,BÇ“]¿Ò»ùåèØC~¿AQš=(1g^ˆˆÑ%°˜ë|»s2ú†–3ÀïÏ²cQÀ#c4€ÔRG!~ê…>¿HKÕ\Y¬88››Ø¬Ş±Ø€û ”ÚŒ4úŒâù7ÖuÓıZÏxÕ~dØò¡‚.wŞtŒ›ñ“ŞL@7ÊwÊÙh¬‹†ï£=mQªZ¿ÌÅòAwº“Ÿ†nÜ‘C³7IT¥òÔ÷VĞX°ºöÙìI™\[gî§šÕÆ¤öãÔÑ£°^„çŠ²öútD„³õp‹ğ²“Ll‹1şlBùãà¢¢Ñ¨²ö82C|b„KøÏÈh+/qäÜ,ŒÇşSFo9“'„SïRÜ;ÿ@a9=s%Ÿ9·ACh°I%üµT,?îHÒE˜6!•	„Px…½¾M¯õ<¢œ`_°«aÂ&P|q øÁ“‚ôÉ+3İ¦ÀÇèu^ïİ&sì§ÄÒ¥şMğ£V¯*H³™‰E$ö†ÊHÈ~ˆ®"×x]Š¿Ì`³Äßê_ŸŠ]-ú}ÀÍÊğf)­µqİÏåµ6LµG%s÷"Lƒ‚ O±ŞV`(Ú?'meô.Z¾µx1 uİĞ½ÑMô‚k /ĞÂÆ/b££aW¹eÁÊæ–‘âÊÈÇQz—'CIú#ÅL‰‘Å¦k  C’[-8ï·@ø;eÚ|ÀsË0‹óVx.ÕÈqÜÙCæz]Ü“ºm’qâ3¦RŸ®ÒªİŸÀƒöÿÌrt7&q	9š°}	¤´…„‹5¨±Õ{Ç#õó†aèeÛ¹Í:èIû(ò´ŸVÁ$OWâ¢4—"ÜÑXìêºÑŞıÃ·uâp=ü¯¹…ÿXkôô?©|)•¿æñó/öÜü*±îÎ:ô|ßÖK‹i7i.“©Æ)ÈäÚ¦õãmÍ8 Xò¥îí Éxæ[Àİ³¦n eTO©|’'„¦ĞŒTM€„<4Š*fÇº³iVŠjJÃ›“¿gI‰·Ç~°Ï®ÏñAã¬‡fÏê×3·3×_š{|›:ÙaMRÿKüêú~š<|J"E:œ K:ÿƒÿ³wënÿı/¸0	¸“q±HV$ìúº4¤$­”F À•Ø/xûI­Ğ3eç­~&@wğláŸ•ÚÆUÛO5Íœ*ïd´æ£fJB…FŸ$—ï­LêV²0¥ïXaŒFÙĞ¦ÒlÓ;eºIÍ·Tñ¿ºMsNpo_IZ4TåÀ›…H+3é.ƒUp¢»Ğ´¸ÛŸ›wê¬û)ĞÔœ¬°û"¼‚ÓQºËûìùŸ+¹ æÿ^•ÚÈşctî|¦`^
.Aßÿ*âäå{êµÇC°>hŞhë#µ€ÃãÑy×ˆQÁ‚e3åÿyĞRüàiÿVGìzBeŒ­©·•é«®Ûô"Ï	bF~ÑÒúI¦åÏéÏ>†áêy2€'Rûİûãƒ\”ÖæaWÎ™°âqKˆÜ¸L©“£hJq\ù`wŞn'×ûãÈ¼TÍå¦ÍÀ§]ƒ¨G «dvèG¦%M(Ic³ˆr8¶‚À`ÑªóíÙşœõ»ÈÏ÷¶
a!FF«õµ$öW”ATÑŸ¨ı(Ó¥K^E^?$Œ&¿Q°<œÅæ›¾ŸQÂb× ğç&O÷ìšj¼N\Ëiüp¯a?ªN³,üÒm+â^0…QÚ6áÂı),p½e(_÷ÅNµ9¯Ö²aø‘ÖJzîƒ°Ä“,q ‰LÚ+³ÆWó€K>å+¸IÖÄÒ¸Ù&Îë%éÒØm¶ûD8;¡ÖÆDŒË‘¤Ê>¨k½A»©Åu.j
2q¡$¹ïÈOÎÄîÇf“áöQvğeGÚ´Óã±h²ÌWaâ÷UĞZŒgÁk†#ätÙíl9Î¿özsËşE]²Ö
x<ÉØ<¹C ‡ñ¶„¾úÜ×TfÚ2§O‹óïr‰í8vöyÕ¥®ÍA4úú^fÎãgXj(‚QÀLöO·“ï5‰7›ßvSiR+±IÚtpO„ìöF® ‹ğéPÑ[Ğ¿·×ì³X	ny&ú’_ĞĞŸA%k¡şÁÅû1F¦Z[şÓ™_Ÿ­ü}ıµiÃÊñWÇ(R¡a'»l¸]ğœ²GòìQÊCn¦ê_Ì&EFMö¹ıZ]¿N, ¬6(ŞàGä™—»±§ª8õÅ8wˆ3 µ¨1|Àú=.^t½ıBR5â©ÙôÔœ‚pÄÙÉÙÊ; pa„º€¢P°üi‹N"ÌjA|{í‹¯:ê4±6<î{AÙ vÈPˆ¬Ğ×ÎIx„³ÛÉ7-::zğÎ€âxà—úØ1/æêğ¡-Şyï=ƒúÎ«Ğú÷M³Ãyél R`i
ì¾ç]rŒ(ƒJ†ÛN¢‚XüuF®Fö0æ{ò½HC€Ş…“Í8MD¡Pe JíÁáó¼—öUà%ØbS\Îå­©_ıÇpÓºB&(nóŠCªyâoĞ–ü·»ÒÒHQäu Wpœ¦#c²úí“ğR#]M¬;ƒ1z9GçjÖ…«kß3£8z³.Â®Qéhá0¶µ{8O‰şg“Q0‹eîw~om[°İgNg«®ŠtÅ¶Õˆ	,ƒçBqçG 7Œ‰Øhã[Ës¡Lèz9‰N8ŒT2…ïÿè]|rå&–6‡HWkÇ¯¤¦K˜Pº_Ç[–OŠ€4=ÌŠŞö‘äØ¡)Ü¸3‡¼şK8dY¸ñª=LKˆã©AŒ2d÷Ëêº_®/:\_²Ëİl{Ù¶|“Gšà»d¼‰+MBıà¾æWğÃ·>@6“Äô}CãnÃ9Qkdİ,ÿ¹.š­6î-aaq	õzİk–òkJÂöô9¼<‰G¾\6‹âxw‰$¯½ù!–VÖ´dw-ˆzX;¿_Ñ~0ù!£~®İš—é&:ğÓûÆpxj©T:ò*l:%]¾ya¡ÏÑ­B.#…×gñ³_}‚¯?wv"1{ü4ˆRdÇ‡D’çt±NàÉŠ-r­jt°«•*,ÇF!ã V[Ã//Îá×Ÿ^ÁÑ™ƒ(M–Ho$Ic@t†w9ÒdÅ…<±1ÁèrY,,­â½K·0s ˆó§{nÜ®NiÔD¡b+GÄ¿_r¥VÖj˜_ZC½Ñ"­@îU³E$©iïËâôÌÌ­µñöÅxû½‹82}G&‹ô¢Yn Òm$ˆ5I²™”#‰Ã<iåjï~t3ûÇQš˜ğÛwéo£HWì«åœY"G8ûªãx‰uÈåóxæäzü,Ş¹p/¿ös,-¯àì™‡Lç$ÒÕ&–0Áj†G™Ö$7’à2yú¸İjâúİ\¼|OŸË!ÁÓäíøªí¡šo7‚5ÆtÄ·ëi	›,O[L¥³˜™šÂ¿yñü§?ù#ŒåRxÿÂE4je?Ø±Lüs<G‹÷¬Öê¨Ô2¡ñıË³D¬e!vs]üDº†y·ÿzbºîÃ'ˆk¼Ö$B|Â‰@Ò¤+ìD
Ï~é‘e?şÛÿüÿøàâÇ8wöaúZZ´Œk±Àïø2lI˜>ÕjË©>¹~OäsB<Ûv°gE-ˆ^Ûz%õ4œñ;M˜ 4–w¸ƒAK\.‡Ècái¿úÿG§÷ã£O?ƒËVÁ¯•7ÁüÇä¾öf“„£‰o.cmm­F[;
•#Ğyë“Ãõ× „»X¶×Eı™ ½I.ÔÌÔüÅŸ}¥±®\¿)ßiû=%Ácğc;#ßßjÔ±Xnâæİ%´ZŠ­=éJ¡o=í$şL—5È²6üy€;2…?ÿæ‹D†6æçÄ¥²ıÎ)ã'ù=ÇI Q-£\ocv©‚Z½*ae%ˆbÈ‰ñë½p-‡v½2#;9¯j©èÓµzO{ÿîÅçq{vzIÑ–gAÜ€l6jäV¹Í&f—X]­ˆX7nü´cbwdéÛ6¹ğë¯ˆâbyUYò_Î¤ó«>¬VPL¹ÏfI¾úÜcxçƒOqmv'ñÜªfÛ¯ÁêLOiÖË˜_+`i¥Œâø8’ÉËìY‰‹eôÚî!¡ûá±£#Øy_=›=[|6ƒÿ‡/Àmsâ±,S<%Ş˜îzáJ¥†ZÓ`‘,H­VC«Ùüß®D¯­úâ®Ÿó`‹á	u7ìŞB;ŞïâDãÉã3xúüƒ˜›_ò³êúuM.ve×Hs«M"HÍV«“ıQkX\¬h¹{Dœ#ëÆ¯?´#¥»}\¬ğ)ğ4ËWŸ=/ûëµÒ©ê¦,àñ’M.VC¾¶XÉ¡V­¢Ñ ïËd$c?À?>^ÑRÅß/ÑV$9F¶ŞZ2ÍÄlñx5È<xü<1…ù¥&KY²$Ù”ô°³;Ö¤k-åj$ÔÙ-³D˜F±ÔaÚét^µáÕ›qŞÚãJÉ	‘íÙÇÆòÊªô°	’‡±İº„…—ËDE¶bèU2
Vô#?È%"ŞP7ÌXÛ<^2Tnf?Æói¸­6R)ëd9ÚA¤…Vƒ­
‰ù$yØ"Ë“Hº±":ÕD±­û„aİHE‡~ƒİèÛµˆûJE)A¹½¸&¡\ùÓôÜ"HÒ$ÂT›F4H‹ÈbÒ&ÒÒ»§£¼:´a¤Dºë°¢õp&ï6L.—Mczÿ®ñŠ„„×@âÄ#7dµˆ€¶ƒ&‰xÉ¨3˜ç0–Õ¼jA¶¿ºŞï„y½Æl™pÔâvòìNñõ¤ßm˜ "3}]W®Í!ŒKÄ`ÒD›¬ÿÌ tzL¦Ô„ìô~ó­¢Â<(÷%ƒ?A.,WÜœ $À‹c9r¼¾dÒ	Ğƒl&‘#\¬AX´æèÄP¤»zâ·}¿Lä%UJKüê[ùºÛ	ù†š$rmúøô³™Lš>‡wñİ)İCoØÕbBIEqLÎŠ&
GÈÇ
z;¾!Û«Õ`÷«{Yt7œ^MD’mÒœ‘ €„Ñ¬/şoŸ‹¥Ø©«aü‘£nğ
nü¢Å­f78„­
4y3Ñu
2­.+›/Cé£`@LG¸…ğ43%:	q]¥É¦Ô³¤’×+?±"=&Æÿ÷\˜`†#;šÀHõ5¯"ı7ÿ£ÍĞî£N‚˜ğ0v¯4èéVgz¢1[¾ÏüıµFCF qË˜NA¢ëe#¥ßİ±|oıyüíñ#4†µãûå"ë†ÂÜ5=eêÛ+Ôàš«j½,	u.y‹á»Rü~ŠKá¹óM!Š4eIÍ—5¿}·¡…#‚ ™Öí(s :kw‡ÇIR­ËÁç¶]R¹~8™E9J&,z%mË÷JYıĞ_Õ jA:uƒaÖ<æíŠhaûG|à×ÊU¯„„ş.?	¬—¾§2ãâ~%¬‘(G‚Ş–Ÿ1¨5Q¢Ø–‰&ûßKÓ3ÌaóûÌd[«TeÚ"—‘4ej£ë5cA,‡çúZHYmò7üÁªA¾H¿RÇíø~E¬B·Õˆ¼ß3dî¾ş5Y‚JµŠj­ñBA¬÷‰pO[ä¤a2CVƒÜ+N°sß»-‡Ö@Cİ¢ØÖqqÑ§ÄéÖä-ë¶¼¤PÈË‘6·Õ’‹Å%%©dcôù´©IK.Ow¸VË‰Ï±ÑjŞp±º,:sy±­Ş*[³™ş ª•šd&?†Y¶"^Ö¼…Lš‡Wg‘Å]²i$™ ¶Ó©ÄY‰A\UéÛ¾_&ªG‚I&A5oğ¾éô„D§.Ş÷±éçnÏ-z;@üpoSŠ½ïD©D¤k!í´Èrdù'»XLÇA¬isã8ÕD±“WÑ~f!*Ø·Ÿ•¦Â_¹~ccù\´—·³õ`Îä‹“Èš2’äŠ%ÓiÙXÅÃŒŸuæz«Sj‚°üÃ¬ŸjÒs7»Ï\µ¼ZÆİù{È’ÎàaÕÕjCrõFûy3"cVI‹$‘Ng}‚Øaçï şvµ ŠY”îŠŞí»	ğ>½Šz³…\6‡µµŠ´×²8ç9ñû¦¶ÛÈØM$Èz¤3iO¤Ûñ:2æı‚Îp°õÉsï­p×Ÿ¨ãhyHtN—ğî¾_ÑÁÕëáv·«_½ÿ}6¾õàìù¥k·È*$Ñ$«±Já÷soúØD	™ö"	u›È‘E&“b,k`êÙÄ²ajwLI84áHe,‡Më<|ÜŞ%ÈÂvyeåjUÜ–Éâ˜¸,_ïÄ‡•wrx•tÊÏ¸¡ş^âEï9¿»*h×Øè^ÛI×ïÎa~qSS°R®¡\©Ê,˜6¦§§á˜&òV•Ü¬<²daÒi—¨‹l†à¬hËíoË·	ğ)Ø§¿}wßîĞÛ›³sôvK+«2ë–»÷xq&G‰8jÄBy|,|.‹û&phj?Âáéƒ8~d:lfêuÌM'cÉ8o>WŠŠİ¨>º$ÄšÃ¼•jMæ^í›œ@ab™æ"ÖB.—C._@2•
G›ØŸŒ›Hß¥&’e¦ÆyƒJ­÷/~H‡î2®Ş¸-®Lnr¢ˆƒ&qìèó§¢§ÒIÉ'ğ„ª5²¸íÉmË€è·ßû¯½ñ6Æ9"È~ûÉóâyëÑÖ·Âšhs“…uı½à<Æ‘÷Ú;(øwXZZE\®dÂÆ¡£Çá¸M¬
Y²ù¼ì^ç Ëlù‡ÑÂÑ»Bì«_øä^ó—øğã+òd²røĞ4Î?vmJ£“°½AĞa	¹	×…Ëcı(cñä–lt*¯•ñÙµxéÿ¾‚–Û’Ó¶Õi¹BI¦ÇW7÷7wRsõÙõ[ä6eˆ¬iÜ¼vG¬ÿ›§:‰<¢1Gnƒl¡€|aLş./ÿ?ìB¢pD=,:\IÙÁ\øø3¼ú£Ÿ‹›Â‚öôCâàÁı§÷E;ğ!o·PgŸ¾WpÃİÙªìm§µüp"—~¤é`¦SYÈå:4}@jŞºs—¯Şì¬c6n¸Ì†Ez´ÔÄD{m¬æÈ¼;¿„"éŸ¥Õ²¸l¹N;7=sVm‰´G]ªxó…qdsÒ!)Y¯0èÄ«ƒãFir‹î-ã»¯ü?{ç&È}úÊó¿ÉıûD`WëM,ó&&"F»åv2Í|xÅu·dG¹ßİİÕrl¯B¶å
²¥iJÂ®-VcjjšôÉ$Úô@A)H$âÛ‰ˆİG‚ğ¿Ç“ÚıéUq×*äâ]¾z+Ë+8¸ÇO‚Õª!gÖÈ²d066NW™t–~gw³xdt2…ÁAæÈÒ;ï]Äÿúî?¢Fë¹g¿„ãÇŠµ`ıQ«5dlëVo7¦· Óò‡¹Ù–7è@¬7'Ákãı|“·:‘¬ÑlÉ,Ü¨Æ`·l¬«ÂÑ¦®z¬uVÿL![§«¤;î-“Ş Ç¿xéfgç‰x%œ}äœü~¹ö’DĞòDñâ‰ó¼ä>,?,½+g%v.Ö(	qŞ9îØxõŸãÿ¿WpäèşÕÓOJÙg¡9óÔ.YUğID:o-±lY˜«å
]5	åÊcn’åYšNŒŒ;]-Ó!’kÚ]‘pot|ï\,Y§F–‡#j«å*.]»{K+8zx§ÏœA‚¾®İéfL
ãE±$é¨İ2úñœ‹5*>–äü÷?ü	^~åu<vşø­óô
Ş ?~YfÖºŞÍ	BfÁÿ¼¶ıÍMË«U9 |¹şTv³?0!°ˆˆpãç6"_‹äêÌÂ¼üe&:‡WIü?rê	ªŒ œúŒã") 4YB±4AÚ#ˆ\íæsË0ïğ{X|hS‰$şé'ïàåxÏ<ı8Î=z‹ËkX%ËQ'LŒf×ÅŠæÎ-ú'L‹\¬¬Ve&»S®?‡ªc]ıà†ÄèGuŸïÉƒ%èÕb1!Oœ qŞğwòZµÊòª.iŒäY"Š“ÈsŞ#‘B0)e×è¡-·Ã	ÎSüâƒEs<öØœ?w‹«¸G‡œŠsáMT7½|ŞÇr3ÒâÒª#°¶eõÔPEEv´Ï£?9¢÷®K‡ôùÓı½#97ÃßY¯Õ°Æ}æ­ı½	$Si
ä8j•L…­µ»ªZ¡»"œèûÖ÷^ÅòÑŸzâq,-—%$ÃŠˆoËßÔ$.•í	póÎ1¸¾‰]£àûû»P}ˆaºV÷%SÄz“CË±Ñ}æH™?[—kªR™Æ„hv§8[î‰r{(£˜Nwnp®àû¯ıËt¸¿şµP¥ÃÎál4‡aùB ×Ú÷ve¥‚…{+²I–+3ÖÏº>ùİnT¤h½«$ª1B)n"ûlÃ„áÖú4¼€AvÊAŠsğ¦›xÑ6KF±ú¿\±kuõÖ,ŞúÕœä´¸·fç½„Ÿo!‚|Fpù][Ö–¹˜¿·,ZCc£ÛôÁø?Ûá‰éÎißÕ;¤Á£º<˜¬hmiº{-s,X=ÃBÑéîC%Ì=›ğÖ/.ÈŒ¨GÎ–ÃÎ¡\À„Ñ&+’Ïr\­;;¿$V×nş:#úñVtF·¿aºÄ|¸3Ärü¡rî¦S#“§5Z¬84`×beu>º„³Ÿ"k’"Wiíu5ã–7A
-)ö»5wO¶/Ù›‘#ê"EÜ¨.’ô; ¦ŸkÕó8ÁìEÓ£MF*Ò‡Ê‚Ø˜[¸‡ÛäR}é‰óràù
’~(ÏÅa·ª\©ãöİE¯¯Otj#÷ªÛ¢t[…¾aŞ>ß}±±¢ÿÎ6'+ªQ‘¾e|råÆÇ
R€Xõ—W>{4„täİš]Ú(;ˆPõ†k»"U»	±±Ö%Ô£dê9=:©r/‰ô!}ic*\¿yGª\“©$Ö*kòÊ„hƒ–VÎxs—à-±í0|»q¸v#ÑŸ ë¾¿¯•éÖ Áç8iiüui®Á@Fó|áge·]o}èØó›wî"NËHN®‘êX+òL
&ó¾ä€‰Î]ï\™^Ò#¾û’#Òu·B‹d"ƒ¤Õ’ì(Öp>Ò;^o"C‘ ®²½|‡m{4™]\F¥Úğ·1™7Ê•ÃÊå%V¸ĞÆ—Ï}£XFÂÆ€·ÅI~>(´ê²0ÁûÖzk#~$Û_pÛùF/:YqH"XtØ¹„-÷€»m®$³|aÎuUK«k¸·¼æ[·OF<ú±Ûe1Ìı"R},F¯¶ˆZŒğuÆx=#Y"µŒËu9™™ôHº…ÉŠCïbA§»ÏUWÆÛt%X^Ã—¤Ï-®„­²›â>"¼Ÿè²
İ.XoCmtÚ;7håK%$¸Ì…×§YÉûı-Çô!4ıœ[ãA>Èõ ´ë4)0¤ÿ-¬¬HO†îÇØ€f‹Ä0ıˆaº4ÑºHX×HCoÁ&7S‚8rı¬|˜¬Tk-È±ø`:‰¤Tµ²·‹øœçXXZë>¸ëuŸLxŸápıHÕ¥Õ×¥÷mâ.Æ¹„ùñ	ØíV›¬]’~c»]ªşy•d83¼üª»¿4!3jÙ¤ğğ7öïÄ”ÅåJ$jÕíŠmf1¢»@?bÜ¯¬dc"ñ˜ f£Ò¾ı(ŒMÀ©Ü„NÈHQ;áE¹úçqVv]Ÿî–‡5t=\Ş¾V^“‘>¼İ•‚\¾R®vötDB®[ÑÑ…›&¶½ßğ·ˆV‹
ıÈ]ª‹§'SRCÒ­HG2™–NH+\û9ÚWì2Ìïƒ“qœ++k2ı{C¸û'"Zè£5zGšHÄ*ª5¢F`0]å$aø·'¢)´’]‚<ªçÀÁiŠ¨/ I¿+O`ç!Ó<CZ¶®aŞÏ\”¸¯TÄÄxsó‹(MxÛ]¹‹Ëİe™~·&’ëëc=úå3º¬ú%*à»Õ*—Õ×ªUäó9>y†„ù2R­¤ÆÆ‘ÎåLed³Áè— ¸±œ¬8¬¡ƒÇûø8ï¾w'O–)$¢=$Ÿ×©ê‘›ŠğˆŞD¨Ö&ò¡ß±^¯‰e;qúœL?L¬Ü‘AØÙ\9º¸uv×ÆôìA•®$¢AØ:ö!Éf_ºrSfïJFİ
Ü)×?èngõ@ğy?“Ş=/·wnÇ²˜°—Q}ƒîQ>Áïæòb›ZUş“gÎa¬X‚³z]Ö3gr™e•ÉåE¤[2ÇªAF2Š…áÏ³Ş8<3…§o¾û>&ÉÍâI‡îWqk6®¸E7,ú”ìvî—ë-ÔdËÁ'>‡‰}a/_EÚ­"CÄà0/„÷xs¬ö†*Œ!AdHó?…\¤øÜ“çññg×ğîŸ`‚H^ˆjõıØ8ì{b˜ˆaüD`£AÄm X,âØCç/`-_Aª]&‹1†±±	™	œÍæ;Ñ+wPÄÕjŞá{N\Ö"9üñïEJÛy C*iKNDjâ­}‰.õVÜvtFO¥î}È!ƒ§™Í&*å²¸o‡ÀCçŸ‘"‰¥+È¸edór³ˆ%"MQ´‹sÅ¨»X#PeÊ‘+^`ó¿ŠïşãëÒ<Åkn¯µ;36OøõäQÑİûóIc­ÁäàLÍH#7>	»2‡Dõ.RÄl®(S‹¥IoD¨¿\s¯õMÅ3“>"uØ¼Ğòè‘iüëßıøş?½)ö\6ƒjµ*ÓÛm¦Õãm¦3L4Rå‹v¶N¼İ‰8["Y†™ã'Q(1šXK—$Èû<Är)Øzäóc¤;2²‡Ä×şyŸ•ØYÑi–æ/g×¿ñâWğÖ//âò»"†›$˜y2¡j°mi°
ÉÌÍµĞ•ßğşìÎ^v£8îõ³Ã?ô%ì›:„i»U…½r‰ÖšdõS…q!ÿû…±1	ëòŞ ç±wkÇsÃÔˆ5òğ Rq_ÿò“8ré
>¼t'I™Ä{»…F­‚5Ò
ìyOª7éİõC·®ß<ÕõòÊ@ÆÇÇÈMÚ‡ta‚Â¹ä&ÕW‰WÉbTAÒI²¼WäóãB¶Ş`i{o7ÆÓÅ=H¨×qpæ¡pdæ >»~wVQm’˜6˜tR0D–V£‚zµ*d…ŞJÃılŠ7×ÒÅ¡y´'üLf
ÒCÎÛdy¢•][€ÓXAÂ1²ÉŠ­ˆ¬_ö€™\NJIøç‹µ×lã™áy4Ü©Ç¯àŸ:W1;¿(#J›mƒ•ª…FŠÜŸÒ9À¼C„ƒ„l=ÚÜé×nŠÅ!‹H‘j.Àj7èã:Òv›È“D¢áÕTeÅRğ[ş“Ëvl¿×ÃŠÅ$“xÎÅågÌÜ;’ÎÚ8|(¬Gª”éâ!ÍVífSÊB¸|E„8¿…ëoŸâs®¸SN†—|åñ©´ÌÉM¥2µ¡91è;'­¿ş,Ó½(ÆÕ‚Œ°YÏ/ÌËƒãØí²ÉJÒ+>wõ11šÍ†Lçf&NÉf[Ó™Î(¹
íˆE`°HŞ¾u®$fñï—ŒxñC\¦öJÄÅk’CÏ.’›v%:åúù7¬ËêŒğ¶Ny+-ÿ9—‡xÑ0…[8ÂaG~¨‹µG^åüƒÍ½ë–màÇÚt=Û‘î=„qöì=R+dSûÍ"®k`²†îÕR-Èzh-–B1LÄ5ş’K…bg%vAl\,ÅçrVâ§AT…*F†ZÍ«b‚@EºB¡"½[x+ÃŠÍÏJEºzXŠmœé
ÅğŠtÕ 
ÅPiË¦&D±µ³¢D¡PÒqé,©éV†(6GÏĞ˜X¤Şh4ê–lıS(î/jñÆõíIQRéuø}ºôƒæ…¢?xTÌ]º.Ğu‡®{t•™;ƒ*…4A’tåèš k?]EºòşçŠuF„®
]KtÍÓµìÜAíbÿU¡F×ZàvíJ°@1
½9+uÿã
ØALö'›tUı«¾õĞ©ËŠ~	ÎKİ?+­Ak’İ² uÿ­õè…¢IZ‘ËÄ ®ÿÖRr(¶pf¢˜½NŞ?X¡j„ :±C1ªĞ„B¡Q(” 
…D¡P‚(J…B	¢P(A
%ˆB¡Q(J…B	¢P(A
%ˆB¡Q(” 
…D¡P‚(J…B	¢P(” 
…D¡P‚(J…bğÏ Áo¡
xY0p    IEND®B`‚    ‰PNG

   IHDR   K   K   8Nzê   gAMA  ¯È7Šé   tEXtSoftware Adobe ImageReadyqÉe<  qIDATxÚì|ë$×uß¹·^]Õïé÷ÎÎc_\qIË¡)Š-ÇŠ(	Ê?ò=ŸA€$È—ˆı%y ‘9¨Ø"Mš4É]®HqCŠäîróê™î™~Õ»êÖÍ9·ª{fIEYivµcÀ½[3ı¨î®úÕ9¿ó;;LJ	u{¸ÿ+ş¦ŸäÍ½nJ%FÃş…¿xùåàÔª²^«ïK‘¶ÚíÁÊúÆnoo`˜¦»¼rv¿xG#hÎ´À÷<µÍÎÍÁh4ß÷ ^oBØ‡Àó¡Ùœ$a¯ËgW¡V­Âõ7^‡³ëk0y0ì‚¦i0‡ï¿sû6èº‹KKğÁ{ïÇçK–	Ûû=ˆ=\üLÆÎ.şñ¿üW,ÆØß÷=÷K®çk-,üæNgos0{†a¤C?ƒ±—+åÄqœ íˆ$İÁ÷ôq»‡Û}0Àé0‡øi>ôïSß“ÙñGù,+ãdZæF¥RÍÖÖ7D{va`GQ”Åq
è±¦„ÖØóËm£‘YĞëà»%dŒ‹ıı®›Él”¤b0è÷;ˆEáèâF`n!€h»œ±=¼?BÌ2öé‹ö °ŒB°DšJÃÜ@w8Ô£R®TxµVe4d&¥‚‰,ŒË9ÃÒL¼†®#@2¤iªã6c0Şir!.5v÷÷é#$p=¾{÷n˜e™ÇÌ’»ÛélÛ!0÷pÛG vŠû»x¿‡Z+Y/ÈOØæ‰Q<Xb¢€Á›HE&D’¥) >’AñBšIeEx˜I–Á9Ë2¥©[»Z~Ãû©LSü)„Lm;K“4K’„,8Åßimç%rP'ÚOoŞ",Ò4ˆDÿ£›¸7sEÃ4¢Kx¿ç_ãïŸ²'	Öä¦àÀãÈè®¤{
)z¬^& t5ôJÜ$³RÉ6Ñ"ùôíø¤¦éø›K$k–Ã·pºhœ:½/IÄ$FêKdÅ"Æ'J–%L‘h‰D÷u¡«EIÚ2ûb,afo·ó=¼H?}¢–¥LJªÌïY<oÅ)³àI#—Éd<ö%©MO‚`F—UFÀª_ùs™Â›Ş'd¸+CwÜĞĞûKÒBÃ×Ğà„–¢U&Êc|JŠÍ»W’(b¥’•i†æs®Áµ¬‰Uf”?Ê;Ñºr'„Mz^ÒÁ€E‰ëæD‚‘“\SPÉ+šÚùMŸ+ÜU fˆ“ú¥Ò÷ JÍ63<è©,U_œå<ğD	>·›#kbDUL>ğê˜Ò½XšÑ9@BV…dÍğ5År &È?³âß°‰|Wl¢Øh¯”â
I©¢ã±OĞ²èXØ4Éè`É£›2/˜Ü§{&ÅÇ„HÊ(T¥œ¿¦õ	ë*¶$ù©çùh–[›Pd)Xq…óÀ¶¬(şïĞ…”Ç|0Ër“Óı¹áÉñÇDD%È_zşŞ	(*(L\ïHBqÙÑëÊ!·(ÜÒ9MSŞÜšf'†ù1eŸ¢ıOì3uÕ,?iáTğÄ'P°Ï”¦ÁòçPqàóÅ¾ôXñÔ1kƒ< §§î—:"ÅDùT¥N¶'jY…l˜¸İ:ùI¹·ˆefÛ–£ëF	#”¼‚Ô…Ùœ¦1|Iíš’ÀÊÒWHRM¨Ï!ğxŠÀËL@ÈÆ P}¹ }ÄéÑIÁ¢Ädîzê ÀÔ'DŒ×7µK%M7|‰€Ò0"()ªI”ÊËPSCÔ5×ËLF"ŠB…•‹Ğ‡‚øÁ)ÜïŠ)Ç‘¡N¢iÆ³ÜíØ#¥¬Gà†90ÙDWMx5WY9kÜßÜj‡CsfggÅòÊ™ S´%ùio0aèL3x54ë–]E(ÆHH„>J_.)ì#²/T0ä\yŠrC‰+Æ"ó€æé¦à¹îâíÛ·kTrùµgŸU¥–Şá0<èveœ¦­†÷¨4Pã™]²¥Sv¤NòSz>%vcz¦-¢°‡Ïğ¬‰,ILØ]æ±™pÊŠ'OXêYqP2H’2X<z<Y™Äñâ~·[ùüç?kkk~vóÖÇñx4ÖPm›è†íQ§(o\Wú®-QyKÃ2“’SÉºİ®yı­k¥JµZZ˜Ÿ·›Íê0í Y‹+iŸs@QÉ`Às¶?Ê$Øé°¬üè¤©brºªÕRi®çy•/ùËPEkÚŞÚÊîİÛL=ÏÓ‘¼X£Ù`µZ•9“—{’¢0×õ¥ÒBàQ¤û^:¶œ9³’íïïñ;wïƒ~}µÕlpË)uğ«ô,Ë&IBnU ¹,$ÈÓÃYJrKä"¨ZÚäš^¾tù2éñîOŞEë8Ã4õKO]dËg–™eSíQ=•|R†ÁÆcWöz‡r0è˜4óv»ãV2tâ8Áı“w8b–ãl£é‘Œq’|–ÔLŠ£ìTè¬iÂœ«
Råœr¥RÁûñşî^Ü?ì~ò³k+|ey	µ”ò7]xäfTò±‰ C×TI†ÆÎœY`­Ù¦ÜÙŞ‡şÁ4t–./¯êFRÜïŞÖö™[7?ŠêõFiS§¤ZSQ;š)&íZQ|rBˆbY	C!X¥R­Ó“ãÑHbô3â4áëgµv{†%a®çCˆîFœÂ§eäü”&ÎL‘,Šb².À ÀÎ®,hhº$ÙÍn&a@³Õ‚§Ñr»²€ßUÆw9	†ÈcÊÀrx:º;YQ•)È]YUÉ¶Ïõdfœ>7×Ö¨
ãÇ&!h@É¢hËE5;*}(»À-côà”M~şÂ†Æ‰¼şÖõxoO6›58á‚‰ .ÆQ„j‰”d©zJf=ÊN?)a©ŠŸT>"ë2©Eßsµ(Nx¹\â„€ï‡èf„QıR¼òävêDø‘OiÌT'¥J —á{F#¥}ÌÖ×W½íÕ?ÿ‹èê[o(h“rµaı9|:É¹A<ú~(?)VùïLjŒîÉªX’
²&F[€Q-Eá™¤	n)ZJ\2¨äâ³òˆ!”RÏ‰ŸŸ t}ß!ØÆÆª)€öÁûd»;°^¯‘¡6QÓÙL{Æ$œ2°¨E€€¦¦2z†F*t	É]ÏË¢è•$”ƒhŒª€§¬‡±£X5qAJ	N‘[—8f‰ƒÁ&áKËK”SZQä™˜%ˆJ¥ÆFÃQ[éWö‰ÔşT€…aM7P6!d–eq…£qô†¢š¤ñN|ì>ÕÊ	$²–Ë´©Q"µ H¥B"-¤Eª„+İz`Û¦VÇ¨y¾‘â÷–›Ô~-ğÜ’dü(ÛaªD½=>ÎÊ?Ÿ
hXx„”ºHõ•~*"`hS ¡’+º®«¬‡  š)÷Âs5O`e9·@“û9`Tã°×éB£ÚB9gñ ğè’	§\Fë6óL‡å;¿Èö£á„kEa°c‹N›­TT‰9LC¨ İ/ğTéø7â2M× (ü‰›a˜ÊSqdI«R:,Æ-B$É!Äö¯ÕÛ,„û2Ûq2¼0Õ$Šõ‡<ÿ_anX”zÑHx-…mùûPÕl8W[A8„ï¢$[XEM-Ï÷•Îº±½#Çn òñJ¥zM)7

Èw’H²œ¿x ¬µ¥ùÁ?÷!4>ø{|Ü«"ˆ¾a¥¸nÜ‘lJ=¡GŠÖÉrÃ"LÏP¨HâxÌÔèG#è¥}h™¸ÜXƒ®»¢ZK‘¤òî½-0K%V®8˜ædĞí`g§s³-%R´È4¢À@ÄQé—Ç fïƒ¾t´æ&$z²ÕŸ0çı¯ÒEÑ,ÃLlË’şx\14IVä×§D”ÉtÆğ*2ÌëŠˆ–©™€ñv‚|4¼e½Wš¡ÂK0tG#÷Ì´[˜ÔIèuv!ayqÍØİíÊ e¹¬'cè–"Øk@gù>îCP>€”ÅÔè€ ù³š	…d=EfX¥uSM™±GW*=Ù¬ÕÉó½joĞ¡‰"a¤Hgë%½pk´	6·à¬³%s,•çv{‡°…Öä{cXZÜƒÏ>÷u>X·(wõ2ëÈwå;A ’ <µ€ixAä<^†R-czÏ`Qr]×%‚f…Q¦£•¡5d§…³Š†M–'>4Â¨#/³iı]Å%ê>ë6DÚûÃÛĞlÌBËªÁø°ãÑ“ç<W}ĞiÀx8b÷D¤B+‘Ğtu¨úmXIj`dhBÇÈ‚ÌfZcğ£DÇHƒi¦[8X^é–ÀtÕ¡èRÑyª†!5Ouf*Õ­^¹ÈÌİ5S­aRï:G‹'½‹á¿³»¿ı•ßF+Ô`óî]¸sóœ»xÊeC~+;TXô¬ª@­Š³yNPw–LÔ0õ|6ŸC¾ãa™!$°wí¡eå Tr ãb*Ì¦µ¡Ê1ù´.Ó6Ñ}óæ¬ƒ€Pé™dl:eøøş}XXõ@·L˜‰P•eUr…C‘8§d†:R@5å¾¸fÓ’apĞH¯ÑÄÖ‰+¥EÇ"Í¤’¦<P]ë
OÀĞt0ÑÚlÜæPI>êoAo8€gŸ}šÍ:t{ø–—ğş‚XÅÄy$‹é‘Ïtİ !§ÆIÎÑ}EùH ºd†€q"N–ª™0
6	'é å´Ëú¤‹YQãæ*s2&M72¸t¾ ØSñŠ–è £SÒÁ±MIón²ZµÜŞmäa$lÂs_øŒ\â(„•Ê<lvaìøI\¥éT<$À4õ[õâxn¹T]ÎóÈ„©à“M'Bø“wC’	è¨­dF‚ú£‘/ëÍ:TÚdJq{xĞ#ÔLº¤@§(×*l>™‘·oßÙVZµ2¸ŞÆ€1ŠÕá`(1…‚¹Æ,[­-Â}lÓİ%M¨šJ E-¬d•T¡/ËÓ"c á;šã¦iqÒ‘£"àqÆIàX¦>…ÒõV1ô©2ê
´&'ˆdljP2,À´yæ
“ïŞ»=¨6j¬Ù¡fæ‘!¬IŒü6ß„š]…ùÆ,•gaÓÛ‡Np ùMé`²¬"«æ9$¥Dxa,MÍ†h§GÁMh5?“¡qÅ‘:GÿøvÈ—–êĞå¡è’üeBÉ¶0,Í<÷ÜgÙí[wåÖÎ¶}_¦<lĞ÷9€§±­,Ä·"%j—ª³°PjÁ=¿ƒÂ£#’}Ê¡„Ah5ô†`£'Ò©”ÑAŸtÂØ)pC†‘I+"¡Ä˜“y•²mŞ¹s(ê"Ñ-†tŞ¥¦"€8ª¤™È<Á\¢àìì&À&êª1¹cµÏÜÜ<ŒÇ^^ÊcÔem÷µ´ÖªK°j¸‹ ¹sE¢cä9q=—$L¦ºÈ¦S4§¥R*ªœaœºdmqfîØ…ZÍÁ«n€…WŞÀ*¥R	¨"“·³R•Ò(]†€G@½Dê5™Ssƒ’îĞh„ÓIîÃæÃ¹Ê¸ÜÜPÕWßwUHvGcŒz¢›%¡zå§¬,ïH3Ps?x…Mo8v}”âæ‡¢5Y”(õú#·*¥D’ä…=U»R•Ñ¼•×z4ÕÕ™m·©¸ˆûkEI‡J<>Ä…e¬¥pGv 03Lœ=Fq¡FÜv*‘½|„‚ôQ€Utxqã¨Â1A>¤Ó÷\?ùè£›@=>]YU‰æGaR~)†ÑŠ-£Æ¾Uq°„®êàFb?XÃ$/"xT¬×šà§¾ìHšÄ vC+C
¨û¹(fìˆ±v{\`±¢øW45‘¼P…ÚŞ`ìÑ•²—şôG˜(ïÃL£ŠÖ¥«%9Ô±	Á¼sÌL\ovvd‰²LÚ'c¯ÌËÕÈgô½{ÛªPU¥‡/JdÛ•˜RŸG1ÀöèJ4BM<jà5Í/'Ï4«ç…Ab •ü¯ü g‚iğ|¡ñÙ±mr›è&Jˆól»¤RÑ‚&²JºéS—‡ÜU~Öİß§ªGŠÖÅ|Ïcµf{Œæ(èsø¤'™A¾=É²²ò ®jj¤Q5DÆtÃŠ3fvš(czóİoÓ–¨ LNİoR5=>V©N’" ş£P­7K*yf=O`i¤ŞKnŞ»Ÿq$Z¯Ç1ˆ$µ™¶‡WP+Ì4—÷ÆOÜd¼Oúš~Ğàt³ÜÅ’o-,ÌbÎ·ÿù?ş'ØŞÙƒZÅVWüHÑÊ»ÒtAÁˆş( İ˜TëŠè‰Õ¨ôÜlµäæ{b<×ãNgÂÀç­ùå¾¦q
:Lá¤FJO‰
Õy4½>F¦¢ ĞKõÙÎÍ{;İÅå3ğkW>ßûÎwá•×ŞÀD¹å²ó @Ó*Ü‡Ò CI‡R=Q3öfê–ÜÛŞûİ}±ÓíÂææ¦9öõúÌŒ[m¶\ŠÏµ’lºDìçû×äbıÿBçÉÖ[°ÉÒŒÜĞìæ½—_}~ı™ÏÌ>ÿµ¯Ãµ«oÂû7ş|ñK_‚5Õ±ñ<OMÒäù/*Êüà5×,fèi]zî(ÛE‹ºsçìv:f¥RaTmĞtk8¿¼Ş“j?G‡)Mƒ?5şÿğ3öÀ¬ÅÃX ~BË¢…Å´r± ¤Xà¤RXIü¥ëV½}ïå×ŞˆÛ˜;³²š¶·äÿøŞhsóÆùóçÙüü<”Ñ½lÛAé€É7æ{I” j'”c¹w#”ƒşnvØ?·nİÒı Ò®<ıXÄ÷½võš¿¼~¡ƒöHGÀUƒ›#PE9GÜ§MI¤Éø[×®ƒ,£pæñc,Ñäm‹¼«9]=W¨
!MnÏ¯^Üéu¶Â«o¼>ïT*¼Öl%˜ÒDo¾ş¦‰»ê%êò”ËŒ”¾œ¬"‹L¨5ïæ>¹œU­Vø×ÿ*ÔëUxñ•×GåæÜi9¨ZRmÚ}†b±;*8°O¸Yñ÷¿ûßá©¿öë*ÚJâIãzŒU¦ÈJ''¥¶£Å,3CjÓgæÏôËµ†×¹wsáîÇ·j–m§\‹L]‘ñá`˜¯üÉI©™ø„–ÎÅh6iå™+WàÜ¹u’ğÃ_İÜî:å‚›jŸĞT2_+ÃTÓ•ÃG@@´©‚"íÃøãå¬¬¨ŒÊ¼îFã+x2¼›{L—§p!C~ºtîéÍÊa·º·u·¹uïNíˆëº™éº!1?¤)75ï&)‹¢€2k“ëÑØ¯¼öæÈ‹e·\©"È†cÂa‚HëÊƒ…,*¢¬?üáŸÀSW.«Ç¾z˜JÎ‰—Ğ:i²8Gá)s6qGu?¯^êÔ¼°Ê5ùüÓAc8(ûûUoÔ·ƒÀ7Ò$Öh¿¼ «æ pk|8}_˜åTãš£Ó¢(}BH“Q¸Ü2XÁIê(8L•¢i\à¥?{Y­ÔŸU%š|¦XT‘g?,oaRN–‘Èã rÕõIZP‰¹·5ÚÃzsn„yšÆ´ €„CFVÁ5£fÍtZYÊhé°úÒÂg”%‹n´‘@Ï§*Ô%åïŞ¸¡H
cûEØ‰À¢«3ñ²ŒÖØHiªäBY‘dòÁÕ`TİÌd•E Säû!x)4Oëñ¹†¾­3ùÂ„,NMz¬¨E]¼½Ãò•0S©FK†sFW¦Eö„©“ím©æÔš¦´öv2NhY”R·fc:kAb	Ôz$® Ë}’e9šùHÑÄ=§‹_§®C].rU®ÀÌ¦´œï!‹%„¬ îã³ÒëR©]ÅÉRÕ#`•Z]ëaP˜ğ~–¯øTQ·X†û+èîhZÕ44c0ê­ÖgÆ)¥Q%?JÆa’ú1-¤/ÊT@pã4%©ˆ6+4Ëå0y„Tş€ °Â°Š	§Î´0IVËó¿"imq…^¬6åÚLy©?Ï~şs2ˆã£¼ëq‚ålş7·ÿP×ŒL`©eU’dùhF…Â(rı ¹A4
¢8ŒSÕjÈÙ"/ò‚|ñÔx¾ø†ç%8j÷±#Bšˆƒé"Şb§cûçÚÒÅÑò¹¬f4_C_d	âœbfŸ8:nv)îzãTõöXÈ¿ó_şı¿ıå••õ¥Õõç–VÿNcföËV¥ÑÀ‹HÖ!’Jš$Kqf^Æ?¹¾çú÷Ò”*Á:SÇ‘«"Eİ<+fØ'«ŠÙDJùç±ì²°¼âÏLô(ºuVÇß‹øj?9Å'S<>”ë2Î8w‘#G­†ã»î(ùy4v2‚GÍBµ'Û)ßùİöOivî÷/|ñ0?;÷×Ï¬m|cñÌÚ7gÚó_ F*$úË iÏ¤i~†ãñh|ØºÃQ8tCì)qNc½šZLFÇ'Ó˜r¿ŠuÓhÆøƒ¯Mîp6qa
<Ş©öGU8ŒyÔMÇïğ¹nI<ŠÇÕT”ßş½ßóº’ã@¹\ßıÖ·®]^¾úôÆÚ?¯·fZËK+s}ıü7WÖ¾ÚjÏŸ3Juh”Ğ]K(<gã8 9w¯wpàvöza·ß¨şE«ãh¥&52t’¦ ‹ZWîo¹#ªˆ8* ÀdVÕjò¿
ÑêÅ¼8yŠ®LŒTê#ÏF,Åw¶#ÁOË)šª7Qéø¿~ÿûªƒS*Ùàe‡ğÎw^:ˆçÛ?h´f~pquf›íKgÖ×ÿöÆ¹Kß\Y[ÿ­æÌl¥a6¡='Êkëke*'İİÎ¾·ÛíùıQ‚–¨ìã	ª}ƒQ	Gòéhy´tœˆMˆl>™j`äÌ˜à«#Œ,‡˜K˜¦G/^ÿqF¢õ±&Ò“~Z´£0K Ä,,Ï÷#øÃ?ùŞ‡ÍÅÅ×W×şSqœ¥ÅåÏm\¼øõóúúâ™³ÏÕë¨Õêlnn¾zşÂ…*-hrÇ£¤×;p·;{ŞŞŞAt8ò?Bêá:7ƒ†¦	VH	vl¡¡".>Y!>âáv³$íãŞ+o]Ë,Ã íqæ†`Ç×áÈécÎòÑm:r'â8j‰Â=µüşè¾R›}e©=ûOêÆÊÚÚ¹ß¼øÔSßX?wéoÍ/-­8•:Tªucna¹yé©´‰¹"õƒnw¼µ»çïw¢¡ÈDÒújÎİÀùåÖ²È" ÆÃ@b’û,•‡x\Ş«o¿-Tö!š¬‡µ@UØ#·Eà®¾ø"Ì..*«c(ÈBÏİüƒ?şÃo_º¶òm^6ù¹ö3ë¿rá©ËßX[¿øíÙ9«ÖhAµÖ´—ÎØWIÚşƒAßëìí¡åíûİŞ0a†‚¯TF¡bh¹îG{©Œ˜`Bßg û¯^»&èâI€‡j0şêÀ:f‚J#)}¥MG‡Èe?xç]°æÛ>”˜™ììïıxëşı¿öÒŸş»Zm£¡}îâ¥ËÏ_¼üô×–VV¯ hPm:¬ÚhVğqå³Šïü¤?ßyëâ”ÊÅ—É’ÆYz(@w¯¿óÈG—x1x§¬Q›ş)µI)·:şì¿Íçà¬e‚‚7Ö»ûñÍnşôı^øã0Tâ7V7~ãâg®|ıÜ…Ë¿5¿´<g;0ŠÑš_h'™˜;›÷ÂûîuÔRÃ$ICi˜Şµ«WSUdü××=A°~6€9hlZœ£E-ÿ÷Şÿ fÊe¨ÖëP/q9õ>|ûúÁ‡×¯¿ù-Ó2ªóËÏn\¼ô•K—ŸıZßß ¿qãİë·^ıóıİ0ŒßC.Ë2]ó_ã”zü—XuÊÀúÙ5"Y	*ıßİ¼uÕ¨ €`jãŞîîk›[[¯½ôâÿ¢Qm­ÍÍ¶ŸßŞİş&Íû–Vb	õÎÛ?ç¿ô Ä©ëgÖÎØQG†O€3txãå«07;µÙkÕ*ôÚînîìşK7MJ>£ /Ş¼zC”ª­£2Í/Ø_°~õ©•eÊmu*KÃOŞû –[3ÀjµTÜß’6¥cÖóZû	nÿW€ õ&Œ0İ™&    IEND®B`‚ ‰PNG

   IHDR   È   È   ­X®   gAMA  ¯È7Šé   tEXtSoftware Adobe ImageReadyqÉe<  ÿIDATxÚì½I“$Kr&¦f¾ÅkeV½½ûõ‚m(Ä"òDş^x&o¼Rxä!OO3<ñ@p(¢Ñİ –Æ ·ê÷jËª\c_Í¨ªfænîUıìª÷²Q•™±xxDØgªŸ.Ÿ
­5ì/ûËş²û"÷Áş²¿ì²¿ì/{€ì/ûË ûËş²Èş²¿ì²¿ì/ßøKøM<©éİ]ëo¥dYış †ÃÜÜÜ‚”zI<ú·ÿëÿ·Y^üW>úh5K|ø|8M{½Ş4Üá±æQ­úış*‚U8>8?»O®«ªÌ~ñÓŸ¦aAG ñu’^’$£“~í²(àÕËBàı‚0„¯tP•%\<x÷¡FÂ`8äsÿòñ/ñ~÷ş;Nb†pzvÆ/ğ5~şÿÁ¼>.Æ×ïáy|ôÉ'|UUğwıcp!ù(ù1Ÿ|ö-|\oÿÁŸÿŸ‹ÀÏ…Îo€ŸÓƒó‡pöğQıöı;³+âcèõOá»ßÿ¾ñ¿ÿoÿ¾ƒ>ƒÑxôŸıçõ÷ğoşøåbôyÅøºı~şÓ?ú×øùş?şŸÿ'xñü9$øYÆQ¾ÏÑx¯.^ğ{{——ÿî¿ÿŞ_€¼áàõwñÃşOÒÍæsüÒ¿ı/ÿè_ÿ«ùbñù&M¯fËÅ¥Ö*¸-ü:DÈ*Ib-Š\­V›R†Óyq{sãÂJã¤·B.ğ˜¼.ñ:Ãë^/ñú…ıû)^³î‰¸/ü]ñûËŞ‚ğN^ÿğ_âÿw½ÃÕbqp}}}”§i\”¥@€”›õzRVeŠ—årµ¾÷?ºH­eş-qS|³1^ÅÂ¬TQ˜fA'ˆ!‚<Ä'
e¹&`İİİ©8Ò@9Â`…;ì¯S<·k´/ó<ÿ-ÈK]U¯Ğ0\ã‰’õ*ÑJøÒô¢*E»õş²Èoõ²\.€hı¯ÃÑË;‡H—}•Ä–e…‹>G4Ey^ÈªÒhÙÃ.^nş¯u‰wæY¦p›Ïi§Ç-ã8–Q…¸øñše¥Â˜©E!TĞkB\áCñ³)JÕ+„¢%.´¼Ô«¢:Ï#ŞT!¨"Ã×[àÉ¢[§nU¦®—óù‹"ÏÉ· ñY!<‡^×âµ‚9Ş¶`³†û•¸ÈW¿(¥}€Tè6åQœdwö0ŠşN·KU©¤¢²ªÄÄèÃòÃË"¯¯(4.U^¸ó/
ñTx41	ü™¥9 Ò²('&C€ğŠë6"ëƒkÿ#|ø?°O¥C4D+È¥ÃğŒ‡xNğ*Ê¢”››[©@ï(ñpH#ªM©«%‚wç3Ë6éõfµº	Â€ t/€`¡+,ğ¥nñï¬«—"j‹ıRİ¤¾Tªj„6İ†€Ğ¼È-[•D”„¸Xqí†¸R‘c U€şp„Wã-*B@Ğ1ˆıÙUyQjD‹F·L“+GÇ#wŠTHÊ	C ”ª4.t…(QK¨É“Æ}“Ì=è¹šÌ©Ò0nğ!rÍpTt¢JDøb'øøS¼MdE¬7·ß¾Y:YàûKÑeK7ëÍj.îÖ7WWKìåI·€°?¯ˆ+á±1 Ğ2áÏU—#ùühÏ•Ş'’®|BBœDÛun°aşÀÅÉøÑ!¢õ]Õ¦‡~àANA‘#(€
9dv~-Í¢Ñ´xèoAQ*Åà¤;ø~>HÀ«AŠw!ˆæóBFø”È£×æ.Ë£4G¦Ğk“’NXTt`: ıEF•° ÇócPğï	½§¬*ƒMU|úšŞ¡¶*—«U;FñòùóOeÈpI	3'„Á%ò³»,MŸ!ÚîğœVUYMñ|ÈÕ,éŠªB`«=€î#IŸ¤Ó²ÕàU„tŸÓ¹Í<^Û_ÛÏ·x¡5ïnb‹@ÿ…„ ¶¤¹€s°hÑofsBÛƒ‘e¢•0K@xxİãš6§gÏO×çà,!Yü©h
_‘)uôÚ*4€Rl‰ğ×X£)Ò1z¤\Õ.~:B+ _‰ç³ÙlÏ='ã”£kJ!î%:‹$Eèu‹¾¼èõ¯ğMÍñíÌñ Kü™Ò_{…ş&ªÎ ºOìĞZzÙ›¾63ºÁn¬ˆYƒ¢~–»Shû,r¿hT¼ù+›Í €	Q2 _ÉÍÂ}:ä¿È¥"VbPb¸H€G’Æš)¶xäV!pxè/Å±€(KPÎæDœÿhŞ »``-•ıûm"’ßVÛÂXN²Pøšcä>“ª*¡*r·J¬7óàæöVüâç¿ C®ğ›¨—¬ğsY(UÎÒÍæv¹\.~ô—ÿÏU ƒnó<Ëîğ3Y˜ğuçø1,{ışÌ}AïcÄî›IÒuË2°uĞşê¯—ö—–Ûç|pèÆšØ½›VíÆPã¨ŞÊÉ&Ü	öÛzeöÂà‚^„¬d¢NÔW° DMHÿ"oÑ°‹ÕâD“+‡;?c„<'2gdr#ÆR6¨€¦Å¼…Ë@¶ tÅË7´÷Ù°A¢[ÍšÜMŠ–¡‚ÚU¥—!ÛS–_®g3Às:ƒRŠ²ªdºÉÄßüíßx.9>‚)>-Í6éj¹Z¯®•ÊînÿÍ"é%üîînon»Âsâ9R°aÊ‘;!Š=@¾F§Ìî®E©ÿĞİÇuovÉÔF‰¨„f´ oŞ#`~Cñ_Åø!#B›&ºGÀÑ*ë°Ah|;‡IË$¿‡vñ£Bv›„º°'Á Âİ> :Y!
N˜ßK¼("Gt„Q%A{b×º=–j|¹æ7~_–¯¹X‡u7+ö!ñ¡†n]¨#¶ªJ÷ÇcâSÂEbüyHVÊù&•Õr…¸.I$IYäE®VeywÛÿòñã­W«ÿ·ÈosÁ·ÿ
]¢ı°N£¤nGx¬á±+Ç•x4\FÛP39b´q»ç—ô¸À„‰XÀ!-½í¢›5Ï”¿ñ=‹¦mÀ½`Ã‡ÎŸ•txàqo%(‹J •lò¢`R•…¦h6Å”µ%r8tÃC1Ğu½ƒ(÷y(»Ç˜ÍB9ãk|ÑävÒëp²ˆ\Í04%:Š³A	tÏdf“Õl~«#tÓQ¹ÎŞÅúñ¡a¯µ»ÉxDE×¼Å.nv¶ÈjGî”Íˆ ¯ÁlDÇ5´àĞànö7ĞûDåÎAìxÖ*	´<Y#ˆ æ'÷j—JS(ÁC»;ºjîüƒ˜à…rBä¼U”BŸN1œ*HãUNR§³qË/´òTÚÜK“áÅc‡ér1^¯–#|n4:8(Ö‹yU@î)Á¿Dëšox.ƒß‹qìÕ³ºs„öï>-i/Àú¾æØ´ ¼Í1X—+t+šÇˆvÄ¬}n¯_ÁÏ…Œ«gK ½DsH?ÍóŒ›$¹hÁ'ÀAl@3&"d¨ğ J²>Ä‰Ê’8	E“É•ÓÌÒ!eğg² ÊX tëĞÙz=Ş,—“¢Ì’¤××Q+¼M~5ó¿Èox_á–7¢ê×„Ã|„ŞõTİ
z	P^ÑXª<qÖ†~†×ZğĞ†*Z+¹˜-b©|k'„‡€ísßuxÇ¼çiĞ5 l¢(ˆ¬Èn”6¡âŠ­%%f¥R†« ‹¤ó<£Ÿ\}P9%Qu…·xÖËÕ(ßlQ¯§ûÉH1/Sï‡È½á ºµ
vø_^®££Ô¢;Öã7&4&aböar¹pÇ•feQêø­°!W!·Ù´#n~ÈºkªZ._m1uÚæùñ}ÑnĞÂ ÃZ],·!hkÉ_D¢…ï$Ğ&xE‘îõ{6C<ƒó"ü0Âg_<îOËBQD$Íğ¥÷$gŞx¼…èöâûÍ¬Hw!6SšºEö]$ØşTvó"C«ĞoDØ)ôëò#6©îG¦w,~?sXÇ}+ĞZô>¨jïjûñŞûª¡à~ã5ìîw‘-&6†&ÚÕÓD¾jg£ÚÒÊ:ö‰ÂoI×5³­}ï\w¬ŠŞµÃrÚC™È®áj+æ˜Po°Ñ'*?ñø‰fq­–Ô5×şR­Øğğ\ İ°®æï-ã‹Ş»qi¯Æsªß›]ìş±Üãm„­vMdÛ‚ÁXGU»md,goÎ•ƒ&×b*7Ûv÷¾Ó{–Ñ¯½Iìëîr­à5óî«k³´­×ÚyLö­xaWuŠš¬¼	h‘«"ê°ò(›ğÀ±iÓ-ÏQì 8Kà‡¬éÕ”+fÓ.¾ä¹eöuı÷Kip–¥Ô&ê¦u6k¯wº©bw‰½£«Ë*^½j¦[·µ•d´.Vw»c2³åİÅş) D¼wY.]¢mÜ­íx\;°ÑêPİ°U›Ü«aÃÉºCÒ[–È³œÖâ¸ÃùÜFÛÖßªv³”ò:Ø`ë|è‰î&´ÈÛDw‘ëö\ªúM¢W]“ä'Û¹‰í˜²Í>CÅéÂJ›0­+gf«ƒ€k£‚]õImÂİ^ôsìD¥Ûî¢[Üf§W~ í¤’ë¤\ˆ\o=ßÁ©±,ª.°Ëæ<<ë¦Ç¾.©n}–ïƒsu¿Â¼ú×s5lWìnaníhW“á¾kã-b—¹ ¢94TU´$J—
Ô hvSúxW [ıí‡hëR²V¿!%IŞÊ¡(İ”ÍØU+œõ`^`÷|s·?£U³é×Á¥}nÖÊRº3uŞÖqéÚâ8/«!‚Â~b·ÎÒES|»1Ú3ó»“‚¿ş6 ¦¬Ju±%:;¸ö\5A%PÆ½"‹Î7t`£Œ»ÄÛ”¬üD»Ş²> }'Ë™Ÿ°»E¿mšpr»ğY{ÖF9À°Ñ5ùÃ!`ÊlTë5ëì ‘¶çR§H54ŸäŞ‚¼•K§å6ĞO{GiÉİ´®évİæß»åqı:7ÉFsLB­,‘{„œ¡~š¸øpD \µ–îä+¶ áG¼–¥[–†vq¥*vàpi”Z×{oA:M*Z×Ÿ¯[£¦=7s;ßáŒ½È;‰ó~eîòk©v½ÖöÓ^‹è$Â=k`Â¥hC¨ÄÉ,út«@HêÁRÂFƒ…Ofı<È®Pt+!^­X'õáHiŸãø9?WÙ}çĞuõëÖ Ñq~¢x³‹¼ÈÛ‡Ë,øV	Æ¯·_<¢cfšÊÂ¦Zª}B íÎUår4u5#mÙ´êhç_™Û(oómY+ĞÍJß¨t*Ut'Ì.“ÉËìHÎë&âeó­œK‡_u>U?ü¬m<[8 ‹×}†bÅz[Q¬!ØÆ1Ğ»Àa+QmEP­ts,»vg­iE›Ú”Ç–¡É -Ûv\Eah0ÃÁ6aÖneÇA·H^‚šp•«¨UM‰°öKNšø·+­ZÃ™[Ü®jÛº›—oYİtuÖIFĞ¯ÉåÂ>Qøu˜’_ó¹wÇWœ ¥w–Ã{t`×aº$ÛòáÊÀœ""4•liÓgn8‰uĞõ–éó¸¸¿ExËP5%à2èºûœÈª˜hûZîXö8uŸ¾iºôÚ$$»Ÿé{Õ½· Ñ¯'Êíõe+`_K^ŞìŠus#­Ç¿ùÁë¤X·š—Ì‘(ñfš«L¹I66:~Ùz“ìó£ZºU¯å…_»®]UÂõû1¥'5(:¥-5ÀT;û¾e9wøoïùøf»X;Â²¯¡îoXÀ;²ÔÛm—µ·yEÇ3ó¹‰h›˜:Şãìˆ_®B._hØÅƒ¥’:®¤±.)Û!Ù -'«İ_ßd¹»®!8áÜÎÚBkâÜ,­»¨;ts¿Ê­WxÙ=@Ş'q¥ï-JÛô´ïÕ]K£» Ğ·AïpYÀ‹óğ\Ç©
VaÈ ÄÅOt\JüƒµY1¦P+pê,Æ`·êÊè14Ö£]ê€½)#qÀl[Ğ~5®;'JáßÔ¢¨º—¾yß[“ĞínôBuĞ¾Xñ›è~5ßèæ^ÿ”¯~_³Ä7„ªuÃ Œâ8î…a³¼)Ê	–Í2N·‡X7JŒ-däBqßªœóOÊ&ì—A·xcÉBqM}º_ä^cI{…‰c ]cÅw™w×]5Ğüè­®w'TÔ `—®^ûAî‹¿ÆïßõWŠ‰ííj­ßè¦ÙÈ‘&]¹1‘ÄI/£DPc8-vr•”h–c« İ:¦^œ×%qVílvÌJ
"VšªŠ”íGï+Gà¤FJmª¾:¹ĞvòO5nRmNa£š_5LÄºkKå}.»›1÷äs¦¥p+·Û ûÅ¹İ§øz"-Ÿ¶î §ÿ…a! ¨Ùá·CÕn÷ùMFPK ¹ÃóxvDsï7ŒØ^wQ×hPV1 Ì¢TÊ*‹AY•¹*)Èg¤T_§"ÚN—_·å¹PÛaß†/µ7íğõ®}¿ŠX¼ïøø¦vv*­|¯·I:Wù•}°ıÅo‡Lag9¹çÃë0â~/öz½GH«Öƒdnxı34l£•MÀÕ!TÏ„€ë¢$‰Hr¦lK¬‚)g×]S‰;·ğ†ZDÔDJTqQıª,r<n
"Øx![Û_â»[ºÅ¾fVæÕ-ŞÑ+ÏâºaG¼£&zş©U{€üB¼í¯`—»¤¿"Ù}äÖî@ú½Yš¼CËåæv*Òt®×I¼šj<é(ŒÙĞÄ&‰æ—ëº¸—q«÷4Ñ1H¬ÔHÅ;•_7ÌQ•å/¡ÔÓş°_Y\åY]¶%:x){^ªra0Õn·­‰ùÖ†¡ZbßİJ[ Ï³†[ªÖZƒØ[o
PD×ÉÚÕvã³»*¸ÛvÈÖÿA¿×ë†Ã12äøúæV^\\7·wAY–‚$~ˆdó¸Üâ?ùô£üáÃóê1–+nbõŠÛk‘ëã	ÄÉƒ@·KIœBËz;¿¹Q:{4()ò4F‹²ACDÓ|
vµ¼IC[M±+äİPv¯yJûöNXvó3½k÷Úäëá%¾>áëwú5¹×G¯LƒSŒG£ş:zòìEøôéÓp6›Iä<(AÃƒ5£(â
«:<<à ”ªT“{ W:îÆ2¸¥¨lÍ¼Ğ&ÖE'W‹ãÁºÑø…F«>¹ã91D•è¨7 Yä½,İôğ®ºbK|ZÅZÀ­ÄtÁZï€&„ıf³ìg9ëóõsB¼Ê&÷¡Ë-rW›¡¶4FÛ;_‹|7[c7"j7ywo4O®onúõ«ğîöÑƒ³³SFĞxÂn,JÓÑ+H5·,>#ÔŞ(ÚéSÍù×Ê¸S”AÓ20õ}êÄ!ÔÊf4V>‡{Ég%E:)Ò´§¥˜!àÖV4Û-xå+ZÁï¸u¤k»“q{SÑ[áïÚÒtZ¢¿b™Ï ÿ¿òUb¾_™w¸Ug|j´ƒ^<~ü8y‚VƒÉùÙZ‡# 0zIÂ(4–¯šé¶Ú¤	:“J;ëâ’r{Å«Üß *—ÕÜ'!¬5ºl‚Ü5ÒÁf½[ğÔŠƒ2=ïZÔä¨©İêh
Sò1Šú4(ÉÓõ	r”ÃEHûÚ³À^V¼íjÚm¡	t½¶•³–¾Ú*Óß»X_kØ·Œí¿Fdt§®p4qqM~öó_$¯kôû}xpú &“	»U4+œfšóÌo-ÜõfS.VË¬ÈKÈKš·AcÛ
Aâæ4&úoµU­òecB Ö‚°ø3+" ù§ ‚„Æ”RÆİqua6ÔUé
²4ît<tıTEb½ZŒ²Í
™ÜâIgŒ
aë‰\à‘qvßZf÷MÊˆş×¡Œğ>Ìû5æAv[‚×¥ÿ¶ºñ{Î!Œ†ƒ	. áÏ~ö³äææ:8yğ Á.UI/Ş Ï ±‹–Ÿ{w7/./¯³,Û‚¹,«Âîñ<vJ$hiB|.å1hÉ0ñ¦Ì91Ò¿­Jn'±Jì¤‡eºÑ®óTH…®›’]¾DË(Òôº\ ¢İqL”š,Îr¶
şúG?îã9°òáx4QãÉ¸<88ª†Ã¡BàÇ›ÅìTDá]ÅKšMbG+è6‰sŸ^³È½nÂ7€C{ù6Qo‡ãö y+áªNèÊÑÕÎúïFz@ë]&¦i¢¦õ!ƒş9Åğ—Ç³é]p~v|ãúHÂ´=^i¦a(C(ª\¿|y™_\¼¬ò4¥9SAF²?“›ÄjëÄÈå"%õ²@Ë‚;|•«º¿›‹ß™sE
D=$ıã!Rìªº"àTb“/h›"‹Å=òã,wáúyøúzr0Qóéyz).//‚§Ïè.ê““Óò¯“‰(óÍIV¬¢0îMk&Ói+T­¡DîCV‚¦]ÔA.Æ±^€r!îZ×á½	hİ—Lúo ¬ízöZ/”ôz£ñø`øòÕËp:½Ï>b";£ÕÀŸ¡­™Z,–ú‹_ıª@ 	\°ÑááiĞ²†m‰îUçP¬69„{A*®q¯sL¬•]aBÁ%*vÆ^É•£ñÖÍR@î€‘eëU:S2ª(Iğ±çOĞZQ`¡:?XlÖ›$ĞhiJRsGp"À.^^DW××Ñññ1>æ<‹¤8HW‹ ê®k+Ğnl[ÿCUMK5º»f ©nÌ…Ø‡y¿FÒŞUGl•¡wü0İIh%tû½x8LF›ÍFÜ^ßàb?„O>ùı»SDÆÉ­!Ò[àÂñâEõòÅ§gçÜèDcÖëÒMŠ¤ U$ÛF$[P²øJœ$¢ßGroÆCóš¢ùlYÈÂB:q—¼€4Ka³Éı6æILÁ€˜ø„HC‘häYd«Y•*ŒÅ‘4<ÏƒƒÃòèè(œÏçEÖª¨â‘JõØ*,‹ M³>ºÅ Ë
Áú·híHhEtZHl‡¢jÊÖu+¬Ñ¤-¿2½4“R~—î ï:¦µ3g¥·-MW<î‹¢°? ê¸§ÓiL…è\d†gP4)
x\_]ê‹gÏUŠ;øÁá‘¸ÃóB&`¤ ‚NåXƒA¹Ì1’ú±@w‡İ2ôelÂ”´·£q´h‰‡Ğ.Oá¥ÁµY­aµÜÀ|¹„‚€xÉz³™¦$˜¤×Ì6k™¯—:²Œ“Šz=uŠ‹ŸÜ3 2Ó ÀOÒğŸétWã±ìÇ¡(çsèG7¤FDå“Jû¡]ıÆÀ¡ŞaáU©ïcğ›:'}G˜÷õ-O¯_hB™†x0Lp÷…’ë4Mƒ>øIùïÄ¬ë†nÏz½Ö/¿Pw7×z0ÁÑøw÷l–sÆŠ,è~‰³‡gâøäPÃx<â¼ˆ?øÀÔi‘«¥êŒ:‡ƒ­e³¾¸øc´^}8}@y´.ª–˜»Û[5½	Üı5ºY eŠqÜÇkBÃj¢tµTYš–½ş­Èi¾\ÎãF|[Û×4q33ì³
ó* ¢ü£Õb&ûÃñTÑ>İ‰3ˆÔK6 ¬¼¹[ÛÁt¸ç¹o(Imt‡]´g¦×|Û*ˆì Ã^‚Ü‚˜®Ê³L"I|ğhæ…0S¡;uQ½|öœRÔúàèD”¸¸ÑÒ Õ`~!ŸˆO>ûD<zô­r€VK.KYS¸“´°•²³ûJms&.3gw{{ ê°BæÏ€;Àİ¾ø ‚ùl¦¯ooôt¶Ğë4…­ót	eÉt³Š–ó[õåp8
p±rƒ–%ô&bÆ»â×ÇóÃûE/]¯`9ŸêáøğÊUïëvÆK´#‹Êiƒ{Ø®½/V|;´fıI³=…ˆW7[ßaÒ‹¨7F^AÓø(_>xp£ÑˆÇ¡ûQ¾¼¸PÓ»[998D‘ˆÍ&Cwg‰Öf#¢0~ôH|øáâİ±æš)Å\ÀÍ…–¼ø]–[Ø†´<%’rú°°bÀª&Újİr5E»èx(ä!æı¥‚ÃÃ‰˜År±ÖWWW0›Í¹xFâX÷t÷6áz5'nW‹Î"ÕŒQò‘¹xÈ"xILYŒ†ñÕË‹1‚D$Ûí´­h§ ¸ö7(Kò…z/²ç÷¤ïîfÛ5gªÙB™ôûı0¹|+ºZ’\uuu]¡… kPåYprzÆMLäËÅwÛB=8Ÿ|ü1Œ&#Aùˆ"ÏĞÕJ9ó-¥¹œŸP¦FDïPƒúõƒGu£¤Î=ˆ!‚¬lÍ(ùHA7év4ì‹áğS<·…|õòRÏfsU¢e˜¬Ç0Áz1™ZU½ä(@ÉÓgmIŒ'ş`ÂĞštVd?{òÅx5ŸVƒÑÁÍëâP~î8¾JÊÃTaF{€¼ÍDaS=¾[„©Ó.b³#²—ôÆQ¿•U±\® ÏSXÌgºíáÑé ¨Ò	,.BŠ@‰oçûâÑÙzéÈM²5¬«œ£[!^Ù¸—®¸Ê°–ºVe‘vSÑè=¿Ê­1FÈ¸/”W!Ë‚€L³[”á` ¾ıùgÈQfº„jµŞèª
¨Ğz£‰@—KOo¯K2"Ãá@¸şwÉ ¡¹Œæ£ä<Y®7ÅÍåÅ!¬–Eo8œí5ˆVúuÒ¯¢î_i
®cÛS%÷ y‹ iúÁÛÓš¹zÍ„o°Õ´Iã¸‡ÄUªF;Š\#%hår± G.ân] û2äVÉï}ï{b0ìÃrµ ."¯'á˜€9‚ºïÜŠ(6¹Á+B¹Ù:ŞTgí'ßêiN´]JT˜—Ó–£»Y–s„ìäôÆãàÙÓ§êêò†§ÑFÈ_âŞ@ÙZ_¾|I'#ğMWØÚKØ½‹|øá£x¹\nVóëR÷ûë¦J¼í¼µyiÿKêv8³ßuŸ3ë÷£aJw‡Û@Ó$¬¨#Š¦5Fë1£H¹ïÎ%ì(Œº\.( ÇE7GË±^¯ÄùÃ3ñùçŸqõÈå«+¢ï0HĞC´éá×”VÕœbSÈº
^Û\´­°Ò¼EÕQ{WFÃÔú=”g‰Ğõ*ñÜ—°Ş¬a2Àçßş¶ô‡âùó
ß×v…Û”êå‹ìàœ?”!+#\q—w<<8ˆ²,EÒ>›„Q.Ã İnúêe]HÓr«[F\{¶‡BÌ÷]ç]~S-Hëº;-Òâ~/9ÕAÇ²ÑÛVQÊ? åª,‚Éä€‰ö|¾€Íz-?úè#ñÙgŸ‰4Íáîî–I7•šp"Gl¤WÊ®ÛÑgí)A±µ11_‹—­Ğ§vå'¢1'b·E¬w|m«{É"(toonànzÎNÄ÷¿ÿ]‰OàJx®áJúêÅ‹çêÕ«3ÊÄHª°515^û}qzrá^¢D'«Ùô˜‹qlÂO¼†¶+Ú¹¾Ë”x_¨÷²û]•uO}ÃÎlp¨•©\<“¤'yÂ“u)Ì¸bªryºÆ‡¢ÄE@–cC–ãÑ9[tŒÉŒ›âÀR•W%[7t{*‰²±ÛgÖ4ÕŞÖ¨¿	Ô³:¼~ymúMê$ mÑ;\^]A‡â»ßÿ<::E™£Y°øC#H</Ÿ£+FÄŸßƒ0œ„]¯(@K4{½ìÇ:/Ê1Z’£~]Ï'TµY§	L©Fñg	yWı¤ïƒÑ¾LZ#iÖn·µø¸;bc=´[lŞ¥èÓz¹@·êw5"êëõNœÊóós²,ü7HU2£5L_D³<bàš£L’²Ö@5³:œQà9Éõ* iX2H  3 ¬Îµ_mø»œ‹Iú)>Yƒl“ÂË‹—x[‰–äûòììäl}n@öûğìÉÓê?ÿy™å9Ğ2}),İHæƒÑp(Ñ…Ó1ºk«åâ8K7	~U£¤¥ 3ğG·İ+¿iJìò5İ­Öu.~åa÷ú¸0t-˜@ Áİ­CĞÇ…@}ëõ†|y1Jü¡‹éfS'×´MôUÚd£ÒôBœŸ!;Â÷ksuJV]Á‚ÄÖ(y>–ØªK› üñ­Ç)3Àô~WµˆˆS0¡p.½ö«‹âVğ­Ï¿%Ñ"Ré‰(Ñ’P$‹‹/=Uÿ÷—ÍfKS'Ãç&’¦ı~ÂUõIo ƒ¸.g³#tã(±ª}-_›P4¦Îl«÷[ëş¹Xo˜(%¥è!1—¼Ì­‰ÁİT¬sZÕA0Ò´$‹Åâ8”~p.(„JÑ+wŒ’ E3¢´jÜ	²"T˜¨ûîDâUİxä‰µA3(¼¾æ»Ë±¼ñhnAšãCçuDóX0 ì=åJhÁ_^¾‚éÍ-|ôá‡â-#³ ŠcâRıÑDÜ¼º”ÿï_ÿuöËÇ_¬×é÷’Ëõûıtå6½ÁH¡‹6NW‹¡®»!k—Ê2Õ^)ÿûX…õMóª%÷\!ÉşvY¢Ğ:ô¥K
Úú'*GÏÒ4˜"ï(K½@A¥ä>xÈõOëõÊ¶¶
€$€P’’&ï-Lq–I}l#¹YµÈ‚U÷RÿZt¿^!½~pÍân³öZn•SQûr·ğ¼èœnno(R'>ıôc:_ywsW!-DÇb³ZDOŸ<É®®o“ñ(<::ŒH*¡KÍåşÉ`¨g³ÙIÔëo(ªeŒä6ïÿ”loAŞ'okßjw[ZÇ	º¡Ñ+4‹å6do02Œ4‘p*u?9=A…b–DÙşî/×vªmbL÷@èõÑÒöñ5/°¡Oá8ÌÖb[„¼;‚¼I¼)S&¯\	»é3©ìï®Òq"ªæ¥ŠdŠTİM§DàÅw¿ómCÜÑÕ¢ÇS¿I÷d¶^DEËÙlQ>~ü«õ«‹ËŒ#dÄ¿Ğ@Æèjá/Ñìîö¸ö‡€6VCûÂq-“=@Ş²åÑqÑR–bk ¦©~%ÚË{ˆ,ÍĞ‰.C’ëÉÓŒšŸÄx<’ãñ˜İ*¥L1«»B¯êé+’pa¡J&ñDqI=·v3@×ıİÂã».İzgUX£ÑY‡ÊTÊz9[ÖDÕÏ±W¦¦‹jÅD áêê’yÕw¿÷`4’õ4!ğş el–³"{QIª7,q'«H@CWK£u§ëuŸ¤¶ |—oxcÖ´è„ue‡|íò[„‡ğ¯m2!ÀSxB!i÷´yA½Ú›õ*Hú~…^¬¸9>9æ…ƒà1\ÂUŞ*°}Um´rVÅ,NrzİP˜~Nè)µË…üFÃGm7’h¢Au¤Ë·*P©®”×'Y$À¨>ŒÀöâù3>¿O>ı˜×?YúÜˆ´WEmÖ‹°2BÁ ®&L˜3Òã^°œM98ĞŠQéNÄª»©íIú[½ˆÎÕß«Ô&¤6&‚dt£Hh¯º4'Å]ÉÁ`ÈİëÕZL¨Z,‹–<OÅ‹»¬­ˆs!ø1v¿Ìßä®PÁUÜ
/QØ¸JÍkİ§“å [®—Ú¿ :¯Ã·ç¥ëyi\ã~ ¬ºòôÙZìâÃ> šQ•ŠÃÃ1ZÕb³Šr.Šäèvm¨-8”ÄI_§Y1X/—CÈJ¸ÎÍF—o¦‹ÕAˆ”$>h~Ü3nJi,…oÁF}ÈOO7kÙë€ ¢1`>ŸqØ—‰¶ÓÓåÈ•)	¯”çïóîl~ºaMdA¨ÿÜH!æ±Ö/¯¬Â"/|) ¼9„.*UGÀ4V™œŠ]ô•å&±ÉÊZúİıí>¢Êgí¢iû>\8Š8ßC!àóó3Î‘(êO!—ùˆc‘.gqQ”’­µ4â)Ü3Hâ˜ÊWÂÕb>Á×	~Cë Å{ÀF¾‘ q¥äöÊûÿ3‚RxHÓDdCª\Õ¶ôò<ª*e¯7 R®ÓtÃ¼£ÌsAuLÚ*U»SÊıÎò<v	2÷7=-/s((».›…ÎÏåÜˆ}ÖEµ`œhE±tgvœ²ó6´Vî/©ì9)/ Ğğ¾òş6¥)ÜŞİÁİí|òÙÇÔ,&)?B™ô„\­ª
ÓõŠD"LêĞ.kû"ŸIƒ*ÍòÑfµ"òÒšãÙJÜn]ÙMÔ÷†ÜËT“;‚Îğ0;4×á{ÀÒÎûãÅ$²ÍFRµ	}«õ’Ã`8«Å²>9"®\”¨Y÷ÊZeI{ÅÖÅøÜ,G®	.&ê¹0	‹ŠB´ÜsÛákùr€ÖLF?¼íÜ¶ºïÜp$×İ×šÄë"p•âD!Í§zqñ7‹<úà¡¤”ßGYhIòÍ:¢vbSçi[‚Ş›ä{š*·\Ì&F[KtD°Ş3!¬ûáb‰]WNSË&Wí~¡9vŠ\&ıä«ÈÉd"¨6Í3“»°‹¬²-°ªşi¬€IÀÙæ"GØµ[Æ’$óÃ¹aÅáMåº¯'çİ=×†ë'•òJãmtMYµ+qê58‹ãÜ¯(Dä•œÀd4gç§LØéÜ£˜Ûe¶YtLßâ	[“–ôû
?ÇQ‘¥qóo¢å{ëë0.+ÂNf¢ë´¥œƒ ![”€KJ(¶OM…Tge³íu¡…i]^ÁÏy«áÜ-UƒÉíÊ´‰èfeyêü)ÓÜä\c¶ÄÍıÊñfüsÃ3|Àh/Bå¸…kèm,†n,ˆ{à¬¡jEşh%0Îáİ- Ä m  RM)ò,ÌtM¹ÅÅöµKÁ!_â2"ˆÄ|:;¨#Wj{å×A•÷( õÍHÇ¡º)úşŞ>4z	4AVrÏ+E¨ª²¤KE‹Š’‚q¿'ò*‡4Í a­ê^T¨r®–ªêWy·U6)WUÎµWšeüX×è\Ÿ†ƒ@]ÅÛéÖc™Á‰îÖºıwSÎ¡šÌºj âBwuJ]§¥[ÏãQˆèt^¼¼ ¾qzr,©^‹Ò8üÓõ:0íƒºò¥ò$õz½ZŠ¼ˆh\·Ö²5hj+=ºÈoõÂ‚ÈÍU«×´#Pu»%ï¼ÉmÌIbî§…=@ëAšVi™’^!´ÇˆØŒyiúÀK¾–õâ­x˜¦%¿vg.­¢;åğ¸Œ]-.„'á6UFÕ½›Hó\*ğ²ğíj°Ö¡3¥JYK¢Ì9¹Z­ÚzT&‚æ‚uó•ç‚Ñc(‰H	Ò«ËK8>:ı~Ÿ\RAJ)dET™…è:Îú9Ï–ˆ>åE(ß´ZÌG”WÒ[™‘m¢¾ç ïÈ‚t›,\„'Ğ˜˜/ßL$’*—ãîF8èóèúèbP<CkR²–S»ÓÍq7Ò€€bB¿U]hÀRrÂ¡‹‹ÀG‹‘v®™jZo}—I·êø8uy—ÆriÕX
0Ğ®€QU‚Gç–rv¤ÈY Í–€‚}×Ó•kqz|&•!ìF‘¿U¦›À•Ó›ÌºàÄ#gc¹Z.F6	ÿL2"÷ àk/ù{®6¹›£Ò	ÉE‚9%Èˆœ%ğ½ƒOàaï‰Ö…Fè¢ZÑ%WFÎıl=J
ƒ¥r×ªNÍˆa¢Ñ`J:*¶Ô¹g¥HcteŒ54|Á¹REaK¡šäd$¨ĞÜ×z¼u½*ÍÜ‰ÎÓ ‹rƒ:êÈƒ[¸Î~£#<¯d éœ‰Ç…aB²H<nÎ…¨Á*Ô<ƒ$ÒyQDëõ²WWfjxï¤~üË½¯îæ§—Tş#;£Òh>Qé7íò´£†¸Xß@\8íÃ'“‡pœÀUz·éò
İ0ª=‚ )ó ƒU/-(=‚ÍÚÔÂ Àp”’jFbGñp–òª«A¬lbÚ©¡´ hñİÔ­ÔıéÚ–¥)İğĞX‡+Uçexl(~H¯àŸa’
æ°Œ.¡'âøôT¼xº†WB’$ºÌSYf)¾µ°¶ÒÇ)£ ‹FõXÑzµF£5S6DDn™{¿-y/Úğ[5 1Ğu%F]Á2./Ó;ş4ºRë”Æ‰2‰1[Ìáj³‚i±‚½C8Š'ğiôˆ¾Z_Ã,[ 5É¹BW²ø‚Õ¶rDXˆÅªäœW¦D7Ò-H^ôYHÖ©Ì¦$‘jŠåÔ`Ú\Ã@Pñ$ùôqÂ~=?Ş$um)µWêâ'\ºsë¦&í¦¶¬b`P´7Š èe ñd/Ã×]BŞ{‹Ãá¿ÑEÑY£^æy€–²¢)XÒ6QÎ„£…¸)l6›$Ï; Ø‹õjáåÏÛ¢ï{òö,Hk&­«·RFÜÌ4SÜúf1~EQäœÄ‹D@uğ°AkñÅâ%Ü38A—ë(™Àİ®i6‡—ë+˜å+ÈÑ5ŠthJ-\¤I¸^ÕÊ»o=-Fê-¡\I½|ùJßMgüw#ëãz:„¦1Ãah~Çh<bSvã¬‹ä\§ªv­QÍdYbÓîBÅ”=§ø+‰·h5dà@P$É ·è¯!è-ñ:…Yr‡>†ÉÑï‹ùMŠÖE°]nĞíÊe${”:4#ãè):†±ÎÖ«^‘gqáÁßóË½°¥®¬¬ÂÉ%hÖz2
U¬JH‘^ÊxcLÂÏÈFrt3å
–Å}ğœ%ÇlIÆÑnÒ)Zš),(Ô¥Ç®WÈÛ#‘uÑhÿãëuBÜ0ˆI™ôíí‚¥bb›$=Î)˜ª›KA“n2½Z­áææNOÆcqr|Ä®Ù/ªB6óEŒ)ãd_å-
ÔÀ¸sÅ-YY€BW
‚}¦Å ¯É_‚Æ«ŒSĞª¤bëş€ƒ¿/f×œ Ò!šCëKe9Q`¦ù*›8$+¡K»®ª(E+ÒŒÖİ€Ã®Ñw{€¼@x¿«F@¤ÎJÄä„ÆE¤ËªâõË¤Y0®“Á'ÅÒ|áô˜;t­fùÂœ#yØ;Óä®²;xµº†y¾ÜÓiµ8 ~ü§¼ˆ‹û KBùét¦Ğ4gd4p"D•6¢ÙÅ®äG<)WÎòL_]ßhÒº:ypƒ^²<xÎ¦Á©êXî?©ã­8¶`µ.´x[€ 	S¨b´ÖbÈ>‚¢¿@`,ğ\ÑšàU‹œ-"½)¼€O¯DÒ;E™ë(4º¿E¶	+U–’(f²•á!Ü”¥Ö«U29<
š }Õ{òvó éª«-ê‘tÇh§¥H‹İUúË<u¶&ÒX@üEßÈĞíºDÂ>E°Ûu>8gpÀ‚äÕæÖå†‹ˆ6h¶\,[ë¦	ò‡¹Æœ¢;0F—‰|uûâBŠh^aÖbÜD¨+‘KæÑ%‹óXlÖèÓ§+¸¸¸Ô'Ç’~Âƒ¢.J´yW¨hCÔ\äJ Å!Azoh4‚C! !wjœƒÀ@Ao(ˆr**a·‘>
N¤jÅä	?·ZDq Éšéšf0Ê0”© ¶Õ>©ĞG¸)¬TúúŒ÷ yga_¡¸¼€•ü¤É²øn^x´ãÑÄ§MuÔŒ¥èå ìA$KØ9<[_Â+Ëƒş|‚ ùÎä#üı¯®Ì_ÁI>ó™øMôõ³õ_Zi¸Ii$
L>Uàfyiù
ó€z- ÒÆ<Õ*dM`²&§'‡"¡H—n*ˆ9\k],ş‡¼ğJîTƒŠoÄôsŠ€ÖCâU XÈÒa.cÉJò¬ã Q°ŠŸA|´ğÜ+¥Ğô†DóŠœúü•K;I36¸NWÔKR„øØ¢3oJl´{€¼’õ\Ví%À›Ä›2®qÊ2BîŒòBŒ¾˜™IÓîL~õ ¤$"Y”^,.ašÎĞå:†‡ığıƒOñç)<]¾d2?G „¥€~ÔÇM;d±¡ş`ÀÉJ²X1ûğ¼¸ İ 
â,MÙ
ÆIÆã	_)'¢U”û§ùˆ”k˜İÍàæöNšØ)©P’Ïõ„¢ nÚ9š³2DNâchĞ}‚8C`C7*,í(ii¤Qù“í´qÚÈ$ê/!J>f«Ë£¨È¤zOŞkµ ¡Ï–Ùf½NÂƒ¸Ø¡Nê¾<±ÈÛ×x{"qfà‹)±F’cJXyQ[‰ª­n•¶ú¹Şqku7¨{0´\%Z…M™Á/çèbM'|ııÃÏùçËçp»Ú^É¹ä’Ôácš…ê¾fÓ)Üİ\Óu}H–€À2½¾†Ñ!óÑQò¢K³œ'M! Åb~§ç‹¥îr€À¤ùĞµÃS.7õ(Ğ¥ªb¼ÒÏˆB¹´$AƒÎ¥Éï)âNèR*|}Y«˜9+ "X4n*HÖÕè’ñ§2£çš°n‰oêµÈÂ¹–gÂ
v@–½Ñx²Ö\œe¦İzºÄb?@çmDµ (ÍªUM=ü/€ÔÇÍğI&íÊÔ*	]Šº Ğ%Ş8.lof™LÑÄa1°E¡vÕe¹†_,Vp¹¹†Gı3x48…£ãß…Ëş¼*¦:G„ââçL4-"JR}cµNYp.îÍËW¤©E¾ı
^<Ê:[Ÿ|ü!ò–1/:ÒÔ¥éRhyD–­ilœ®‚X ƒ”æ#‹‘áº,è	•!UFá@¤„¦fP„vêS…@•á3Ü*¨hÕ÷Ìã(»A·Uhs)b–•,Jš@§sÍÜÄ|C:À…D•’*6Ø!xú=f“nz.Yéºˆõ~Êí; éí™÷5†Te÷š…”›vääiì>¦šñlí@™m*ÑÊŸsÌLØµ‚y¾B×ê1gà?>‚ƒŞæ:C.	eÉk/IØJŞ/•yĞpPU¤p7›Aeßè}It7£äx}uÃaâáhÈçCüiˆ )ŠTàïz#zz.bA¥1T(BÅè…¨ØÅRĞ6ç°$*ºv•IJ.LC¨ÓïAÉ\)´%ö"ä…‚&Ó¨Ô£K™$P0ˆ1…®ñÜ*
dÅV­Å–U›NÏ Šle°ÕĞ²İàEVFïòY¹­òuò¤b0vÀü6…yôEj' ¬D[÷So»qà¦äª`/°’€A€]qÊ•,ó5&¸H‘dÇ7¡Rõ0¹Q«å‚9j#lNgÜ…7è
AY5Æ0/àúúœ?âEt{{Ë¼¥Ÿà‚Dë—ô¢ëEsºRÑ‡¹YäJ±¼DaËÿÉÚá{¥Î@|4Ø'Â…Ÿ¨"AnVõ Hˆz‡øú6Å‡d=Èõ¢+-l
8@yÄ‘7PàœûÌh9]ÊZ“×$
3w1K7±½Mxz’µÒ o=Òn4ª[(ÀµF¨ºŸ›puËPÔfÆ7¬çèÁ›µdw*…RİEEª^TH4”#¡F„›^;ß¤Ì+¨”äñ¿‚åz‘­ÃˆÓì”oJf5›ÍáììÏ±d«spxh5ô´gëÒ‰\áABQ­xúeñ‹Ã÷Sw„¤!Âãªo ×ˆ*tÁò	ìtÄ@Yõu0àÜÔ!mf€€Ò)aZuM™»"ŠªDƒªFœÌD´¨½9MÓØï¦Ô˜7”n·FÜÏŸ¢•ëÊ±ˆ¸kı­dk<A-™ãWÏù%è†Ò×a`ûåƒ/ñæŸÈ	ºåFÁQÈP²(òæww|œrÛëKè!iÇÅ…sº(9úC—ó‡ç<S2ş½^L£©¡„vğŠs(1[¥¢Ì PB’Ü¥
†@¥0¸ø5ƒ €¯¯QC”TFÚèİóø,-l¦m¡UæjÆ8Ø&âk¸zºY
6«µşs©NFxTùTFƒÁèwñÇÁÕÌy¦Fp¸İ‰xk­-—{€üÖIºjG´jrP§lµ`i(ÊX©N¯Í´e1D·ÓMµÌ…Ø1hİ¹\Ó`sºnâN;FCs3ÊŒS·ä!	§Ì [†pxr7W¯ +p§§yç¡™x‹.
»†9ZA00²¦4œ9(–pˆK´z\Ñ?$‹A®q.…¡«‰ØÔoÁí–¿ltUÀoŞ2Zb²ÑÀSx-qg‘²:Ò'’É¡¦*2ËJÕ_†›™.Š,ñ®Ò…ÛÍ¾â€±ó¾Ò”¼7ëÜğjÎ0Ûyš¤kÌã”sÈì¸1oT˜jD9ZyhÆ)J­§b„à¬\Dà)(¦{3pG uƒP>Fám‡h	şà?şC8BêË/Ÿ0A_/çp{u	”Æ¤ä¢‰†‡<âdbÀå½‡2Ó½¤àã&^A‘*¶v˜(«˜MİÀuT (Z'İâ­s"Ì¥-s×F‘*úŒƒZVŞ´7eqZ”yGA\J"ê¶«÷ä¹Xí›İL#2 ¥ªt C+±«ít#Û¿®EK*¾İWÒ¸[”'1˜òSöŞì½&®Ü(˜pà¦	sW#şÌ*ªã¼ŒÙ³ñÜÆã!Ğ|ó-]N`9ŸL>G*‰¿¼¼„£“##®E+¢Ñ­IğÜF”ß"v‡'êÍ3tõf.I[ö´é‹·€Và¦ƒ‚›Ç:Ã¶¯D²Ö¬ä4Ó}ÎóMèPù?’BJCÑÆÅr£m÷‰ÂwbC´¶3[Àßù…à–ª¬„L"ş2¹
Ö„&íìÔİt$·Zšo3o£åÎybÖAó-í+5oÚdd:¹XT¦Oƒ§;áv4À|6ƒéí<yò+ 1»ó€ªf×inz8X‰¾°êñ¶5–õ¬çud™¢keU]K­·›ëwê:vmbE @ÕS­Ì}ÂÅÔëğ87zÙp­S‡4_ŠMZ½òôq¾ŠüBUèëxùïòö2é»BK®P1QêØŒÓšFÌ('½Ã,¬{e‘jJ×m˜ÊÆù´U=½ZÛA}&h²Dáƒ²n¤ÃuptÙå+X®f°ŞlàtH‰ÅS˜ŞMáç¿ø9ÜÜŞÂşá¿dw(Ë[†&w`ÕZlµ°QŠ,²wãZsÈk·Q4çmß“Ét7 Î=tzÁMˆÅ'Üd^Y¯
­RŸë¦¤ğ[é‰L4%>–Ë’:+Ót—9·XÜgš~/Š;/½h#Z÷"ã/AÀ!_É–¤`>Â»°Î›(› ŠñÛÍï²¯ õ°NË.YA-“ 7(e\/gFe±(q±ç\…{tzÊ•®ÉmdüøäÊ"‡Õb–£>ú 8ù!h‰ÔkOê“ªhëFe'Ó’µª
|¬ª9ƒÅ¾]‡ÒZ¯“OT5Œv±„&7a¤*EK,)•,[tŞıÔº 3/İ$¡œœ	¨¾¶$UùµÅŞÅz[™ôd‹3óÊ–èê+URƒR`š˜¨ÛõkÓ‚#uÅ@úAZf«]¥Mz9d°Ï€ ÑÊR‹BÚé°ôÑ•ÊqG]æ)¬qñÓk­×)OÇT›EeïÈ; Vez{ƒ›p½8â°îÅÅøè“OáÓÏ¿O¾ø»^k<ÇşĞ<ìĞ²LøØ¬Q½`‘Uµ^±‹²qÈUÊZ¯¿¬-"[QO«‹­EÙP¸¡¥,ş ªÎsn§ğGY>ÏJ½²›Zt¥Rµ¾ÿÊXßĞ†©¶ùĞÍ$t?‚6D¨"¤…ÛW~HN0W•‘âVÛğBY;é•»Cl†™%ntÈ%\Ä¡á]‘Ã¬'æ†hIÖY¦ñØ‚ˆ÷&‹a2sp‹ıèÑCXÌçLÊc$ŞAÔçWšNoá9ÈÃ‡ç±z,ã·ÁùùÎ;vw6£œyø8Z!eÂÆVÈÍµ`1Ø÷gÜ'-ƒ<P‡¦­(‡­”õ°LTKÙ6%-ÍôÛ:×v*–àR kÀ•±®«’Â¿¶PQ7Š ñÈĞ=IxŸN¶+Ğ„ªˆy¾ ë:‰Zùœ,ÇéÉ1.„İò­]¡ƒJH¤6ƒ+	Òô¶£Ó˜V[%-t¨¨ÏL“"f“•¹±$abeL¹$L›E=è$Æ ƒÁ î®¯pÁãsSR‚w]€š]+Wu|xxÈà ¬MVš¬vÁº\ÔÅ§i)«ÆS­ ·ÛŠzØk¼àzê÷Æ9¤P•IVµ©½jx
”õíÆ:PN§j‚{kf¤ƒ¡Ó]Ân'5ÖÅŠ:¤j¦_GÜ·uvO²Õt@Vƒ®èºPc-f]T9uBŠ¶?0ºT<P†A!­_mY†«je6#Mİş¤Q1¬kË·ÉÛ.H×•ÓkÃÈmZ"'ñìÁ1E‹qx0-nğ¾´¢)É®œ´ÉŠj%Q«Íš•MN«d 0      =/$/yW½÷{ï÷Şï½{!Ş‹^÷÷‚÷‚*„^$÷ò„fŠf Ğ  ğjï“Æz÷îGÒ˜{—š8ëÙ06 ÂƒyTqP`ÉE¾XÖ”U~HkéÚs9JE÷ö@ r9ÁC)Bd @"şR€"@$ñ€ÿ    # @D0½é'±rÌÄ ÔÇD¤~ÀØik¸Ì†m€Æ²–^QFÎrE™—äŸ=£ñã™ù…êD"Ñ¯oJ!
•£ç—°yŞ²XØõ©oğÃMº1º ÄŒöç+äL¤=|ñ ö‡sØºşiŸ$™aF°`l·8<ãì.™0V’‹•ÎÌÀ×gç»+«ô'k­0éy!›8³®kñ€ÙdŞ€p£ŸÊi´ıÛrñ@´Û¢è7…áÅJ|ƒUØÄ¡çÆóõï×ƒˆ¬pš :%åHAm	¾òy|%uÕDÂÿêbÂ£>	ª¢ÿ ä+‹QbX¬*-—,…Cà6[ =5ƒï;ZÂÑ»‚²wÑ¦`ŒŸåœVv¼ÚóIéØõ½Î„cU±†£_ml^ÀÎJJq£‡Ä˜Y¼ææô¿«…ßÈ÷ƒ‰» ŠÜúKîñq¶ şR“Õ¹mü¹–f‹Œ:¦‚OhjGIè
ÍÔç˜Ê9İÙÖì;£clš±)úLU‰TˆÇØ
6y·§tıjhßĞ¼uú}_rÌ>°^Ö¼¤–Ëô)'£ĞÌ_Ùé6gëããÇm"ær*„ ‹m¼é¬Óà;·[¤óÎcPTºƒåüwä’Yøbî‘.•º•õn€¦)7±²BVãZ½®Ş5‰çdok­¸Æ…oâh©±=_ù9­©º®Á ½Óôr‰y@Y¦‡æ³4<]–ÑsuëjÉ²‘r—;(Ir%æna!uf‘0­•º iQ"Ñ›ww°º“à
1¡eXÏ"°3HsÏÅ»SêIS=¤#rlì¼tïµLĞë]bfC°§NmÛt%ßY­Íùå,U’YJ’9RÌHxf·½aŞŒ»Û.%´‰”TG…è=UNMxÀa/‹¯ä’nM™ˆ"K–&ŞÎª¹\9D”ß(dó‘ô„Å¥V1ëığ¾,ÇnÒ€t&-Z—¶ğ!„f€0­ín`j SğÕ²[E¶>_-UªÏ«º.ë9
‹càô:…OxÅÖòs„…ÆÙ³°û›wÖÌa8d¯„Ñö2V’“ñãØGç1²VÓ”ÖØİN¯ôHm¿Î÷ÚüOpf u4`#‰çd•æ¾Ì•={+ÎôóvÆ‚G3Ä4^5  ‚Ç»µÒ0Y&ªŸ0‘ñ#Óí•õ/V¨„·HíŠ	üÂr4»bÀÒ6Ú	¤g‚„C¸‘I…ÿñy'‰õØnÏÜŞ"ÆoØF`ŸeÊ; ëï“şQ3úyW!oÎm5
VÂÓu~ënà˜åX8WYBVRõp1O$éÁtÉÖÚ2}¢È1
¹eüY‚¤i/tï¤šy¶*µ×İ—î>îTêGT§$$†„·-¹:U¡®Sg, Å‰>‰ì’„ÚgöÇŠHèÂ^Ü¦Ï“v+S&ÆjXÎÇßXò„·1ºÍOï„øNõMÉj$}Aî'+aFÖ¦OÍÓ³±3t-³zi‹7­jPA(‚ryq˜Iæ­›Ò¼PÑ2
³ôu÷¡å²{“¹õH°3F,E¼NxÄ {pÆ)–yY#kæµ[óËŸş”58D•‰L¤Ê[Fé,Tˆæ‘‚§¾’ÜÜzI­#AeZò*´yªœI¿î–- u¤Â—z1®EêAåÒ¦›{1Ï£Ä=Ör%·ÚJéE$((y,KÓ—_¸hˆG"ç@ò½lùÙÃU¥q¹‡!¯¾”w¤À™^Íózòm), ¦ˆR‹«¦ş‘ú8Ôr&s~tìLS
Xšp¿ºGêû‹h‡Kİ4$™dÙ<¦)a&ı%şÆsÚ”Z\zFºÔT·)lk•ƒ#smØöÜÄ"×+®§ÒFèã†ôëS)9#á•ÓıA‘Â´1¾¾’ÂHJÚS Èsè8xğl¿ºÙ"L€Êîhà»È	hDïl¢r»-S§"n¹˜Î	'8"ÇfuzîJ‚GhÌÓWãÁõŸ”)àÀô¹+ï³¨(r4V)»¶›é£aÙG¤¤×T’/¼ş½{¡ˆ¾‰YhÌfÅ°®K[h–`qMz¾Šõ	3H†*6ı€RO+ö=²Âd îz4KÈ;Ú_Ç~–Â¨zrĞÓ231pÇè—o“Yï–dÌù2Ÿ†%z!-u{½gÁö¦,Ã>c0ÁÃéÈ0IL+£µ†˜ù…;Ô¬
²Ô%0Uq(·•!”fÈS“Ei>Š¨7[ê9íšıÑ1øGÉg†ú’ï¢K¥XØ< IuM6\!‹1Nå1„rÃ]ÕÙ-Y¥'ÓºKD´of>Oõ8wLiyÑá©Uj¯¥|x®ç|’ ¼…9´g­¨Å6ä;£'õrE é„ä¢£¸å”ùõì~ŸH}©€~§ ¥x¥ospUäT'„èº ù¦õ'Ç²Ú(& ‚pÊ—m)1Bü’Só|lSş@ŞYLaŒ­£Zã¸”»„çF8ïâËIAÀF™Mœ…ƒ
¾+‚êìôHÖ9õdÜGëë›Ô®xçñü%.fT°}SuºÀÇg« ÓŞ½×OG^ƒÒîŠ2Œ´U¨OÄ"òdÒ½ëõÕ«)¥pVÜñ°Î~@!_JÍJK¯E•”#|wq^Í­óÜõ»7aä3dTĞÑMçÁµ<0ƒ‰›8[@ Ji^!xRš(qhNj±æRÏà»¼EÌe¨òÊ‘Çöí2Ü¨pÍ‰ù©bØi"&E\áõ²szå¥¦ª8}361IkëÌT[ıæNŒ
C/÷ÅAÂ."-£‹möÍÀşVXÍŠçÄ¦¬åÇêK0İ^¿®ò¡Ş/3»áÓãÑ|p4€ß><ÔÕ…{S èÎFîÒ´HÅ°ÚÈÆ€õeï¾à‹’4‚cÉ‘3±_ƒå<$ÜšEwu÷}PC§	Æ5û®âíË¨ŞÚÔ1-ùÀÔª1)åë/9œh÷î”ªìz"bDzö5Br¢pú•*MÎÑêêsfŞ¤ˆr)023é‡6)NÉJl‡ãÏv	½Ø™ÂŸ‹¦¾’UvjL{!³¼L=€Ùò^®0QÈ@BÖhîÇ0ÄÌv1TÈ úÁªÉv®À-ù‹I±ÆN»Ï8¾3¯‡OÔ—2¦”:F=8Da~&’<ïº­·x‡Ÿà©é†‹šqÚY÷ë¦³Ÿt¹+mO‘*’#d‹G83!4ÓñYM"KÄA×6—$©¦mñÍ‡÷&W§µ 0«×í:½F,˜£¶Ê~BÏ´=}[1§î¸ØŸºØ]R–xiw?®s¿¡­[•b”8ï9ª¿AÔßä´Î=/¡_±óÇé;™ÑFi.1Îj?_½HÛø§ubƒğÊÛ‰–•Úªf÷BâÇéc
¦Â°‰)aÉJRÛ‡ˆ{dÈ’dLÇRÕ‰VXŞúĞô7Ğw|)¾î@w£uA:Ş…-ş¨Áe¾ù„ÛÌP—7˜¥a‘€1Ù‚‰ºO;Wo)Œ„œ°#N#¬¬[xDè Û±BQè‘¤)¥‘…kfÎøù„†z¢Ke«‰ƒTnW
2Vt’¬'ªç´†àñ<Ç%Â#V1OcV7ÎóDÚ®’.ò:÷’ø¶zÕ2óèeA‹œ”%O´£å†Ív10ALÃÖ²Ş¶â|{²V¸|ÙöÅ)r^Åµ_ª.„ÔQ¹â­Z	ı®€f˜öE	rxöZîdÄA¯äwGRÓw7ä²ÑÛ8®²Ş0EM¸=ˆ¨óêö
ÕTq­D·#õUwD½úÎ€&“Vˆú³ĞIt­{[s7¬@Ì9R£ü@êk„ºÎÇ)Ï–UZ\³)b¦õ á8>/¥ K²]~ôÌä÷°3L6®`ÂËüµp"#qáóF®Kğ½Gb Âëiç®sÊÃ¼·¹eî
ƒz÷~²Ö•2(ïL4ãêvëÕ”«Yû{YĞ€LÍ#ÊÏ{!x7Ùš+	Õs`k«34·°êß ® —}V°i„*„ÌBEèü`™zµB&¸A ”\E²£<óc>ªm‰>ì¬;™osy>_Nº¼O`}÷‚õlñ³Y©°¿‘ªõ„€KÕóš¤
ûÉ9j’×í†ßäÉ•e»EëçÄúëÃhÎ¯&2²¨êéîcÓÖ«àüåÛ%aD´®#´éA~ÑEïLÍxÆ´
7á†4‡Ræøa€–+Iº‹&Ê÷V;Ã›™˜SL1Â&3Z
=8†.¥{¤<íBk‡g»ôRx"h³ÑÉ¬ÕşŞ«N(Nû¬¨<^ŞØD‡ÇìKŞì…(w bùzµ:f–ÎØâz“B­P.¶/7ã°QNæÖÛ=0L5ïöSdìMêØfS-m_Û{.3d£RªÀ­~éEñ&œmŒk…°7#ß[*=gsˆºRÓffµC‹Œ…ä«ŠªV›>¥´­w©FÈD[;n!>@foBğ'dN˜=ß_j +lyÂº“ü:ñ Š*ŒBD—Å½fÏBl-á>îÌêŸ«`–K÷0ÂSÌÉ]ç6yı‡åÎÏ)3g¸)^ôğ/åÈRİ:QêÎ3DÃjÔååêÛ”x¿æMÁnğŠ)Ó)Şã	ãR.™ƒkÎÏß,Ü`·Á3ó÷W¤WõÎœîğÜİ¹††<œŞéÍ4,?¸ÁÀªtPÚaïIŞµ[7v¸ Ôä¯HXX¡… Ö®µuî|÷â],fQ1p·{}?ÔrIš_O’qãéèÂŒ BòJûÖ ´ºUÙ6_ó^œ”lÿçóåˆÇƒæÄ9Ç5U„¾±P'Ùƒ'\ÜuÂphs^¤_
«¶…Åõlæ|—¤Ù‚ö7·QXÂIj9¤DÕÕ”ByÀhAâÈp4ßïP”EgÒêw¦Wh¼Ğ25ôDKó—EIHÈceÊ·uî(u{‰
ı¡q·Šùgñ–Çµ¾Ñ
•çq{À'Ue~iI‰D´©q>Zï¬\”vÙGó´¨÷h¡Ç6Š›zŞ¦~L$€ë°ö›ÏéÈ‰Ñ‹yu‰²jŞ/ŒôÖ¾²¾g±]Ñj[.<ù¡ñuPîŒ\-øÅ±%š#w‚º®‹¬Ä†gü‘WºÏè„fç‘Ñ3ÒQC=îš=—`Û]v¬M*¶HtÛ±YJ7†©õì4ãíÙÛ9úUÒa!Æ¶j'ÈU¤‚R2åìïĞêmS#‚½-ìƒÆhÌ””×.‡œ‰?MçBr³F+9/pwBö|üÚÁ¨ñ{ğğ`Ç4BŞ-–¾;ôïéåe'3¼1Â´uÕÛqÒ^Vÿv2›Á£ËS™í
·µàrUàµ*& 8QÅ‰_/ìÈÄ–Ü #äó$|O‘°UNĞGkšÂıº«j Wó6‘ö4 X+}^¥Y„ËHXè¨yÓX NoÆxKò¡]Dˆ¯Úí`zlã\2/'µeoQ²QÃáœ=£´çÉ"ÂÇ]„¼¹DòàŒæ›on	òº¯}*oVa8ôz‹,ßœÇJğåp†ö'»³£ÔŞ6u.êŞ`»,´A^Òğ-KyÃ¡¸ZµkL”¦J0R×Ê}™äÑ¥]Ëd	-ƒH`ÕÇ©ïôkCnÆQœ	ïğ¥$1ƒ£]ˆ‘ªÄŠ_fl,Î˜-è2å	tCÁw6½&.7õN:´!ÛG¸˜À¹O¦ØpócDŞFZë¤+aËqbíÈ“YíÆ–Ì&[®óö˜{ş™J€®æ).êÃj~ŒoÀÈÕt¥˜·–cUÊæ—äŸö MÆæòôtVz·½{^ÁëÆı”sıÕ*Ã$åY‹ªBW7pÇİ¬´9Ë6Û˜3w#MwdÑ‘I}•…*ÕÌ@Ö{åĞ Á(Tƒ¯êóZj‡Kâaa¢yA%G¢SŞ/.ü‚-+¾†@âá‘Ëqì«;Ú•i_Ç2Z+–œñ@6õö%µyö›+'&¯IšN’«‚±$+«Ë×Õ®¹ÊÍóæïÑÍËÅça`›ø²‚”„J¡÷Ftó61Ú”¼ñ g1.Éı©Ònßˆ²ÔÅÕj‘XßëW¨=mCg_Ón“Œëõ@HİÇ6ï;Ë%—ÃŒ'‚×2Sî¯óÉè-]ÁšîÖxHF°ÒKECU0” „Ğ/×Ù¼¢Öu‹Ş¼W"…šÛuÊ+q9¿"\ÉÃTviPìŠÁW¸¼ëpx¦sl#L™_Ò²A°ã¡}7bö<‡nKBã¹PPºöƒÀóôóÁï<—G|ÅĞªçIÎæ¦îÊ¡u¡ƒ¼{y2nFü5fÌ7›—»]óN
¥H:1vdÑ*Á±Ş8ÖÌ×× }´*Û·±¡·ôãˆœ‰ÈLË*UI	—;jÊAè©HïI"¨%Bl3¤·CòjD1Íz!İ.|Ù¨VÆ8$û|ƒöÕµïéKUPQÉü%:v!òŸòn²“îc«¿´»Ùu—`UcòF—(çæÓ¡Oh¢Ë³¶yºPSFÜY‹¸N‘ØîëËt»N]¿#bºÉÆĞ¦a±³º‰××C9œí<KS'SJ§¡f’ÛU@1§…†är™	Ï¦ºu=U¿)ËÂÃ:ıœÒÎ}æü5#‹fFo	N,S‚ÜÅ	¾ÒÂGêN¤•Gi9Õ±…ÿÎì>
f\~4)ı5“¾H•’v¬¶ëÌ	"|«J<„^ĞÒ?4éF8}V–@§?G~ÿÈ­ßƒ:+¢Ô¼ç×Ûş¡Õ@jïDÿÌ\Ù:1%œ¢è VúÆ*”.LË~cÂ_ƒÎù
EÉËôo]ŞÕ™e™˜Ç¢0ïm™õ°i®İPÙS[,;Æ­]ÎËİ±7ÌPÿÄm—:É«íânéöAvºÊºˆ¢0zRòK·úY?†2ï)…¸XBË	!*é†b¨°XÅ@^4¤Q=ôxŒƒvºüß2]Óq‰ÅVnæ¤é¹XÚ#ÖÔ|—7?mâ$ÊZq^¦?u`Ÿ
—¤âxí;ĞŞÈl¼>¤gÆ=`?Înà+ÌçNç‰Í°+ÉGÜ¿h+º¹ìê‹&ŠŒ>>AxœÈù+xt`Q†vPv›¨“|hájU¹ªÁñd·UMÀÛ`èkú‹<l–=hØéĞ6b!¿sâ·AÎgÿ÷ JÏØôíx1å;ÕŞö*8÷öO.G-èms’Ì¼æ?ñBœWvE¼«jè4Uë¨=
à9oÂ
ÖÃg¤1­mV­Š«Ğ“×2Ê‘z<2†·†–OmmÊX¹	±°ô˜Ïz0PÍ4$éÙİ’*®$	V5uK	6¦ğªpå(•D¢\.1¶&Âè
"Æz™¬“ïyƒIk«ÒrpGæQî[~oîŒ—ë§Òqw3.î«ÕV”§˜¿L‘àÕÉÒëéA‘4¦,™Z‚Ú«6æAÂM‚sóGŒ‚äì·úhğ^¤>ÃˆH+Fpş×cğ…T>ç%ß°•
i/İ?ÆĞ d	ƒ³ÓI¯KOT}AñGÏBYù‹­±'LÛF§O7kˆ3BÖ¶×bú÷hŞõ¡‰E²"¿ÆXB§Û9èT®jõ»nl¢¤¡V›[µÍ\	¯ò–59-®x~°Zı¶hƒj=­Uqõ{…ù½;ˆ“ŒÌ²ÑêZob{¼ğŞà‰Ö…–NVHŞL¤uÖ¥Y‡Fš†â"¥ÿUÇ(Ë0 2_8ÿ-¯Ë¨eŒjÕò¢B$›tj”PÛóƒ$cßz®¬è¿	'P¢!ãlJl€1æ¨­fGû}¬|e¾3g¨.3èf„÷ÛÎUP¾1÷¦sa-zËœ4yö“AÀƒ¤İj¹åñı½> §ÎÁêu÷ª–h¤ŸÌG²ˆßï}’:zİ9Ÿ;èBF -)ÈD(âìb°L™•œ]™éIFã­¼À<”\/šy±Úˆ2»ŠŞ,ÀW†âL¶b‰\gq¸! ô;¬c
¦Ìø†…?¾ÙwÄRf”$à¨²jC’›oØDÓ¹.+QA"m¢‰˜Í»Õ×(M#!y‘Æ®›xº£‡Øô2§çxOk´ƒ2|N¾,/)ÿ.«©n³Ïï³¢¤\¥º5döÕãMSyM¨³‰º¥T%¾bÛU*»PÊ>Lnh¾;iØ!(	x‘ºUÎc$&‡77q{¡¼hW	FfVvµô°™ï·Í22nVˆF7èâí¹òB¢Çïz4„ÎÓæZNû ÍÖ"£`ÂHàCŒˆÓ—÷Am²lÌh½<Ré–¸ƒ|ŒzóFyÈğHÅ=&ä]2…%ß€A[½of<·;jÔéÆÓæ±²UkíkAåZ  ¡û¹ˆÅ‹nĞjæäâoğá6ö5³·ŒĞ’¡â·m$!˜-œüoìæ´ævêû}äî‚¿Üz^  °\ÂÕ½XT–ÑÕ•tls¼¿j¾PbÒ656t·‹êÉ E	Òù»9H<!¶zËÖiÒ2/&«òí-Ú¡áüU¤‘z$¤£<Äñ“	ü">re8á«“¨
šÀ÷R˜« N;àUæoLÃkÒ{¥fm5S4Á’'èÒ]³O4/×ó]H†ì=·ğØ‚iĞ³á¶yïr¶ÊÎCB¾æûz’4—µ©½r{ÜM5İ½fS<ìVV­Ï,ê™Ä0¹2U£e¬,ë@«‡@Œl“ÒG4i