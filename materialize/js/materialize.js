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

      // Fade out ripple after deџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџџЎTЩдIhIBLyВЛЏZeмi.KобWLts2Тr;SBeSЯ№"`bЏfd}ќ Mівm&	ЮЋL'Йo0  $
Рўй9SЗ­dlзr[Й­pмеКtЅeo{Лк ]аюм=Я6kSдиСlWs,[.g+чЦ]ЩВ=пК$йbмб1!№nџw{БUђЉSЪa6РЎ­D&ЗZ#:Н<[љШ§/Г%0Юh§Ѕ7!<ї/FО/ГPииXOД>TжфхZeqн
WHJМјЅRсђЖЫЈмьhЏpZюзpЂєэL7aАкьЩЎЄШX?(њћ§дg5Lд	0щХЬеeЈРЯсЦB_дэQbDТМчЭаЧШO=ЊБаЅЙІRоЈрV*/НXАРѕЃЇкZи:BHђ&ЃЂімѕWЪРsHљыQ#иqББPНкzЅсівeсШџDa>ГUVR№=iБы zhдуTMж	iшyЙ5ёІЄЄД§ыЈ№,7УНаF;H)@АЧ&ЁH[wJдВЈїJЫЛfUї}ШЁ@U*cОЎSVє~ыXкяEцЦRJ.ЁнcСе^ІZщЅрИЪ9z<Ѓrћr@ЖбдљЗЉМЂофшекXх`рmО?n)r,.ПеfLњ.*­Иxв_Н{dѕ1ЇЅ`N/ХНHО%ЇCљо+ЋБ2WЏВv=х[DU=Ў№цN;N|ѓy9АЪBСkЉEЄ+ЃйњЇэГ:&O._НїєШў$ЋџУoчFFPўЃеиIіЋЉ,ЭЙПњБЉX'јееzЧ:ўN­С*І(Чфd&цО-іЬxаQЖ5aпЭy9j$ЬЉq­lHЏ PЕJЉвj5т,?ЎяТq;ЫИЩ_*(TcвиЦ\<E?Ч~ЧЎЮГ^љ-­>pzqCХ$мЎЪлЖлЬжЉ<g Эbчас~њ'+RъЬ&ад<MDр!ІP^§[ЗмyБжDnVЏпв(<юUEGЯБ"}lАїмЬї§Е;Tи-AФЎчїЃ@IЉЇыwGkz!У^СЩS-<ПРoZ|[8ГT dЅрMofRZЋ§шЈ?DLiCRЊiаўЧЊ
7:чa]%ЕvэЎэМ@}Ђl}|ВWЙ}$]NA,бАнўг8F4966ЊуFЎ|L>бћ1^iq$ТќJcМUХО{њьг:ЪOVfАВЕш+ X)­UN7јt7мШ ХН4i/кї?vpжЂш{& ЋmSjrifDшіОЫЌПx#щТTђbќЉэ]ї*дЂPB§В((mфKAЇ#iЌМСоѕІИы 1e5щх ѓі[ЊЏЇ0<.иШUМdЮЧьТ#N№іSdt№ЫЧь,7щlS7њSСыЙЪЩ(nLG	СЌјЩѕЊйаUтНlэlпOЖ! uЩЋHKGќшЉФd^vіЗзсМЄ<wВЋvvЦЉGLњbЖ0iіюhЋ"љиќ~йнAњЃюлЗюЮятмаПNа №`xQ[њ>F]кі^тфУ 9Ья~ X[Щ}QрГЊЊGTG!Х0ПPы|кЊ(љыWW\С0|uС4EIxт§ј*NйЃэы§WђA2,бЃ}
­ђU<[Ђsb]JМЖ-9NтђмЊљфа2O ]п.ьЏ!<-Є3`[gdжыSG8KнџќЊxWљУЛDЎЁВБЈ:њVIСФcНEъ3ўЃ7ЏgGeІЛёY}ЛйtХКТх4VЕiЁvHъpвСxvѕаИпщ:\=4bЛБ1<!эќyyaД,K& rл_рiZЭНлођёz1Јwccдy
PDШ N§жv
?c:ѓтеЦ4§ДљXс\ЧNі'?б/ЅЛ$B ЏОbQ$ЏсГ9Н~YЄбвiЋУЋyВћ`їб|s}]Yхі	8WMк]дњ>.Дb$6>р*kbЭjфе[n-D\dq)BсQє'
оCУџ @Џйb ­?,ѕo;ѓ4љQ<Fiтэ}d)ь7$^+ћџЖ5КТ?ЏXB>Й{Чьs1№/яc6ХїжЈЛЛфјЛZлі !іz7чKјМѓC7џњNSЌR;8аwѕЎ+фiвЪ~ЯA=Y?#г NtЏЮьђha цBнФ\OЫEЄєrЇТФЪaЏїq'КoР1GHНbглђиnЉу^ѓДёk5d;$vВјЦkjшWзЪ!3;$wя§2 ?M+ўтоs&I| н-PзбnLs10wДЛтзK:Гдн~85Ф	[бпЮЊЯ/5ЃН+jv№ѓфg"Л:RР)TфH	XK)љG\пnтMX1={{M~/иЧWЦѕђї"сЙЯsvѓ!Ѕ#ВэCХьTGNЩЏQ%њМкЪмeTыAЧЬъ*sШaчЊ-UWЄRХz4|K""Ц?LG)М
BdНгА4­,Xвjо7ЬYlЫЩу+вETVх>Т$ямВрЂќSХЕ>{ању.eKўШhшХЄdм=<неМТшЌEдРяиp№иHЪЮЎK1d@$A9_uЈUЕ+йЂњЩс&{|НБ*дtАю*Щ0ДљcN*Ржъ9Ѓ+@ЃъйЅ.ЇЯmrіLQ"ёЦI,Yдгn?dНГуBC%aZЖдfЃxЦи$bBшZQ?9ЭEMЁ№Ф
ЖHЖ[nі}~Є)ЉоMДЧ;оf:!-дюјјЉЃ{xXЩ7y0ПЖфДЉ4ЋCћ:Ѓж5[Іџ\3c-kЙNЪбВЕЫЃ@АfBО6вbGЦ Ћ' ЧЯдmtK10Uхзи_НО3юцnnУхKєМUЧћ9PkD4ъ^Ф@@OК0Mт{тJї*kС>ўу#!p-c-бЁ­,ВЩКaыъРЉC1YuhЛЩЫЗKBuЧ
БFЂL	жшУ .ЮyHзп ј;dДЂЄЋрцаeйЭњQбЁ2Зj&|ъ ЎіЛQуI(ніtоиЮЌКјЫ/|ЈOpд2Ю2вО#\Іё8џчтTSё'ЏГ00џДPjђ|Bј@ткbZ=	№ЬпГЙЂШЯо@ђNLJhBєпЯПИ3оЖЃvp#Ы|tђкGИт Ў*Г r+ХтZЋэrъъщЪЊNѓ9Nq,яl&RЬ j>эп{ЖXDH1T9Ћ&ШжЁё7Ћ:|0AО,ћДx?j)­|ё§aSЪ7!3И;Ша:єИTSХ%ЇѓЦ,ЪQтZSDчАЈдЁЃ&'5ЪHД~Ј(<EZЂѕщЗuhrыњЗcс>n%ЈЈЪИњbЌ!э­Й<ЅІЦh\1љС1тМЬџ
mRnгьФЗxчcйuІиВщм}оѓЩШ@ =ЉЙ6%ыWюХ1f'ьХФрt1*ѓщНко)kў~aї;хйіШМBІэZЩ№ЮEvЛpeы	Ђ
N;DёГквЕNN#ў	о.Н/щ7 opОѕ>#№жtS}ZЯЗе>ф<Пр=с+п:&ПhП Уа]ђ-jОГЂ!ёOлZbюZ	3eAOУћІўШЁQЄВвyjШ;xЌPUы|ц$G&жЭћщj­-{%98ЕєшЄcсAІ,xyО%D!Ц,IОfќь\j;зLЖ@МЌш0ЎЌ@LЃин>/.ИТљPэёдфЩgв,Hу_jнљЎПdѓ3№иs\4UРа9њ Ф2уЭШ&$2СЊЏWщ5Ѓ>чыЪѕ%|BцJ~ќо}Dыьа{gїсНЃhБg|ю;+њСje|<ЌlX­>FdsDлыBRсTЏЋVПЙЪx*ЮкЗєy6;УѓН(оЌ/ПЯf(.щlЬе0Э4
>?їщaАйW()e?/m[ђД1ОuxмНMЯађ0kћgаbXќnЈ0VyYE2dEc>\*љР8EЏЉd(2Ђ$ёб"DЩD жPђоЯеЛs}ПT	 iv
n]ц	ЯУ* /ЫLЗrBMItКДГSJрлU9Ет#.xШнyп#Ы6=Ў/п*я^ЋFЋиЛ? lЇ7Т
@0ћ чЖш wЄюЃHSй&їНBІ9§Ѓr3kЋЧ:ѓпЮ5§?ZkџРўР­*Ч4n§ј!еџyтљVю0ъИђЙквYб;йђHKL6ќ лЅOk!дѓЖ~ЩCDBbљэ` џ0ШьWїЁеnL>>DPЊш,IF7aй)йЗ0_?GЃЪЩпРЕуІдзUCEeпЫТєgеkВ\ѓщЬО0=ъMЅџЏ~}і&!ъ~8L(|I6M>$џРџђ_џBД"vёЎHЋпT$Nї/Пшy&-МtNфчЭQZ8gЅЖpдЖSЬГfЪz-ј(OЁа'ШЅњЃъРљ­шzе|#Ј:UZ­@ЙQfьїш95?7LІЄЖЖVХ=3*з§ФhФСI'йCSмюахХAZѓФ?/FрѓЏ%ўєИO,ЙњђџWЕіёџX:ОRА/ nџq№ђ=ѕвуT0wД}VРнёpДыDЌhMВсўа^ќрaўbѕxЪ^V-k7!&Ы[YЏ-ш@6Х§ЂЇѕпЄхЫщЯ:нцy6-Tјй№Ч2{QX-f)eКzП6!rл*­EЁ!Хyч{нi;В\тG№M-'jц-н4[гjgД4ВkrVh(Ч+f@ н^гbй`ўиЁЁЌDAШqТжH~љ5Tнrњжѕ\еФФ2$ЬHЋ9%Єкды|%ИШПtТц	ЅЉьЏЕЦржњ;РцсZчf)вщi$у?=`ы0Cљ:*uЏLz5Т7VЯr[%|dF=ІђшЏpX\ЭZўЋъо1s­iqВмїџЅШ=ЖыD8kЁжЦ4ыЪ~[­1ЛЙхUZ
baЁ6йлШТoMВ}ќVУV+ГMЏуО_aтєVЯ[!gСk%тtиыl9ЭПєzsў?[Двx8Щи8ЛGУљ]О]}ъi(7mЯ%Сqwrщ%<vіyеђЃжф"њі\fЮпgZh&SТ@9m%кj:o2Л(ьЉвюS,АIйtpOъєF­њїs(hЎgп[ыuйЌ7МЉШ/}ўЯdЉа~рЧb§ўb6ЗщЬ/ЏжООоєЁХиыЩааSнуuмюxYжТHEЁЮівuь/FѓЂЃf]ПnO№UM7ЈЙcХюЬљ
>ЁНMвьXMZ?bлW#=Џп D-ИjІP7%Ч L1A&&iкW~ TW$:шМсУNоѓi|ййZЅЭГOoо
дGЮFВОdP)tМPgйЭЗг
аУsСЧqЬ-kOЪыёа\!вw3Ьїх5UВ^Ѕb*HњЅ{ќOЦфџаJ'FEЮл>"z!оC#X[Г!Й!Џф@ќТ&аІЂ%apй6наЛФ,+2GБ.:џo[ё7фЗ_dJ]ИљМmf@Jќ тojиSWJК)Дjћ*ВlnєЅ:OЗ2й$1геПВ;ІlІj\Д­Rњ-3/z6ы6ьЋшБuЇйМn|"s2ЙZц~мїж,{ЅЦДGЧM{с]џT~ККл4ђiЯкdXoТоIќv\.ђk0QхоѕxZмn%3ETПgњЇЄOIDйІ~XL|:1УьеЯл'АгAјZ$zАXЋбs$BЄPm|FpЛ,И)MWжА*ЕЧ+Д^#z>6ёьr6ЂG)zўТіq_NuКkГѓ8гЮызЇ ІГлЬovBQЏЪЯ1гBnхЕацЗFmytЎ{ ЮkCKTe}8A8з?R]fфy*Е.LpeЪЇыQпeЇЯЉ^>Е[rОф~уЏlцFЧ*a~ErgЋщUlМSТђ(ц~1ЕzЧsъ0Ч"чёЗG#Dі4јн
зН|ЖbVъ
g9єЋ2ЅЉ5вВ]мщЛђGЉdV4Вfз3'lпgв%5 їЭ{ХЪTE6ЛЉЭхPѓ4NZэЩtЙl3hхk([CПЇГЎI +фZвђU)ЁаВсrѕlaвсѓж^і:кxУ<"EУѕХ+N5ДфТ#
UGJBнХВ3юђ8Нќo<Ог|rBк{ЎqэОS8ЮшїeQH|Жh!p\:7>]bћEоЖZ-лтЦ~Ђђ}К)~8HД<вТYы$hLI3внHs_FmAUGЩЄ"О­ъ>.!0пtЌЭIаЪјТљПђT&	Јa1z&NЎчSnuЮыхy@EомђtOКѕ1Bbf}<ЉЯђI9oDэЭЄњрхMљѓUсв 197y-й :Aњз/ЛrйХKћнсэМнKBф
§xБBЗуЦE?iњљzїzьkпіЙx/Ћ+|жъ9n{ЮЄѓpCЈь^6гЯлtЮЊасє:eЬЮЙв РЄdь\тOK№ 6?-/"ќEН(v;SЇ№iюфn Џ|эі>Ла1sБАeM!-ЈДkRФюX1М}зУy№jійЕCШr@ЈіХyx>`ГW /еst#6ЫњфОЬD',ЬZ$Ькuй­*?[B}ХJпp5tж)<њл\зYLЂОQKЌсрСч	оЏЯКяy/U=чЕOя:яFПN+kYr`~ЁЕW^(ўbо, ?/aЋ\ЉРЕYь;5CіkUZАЛdИ%ЏыюЛkьАC6jМ@іAу6к!Ц/iHjUгTeљ9ї§];#nxAї%Un_ЬMЇн"HjФ7qУлјOoтщ.­оAЁј}ю/:Я=J.cnсыJї,gЫжИ7oPн­Ф/ХЃе*ШA*у7SБE:ъИ/ut*Б,№.ўfыї[вpГпUR Ir'ЋэША=ЏЛTІJG3 ­х2LOсKMГв3ЛАhтХ)Њ>љЫЋВЕ№Е№tђш\рЋq№Jr,ЮbEЃo!JESФЃ}{ѓўUхFKt!bNsъТЪы)7чќФ8ЦJE'!О5Мй  4хќZсEЉЋ-pдfgщ&2pЙHи.ж2СяѕeDrЭШыUЕ1Ь/н9АN<]KN{рчRIЊУ#tКЦ*Њ3Ю~хL{aУdzyuш`r1uhk9;кюubЃК­;КјH1!zунЗjЈ.К`7иъаK(,$a*tёхх]Г Ё >е#Ђ<РBTcа8L]#ГЏхKї-)8yЗЖ	№вЏMў*dМз<9
ШЄп1ІVФ{QjщSџJ{
 ЖХSњжЦРdmї;WVх_ИфIFвЊ>,ў.IMNЁэbНбї"ЫsЂжнKиfЪY&$эР	ъЯM*zxГhDњУђ]Й"ќгъ№5н.ДЬ>f{ЎВЗmіы њj}бй(ВахФЯз1жєiј!­<*bг|/ђBePipНмЧЇFрђК8}z]і=?i*ЫмАC7кKE[ф0уП4Ц\{U>Ќяћ&^,§ЖноkвmЩv<вИь;Др{dОЭm>Uнr0?Иу07}>ТA=qDќМѓХdєд&XPbLЄ№`Їyqh{ВИ*Х<xбкu7geIБЄX`жщx`ЇЩШBFпЉИyњь5(яжЩ`ЎЏІЫ)_к9ЌЁп ЃАQWCQ`)LAlЉкР ќЎщъJъ ь0yР%мjЕ{ВіщЏyRРьшзћfЕvMу\pчзe.CNiц;ы:Щ0'§\ЬNхНc!њMpкbНлЮЫЕД
S,Msњ{R[рЅЌ+jзЭЫЦ З
Чkp3ы
ШLщH/Їч_ЭFkTXт/ъБfѕфcБ вAbФ$eѓn6_9§D)5ЦоLn>чЮ~Ks\ЛЕbkє(m"TJHьгкч­6Йэ?нР§Х4{gфЧяШтНЏёіЇRє<,Є	 Жк0zйЄ$D&е~/њ'gЮШBx$ы|eз0|Киp(VXдHДЃd?NГ№0юA+јЋЂє4y\Q"[Їлпїё!=RцзZB|kyН-aыЉybЯЯЉaћ[6ўЦo
eњu)њeж№rЇyГ­џ[Гr[(ЏѓїЖCјЪЋCmўИSЅa#Iя(	@X:ыЛQ(ь\№qЁrЊЕ[Dl*лЭ@нGъAuiJх* =Є(b>$ЇЪ@uТ+ФЖy)8?F5Ы8ЊежЁ9RњAЊьХлQhхЃ-+§Тe/Z$ШSb&уkОўmЈ^Экж§bЌcЗпЦ&ЕaQT9ЃfЃpЭО&UіџehП§зq:Ъ_њљ ЅћbЯLc ыН1ѕеk}ЛИёpи3ИнLb]І[БлпЫЌGЁБaЧ5zgъК+IlГї<KeлК{ENэ|їмu]ЬьdЦсДюЯ1_Ј94b[іЫіz(яЃџh0ќДт$Џ6] 4OнQ3Ќ\ЕЩ
чofхQuщЎ8З]ќvzQЗргЪвє7ч§0ц{§QйзЫпйJ2ѕ+dкEuїpЩ%rsH~\dцьp9бзZЎМњлыuwё3ЯрзфдбЃlvЗЫјЕ gЪvИрЪ!FЧ	ЏЎ3h№U^3/9EЃЄ"ьБЅApDМiъ]`:9Б3юi)рШЩьиЎDоrШA9:ЗH}ИЌБ§&ХPіDЙ­Ъь3їГєЙѓWqП д P6MCГі*3  иш%SЄгЊ9^aeЩУњAДвka2ЕqaWФѓч[аЙМО	kcrJщЗе9ѕЄбpйШКі6BЂГ^МКE<Cј2Ж3D]LolП0НДx|pНвь&g­jаУкѓP"ЛР;AнЄW2oнVѕX|ySJBю#Y~$ИXaz *ђ3Eж%buОGЅ-эEzфІ0Ае+IІjn%тmощ Щ СFѓїE@бUqXДр>сWoxыSѓкпр=рxьє:ф№зf|нй у|\эЦЮuo;уbt	}ЮнЊjшъQЬ4W7sгћЗ	BJЕСНCі{KрЂC-y№7 Yg^ќћеЦЖоVdњЙЛЖzjЛЬБOqЂAУQcЇ-ЊБOзBlІsp <С9тіZф
ф)є9F+7m§ЄЃtr@ГЋlOCЇбея;Mлгєњж:Ь6Ёи)эt)eНhсMDNчбІ&кп}}OD8чNQж.ДV@Л{О0ГЗђнOHћї:c>GЈФuЌщ6s!Т`z\4MОMO2M_йѕѕLaУsбmf&[y№}**^FЋ68'$ЬjФЛqч6ЏH ОЁ-МХЬќgіѓцEл\СYгЁBxLb-е"ЇLk.xIЕ:v9фѕНвў;t+ё?Ж6щЌќ@їp|н>ё6>(~Њ+)]EЄ$(Є{vF5Ў(ь:кЙЭчлѕсSUЈЬTїjХlпЬЌ>=ЃтгRt=X(DMюG{kэјПѕ=м&тНgЋВ`"_`УщWйDИyLЦ%ifj2/ь@snnL.7п'йБ'WЋО8XlfџЏЖaтWЋг|ЬЈZx"GЭкы'ђЧ КtьM$7i=M#їћLo^УёЕё&Z%[кхіБH;ЌgњGjхT?
Ё?эЧvМеЌП§QЖьЁ+Г$мЮЗеjd?B>O$ШM/йІQйUсKЉ#f0inKЗЉ{&\ЇЮDпгП­ВрНLЯЄЬ}ФV Г9nВМgХ.еadvКВFi0Р=ЃЅ ГЯ# nTЗт/ЭђхZ8+Ъ бgZ}klpхx*Y VC"§fPтЕXgюLљшьA3,§|1mЈM/
ёПIк
ЉB#њпъsxCЫШћќЖOЛ<оVЗ\NН;&zЉzGЕЯОЖ9 Zи'Сџ[pAя*D<*Ќ#5ЇiEБ'Г:тТ
HЭFг­2}ШОk1OЋ"&xSЕ8oDЦ#ю/ћXДшЗЫh\ХhўXФЄDћgою+Ы]юЬ№ЊЁШG
Пщхямзt{Цѓ9Х5v:gТ$UNТїЄОќз9пАR|ПЗxH:Ь%Э"-1фаМц$ђ[.Яј&!ж№љbyXdА,чџ3goНBлo
 Бх0Ж­C'пEЊ~N\Х6Н_WvЁВхџойsю<sАЃDиoQJ4ЕеxПјnьdбфT1WхuЁІ9!cVNNгvA${ѕђЛэМHGѕ.Љ*ѓ/є~ЃТЮдHEЭvЄY`kiшlbтРцШьЗesМV{Dя2z]&[ЖJфЦюbЁс№ВЕЫШ8$[ТКDqьЫЁ-ЇVќul|^гaЌћдI/#Њ0?r"RЪI,б3Ъ'пРK2PЙЌBr;ЗLЩNЙЅ5S6ќ~ѓЇТАpєЗ­MХЛиh1я^?Юбrэb~)wFЊ)fјYуDъї(5§h-HУшЩЯкZ|р.36|mОаЧуЭг|ЎђiЈя>uы,5=юЅyОZЏu{џuл	XВч6ОСЅѕйz;Ѕђ t	!нЁЭу-ќ]PVlMУШЅ эtЬ#K#-СИy[ЉRраи}ўЁџF"&Џдi6fiЫъ1ј#mњтf І7И!feрмтOэЊ9а#мУСMОђпёУтxсхнн6>Щ 8Ed@HЏbjЛФОтw.eVB2ЯЈB#ЪтЦЕeh"|6OVfйцd\Ё[+РEBѕЇ,8ъgщЬЙ5BтЪCJ(Щ?ћЩgXЌщAЇmяМєТkЗїНFKcЏ^бWа,vэ!jSІг38viб8N@,/лjыд<Юдтzћ}ЪЇН[F1%}~јзЋЈ$vcю4 ЗсѓЉZ&б8ыMg!ГRГ§	5№I:РУtlBo[мдђ@РЪГPъnњ:КЁ4Ѓ7ьбэEўOОб\KЄЎoтЙЖЭШС_d"окC4ч~еtХЩѕфЅaуiНц­{#І?ЯU/]	.3<TSЄ$Ё(/лІђmkf%lQ$sл4Ц$U`МЦўщџњФMwиЖpBж	*L<jUёћг(ВД=ЭЃ_^:(іiЛnћ)cиIп<cЊЮнЁ>_оW=ЃpVUј\Лц3 Н.щi6ЫwЬЁ6ЋЂИЊиgЩўОvДYге/МИb$ЉГQWи}кжгЋЮ*|t№Шќ}!зг+BЙќokX~&NвHPЖ08ШчЋдјajСJNкФ Ћbw_rbLhКZ
QЉmaВI ъB­VХДMFФ;B8ъl?XqЧќчЦВIдоёXg§Y9гwЎд2Wџ№=уcxч]ўC$\UTфЛQE3уwжP:яGE:vBqМj хxгЂ_mАP|88tпьЛъЖЊЊ	ПнsЪЄKУЮgd.fіplїKМЩN№eeN8Ш­д"гk= еЃМЌР	ТЏЪгЮФмрЁЭцє4цхьМНGмf#уЬiј
Юй/гщ0вАЩѓ|ЭbgmrЩМIОWp:м№S6Ќ7|T[мyІ`$ЬЮЫНЖ:kЪбqvo#ЫЩЖЮє]'ЫєlрQRы*o]Аkp^сxAєP#ѕ~єQTCфI	ДRm Nю0№WИёйцbs8tЗOЭ
yєОщ#ВЭп№ЂqЪv`^kЙpК{пПФјВi5цјvхтRъ/>ZnRКЛArЏ.L]ЋН&ГNayЃшxпгLЄщbЕ;Ј8(Х+єK^УРТсu№ЙЄВ№$з(ЬГ(аќRЂщл6u;ќ0ЮЅOњ__bFEюБЄЫ0меIяXMЫTRвПMјпLїНr9лћгIфчШsцЈ#xхЙaЁEХFu~ЂЙНЄГеzt+Ќ№GО'Щ4qйњVж.зY\нвGУ ??EіН`Wќ,>Ј<zшZљdЧLЭg}ЮМЃкEЇюЕ-qѕWuR@Яiќ/Ч<w~ПљuUH/цU<EъъWeЗпЌ,pЃт`бќТ^љТ`7TЏчдс:@(іmзvтKВШ-кЈgЮ`MіUh8р5хФ%ЩWТУr9я;y^\-бB!ЅМ@.з-эtЄoьљ(Ђ0є@§ЌД;ЗуљyѓиЙЙц_WDсКЂЧќЭ3xЧтф!МgWЏOfJsЖ7аЫbEзJЈЫaЊрBjeБeч>q.ЗIЛкщ9k&Є\оЏќHhNњ 	Љ,h4лЏЃ0"ЅzjNniм8єЅVqpSЇc&gap=,єЗТU'ЅVЗУ§оеlHОXбk+1Нім№О9\7'цОЊvгzйwgXvкЇFH3к-оЮPМNz,"СиЁMY}bыу1E2<3ђЕ_uњД~пЋqй}?ІєF/cЗwПхЁ?ЉБЛЭd§ЃДI+юЅ+~h3ІYрbЙх\Љi

АjBњ­Е)Nя&љ/ЊIЄxро7oлЅpшUaxш3ы!­Ыї#-уќчЗTйжўnбDЯEЉЉи5cKC@-Vn%<7ЗЇи*{Јщ'з]]чй'QЉ М(Ѓ]pЋ.фЭo­BДзЦМЄ'VЃ$ЄvЭ]§яО.ЃЫ"=imДзs8ЂЛе(|бюРоWx)gяќJeФъ2DПiжЉ_ЌMsз9ібО=ППJРб^p~КлБЬ%TT_С>QЩЊFДќTщм?кЎеe]kw4ЪОНE:чњЖ6ц}лС~рovNCЪbЭiВ1bfnrх	2Шs*ЮЏпl:0їЈўamЦ7йs Еnј$ЏJV.фЌвцУЉRбѕV}5%,ч"`ЂфZЪ7:шv=pnFг дЛ?дaNЧў\d>$о9МPмтUўЅBVіN$gкбтўы OG9Њєї,њ1cУeІ1біKОЎrфXЦОbъ2 ЧvмОEпuвюч8_Lни<Ц1vnФ.СЋ@4"%~ЌЬўЙ"чCХь№` okТ3зњВMп `№$Й-%ЮYC<1a7[lН_qЅяєЗЪ*&ЕЬОљ~Tc+ссэ?ёgЯў#фЙѕќ ё_~wБ$x)?ЉRLkpЏя"шТDG(KИйVЦуЫЯђ%tчY@GьНМgЦ@,r7$№мяЄ4рТљWsК%ЫНњAIdК=ЌРн
/="}б/ї<-ёdxuZ/С\єДЃ9b [ 8{ЪХfTD<БijзЙ 3№Ъф
ЫOEвЏ#Н RТWџbа|UВК{Їм@ГЃ|PЏ<FО0zќd6jCшАS
)vќйэVXІWT*|їУ0*ќ(kЛ|
ЖІpЎe4m%7|ЗЊN}ЭTMщCШЊСcб" цЩMЭZ}ЯЦз:7уОѓм1eўд/їt<УQВZЧ,qwІp8(>1pомЭљ3~-шМнєCqІZ
pHЪФт­г{>_уzїMЉчЁы+qЙдЃ	ZњИ>эgі$х{\тМэЈёКpшЁRq5i
ПO5;*tџвяѕўПWFТ}МІЭѕnOЎ&јlNкIХЅъЭ*3@ дбРcџKХГќПиЧx06`Ыи\ЂSsБћgБ(џ§\Yр_йЪsGhџЛоёџ­RкёМ"1ы:№ЛKыЙV8ГђцPйJ4щкйёЏмkЩЦ	Ж ЏХ$a:Ас`С"	1#>_Eтќ*ДЛTvјкЉЄp9ЈЋшЛ9ж
(щiуВgzјгiшиH{r}ћЭhд yЯэ< zСчоqўўЌ|ZУVU)гЕL;ГЈЁє"rЪa8ўгШ5єёиДJФєU1]*љў{>4RzаЗ4Хџ&ЬНя?КљцРvyб3kz-Єл2ЈЬ%ЛhРоo*ёRM`V`YMfаO/k$gЊЃЉ[ЗtПАњ>юEшv/=)їOўXфvQ~Dѓr=~ЁZ`+aS ­`ГЋј2ЪЩ 5ш4ІЊд3upмz{ND<SXЕяЅpRЦC8дЃй@ЬtЬьЕуЃ?ы­ еjЮSјђcZњ)
єyЄТшЯQы3дfжZёбЯj}ЛxлўЬ]g
ц\{t(ЛЁъЌЉрчfК:ЩАўсєео)*О^OTЁщaЊlљЏм`eО
ЄC)Єџб0цЋЬJ($`+*jh2яПѕOшЭ+)П(ксЫЉјЉ2b+ХэЉ­'`ПЇ"ПмЬ4QбЃЉъ)гШыдеџЭЯТ#2Zџq>CбXpњ<OТ§љѕэќ­рIФhдkўїџеtMа§SзСVџKmGLZПСjМнХЭ&yЏ+ћуП%ЪAПCгћ?ЊУEwiГIЋЗњ№ўPXNО/єЄўѓёV9єўuџ^эЊLGЛWџ%ЋршФђќg'6џOaHТцќпuољ2С{СbџЮПф7ћПІMќm|vSджџ"д,Н/ЊўYЕіуШрќЋќЖ,х1lqБ­ищmOЛВПP^Ьм~уVLvПН;?vьјЄMЂїБ3ўБ\№2sуЈй =њMП'%)PЭ§{[C>>Оѕв%иVLPЁп8ћ"їіСX;НФHЅ<WМЮфаЛBцcQ ;r,wpбЯЁЉijјїtМfцЈ@Лвњ(4жU8:йЏЃ@L{ГNа{}NKSЫAЅАQl|хГІyЃNЗЮhM=qkO[іа=тіЁvЄ>~I?ЋVe%ИХxMч[(?SЄMЮЋeг]џ@ гдЅъИиPФrі/ М
w>GWPГTЪЗzy*ЎўИ{V C№tZ]EДж,ЄFVѕR	вЮЅВтЄўЌијkШЁrB­юќџ#­ЗьFСEMсіЛшѕЋктa+yнhdВЎРМIП3џQСФ№-лAЎЇХ$@)KпГч'№WёгьюlјN~?DД#$q е}`мRZйЩ?BQЊА>6YGжquеcѕЊд#nХQЋ@эПЬWG<зџѓ
Ђ _NfўЉоЩ&{(9вёвЙЫрњZrМ<zЧ"$ЉУiћa
џPd8*tLаj№*КaЦЉ\­РpШЏУIЃp""д7LЫу2oр?ИѕЯkЃIЛfЄЪВєБ?ЋЧ1ЫУжЈТzЖЎЯЏ+ешбEж|РяЏk#џџ|YЗ:г+#з оуї ФpVyь|єфѓ{їwНУы=.ђ:мЅvЖрђeoxџѕY #УќџРЕйQЎЉ?+ бQ
д4>ЅјЏжЙІќO2УduџG!ЃeL8\1І-іHзц§6JYЎhYЈ_Іsohd1Ыk]іЬПТњ№dУ=Ж§Љ4і_uщPfeђ;Џ=ЕњoЩiKяѓїФVмve HЎ@mV*й3ћр§Х_љЦ\OZњAтЌp,Д­ЪтЂN?sЭћЮ0ЕЁZю11ІЭ#мШЙW?ЫћпЫTUлPп7Р9Q=nIЭOњЇQmІај^l{нёіув>ѕYЅб
qЋџѓlУўи?иЇИQ:мRАљэЖњ>P[uЪЦw7aЩПЙыЄZЎ3ЭRwcoд)џ"этo Xі­мO.#iњжлєй(9тЅхC/2ќшЛ­p`У=ъ))йедMы5щeЛўР!Ь­Цu~нЉ;ч33Л"и?Џoп%ї{Cа8Ш!щНџzќmSв_УѕАZЫ73Џз#+тЈцфИфИ№ъfБ х3хЦ>oѓg;ьQш+џЇы9+3ѓ8ЎЖЃѕgBb5dzHяЌjпєПвЋёЩnхЪќЮ3пшq§Щеo6Ъ8'эж?AHmyEvB)e<LюъДѓжЙ№{FЊШ {јa_јB|фГџj 7К`С1§HC*Е*ДзZcь]tДly-u1:ичЅќїOWx=iѕEg7lhO?жЇsцiя%Хq@Р\#
 Zё/
jК&ІМf­Ё!{UЧVЎfN:qsYв3й\P%К1ьЏс у+ФшSS:сi3јііhvиoѕ'|п|:fцclsв<2юaв№|Nlў+зэџЊ@УзFыZЋWВ-zBЄ29ЫНг^tЛA'ШO]yв}Л/r5ОЈ7СЃI§<ХAф?Ќву{аGV2 кВЮУt#<,cla-UягLХ!є29 mЦgєpЊWќ@t1аіqcг?ў ќSZРЁU[ФрdV[	mМG}кЏї4жщnш ЗCQШьќКxOЩP;Кмпе,5ЄЕѓ(Бmr(?]%ќў$JЋИЖsщ­юаlуpч""\!,ЊЁ{лљ}=SSоцКОж}+An@Ч1ЉкU4жГы[j/`њщcзм06эDўdзVюкМDЎVhЩыХч5ІC+X7фЎBЭ§ЫoСQ­ЬЎЁ@ЎѕкТѕ,!)йјЅP!$*&вО_sWjkђљuLЂдZE9М
я:CЉНdАЯѕшVЌJйкWQЉ%І"}џЄж§рea:y7аCрр/ѓjёШW}Ё)ЁщUРпПЄаЩгѓІЪвњрр/FEqЈ?­њь~ы%3 4'Ј(зvшU3љЋ&ЉyG\pнцљмхЮA_хЇS0О3џаЈaЅ§Ееeѕa%ё3p@+Івк BeЙj
уЊЫHсХgJ;ОїЫ>;ЛЉИ#Е5."5ЇЗ­fГЯ;%фы§eo@њyЪђ}HQхєЫ§щмЫ^їо~РYьAДuY0уQ:ЇГ­,вЅсz7ОИчњzмmPЗBё Л&DЗГ@NgќќрЯ_ehШ№єИ,N4[K0do:тЬО{%љМ\МEД  MdпаX;нCS
Ф
иидЈRGВMЇњN ѕ0tе`бaQNrЈЈWћБПЄСpEЏez*M\вn'лЛ№(ћP&хъЛ?ў;UЂНІфцS>U;N+vw7їO-уwtљМRтzтaэуеMxхВT!)БcfkФЭYX3лжйіMы^L,мѕ ўRЎSLUчFWдЕbМ;ЧV 3^­ЧcуёўЦхКЮ+ыu#HщЃ-ENy[/4 ж*їXКЯzљ
9Ў№КЋeНЃЄІоqЩЇ_`ГJ~F§MA?63єЪS,Ё
TЫMПЯЊyЉ[IяњЦъёFpY:;\гЪЛxt=ћgыЈјл8ѕkVM	LwсюXBl>фЖј=%пЕ.тT3uIЪџъдg Аp=(ђQЃІљjєЧRЬжгkЭ$}ЫзЌ+Ч_ЈиљVvpћgуNі7=jDйяПЌ7roi<vmХЁCБ=(я0ЯЋЉЦФRјЉLй$Ё*лz_ѕЙЉЛсUюУAю.офбХыќ`ъЅЮ&Ш{UA.есЬЂ6ЏвBўОpЂК,[_bЊ=Iѕн}л@0уЭоѕ еeJѕмрYЪїѓЦОф!7ѕКЫWzхYУгтn'7яаa
хХщ$7Rє ѓфЗњЛROЯї]­Нй{НрAЇ	+"iqU2чRVеўм6Ћgптђ(ЙЖ
ФьjсAСq§ХрpК\CЮ$ьіфљВЊа)џ`,ЌsчЯSKuпЫљЮфDЌEќкп!хшєBнО%i+ЕЗy№qcп2Ждв єИ^ўЭЭ?џRѕьЏKЗ?	ьтwf$ЌыG*З_ЕЇЃяjђуЃЫ=))НrBqББлЕыїМІШGяеЇЂWjЦg@кdy_ђ|tД+§Ѓyj!opБФ/C7rъЬф_aЏеEъSЙџяєяЂЏЂн{EАІКBй((СЇ.ЖБeъmVIЯduДшzXћ,ѕO-ЇЙ_КѕьFq ьф"иЯьШcObћdЙ%fШ2дШвцwkИvх№ПвMуЙ*йЩЉОsЂu4шў7}2*U	Dъ#9	RМGє+Рjz­w`жТe'<LпuЇiў&v~ЊШKaж&eГ C-b?SmНЮЁИG§У"6O'dWпЬO)4\ЁѓY)3iKa?L?и;'H~ЄК*ђЬЂи э
ерфyђeСќ8кшpoУ5И.{hЋeHHQ
wєи?gU vkјЫey2gШђ[ыu№xWU|ЋMћ=bЕСЯ'Љ*фeVбгђнzG)$д'# @Љd+52$C;ћСє§+џKз2ОЋа^kй7$~[птЅГИФ2ЎiLэ7МыккК^§УT\пќLйџЏ_-Ѕьeaл'\ыЇћ"ё}hВ5Н+I NHO\шђЊСхoіY{Р ѕ­I}ј3FЂЂПл№ПТщќ`ZЦ"Оњъ]ZЕчYЧЮFЯ._8PYв:|KдИk,=@Ъй9Ћђщ%=\ЩЊЮt$XЁЛY(fEКјдХGJб№І}1ўtZ=~ш@їw`сaюџ_=7иAЛ=hџwг}§к~G;Zюnw{ы:­Э	<вЕфљъV-cO§є{DPд_"СыJj9Bв?zъж7ПЎЙЂ<Ъ'ЮщNъUпХх}WщСj^поЊЩб3СбeЩ(ЩОIj)%|кГЬ?Mёа! ЭЅSДИЏЂуИ<іЫuЅP.ЋMPZE*6zЎzEIЎ6њцѕјiяпfW5ГэЙ_Ею-ЌЩЮЁFІћѕ$P/ЄуьГќeьєА7шhzлwIEЩYS3`TfкЈбл СЋ)рмЬ?­KУВk{ХL75Й~ЃљZTєПWр9ХLQjѓэЩDГ­жqXЖhp)+ыB;^дгБQіf7VwЧ т'ы0DЬщїh)ьыsН	Р§%/D1Му~­6J/ЃГЅћЯЖЋAЈI^7{#Ртuњ9//§uЈCИфЗИЂ}С№єЇcH0UІ.A-^Л|ХРnпКaЉВT>ШЮ(\ы]#ЪЋ&сЩOoBфWо$	ШПH	В!'ющИUёW,ѓу<ё<2іч.унЗЏХЮЁеyЇX5nќDp\bлIНю_ЩзЂCY	qRf:хРг[џ-_СПj(@-0]dMIОB:Ъ_э?К "щЋцЁu%m`Zж1dSтъЋїАЙ&JЄ&ЫтЦЧтVSЂm//Kт@]Uл3Ж5<!k№іKТuSw<~Й/ЊЯ%р "O№h§et?\гYіOWжWAљtъЛ7л9ё?нббйXА-}ѕЖXя№Y-ebNЉРЎvЂ#Ui]^џ]хV;ыВ{wфYЯ­2ZV ѓ8ЉVuEо\jИxl[яZg3СPDЎдLЇї;cшЖЯZЙљDђХJ3@ЪVЋё9з)вПQ№5џЪЖ\TѕцJЩ
;хВЦ|х&я|ЯiЁ9'}_d[oeЪт­C
_хRcLgЛcЏ9ъуTЙД9_ъlA9Aєzз@№њ8ъ(ЁwlС§(xEь4-s-n5гп­XёSqCUjАquxЪжх3E4њЂмOf}ц>:IБщЭBЛФІZTуЎh	
ЬФпRшDKгЄ~mV=ЬяgRU\mЈсtwЛq)ъ\Jщ76МЊТћшЗEdetаШЎzАє~Mg6БУYн<љ%g UЅ>Qp4ЋвщљФџ/Ісв-Ы"Щ)EзiяЁЬ>їЮ'zMQІ$0HgЄ#пРк4Rєшp5щБyzПюxЁ,-ЦXMўHO§N_сiњKJНaЫ^ѕб;1PўЊ>џ8Тx}Н1~V№5№ы №еІSКЮжќЮZК`*Tтіj)dЮћ'^Ш3ТLйu2уKП)+16%щДтC)n\юђмyЬЪЬuђлымpHiўRVTjчы&2Ѕњот#Bфгnt2ъ5ЯЧБїjzmЦMS0щєЪj ММ y§њ]ыійгќqъ$МАиАYЎ.G	yуZЬNъNVПнѕЕзћвюСY];Є	ыљМ2YeuЖYтdОПѓu>Э:T8юyR5кM@Mрчwв<ШЩR?^ЪЋЭжѓЏыдuWN^/FЛєIQTp
ЬXФiЉTqf^HнЄ
.^№ЃHГ.ЃЈOw-шj G м_хЉЛЅЃ<І$*cѓџ,@}FЬж!ЩїЂЯдUI§YsлЏ0EЋЇaTю}O{Є$њ ^ж)Eўu-њQЈ9eоџqgbФ!BяхтњЫLФG-PшЕ e8FNшzЋмРHњДТLЌоЛkЫћмЭтQуFHџGB<H\]Е2у/ХныMкqЃтэз Р,Ѓ[[Лѓ~BЃ<wтЁK]ќE<A8яГМГиCJceu(ХЏwхдhткћ\<ЗдЕbМХaЖM7RМјф+єРGЈџE ЬЛVx>ѕ+йпі§бmю	в4і КtЁШ	ЈB}}љ`~:rцтG$]фAМ`G"ipсEW&5	Бшр§жЗнoѓЃБaёИЩDбхhJK"lк3G9прAБApЂјyрйЭdx*Щ%v2ЇJхз}Џы§ЪmgBљyaЌnнy м4\WЉDЬїЇЄв№,П
§|Я) zРеЕeЗ#чНњяgxА:Юq'ь[иихqEUи'&@^Х}qhq~ЙК ОARRёЂЌђЅ;рщУpљАџP{oKgХЬ^ЁЫc=р6ЪљќЖfврћЗ@ ћYoИчEњиа­qНДл+Ъ­a@"=}ёжї№јЙ@нЄІK
. \њ-jУ\qwBcVѓ[-§лЄ 8LаГ;3уRQШЖщ;iUЩCvqЅЖRAxъЌЌ+жP/жЕѓвЎWЄ38иы8(W
hЯzN@Щ;,{98XЋдIe3ъ	ЈaЁT№ІИЁ(Г­v?(ФЃ~pрѕЂЧЪЬОжќ­їёнќРч?h;ЂвЭ­Cfы%фЧвkibї9чZ**ЭFgієXВH>јo4ШЄh#1^g ѓЪ}*Зz}§90РNЩ0х
ЏЅЇ/IOЛMCD&_	:jПЅ|џDvH;8~+?eУFп`lгЂu{g ЯЧщЎHѓ`ўj
А6K нФШя[$!z
?U.4РЪЛдгФвvЯMФYЈКаЈН50A]ЗiьLЛ бB]G5Ясцў`пyБЦ4ј GтxШТгРhDаZжyBШўчЉЮћ~ЧЄ(0іљZvЪ@ХП
в УЂчтДя№<Й@uїNа!;H№ЃІ4РКЮўCНн$CчM7(АЎE2ЩцЖc-ўYh<F#kуњьHAMХ?ЋњЩeжWЏtљen9Mюпчrй9ЦBйќu[ыv./xJЉ5ПЋпМXю}єcиEEЈeРx%кЉ/ЌъщЈpYpлr"
#ЛЁщi89a8ЦјнphщxЯ A УЭQЉч(Т>(ЬвУх8<§ЕxЪп8ЛеqnйъЖЕг:ў.ЫBвPеУ[]Я?ЁЏџгІят!tРЋbLпѕЖ<дКТ Ї№K­1Щrџ№yјсІЉдџ/Dм K]OВ*/ѓgДЭЃj |дм8Ч9ЕѓЈhIЂуDд&TsЇBbУaу$)ф,І|.ђ3ФLїM~.цИ80сLа_Ј§vTЋc2dj[k9ТћфG5eKќyзМТЏ:ј<оg{тх,Й/фJЈyM^Юф=ПСьdАь>0ўdѕ~ж;*IКНXQ3љІoгќЩшКФRёqЯтиxСтз%цЧимБИИ3ЧW)OыГи&iію8 О№;ЏІ{xё)% вџ)6jVГD хЫўKн)]ehАdT,В{Њ#qфџ:аЖЎT1О]d[Яё<SЫЛЩ7НЋ-еЃ2Їм\ќpЗсbhzUРF|}VcЌ]:;Ў"|ќЯЯћeПNmсјѓЏЖjё$>	5еТіІ й |Tрz(Ј;u[Tѓн)эetкаh60wLС"j*XйB9цFањѕY0ОР"д\ЋtЁ sюUГЖrХђъјn}O1аWђ_ЋP1GІЊHЉУDЛJЛќ­J
ЬЗtЛкЙЊЃЕ#р6~NБПДVщYЦЧЂ6НЊSг/AFЫ2]ЂЗ?cEииZgz+vЦu~P!8%kФО2СLНoјц7ЛЇХх=А9h5Dnфw"ЉsіЄ Лрвgk;RХы;Ајq  0      с.ю
ю.нхннннннннюТмХЛЛЛЛю.БрЂ0Г    q/CAE@эаФКeхrw&$	ЊCd*лЖЇ>H@Юћљ`аФf3щIEЭNjA&]КЂ)      2  /2_~ПУќx<!сЫl*,ым~L1HеЇыЛБGGНю%к/Ўвщњ 0yC45lќЕFЩHёBDЛЪ$тЙКAИga;uSГ!ю@!ВЋЪ&qЛшЫ[Б#EzШ2хrЕ$8ќvЏ>ћWЮг(!^тйРП `<Fу7аСЫўа5$рЬу+ћkдЧK)ЌЦ\<ІЖ"IЫСЬlФьAпiDrpdкmQйіz9їі@ј-ГЊяДСќC "2ЭX8ЖzЎkUS3Лwђ2Р КчjЪѓЇuЋM*iј0йaЧ"н
-QwЯZ67>ЫcEќ|`]yi	ЬLЮЪб­aйс|~гл^]bbЫQ62ћз)ЩЉ л#PWЉ(оИ"?Qх?=ь=­зQіЮ'п|з6§џ5­tйЋaebO№Нlьо<]ЫЩу ЊЧkaРiB#
}цвzДЅpПYЙЙє_їѓ~2йЇ3BфaЙ8tЋ^К(еХєь1EдOK;E*mшѕK3ЈwМЩYлЏЙЬм­А"Um%~ч3ВOэђПњЮчШ/gCЗ­6'д~KхМэЎ­ыдЩzЯХrє"5hOЎ{NъОнц§)-Аеђ7ўЋЪЩ Cы5e<ТкrЪNщЏЃFЅ,п=ЗЫѓ1жSћэСЌCP ЯЪфгТ'hЖУ1=65C *pЩѕFЌЋЯэ{qј­qе4#85чPL[,гЇЦЬJщ,рwiЋgЛh}f~ђаЏшіь2бП§AOпњЁЂтL&6о9Ь+`6ндќЦЁаьоьzЭОДжОЎ,8~i8­щ,kцЄЙzUh=ХSJњEYN[ВeКGxИO+­ІтNeЭrіё­УВш^mkT?хъєЃIs0Шх"§юіRlъl ДКбзzхєьп*e4KБ	Lu|8НCВ vЌGD&@'~ ;~іЉЊg9змHW_яКЬЏOЌ] й9ЪЇHєvШГ-iBіўLRЧњ9gъb_НЌмЇ3aіЈ#`Њи	 *ЙўqЧuђюЙІрЬьдлїrNkЊВЏKжЉаr;gшИЎщё]3я
щєЈЊVжГoyDуFqКЬHStыЗщЭЩqЌыu/ЁўЂ}6ЎYиEХТє*ХL,АИОХkШ+иіАчDvП*ЧY,m_оw  SW!Tn~ іж\З<`//jSRбобСЗpз9џgOJE&ЛрETy77,ІЅЮ еаYбНЕЪчЌmыtе#&ёAЖ #юC4ќЕИ яyѕQmїdM)=мй ЊгЋмВУ<чУвээ=i6rжђњ\[Ъ1
4hн'6 Дв-4еЃкUmбwqW-г@ћ_.Р5§OдЄМKBЪ/Мюќ7лЦ<Њ2jрpЂC' ідлKЇ{7];юѓ5д8x%ыЬЉ%ЧсЯцЋLZnsщЉХ)ѓх]Џ^K§\>щЇѓPЗъnjQjњ	ќЪ>Мїўкk№ЎхP-ДLЁSЅЅ:0юQN>ЪI
ьЋ№FЂ/2Мѓ	жЅїщ5ПЕЁХM6зyeк5x$F[њт.3јИbењdцЩ-Ъ `m-KТЌЮДФ{i96ЉR+кь qJSЄ:-ЏЩrОа>4\ј,тCЈаYo5вEС'cЬNЊлш
unТg?УS	сћЗxьЫ~ЕжxЙмњ]kЄ\ otЊk-]Ўоёй[ ;A91М`гх0eОј§ћ6Ніubs4љгт()ТЅIdЏг}ос
hlсТS3xPjfUЖSе>ЉЛ-ќ"Й&h.§XЃвД6МўSбьаcydТпkFпььакУ% Gїё9ћіыЙсqxd~'PЅ 4:ёaЦЮеђ|э8xе2у`w8ЂЄЮбѕhIGзS!юЌззfUЌг#ь=ІC$ЊНуХУN9ВG/hLwz съDSмTЈqMytЈі"-W;$љЅj3Зl&PЁnuя x #С"У8 ѕы_хАБkчxTљвђЯi7cЈАiыTЗѕЏKЅвЃјcEuf$дЮ~Ы\Я%GљљёоQmbќ?.мc$ЂVШxкШђ8їXТд.№7ЬVЅIа+]mйcл3XlpІЙА+ЏуЦњuхѕhQШъrЊ6n=К2<}FццЄ.f?яб'ђіgаDuЛЦЊt9тР-<#В:вlЋtc( іл+ тxWиќљѓ^AoгШ[BЮGд_w/Ф>~L9Ѓ+ Ј~rLџр[Ћ{P@жe<OЎыдљўЗЊы j Жц*чТшGPcъ+~сswgXеЦНћВ (kБж№ћnО~]mМPгйсЅЖ.ПЖpрЎс4.&6ЉQ!VВЉр@,MйG9лMwєАмеЄOЄєЊ?n#zD=>ђБЇіцЃ6)ъ 4фЉ1Pb8'Ч пRї$ш5QнY§ІkkџBMмQбокЖы§"КeЯл&ж9^Д<СP9kп=Л6гл§^Ѕ2dУ2Z	АЭОЫњ4Нmif­о2PA^jnбѕ	сИЃцH(rљПUНq DуьlrФzюЦYчїЩљуХЦVWњ]eдЪѕUТЊ{юњЉЌњR8ЌПј3
сLјйАя%лУЫ$HЮL'Ё5ЅМЙWeѓS-ЯglneЄSЛЛЮQ­А88U1ЬЙЯ%јRЃ,ЋЈйnip>§uпѕV,І=Й'фGєжх'P)M­vMПPс=O|ЕUљє(wЊђZЕЯhrсPe2кздфЯФyК­Ы6HзFмКЋ_х{яєј7oТDTФAаи а:u@ЭоЛт(uфGdЄѓВУ^цАЃЎTзЊTРжuКЃ5\шлA Тk8
іЦ[г*'ќшР:k8щ@I_;ЊЖп]џ- ЉC&SћдtTдчщъM?J4ЭМDщ{"Ђє'd5OуЊ*б"БG&х: $С,e#у-ЧHD<[КVj^>ћзQ!=t?ѓаo&А+сяbOК{ўRяoВаЯвЯA)Чeї14д ѕЊXСУMњѕф5]Г79мФйwE4Б~є­ё3(F"рcеQS LЮЛP|2ЩO"АXpы­о HBоrюУЇQ<ЈWЦјмnзвgnИзКЪгНyJaЌ02ьеUШЈє(k2ёieєбsЏеїxчwF/ww^
Є	$
ЬЂgС	Д[ЮUйZЪ`ДvgOQЮhЩє+ўCzojURдњrфU&TVДFC{JЅW(№G8jiцSЃѓ§KШzqMЇ=.јдФ5 8lєх4uЅ}5gКъT|u@?gЁ(МZ:`q$lr,2м*и,UJGLЁІ
fеqЫ>љ4ЯxРNgѕ7ЙOї/зb[Џлц~вDљВЉђ1{Е>жЦЙГ*п[2Љ1УЏ:јvmэЎ"Uв6"Bzж }aЙџмЁЅeKЕ*AnNt7Ъіг2ь%э 1ЦЎРрЅKХAJоEpуOа,-vН_OйeCњpгЬ<ИAќQї^X'Mј{ЁЮ$PмпS / Вр\4ЁШFмто№ћE?C~§WYO[№ђОю&5оLЇпpЃJQЕzu{p<њэпrRЛйLЩЌJѓ)*DЊ2Фr0ѕZYжрЖA0eЦЕ'ГЇЗчnњќЋ9ыmюw=N:aЇaЧPяу0Aт.Ї#3њBЮжд?V§Б2ф4*РJ|ЭУdbeТ3TЖ<\­2eќ	*}ћ"oШ|ПіrMЁ0ЩxЊgМZOН;bhДд$ЈЙP?вт!ЛиЎxЙ<ђx]6'нHq(№№З ъz=%іфкTsЗM1Е`Б аP ЁЗОП-Ю§ Nі
Sq3@?,	a+oTТ:РцЎy^Д#oћYЖZ ЪёsU|ІЌЙzЄЕгљ>ўбё)№ье
9p(ыў№pўК§з"хWБѕХ'Ажџдь№)к(0Њы7nЮуКыЂC\IЇMяYежrY1`КFОсtд=b]№Квќ2oїЫ /єоm9ђ@{xвМјџS[gZЉ	ZџМбСoкjЗй;юЫУЉaЯЧд}E#{G­бєОkяY;b$тца{ФУѓшс8sГ
ыЁ,эюїПlЮЌџС?№§sИrS"слк}UGrёmM)і j[pЮ]я"ЙжsДчOр$Љюl&7Лэbѓ<nwЧKUY -wfЉЈlВRВпџ3CњјЯу2РѕбЄA#`_!sаДТтоТШЎв~КўвњДЁdЖЋ7"ZњЪ60Ш'fЕщмНЭЬЎ}ё+Е%ЗЫж­аьqЋ`ї&oкRёqДжV@i7§bншУОmП3Цsћ}tьLQxє2ЩЖB<ХЇcQoAЊEъВЙяСМВыљEGо*>п "§qC.Ыкћl1ДёHБв&ЎОЄћь_wtbeoп+Оысѕn/nЂSхcwЋЩJ>1bћTяфлД?fю"HФыаЇО`fл\РгчцзwЁ`R ~]_Ы{­Бу7Ц§?Љ Јxџkю3m4Вw}2Ј,яmsХжЖqЅОWХ-ИцнHЖ&е РhAчk[RZtpлuсчќмAѕЪFЁxi[жХ=(DT!mИЮ0§C,Х­kU~M=[бЙV<bђўіЛћEЯ§м6Ёњј9рFп#ЅЊb?(Цє}>jН[~.SхГўЦЯНiBѓdЦОпж|тЎО{ИЭй§CЊЊХ8gѕЦ?ю§^ъni?Ќ?Э9Еxё|мРыїЏ:БђRъ3Xшд §`Ъј)/kю/u8]ЕІ??Ѓ&ЋЎ~§ЃU&T\З@сЧэm?CБл_чЫїЈ+ѕ>џaPпс/L_xT;црGKИ<рймЅЩffыьЏѕgЫ_бNўpЉgGmпqгљ6ќ&5dЉєёyZьЖІёPзјPUArLБXрл\1в`(h|%ћђї/Bќ|ь<Ру§%пЪЉH>1иЄЯgЮЭFоъИkЊшQBпgYЉnуе%}ЩmзUЛсОчGЭСFпАКsПЏ5П)4Р`фЏп=оѕУЙЁ<1јGLйєдбШJtbпЮГлјеNnт!ЮК*јЄЃ
]oqиDF.>)ыЂ.{<є>vЧxхiѓaА=пФxW?нnRмѓЕB0Еъж23Ћ(.(2/TЗ\ЉџЛ?пУwPжчж=Д#cE рwGЎЇЏч0ё кMUСЖBшишV_lуНm>дљ5r2ѕоfЧЩuVѕѓ7ЪeKЙ  H)/8сзЅъeЛДњКjRв":fд%џГZ: =#ќAЗМЕEиыњyш зтtS#мNDА @ДЈх`м&цxгѕНЉеoгК тџќЁDж3wСTsЭdЙЎЕГЌЙМџжљuХ:_а=ОB~мъФT-§	JјНєа0p*@W":b|qЅЕј џі(Л#YЭїрм:g'дQя5ыГЫнo_л"ш_Л7ФS8вOтв1ФkШЇZэEТћЁгџdчЮvвЋ}ЫЏЃz сЁёW\н=ЈЭSdъXЮЈЊЪщcUSNuцRВiО'TыpJЄb6д?
]ўЙ8ќodЫЉПЉЕЉ\ЊЛђУgЎАлo}x4BеІ6ћaЩEц!ћ~№яЙѓјЏН"еЬДzЮХЌб ћ№ЅRїГmM^б=g^~\уЏ§\юМјИЕSCјVqRK^ьUђVю&Їєотђk`LМѓ5њVХ93^Эѕю7Йж%РXѓdЬюё<љёлпКIu8Њ	ТўT њуЭНЊPБЭkV єЗа№(fВ|ДыЦlО?ХЋ:Е@cУОf";ЎЮR1=vСій|hvfГwд3Љ4ЖВёhз0_eејбEЦЭЊЋХА9dОcсјюAЄъ-8ьМMџЩбZQЯ}\<ЕнЏ`ёA2ykуЅ>U)рkаlПэжЗДЋДhFPеЌ<,мЃЊџ№а,uГ?1mГБsл*л­8њA-mкV|\9ќфЭмў#оЄ7§ИRЄxВrъїhB-4Пд$KТюН.zt:лzFUFг ѓєѕOХЌЋчf4зNПйєѓш№, CPСсМђўїцѕєZJ`0Bі(дтлa=4?5S)зЖь~&eЏ-?ЎЦzтm7f&м-5rгhЦшA2ЋоУц5Vф4"ёц]bќЈРЧYѓ21щ Уљэіф@ЗДЩЁЫЃ(М.ОёОБXл>ЮМЭvв)
NЎІпПy0(лАѕлЁ,Aр5(bвXwe8MwL)^#йЩ=У8?u2Л­ uo_№ќ?КUщШцdРњxњІc­yўу_Г>щСP]gзC3<Дд
;kЮAzy;lђ'_7(UьћЄ	РіpS4,*ЮкKЌ,fvsяЏФ)i;\њВ рЦQ
HIjZq.ЋёЇх+JЃлѕEИпвЃ/BэЦЈєqѕИф1ЭEARskдЅЈКЊєЇя(}6эЖѕANy~ДI[EѕзЏwuыы­&ЗEЃ7ТЕYЇr@hC?`лЂyЊќн^П§пЌуEфбЂ#АЮЪ'HќabёS>@дkЪЬЛ\жоП­YќюХЇСGЇхГѓеpe6U%ЌЁj9WТrсЃЕIЦЩWБњCЩігр)№lz]/ЦКїБуЃ ЖтЃ3ф=ЭбАЂІЖЉвMЂ~NjYйЂЉљA>f,&]ЁrшПіБОЃДтЄj9Ћ>ЂIФџЈЁЩ7,0Њ Б$шДЎ(вРЫ%q,ЩыЮ/цf+Ѓ6* }ЮРa(XasК ЏЖI:і"ђCїQHN _.Ј­яфИ ђўбчX7-<УS§ № ?ІВЉj4P{љѓь~&,fлюUЌ\явv)<тЅPч$ЬuzЊW>	є``gWНЅQЛ-ЭОё [Ћ (с)#їPУЂФѕBљъшсКgЈаДќх7Њ
Зёя*IВ,гB<IЋњ=*+2кЉ\ЯaП§ ЅIјІТоM&РгHЗџIжЇЈ'hЮџ]б!-№0ZVSGvЕr3Aї%Nё3НtНЊ|эЗ'dyџyєRbќ8Ј}lMе&QџџОhЌщZЬъуvНWж§№кj?КѓKеmэпЄ№Ѕ~oџhЦBљ WЪ#Iт?_§*+VdљO5КЪюџЉsиНb2Бєа_ѕђ нѓ_ЪB?'ѓцџСџэвЋЧу'fм%№ёїљяљLOўз#Qџ8Сё}vЌ ѕkk	?f*ыhџ&Э?ўЋлЊБЎg?џЈЯщ$aыЇgЎў§ЈЃ5Sл?нџиЧIcжџ#ъ\щїVЈўgп9 -sПSнќP=UbЌLЃўУЊ$gН",аwwмFхzџ9<7 й>ь*эЯЙTщ§/(Њ{ьљП>{qџжЁмѕџС'Ж6ќRA6оПџ­ИўубПk@љўУжчвёћHu§ўДvџn ЦкќC0уџЛHбпЅўEжџм5Мщ'Ї&ј§§[EэШџЩWўјqчпxўптєђaДН_*ЋМхУXћмYкwџяFиIrА2тyEКqfOаw8у-Ј1i§ЛЙ.ЮПЙ8kн4ю3ПHиќtея$ђштў"§Iъ9шл"JZА\(§+и~iў§@рљ74_љПFФ#ЯQнdўН,ооІдоТќхХЅіжFФЦ&жїХЬFрйоCдФѓ=ї.p~Еk-ўЅ|Ђ&|ш
xЊњсЈ{vфєМВ.њZя)Ф№-/ь зad(mAз@цШ:Ци1ВЇЉRРVЉЇрgЛ­Дfдєх_<eывДqФЛЁ~Ч]ЗПЖ{_ПЭ`Ж\ZЭЛ%dъ1-XR oІNдO~ЊљGsжўw"<мзЅAЙлу_ѕqUв)Ч§YYyйWyМcзШ@ЬЧєєлщ№ogbЪЩGі(ѕђ`ІЮ6йёаoб6а7эыAF/3Б"юКІ§оУлM	nDъяџж
РАкbЃн]"ЪЫЉЫUUnдкєДИПЕЬГ­N[ЋПШxѓЈџJШ&vѓh<PчЯЏ)з[Pи5vXИ­М`хРяЮ(д3#ЙDйПоLRЇMЇ%1Q6Л,=&uгїВљГ9јЛ|Ў<и+YЇЂ>
СыaNjъјvХ8&A&aѕ -YїLNdщm Їс§ЅчОЄЩрї;ќЗЭ3`Ђ#уkgиЁ4\Љhлг№АQHРж
дэФЬ)муоЎeT0ЕЅвWњs?злЋЖџ<юЈ~QfОћСxуЙ-@о6НУ&XсЎФєШ(DЪЁЗLЫ=і{@хЗkох`яRЂєфР,(ф,Ъћ@ЭіZ№vЉXъѕ6и&y§јіЕМTФСо 
Б ш№Бъ]АЉћQЪr@ЭВ§$М`_ТIёЋкЇжзэ@>2в$ъoѕь=ьАW№ъэв/5ЕЋrЊdАrљVЮДа_іъРдќмLљќЬјIa№YЦ`НсрпђшЗкж={t{Hд$JVЂi$CЛv~77У>|ИYa2w|"fЁіЏ|gjщЮCіЬ ОK lodх!>BNјЇАА10F+#}vАЮзzfФя!!чZЕЪ9+ЊЉІЪЖ1Ёn2ЦIлЬЦ~бЊЦ`	ШцхЦџRч}о} pfзХAOКrmИnk|ъ_љЩWШ>QЄаДiцsЖ55sgѕQ{LІяњ;ЋL1gA:!ГЯGйы"98ц#БЎ^R4+чmнtfыЖdbЕt*ф,sH!vS^ІЎ12}Cђz ЛhшP§йy.:єBH[KКq/Яўjм*їЏЙіФЇЫЭхЇЫЖJК2&&vлиa64№цїъzоE*	CЫЫhЁюиmЪe9гэЂUЉЌє}іоЛeњЎiJяX ,ЪмD)ТЬнФ)ПЭЅ&EаqЅXj­ѓ|?ы7sщdфcІЧ0Ђаф]wфb,ЮDБрм;oГtЭЂ\DОф_0cЈvьэo\вцйшU3р.'шсёfЛIофЧ,ljЮ8!sfкУ"и,оUCCњЏчЈ{)8ТбlЭј9_ЎЌ+­Ь+НGрќЈ4юЎС@лЏ­~;ЌВm91(<.Џ>я
pВYТUu'WнT9KeЅЋoЗM.Хг]YЎY{~эПЯasеnд]tг'Oѕ5рtАТMnКфЪм-VљдEfhѕЦЩіpЧ(Лчэ'Д'иРwhЗА`Cjо:qXПЊ№*C+	У№gВВС!РACВ
gЬЦ*Ш мUХ*UЛДWР|vfГLa~йїбЭnаЬ§В-)\OУp5НЃh-ЛAч01^ПR@oHћQэhЩQеqуЋxњђсїъ&ЫњqГУ:њbq}fyіЛ:Н{+W5їJЎ$Ј* 8Di5>ПљЎ'ОY;B9ОиAfЮM=/є"­ЭАЃjB	Щ&!ЇЃp/кЦџ{nЬms7[ж?мМЧ`DВ2ИгJэ|ЯЊYІзОZГйЈkјhvН4(IVњWБaЙtcЖPФ"ѓВf0ИЩЅЖeTДыIу$озъђVxЯэђmэ№~ЅqkНЏЮі	ЈыЂеЃbЖсеПэRЏGп]@ж|TХ~MBРЊЫOOx^№Й7Б4Yд)B3!xm?u.іQН дфїLйЎБКХNEМ`уЛFЗЈfкT0'#ьеsЁЫьсdxюќSEіЇoх@ІиїсНЅF7Gг$вРшAНфыыЈДй)lч\ресtј;щu%Ж.6Эё?kэЪ2g>Kњтј47љЊctЎьФцi|ц{P ЙщЧ}ЯўЫУЩ{DлmУм
ѕcрРцe(L|одоќъЌЧэЏЅЭКэKЮ QБ5ђЌГЖигФ
ЄdѓкZЕscпYENvю63JГ)уОGkј1fь$дфf>р9CДЏВСbGkеШ-­mЕЬз[?Д(IЕ3ђщ=йmг	#xвE B4§2Б$u,рdбЫе	~(;а=чЏџЫdЇЯІYИk] wф
ѓТ@ЂЩЊ<ОXm*2РыanьАкЌ=bЗхо4JЖ}IQЇV@ Џ  Њy-0OlљјpК*DЙdЊ7ЪТвЏђX[cQФбЧDбqyїЏѓYДБЂЖbЖЉё\§Э#Ёвэў\ЈУ3~UЗJYПЖW-Л:*praлСДM;ЁЬ|Fs}>їЌлєXњNЛan3>Ш)вcU ЮNЕ]ДЗх4ш:5Ь,|пЈ>љИЇьШ%bѕнz4Хк#iаечўkн)B гЄSпkенx5Ё#Aў{K~Bтщ4ё9ЦJИ;ЃUxuй)N51ђђљ~К}@3$'ЗэѓЏ&иХЫМ?ЮЫАцrХYП/:Й4Е>Їёo wќ]ЛќFLдј!=]UA^'2ЂѓћvЊy*5ЎсYlО}ИЯяёЪ)в^ЊЉxLЩKE] AАBмx
ZeЮИВЭЙчЦhQ:apп'JюФДuxj(гюжA7pПwЖG
NЂрЮЬe§<ЬzН%K=Cжѕ$оJ њлxђјљ[EЩ№n;ИaЗФШSа!ЮQDavё%Lр1ћVtѕnЯ§?^nn-ОпІ&zЂщЧа*,ЂџzaZ№]Эў
Џш *њњ0њU{z<Чua>U]hUЮ>Х|)§'8ЁјИђШ2]јЇk ЖHЙЛНф=t9pеф	ЗЋ№Љ*Ыл~ЛF(S­7K Ђ` ЭАМЂУе9agjТVuл,g ЙG9MМЭ	R5V№lєн{y6)aЈьЂ	­бwъ3щ#ЗчQ".g:а	Z1итlJйsхsРД+Я,Ч<A*vиШСА94ЇЄYЭЈ0жмЈ!эiO:U_&vЭѓlFнHИСќ[sGbФ ЄБ;&ртЧpGа%о=1њ:^йижУс>Ж+`ПЛ4У]S0`иўьKviЕ`у`њинpНыndкюgФ8 xAГПuсћr~БwєїЛH"TљgF?eчРm #Z%Н.џоwb6ь~ѓ]ѕa6кЕ^YОp_јФwцЧщ/7mёЉЅ5К By№Ўv~Н6ПM -yTqIrLgр6I)А:taГХЙЦ9.Цr!Д~Ю%PћxVwn-РцдИ'ЬcО>vЮ.ьabuf:FсrEх Д ]m\+Ч"Uр _ЛBяѓD6ѓй\АЙ/еb5TгјЙ2ГФаGj[ЩФЯъ`apЪоjЛf`OмE2vђ`EиЅЖUуE/
ЋЛГЗ|мнщЮА2sЇqчЏhм=ЃЩQWБЂЇQЉOнћєдd7цwfvofVИжtЋJ">ќ?x(`§с7Wkш^еДж,тСІшЁьKћ(dЧdкхЮCzХДўmбАрpUCЂ№lьQKТ8DGЏFооеќВ7vЭ*ЄЃяпeWёќЁ;І'pеЁlKdw}3 ирЛaљХz`ёЃЩ
xPJТЦXУЇОитз(§T6Q$'4єЌ}_џQаєОўwlW$#smС~Щы§ЕxуэkІtыwОxРЅaЭ­#№П8PЯe)ЎtAиЖѕ&Клn>КќЅЌ"{&bвЮBУ'ПЭfКЛшЃХўh@ЭгЩVVђЈЬњPє§YЋѕtnєс~и­Юує~PьѓpзпNlсЫЂєQh&AЂeИч Xi%§tш4И%;jяЋ!=/PР]\IђН{ЬCХФaUmiЃ3РЈЭwqЙНTЋ)JТsЖSPIФДьiЪКЙЗzBnc@	в?Ж	і ВПАХm:лЁ06qўwяUШ@!cЩ,bљвО&ИёCЮsп`v51їіХwOZт)tЌ!ОIаWHаbЮlmцИxcє*}ќК§ф-ШЂДas)Lћы
Йќ9#вkЛrKMХАо5Ёf<}>QSЂC4?ii&ХЊЄ енЧf Fют^?xЛЕту{6ѓt-BSє+.ЋлЭhШ7ЇcН$л6 \nкЎ0wњяЭКz ^sgBаў@E/TаДGЇНuќr &Wуп_Ф5ЭliQM@Ц;8ђчщЮdБS7МБ&w№*ЕТFc36u@1{ЦИчсБШ 3/wq|ТяЗYуЦЙJeL;§цЛщсшъpBјжЏ`U)У+z>ђy]~фѕ\nУrkщ^_.Зд(!fІЫџаЩОDлД&И8zЫuШc*О(бдСОQВШЅEИzu!ВvЁу.aБDЧаZЅX1ЕFHuВуК:<crqїеaьЋВЇБќa9%ж!'Ќ§4`Ж>жљFвQЎђ}ЦуIигМЩ%КЃ~}.­@"=џfњАе'ну ч>ШрMa[uжЈмЛ,ќФRЙWfJќЭИukxz0Сvmх!іѓOХЁ}r@ПtЖй_С_ЭsЂsWffQpZBГЙџЬїNЦХьЌЬЖZЁwl5E>yЧ Hl	ВшњПГ$nOбZWcБЈТЌX	uэmYU7ъq+оQ ј)8%Њ/HЂч]wJпc}[џљ§YF.ЏgЯ'гЛ(яKьпкЌі/Ццџ'џ|иИЮм:#Ёё  љїnBБїйПжаћџЯeњy:цk	TC§nbСџ РПТз2%Ѕ%ЕБЕ77ЌUqїЖЦІжFvюьRzЬщщIТлgнzЈoашqIЭAЂАЇbЯ1УD!ЁАшГc"zIд> AЈ	80Ио!ДBіgЧ_"`ЇpсіЛЇГY:­ИўUОчЙД;ђМѕїр(щeЪАб#oПњбђўcћЈl№э( Ќ"<|БЛuФGёЩcЙЙѕ8=Р АXX@DТС­Ь`мwMі\ќэс0ОЭ№#ЌлэIѕ?ЫПHќ& з№vЪ#Џњzхbь§v­h:$58 С ~Ц lK
Ѓ XІ" Тhx  RXТЄ_SCћ<Ќ.ёя_p  пpЋЧРмфџѓ )ђгюr:Щ{ГD`ХuР"%ВЁdLBAqРЩ%ВCЇЋ1Iчb УЇя'>я№Ђлъ_УЯХ6ЦИ&h5яЇn<цјЛЫПsЌјяУ6Ю{O]AЛ`Айл3Gс#Шг\\3qXoнmъ%эv.њП ХMшиюшэm"шо.Ћ)ay<]1\-x)іГ џы№њщl[>,!>v.}:БчqЦBуз_>uHБ^~с~cYзЖd*;ТIШцљ~HщrшёиC[вв5Џ§r3№ SіТh№ТR1zЦ}_ЯЎт6kЋ@Т77Жэ/w3>ЏЂ)M(l­йOж
Ш№ЋТЏЯ?Э>Tt\\м\ъј-П^]/Н­ЖвО@дт-ц&\Р15ЧњP@Аk8ю\ЙД$	|<Р\в]SьЙCCїС`І#|FЫaSЧSЙЦ@ lаЃ А |mc*пг3O+~ЌBFшя3yхэВsBЙRПs1sНм0F(эЃђыЫЈА}99уUaйѕQэ@rLіѕPe(№%JН(J'=іSчэФGб#СХФГ454u?ЩрHЗШ$$2§ш;zф"ѓіВоіЎ
)СЁчЂ{
нУЯ Џ=аФХ1vH`SљЩь^ЄІ§бтS)1јqьі%АjHsђ|Т}ЙНЛ§ВБоБ`euЉЖгюЩэФD&мQTРmУ§РfqтЂьЏnmЪл?№=UІMЎLЈљJ8b	П#ЂгOHNeБѕ1TВ}џШъЄdЩe)яa}!ОЄ}РAШ'јы"6iA@_ЌBЮBЕBzИlkaђє"УџньtRq5И3fT,СZ1}ЕZ:U|ЪХs
:zеvNd"Књ^ТpsЗ
Ъдфuђ<уЉvЉv}<T5ЕЕ|i8-МцX:PьЭЄ|p^јUшbИЛY|ќЌFсш(ЭІKбЋдyиуNОі-Э!щЄ;2я\К0<ТЛdЃ$іЌ%ь
rдR2t*t[Ііќ424єЈjяЇЄшфjLhXQВРЉћ)кДкT!i"4НTхгlуgvVю4э_<eЙЊvg]KсоПџъХ j0ТРm Ь0Saп{cИQ]бўa*ХђййњєффќУeМIjюBt%;ОђбEгєїHЇHщ>^RЉh,h	џџsO:*с[p]+ЛГћuхжы\еJеО+жU{Дj
жU0І
jъЋ
в4Фєж9жt>tкфI+цКьZъё*jЭдУЭѕЯЂKUДї|їжQЯБO 'Шў-AкQЅЇяhЊДЎ4ІЗХгDяё[8>~~pеу-К$ЎtЂ_д-vмЯp№аИЯRe%GЃRкИhЛ§­-]Йђ2Е\З-?:#N&-(I	CYBьіМяfЂIц\аЬ6c+НЎЯЇ*ЦбнЕђИт*Хњlљ*їЕ>1ЮCЃйЃsЃb-eэЌE+Cќќ
Ћ4ЉЖЈsЁч5џ7џ<_
В8 УGХЧ.`ЧўqWxлЃ6]ЊНШЋyСШ#кЇнgЫжa<П:ы~їб8ЬАo	l?ьЯuфЊл5aШ	Kд\ОlIС'ЫљP\ЛИџDўZџU(Е вЅLрFsЪTЄodeda|uТTЉЇІ.Ю2ThNMвbmЯсЏЯУГВ/Д)ь+ёXРtkЦшКЁЂї*ШСЃЄђЧ|сyШbB.ЎLђ`rєЩвyЩc#x>-Ѕхѓф/QtvФўY}YS9GЦуR[шзШиУЖ1кдцъЛ/еЧЪЏІѕМnЌ@.ВЄPИ*іьIЊLVРФУЄo	#i0IOУYЇ-e3ЧУчКюlїзFРO)Ѓ§)imMYЭ*лТ4ЖITрЉAьMk!R38ЉЄTоЉHmRnpknY@ТЗд З73ѕVјеЪы5;We ЦЁDi!tФ$Х	Д5ї ­Аѕфў#Ttј+9ь;L]пb`й/9ЌOkGГчKзьљQє№ ѕibЩiПйWЮXўлДоЁ`ЦС6ХO:OOшOют1еЪ§иг0ФiэaдС­Ізisтm І УоСпжYOuG	йНо#БаLйа~Ут>]c5pOОЖяђrуі)ћ"Џ%GЖЯк6нКїuТЦњ§NКю0Лдљ ї~ІЂ!SЖNйDiTNщeѕkеЌ$CяГОЏ:МРXQнб?yK.ї9^]Bљу§НEЪ9mчьеvmцP;Ўі §Єm8kгlC~ekjў=НС+J)UІЛпм;Ъ*-ЮўЮZR]ХЧжЕжйxЏ`bЫЂWгеO;Я`6уазVеЎЋЏї\ЇUOДхЧEЯШ*бkбя ѓћDVщ4Ы[CSQщЪсkQ'Ќћ3Ъ(Іј8*+Nй0ПrfihtВулсН}BъlS`sЪЫP­LГч7?у'7Э%%аn?яїупИЈОгОКЖsС-/шYяQЙсдrrузлJw$zcѓЊэNщЁШяѓѓј/јџщвљЊ*п%2Нљ;г?Ru­ў!лЃюїѓэ5џћНw?oнїќЃpjTъею3Їёџ|$Ѕ\45\с\ОїЪЊcq `iH4СпTuо@сpІ9#єЊSPПЗУЅ2-џї	ЎQ>fОиК:"R\меP*їуЦq!Y`ЛЄ=Wnџ2Юѕ? ЕsЁвJIлэОj-uП6ЛІбWынedsWрЊнџЂЯ2с§ѓ8/џ} Wдtў[
цўmќ[тЯфќиё}GmПі ЉyЧКыB№вЃ~yA?_J^Ў_-6бпђ-w=/mE<іlrЁсЧMEWzOЗч`]вS~>Јbн4І8н6гЭќqxOищш	Ро<`Hsю&"ИЊkсчVЧ{wiєРО-?Ы.м}oјкЧкs%У>} є!с6d#м\"йкбг1)ў7mлJiјЇЯ.gбFЊ	х.ѓ§Цг@8и№"Ж!h|А0E]NxC*p=XтwЅP4П2$бо ѕzЭЁчcq8?+7щЕѕ0ЧбFђCЋ=Оў4e*ЋAШUДф^[­ЋпЋa4Bw
30ЅЃж ВПeДZэєьHnЉ>TъмcкW|vлЅbьМп<KЦ3=AнпКЖ%Аг§ттkХm§`шўррuXкsИ@г*VfъП5Їё	ДЇвіА|ь,б6yW YBLћ)ычJЏл%$@~єќWН1(ЛLЯЊ1ѓЛкUЮBkПrGHl)УШЏoоoАїоJ2'kЕЦbкЏлКЖ]%ІOГЁѓ_`lxPыxx0ЦkеIc79Љb[!Ёы>Ж~3% йёoхжЕ,ЇБVЎTCрёWLкЛeё"^Bќ<IRЛ>џ:ЭЕ
увBщ`V~~V№ЗяmжіяИь$FѕЫяЕЇ=юУиOаWззИю]S-Ж<t%C+ПcїkDФЁ1њбќећіmѕMщJC-+ТЖfjенХијCшv{В}?ЫГаСє­cOU&2iоw_1jx|"ќяђЈEEтД^кZyЎ+ЭРЪ\)LзuБi4JЧІћЉlCp^?7тSО*яz$eБ/І{[!лНЋ2ui­пsжЮѓT_ОДjбЊpzљ|gCPю[rnАЁ У1ЧЂ9ьТФuрюЕћ=2жБk)UЇLuмэщm)kмйсгОjА%бfКзESЙё%Цї_Єћo'$мXPњ)Џѕ_№У#јwЭ2ХтМРИЛmУЩрщгK	дEZЇье№uлЫ1ёсzzЁЧы:yї#яѓкG7{/ћ>7IO2+єiє4
DШЌy#Јnц;гМщTy1[нn /`/#tсP{7iлчДZѓБ`jЌ\ыЇOЃЧИео*ТЕRЬг'MIy7Љёўљђ2ћ3T|,D
ѕѕd8}U.ЦTуДoэАОјKfЫGѕо'OФЙОбHeУ]Еaъёіэ#-є ЫЖШ
WrЛРИ<ХkМx­ Лf&7K:sq+KцSПВ oђЅ"XР%Yi№Eѕ^cЪЃџgзpчЬgk=ѕo:цбЦ§И-іШьcяЧPєOњЗЎAћ)эјпќП7уNZ9лмыЮwl0Р$ЋБ)FђјCђС*Я-ИЗLг
яxlИќѓ+шн<Јzю8Zў[+ж"ny$Ъ)NnЏЗе}?№,їКсВбЋЄE"љЉЕyYїлL\љqQ{тѓ7cфђc§Юfї9ЄњэSVїL5^Ч­NЭ/щЎ{жЪ~РЁйьіЙlйKњљ~y?nго!@Bц*rш ь'yѓx cj.WH-Rп)ЇЌЎЈцХэKW% ЬЊ`Qaг+ЮШОх[o@*ыгpЫMhЭАУ=.њJ
ЗKО@­ѓМtiАI\Кўщ ~Учьџ	pцыИќnCaЇ> юyѓ'Vд{ЕшгчЌЏЖ5fђоO/ыШЃrџ<дуџувЫSуООn=sDё5ЎЋвo0фМынa=AЩZXD@Z0|іћи?єSTgЛf_Uн>
h§z.ыІЦ&J4щNяO#eWpШЂДuэМЈ]П.I;Х6ц]еoЧтѕИу<тѓљЎыПї1Ді_д^}Е\§ж*u\oкЌ ѕгињ$ю(ОSq?пе*Г!,ќЪч>№4E<D0ћK?ёжxОEвй[aЙвп"nЩьq]GъЉ№иЏП|иiЖЊq,ZК~зПЫзzeУСІ6О1кЃп %јЎCІЎлыЫєVU@Оhl\Цz(ИфЮЯЉАOј\ЬЙ1),гР
~КЦ;§F7ВSыFзЄРбЎр7ќ>Щніэ)]pK;AЧУћ№]Г<sHкwџЯтрC­jІRевп0oёЋѓ:ёTѓэзoЙyЦоЇpbc1КБf;кЌxА?цIAщrјж]Ѓp\#юіЇLwOMyЊBW <у§яNЃLџ1GvЦЕAw tХНС8Tє§6AВЩ/1№№љJ=eXIb(TђT2хъVsУМF7u5ЫVвgcc4љл]м4Beia`Ѕѓ6;-E+№4огыЄ
yЛ­Єэбяѕэљэ`6ЂzНАѓyХ^y;2CКLкО{Uє4!!kўщ&ЪЉ­Е`][Rxlі-9усёXХыенЫжхAПЧъбGГdIt;ОKкмjх9hZЌї;Щх3њаЬІCёcпPsП+_ЫФk--HДб|<mk<zќЂњ~ЎrџNуO%g3ЉхwsзH\[Пo§пиjІТв@ЬЇ7oLЗъeЏaаЯvцтщBт+{c` UЯbђDЋхWcБvSэ{џЙ(	Гi№ЌгТYњK*sє*PЭfK_FћЊЗн>ьЎЂ~Б.GИДдЃGкфМ-Ъ-wОxФX16Ќj_шЭџ!+Ю `ЫW:єіЈHѕЗu.6DqЮ\Мah{z?р "РзНџUаYій[ЯЌЊ Уфкпн<h`5Е^kN0:?|И?iъ№`/C<лTв^ЩБк~~ѓ#*j3ѕЄnbјMaџЃDјЕЛаm`{>Я№ASuзјЫПyбgпљyщjйTн7Џ\*й[ЮхmpЛзьвnёDIR%Еvж#њтasяЙL:џi=Ќ@awтj-iфшємBНvyOwєАdашUІcRѓ'#]иИKь MsнљUдLVrъЈб"ЮzкЯјўжN1ВFэЧЮыїo=nќ#g)M<иzёЃїFIT?дn:Tu*ђ0|кA]S_ІаQ*Н(SiэбгЦГNz-оKйљоЦПчХJќОЉб§~gЁЗ ­
$ДЌWДЫHкшЙ~iСќKZч ї2YљЦ Џкm!ЏІћЊлЭЩўlыєѓЊJ­ЊпЈЂЈ.ЎE,єFрcm-џЫLКc;hУ=6X6Ъйё'KbCjѕВЎмЧњbЛJmАMХ"Ћ_гЬііСмЗУ5EЖ~ЯO8]вe*u?<ЎJcmV]Ш  nB<}фгЈЁ*^ГћOџ=УјLУь

§!gз }ВsцсРW\Ыjі\iskм7&Аљ[zfЧjDuiълОМ8EПнWЩіцк/9І|ъHД9иЇ%иЁФVэлГewCсьiјДУZрD\№~]з@BРn?Ќ%nLEРІ(zГGLPЋ<A-ьјWv`PРрaЛsйъг+мO\дЇ8љ$џЁуЖ!ЪЅ]yЁўHzЙKм,JЂРЛ1ЇЁђЁК~A,нЦ lЂтSљфеТЙ6ћЊU'ТЧhqНL&ЮК+-QљлuМЂYЋМ0ЕXЊЃkG§БvЇџyaЖжPФ6ю7ваЎ§z/YЅюw!RfФ@_§пD:TЋъ КРcМtРlКюђи<%k№SнDzо^?+щІiћеBХdўI.ЕяЂљЋяќ<<з[y{:ЗЂuвX6љfB{ 4ѕЮТ\ахЖЊVШжјR]ЅЙ9ЛєЧћНвКћbШЧcPё5d'gиз КЗѓyG!EyT"=Џ_(ёL§L,ВDЊ\HХњ-$6јCъ!ѕ9Оmш/Ќњ-`RйЫі6М"оKkбz]]q­ #`	 3ўМ1yЄЮюпйcРкѓь8љжЧ ЮД5mjщH^ЮЯ
гюAъЫЯ>ХAd&#х[жяQM;-зЏшио?j=з\^­f<МшDМYЩxkяаCBъk>k<ЄGoC;1НЮ$пoІ8­Яj3уипѕБMУJх1ЊЧџ8ЌА5јќюЃ­%?`RhаdSЦ[yxмњУў1oiXГEaЪЕNY§івY	тђDВX4ЎCQъ`w1V$rсB`gn
GрпЁђнMj~ПUЛ3­({љPpэЁЬZСEЛьrЎэѕ	Ч{ѓщЮ?ХсШяVБЖ\ЗДЃ	яB)й*нvЎы]2кЅh;.Ље?ЮЋЗД|ЖЙћуiQгуkџ`#nќЮ^;Нѓгo 
И(ЧI/ЕAЌЛШЇХљQЁzНіДї§Ze]ЁяннЖ-ЧgНeАoCgЛm=tjWьx ЧEчХTБx~iyЅy+тІчYТMЮЬАiAЭqфЭ/SкГж§ЫиMЧ5JkNОp
ЉAOdТQ:іYNlџкж-}GйЪ\урўњћhђ+Љrб$лф1jм.\ќpё3fОњХж~;я№є§їH0Wцк\MаVqA >тЌбTQBSмРFIВab/HxљгЅ!,+аHБyЃкљt*З	У(mbЖрт?.UЏжФgсPЏЈЅb^ИtрVЬ4		ЬЄъЪЏ<>ќy/!оKMюж/Ђ"Дa:яях(}uzЈhы#Тзrв,ђўАМёVЭлВGЋMЩ*{МЏT}_-vРуNЅЏmJRЖGюхФЕЂиx3рCЭ%M+	AI8=юVл2~lўnk2M	ЌЌгOІ!ЩМJ№,"dpГъeЦ:ЌќSeSзpмNЛo7Ml-j
d/гыѓсЎА$Ч-љЬyеСxнђ{Ј1Д?/,Е
ШЇђеОНЂ]{h!hZzтџ,Є-qtT8мэ3кЄ\IRХэ}9{QЈўB@У§Ї>)4тРTыdУ-Ћ~WиЛЕoмц/АФ,у#w@ь_,і<+гOZ~Ј`^ЯppbPQTC`)]-ЇЙ
	ћQКєЈvQГ"$Uqtйэ>хСУKэжP8№ѕйI@u-FёИзотч2,(ЉЋgХћMv(цvПvPтA`П8}o&/Ju*cиЗП'\ЃоsQОJИФЂyР=,~Иќў_мЯОu­p_~jX^јЦоWСlТcЮe№P[|5ў,qOЖз
П;ЈѓПUЗВн_дЁЯCn23J;ЩcЁFІТM ТK?Кxdw$RЈ*2ОЧЭ § XцОvT§
ШfV6|юВДыЛAs4PmЃШЋ6CєЧэ_цtЉг№:nЇѕќе+яЏQI!G^њ~ТЕтЪVмurЈ(лЛ|&KіЮ,.ѓxlсРrУPX4пЙuAдм=[Щ=
	HрXуWСiј)ѕnїшЖБѓяUЩ№ШОб")л)X_Дџ
zуOё^&ТnІ(L% o
!ЖљпЏ"%IЁВ<л\1WKZуаЉцѓЩО"pSЦќИvОўауРY-k§EУ;к`їДЛhЗеСгд9ч[иШz]ћTІћѓшЏ§61grЗЊtMхЯwGЈy$њhРх&и#Jрс@DнfшЂtќ(gцPTFйюrR!їёнVіЫZВ>Т:цнйS3Пй.ю}%[AпTуќыі<яjєkЋOПхgЗЯњMЩaУxякАя1I//rNЬОnТЏh\hИlxжЮ*фD/L@Ежыv$ўKA4ё-wиИЇПІФF}kџГ[Б^cЩRO1§o4pv1н.ЖДркkчНыыp?kИa\`dђШS`ЕlPЭ J%gЂ0хЬмp?юr­цфy	ЫтЏ|%1ю$јeа/BOТdI јafz8ќљ>Њўы0Qѕтa`ЄnШЄwЃИ5КHT8zюћ/!eњyTiл_б о&ѓЖIЬ]ФrB?Чљw_ЋEА*УзnD(мИЌ`еяA§= ф?ђL-щІOqbђBIЃаѓdщН:4ЊшI'ФМТыDњъVэez9гiIvgуЗkЊ3О;`ыжPыу9}rd.Y0lsХЬIЯr5е'НњЊПс^-k[iјЄлVsШє$љїYтyS	ђ9тflЊљ§
FшGЎ+>o(вђkgoњ/:џ2oI{тйИ&ФиК*'{>аЏGт4ф%єHУBJЦнЏf! zKОо­GNuЛџ\ЎNдО=qм*Ю-ЪYІаШџмeQЅ)з9вpКRНцY+&/#БLєЖWxЗXsWє
БOЬЫWc­,Љ5w$Њmw?ѕ}qйЧm,Cr)dЁ9ЦЅїЬМ.іє$+Ў2]М$­hюMМNтЃйxлQйЉя0 LеEz#ђ9 ѓФZИN73gRхE>Y<Q­єAчХ0 шs7AлTЙГ [K<ЋаjСЌиХйЖ%ЎАэ%=`AB7%ўиф-КЄуNюї}ЫxЯaеfDЙа[єЅЮcpnЮђНЦЌ§aвъёНГР.=ZЃf§ќJv%Ч2lюxоў:K5{nї0bOіT{л!ЅЙ SЯШэфаяТFН1УщЁhъRъ((!qїtюC{љMdріЩ 8oшHљх"ћ]R§ѓєЎх§{Ђк%ЈZlіЂ№QO]'1=в[№юз="Ц 9[ЃМў`л-ЪО(у>М!фбџў Єй.і8|ђєфъЊ)КИf-ќApицB/>,tUEзtЅЄурЩЁсСSЊfФ9Е№oUЋ)V5шFqкU$a]дIчф?YюKќ_:Иууѓ
ОAњ^3~:y\УЩZЪrшd)sЛ=йAьH"L-ўf]$+Іa
4$д­BЦЇ>MЯОЂгвO0иЫJ	ыкП_Ы]Zѕ=wЛЁІkшQwЄд#ќщ"u]@бЊi3g:OЇХ JЭ шМZ ИZЄ у2ЖЇHAЖOиУ[qшЈЕш=*ІЪ№ЯФьнp4HЃЃ%І<S;'MM$м}ЎяэЭЕШЗBяКнГмьїЫ§MмйлЭФ]BЧдpЂЁЙzgцMЭ#!Ы}	ХЄсХЉM nЉaF3ёЛо!ы}оВЛ?а6fdQJ~их9\Лn{5F"]ЩtJД>SЗCзШ!№*ЄЭrЇФМСїzXuъKоkW-оhСј4~"Ы!?ќ%[E3ЎjЏ,"Ѓбп?2BЄoјппщB7лЋxFфнїфиs$ѕюкtЯІРEЪт­є)йГЉДSфЩh!Щ фОУЇљ7ЦџPшЪvpПRxZіьутѓ:w`,^%lNЬjЌсБ`Z-bDpYhBЧђТCкАт|ЪTeжѓЮ,лбБpMjwud9{Єznyёb|ЋЏДИo№9DШиppQAХSqЛ$Лб1лљвБCЗх8Џmтbпy8\Ѕ%чШ@{4љЛнYёЄІЁТGхЙС(qъЛБы8љЂ=АМdPцhQ18BЅ!Iё !;ж/oХю(щ>1x~#ћiXЎ`hАђІвеaрMбуЇ,Юbpўmdy\џЏЦ|ЏH 1M:(mLзљФDLSz~пTgф'KгYsOs§&HоЎ"aPJЂ^ЊзpT{TЖл+^'Ќ\дT8Ц)sЋ8Н
 ЏР@P{#Њ= ЂЋ№шМ,8nі'шњЈDOыTѓ
>ѓПач7)њn*4њјJ;%ЅЕ­њ&GљѓУ3<Є2Уя<vrвЂ5ѓТ;а9Ђт%Д meіЃт=ЪЅ6ю.І5=ьkSбp@Інq оџьЊЭвбЈяJЇЮу_њљ4вЏ@T."щ2}§xрHЙлT<цлМсЮнr5ЅЎИV:ЊИLѕ­ёBEЊИC#BрпMФ)Й
+ЋFЊk,F}иV*iKї'VoЭќє
јфнрзёж5	~ЧyмЌњ.aфЦёјоS,P6_bК№BfЅxь E сЮ'ЉјєgMЦуaIяKяЁтЭ`Ў§nІЧWЂкщИ`\ФћџmЪў_]ъ2V:оћНRШэЛOлЋ­>­
Ѓ=ќЋёЋZ1 wчшјєЌМqKqP%yе"бЛяЦ3рGёД'mюЇФ8Nс4І	6_щЗЬLыYіxВ8ї}Ьћ§tRN2\ПќЦ@.ЬKQ-QnЄs/9TЦдSТ=9ьСiїcшКюБ/ўЅЩЕiNBђkГA9пЛhї7чЁ;и_еЗЊ єKyyў;Єg/"ЭЮ(§ЕВІхї+­КNн<A
Ь1JЛљьPАmЛпГр­'l
ЮєЩV1RyiБXwьEwъіiжЫйЩgБЪюZЄ!ЛЬlm7;\4|SЃНцєБдn"ѕК_,Џ@РЉЉгПrЖй~ўў]ЛMX№WЁ<нnЋоyNwzБkІ,Q%СдОЖIГzЧѕчѕЕ1Sаlѕ?mDmЂЬш>Вp@AоёdеQ*ЯuЗ6(еEЫнб|й|Ќ*мHЦЦшпQ4sдkЭ@yжc?LЈу}Вyx<НЛfКІЂ]зю#ЯеЋ	QвUиJO@nWg4ж@m4Ѓј">>ІeД{Шl9Еню3іоM ?}нщіРх^mSRы nгP'CC!ЋHцOЌ@FRCX;Eћйрм&JъИQ2l. BCІ%ч2,?ъЌўь"|ИК9gWДq=d*жц_SЧIљ№Џ6XCйќ\xнkV$TДmр.ыв)kcZ9ъV+? ^ЖЛс2UHј;џьbэ§y@AУCYHDТwOђF!љvНп/П9Мй3еyѕІ)/ь АlХЛ!дПkњыж8рййъ-]1х­аеЌO~Ьeе]zCЙщuД@q<KЬёx&. чZ7!ТЭДfюИДY
Lгьz4ээywЗ№+a&ЦGєSУјzrPI:a4БMїМeјМ {fNy`БпэBЂБїЬcљyК? ЏЊЙчПWоЈK]PПЛЯіДS	Wъъ-гќ	йЪ`жnюхЂrОЭKЅ#о]_м(TiнржрGмjдЈZЉШwЁшЧРеuєРјбЦѕ ЭЁ9а[sП~x.љ!Ob8*ТЁYЉ&Ь:шсSуmL\э-фГVJЮ_?ї+љлхjPџЩG7ьЅёvЮ}ћхpшoЌ|-R>ЕжЂoQTЦдны6EЧъўл;дйfszwPreъgГkђ{м@LVХLi*RU#VСпяАъDТЯГyHђњ$jЃq>5в­s2оМќBT_%`ЪT}рЦYХ^іжsHOk|>gИп	жЋЧ­xтGѕМxФцBgуДю+{ћхiДMђOKјТx|^ Ј§§МэЮPЋEIoeй_1^c)D	х\ЯЦt#IдхаЎqі9WLK/ЧпєіуDw-С ncтў0ЇM№g^іp­jдБC/єl8YkхpѕтЧзШ~и7@ВLя4ьIпeЗњ6%ЎЃD]ЖпЊДЋ0Ьb9Nц>Hынџf YебБ3УтhXџB­ЁгПLџЛ:AmrД:Ч ЖЬ3ј|4є^j5р-p#ЌЈ:*/ўт'+ЫLепЊNU&ъOЮ~@г§Сj*/s:7{ўЊВ]JЙY8^єaћ pIu>ШНЙ№Ј%" gоЊ.фVGY#hћпqТhОиДС-RїlEЫeБД б=I	Љ"ЦZрGDvЯеSCЉШnхыfіТ>КFє#"Єt|joЕpх%qГ 9cБъGјЦ]ш&чѕИК>рї6Э6)~ЬООBrWУUЦЕ`щ pЋћћLjіCхЎИћЄBNx,МhвІЎЛP-aиЄ+YeлП() 6E{$pЈЅЎУ+0Њtы<Їg=ЩтжMЖzuЮйfa]*оЭ1"џcњVЌv('ёђ4
 Xf\	Ї_ЦAf\ЅЭзыEAЌр№lMТдоЋDhYюf_fётЋ-^ЌlKћQЮшyі0ЗкЊKШOДВѓUІ8ыЯ'0ЇлЖє`кЇхдЏSBчЈH
% 7qіЯшy{Ы#JcЗ
БиPєA>-q [­uєшѕ}ЩРђO>[гУlDv/ЂZ]њЃqJ-гЗZPLэ=sЄ§B<ЂЋ ѓљќёХф}ѕ?NBФVЦkоЖЈLZуВroљh e1т~I`L)АѕѓЎЪ~%_Йвo l,г\w"SЃму.З'ЌйAЏЭdK^ЗT`CІEћцоЈАшIъ6Тњ{bяьаХЫфP/ЃёЎ6§БURЊЯg^|l~ЛеДгDGсъЈ"єЂЌ?wE6~ЌqlГVlЋЉ&oћMвSМQуPіј43&AEТУpwє6y,єDЬюКд§эЎSљA}8vbЭ1JФїшWпЦЋ*ОQrlХіиqўJfІЂeЯ&9Ко Ћ&J№КЏ!ЛyWмCnНДGљЩт]ZskмQI8)Јh­мkDnО{u*?ОЩX6ЄиІЖt];GP2MwsЖ\UЙѓукА0нЦ~XCOMА_яo\Ф'їмФ}lК4КйЯLVхе6pчлW+йз~ЏЧgKБЮ_пЄ%вBpp~(мK.jРпФoы­СtзшnvDoЏШйВХсЫnT;\рoCЉ<ha>" жуvI5я'}3М ЋгЬБ8kЗАI{;rQ"е1yчЧЗFўDFbГ§щъШ1nlйtжзЏ?чЊG0[J|CtM[C№ЬЧДЛЎЩфю№ХШCiЛщИЦ4oкарВ`ЈQьэ}УІгјУ/:§&^nЂCўТН>й\ЗЩЧЯљЏYо?(
]tЗЇщ>йшRr цЄќя!jX+ш)цr ЋЯCіy	$gў!н\)W;,$X=бD+	seXю^ЙКџчђФGg.LНц[РKMn9(О^nўф%+эGЕы`йЏ0ОaFЖHp4ZП`ісЂ(\ТЅCєZП	Л!{яo5Щ:BЮ*(щVЛїМDM9xў їпL@јSЙZМZy<L/ЬДЪк9СЏьэ#щOЃбъ#t,*oбтАіђж*Ўlc?ЈXSO uЃЁv№єР+ЈкVCЬКаіБ<N.>,_§G'Јђ}
ЕMєАОUz ЊРfн	ЗE­zx0їZfЮk&{E\ljZh§з]{EЗ?Щйг:rЄЕdН(tвз.ЂяuR=<3aаѕKtШJKb8ѓ,НпхjИшЬPT%шN7XЊ`
б]ѓRЉGЌ'/ЇцОКWЬo`?Щ­l'*Ч.
ЮQлYBЦ]rї>Їъ>`с$*D0яb.тПЏЉАЮЖCмБs0"ЃcЖV~wШСJ$gі(ВkмЋїщ7RЛcѓmЖ\% к ђЛ(я<ЭR
ЋжAЏ[њЪ0К~W;MA ]U\С=жыrzJ­+$%кpЗЪмДqniщМ#CMДeЇ^ЕЯУ\Ћ]gв)ЮјяeVб%этlx:ЮиuЏЉљGHЦУyЕzR\oЛіБ§	=&јл|s>xГ;Э 'ЖЉXсс+иўK	ЊФїD-ЕhТPєВЃФc^DbС8ц=вfЕєЌaBЅh0ЋБб^йр])ысъФn qQVхXр>щЩСЦDдhхg
a8|xqљXћШmd№3Вl<w9AVY~дЂюCНJДdхЎ
ЩHEL3ІГ_юc ОЈщш\тЧюi;РтS8 t53uАа6*ЌRC+/с1
BR ц rr|чЇХRѓRcXВ`(чЎ{DCз_?3*шЎIёЂЄ­wтьЕ'бE|nЋF9,к4ИД7(кwЄЌH;СВ7ђ:9ѓыraаЫыPђіMЗnFићУЭxEАPјР}ыєЈѕPъRzђfй!ІїD§ѓёЬлЅ=UЇЌњѕcЇ'РЂ}н
iWєWas?ЬGGSжЌIџзяlњрXHэ-чЏЋ6фkЏ	' ЋDЌ:>Ъь)ё%Zлм!йдKјD_­зЎ4Oє6MЊgж/+F!ЧЮDођiР4@Іг&>-щУЉчУjж*юEчO|f/Hу~c3cат(щАз=С§~\юІyєQgСЂШѕыЮ}аТJЫГф\ыЫкЄnЈ ѕј22pпПъЗ9-8КHфe{	;ХЭ#№LUTQ@$д%ЬђSдNах3M&іУі4дй,P$іmNфіТPHRXТЈV в§ж@]УлЭF№lќX4-Њ%aУБЪUЩпs`[hбЏЏrPXLс{иx7TByЁIђ>мщЕий4ЕЫ`F[А	(бщЇnУ#бO7;чaЖL2FR=ЪI=жЄ,I#Cп­u;Ле}gщ >QUdG2CМ чЂ"Е
LИ{	,TkснЅ}  ЄщytЈ Hчй8~Эa'IЖйдАз,#ЯЊ_Pђ-Ќ\ыт*<нzSЩ=2иАиSЩYjr jF@)гMДX5$\Н3АгhфpЂ<фЌюIЌgёњиT(Ќр)74Лhmяђ8ЖхXчЌ*DФUd0BЅ№ю:њyqYЮюзХСОТЭОнq§ЋcХыЂeДрУа8/(Њ`щ7;|M}kКк2зЌІЯЏKй§"\iдv/GvъtмЬВgQQrи\ў(j;:ФгеIЄкэ	вH_KЁOЃйЪЉлP)$8HH5'еygКnКйгтqba^KхlСвЧPR#ДИ?юлоцЯыцrЌЦВмвё1>9У\Ћ ЮVтИ~е
ЪТ6Tрd^пЬ6(ц!іЂхbэ5ЂqР@*З OCш+Ў>[ЃЦЬAю<Оl	й КhЎаЏс?а6ЃОћЋIъЯс5#ЪpСЫIЧs­ёѓ}Аэм /е=ЮЖb_Ёч|N6ХМ§)`№YFиќ>R
џЗ)K/ыe<ѓЁПG#ЛYЏ+Ogz4щТ/rsG?ЧпjыГNЉgБќММZMЊtТR	wцфп!tјwЋЁёL?б,єsЎ_З ЄпЛе5їNНОЅ]нГ"тV(ШБHMI лЖЏHШ>NЧhфя,­WP9}ЬОінечЪ0/uЩRХ+Є@дЁЗњюВ5ЮН"ТШЦњў@2i4чAйЦ1ЈЖBЉюк§	(ЃLјаiA~kЁТ5oiћВv7XнФ>{XйЮЖсz8ђЖLFtЛл?xfўJфВЈО,яQ^+O7DЫЏюБц:pкУUЁџiЎ8Ѕx-WрЌvKчfъNіПё? вшs85ЦЦmЈ]sЩdВ'љаЃ>'	XмЫиж­ЯOЪ	*Hhўу.­Г5LьЁПYОЗd­ІЋР8ФдыenaaІњЦЊюЉЉрЦ>з5Bt=Лdu\ђ,б:ЯГYfќСзЩќтЙ№щЯB3УuїќМоКa4gэ9&rleе[ггб>iФ*MМH)2еЙШјњР"7СДЭ c^v}v§Рh*эћ7Адlішxp`I?,QvшМfмШъLЮnaCќ"л:vVl(raТЇк<жj&б}V8­&џ1 7Е1м {6	>{MёYi:ЅіKшaBX	ШМКE>ЩжЏ,wqш&5CВ8ыѓG>ФDУыП§Ўezцп5ЦyEm3Й2
?GpU4:тzBхіъQ§PївЩ:pСјxЛчqйњО1ЦVЯHH-_Гйф)	h?GъtsибЁАРkЎІзgIИlLюпЈзuлДSFі^-_Ћ S=Иэыв{s()кAЛщЉЏ^Ћ'Ўѕ)3еЏiЇVД#3cлсвєЌЃaІѕЧтj(Ћу'ЏгsуWБIіnхЅї*
ЎлКqџЙЙэkMСm4щ_\њП5Э§чpсЊaџеддџ6*[Ы	ьБК	<cЖZЫCqTіЦ!8BІ |РЩh="2^Љие$ХzЊлd@T$wЛm#_§`жOljEёI;CP;ћRdЃЉЗ#ЋSp' НЇЊ	"">b(j_1ЕШrЕgуЉeГ98ћsoQ§ ?A|"мНGN§лшячТEnРwћі`-]ЁЛ4\CC>kтyT]LМ23K0пdDЉИ/j2иџ_Е&ЫД%АLKљ Ј№мШ?rёў}­RНG.jѓJ:4&3aмш97jKцВ3}`с_5UjLОюv$ RААcI@НлG~ЭbТ,ЎГьФѓdђ.CkNI<ќєС­S\ЙjФщbкR$ю]ѓЏп9{ј~I351Нumu]sЌzO^ Aђњѕ&яЄо7rў33т:H0Ѕdб 'ЄSђ0AМЯЩ)І*фЭЌФtЦ KЂ$эгЂ%)њUд_3>ЪхЮ'vhб'м}QUъхSЕDуmЄ/НтчЬЕP{iвУSСfuСВЙбЕ6Єx М!ьџ2Hе+ФЩХ4дb-CeС:ЮхУ@$LЫљ
y[vќ.(oqШэ^{{Няъ_yУЖљ2аўVцЋ)!СМhжДYЏ№)ЧсМ~< ЉпЪоЩLPИ@Вљ1АtcКU­ћ'Т>,У5Ё:Г]џ&щ?UЁа\~nм
-Dе($%Љљєр@t)ф
>*ЗUN4WЫдЙOuЪ%њэЋ1іIВЃ3пЖwЊйАьћУгіщЊв34+(q(hИ9ыtПиеІ\Їб"ZУLЋзЏ-Џз_єYчЈыЖЕК	л,иАїёѕЪjїХ?ЁmТ0rхЌЇ;<Ѕ|и *)ЂyПa;Њ+bРфаБgќяHC1w3ЅНШЏаЇ%иF))ШЂzішo"EЯV*в|ЈЧMзEрўd\jtO>@8O^ЉгїйЌ&НвјЉuЛtлnНи§4IВЗSwS{КhМwI ї%№Дюцb<pOјbНБkUФ(!е#q<Ь	іwыУ#y|PеТWЦЃфW]уГ/жиўл?UПлФУQ+Dq8Тр7љH§АњЭqН*	ўAФ<XЦC})#Bћ#fЁ$~р891рHb	јs~еZEж7cJpь7У~н3Bхiї3=е#>тЪА ФГфжszхєЂІ~3dЏЩоfkЙжњЮѕДЊх Ў2,Y&JЭЬЋЛgF­ГЄH4х8Р_бЦ8+ІPВ1}0QFЂ2зуеi'6СНщ!ђt<№ифѓЄ%еіЭM­р|`АЕ6oИvћ<\yуП
,гt5щЫФЖрiсУ.xЋ2=ОжџмБПёшшe*/Љ,їгіТлсЁЊд&vv|3|Р1ђўЖіЬR2єWќХoКП Ш3А \'LГ6B $E,bs2­ђ=Дw_pЇиЧцhњ!ЁсЫ_ ППЙ.иwпUD)y]Eќ ,ЄВ)OjKGйa*ј$5~.эђХZЄ*dC(ЉрFццoИLзsnHqКђDяjOЖmф,ђпДЕјI<4_Љ	Эyўё1ЫЂOЧЙџХ3ррZ(юѓDЯ_nћь|cАTй{ѓ0>іЎенНЮa(\Эу0rІДqТWQiІ1)WіUЬjYЫЛcТсжД?Ї8њr/Я0ЏPђІ%џ$A}мУлT`	HЄЩЯФяp>Arbџ­Э мэXЧ&y`ЦпEІ)8ц8*oQbиW5\}on{эEELЕуЫ4ќRТЕГTЊчViЁї+Dk^9ћФО.Ь-Їь4јxЬIщ+р Су?ЈмР/ђУxЩB6ЊЛ_РQтн?щйrЌ2љуЬєМтёщеЯюЛПYmЎ;\еЮчРУђё&K9иЈN%sЉПіУС`^Т[w<5зk ЏX<кј*\јсxў]йCЃF]HАПю#5Ko5MоUq}аAJxс6cєљТ2eєзtCсс`ЈьЄЦЙJbUГ_*GF#СEЌЪmєжR]Т0еKИ/vнЧхEЎиСъO_УЋі%ЩpєЮpQe}щ3lэрп%dвыќэiчr~<х;сGХu#ьХЅЎ+ЖuПZиYЛ=Ѕ}ЗJѕѕгсзЋ U}xж0drЄu^?і&нВpЮќ"вЇ7	ѓќю@dАысЛЧfeџ{BOНЙЙaИђR,AИ§ЦЇђў6Ђ]3ЫMЎcјмЫCb=rlшkцaѓr:MHGYoс7OХГМPw?К!+eђZьІdЅyёИbGЯzL1kzдNzдdЊxїѕ5Б%ПjOвabZЕ8ї№VюVуйЭМьПfУуГеЌ<ЋЊntЭП(2mQ'~n№е­"н№%dmV3ЧїЂЯѕЁЃ6`V|7aH:юU1:уЫH@%ыiбрРГІAФGБЫ1ъTnзЯ6ЄХTэТ§hdRfцIљkщdт,c њЗЪpKL АЬgћАѓХШ<}ПБC$АдјЄђy
є6PШHJOл­Кян #`зadРш­xшИxі7НM CЯgц№юc)ДП'mzъЂК_TЛ6zЉя>фв&$І|к6,ј)xWpaa:пьГИ№kчъЛ%ДdeўHџщcoпѓ2^f'ЛвhF
о4ІIСь.EЎawmлїeЄ+§ЏЩEmьеЌЪўv7/Њјт5ЌеU?ЦcEoіx>ФhІћGg$аП'Pє/В6текvY3Сj3егxыДтIчАџџ1ьНВWНM/Ю:ХDЌhЅeяЭцsЂ]ЈQыq2-oЭ/]&І=Tь	Їш<ВмZѕіMиВ=aРК@ЙGёлу!B(BWЏЄег<ХаЇ`,hЁ`Чoфr
djиЦqўз$]T$sА_:Ў|ѓ<CЯr]
UYьR0lю]љg>EI|чЭоЉ<ќJФу­0ЬЙvЏшЕЂЬnКиеlч)НpЙпMцо>ЕtИј ]ШUЦКWѓf­жфйті#А9щ)ФБM]НЙ8і4б6^Wр'ќSт Ы§-~п~р$оЊ0­ЈЈUОЁЄ?YД@­K>ас6ЂлЫzЯ|ё1Ї,ОРЂ}Й щ{Мі8Вћњ&a!{ъ=Ћъ3FyЈшjђx{X Щ!Ц№1ъЎYЏЈѕ6<Л1їВћ4ыЫзхЧ&Xa7иc[ЗячЫЄуЖвIЋ'(Q1в`гѓ/1ЦВ2иТиЬ$рbтjДЙi?вс3%бЯ& \-bГЬђ=yб&	KГБ}Pуў2Яw<dъ	ј)Eр@"кGУLшЈ4reEьТ,йЪЉУGzjr`dy[S<№§&YЈhІ$ъVДZэ8тRбяBOщГ(щ@TДп6xХc	ў<ЊqwЉњГ>zd0хуГqњдљv!~тЦKУБO	љўѓИйhьЁ` юяжpШУTъГъїo>э№пшТШ@eјѓo;#дЬй1ЖIНqСM_;ЬђD
fpw(j 3фМЬV	№Мum№ЉЅ7хыѓЖ6nvёDLџV;Ч3_Џ]]ЫCр:№+Й№шЩ	М0­ЫЫ_з&ЋгtПA*RФ.0ы#џ9(:(эсУZт:PRQ l
mЊвINЊЬ9;ЊпauёБшнфкЛи6gq8ящѓЗДяОхЅІІ\ілДткОйg34BHњаbZЭиIHЎќP7ШfzvѕШ9xіAЮ ]5?рфkH{ь6ив4эо1VШ#WVШлqЬI5
зFлЏkxЃЌ7а*h,$R!Шў:Лxі<KЃbNб2v ьJ$)EБЗдoйЭ	ф[}№#c-мЫAїу},G:юjоМnIњHСDм]ј1фo>ЪЁ+ЗяZm!јКjЕvэюЏк!;ЩЬЮ6L``зхЏЗі/жvОoїQZЭ!<вФH+БEфf|nфм З}<cЕaїкгј-OПјЦПјмсqk3Ё[ЮYЯХvІecеКs5Иќ^ЏФС0L ЕtNЈе2EЖѕ~&OC4нJ+ ьїп"lFУ6ќ}Єgo~fЫЯ ДIЁКxы§Дм3_"њчqlьФmа|cљЋвoыwЁ)ЋЕНЭuГ!]ЌшЧb§*ЙRxвAEІ5nCa.т&aђюЅН4I=ёиХвС БaL"э8ВA._Oџ-tЂYYйЩ§&тЦl,їЙЄ4ќ!U§ЁњhnЃ3­и:вчЎKЙцэфряigЯn§ [<Ыч2xУѕзЦЭнt)gн<ЃаMтжQв%e'Ypѕ% А(2O(uVoзGN-9Н+ЧЂl;/ађљX`ќ№%яЙЎІЅОнq=с$R=Џфф5uя\cр}Ю9ЏчіўН№VdёРKю5жЙEЭ|PИIгDќу|-љPqїяBсФQЬt&юнhМFg тCз=д=MО [qњQлjъЏѓџчk#H8"пkРмЙu,LeyкА§'6Y?'ўќEUф.ЯЋRи2№Y§н.OРtџgЯЬ2Ї№џE-Кќд>њr5ц=:СB4й%сSФзВfўюјG­j(Q йЄ^ЄpпХ§њНцЁc#ЉpPЫМflУЄЖ7c$
\љК?&ЕNО2РЊиЇvcJ`?bкн7nЫY$UєЂ?wН=vѓЖмШЧЄgм6ч№Б:д~Сљѓ	тГТKНwбUЙЋІWѓаRцИ5О)DHсіш§ИКеLчЂCуuђyћzорO9БЛ8ЉМFјq{эБQ$|МYBюЉб<m%ВЛЈz<ЇцnЊД}бїlxьъ*^dpШџ2qК'@м
xasРQ@Yе№БKp3Р"YYЪинЕ.nН/FЅА$31ЌЇ3љгяАjJЄ~vDкГzкї-Ёц`ћќёсRФW%:<ЃхBCZQїMhMэЌБ1№IКъЄGн%G>ЄhЕi*B3&еэ-Э^ХG4Ю/СL*SЋaэПeПCШцEЛ6ДНhБЌдEщмљЪPs<ЪМWЯuItјaНГ|Wg6ЩimV шЪі]&WhАbeэОHL'пИnДg0{O ЏaьtђџепЌU8ТЭyћ&<јФНЧїЉЃMлHЙцэфn~tБчuДУКяцaьЌX1яV!ѕКЗ'Д=Gї{T!5цЩЏ0QнЋРG@юў	(#J	2
Љ@лhбSшuь кіiЭЂpуюvп<qќ Э,шRюFЂэ№)§ V<юэЮznїЪђыЯiЃЌЕL8vя"TІЈбзПжВїPN"ЈqIЪkHLnЁfщ[xШЎiг?ов 7@TоqЃњш9 ШYъRjDBршюlQJKE8qlНjЎн#Eкc{Љыe;Іп лopџnCЄ<ъzСW§ѓOЁЧхIсќоЖІџЯE_[ЫqЇ_`'Ѓ6ВюѓмыНЄ#їH)?іўф]*Iд;Y@шИ_twшР-ап$мE7{ЃГ$іиЁЫЯrш)K21ЛШl_ЯPEПАEчaпБрйиѕi1чйyоѕѓѕђ[oC4фlЈUЇ7qж\ГБЦH`ћыtсЫьжRqёЮ}рtT6мЖ5)I E*нU*дїљ\Eo6 э?!Є§Tик#њоlJУРТњH=bbќG2X#ЂЃ?ШUѕЖАєЛ	o9V7JК/ЩЈжЄЄ#m<"щЃgЙНвWM>!Дhjёј!xт@M?Sп ёъ-у*МJnГивњБМ-\Б&?+
 нэ!SjFvиЅмnћй\>цѓnQЌykV] 6 0      ю*нХннннХнннннннмннЅЛмЛЛЛЛЛЂБ3# И  тyR&{(YЕYE](9:ІЈ|R dDњў'§ЂД%tRйЂьEї@;ЧeэB`сJ      @CЪжОўўџўЄШщi}F|УяђЇэІ_еfxу7МШQЂяhOg.в/ђdLКЬхXLњЛЎы(Yйј§WiCdDё*лc}ЄYxѕТЮ69юeSXQGЙTщ/ыШЖЯFЊдЃЂ^ШзIyM$К>c[щ8уA<ul`r=ду4`ЁзSёОіпtG)4wХ-:гіо*YaќЩњ76xwџєЉЎкoБpіхфЯYьЭoCOИfоBиЇыќЄ!эрЦўД.и'!EЩq:Хg0lu&ѕќhL8ыІtГgj>BцEтqЬzAгтљњQU#л8ђi§DёЯ#ЖГЯkъHи!Ќюм,ЫХцoЋфL(r~јЃNъМPН№ЕїУU$вu%#`kВIЩафХнљђOЕЪщюэдУv7/sћgтшќ8ЏшSбo+жУ{3ёЙіі{ѓіЋЉкС9ъ:,s<"XpЈэetђBWU)ЄѓеоМpљк§ФЄ НЧop+(ВААѕЋмYТ6ѕ=еж7ZCђюuVxvЎ*5љ lXсaІ4ЊTVх}џцгїuЋчЂѕl­JmМw-TГNЂкЦ
Њg?: jѓMy=ИpоРєЇЧ2х­ФГiЇ`Ъtё)6ЩЖ}єCмpаЄjtщ>рb8щ"\*рE/зHQ>їЭJяе:3щь^ьЕЊ	Б QYъB8в(
шЙРЪXШBјVkЎШЛgNBqN|HЁхГ"<)~Н
,Хf3ы<чJхЈЈq>(мia*їЬЫщЖGбЎ6RыX2Е,У:~жFЛ{7;Ђa2Ќjч<$иEЛeqnЉѓ2ЎLІЦ(*iЕq_ЗпшУaѕЩсф с s_фzЖ;яжз[9.еNT3гBЩЦknЇgЌСыэЋnЌRЁ)й.HЩРP(Р­_ыщЈZёЈЎ9ф[0otДэMдН gMРB#0zkзѓzгX)sў[G эqѕЊЏчm­пџЗgљњ7nљ9ХДБи<T]0V~.}Ц№є^х­aэЋвшЯХЛD}CnчЇюд# (>7іЬЖ1F/nјJзёМѕ ТsнЮЇ;H&7N]UЩКВр*+вЭ}доe*QmБзќѓАМЁ8ў<C$ыуШј№ВUg#ЪЯъУЦpшАD9ї<mГ<іѕN6нМr}юя<4>УоgsK7хЗDпйќlљn[СФq8ееJА
(їХ<7XocцPщq_рh6XЋпV=LЯDРНО/>3­gJ§d!Ьп6yо;Аtь"O.ѓ>\ХШМълнdvЫk@TвH4кюіЫ9ыП ЫМVH§ЬКэуZщСЫ$џzЯlЩЌЫеUUЯ<ЧэпГЧw\ЫБЌрf5Ъ§'q|ОC,(RУPAwЩљ№н]ЏЉR*{i&І2ЕwI99Жо~_нњЩJєOэш*Йmћ6ЪМыЎюfВбтXIWeCc ьК-тУEI#??чSЄszгA@J%qтdеsi5\ЖNЬї%A'Нуd=Оѕ_Б(>~!ЅЊ.Д вqп$uпФюю&вфЧэЈЄ=JLбъЦЈ5nмјхЗЕИiэдkЗ)	Н)б+]ЃЄ#ФЖЯIЩ&ѕсIЪ%S~ЁKВМЌПСRяЫР3gћЬН\еНу0qПшXзн`$<ЫVђ3jDyрH 7яFbРсЌqX_vVЭ~Alыяm=ПЮЄQЯ?ё,ЗзК4ОКш№иЃУь[;ІMxлћ5мbpИMpЂOЅEўRоCC*gZЖСFСЮ­7pФ#Аyћ3Шj ідОЌ LЋ-UЪдѓяHАq6zосq&ђк9$Л#YЧ(HU}pРh(цtЮgЅКѕХKєqVvЈ5Я2Dxэ7aPрyр@ювLЇj?жDЦќm?ЯюF~?љ6ЯVю`ыт@%%zЛџzИјЏTpОIfW1
~аЌљѓwыЏюi7uэбQqIъмHFвЖЮШй[x~Дїoеиер ауr_ДЯa87FFБ,шјЧнaйїфеІД*uКѕРUТoоњљё0}(>н6T;ќў4G[днМуИъАOЇEБй,Ў]њ@]Щ&рРI$ПРнP>А!8L=uжz-ПЕЖлЎ_Бh:ЃAялЄMќEЃЩ§
vЖ=dжЪeЙм
4њёкыєТKЂІфeЅE6§TCд(5|Ю7-бV5sњ3зіvvRзЂh
зхЫTjъЙђњЏmH(!Ј\4м|ЗЗSПт#Ї1!MSЏREГvL!tгЏSЩ
+4ЮaюЮ{§r,в^AAgюHпhъJџ§зoВђy6Ч^ЂS@!0@ЏцIrюxbe;	SYsrЉЁтЮЏЉх[а`\TZLhylоћѕ9pљКЉїЎФ9пЯ'OWО wэI#Гщюа`СЇїНо[ћHЛЭst2Kмн~ЩЦa#ЧЯїђrcnnЊ:ќ5r/suяІaЪТw; Д}pl~&и'уъOORlі.і&БH{ЩOvЄХ%ћб§зeЧLГЊ$Нd'H­Њ{П ;$ФСЁ№gс^ТЃН'ЭuТ9Гф:5ЭDљC\ љххzЭ­ЩџѓрѓRЮ­ўЪktc>ПcчiЌkЬМСъ?ЄQ4ЭъщGтР$=Ы СёУг/дчжЫуфWЅфц№vkсxu9аљЌ;E>бЅ|илЃљЅЩЪ9ђSЙKхѓTЁЬЄ­~џAдЃ#%sЄЈej+(21ўFN)Ба^т*MEЮmпЛъІKжZЪдЕG'FІЋЭЕWюn[nШДЛ}<њЁ(вЧЪЩ~"2пZа0ы"3ЄE)nbдѓ]gњДpЌсTЩЪљVЅАXЬё aЌёSY'>ЏcЈЗЁѕОЇђ	Ј`:}ЊБћо_нњњёїєЛТuоRо]LRыlІGIA§/tлmБх8бЈЂЦ=?JцВГsKю.:	]@ЅLмLмб"rІж_@]ua,wХИ,їQ0[Љh;ћ1~ЪMJХЬу9}ѕИжОЇцo]ЦWэНAаТгЁjuзщ'CвNЏ :іќ=ЧXt
СгрВ) 	;ЂЌyOИЗ6ххЎT ФPDќХ4ExUЌeP"ц,$Е@уш80ХNл§<3Иwx]хqЂI!)6c@'о	ѕСL{Є~DйDёdsGж)ыФgЬ)ЋSбњZ&јћЄ§,ц[ёЂ{_ї{zјn@ЩьЖїYмН?ум"ЧБЯВдчЃєы;AxZsеНљЮkўъЄњо=@ЏP/ЧД>^ы([%dЄ,цяTJэИ5gўчetuўфИіЕцАЖvъЬњдZ[ К­юџf6Ы"ЧnМ;О№zЅкіў8C­ЎхЕz(qЗ:wћЕ6ѓвYЯ|}Sa'гЂЛxб,ї_НЈX о=_З ЗGЋ%$№hл5шHЧщgЂmЛЂtXпocfеВЏ`t}NTE%ѕ01э7ўОџЗIgЗпЗВХ sјЈJђХТЕ1aє+Аб@лО Г^YyИGfМЯ:NиШі"[№ћдгк0 ЎgO<@ы$4Lw[%бrо&э>Vњ УЄ 9\8ЃФН3ХtfйOВOЂDЈЈaЫІЃи.ТЎHОЃQ Vм%_,ЄЇњnEѓCЭї  &Цњй_Є9]§чqyZFПљ`Шp;љ[MWУюнРyhiг(Г	oКKs8:>щ-оч{&<p,ЋюMSЃў\ЩуЁheмШЦЌЌ+ЭЂЌпї!mт§ФДrёxBЇџЏнЕOЉ0tnьЮгШVyЯуЏЉДЋшыёEысnл-АmЕ"ЭЯWFрцqjPq&<аЊs1аЋїЩѓ\`0
.eЁXЃ+WGЯЄ3ZлЮNЮQJяRђjгuE	&і+(ЧёйПеx=ч)HіJўёЯhЗЉж(6`­"4xGjё:Ђ9ЂexЗЬьШДџєnь6КЉѓйпѕLЪ­x-бєЪИѕrЁ-пМѓIDЪзчBд(с bc:tвдѓKBm.о#wpШыyЋЂДЁgдhъмuъ.зCyGфWэўяМК&tЇ@ЏЎw9сЙ!hйВў>ОЌЊKdќQYЭБоOПАiщу\^Q^.Q1ВBЅОyМУНё+ІP`§c}.TђёИLЁІь2dBimпЊbЅ[GХіSЏN0Z6ђьњД=бУdpt\рf'=е/$мрPЄ§ЎНІЁKЯvO8*rЪjІђЮ QЁПwFIj;)щТWМФј*ЯoУЫТЏQ7ЯxсwHсгЗг5~%wМФuсГОстIK:LjРс"§=.E(иМ@$0tlpЛ/љЗkзEѕge!E#jЋљ-ш|(,њc#ЉMюЛЛц?ешкL	.ј6vММAJ}	уE[цЙt#CЛ#Cк\EaUДЯО!^К'є	5qoаc%а#GЁхюьЮуЂыБы,<РаDЗЋІ2^ЄбЮчЏOZoQТ~ю{їko0oЙ№<BG|j_{г}|фq{бLљЩmЂzЙ:rы^\GИЧ] ЈaЛЈa6p$,­§PlдUёп)_	I(В$d>)gRfфЉяФшaЂЭ '?џСrЃNТХ#l1Эое<dЪ6?вт6спІtz 9аfгьй7+Wяз\Nѓњ7UА7xЭІ:~Пb2iќЬГЭ}ТЎVЅєЈ<5Ј}@2_:ДЏрi_,Ъъ|РЫqэтИвшIЉќєQIyапL0ЈвЅEeЙYBIJG$СЏЅспФЊЊЪ_ХђJI\K+ыuGЃм&ЛМQ"ГўP?щ,ќWЁ4PQM6.ц_jЙЃo!ЋmОYРЧНUvjїQпx<s[ТЩѕФИј0`_РЂNМлЅ|XМфоХчЏЏmЊ>ЖQ%)ЎKгОM=ЇНЫQ]~n[ОGTѕTRG0ЉЅЯJeЩњaAМpp+hО0з!Я[ръЦ_жE?t5F Z(92к?ѕKfаР6_cEо­gоxэхP[іЛ#Йgі?х8AџНFЛднП$ЭаўLtPд>=>ЭsкЕШкїsўПRЧkeЧЄщЯЗћџСМJEхЬљТ^Љt[s№Ир/вЄц(щ2\ZоНЈGIА3_NRpћoэ9ВaЂѓeэФбЊхнXHСу?№я70­єШЎ6вAzѓg8Kє(s"vХш!Ё
OBміf#їЭё!о"!Оз]gЩbQIвђёДфЂќЛkМU%J~#]BЛмDВG;ЧM,ЫWЉъ0xнЦљOПЩ6 i,рНЧIеў&ІПS5ЎН ЭёіэЭЃунGїНX№*­
цOш9ѓ	2ЄR	С1чХdџВИьтвћВwЯJэ%ЧчЊLCвvVЪF*єtъЮN?Гo]$+]ЌЦЈ)Х	№1BэЖiФKЮ{ТWЯIIАЙЃж*юVVЉ0-HP­-ЕLиеM*Fкxvњп\9бyЏПY\sJ>jЫaЯQЗ}ШНПљBбKїрљЌЪљКШЄkТљCі?я'БMќЭП5єbљ)ЊsAВЌТtkя@жѕ№YXЫQзРMP6јьІa2№хШО1Яx'ЖYАIхЇПщLOЁЅFг_nуJѓ>йКфxебvSf&tНZmEЧ\йпь8№м9</ЯъАЕSТ=,Бш0-Жgbбм~sуНтаeдM~M+§Эx`ЧAН+]MgноD}ЪљGЈcН\IЪЬCўЃxR=ТбKЂи44`N|ГЬђШX9јкъihdЮW&сѓСЦ@ kнUЉГZ;ЧnИ$?Wu@ќi#1йIMhКh3bSKєрmzy-mJћђ[ѓХнЦ}oњёQ#eъЌ".Fщv4џєд{м^$hщk!ауЩўЉa3mКФtџЭЇЋGOјїТюћ{&Ўщ>dљozxммCX2џ4,lМл§~+јPТSјцЉЇШтЉАЦ|{eФйдФtQv%яhЩд цJeЛЄрўHПoњц%ЪOтшkhCЬМЂIЁАwрѕH~~Z|Тs F` ўіёшB§њt6eФkиJ~ЊЃFёИ
бLџE %х1є<,ѕж3Ц!ЃР_RZcЎ6%ІsіЧc~|8IjwG-!ЮцяVЛеГvaЏ>Љѓ=ищьfsвLНЌW`з~RZ#&M<A+­HbmЮ5иJdKBТK7ФеЋФu4?їIГ­*Ху
!Ь;Gюе3Х>Ъ4->б`ЃЇ%Wv"ИEѓ!3РЪ:vyЬш0еI%aЩёўztЯщZлЇЇПЧ3ЦєуљoЭрФjюsJ|с§xq:NBё`шПw фwџtAlѕvшт!ю?ЭоіW§)Z>{JєБџФэ8cUїљ Ї&Ъ4ц)ћхЬIіHMV<3`ДhэЖЭb хйKКfJ dTРдРм№8v№щT0 ђбУёъиW~mfоьљІC;'{ац HhvлЮоpО+c5іЄ? вNА}ЬdјSdћМЧrЩ`yџя*ЙїW{n*Хбrќї-BляќГЛhўъb#A~кЖR	T& :4Мy*­YўлР~ь§Ззџ;oдa?МдDk<ї__ЌUібKЏмЪЫС{НЯeнw8gIЗf;с#ћЮ`1јыЪ9z­ЪшщжюeУН
 Ы-ЦxђњDЄ
т mjHЕлkз,И	оcqУЧЗkЭЎ*~*бМ-KЛ:1-woЊЗд^iѓ(ЁЌ<oOн>7ЭШ6ЌлжКЬiс/ьЊZвtscQЋЂЂZДPЛїOVCnW9 AЉЫй(1YжЎьјЧB)ЏН_щhюпOЂЋЩ'iџ#r!Oч<UД<h'\ЗПMЈйcаЭ[а|o"М=tХxСь9ћвд*ДТІЕе]ПІrМЉuHпЎУGLJц"dYс5EZЇ.лПZбѓГДФё9sЋ,FpЌ*љеы|nCЛlIя]м#9vЗ'ѓФqЖ.t}юј"n	 ШёЏf 6щlsШ@@w1жћ7uAqЮ5EпЉјm\SїU7є№џx:СlЪЪJ/Х7ЬЇ ?^иЂАiБn+ОВйP_ьЯy;/ЛYoжwh$lПлw]Kъ-<cfХр/ЪEћ/њмзЩzmMН=ІeљёЎpеддyў1§ЫЙM5,Ћ§jzF1нZrRєќ1§N$CУ/A7Eыж-
Хw0=ЯNнЃњгbЩт1} ЧВ"ЌOOЧ/C)КtэYќј+ъєЦЦ§біО4л\ЉN{кR;MыvЋЭk№ДЬ=мcў'ї_{C[Ў§8г4КТщБфhЖ|Rц(ДnёD@MJ	Q1їЩТ7VёЉЄЈйГЈј/WO2Ѕп ўkМћ ш c)ЈЈСdqощ,їСђ>1б3юШ#К4= ЉAлЪ xф!Бm^ЩќzWгѓвxi]%BгAс.сМ Y0аfєы{&яt}?;ЗњЯ?$-аOпЙ+qЯх{2іяю?Ы2gdx#ЛaА0|аuТє9 є|ьrДЙY.u<zh,ЛШёРИР!sRС­qл­ш0ЗDужЈЄІипњФћH2ўr(6|.;=У"jИфDГАЕЩ*cр9ХОук)ї^ЯёіJ_ивH|RІЈf]ЃпrЎ8rGOњFdv5РМг7uрUМДhfoWГS4Ј<з`bKшyџ_xџЊgџ>Yќїе!'ўLщжэЖПcS4Y3@qqјГ№o:
ЖыaВXѕcђk,/YАКЧб­чP;йњАьХ$ляц#Vріk`Ш?этx кщ&УкjПN'uцсїIt:e(6]аї№нCєЪА:4ўы+SО{g!ры№;WјEєZКя7Њю6§љУ	И\lПєвo{5нn{1пюИП:\0щ[їн,KНщИ[ pы6Е1я&cЪ/ЗsSїЩ553.ОГ­щјIлёЧЂ{mBCЇѓbК2ЁIOb]_j`НоЏїц>йђ8псЋЭL"BrџiјшЌ
ў№8џH^5№AЇ§КP#LЁPїImўаgЙH.С.Мod WЩG4чzгDv^ї$шы:пЮ}іЮЛБ4И=њЩ№СN~шЗЬПь&УѕњЮЖJ<JАE­ЁЂитфеzшВГYYeуП?бanеЉr#tЗ$ис9:хщпЙДЫяз- 0PBќt8<зІќVp_К,JИПтДGk
Ю+Р[Е$іГјnКX?эRVоац 6YооэuЯёі[аБіўke{ќW№XІY1N4oMЋѕГ`b§Њътлk=X^ХхБ=vсЮQdВЊЅ\лOЂюр
C.LРнВЕYBу[Ќ8њQўўыКgsЦuРЈAјyЖ.#Л!ЂЎАCРЯЂKtЩЮ{ЮtVwтиqЯЂЪсжqЋaSЄuџЯлѓ"U9%? (Ж68TБ}ЦaDжOa5a$йсм`бIџеД<§ЊюMWSО|и%юVіЩ}ўS,OxBS.ГF=`nОV}ЄйЪMU!..еjхYИTуМPТиќ3"­џ#,ЭIРђг~0ьќШCиРисnТжшђт<лОаH)­фMьњFєћ7юУ­uеђяЃA9\ш|цѕ}lZj ч[№ЗЄтё'ЄТ!_ЁИbінвЖ9Ч`е)ъє\иЇиeхШхя>}mVщЩkў&ЫбзlmЭЁ>Pє7Ѕ&KkG	і $VЮЊР|(dmwFђЏФ hИ@ОР3ђЖsw~{ху,Ѓ*УА8'ЉbЊК|InђэкFІ{2ЁdГ8z3ѓ\о§КЉцќ;=t-ЬЄШиqиqYѓЋцНфL\6МЙn<@вc_eл$0ВмњrdэяиЅкяЉ+vЖН}ЖЅоь'];Њy§ѕљБьy&!ющаsЫхФKхnшBеoїЧu%ЬОЈЧMК?ёBЃЁ+FЊџоФ;~<Zn:§яV fЁ=їpoюцhѕуCSDЮ$-м^Yhu­=^qєSoАЯІЯЧU8AзђГщѓѓзЃДАљЏq_ЭЄѕAомsъш ФХј=ш_Тїм"D-Њ Д'iј*aёьЂуP­0д[_тыїм#ѕёяцйЛМћJујТыrўJcНЖћр%A7.кзЪdуaЅW*4;Hщг3x_lYыД!zesМ& Ј5Eљ<ЯљђIНрjїњe§ђм-ykйIфVыPЅњ}ПЬІІ{л*жjiЇBоњfIBvќѕПРЕЌЪUччУ_џ§Б0w\d}j	6%;њ!ыfcМЩлЫ-[ЕїўјdбРoКЉyоt*P"стяњн4ьJG
фиЛ№ZЉI5m0ЦШLWЦЭеSЧc!ю5ёЅДЇЋъ<Oлшx!м:жСі:зOыъ]хэНЧ=4|ЏњЅ]#цC­(>iеDCБz№xЉaќжwdб;	@6іЏќsљХ§Щ
qЏ(ЮfJџш`оZ6я%ОњйО'ЃG\OУпХxкМ/Юw8ЬЪt2л!U|FЭз2#"тмHEхdЊvkFѕВьЪЛ#шоA*оЦЯШ[ ВѓјкDоx;СвцЉdРRХЋСZjеV5Kџъ	9>эщ!Chз*ЎaпY_
з9лP:4ш@NДЅ(.U@­ЎFEzлyЬСtGЩ}СTwЭCU\­i1;mE.=П1Q4ђH/v7%rцф-r:г{  ЇЊГЧ$уАєШЭУczvіК:БО@rqѓТО]Ю	Љ?	XЗ^cїЪOЄп#(Ѕ_9чєC9џДPЃ8ђм,"чЛBVc	ЂЪ P%oГёдьЭы8;З-ж4ЂЭlќjДЎeox]T§Ф` Hf--"чћjц&sМй4в&-л$bЩЄЧwЗ;'TѕCАКЅкДЪв­3kш
;эAДЪI&Lѓyї{:йcШЇ№ЌCитдЖlAqS|S$5KЩжёWE}чіkѕмXЛВaхЏsJmVШ_Xрn ЫNе§
9пЪ, ЛН|6Ў Бгѓр9nЅQчw #Уі6СhЗ№їcW6\п{{Й_жrрVњЅћjj-М[ЦпЕЖјОыZmЬPС;Ю+@E~7ЉгьщA,ЗжGЎО~јџh%>дфп78цђ§-jЛ
ўVbYX2{аПqЁ%45ѕZЬчз/Z?UКЗnМ!яДЩѕ?ђ5aЄЁћUPнђљХ>sж{дКАІь.ќЧK5ЎDоsЕ#ќ~ПIцtБlзиyЖfxvж{яwЧ.Б,яЪЬѓ^ZFЫЪЦ§Шkd
ПT?iєт*ђЪ=,тІ[RсђзYсaj,ШЅTvёE&ЮХ оO[!л9M,.ЊЈІBZ)ЈюmцВzѓ~ш}кAќжЦШЛ
\$Tr№ў]їUЈіШЋ\ч?1Оzn6^мЏзњїРшK?=&iЂ]Т5|Еџ ХЫъщ%{­ХЖэЛлЂNџVпyОЭГЮВїЊ	ЛMЃcG(ЇV/сh&л­ЗЦїООдљ?~kЃ?uGPњZХНОїin­єЪЃњp&V0_ўi16ЪОcXЗПнЁљZJЙ п^юПЩШЛш'ZJ&unqыA"hjџЎН1єAд= ZUP{ ЊЃфUhЁєЭі(цЂРгявNw`d)б;_\КІаЂ#<дh~я=Фzvщыч№.XЬесЎюZўќk#6БZЮПйЮчпgМкєпІЖхIN(ьPнЈЉЪZШd^хgА3RЋ_5ЪГуПНЖЭяЯ4p[nѕ{њГчбљeЯНPЧД$ MhEф`ы)тАLЩ|б:-јЎwNcxДџКiPЯрћДжcaМЯrюЭњ<ЈёhU-pQ фіЄ_­є`єяз ~я	.лYЯыЅЩ&№lР;Щ­P5[
@иљЦ 	=d*tcжk§{RБо%ЛrЗ§уГ/cгцGЈUО?#?yгВмL~АрЁ]сИыАB	иѓ@?*jиtУж0ђflВц§ЧФїчmжљњ=Ёо:ЋЫЉз Bы2<jж|ўK8dрЊп_HЇя_у Lr-ЪЎкѓ1оDћЊьeњМcdaЌ"knхћЄu7ъџ$^э +ыxF9з?ъ@_љ3p(ВбКкrМ/цOГ_џщ-тШi=ЩХоПДkЮэа4Ќџѓ5&7Taќ3
Њtq
gfhХљWgиdBЅЙ% Х \LЅLЉ2ЫшиЏзїЌ1Щћ8J!oxЊљ3`NgХ>s3ЭзFGьчїпWб|xe&х6"JISЖОFОЂщњтЦэбЏУЗюзэ+Ъto{rrЇе[ЅPu2ю}ШюЎ9{їбLзЫё&syWpп@іуЗ"і-ъhэо,pњ|RUY,K9аW>FJxKФїbm8лЧЦЎх^^бЙhЫЯбkђr/Ќрл=wG&ЉуFІЌљЕжд__b6KнnЇzВ/ўђк=:ЮмижжкыЮuњЃэ$л,`CЛNйТЇuшдЫ~=6Ќюа]*§у<dMoњ}лY9Ф0/ЋКЅ5ИЮР§$ГЪZЉТо`єБЌVC>а.lQ+ѕЇ8I~nЦіfЅ&Ђ+>оИЗDТЬ5ыЄ_НdЮМRЧј^\CкѓЂQЌЄ\ЇRRПeЩй{ЧїЂGЋѓоЏчЏyЗЛЅАЇбTЇтНйѕ(~ЕЦЎяdЬM`жеЌЇщЦШ	@wuYХѓСеиХpшЩыу14кЧcQdk7ПыwGЇвЪЏAжу.<fуЌnfлОRЯz>MJе^fЋчЛЪнг0НЇ§+mФeіЛ@ЂvвШЋ	eрgрВЭоSјЦUyбY[Цѓ:i7pћ|@ч-HЦ cФMтUВ]fОр§{sФwт:R"]gЖаwєлФ{sПЗ6]N}ЬUx'івЪж2М>ёЇѓЊиМЙвmђx?3вЎпРп39ч$ЈЂ@EЩЧжПмBoўilSOA fу^&eћгЇQВ*EДk6ђя~Ѓъ+$L>iztWqЖKУЧЏЖkКЏіDzй№ЇFЦ6ТЧЙъѕЅ0тД'J	iќ@м№dX+EЏЂYЁяp­ќwтc3ЪјFkЄД;|ђ№;LЫя"џ#ЉW\чј!	іtЖь(ЗяnЗWГЦА%nЧ|	%1xЮў§'wНўx=фќђP-зцц
6/D*јћХr &п.>ОятлOсІ}Кhа[n\йзn,гз]HЫ!гVлF_`ЖкЗlЉУoПќ nіАыoЪfйЃњ­д	р,($5qжM9:qgНxoMъ сbзюУЌZ"Е/эц;ђЕОWKа0~U'УRt2иqJє-пАД hVpръ&МЛі,Dлx< гАU"Q{TЩ	єs_йB	тВЛЧ{jp!]%`/бpсџ {|kЇмЮ*+<nеPЦЮ8D"х=[ЇQ0JИыў+DСї
ЙdоЈЅЙ_*УЎјЮsiЙзG"AЙжѕQТхяЯКм}Ѕщ>пЇ	БьШюжвцWоеьgЗ%Aкт*С4vщ6ић))Юi<mшЭ-.Н@ђсVУгВ!ёђњѓcy1Н5ЉПlhБУTсМлvМ)ЉЦxЩД_єЖНsРуњx5Mп­ыЭРЛ)Sк.к8oDоєLжђэN6(шѕУкЭSёkzХz є<мyгйt_ЫхйЦJ\иIяЙњтkJ25_сuД*КKЗбЊPрGH%o3gWkoпенЊЉ1g;ЙЌ3ечќМзгrіўЂу_љ*зЦ"ћаF'sЛцЂьЎJЂЈ"9љўВ[kЖКWэ=сЏпЁ
Ъ_,яАЉАП Ђ9еAaш' ЅcЯШе9riСєёоCv#WЫ>Uъ­д<ZЮЫЫАjьaeНХNCЇПќZ,c^ЖWКц;kЖ+Ц3а{ЗФwтІEКШ!ЅSлзЮђљkLз5Rј\Џ§­јЮ1DdП­њнuЕxћ<э12JДNTкЫф:m0cк-PЅ )дMѕuёиЌЗLріТ яу"Syё?MПyv§фzVтЊА,ј:\ди',Пђ'є5фxрмM9mАЕ&:X6TНпSdс2>uќ3х{№NМРyO8.ўjФuGЌш~ћВkЩB73љMe"Пc_ЗXlїщtcЫћФЫРTщkVyTСДП8К(ЌћFН]!CVЏcњtыЇЇвЉ?jlљrїпс(й­ зИЗ*`­ЮЃюtЕэШбЌsј(у§иязѓыZќRІo4OЫ~R5Пjoњ­ Gо6РqяS-ЈѕК
 *{ЂZЗbAЈ HћhаЋО6ъ6О?№<Н Чa<`^NМ,дс§8CЅХРvq	јађт;$Цз?Є"М(у^л2=sЧ{"gмc@­Ћл9у$пЧЗ5ћЉQ.WИQЄvЁv
acJаљAzСзИј(ЦРЅ*Ѕ&ўЃї^Л;РрUKuд7ЯZvЗД,ЂЏогХдЄ&;щDЖxQпш4њѓяpУе№ё[Uз)Cы	@Пя)v*яU­Д
§nіе%A}/СОѓ9уZгюф4љэ_хў	Њ@бaоdНъVџдОлYLПxЬљpxЪAxЫУwLєIУ1ВэЌC`Un^[ЏѓЊМxчЦИЎx2nТHж§7kАЅ6{ЗЅоИ3иЧЌГаеЬћЂхКюEър2КОzю<KвKlІиЧьF\wЉzИyэY8 љЅ7Zб4ЧyFБЊНЖqєZ&ЄЛj?љђЦBX\ЈDЃ
эnщЫq@h@Xw\чљd,нІ*й-lQ
Kp§+ш]m~tњ~&мщЮ,Aџљљ`П1rЯБ
ЅХ`ТTXЖO4_WВ_лIы=еЊъЖ_WЊ>DШKснђЮБчlѕ/јЋђќ\йФпЂЎОqIў;*FDбш_кжdwV{§0ddиџЯдёзFКR)OWЩ^њEХшМsЯЁ@Э,T[хj!ФЮр4U$зЭ]U.rЗжЧBНЬѓ§З3LvutUмі,Йэп=ю§зЭWТђд:{\tИПЭgWї№ќ&GvЗ -fј+цBB Йђ3ИлDЕБ|іЙ.{шжqЙDі&эЊщx{,ЭGѓCќxШCeЌcўODucѕРJ`пЏ=ЏЄR6	фЦАjЉщЉ;HВгТЎaњsZЎ&ы+r)3т#kALѓ:єь8Z6sЋg8
vO3чц#NOХ8Ж~жЪсьsз.ЖІЋorBr;юr{ШUZЬо\лМЗpёЁУЂЏЮvЮ)d4 "3mМEЫ'юІрA љРћМwBж;F2&дNгєxQн`?ЊXYЎ'ФZІ9ТУлROU­ОtЉ{ЌЅеџъЎцЖ ПВXєЭљяf­>Џ'F|
д§$9	*pN".^Ї04љI$КфђZVНCПЩЁоЈЯv[ТwtЎ=ЂвPФЎ5dФvЩhі:жаБзQи4П 	хВЩр2щрМ0ЇсN#|KрFчQ­@{ЊПнhлеБф!ѓЖј{ЈмфЛСш:wіsЭ!Хрi§шЈрD3$(fщФНЖc/­ЭЪђ'bЬЖ?уЛк/лЁ\:цЈУgнђu9VОІl$sYЙќ,fР}АCM7Н7@jМajqhAч
О\Hd]CgNЭд63ЪОT{RРЁ*ч=;"НЄ1є]јѓvўьТSFЎM!ђё§QЦо);јоYСУЦ/{Ўzѕ=ъ/>HdВ>''щАњѕјии №Ђ!2Г+i/Ц П$Й@=6ѕв'сі~јыИЁ>ZцГ}3*бXc_ч(ЬqГFв!hJеЩгlDД{єkFУкD)ТЬыЁМЃ\c#ЄЇtс	*љWѕсh5лхBIњhEИ'ф#mкћТФ;
>[Q~Г'p~Vсђu#ч<wЫm_~jsбЏДGюkc%( јгy|ђўЄEЯтЙG*'їоШДхЄ$щ4ЧSXK =7?&ыTДђ9йZЪб zа}6E1МњХШziЕt6RЇџц+лмhC$§ZЏв:ПЊўsq(Ї>Сє4РjDшнyэГ=<Я7й5ч&baХ2ЄgGлЗ­џибЂШ?є'/Џћ$s!rWXM+ЊЂОYяЃА[}!вЖ 
ИќyУЭЭmЎЮрkрЧы§ѕ|N(n]s5сIЯbшYщo#СЦЬЩxШOе7юk@.Gё$В&І5ЄnPн#r,ийїNPUрѕБ`ёѕ-§нqnћвЈ.HщaOZТШЎљєG+& гвLсъЦxZR!жQУ^ПСhЃЄgђ2gЫЁoцСУ*FЦФ?ћЈkФZ ѓСПfЫвїltЕ0Ѓбє84ы" W-7ѕbL2ЧбЄ]mЩѕЖмKхAFIіJиlжѕаrЦОRdЎ&8АлѓЄZGЈЛъ*тѕkђУЬ{Цuј=РОGцЯq=3Й9гEВ/ЕЬm?eВќіGТИ <Шu_ј{Ѕ%+яL")в$Fwе9Ў(/ЫРйІйnёfnkЪjЛxћM\ѕ5ЧћаЕSgvќVгM)	}ѕ(eиtп86РіE+Ъ=x8mєэЋВншKэ0Ѓд;ДFww`frуzХC]k~rџ{Л>њЕФХЄ/?њћ[Ш[тРqпЊ=ш)№ыкbsЧАhуйmфmпР ZгЛїЪМуRУОРNдеe<!3DЈw^VПњЯ*ЈІў] Зјц(Ъ9ЭЋыФwюсVБщтУ4§1ВЦЇъќ=F<]­eјЏ@5gџеLбГwГYќcПъй\2#юзL6UOаЃіЅiЕЬ<qXЈЏУУz3DiЬ`іЙ	ekс0B><Хьл	1щ,днЭЕбШVП?ЗъВt pзv\yQт\xУИ ЬъЛsъъ;Нн}Z3ЫЬ=ЉЗZх,ЌЋi\`Й-мч&t~ЫBчЪЫййю8фюFCF9вПѓѕЏRМЙбкуіщШ#naЎЭљ8 -aэ"ћў,ЋUЩ`ФNсyЩЯЇ?2gУ 	Hљ$ .sшЉb_hХ-БiвчГb1}хuёcљ;аWsХє2kщ+фyt%DќЖоЌђ:§5Оќ'7о%­ 7уѓмMl7jhФ|ъ^?.hЉ}р';Eр ,#fв"ЎеkЯАѕОН/[ЌN№ІСг5ЛYѕИ8Pэпѓџwѕ ЎЕУ,МYФЪжцbМрЏ^1b/їЧ-іr",oЕ я6Р (&фэbfdзKaъH}QЕUЕIe	ђеyHТ5Y	2Мвй6аЛиП8ЌHѓщ,ЪiКьIУЯЏлЫ=jnoЊѕmцcјЃDЉПCѓиэ\mЙYj9"ЧW]ћЛАєеhNІНІзЎ%Хёјeўw-kXЃrќftк	с(р7U@@uBOіЋSХdfNЬ5вХAјKв
ъ Ш/уєл_A ќi)ЇЪеАa№йQкApQП!ѓiРrЎљ{єЗ8ЄСCћыыЧhNSн#e{ЋrLЅFC^ьЁ.Џ}PќhM\оjўЯ@ДDzВ"фV>ЇИ:mќtI9Р*ФuѓЪџнRЙXSзВдiќѓѓ/Х3UРэІА;ZИСУ*ЅН9чм!пї61,іНxВ}HуJXi@А5+"К5ъд	ЫФњ/sбaqнX§В;JњіЈ )<9їwL§ФђЫаЯncаVжиЎЈSj! тЗfhБёгдЪvійКёIFоЂ\AбVёKи({4э№ЯЂяЮѓ0"Н§ё^ЏH[в/ЈЈхGс­шP"6ЙуЈБ$Љ;чЙСr№YЕБУЪЛRф5uf%TJЩ$8Ќ\ю4њпљ!)о?SВь4ф	г!аNкс$)(фѕУNe,Р#РЋНљЌuїКЛеУшу&ЙоЎМТ:Д*Ю@OJ.АЇў+GN
Нюэь9фХ|`019eо[щхR{јUOuлеcЉJіаЛBШlЁ/СFYlBb.ОоєшPЅKH)МЕвІPRтп0;Ш9Рgм8ЦC:O~ж§iOгђЫpbЅgY`*ыМiі3ц`8цфrЧ\:гhЏ2Іtч8Пъt$СХw pљёд r5СЊzE\ЌЌЇ o?ШљeРЇ^ё і	м TyIЙ4 єМI sЎП§,Ћжi(ђhrЎТс&9и-щЯr&У^cl9ЁKќmБ4Іь1*E"јKГЉvЃрмз0ЊёрфхЪќk2XvrW	иQ$ѓ;ЊuЌlUр+Љ#ггфЩЃ]oкВq<FwxXФЃХХт`|ИKUBЋz іvі2YWC:LР9mОhзбН@+убАE@ж2  kOn й(ВwAФЭТорТxЇ,8э}яRГ]ћЄknW
{_43P+Hд	ЛО'}x-ІШ+wMеsECоQh4ФнЛmp9aJ­!@в§CЩИЅуу:Гgіїџѕџ,ЅЩPFИOо9 Љъ/WАРС {U~Ьо&\ѓЛВyКoЎрЙ>
h%]K<oавdNІk№уUННиХ'ќЙюц`Zc*ЦђЉFЈёЮ0
t4rА^мэяъaїr\_­А$ў-Гоuд`ћ	ЯыqЙqќПв`фѓrзЎыJаїПњxЎС=!bN1ё ./дадCЉІaѕA")в8#oЉэє]LWЙте$ЈЋ­ЧВwVЩЗє шгоzи(ўIцС=В@8Ш'z ђѓИyўЅР7ўнy§ЊQќйqWм?mюЎГb\ьXy­>аFЩлІюЃNQђНЦ	ЌКЎIсьЎr!@sЌ{ZMavEн=г@ЩРк\џЫГn-(t(Ыrќ
Ю\№mѕKіb}8Шl№Eћ}мМNZѓсѕЪрЬ\$Ug]АMХ!§зў]RVZEщ{ВVfHГў
"RСY9ЃђvЊVT1m~еxpzЪА8їиўЈ~mчФ=(&з/[@hЫE	.9Гn;5тtђФ6ЬgЈkЗXVJ}c+ЮмЫ
fКІЎ IuOц-жxZЌ]#щ`NћyЃoыFgЎК№пtrдюyXШАП\Ў0ТЗiKИ-РGЁЩ7УІ8Л!ЖicSшGэ,>сЮзЃпл<ЧР§ЗPн_Э ГлОЎXэ6ЗжD
+кХш:ЉжMі5Д!LџЊфнЁ<ў2Ыџ^:Ќ5ќ/d§цСТFйЬЁБє]<)ИVXmіхoќ	Ж6a4ЎxыЗGЧЈЇhrz >НФЖdcђ%дcгАG3/AгgwH 0ЩЏyo:h
ПЁЁЙ6Eѓкжfpџ&дcI!SQ=o{ЗјuгQє§§§1?ёPяXHяoyxщИО ]Шу@zЁІ9ДУXИIк.дХХ@eRМ!мPдoџяџFћ_`ЈукуhЛѓgЛЄњќоН2МЗГc#DCв0щIQ#лaћNбшj*Ў-СWЗrJ(fщ§Weя=*2BjП:zй\(оiэЩЖrяnк>o/ЃПЂчПzjіФОІ:.эРGшQe.ЩдIкІЪTzчЄdxL-ў^Тx+~уN}Ш_ММјхs/P"ЈY§ќїВдчpяьФ#ШFз,ЊжВцвmЬ$рџZБЕ\OЖ,BfEЯ№)К}eШЛпwў8Nru@ѓћАёрЅљ VвВ Ифњg!by?ћzЭ№МCы{;§JГbZСяЬыС@VЙ>ReЖ\p$јJ бо*ед{!PЋЄ*т]ZыѕЁfЅяфЕHћiЕрHѕ:ЄзПb}ј§ЫgК[УОtЇюБUѕ}№?PРeЬЁєЌ>Э{bSЂg(м2#&0nѓhЄH1Ѕ?жћКнь[1кs^7RЪ?н\YlщPqpbиЙu[гЧљаЄЩЫЋ#џТptAЛ	ИзLьЮ]gJ7ЦДњ,wщxэGй>3|ЬО^Ж]sНћ<A~ёїWCыm ъ.ЋќЉxКЁоnзSљ.#VёoЌыlЉx.Ф:ыЊIlwq$ty7нЏж/мsЄЬaЎУh5JЧwФvA+ c.rEs\аеК
	ѓчєkI64ФёЪ#№@_РћKм)ИМj*г9Aкc\мђГbТEЖГU)0Cјo{SфдуЛЄМ]5Ћ?r_їОќ<оYзТђ:AѕЄиЬл.ђurЫ§c+§b*џдГaР7@4l,ЪBm9ЮХI%ђeяDМИ&vСрZр#dПЊЪЏџжN^gы0шKЏљSГ<.sМMаТU4jъl#6ПC7ЃP+ндџоЉ[АDКф !Ѕ#AeOУ
<Hб+1ТzЮЮ
oџOYЂъ7Ншt	EўЈЉЬ цUj^IЎєJЫпЖsъХЂ_дcщфгУH%Пчј!о)ЈPю!ЪHн=
эФЪ=hХђДюpёx#МЪEQгфTЭQzып\Яf'мєВЧЉЖGЇ~ЦwшЧыљg-ыqcхфњ dЫIЕq}~\E{M>ЩщЇhјБяЩ&QырЇ3Cw-6ьkцяыСqAТ\ѓџD_	MЫсЭ2ЄИгЪЖUўИФd(фpЈ0Cx­?Ъ+сЦ\КсѓIрБ(в1Ќє]ЊnмљЄчЉЏeЉїИЖпЉФLcЛ'Т:teP|№ЩРаCІТ+ХdВGV^7`Њf8yЪс~(шжЎuI(ЉЭA%х8г)пбфXцIЭEBіцѓ)[ЩЏc]NљvЩйЗQСхLїжrnoУ^ ЇOТЋг$J+§й?ђЈpобLZo*eђf(jБ #.1gЏD8 іпоЈЮЏяРчoрioЯ§ч.ЕkGЉB }jKЭ#47ьОM$bђЩаTZЧ'О'Hа?MєП%]iуh5"_ 8%Ћ ћ_<-цЁj
.ЛђHg_пеСъкзЅMi}§<я/ЈBЏю0NZЮ FНQ=jіљ>Iѓ<VгЋJщ0KWђАЯI:БЉФЅюT'б\ЁѕBщЦєњ9CёџЙЧЕlЎэЧ­пb.ЧзчIТМЬЫТЊчRЃЂўтrlЕК[ўпDMНжF'И%5§§ЙЇuP§єкvыщO>ѓЈћ~^Tт~Ё'ЬФpk+5Зp=ЧІЛЇa=zcі
гdlЂzШМЮЈ7!У7kGOъџэ&ьs1њЊQе@D-ЂЮиђвДЃ1Џ§IЋ У5J7~SN(№~sg^ё9оХо2Ќ%CЫС?*2Њc42хzB­Єkдъ'
`*ќ Пi!ЎТсЇcЕкVг#=6Њ`%Y{у,k0DаqpmЭѕѕњxN]#}љџЈКэE!6iм'бсЌ5щњcЯH<ЃihPЅ8ЪхJHF4+Cџ7vnЏОАЮц.	РjL>D/+Иeтgџ8V}eжФї-ЬЈQЕЎіпС§ПТZ>=овѓ0ЭД+1шБіBбЗc"дЄ"!#гтГуQ­мў
z9 C(#ЩЧ-$вЉєcd yw]ќMѕхљ9]Фsіцпfq4Rѓ~fгЬftxЯ(ПЂfК3q7,ЃЧэЇїр]Н?sќЩrјЬЖCД`йџћщљџ$%ЊљїђсqёЄЖ_џм_hрсЫ'УГqh/SњЩ-­en%9tГЭЊdDЕE4пЖжaщЂУewz;.ИС8	0xUrЕѓ+шжW^daJМ$pШ&$а| P$;[iСтЄzяЈQ,СbЙ^	IзВx=ЃcОtдiAЁGjRѕч ѕkHняЏЕ$Щ$ЬыlЋюзЏx	љаХџ)McPЂјЁ2ўЖZЋscCњuheЎџNpтпЫ2]ІGэЂ<	]/ѓ2њжш№NЌMРВ	
крЧђR§ Ѓ§FOЎѕ\lчЇgЗ,ѕї џх& ЇЯ~Йѓ КИ аOпlХягPнKK%hю:8Ў-=I	ќ/AаЊлтVгzЉOч>аџBСкУ!эч0Бэї)rТУ=Rc(н&RГьнd&§*Љ&?РФWм8О;њ	щщдЪLM0Ї$Љ+ВTЫhWЕўGxtмўШbr|лXіьlfnyНиИvмMЈ8џгэ`[вж­WEЬќЇК6beи|кш
@Ў6ЮѕЏjl<ќь0вOб`Дw_Я]дgёЖs=aUwИЩЉR<y-ѕЈmАќЁѕGЪ`VїOю1sйiwЉЪЧIЩWЮY)ЧФ}ы2N шМА­{.I1<ЏIbџЈЏНB	я71щ2сJ3 LЧшйяпN%!rи(ЂФЎтX)'н/а?ъ+ћшH§Аи6йСрмюБvM-bЏІЁ6tK"L,смЈ/ЂќV<ю<G=Rц/*ГФ]E К eiщLЌ{h~єРlGдJJЪЪЊЪгє$РDрЎі^erЖ{zБAў0eєЄџ'Ж?ЉовZtЙуНЖЏзпв'ыЕ0rцчњ:EъiъОёќ!ДяЬэПЉѓСVLyuDЩЖэЧqДцQSI4iуЯВз`Г;іKW@pН{0l$
ЄЁ1)bаЁ@ёѓkъ
єњ'OЂ7х]BBфеШiNЃРїa0ЋHЮђbќЩ-щh^ГfZx­'qBP(H­лF?SћVЁхЗ2рu )!жCJЂзЩ6ДЁ­гlЋ"hЪ{­J:јЄjїfБп:џс!єў.иЋњmБС eіЏ>"ЮЗ Ны<Ѓ<М~Л0Mi№е)i^[hэ­Bk![WDMрзoЦЈеmXКЧrзк_?њЩQ?"BOMћюi Вщ<1:}№
9)ъЃ!чЈЦcЉЦSЮб<ш7ЇnруіВдЪ2ГЛггSiyйcs!ыoЏњоћ7Ќ 5эЧ?ГКС#Q| Ъ!U>.YчzЫ.ЗјIC3VЉЏm!C~Ё]E2aМц')ЌVЭЧйвЭеК&r*ШЎи vэ`фi@\тѓ,ЇћёE:5рidїh/PЋѕЫV}нЬЂжЧљН§#o7С§Мq ЯњЋЄпџњпЂXп@qЉоѓtЮxќојЫНEKиLл]	j,(o§tаЛп AFУG/hхВvј~сOМ§zOяЇ<4Uи$ы;ъ!мл?с, Я)­9b{§ІQ}­ZмъйЃ6яyэјє={шxњкvђmfЌd[6sћћ	gsuF$ 4EaЗЦБИwћйЫњwAZtd)вoo?љй(xчH6W	`eЪ5(ЏЊK ( аЃimЮR6hЮwќiлМ 6(ЮЈi-)Л­ч=\TqНЛЪ-ЗуQ­ЄђЅd"ePЪП9C-іТџћ[1,&PЗ^ѓўR#ЧЛШlvрюиsЗП u\јTkт$DWёaЛ4№гxЉрР#аOLЖ+тmЯ~NяФ§l&9Oр7C3ќшeVVяЫWNМЗЈ6аш#y.]nЯO[шуh>Y@2еоvJwI щс\бhLIпwМ$ЉbЈ}у-ЯаЇrлд№Жн5zєўЉКVK­Y§u)/јЅT7f	ЬєТ§.1  ЇPщ ёїЦДр(ЮФBxjCЮi$ЁP RќЄD=ээtbkxs3'"XДчяь7щZСІ9RЄдуиgэeпч}]ЬeA#О<њT^P*JlВCИЊЬwІЖ?YXът`Ц+^ШЭ#кхмGтXЇKZИ/kчlГ4§єљ}ь:X9ъА6G'Fwj~}й6лсъй?Ѓo|ЎД 'У6_ZТўИ}Ї6ЎОѕ?ИнN2Ї4ўшШџ@1hЄoЫ2ьIЕ7ЋЈнЛo FТпPvЌ~-lЩWz,бN0ИMnў0uцЉ>6Ax]Z\AёsHfХЫZB=bb§Ц)rIЬ #cзs*щ'+kХ^ўѕ%Ћз)K=3ъП* rлjCyVЗіьеЖуcзџuъh':вЌJBЌY|BыбРЩ Kсr}oдТ9Dў?CљЗся}ийhѕ"Zpq§Ъу[u5vмЗиЮЄhШHоЪ9ЋтШiЭжПЁЦvЯtw}F(Еђ6=:M"G|Иj|Al!Х=Ј=ЛЦэdэumјOJ,&9{ІЈфЩЫ7ір8wBLgкЋkgСO>ЁЖlЮmЩcщІWи#h'ЧbпZЌКЈУfњЋ'-їоЕљBЏэЖ6Ццgџю>јљ­_ЈмО7"БnВ~Ч|vдіrПxЌЦЯ{O^ЙiC|EЂ"ЈП<Ф@;9ВЪkcжћћЅJz>ЦЁQgz`0DEЌs*Р'lГ$Ѕuq!xНфЩeЂvьДlрв;q`EУЉЙ7.o6љkЌГЙ&О	vЩЃ8ЏqПпп JЇ,A 9<2TN:Г№ТLЎяTђбТў9шVЗќyо7ЇЩ.іўUсав%гдБјх1xЦJі~Б $Щ=Р6Х@јi\#ЫВyrД­j]ЮwЎX(ї(tеьyъгЖшK7>WЙДX екА0	)G
 рJ 
6№YD8dѕwxПYшЇ\ІЃМTлЛжєсpqG№Ћг,ДsWгџzДа>еpbГ:зY}ЭЂЭ9І xIMНq	аЛvGпєд4.z>жк~}`{ѓQРгr>ЧИjцтjТЧІwЃйgKЇ/ЌК_HDщШ8>#ѓ
Eи|ЁРYoќ*к­жlю'+[ТqэЛжпЇxљс{iчОТЊ~зmRЅвљѓЁОюп ЯЭїзЌЎЁ_	+EI`nуДЂўvчO:ьЌQдэАgдиЪа6уg\ЮPMЊЮoш-YqжУuќ2Э0|ЏЩЦш>џќ5,4hT$ћ@ЄпЫЧс щ4OцhЧPsтЖЬл{dЧd+ЏќBПЪпэHе6{бхєнй%}йЏNјєЅУпрц №u?ЭЖe8ЌкщшdkГUgj
ѕкўЮq.т§жсGdЁUMvЄн|IаНа=ўnw$<ўђCNГ5ЁЗ+$DѕЯ%иЦП"&Z^ЛvЬxeвс9Ў{ЏП+H	Њу7кVЋ4`"S_БKCrumшДжpѓx1ЉНeы{MђjFpiНШДвьeЛп,tЊьjfгЭ?М<эЇn	>xћ?ьЩдпно622Љ&О4фrЭЊщ1!яћ[Xкщцez3­6Јy< L гПhu6ђiуЊЊ0+лNbъРФєв, ЎгvЎq<TТЙъб^Z>;дсv|rєзЖmDЁfFlв-Рi,ШцЊJFъtџЯq0ЬљЮУЖн=иУVђ№Ш5ѕ§Є
IУ$
:Mi УNhі\ 28ш2у5ьu)0o;­ћцVB0М4оіl8iчЌн,Z2ЈRm<џ@fЏ=ЎpЊ;. _m9гMЦ&ЄОФatЮ OdЃ?н^x[_95 \qЅиИ#0сZ^щгt4Ё:4О|ЯоО\ГлЖWtT]ПKjЪЈ#rЏѓћ­JНzaЦбз`*Цшi8Юq6юХfЈЗъLф%ІДЗРЙBelє8ъЧwЗ"Џ7ТѓІ$РЌABемcюEЛяPЩЭ4а=ЫvЌЗх	lСџЋ>ЉВсћўрRfbS]IgЋIЁm§ш*ух@{ЏЬGаеС яvлб=DwУ/WT8@FWEJКOUWЋ/Зk\-ЁЊѓAа6)Ц7pFќецВ80BЌд(DЈqМЪЩWM,TИђь'ф~bЂёhВ­<"СrV[5*ѕсб bњMЬгGЄTќ/e[ шRЭLР'FЂBhЊЂтo6йсrT76њ§Йк+Н+пЏцDУ]ЉХЂ+VjeoW%яЌ№хТ{Жcх-|}ѓІЁЁ*щЗц5WcњїЌR"4nЊщkЫРzyb"ЋёBм&=A-k:SU-єђAТо§ЭќKЭCЌ/Д.эи*ѕVoА$ЉO/Ц;ФљХЏЯЯY5]F{љo<=?љ!~r*ГЬ3Эpјџ {сU7PрМД2эr!y'7.}r%ў
b$mІyAЫ"P@ЊБMьзФ яFwZЩп,HЃЈиTSХгїњ7>Vэ%wGi9,щRЊћКсјпI}6ЊЂЈH[WТF.ўЮFvЗЇuшJр,юh:kЋу_еЎLЁo4вzњЩH%ЊК!?6Ћ нЎOЏвърЃц=8бЄ ЙA,Hy\ФЇТ~/lYdЏ7q{Эд{ЄЭa~СP}Ћ
Е7);LёFTJєfЕж|2Q}ЏїџtЬ2~IїёOы§З@й,Е+ўvIџе}3ЖЙП[ХњoD"nїЃСЧ|їЃБьфЏћyќ@ЈЈОИ8ј)
;*дю[ѓНЪОД І6бІњ'БL|дf~Ћ%{БgKЎгoьтуФ
|і%[о^iкWVДj:РД`TpND;Lz?^H]hФП<АD*ћVMИьiХИщрс&хr>,ИЋBгO}АuЧUЅК)ЕcЩ'ЇЌDОGlsГЛа7йmЁЯAiиQЌ­6дИджИшЗ,/њЉpт(VЛ$IОu§qХьфјщ0pP0=@­ўЊLM1У9ј`GgMУs\{dЎЗ|ѕZЯP5>Њc!ЋXІWвТї\єDБoуQЯпяжwљљ-IeЛћkЉ}*цaзW чpйфPЈГit(H7е:№3я^џDЖІ0уХЃS&їJmtСнЋkгЄ\wkyТIЏїЉuнЊRJ]р/G чЙLІcq:oБШ'oYsL4к1№"jmSo?'EУ9E/ЬГ]Изs)И}"у~ЂwЃRЅ0#бOР§mеф0ъПхД*ВЈgЖ$r3g
Р ЦIў	Ё?з\3тГ!бзrIьЎдЖђTrxZz(уНюшZIБ6h#*Р|&Yюљэvл[џЫgиLлU Ў<GЬр}јќњЗт7fъT\ь[2G4-АP иJРр	Ї|ДРЩEnфшЩја&znm|У/єьа'счKКшP,ЪтЉ)5
<vN#фsRфЩmЗV^ =Љюpш5 EАтhй)нЖћОoд<$W >ђ#+;ћа]^&Ѕщ"#9xI^y)ШтДLЕA+АыCОrљѕX_E!ид#ЇW+2bETaN/ЁO-`=NэZkІжFЇхч&іЮR :2 ZЙЉъТYЈ|hФRYщ~љЉHQЅЎDыжЃhaФР|џv јМVЄНЛAѕ§ѓуrі	IЄ.FcщAы,уФ-ЋВpЎОЅџOЅoрД<EХэFвz@ЮїЁG(с:xчЖЅ0­БІЅ­УО№	Mтч*
д-;АЌд@@L'ќ%ћTюMрнRo5йuзЅдАЬW]ф>щUД1sпчб6a_ЖMФЖж 8и?ж:7dy(TаHайР`ЂH	BnКЌ^dД]эSgао4%ђМBtqovъ0irН?6Љ\ П"`рi+#чЪ(.гTфш§q,k*~Oё:Ах	#вЙЈСЇБшгЯйџЧdEЩЁM?ШљЬYm\EЕІ>H*хУA\ОШЬЗКя/Њ%Иb(в\іВЯЊXfи/:y?Ѓ~шzщ№ЊcH} cOЄhЖ­Њ\оn#оFvE"r"§#ЦЭєb7A#мЮКЁXы7§ЪД$> Y2ЬѕNAЁРи_ЦтmњаИBПЩ6D*ПЖB_ђЧYkщРOLѕd!rQE6gђJEЌ"эЫfЖ>;їугa>яЯ/@ЁoUЈ$9ЇдпIцЯИ№хCD\Въсn:ћп4xмј9[КЯTЯlo>В}сўBgхФЩЁсВs9щЩђЄ;јШ#Cыd2[ЧТЉбЕцЉбттlГю}QЭL3FћЯ2ЂВYЬ@кPњ_w Ыyш№ЌСэТOсФќ/В[бTuMmл|zmЇАѓМEП1одPщ~$Ш
Ы{Р,ћlЈШрgYУNUptіРќБІ.ЦјД~jЏЬ`FЛfпtэD1me{њ<п nБУвЌѓ2ђе?і5NкO:Cj!MЎ і\ІЧѓе№cJйдЌщш7љ7LТХKчжІEъРшгМPХџ\R+ЪќBT
0KкBuw№eЎvє=)Љ­)Шd;WtО№SХЋ`mЯ#WnSъtЋyJХпsХћий~ЩТTl9dTCY%&ofвХ6ЁУЧ6ЗЛЯ.Й=џ­U7ГdкЂ0ћRQРkЋ­ЄВцIvLFчи\LЖzкCЩ ЪшLЅЈlLEme[нпЩщЩО<sЃ[Јўч:є~Щл­ъ%Е^ +дЃй9ЉѓчЦФСшсѓBш$xПЯяI­­5d7ыЂои/@ЧЭЌбЊѓ<{p|TДѕ|Љ$Ш%ѓф}rЮUЖивTn^nВoЫ*>УгЇкIUoNZ6хcPTkа6Iс~СИuRЩ~јИI[ёќЭ}РD0кjSу ШыїTMЉвйn*SC§8НCЇњ oѕвВчDЛБ-08Л г­6`8(Гн<3FWыT{gvЬЅ)ињ/яvw№щњьUН"ћ|(дrдGВЈьЮЅ ЛaPщ<ЩЄщї3jЮB<ьzлї9ђЎОаjЂЋ`ЗРвЗЌGO/NбЈеђ!U(ЙФGЄђљ5sэ}Эх0ќAчЎжZџwНК_a­4?юзДSг7бџ+ќг\­ТЁсКRiрЊd!Б*+-m2ёU4B'ѕФ.BВлш\єђ=кwбн}N9XЎШЛБSдgSФЌЙC­.Iц[ЅУ§9тИOГдkнЃЩўwўЯЩдYЬяЄf0%s`5kсXJhЃќДFйћa!Тв*щgЌ5UV: +8АІпЪП`ЃјљеtnЛЂ4oVбЩkКn.SРDіUb-	Чг5RџѕУУЛ~gѓђЙy5%оиЇZ&Нс	ш~-ЉxЬёVЁї32xЮgД{тЂ"ЏК;3тэ§7g|э/­ОЁГЇw*XЙ#џди,љтіМjJ\c­ш,ђД*т-1іђдиЋFEЬZЙбЦAW9с6цр
*ryhъђ	нdУ)њTДf|0G>(­&Ц-ЗrжШїJљвXпцА@ZжLЬJГb1VК jGDъќйсq.MczZв[T%e{*ЊЌQсДжO1ѕПЕЇЫ	l;	ТуўMtѕ	цZqыT жЕЅttЅ0`ОКmЮЏЮrЯ;Џ.ЋЦ@lћx}faСФЖНьwqюџџyјЬћV=ЋЮюѕ#с(#Oч	ПЕц d_UаъЋџ аЌ.
RЈэ"hWTNНv6экgЖЃЈ*6ZЦw){6JхЊєхПезхђ]ђп[^дGЯ&ёЦ53c7+_с1еUЕi	2ЋsЇќ­Я	ЊЉduЧЏCрeЅпщІUцТкеzЙi8ђZ?шКИOа№№CП-'uвІьPsBgWCўmЂЋ5мPpФ.њАћЦЪgнЇЎN9HЧћжцЙVзRпи~_^p.д-<Ў4Ў ЅІItуViХ%TA][ ІmTЁ ЇЕЏЫпЏЄ]gлџо­zb%m ТЫPќ;ЛЛСчLУр
ЏVyЉ&zh:уА*q;ЋJzіeTџrЃ+џmчЙЩкbщ[ђџ	-§ћqЦў5- ,#\ћџт
*§GR §O`~іiяШіЮbJ
lN­k?Ьц#Ецfдж6іжмVэџ`dхMя%OрйЯ%h>ыоЉќМчlfDrГББxЁ}ЂЁVЗКРШЏЧ+TЛV^А%ћ'Б~ЏPП7h_гљ=йюУuHНЗGПHыљ7њЕчТжЅлM9ЈЯKэ9V4l oбЗЇ	v_:оdbвЯmЇ9ЏЇ>\ўЭл<taЧPќЎ \№фЯ-Шђќ-AМ;рЩK>?ФЊЛCрЏEAзFЇЎg8 ЦyЧФ }-ђЯСўюhкЏъrЩИјЃЗлт
ЈџPхЊјbЄШџQ	TUлWзлГeпА}№)КDгjШЯёЖѕЏuиЃ
lјѕПDЧЖTJdјМ0OЁ	мЃэTУчбѓчгђtѕрвJкnі+љ @eЬЧ|?_о#gгЏ цФK#С	ІxkэAн|X~|cm@љ"!}ЄЭb'GЁXлСо]Лф,?ГtЯаcя^]gз ыnS№ТмGAжcа0QЎьљv§НзX;МA;O@
ѓ.3iDХІ~ЋI ,(СU Їќ]№џБЫщрХОfЕ sсZ_ж6cЎ}IЧщрГДзЬщn,ѕњn5= MEПкџЧaЌ 	rѕьDРGTqUф5TяjusY@FXHЯчкЃlWьY*x')
љГx[$|Jyя;1>ТНя№пЯЁ6XQЏkSВCT<`
вЦЂ№ЃЮUѓ3jјphьсѓdђхяm)§3\]RёЪїёVљЭb§ІёјК!s1&PЛфwwЋыџўa!РЕ)UDжЮPТа&c­Ф2Evul0iЦГ*@h69п§ЊqѕN`ѓ%Еђ}ЬЯѕвВ2Гbkь^	\7'м3ЯЦ'gф­ѕ,pГвд*bD+А/Є-Іpі'j6^ЖЉЫзЗgб' Ќ\ЭdpЭdдПБпPъgЪ§Ahюл2х8ђY-љlбАђч!ЎмшгАiКg>МоюНmZўGЁлжпN5rсvю<њОNУWЙ+яі3pКўЏБјcэТ#илЕКГfxцЩМ KРcЃўђлиЃU- khР+КЅТT"ЪЁ	ыk
MќѓЕЏo3ФіІ@QЊЪИћCnPпБlZЖхlxўш^жЗёё"Рј!ЏЊъ|0N!6Лд6ЁЬc1~Ќ`PЅ<| И_-І*AJ№N00FЯњ1ЂУ3ЦХQТ+ц6!ЯZUWm%эpъ'О{XУ9Њ М2sО4ЉQe*^_0fMM;ЖQЧЃЄNA6ОНя7<яЙkЉКП/\оuАФоЃМ=[исм~%Пh	"LRЛЯ:<4inоб7l8ДsIџI­)BЉ7HБ 1WвО^0//6щЖзUЦ	Мс-Aр/ $}ќГ{Ўo[б.рЎэscбИГmрJ2К3зwДQЪЈнИk+uоАБШЖж`ОdО^Ж1(l4gа^ф~ћygWеtУУќо9ьЭU^D­ШЮTZГU0~u%(СЬj1вщцбЖLЮфmјЊvд!ДЯя&Ђјў=СDєї,тюѓъhЌ-ВЊzvР-,1fёJЫhмOю]8G<nћKІVqIтn8њЮ`Ўі(SuфhFuДubЗЊъЮK цlъjШви*Р сxFЯиЪSMэHVМбОЯчCиІаБAа~ІЉоНђW%RI`ЎПKмzQрЏеonSyќSLњeюЛ/}фѕ§zn6/76Ћ[ZК4С]Й'щЂ)Э`ЗрЋBЄщ=M.vDzЃЪф/.Ў=4И4рЂЗ`пЁѓf1ГШЩІ_(ый-zэTњ$ЎkzQ,ѕ>9	Э0гeVX*S№JоoЙwU1Јevјjq:8Ww}ЦBЧЙNnTw_Л"V/Ощ)л|нгНZQ+\ЌИЈMЅ nWЮLІЉк&СU_жeгO,lsЯѕў4Щ4јЫЩХЄШwuТЬjЕjЌьЏЋз]u"q`ЏkNмфг§ГЮќfX@хaТее!ђєб]ЬНіЧ§wNхЁКЏ(СяятјѓЈСш~Е*jПjwЖў~{№З5GnI25Т*f5ЮЋгЙшПМ5`ееЄЄедѕО^;$|-є {=ДtЬ\5^іР6FXжG90fВтCuяТг;бSИ "WиXЪв4yP~ECЖЫЛЫfж%љ>Б;x$uЎХЪрВдпБлЁж<f_абТфєAJќмSA Љ Р:ЅњIВРС.kЕѓр^0ПЉЌc.ЄD%ZAЪj^єuХtГшЦEj]Оіu1шќтrєшb6ѕє§2dљЇw Вю<cњсНшПўђ фhY ЭявсЮ7НiНїЬ#ЎЁJсуNwXќzоЊ)щ9HіpkЏэїEВS$PэsX$Єџ*HЊц}69ёєBF{ЧЫїйриа)чђyљ/ДDхЕљsЧЊHёRЯЎ4ќѓ(jиО'ЬAџZёYL;љe2P*ЁЌH№ЛNБ	ЊJQy<n:ьѓљ)yтЁHЛ|KcЗ7^FTХћiяЖ*рmGљZw	ФОњ:5Qщ#ъhOmЌЕtЊj?x*"жЩпЮж,kгcAкэAXчГRcQTА%tЄЇйЩ%aшњd`PщW
мжoЄ @йbоSTБQ.dцЃd	&6Л^Б лч6&GЉAfїXЗДГE|ий­1'u$Ѕ!,ЙJД%УѕЖ@Жot'фхЛЗПЖ]0іJmXxж;cВЏЕIMљcАђщegябйvuwtО-ђкЬrzuнУњАRгДp4'ј/Б<ќаBЖчнЁ8ЋzDІr[yѕZЖРЎ:EќРTпаКЫ	Оbd
Љ)Т#pQXZEyёЭmp№_ЙрeTi/ыкн`Senn!r2бзIhМ$zэwџ§с0!нAkиЙ{ѓ6ПdгlТъ>шпд}єАJМEdЛъZЃпеф,аелT№>S?ъfрцѕьшЬє3М­qY7pА<GЖ|ЦF:П +ЖЭЮ6ZM>вzМЙA ИPYM# Шию0Ѓb=J?$\\mG!Ом:Ж=о,щЦокHшХєbSяЦ03Ц*Њѓ
  Щі§жvEcu,Щ7­iћkѓ183УЕ58	KўHИэ
хУ0}УЂE`Чirz§АKЄ7ЇгCY9!YђfНПтIХxяшЪ*зГMИФМjдя$ЁкЙ@тFєCИѓrљ*ЌЕ)SћиmЙF4#Pр"#P'щЂ~xЛђќТЄ=$|і~Дh?4пf2jђЃ|вфк
йфaрoXМћUљџьюиNFіѕ3іЉ\bI3З&8~кЦЧт.jўю?yЊвЗC@ї "яЯ5ny;ђўщ|]*эl KЁќaЎ+gI*Oњ=>DEЌдєPС%J<ЮG#7њ6ъ]іOХC-.\"wъ'ЌЉ{дЎ=0 A=oХзoїvЇ!cЃ%!ЉнШПbG;ОZНйUСz'Cљр'Г	;БшЫ1$ЮLЯПыАЂЎ6бёiвЮДт3>|їХСг+uР?aХЎhУаёLщжщврЖv0ѕцg	 Л:њРЩ)s$IЋП%ФЮc~яїqЇЌ^_ўЏЉгo%Лйъ8оЦтh8NДн]=HiaЌЦћ[е&sдЦ>oіђЙЂ=ѓйсMЅЎSIM%Х УКRfјЂ(АбАп_љш/ГЈLЦC-њбHћбхЕО}+lшЭжЄЄ9Ю*eL­i]8aо#ьяЭHЮD,`RшоWОџdVг]ЏPб#iЙУЏЃЂEМQ№ќ\Н^BбсЊИи/ш<?ХГЈvYВE=.^f)БзX(к'HД]Оs0qцkм\_gд*V}QbЙ%Aе-:=ќЄ(Aye_ѕKї4атXёю8бхPзяDЖъ%Ёѓ6КеNsQR'|ЂeВУЄ,_`яНЂЂ iJ)7eЎ1d$3еѓbњGљЏoК=єB|лдЅг­]
lюэp@vSWи_Ањ+6|Шfж3[Чr­ГT[UVѕ PЬd}е|@vT/CNlQ'РEЎЏh3ЃFЌa+*vшђБDww'>]ВЊфОЄб@ЮИиzh]': Vї&да=smє+ќP]јї|ТБi47ВHКЎЬ(ы?*ЕБЈХ,bеЃэ)3с.е"#oЪ№ Ўд<Zѓ2%!АУ` 
nьб.Vє,РЮЃЬГ#ї(RќЁ2Зk&Фj
@мmwЃЦ5б;nъМЗ0Zuq^љQрЈ#d&dЄ§ЧИЬ$ђ\iаfЦНNA@ tЮидД`UTшSвыцLFшxіR}rИ`RСЛР 	7y=yуgлrът Hw8НOHЩ'UППС"xјУ>=' %%kЅд6Кe;ѕЕѓЕJ(FД>тиlХИ7pZ AаршХ2хюRл|C{оЌш0аСD=8sПKM&zФ2{љт8+ТЖXмя!'CїЩабrNcЇЮУ:TЬ ЯqIЙS?FTV_ЪдИЄ @INЂѕщЗ}pvыњПgТtр-?M9Lmі­ј`-3)л[kxJ\џс1Щ-2bђтХV/)#ў)T[йNГ1џсСkYюЎ'хЃMяMFсEШYНв9~ЏfAcY`ЬЙюnX,BЧ]ПвЛљхшиC~ПAQ=(1g^б%Аы|Лs2њ3РяЯВcQР#c4дRG!~ъ>ПHKе\YЌ88иЌоБић к4њтљ7жuг§ZЯxе~dиђЁ.wоtёоL@7ЪwЪйhЌяЃ=mQЊZПЬХђAwКnмCГ7ITЅђдїVаXАКійьI\[gюЇеЦЄіудбЃА^чВіњtDГѕp№ВLl1ўlBљурЂЂбЈВі82C|bKјЯШh+/qфм,ЧўSFo9'SяRм;џ@a9=s%9ЗAChАI%ќЕT,?юHвE6!	PxНОMЏѕ<Ђ`_АЋaТ&P|q јСєЩ+3нІРЧшu^ян&sьЇФвЅўM№ЃVЏ*HГE$іЪHШ~Ў"зx]ПЬ`ГФпъ_]-њ}РЭЪ№f)­ЕqнЯхЕ6LЕG%sї"L OБоV`(к?'meє.ZОЕx1 uнаНбMєk /аТЦ/bЃЃaWЙeСЪцтЪШЧQz'CIњ#ХLХІk  C[-8яЗ@ј;eк|РsЫ0ѓVx.еШqмйCцz]мКmqт3ІRЎвЊнРіџЬrt7&q	9А}	ЄД5ЈБе{Ч#ѕѓaшeлЙЭ:шIћ(ђДVС$OWтЂ4"мбXьъКбо§УЗuтp=ќЏЙџXkєє?Љ|)Пцёѓ/імќ*БюЮ:є|пжKi7i.ЉЦ)ШфкІѕуmЭ8 XђЅюэ Щxц[РнГІn eTOЉ|'ІаTM<4*fЧКГiVjJУПgIЗЧ~АЯЎЯёAуЌfЯъз3З3з_{|:йaMRџKќъњ~<|J"E: K:џџГwыnџ§/И0	ИqБHV$ьњК4Є$­F Ри/xћI­а3eч­~&@w№lскЦUлO5Э*яdДцЃfJBF$я­LъVВ0ЅяXaFйаІвlг;eКIЭЗTёПКMsNpo_IZ4TхРH+3щ.UpЂЛаДИлwъЌћ)адЌАћ"МгQКЫћьљ+Й цџ^кШўctю|І`^
.Aпџ*тфх{ъЕЧCА>hоhы#ЕУубyзQСe3хџyаRќрiџVGьzBe­ЉЗщЋЎлє"Я	bF~бвњIІхЯщЯ>съy2'Rћнћу\жцaWЮАтqKмИLЉЃhJq\љ`wоn'зћуШМTЭхІЭРЇ]ЈG ЋdvшGІ%M(IcГr8ЖР`бЊѓэйўѕЛШЯїЖ
a!FFЋѕЕ$іWATбЈ§(гЅK^E^?$&ПQА<ХцОQТbз №ч&OїьjМN\ЫiќpЏa?ЊNГ,ќвm+т^0Qк6сТ§),pНe(_їХNЕ9ЏжВaјжJzюАФ,q Lк+ГЦWѓK>х+ИIжФвИй&Юы%щвиmЖћD8;ЁжЦDЫЄЪ>ЈkНAЛЉХu.j
2qЁ$ЙяШOЮФюЧfсіQv№eGкДгуБhВЬWaтїUаZgСk#фtйэl9ЮПіzsЫўE]Вж
x<Щи<ЙC ёЖОњмзTfк2ЇOѓяrэ8vіyеЅЎЭA4њњ^fЮуgXj(QРLіOЗя57пvSiR+БIкtpOьіFЎ №щPб[аПЗзьГX	ny&њ_ааA%kЁўСХћ1FІZ[ўг_­ќ}§ЕiУЪёWЧ(RЁa'ЛlИ]№ВGђьQЪCnІъ_Ь&EFMіЙ§Z]ПN, Ќ6(орGфЛБЇЊ8ѕХ8w3 ЕЈ1|Рњ=.^tН§BR5тЉйєдpФйЩйЪ; paКЂPАќiN"ЬjA|{эЏ:ъ4Б6<ю{Aй vШPЌазЮIxГлЩ7-::z№Ютxрњи1/цъ№Ё-оyя=њЮЋањїMГУyщl R`i
ьОч]r(JлNЂXќuFЎFі0ц{ђНHCоЭ8MDЁPe JэСсѓМіUр%иbS\Юх­Љ_§ЧpгКB&(nѓCЊyтoаќЗЛввHQфu WpІ#cВњэ№R#]MЌ;1z9GчjжЋkп3Ѓ8zГ.ТЎQщhс0ЖЕ{8OўgQ0eюw~om[АнgNgЋЎtХЖе	,чBqчG 7иhу[ЫsЁLшz9N8T2яџш]|rх&6HWkЧЏЄІKPК_Ч[O4=ЬоіфиЁ)мИ3МўK8dYИёЊ=LKуЉA2dїЫъК_Ў/:\_ВЫнl{йЖ|GрЛdМ+MB§рОцW№УЗ>@6Фє}CуnУ9Qkdн,џЙ.­6ю-aaq	ѕzнkђkJТіє9М<GО\6тxw$ЏНљ!VжДdw-zX;П_б~0љ!Ѓ~Ўнщ&:№гћЦpxjЉT:ђ*l:%]ОyaЁЯб­B.#зgёГ_}Џ?wv"1{ќ4RdЧDчtБNрЩ-r­jtАЋ*,ЧF!у V[У//Юсз^Сб(MHo$Ic@tw9вdХ<Б1СшrY,,­тНKЗ0s ѓЇ{nмЎNiдDЁb+GФП_rЅVжj_ZCНб"­@юUГE$ЉiяЫтєЬЬ­ЕёіХxћН82}G&єЂYn вm$5IВ#У<iхjя~t3ћЧQ№лwщoЃHWьЋхY"G8ћЊуxuШхѓxцфzќ,оЙp/Піs,-ЏрьLч$ве&0СjGж$7р2yњИнjтњн\М|OЫ!СгфэјЊэЁo75ЦtФЗыi	,O[LЅГТПyёќЇ?љ#хRxџТE4je?иБLќs<GїЌжъЈд2Ёё§ЫГDЌe!vs]ќDКyЗџzbКюУ'kМж$B|Т@вЄ+ьD
Я~щe?ўлџќџјртЧ8wіaњZZДkБРяј2lI>еjЫЉ>Й~OфsB<лvАgE-^лz%ѕ4ё;M 4wИAK\.ШcсiПњџGЇїуЃO?ЫVСЏ7СќЧфОіfЃo.cmm­F[;
#аyыУѕз ЛXЖзE§ НI.дЬдќХ}ЅБЎ\П)пiћ=%Сc№c;#ппjдБXnтцн%ДZ­=щJЁo=э$ўL5ШВ6ќy;2?џцD6цчФЅВ§Ю)у'љ=ЧI Q-Ѓ\ocvЉZН*ae%bШёыНp-vН2#;9ЏjЉшгЕzO{џюХчq{vzIбgAмl6jфVЙЭ&fX]­X7nќДcbwdщл6Й№ыЏтbyUYђ_ЮЄѓЋ>ЌVPLЙЯfIОњмcxчOqmv'ёмЊfлЏСъLOiжЫ_+`iЅтј8ЩЫьYeєкю!ЁћсБЃ#иy_==[|6џ/РmsтБ,S<%оюzсJЅZг`,H­VCЋйќпЎDЏ­њтЎѓ`с	u7ьоB;оятDуЩу3xњќ_ђГъњuM.veзHsЋM"HЭVЋ§QkX\ЌhЙ{D#ыЦЏ?Д#ЅЛ}\Ќ№)№4ЫW=/ћыЕвЉъІ,рёM.VCОЖXЩЁV­Ђб яЫd$c?Р?>^бRХп/бV$9FЖоZ2ЭФlёx5Ш<xќ<1љЅ&KYВ$йєАГ;жЄk-хj$дй-ГDFБдaкщt^ЕсеqокуJЩ	эйЧЦђЪЊєА	БнКЫDEЖbшU2
Vє#?Ш%"оP7ЬXл<^2Tnf?ЦѓiИ­6R)ыd9кAЄV­
љ$yи"ЫHКБ":еDБ­ћaнHE~ншлЕћJE)AЙНИ&Ё\љгєм"Hв$ТTF4HШbв&ввЛЇЃМ:ДaЄDКыАЂѕp&я6L.MczџЎёз@тФ#7dЕЖ&xЩЈ3ч0еМjAЖПКояyНЦlpдтvђьNёѕЄпm "3}]WЎЭ!KФ`вDЌџЬ tzLІдьє~ѓ­ЂТ<(ї%?A.,Wм $Рc9rМОdв	аl&#\ЌAXДцшФPЄЛzтЗ}ПLф%UJKќъ[љКл	љ$rmњјєГL>wён)нCoиеbBIEqLЮ&
GШЧ
z;О!лЋе`їЋ{Yt7^MDmв бЌ/ўoЅиЉЋaќЃn№
nќЂХ­f78­
4y3бu
2­.+/CщЃ`@LGИ№43%:	q]ЅЩІдГЄз+?Б"=&Цџї\`#;РHѕ5Џ"§7џЃЭаюЃN№0vЏ4шщVgzЂ1[ОЯќ§ЕFCF qЫNAЂыe#ЅпнБ|o§yќэё#4Еућх"ыТм5=eъл+дрЋjН,	u.yсЛRќ~KсЙѓM!4eIЭ5П}ЗЁ# жэ(s :kwЧIR­ЫСчЖ]RЙ~8E9J&,z%mЫїJY§а_е jA:uaж<цэhaћG|рзЪUЏў.?	ЌОЇ2ут~%Ќ(Gо1Ј5QЂи&ћпKг3ЬaѓћЬd[ЋTeк"4ejЃы5cA,чњZHYmђ7ќСЊAОHПRЧэј~EЌBЗеМп3dюОў5YJЕj­ёBAЌїpO[фЄa2CVм+NАsпЛ-ж@CнЂижqqбЇФщжф-ыЖМЄPШЫ6ЗеХ%%ЉdcєљДЉIK.OwИVЫЯБбjоpБК,:syБ­о*[Гў Њd&?YЖ"^жМLWgХ]Вi$ ЖгЉФYA\UщлО_&ЊGI&A5o№ОщєDЇ.оїБщчnЯ-z;@ќpoSНяDЉDЄk!эДШrdљ'ЛXLЧAЌisу8еDБWб~f!*иЗІТ_Й~ccљ\ДЗГѕ`ЮфШ2ф%гiйXХУuцzЋSjАќУЌjвs7ЛЯ\ЕМZЦнљ{ШЮрaееjCrѕFћy3"cVI$Ng}иaчя ўvЕ YюоэЛ	№>НzГ\6ЕЕДзВ8ч9ёћІЖлШиM$ШzЄ3iOЄлё:2ц§ЮpАѕЩsя­pзЈуhyHtN№юО_бСеысvЗЋ_Нџ}6ОѕрьљЅkЗШ*$б$ЋБJсїsoњиD	і"	uШE&b,k`ъйФВajwLI84сHe,Mы<|мо%ШТvyeхjUмЩтИ,_яФwrxtЪЯИЁў^тEя9ПЛ*hзиш^лIзяЮa~qSSАRЎЁ\ЉЪ,6ІЇЇс&ђVмЌ<ВdaвiЈlрЌhЫэoЫЗ	№)иЇП}wпюалГsєvK+Ћ2ыЛїxq&G8jФBy|,|.ћ&phj?Тсщ8~d:lfъuЬM'cЩ8o>WнЈ>К$ФУМjMц^э@abц"жB.C._@2
GиHпЅ&eІЦyJ­ї/~Hю2ЎоИ-ЎLnrЂ&qьшѓЇЂЇвIЩ'№Њ5ВИэЩmЫшЗпћЏНё6Ц9"Ш~ћЩѓтyыбжЗТhsu§Нр<Цїк;(јwXZZE\ЎdТЦЁЃЧсИMЌ
YВљМь^ч ЫlљбТбЛBьЋ_јф^ѓј№у+ђdВrја4Ю?vmJЃАНAаa	Й	зЫc§(cёфlt*ЏёйЕxщџОлгЖеiЙBIІЧW7ї7wRsѕйѕ[ф6eЌiмМvGЌџЇ:<Ђ1GnlЁ|aLў./џ?ьBЂpD=,:\IйС\јј3МњЃТієCтрС§ЇїE;№!oЗPgОWpУнйЊьmЇЕќp"~Єщ`ІSYШх:4}@jоКsЏоьЌc6nИЬEzДдФD{mЌцШМ;П"щЅеВИlЙN;7=sVmДG]Њxѓqdsв!)YЏ0шФЋуFirю-уЛЏќ?{ч&Ш}њЪѓПЩ§ћD`WыM,ѓ&&"FЛхv2Э|xХuЗdGЙпннеrlЏBЖх
ВЅiJТЎ-VcjjєЩ$кє@A)H$тлнG№ПЧк§щUqз*фт]Оz+Ы+8ИЧOеЊ!gжШВd066NWt~gwГxdt2СAцШв;я]Фџњю?ЂFыЙgПуЧЕ`§QЋ5dlыVo7ІЗ гђЙй7ш@Ќ7'Сkу§|З:ЌбlЩ,мЈЦ`ЗlЌЋТбІЎzЌuVџL![ЇЋЄ;ю-о ЧПxщfgчx%}фќ~ЙіDађDётѓМф>,?,Н+g%v.ж(	qо9юиxѕуџПWpфшўегOJйgЁ9ѓд.YU№ID:o-БlYЋх
]5	хЪcnхYN;]-г!kк]pot|я\,YЇF#jЋх*.]Л{K+8zxЇЯAОЎнщfL
уEБ$щЈн2њё5*>фќї?ќ	^~хu<vўј­ѓє
о ?~YfжКоЭ	BfСџМЖ§ЭMЫЋU9 |ЙўTvГ?0!Аpуч6"_фъЬТМќe&:WIќ?rъ	Њ њу") 4YBБ4Aк#\эцsЫ0я№{X|hS$ўщ'ярхxЯ<§8Ю=zЫkX%ЫQ'LfзХцЮ-њ'L\ЌЌVe&ЛSЎ?Њc]§рФшGuяЩ%шеb1!O qо№wђZЕЪђЊ.iфY"Шsо#B0)eзшЁ-ЗУ	ЮSќтEs<іи?wЋИGsсMT7Н|оЧr3втвЊ#АЖeѕдPEEvДЯЃ?9ЂїЎKєљг§Н#97УпYЏеАЦ}ц­§Н	$Si
ф8jL­ЕЛЊZЁЛ"шћжї^Хђбzтq,-%$УoЫпд$.э	pѓЮ1ИО]ЃрћћЛP}aКVї%SФzCЫБб}цH?[kЊRЦhvЇ8[юr{(ЃNwnpЎрћЏ§ЫtИПўЕPЅУЮсl4aљB зкїveЅ{+ВI+3жЯК>љнnTЄhНЋ$Њ1B)n"ћlУсжњ4МAvЪAs№Іxб6KFБњП\Бkuѕж,оњефДИЗfчНo!|Fpљ][жЙПЗ,ZCcЃлєСј?лсщЮiпе;ЄСЃК<ЌhmiК{-s,X=УBбщюC%Ь=№ж/.ШЈGЮУЮЁ\Рб&+Яr\­;;П$Vзnў:#њёVtFЗПaКФ|И3ФrќЁrюІS#Ї5ZЌ84`зbeu>КГ"k"Wiэu5у7A
-)іЛ5wOЖ/й#ъ"EмЈ.є; Іkеѓ8СьEгЃMF*вЪи[ИлфR}щѓrрљ
~(ЯХaЗЊ\ЉуінEЏЏOtj#їЊлЂt[Оaо>п}ББЂџЮ6'+ЊQОe|rхЦЧ
RXѕW>{4tфн]к(;PѕkЛ"UЛ	ББж%дЃdъ9=:Љr/є!}ic*\ПyGЊ\Љ$ж*kђЪhVЮxsр-Бэ0|ЛqИv#б ыОПЏщж Сч8iiќuiЎС@Fѓ|сgeЗ]o}шиѓwю"NЫHNЎъX+ђL
&ѓОфЮ]я\^в#Оћ#вuЗBd"Єеь(жp>в;^o"C ЎВН|m{4]\FЅк№З17ЪУЪх%VИаЦЯ}ЃXFТЦЗХI~>(ДъВ0Сћжzk#~$л_pлљF/:YqH"XtиЙ-їЛmЎ$Г|aЮuUKЋkИЗМц[ЗOF<њБлe1Ь§"R},FЏЖZ№uЦx=#Y"ЕЫu9єHКЩCяbAЇЛЯUWЦлt%X^УЄЯ-Ў­Вт>"МшВ
н.XoCmtк;7hхK%$ИЬзЇYЩћ§-Чє!4§[уA>Шѕ Ды4)0Єџ-ЌЌHOюЧиfФ0§aК4бКHXзHCoС&7S8r§Ќ|ЌTk-ШБј`:ЄTЕВЗјчXXZы>ИыuLxсp§HеЅезЅїmт.ЦЙљё	иэVЌ]~cЛ]Њўyd83МќЊЛП4!3jйЄ№№7іяФХхJ$jеэmf1ЂЛ@?bмЏЌdc"ё fЃвО§(MРЉмNШHQ;сEЙњчqVv]ю5t=\оОV^>Мн\ОRЎvіtDBЎ[бб&ЖНп№ЗV
§Ш]ЊЇ'SRCв­HG2NH+\ћ9кWь2Ьяq++k2§{CИћ'"ZшЃ5zGHФ*Њ5ЂF`0]х$aјЗ'Ђ)Д]<ЊчРСiЈ/ IП+O`ч!г<CZЖЎaоЯ\ИЏTФФxsѓ(Mxл]ЙЫнe~З&ыыc=њх3КЌњ%*рЛе*езЊUфѓ9>yљ2R­ЄЦЦЮхLedГСш ИБЌ8ЌЁЧћј8яОw'O)$Ђ=$зЉъ№оDЈж&ђЁпБ^Џe;qњL?LЌмAий\9КИuvзЦєьAЎ$ЂAи:і!Щf_КrSfяJFн
м)з?шngѕ@№y?о=/ЗwnЧВАQ}юQ>СяцђbZUўgЮaЌXГz]ж3greЩхEЄ[2ЧЊAF2сЯГо8<3ЇoОћ>&ЩЭтIюWqk6ЎИE7,њьvюы-дdЫС'>}a/_Eк­"CФр0/їxsЌі*!AdHѓ?\Єјмчёёgз№ю`H^jѕ§и8ь{baќD`ЃAФm X,тиCч/`-_AЊ]&1ББ		Эц;б+wPФеjос{N\ж"9ќёяEJлy C*iKNDjт­}.ѕVмvtFOЅю}Ш!ЇЭ&*хВИoРCч"Ѕ+ШИedѓrГ%"MQДsХЈЛX#PeЪ+^`ѓПяўуыв<ХknЏЕ;36OјѕфQбнћѓIc­СфрLЭH#7>	Л2Dѕ.RФlЎ(SЅIoDЈП\sЏѕMХ3>"uиМађшiќып§јў?Н)і\6jЕ*глmІеуmІ3L4RхvЖNМн8["Yу'Q(1XK$Шћ<Фr)иzфѓcЄ;2ВФзўyиYбiц/gзПётW№ж//тђЛ"$y2ЁjАmiА
ЩЬЭЕап№ўьЮ^vЃ8юѕГУ?є%ь:iЛUНrжdѕSq!џћБ1	ыђо чБwkЧsУд5ђ№ Rq_џђ8rщ
>Мt'IФ{ЛF­5в
ьyOЊ7щнѕCЗЎп<еѕђЪ@ЦЧЧШMкtaТЙф&еWWЩbTAвIВМWфѓуBЖо`i{o7ЦгХ=HЈзqpцЁpdц >Л~wVQm6tR0DVЃzЕ*dоJУ§l7звХЁyД'ќLf
вCЮлdyЂ][гXAТ1ВЩ­Ќ_і\NJIјчЕзlусy4мЉЧЏр:W1;П(#JmЊFмв9РМCl=кмщзnХ!Hj.Рj7шу:вvШDЂсеTeХR№[ўЫvlПзУХ$xЮХхgЬм;Юк8|(ЌGЊщт!ЭVэfSЪBИ|E8ПыoтsЎИSN|хёЉДЬЩMЅ2ЕЁ91ш;'­Пў,гН(ЦеАYЯ/ЬЫуиэВЩJв+>wѕ11ЭLчf&NЩf[гЮ(Й
эE`АHоОuЎ$fёяxёC\ІіJФХkCЯ.v%:хњљ7ЌЫъ№ЖNy+-џ9xб0[8ТaG~ЈЕG^хќЭНыmрЧкt=лю=qіь=R+dSћЭ"Ўk`ВюеR-Шzh-B1LФ5ўKbg%vAl\,ХчrVтЇAT*FZЭЋb@EКBЁ"Н[x+УЭЯJEКzXmщ
Х№tе 
ХPiЫІ&DБЕГЂDЁPвqщ,ЉщV(6GЯаXЄоh4ъl§S(ю/jёЦѕэIQRщuј}КєцЂ?xTЬ]К.аuЎ{t;*4Atхш k?]EКђўчuFЎ
]KtЭгЕьмAэbџUЁFзZрvэJА@1
Н9+uџу
иALі'tU§ЋОѕаЉЫ~	ЮKн?+­AkнВ uџ­ѕшЂIZЫФ ЎџжRr(ЖpfЂНNо?XЁj :БC1ЊаBЁQ( 
DЁP(JB	ЂP(A
%BЁQ(JB	ЂP(A
%BЁQ( 
DЁP(JB	ЂP( 
DЁP(Jb№Я СoЁ
xY0p    IENDЎB`    PNG

   IHDR   K   K   8Nzъ   gAMA  ЏШ7щ   tEXtSoftware Adobe ImageReadyqЩe<  qIDATxкь|ы$зuпЙЗ^]еящїЮЮc_\qIЫЁ)-Ч(	Ъ?ђ=A$Ш§%y 9Ји"M4Щ]ЎHqCфюrѓъю~еЛъжЭ9ЗЊ{fIEYivЕcРН[3§ЈюЎње9Пѓ;;LJ	u{Иџ+ўІфЭНnJ%FУўПxљхрдЊВ^ЋяKЖкэСЪњЦnoo`ІЛМrvПxG#hЮДРї<ЕЭЮЭСh4пї ^oBиРѓЁй$aЏЫgWЁV­Тѕ7^Гыk0y0ьІi0яПsћ6шКKK№С{яЧчK	лћ==\ќLЦЮ.ўёПќW,Ципї=їKЎчk-,ќцNgos0{aЄC?Б+хФq э$нСїєqЛл}0Рщ0јi>єяSпйёGљ,+уdZцFЅRЭжж7D{va`GQХq
шБІжиѓЫmЃYаырЛ%d§§ЎЩlЄb0шї;EсштF`n!hЛБ=М?BЬ2іщі АBАDJУм@w8дЃRЎTxЕVe4d&Ѕ,Ы9УвLМЎ#@2ЄiЊу6c0оir!.5vїїщ#$p=О{їneЧЬЛлщlл!0їpлG vћЛxПZ+Y/ШOицQ<XbЂСHE&DЅ) >AёBIeExIС9Ы2ЅЉ[ЛZ~УћЉLSќ)Lm;K4K,8Хпimч%rP'кOoо",в4DџЃИ7sEУ4ЂKxПч_уяВ'	жфІрРуШшЎЄ{
)zЌ^& t5єJм$ГRЩ6б"љєэјЄІщјK$kУЗpКh:Н/IФ$FъKdХ"Ц'J%LhDїuЁЋEIк2ћb,afoЗѓ=МH?}ЂЅLJЊЬяY<oХ)ГрI#Щd<і%ЉMO`FUFРЊ_љsТо'dИ+CwмааћKвBУзарЂU&Ъc|JЭЛW(bЅiцsЎСЕЌUf?Ъ;бКr'Mz^вСEыцD\SPЩ+кљM+мU fњЅвї JЭ63<шЉ,U_х<№D	>З#kbDUL>№ъвНXб9@BVdЭ№5Хr &Ш?ГтпА|WlЂиhЏт
IЉЂуБOаВшXи4Щш`ЩЃ2/мЇ{&ХЧHЪ(TЅПІѕ	ы*Ж$љЉчљh[Pd)XqѓРЖЌ(ўяаЧ|0Ыrг§ЙсЩёЧDD%Ш_zўо	(*(L\яHBqйбыЪ!З(мв9MSомf'љ1eЂ§Oь3uе,?iсT№Ф'PАЯІСђчPqрѓХОєXёд1k< ЇЇю:"ХDљTЅNЖ'jYlИн:љIЙЗefлЃыF	#МдйІ1|IэРЪвWHRMЈЯ!№xРЫL@ШЦ P}Й }ФщбIСЂФdюzъ Рд'Dз7ЕK%M7|в0"()ЊIЪЫPSCд5зЫLF"BајС)мя)ЧЁNЂiЦГмэи#ЅЌGр90йDWMx5WY9kмпмjCsfggХђЪ SД%љio0aшL3x54ы]E(ЦHH>J_.)ь#В/T0ф\yrC+Ц"ѓцщІрЙютэлЗkTrљЕgUЅос0<шveІ­їЈ4Pу]ВЅSvЄNђSz>%vczІ-ЂАЯ№Ќ,ILи]цБpЪ'OXъYqP2H2X<z<YФёт~З[љќч?kkk~vѓжЧёx4жPmшэQЇ(o\WњЎ-QyKУ2SЩКнЎy§­kЅJЕZZЗЭъ0э Y+is@QЩ`РsЖ?Ъ$ищАЌќшЄЉbrКЊеRiЎчy/љЫPEkкокЪюнлL=ЯгМXЃй`ЕZ9{Ђ0зѕЅвBрQЄћ^:Ж9Гэяяё;wя~}ЕеlpЫ)u№Ћє,Ы&IBnU Й,$ШгУYJrKф"ЈZкф^Оtљ2щёюOоEы8У4ѕKO]dЫgeSэQ=|RСЦcWіzr0ш4ѓvЛуV2tт8С§w8bуlЃщq|дLЃьTшЌiТЋ
RхrЅRСћёўю^м?ь~ђГk+|ey	Еђ7]xфfTђБ CзTIЦЮY`­йІмйоўС4t./ЏъFRмяожі[7?ъѕFiSЇЄZSQ;)&эZQ|rBbY	C!XЅR­губHbє3т4сыgЕv{%aЎчCюFТЇeфќ&ЮL,bВ.Р РЮЎ,hhК$йЭn&a@ГеЇбrЛВпUЦw9	ШcЪРrx:К;YQ)Ш]YUЩЖЯѕdf>7зжЈ
уЧ&!h@ЩЂhЫE5;*}(ЛР-cєрM~ўТЦМўжѕxoO658с .ЦQjdЉzJf=ЪN?)aЉT>"ы2ЉEпsЕ(NxЙ\тяшfQ§RМђфvъDјOiЬT'ЅJ с{F#Ѕ}ЬжзWНэе?џшъ[o(hrЕa§9|:ЩЙA<њ~(?)VљяLjюЩЊX
В&F[Q-EсЄ	n)ZJ\2ЈфтГђ!RЯ t}п!иЦЦЊ)іСћdЛ;А^ЏЁ6QгйL{Ц$2АЈEІІ2zF*t	Щ]ЯЫЂш$hЊЇЌБЃX5qAJ	N[8fС&сKЫKSZQф%JЅЦFУQ[щWідўTaM7P6!deqЃqєЂЄёN|ь>еЪ	$ВЫДЉQ"Е HЅB"-ЄEЊ+нz`лІVЧЈyОтїд~-№мdќ(лaЊDН=>ЮЪ?
hXxКHѕ~*"`hS Ё+КЎЋЌ  )їТs5O`e9З@ћ9`TуАзщBЃкB9gё №ш	Ї\Fы6ѓLх;ПШіЃсkEaАcN­TT9LCЈ н/№Tщј7т2Mз (ќaЪSqdIЋR:,Ц-B$Щ!ФіЏел,ћ2лq2М0е$ѕ<џ_anXzбHx-mљћPеl8W[A8яЂ$[XEM-ЯїЮКБН#Чn ђёJЅzM)7

ШwHВПx ЌЕЅљС?ї!4>ј{|мЋ"ОaЅИnмlJ=ЁGжЩrУ"LЯPЈHтxЬдшG#шЅ}hИмXЎЛЂZKЄђюН-0K%VЎ8цdаэ`gЇsГ-%RДШ4ЂР@ФQщЧ fяОtДц&$zВе0ч§ЏвEб,УLlЫўx\14IVфзЇDЩtЦ№*2ЬыЉёv|4МeНWЁТK0tG#їЬД[дIшuv!ayqЭинэЪ eЙЌ'cш"иk@gљ>юCP>Хдш љГ	d=EfXЅuSMБGW*=йЌеЩѓНjoаЁ"aЄHgы%НpkД	6ЗрЌГ%s,чv{Ажф{cXZмЯ>їu>XЗ(wѕ2ыШwх;A  <ЕixAф<^R-czЯ`Qr]з%fQІЃЁ5dЇГM'>4ТЈ#/Гi§]Х%ъ>ы6DкћУлаlЬBЫЊСјАубч<W}аiРx8bїDЄB+аtuЈњmXIj`dhBЧШЬfZc№ЃDЧHiІ[8X^щРtеЁшRбyЊ!5Ouf*е­^ЙШЬн5S­aRя:G'НсПГЛП§пF+д`ѓю]ИsѓЛxЪeC~+;TXєЌЊ@­ГyNPwLд0ѕ|6CОуa!$АwэЁeх Tr уb*ЬІЕЁЪ1љД.г6б}ѓцЌPщdl:eјјў}XXѕ@ЗLPeUrC8Їd:R@5хОИfгapаHЏбФж+ЅEЧ"ЭЄІ<P]ы
OРаt0бкlмцPI>ъoAo8g}Э:t{ј№ўXХФy$щЯtн !ЇЦIЮб}EљH Кdq"NЊ0
6	'щ хДЫњЄYQуц*s2&M72ИtО иSёш ЃSвСБMIѓnВZЕмоmфa$lТs_ј\т(Ъ<lvaьјI\ЅщT<$Р4ѕ[ѕтxnЙT]ЮѓШЉрM'BјwC	шЈ­dFњЃ/ыЭ:TкdJq{xа#дLКЄ@Ї(з*l>ЗoпйVZЕ2ИоЦ1ес`(1ЙЦ,[­-Т}lгн%MЈJ E-ЌdTЁ/Ыг"c с;уІiqвЃ"рqЦIрXІ>вѕV1єЉ2ъ
Д&'dljP2,РДyц
яоЛ=Ј6jЌйЁfц!ЌIќ6п]љЦ,gaглNp љMщ`ВЌ"Ћц9$ЅDxa,MЭhЇGСMh5?ЁqХ:GџјvШъахЁшќeBЩЖ0,Э<їмgйэ[wхжЮЖ}_І<lаї9ЇБ­,ФЗ"%jЊГАPjС=ПТЃ#}ЪЁAh5є`Ѓ'вЉбAtТи)pCI+"ЁФyВmоЙs(ъ"б-tоЅІ"8ЊЄШ<С\Ђрьь&Р&ъЊ1ЙcЕЯмм<Ч^^ЪcдemїЕДжЊKАjИ ЙsEЂcф9q=$LІКШІS4ЇЅR*ЊaКdmqfюиZЭСЋnWоР*ЅR	Ј"ЗГRв(]G@НDъ5SsюаhгIюУцУЙЪИммPеWпwUHvGczЂ%ЁzхЇЌ,яH3Ps?xMo8v}тцЂ5Y(ѕњ#З*ЅDф=UЛRбМзz4ееmЗЉИћkEIJ<>ФeЌЅpGv 03L=FqЁFмv*Н|єQUtxqуЈТ1A>Єгї\?љшЃ@=>]YUцGaR~)б-ЃЦОUqАЎърFb?XУ$/"xTЌзрЇОьHФ vC+C
ЈћЙ(fьБv{\`БЂјW45МPко`ьбВўєG(яУLЃжЅЋ%9дБ	СМsЬL\ovvdВLк'cЏЬЫеШgєН{лЊPUЅ/JdлRG1РішJ4BM<jр5Э/'Я4ЋчAb ќЏќ gi№|ЁёйБmrш&JѓlЛЄRб&ВJКщSмU~жнпЇЊGжХ|ЯcЕf{ц(шsјЄ'AО=ЩВВђ ЎjjЄQ5DЦtУ3fv(czѓнoгЈ LNнoR5=>VЉN" ўЃP­7K*yf=O`iЄоKnоЛq$ZЏЧ1$ЕЖWP+Ь4їЦOмdМOњ~арtГмХo-,ЬbЮЗџљ?ў'иойZХVWќHбЪЛвtAСў( нTышеЈємlЕфц{b<зуNgТРч­љхОІq
:LсЄFJO
еy4Н>FІЂ аKѕйЮЭ{;нХх3№kW>пћЮwсзоРDЙхВѓ @г*мв CIR=Q3іfъмлоћн}БгэТццІ9іѕњЬ[mЖ\ЯЕlКDьчћзфb§џBчЩж[АЩвмаьцН_}~§ЯЬ>џЕЏУЕЋoТћ7ў|ёK_5еБё<OMвфљ/*Ъќр5з,fшi]zю(лEКsчьv:fЅRaTmаtk8ПМоj?G)M?5ўџ№3іРЌХУX ~BЫЂХДrБ ЄXрЄRXIќЅыVН}яхзол;ГВЖЗфџјоhsѓЦљѓчйќќ<бНlлAщЩ7ц{I j'cЙw#ўnvи?Зnнв§ вЎ<§XФїНvѕПМ~ЁіHGРU#PE9GмЇMIЄЩј[зЎ,Ѓpцёc,бфmМЋ9]=WЈ
!MnЯЏ^мщuЖТЋoМ>яT*Мжl%вDoОўІЛъ%ъђЫОЌ"LЈ5яц>ЙU­Vјзџ*дыUxёзGхцмi9ЈZRmк}bБ;*8АOИYёїПћпсЉПіы*кJтIуzUІШJ''ЅЖЃХ,3CjгgцЯєЫЕзЙwsсюЧЗjmЇ\L]ёс`ЏќЩIЉјЮХh6iх+WрмЙu№У_нмю:хjаT2_+УTгУG@@ДЉ"эУјухЌЌЈЪМюFу+x2М{LЇp!C~КtющЭЪaЗКЗuЗЙuяNэыКщК!1?Є)75я&)Ђ2kыбиЏМіцШeЗ\Љ"ШcТaHыЪ,*ЂЌ?ќсРSW.ЋЧОzJЮа:iВ8Gс)s6qGu?Џ^ъдМАЪ5љќгAc8(ћћUoдЗР7в$жhПМ Ћц pk|8}_хTуЃгЂ(}BHQИм2XСIъ(8LЂi\рЅ?{Y­дU%|ІXTg?,oaRNШу rеѕIZPЙЗ5кУzsnyЦД CFVС5ЃfЭtZYЪhщАњвТg%nД@ЯЇ*д%хяоИЁH
cћEиРЂЋ3ёВжиHiЊфBYdђСе`TнЬdE Sфћ!x)4OыёЙО­3љТ,NMzЌЈE]МНУђ0SЉFKsFWІEіЉэmЉцдІДіv2NhYRЗfc:kAb	дz$Ў Ы}e9љHбФ=Ї_ЇЎC].rUЎРЬІДя!%Ќ юуГвыRЉ]ХЩRе#`Z]ыaP№~ЏјTQЗXћ+шюhZе44c0ъ­жgЦ)ЅQ%?JЦaњ1-Є/ЪT@pу4%Љ6+4Ых0yTў АТА	ЇЮД0IVЫѓП"imq^Ќ6хкLyЉ?Я~ўs2уЃМыqхlў7ЗџPзL`ЉeUdљhFТ(r§ ЙA4
Ђ8SеjШй"/ђ|ёдxОјч%8jїБ#Bщ"оbЇcћчквХбђЙЌf4_C_d	тbf8:nv)юzуTѕіXШПѓ_ў§П§хѕЅеѕчVџNcfіЫVЅбРHж!J$Kqf^Ц?ЙОчњїв*С:SЧЋ"Eн<+fи'ЋйDJљчБьВАМтЯLє(КuVЧпјj?9Х'S<>ы2Ю8w#G­уЛю(љy4v2GЭBЕ'л)пљніOivюї/|ё0?;їзЯЌm|cёЬк7gкѓ_ F*$њЫ iЯЄi~уёh|иКУQ8tCь)qNcНZLFЧ'гrПuгhЦјЏMюp6qa
<оЉіGU8yдMЧя№ЙnI<ЧеTпўНпѓКу@Й\п§жЗЎ]^ОњєЦк?ЏЗfZЫK+s}§ќ7WжОкjЯ3Juhа]K(<gу8 9wЏwpрvіzaЗпЈўEЋуhЅ&52tІ ZWюoЙ#Њ8* РdVеjђП
бъХМ8yЎLTъ#ЯF,ХwЖ#СOЫ)Њ7QщјП~џћЊS*йрe№Юw^:чл?hДf~pqufэKgжзџіЦЙKп\Y[џ­цЬlЅa6Ё='Ъkыke*'ннЮОЗлэљ§QЈьу	Њ}Q	GђщhyДtMl>j`фЬрЋ#,KІG/^џqFЂѕБ&в~ZДЃ0K Ф,,Яї#јУ?љоЭХХзWзўSqЅХхЯm\МјѕѓњњтГЯеыЈеъlnnОzўТ*-hrЧЃЄз;pЗ;{оооAt8ђ?Bъс:7І	VH	vlЁЁ".>Y!>тсvГ$эуо+o]Ы,У эqц`ЧзсШщcЮђбm:r'т8jТ=ЕќўшОR}eЉ=ћOъЦЪккЙпМјдSпX?wщoЭ/-­8:TЊucnaЙyщЉДЙ"ѕnwМЕЛчяwЂЁШDвњjЮнРљхжВШ" ЦУ@bћ,x\оЋoП-Tі!ЌЕ@Uи#ЗEрЎОј"Ь..*Ћc(ШBЯнќ?ўУo_КЖђm^6љЙі3ыПrсЉЫпX[Пјэй9ЋжhAЕжДЮиWIкўAпыьэЁхэћно0aЏTFЁbhЙюG{Љ`Bпg ћЏ^Л&штIj0ўъР:fJ#)}ЅMGШe?xч]Ацл>ьья§xыў§ПівўЛZmЃЁ}ютЅЫЯ_МќєзVVЏ hPm:ЌкhV№qхГяќЄ?пyытЪХЩЦYz(@wЏПѓШGx1xЇЌQў)ЕI)З:ўьПЭчрЌe7жЛћёЭnўє§^ју0Tт7V7~утgЎ|§мЫП5ПД<g;0б_h';їТћюuдRУ$ICiоЕЋWSUdќзз=AА~69hlZЃE-џїоџ fЪeЈжыP/q9ѕ>|ћњСзЏПљ-г2ЊѓЫЯn\МєK§Zпп ПqуныЗ^§ѓ§н0пC.Ы2]ѓ_уzќXuЪРњй5"Y	*§пнМuеЈ `jуоююk[[ЏНєтџЂQm­ЭЭЖпонў&ЭћVb	ѕЮл?чПє ФЉыgжЮиQGO3txухЋ07;Ейkе*єкюnюьўK7MJ>Ѓ /оМzCЊ­Ѓ2Э/и_А~ѕЉeЪmu*KУOоћ [3РjЕTмп6ЅcжѓZћ	nџW ѕ&0н&    IENDЎB` PNG

   IHDR   Ш   Ш   ­XЎ   gAMA  ЏШ7щ   tEXtSoftware Adobe ImageReadyqЩe<  џIDATxкьНI$Kr&ІfОХkeVННћѕm(Ф"ђDў^x&oМRxф!OO3<ё@p(Ђбн Ц ЗъїjЫЊ\c_ЭЈЊfцnюU§ьЊїВQБxxDиgЊ.
­5ь/ћЫўВћ"їСўВПьВПь/{ь/ћЫ ћЫўВШўВПьВПь/пјKјM<Љщн]ыoЅdY§ў УмммzI<њЗџыџЗY^ќW>њh5K|ј|8M{Но4мсБцQ­њ§ў*U8>8?ЛOЎЋЊЬ~ёгІaAG ёu^$Ѓ~эВ(реЫBр§0ЏtP%\<xїЁFТ`8фsџђё/ё~їў;NbpzvЦ/№5~ўџСМ>.Цзясy|єЩ'|UU№w§cp!љ(љ1|і-|\oџСџРЯЮoгѓpі№Q§і§;Г+тcшѕOсЛпџОёПџoџО>бxє§чѕї№oўјхbєyХјК§~ўг?њзјљў?ўџ'xёќ9$јYЦQОЯбxЏ.^№{{џюПџо_МсрѕwёУўOвЭцsќвП§/џш_џЋљbёљ&MЏfЫХЅж*И-ќ:DШ*Ib-\­VRгyq{sуТJуЄЗB.№М.ё:Уы^/ёњ§ћ)^ГюИ/ќ]ёћЫо№N^џ№_тџwНУеbqp}}}Їi\Ѕ@ѕzRVeхrЕОї?КH­eў-qS|Г1^ХТЌTQfA'!<Ф'
eЙ&`нннЉ8в@9Т`;ьЏS<ЗkД/ѓ<џ-ШK]UЏа0\уѕ*бJјвєЂ*EЛѕўВШoѕВ\.h§ЏУбЫ;H}Фe>G4Ey^ШЊвhйУ.^nўЏuwцYІpЯiЇЧ-у8QИјёeЅТЉE!TаkB\сCёГ)Jе+Ђ%.ДМдЋЂ:Я#оT!Ј"Уз[рЩЂ[ЇnUІЎѓљ"ЯЩЗ ёY!<^зтЕ9оЖ`ГћИШWП(Ѕ}Tш6хQdwі0ўNЗKUЉЄЂВЊФФшУђУЫ"ЏЏ(4.U^Иѓ/
ёTx41	ќЅ9 вВ('&C№ы6"ыkџ#|ј?АOЅC4D+ШЅУ№xN№*ЪЂ[Љ@я(ёpH#ЊMЉЋ%wч3Ы6щѕfЕК	Т t/`Ё+,№ЅnёяЌЋ"j§RнЄОTЊj6наМШ-[DИXqэИRc UўpWу-*B@а1§йUyQjDFЗL+GЧ#wTHЪ	C Њ4.t(QKЈЩЦ}Ь=шЙЬЉв0n№!rЭpTtЂJDјb'јјSМMdEЌ7ЗпОY:YрћKбeK7ыЭj.юж7WWKьхIЗА?Џ+сБ1 а2сЯU#љќhЯо'Ў|BBDлunАaўРХЩјб!Ђѕ]еІ~рANA#(
9dv~-ЭЂбДxшoAQ*ХрЄ;ј~>HРЋAw!цѓBFјШЃзц.ЫЃ4GІаkNXTt`: §EFА ЧѓcP№я	НЇЌ*MU|њоЁЖ*ЋU;FёђљѓOeШpI	3'С%ђГЛ,M!кю№VUYMё|Ше,щЊB`Ћ=ю#IЄгВерUtгЙЭ<^л_лЯЗxЁ5яnb@џ ЖЄЙsАhбofsBлeЂ0K@xxну6ЇgЯOзчр,!YќЉh
_)uєк*4Rl№зXЃ)в1zЄ\е.~:B+ _чГйlЯ='уЃkJ!ю%:$EшuОМшѕЏ№MЭёэЬё Kќв_{ў&ЊЮ КOьаZzйО63КСnЌYЂ~ЛShћ,rПhTМљ+Э 	Q2 _ЩЭТ}:фПШЅ"VbPbИHGЦ)ЖxфV!pxш/ХБ(KPЮцDџhо Л``-§ћm"пVлТXNВPјcф>Њ*Ё*rЗJЌ7ѓрціVќтчП CЎ№ЈЌ№sY(UЮвЭцvЙ\.~єџЯU nѓ<Ыю№3Y№uчј1,{§ўЬ}AяcФюIвuЫ2АuаўъЏілч|pшЦиНVэЦPуЈоЪЩ&м	ілzeіТр^ЌdЂNдWА DMHџ"oбАетD+;?c<'2gdr#ЦR6ЈІХМЫ@Ж tХЫ7ДїйАAЂ[ЭмMЁкUЅ!лS_Ўg3Рs:RВЊdКЩФпќэпx.9>)>-Э6щjЙZЏЎЪюnџЭ"щ%ќююnonЛТsт9RАaЪ;!=@ОFЇЬюЎEЉџанЧuovЩдFЈfД oо#`~Cё_Хј!#B&КGРб*ыАAh|;IЫ$ПvёЃBvКА'С Тн> :Y!
NпKМ("GtQ%A{bзК=j|Йц7~_ЏЙXu7+і!ёЁn]Ј#ЖЊJїЧcтSТEbќyHVЪљ&еrИ.I$IYфEЎVeywлџђёу­WЋџЗШosСЗџ
]Ђ§АNЃЄnGxЌсБ+Чx4\FлP39bДqЛчєИРXР!-НэЂ5ЯПё=ІmРН`УЮtxрqo%(J lђЂ`RІh6ХЕ%r8tУC1аuН(їy(ЛЧЭB9уk|бфvвыpВ\Э04%:ГA	tЯdfеl~Ћ#tгQЙЮоХњёЁaЏЕЛЩxDEзМХ.nvЖШjGюЭ ЏСlDЧ5Драрnі7аћDхЮAьxж*	Д<Y# ц'їjJS(СCЛ;КjюќрrBфМUBN1*HуUNRЇГqЫ/ДђTкмKсХcщr1^Џ#|n4:8(жyU@ю)СПDыox.пqьеГКsія>-i/РњОциД МЭ1X+t+ЧvФЌ}nЏ_СЯЋgK НDsH?Эѓ$ЙhС'РAl@3&"dЈ№ JВ>ФЪ8	EЩгЬв!e№gВ ЪX tыайz=о,ЂЬЄззQ+МM~5ѓПШox_с7ЂъзУ|оѕTн
z	P^бXЊ<qж~зZ№а*Z+Й-bЉ|k'эsпuxЧМчiа5 lЂ(ЌШn6Ёт­%%fЅRЋ Єѓ<Ѓ\}P9%QuЗxжЫе(пlQЏЇћЩH1/SяШНс КЕ
vј_^ЎЃЃдЂ;жу7&4&abіarЙpЧfeQъј­А!W!ЗйД#n~ШКkЊZ._m1uкцљё}бnаТ УZ],З!hkЩ_DЂя$а&xEюѕ{6C<ѓ"ќ0Тg_<юOЫBQD$Э№Ѕї$gоxМшітћЭЌHw!6SКEі]$иўTvѓ"CЋаoDи)єыђ#6ЉюGІw,~?sXЧ}+аZє>ЈjяjћёоћЊЁр~у5ьюw-&6&кегDОjgЃквЪ:іТoIз5Г­}я\wЌоЕУrкCШЎсj+цPoАб'*?ёјfq­д5зўR­и№№\ нАЎця-уоЛqiЏЦsЊп]ьўБмуm­vMdлСXGUЛmd,goЮ&зb*7лvїОг{бЏНIьыюr­р5ѓюЋkГД­зкyLі­xaWuЌМ	hЋ"ъАђ(№РБiг-ЯQь 8KрЌще+fг.ОфЙeіu§їKipЅд&ъІu6kЏwКЉbwНЃЋЫ*^НjІ[ЗЕdД.VwЛc2ГхнХў) DМwY.]Ђmм­эx\;АбъPнАUмЋaУЩКCв[ШГжтИУљмFлжпЊvГђ:и`ы|шю&ДШлDwыі\ЊњMЂW]ф'лЙэВЭ>CХщТJ0­+gfЋkЃ]ѕImТн^єsьDЅлюЂ[мfЇW~ эЄыЄ\\o=пСЉБ,Њ.АЫц<<ыІЧО.Љn}яsuПТМњзs5lWьnanэhWсОkу-bЙ Ђ94TUД$J
д hvSњxW [§эhыRВVП!%IоЪЁ(нЭиU+ѕ`^`ї|sЗ?ЃUГщзСЅ}nжЪRК3uожqщкт8/Ћ!Т~bЗЮвES|Л1к3ѓЛПў6 ІЌJuБ%:;Иі\5A%PЦН"Ю7t`ЃЛФлЌќDЛоВ> }'ЫАЛEПmprЛ№Y{жF9РАб5љУ!`ЪlTы5ыь ЖчRЇH54фоМKЇх6аO{GiЩнДЎщvнцпЛхq§:7ЩFsLB­,{Ё~ИјpD \Еюф+Ж сGМЅ[vqЅ*vрpiZз{oA:M*ZзЏ[ЃІ=7s;псНШ;ѓ~eюђkЉvНжіг^ш$Т=k`ТЅhCЈФЩ,њtЋ@HъСRТFOf§<ШЎPt+!^­X'ѕсHiуј9?Wй}чаuѕыж бq~ЂxГМШлЫ,јV	ЦЏЗ_<ЂcfЪТІZЊ}B эЮUхr4u5#mйДъhч_л(oѓmY+аЭJпЈt*Ut'Ь.ЩЫьHЮы&тeѓ­K_u>U?ќЌm<[8 з}bХz[QЌ!иЦ1аЛРa+QmEP­ts,Лvg­iEкЧЁЩ -лv\Eah0УС6aжneЧAЗH^pЋЈUMАіKNјЗ+­ZУ[мЎjлКoYнtuжIFаЏЩхТ>Qјu_ѓЙwЧW ЅwУ{t`зaК$лђсЪР""4liгgn8uаѕщѓИИПExЫP5%р2шКћШЊhћZюXі8uОiКєк$$Лщ{еНЗ бЏ'Ъэѕe+`_K^оьus#­ЧПљСыЄXЗЬ(ёfЋLЙI66:~йzьѓЃZКUЏх_ЛЎ]UТѕћ1Ѕ'5(:Ѕ-5РT;ћОe9wјoяљјfЛX;ТВЏЁюoXР;ВдлmЕЗyEЧ3ѓЙh:оуь_ЎB._hиХЅ:ЎЄБ.)л!й -'Ћн_пdЙЛЎ!8смЮкBkтм,­ЛЈ;tsПЪ­Wxй=@о'qЅя-JлєДяе]KЃЛ аЗAяpYРѓ№\ЧЉ
VaШ ФХOt\JќЕY1ІP+pъ,Ц`ЗъЪш14жЃ]ъН)#qРl[а~5Ў;'JспдЂЈКОyп[аэnєBuаОXёш~5пшц^џЏ~_ГФ7ЊuУ т8юaГМ)Ъ	Э2NЗX7J-dфBqпЊѓOЪ&ьAЗxcЩBqM}К_ф^cI{c ]cХwwз]5аќш­Ўw'Tд `Ў^ћAюПЦяпѕWээj­пшІйШ&]Й1ФI/ЃDPc8-vrhcЋ н:І^з%qVэlvЬJ
"VЊэGя+GрЄFJmЊО:ЙаvђO5nRmNaЃ_5LФКkKх}.Л1їфsІЅp+Зл ћХЙнЇјz"-Жю Їџa! ЈйсЗCеnїљMFPK ЙУѓxvDsя7и^wQзhPV1 ЬЂTЪ*AYЙ*)ШgЄT_Ї"кN_ЗхЙPлaп/Е7э№ѕЎ}ПXМяјјІvv*­|ЏЗI:Wљ}А§ХoLag9ЙчУы0т~/іzНGHЋжdnx§34lЃMРе!TЯыЂ$HrІlKЌ)gз]S;З№ZDдDJTqQ§Њ,r<n
"иx![л_тЛ[КХОfVце-об+ЯтКaGМЃ&zўЉU{ќBМэЏ`ЛЄП"й}фжю@њНYМCЫхцv*вtЎзIМj<щ(йаФ&цыКИqЋї4б1HЌдHХ;_7ЬQх/ЁдгўА_Y\хY]Ж%:x){^Њra0еnЗ­љжЁZbпнJ[ ЯГ[ЊжZи[o
PDзЩкеvуГЛ*ИлvШжџAПзыУ12фјњцV^\\7ЗwAY$~dѓИмт?љєЃќсУѓъ1+nbѕлkыу	ФЩ@ЗKIBЫz;ПЙQ:{4()ђ4FВACDг|
vЕМIC[MБ+фнPvЏyJћіNXvѓ3Нkїкфыс%О>сыwњ5ЙзGЏLSGЃў:zђьEјєщгp6Iф<(AУ5Ѓ(т
Ћ:<<р ЊT{ W:юЦ2ИЅЈlЭМа&жE'WуСКбјFЋ>Йу91DшЈ7 YфН,нє№ЎКbK|ZХZР­ФtСZя&§fГьg9ыѓѕsBМЪ&їЁЫ-rWЁЖ4Fл;_|7[c7"j7ywo4OЎonњѕЋ№юібГГSFаxТn,Jгб+H5З,>#до(кщSЭљзЪИSAг20ѕ}ъФ!дЪf4V>{Щg%E:)вДЇЅ!ржV4л-xх+ZСяИuЄkЛq{Sб[сяквtZЂПbЯ џПђUbО_wИUg|jД^<~ќ8yVЩљйZ# 0zIТ(4ЏщЖкЄ	:J;ытr{ХЋмп *ем'!Ќ5Кlм5вСfН[№д2=яZдфЈЉнъh
Sђ1њ4(Щгѕ	rУEHћкГР^VМэjкmЁ	tНЖГОк*гпЛX_kиЗэПFdtЇЎp4qqM~іѓ_$Џkєћ}xpњ &	ЛU4+fѓЬo-мѕfS.VЫЌШKШKЗAcл
Aтц4&њoЕU­ђecB жАј3+" љЇ ЦRЦнqua6дUщ
В4юt<t§TEbНZВЭ
мтIg
aы\рqvпZfїMЪўзЁ№>Ьћ5цAv[зЅџЖКё{Ю!	. сЯ~іГфцц:8y№ С.UI/о Я Б{w7/./ЏГ,лЙ,ЋТюё<vJ$hiB|.х1hЩ0ёІЬ91вП­Jn'БJьЄeКбЎѓTHЎ]ОDЫ(вєК\ ЂнqL,ЮrЖ
ўњG?юу9Ађсx4QуЩИ<88ЊУЁBрЧХьTDс]ХKMbG+ш6s^ГШНnТ7C{љ6Qoуі y+сЊNшЪбеЮњяFz@ы]&ІiЂІѕ!ў9Х№ЧГщ]p~v|уњHТД=^iІa(C(Њ\П|y_\МЌђ4Ѕ9SAFВ?ФjыФШх"%ѕВ@Ы;|ЋКПпsE
D=$§у!RьЊК"рTb/h"Х=ђу,wсњyјњzr0Qѓщyz).//ЇЯш.ъгђЏ(ѓЭIVЌЂ0юMk&гi+T­ЁDюCVІ]дA.ЦБ^r!юZзсН	hнLњo ЌэzіZ/єzЃёј`јђеЫp:НЯ>b";ЃеРЁ­Z,њ_§Њ@ 	\АбссiаВmюUчPЌ69{A*ЎqЏsLЌ]aBС%*vЦ^ЩЃёжЭR@юeыU:S2Њ(I№БчOаZQ`Ё:?Xlж$аhiJRsGp"Р.^^DWззбёё1>ц<Є8HW ъЎk+аnl[џCUMK5КЛf ЉnЬиyПFвоUGlЁwќ0нIh%tћНx8LFЭFм^прb?O>љ§ЛSDЦЩ­!в[рТётEѕђХЇgчмшDcжывMЄ U$лF$[PВјJ$ЂпGroЦCѓЂљlYШТB:qМ4KaГЩ§6цILСјHChфYdЋY*Х4<ЯУђшш(ЯчEжЊЈтJѕи*, MГ>КХ Ы
СњЗhэHhEtZHlЂjЪжu+ЌбЄ-П2Н4R~ю я:ІЕ3gЅЗ-MW<юЂА? ъИЇгiLш\dgP4)
x\_]ъgЯU;јСсИУѓB&`Є NхXAЙЬ1њБ@wн2єelТДЗЃqДhа.OсЅСЕY­aЕмР|ЙxЩzГІ$ЄзЬ6kЏ:Вz=uм3 2г РOв№щtWуБьЧЁ(чsшG7ЄFDхJћЁ]§ЦРЁоaсUЉяc№:'}Gїѕ-OЏ_hBx0Lpїы4M>јIљяФЌыnЯzНж/ПPw7зz0СбјwїlsЦ,ш~ГgтјфPУx<тМ?јРдiЋЅъ:­eГОИјcД^}8}@yД.ЊЛл[5Н	м§5КY eqмЧkBУjЂtЕTYНў­ШiО\ЮуF|[лз4q33ьГ
ѓ* ЂќЃеb&ћУёTб>н3дK6 ЌМЙ[лСtИчЙo(Imt]ДgІз|л*ь У^мЎЪГL"I|№hц0SЁ;uQН|іRдњршDИИбв е`~!O>ћD<zє­rVK.KYSИДАВГћJms&.3gw{{ ъАBцЯ;РнОј љlІЏooєtЖаы4­ѓt	eЩtГѓ[ѕхp8
pБr%є&bЦЛтзЧѓУћE/]Џ`9ъсј№ЪUяыvЦKД#Ъi{иЎН/V|;Дf§IГ=W7[пaвЈ7F^Aгј(_>xpЃбЧЁћQОМИPгЛ[998DЭ&Cwgжf#Ђ0~єH|јстнБц)Х\РЭМј][иД<%rњААbРЊ&кjнr5EЛшx(ф!ц§ЅУУХrБжWWW0ЭЙxFтXїtї6сz5'nWЮ"еQђЙxШ"xILYёеЫ1D$лэД­hЇ Иі7(Kђz/ВчїЄяюfл5gЊйBєћ§0Й|+КZ\uuu]Ё kPхYprzЦMLфЫХwлB=8|ќ1&#Aљ"ЯаеJ9ѓ-ЅЙPІFDяPњѕGuЃЄЮ=!ЌlЭ(љHA7щv4ьс№S<З|ѕђRЯfsUЂeЌЧ0Сz1ZUНф(@ЩгgmI'ў`ТаtVd?{ђХx5VбСЭытP~ю8ОJЪУTaF{МЭDaS=О[Љг.bГ#ВєЦQПUБ\Ў ЯSXЬgКэсбщ Јв	,.B@oчћтбйzщШMВ5ЌЋЃ[!^йИЎИЪАКVevSбш=ПЪ­1FШИ/W!ЫLГ[с` О§љgШQfКjЕошЊ
ЈаzЃ@KOoЏK2"Ус@ИўwЩ ЁЙцЃф<YЎ7ХЭхХ!ЌEo8э5VњuвЏЂю_i
ЎcлS%ї y iњСлгЙzЭoАеДIуИФUЊF;\#%hхrБ G.тn] ћ2фVЩя}я{b0ьУrЕ ."Џ'с9Кям(6ЙС+BЙй:оTgэ'пъiNД]JTгЃЛYsьфєЦурйгЇъъђЇбFШ_то@йZ_О|I'#№MWикKиН|јсЃxЙ\nVѓыRїћыІJМэМЕyiџKъv8Гпu3ыїЃaJwл@г$ЌЈ#І5Fы1ЃHЙяЮ%ь(К\.( ЧE7GЫБ^ЏФљУ3ёљчqѕШхЋ+Ђя0HаCДщсзVеbSШК
^л\Д­АвМEеQ{WFУдњ=gаѕ*ёмАоЌa2РчпўЖєтљѓ
пзvлъхьр?!+#\qw<<8В,Eв>Q.У нnњъe]HгrЋ[F\{ЖBЬї]ч]~S-HыК;-вт~/9еAЧВблVQЪ? хЊ,Щфі|ОЭz-?њш#ёйg4ЭсююI7p"GlЄWЪЎлбgэ)AБЕ11_­аЇvх'Ђ1'bЗEЌw|mЋ{Щ"(toonрnzЮNФїПџ]OрJxЎсJњъХчъеЋ3ЪФHЊА515^ћ}qzrс^ЂD'ЋйєqlТOМЖ+кЙОЫx_ЈїВћ]uO}УЮlpЈЉ\<Є'yТu)ЬИbЊryКЦЂФE@cCуб9[tЩтРRW%[7t{*ВБлgж4еожЈП	дГ:М~ymњMъ$ mб;\^]AтЛпџ<::EЃYАјC#H</Ѓ+FФп0]Џ(@K4{НьЧ:/Ъ1ZЃ~]Я'TЕYЇ	LЉFёg	yW§ЄябОLZ#iжnЗЕјИ;bc=Д[lоЅшгzЙ@Зъw5"ъыѕNЪѓѓsВ,ќ7HU2Ѓ5L_DГ<bрЃLВж@5Г:Qр9Щѕ* iX2H  3 ЌЮЕ_mјЛIњ)>YlТЫx[фћђььфl}n@іћ№ьЩгъ?џyх9а2}),нHцбp(бг1КkЋхт8K7	~UЃЄЅ 3№GЗн+ПiJьђ5н­жu.~хaїњИ0t-@ Сн­CаЧ@}ыѕ|y1JќЁщfS'зДMєUкdЃвєB!;ТїksuJV]СФж(y>иЊK ќё­Ч)3Рє~WЕS0Ёp.НіЋтV№­ЯП%б"Rщ(бP$/=UџїЭfKS'Уч&І§~ТUѕIo И.gГ#tу(БЊ}-_P4ІЮlЋї[ыўЙXo(%Ѕш!1МЬ­СнTЌsZеA0вД$Хт8~p.(Jб+w E3ЂДjм	В"TЈћюDтUнxфЕA3(МОцЛЫБМёhnAуCчuDѓX0 ь=хJhС_^ОщЭ-|єст-#Г cтR§бDмМКџя_џuіЫЧ_ЌзщїЫѕћ§tх6НСHЁ6NWЁЎЛ!kЪ2е^)џћXѕMѓЊ%ї\!ЩўvYЂа:єЅK
књ'*GЯв4"я(KН@AЅф>xШѕOыѕЪЖЖ
$P&я-LqI}l#ЙYЕШUїRџZtП^!Н~pЭтnГіZnSQћrЗ№Мшnno(R'>§єc:_ywsW!-DЧbГZDO<ЩЎЎoё(<::H*ЁKЭхўЩ`ЈgГйIдыo(Њeф6яџloAо'okпjw[ZЧ	КЁб+4х6do024p*u?9=AbDйўю/зvЊmbLї@шѕбвіё5/АЁOс8Ьжb[М;МIМ)S&Џ\	Лщ3ЉьяЎвq"ЊцЅdTнMЇDрХwПѓmCмбеЂЧSПIїdЖ^DEЫйlQ>~ќЋѕЋЫ#dФПа@Цшjс/бьюіИі6VCћТq-=@оВхбqбRbk ІЉ~%кЫ{,Эа.CыЩгФx<уён*ЅL1ЋЛBЏъщ+paЁJ&ёDqI=Зv3@з§нТуЛ.нzgUXЃбYЪTЪz9[жDеЯБWІІjХD съъyеwПї`4ѕ4!№ў elГ"{QIЊ7,q'ЋH@CWKЃuЇыuЄЖ |oxcжДшue|эђ[№Џm2!РSxB!iїДyAНкѕ*Hњ~^ЌИ9>9цр1\ТUо*А}UmДrVХ,NrzнP~Nш)ЕЫќFУGm7hЂAuЄЫЗ*PЉЎз'Y$РЈ>Рітљ3>ПO>§з?YњмДWEmжА2BС Ў&L3ву^АM98аQщNФЊЛЉэIњ[НЮепЋд&Є6&dtЃHhЏК4'Х]ЩС`ШныеZLЈZ,<OХЛЌ­s!ј1vПЬпфЎPСUм
/QиИJЭkнЇх [ЎкП :ЏУЗчЅыyi\у~ ЌКђєйZьтУ> QУУ1ZеbГr.фшvmЈ-8ФI_ЇY1X/CШJИЮЭFoІеA$>h~м3nJi,oСF}ШOO7kйы Ђ1`>qиЖггхШ)	Џчяѓюl~КaMdAЈџмH!цБж/ЏЌТ"/|) М9.*UGР4V]єх&БЩЪZњн§э>ЂЪgэЂiћ>\88пC!рѓѓ3Ю(ъO!љc.gqQ­Е4т)м3HтЪWТеb>Сз	~Cы Х{РFО qЅфіЪћџ3RxHгDdCЊ\еЖєђ<Њ*eЏ7 RЎгtУМЃЬsAuLк*UЛSЪ§Юђ<v	2ї7=-/s((Л.ЮЯхм}жEЕ`hEБtgvВѓ6ДVю/Љь9)/ а№Ођў6Ѕ)монСнэ|ђйЧд,&)?Bє\­Њ
гѕD"Lъа.kћ"I*ЭђбfЕ"ђвуйJмn]йMдїмЫT;Ю№0;4зс{РвЮћуХ$ВЭFRЕ	}ЋѕУ`8ЋХВ>9"Ў\ЈYїЪZeI{ХжХјм,GЎ	.&ъЙ0	BДмsлсkљrжLF?МэмЖКямp$знзФы"pтD!ЭЇzqё7<њрЁЄпGYhIђЭ:ЂvbSчi[оф{*З\Ь&F[KtDАо3!Ќћсb]WNSЫ&Wэ~Ё9v\&§фЋШЩd"Ј6Э3ЛАЌВ-АЊўiЌIРйц"GиЕ[Ц$ѓУЙaХсMхКЏ'чн=зы'ђJуmtMYЕ+qъ58умЏ(DфРd4gчЇLищмЃлeЖYtLпт	[єћ
?ЧQЅqѓoЂх{ыы0.+ТNfЂыДЅ ![KJ(ЖOMTgeГэuЁi]^СЯyЋсм-UЩэЪДшfeyъќ)гмф\cЖФЭ§ЪёfќsУ3|Рh/BхИkшm,n,{рЌЁjEўh%0Юсн- Ф m  RM)ђ,ЬtMЙХХіЕKС!_т2"Ф|:;Ј#Wj{хзAї( ѕЭHЧЁК)њўо>4z	4AVrЯ+EЈЊВЄKEqП'ђ*4Э a­ъ^TЈrЎЊъWyЗU6)WUЮЕWeќXзш\@]ХлщжcСюжК§wSЮЁЬКj тBwuJ]ЇЅ[ЯуQшt^ММ Оqzr,Љ^в8ќгѕ:0эКђЅђ$ѕzНZМh\ЗжВ5hj+=КШoѕТШЭUЋзД#PuЛ%яМЩmЬIbюЇ=@ыAVi^!ДЧиyiњРKОѕт­xІ%Пvg.­Ђ;х№И]-.'с6UFеНHѓ\*№В№эjАжЁ3ЅJYKЂЬ9ЙZ­кzT&цuѓчбc(H	вЋЫK8>:§~\RAJ)dETш:Юњ9Я>хE(пДZЬGWв[mЂОч яШt,\'а/пL$*уюF8шѓшњшbP<CkRВSЛгЭq7вbBПU]hРRrТЁРGvЎjZo}IЗъј8uyЦriеX
0аЎQUGчrvЄШY Э}згkqz|&!ьFПUІРгЬКрФ#gcЙZ.F6	џL2"ї рk/љ{Ў6ЙЃв	ЩE9%Ш%№НOрaяжFшЂZб%WFЮ§l=J
ЅrзЊNЭaЂб`J:*ЖдЙgЅHcte54|СЙREaKЁфd$ЈамзzМuН*ЭмЮг r:ъШ[ИЮ~Ѓ#<Џd щЧaBВH<nЮЈС*д<$вyQDыѕВWWfjxяЄ~ќЫНЏюцЇTў#;Ѓвh>Qщ7эђДЃИXп@\8эУ'pРUzЗщђ
н0Њ= )ѓ U/-(=ЭкдТ РpjFbGёpђЊЋAЌlbкЉЁД hёнд­д§щкЅ)н№аX+Uчexl(~HЏрa
цА.Ё'тјєTМxКWB$КЬSYf)ОЕАЖвЧ)Ѓ FѕXбzЕFЃ5S6DDn{П-y/к№[5 1аu%F]С2./г;ў4КRыЦ21[ЬсjГiБНC8'№iєОZ_У,[ 5ЩЙBWВјеЖrDXХЊфWІD7в-H^єYHжЉЬІ$jхд`к\У@Pё$љєqТ~=?о$um)ЕWът'\КsыІ&эІЖЌb`PД7 шe ёd/Уз]Bо{УсПбEбYЃ^цyВЂ)Xв6QЮЃИ)l6$Я; иѕjсхЯлЂя{ђі,Hk&­ЋЗRFмЬ4Sмњf1~EQфФD@u№АAkёХт%м38Aы(РнЎi6ы+х+Шб5thJ-\ЄIИ^еЪЛo=-Fъ-Ё\IН|љJпMgќw#ыуz:І1Уah~Чh<bSvуЌф\ЇЊv­QЭdYbгюBХ=Їј+Зh5dр@P$Щ ЗшЏ!ш-ё:Yr>ЩбяљMжEА]nаэЪe${:4#уш):БЮжЋ^gqсСпѓЫНАЅЎЌЌТЩ%hжz2
UЌJH^ЪxcLТЯШFrt3х
Х}№%ЧlIЦбnв)Z),(дЅЧЎWШл#uбhџуыuBм0IєээЅbb$=Ю)ЊKAn2НZ­сццNOЦcqr|ФЎй/ЊB6ѓE)уd_х-
дРИsХ-YYBW
}ІХ ЏЩ_ЦЋSаЊЄbыўП/fз в!CыKe9Q`Іљ*8$+ЁKЛЎЊ(E+вжнУЎбw{М@xПЋF@ЄЮJФфЦEЄЫЊтѕЫЄY0ЎС'Хв|сє;t­fљТ#yи;гфЎВ;xЕКyОмгiЕ8 ~ќЇМћ KBљщtІа4gd4p"D6ЂйХЎфG<)WЮђL_]пhвК:yp^В<xЮІСЉъXю?Љу­8Ж`Е.Дx[ 	SЈbДжbШ>ЂП@`,№\брU-"Н)МOЏDв;Eы(4КПEЖ	+U(fВс!мЅжЋU29<
 }е{ђvѓ щЊЋ-ъtЧhЇЅHнUњЫ<uЖ&вX@ќEпШаэКDТ>EАлu>8gpРфецжх6hЖ\,[ыІ	ђЙЦЂ;0F|uћтBh^aжbмDЈ+Kцб%ѓXlжшгЇ+ИИИд'Ч~ТЂ.JДyWЈhCд\фJ Х!Azoh4C! !wjР@Ao(r**aЗ>
NЄjХф	?ЗZDq Щщf0Ъ0Љ Же>ЉаGИ)ЌTњњї yga_ЁИМќЄЩВјn^xДубФЇMuдЅшх ьA$Kи9<[_Т+Ыў| љЮф#ќ§ЏЎЬ_СI>ѓјMєѕГѕ_ZiИIi$
L>Uрfyiљ
ѓz- вЦ<е*dM`В&Ї'"ЁHn*9\k],ўМ№JюToФєsжCтU XШвa.cЩJђЌу QАA|Д№м+ЅаєDѓњќK;I36ИNWдKRјиЂ3oJlД{Мѕ\Vэ%РФ2ЎqЪ2BюђBОIгюL~ѕ Є$"Y^,.aЮах:§№§Oёч)<]Оd2?G Ѕ~дЧM;dБЁў`РЩJВX1ћ№МИ н 
т,Mй
ЦIЦу	_)'ЂUћЇљkнЭрціNи)ЉPЯѕЂ nк9Г2DNтchа}8C`C7*,э(iiЄQљэДqкШ$ъ/!J>fЋЫЃЈШЄzOоkЕ ЁЯйfНNТИиЁNъО<БШлзx{"qfр)БFcJXyQ[Њ­nЖњЙоqku7Ј{0Д\%ZMС/чшbM'|§§УЯљчЫчpЛк^ЩЙфдсcъОfг)мн\гu}HР2НОб!ѓбQђЂKГ'M! Хb~ЇчЅюrРЄљаЕУS.7ѕ(аЅЊbМвЯBЙД$AЮЅЩя)тNшR*|}YЋ9+ "X4n*HжешёЇ2ЃчАnoъЕШТЙgТ
v@НбxВж\eІнzКФb?@чmDЕ (ЭЊUM=ќ/дЧЭ№I&эЪд*	]К а%о8.lofLбФa1АEЁvеeЙ_,VpЙЙG§3x48ЃупЫўМ*І:GттчL4-"JR}cЕNYp.юЭЫWЄЉEО§
^<Ъ:[|ќ!ђ1/:вдЅщRhyD­ilЎX ц#сК,ш	!UFс@ЄІfPvъS@с3м*ЈhеїЬу(ЛAЗUhs)b,J@ЇsЭмФ|C:РD*6и!xњ=fnz.YщКѕ~Ъэ; щэї5Teїvффiь>Іёlэ@m*бЪsЬLиЕyОBзъ1gр?>оц:C.	eЩk/IиJо/yаpPUЄp7Aeпш}It7Ѓфx}uУaтсhШчCќi )Tряz#zz.bAЅ1T(BХшЈиХRа6чА$*КvIJ.LCЈгяAЩ\)Д%і"ф&гЈдЃK$P01Ўём*
dХV­ХUNЯ leАеаВнрEVFяђYЙ­ђuђЄb0vРќ6yєEj' ЌD[їSoЛqрІфЊ`/АA]qЪ,ѓ5&ИHdЧ7ЁRѕ0ЙQЋх9j#lNgм7ш
AY5Ц0/рњњ?тEt{{ЫМЅрDыєЂыEsКRбЙYфJБМDaЫџЩкс{ЅЮ@|4и'ТЈ"AnVѕ Hzјњ6Хd=ШѕЂ+-l
8@yФ7PрћЬh9]ЪZз$
3w1K7БНMxzЕв o=вn4Њ[(РЕFЈКpuЫPдfЦ7ЌчшСЕdw*RнEEЊ^TH4#ЁF^;пЄЬ+ЈфёПхz­УгьoJf5ЭсььЯБdЋspxh5єДgыв\сABQ­xњeёУїSwЄ!ТуЊo з*tСђ	ьtФ@Yѕu0рмд!mfв)aZuMЛ"ЊDЊFЬDДЈН9MгияІд7nЗFмЯЂыЪБИk§­dk<A-уWЯљ%швзa`ћх/ёцШ	КхFСQШPВ(ђцww|rлыKш!iЧХsК(9њCѓч<S2ўН^LЃЉЁv№s(1[ЅЂЬ PBмЅ
@Ѕ0Иј5 ЏЏQCTFкшнѓј,-lІmЁUцjЦ8и&тkИzКY
6ЋЕўsЉNFxTљTFСшwёЧСеЬyІFpИнxk­-{ќжIКjGДjrPЇlЕ`i(ЪXЉNЏЭДe1DЗгMЕЬи1hнЙ\г`sКnтN;FCs3ЪSЗф!	ЇЬ [pxr7WЏ +pЇЇyчЁx.
Л9ZA00ВІ49(pKДz\б?$AЎq.ЁЋидoСэПltUРoо2ZbВбРSx-qgВ:в'ЩЁІ*2ЫJе_.,ёЎвлЭОтБѓОвМ7ым№jЮ0лyЄkЬуsШьИ1oTjD9ZyhЦ)J­ЇbрЌ\Dр)(І{3pG uP>Fсmh	ўр?ўC8BъЫ/0A_/чp{u	ЦЄфЂ<тdbРхН2гНЄру&^A*Жv(ЋMнРuT (Z'нт­s"ЬЅ-sзF*њZVоД7eqZyGA\J"ъЖЋїфЙXэнL#2 ЅЊt C+БЋэt#лПЎEK*ОнWвИ['1ђSіоьН&Ўм(pрІ	sW#ўЬ*ЊуМйГёмЦу!а|ѓ-]N`9L>G*ПММЃ##ЎE+Ђб­I№мFп"v'ъЭ3tѕf.I[іДщЗVрІЧ:УЖЏDВжЌф4г}ЮѓMшPљ?BJCбЦХrЃmїТwbCДЖ3[РпљрЊЌL"ў2Й
ж&эьднt$ЗZo3oЃхЮybжAѓ-э+5oкdd:ЙXTІOЇ;сv4Р|6щэ<yђ+ 1ЛѓЊfзinz8XОАъёЖ5ѕЌчudЂkeU]K­Зыwъ:vmbE @еS­Ь}ТХды№87zйp­S4_MZНђєqОќBUшыxљяђі2щЛBKЎP1QъигFЬ('НУ,Ќ{ejJзmЪЦљДU=НZлA}&hВDсВnЄУuptйх+XЎfАоlрtHХSоMсчПј9ммоТўсПdw(Ы[&w`еZlЕАQ,ВwуZsШkЗQ4чmпЩt7 Ю=tzСMХ'мd^YЏ
­RыІЄ№[щL4%>Ы:+гt9ЗXмg~/;/Нh#Zї"у/AР!_ЩЄ`>ТЛАЮ( ёлЭяВЏ ѕАNЫ.YA- 7(e\/gFeБ(qБч\{tzЪЎЩmdќјфЪ"еbЃ>њ 8љ!hдkOъЊhыFe'гЕЊ
|ЌЊ9ХО]вZЏOT5vБ&7aЄ*EK,),[tо§дК 3/н$Ё	ЈОЖ$UљЕХоХz[єd3ѓЪшъ+URR`Јлѕkг#uХ@њAZfЋ]ЅMz9dАЯ бЪRBкщАєбЪqG]ц)Ќqёгk­з)OЧTEeяШ; Vez{pН8тАюХХјшOсгЯПOОјЛ^k<Чўа<ьаВLјиЌQН`UЕ^БВqШUЪZЏПЌ-"[QOЋ­EйPИЁЅ,ў ЊЮsnЇ№GY>ЯJНВZtЅRЕОџЪXпаЉЖљаЭ$t?6DЈ"ЄлW~HN0WтVл№BY;щЛCl%ntШ%\ФЁс]УЌ'цhIжYІёиї&a2sp§шбCXЬчLЪc$оAдчWNoс9ШУчБz,уЗСљљЮ;vw6Ѓyј8Z!eТЦVШЭЕ`1иїgм'-<PІ­(­ѕАLTKй6%-Эєл:зv*рR kРБЎЋТПЖPQ7 ёШа=IxNЖ+аЊyО ы:Zљ,ЧщЩ1.нђ­]ЁJHЄ6+	вєЖЃгV[%-tЈЈЯL"fЙБ$abeLЙ$LE=ш$Ц С юЎЏpСуsSRw]]+Wu|xxШр ЌMVЌvСК\дХЇi)ЋЦS­ ЗлzиkМрzъїЦ9ЄPIVЕЉНjx
ѕэЦ:PNЇj{kfЄЁг]Тn'5жХ:ЄjІ_GмЗuvOВеt@VЎшКPc-f]T9uBЖ?0КT<PA!­_mYЋje6#MнўЄQ1ЌkЫЗЩл.HзгkУШmZ"'ёьС1Eqx0-n№ОДЂ)ЩЎДЩj%QЋЭMNЋd 0      =/$/yWНї{яїояН{!о^їїї*^$їђff а  №jяЦzїюGв{8ый06 ТyTqP`ЩEОXжU~Hkщкs9JEїі@ r9СC)Bd @"ўR"@$ёџ    # @D0Нщ'БrЬФ дЧDЄ~РиikИЬmЦВ^QFЮrEф=ЃёуљъD"бЏoJ!
ЃчАyоВXиѕЉo№УMК1К Фіч+фLЄ=|ё іsиКўi$aFА`lЗ8<уь.0VЮЬРзgчЛ+Ћє'k­0щy!8ГЎkёйdоpЃЪiД§лrё@ДлЂш7сХJ|UиФЁчЦѓѕязЌp :%хHAm	Ођy|%uеDТџъbТЃ>	ЊЂџ ф+QbXЌ*-,Cр6[ =5я;ZТбЛВwбІ`хVvМкѓIщиѕНЮcUБЃ_ml^РЮJJqЃФYМццєПЋпШїЛ мњKюёqЖ ўRеЙmќЙf:ІOhjGIш
ЭдчЪ9нйжь;ЃclБ)њLUTЧи
6yЗЇt§jhпаМuњ}_rЬ>А^жМЄЫє)'ЃаЬ_йщ6gыууЧm"цr* mМщЌгр;З[ЄѓЮcPTКхќwфYјbю.КѕnІ)7БВBVуZНЎо5чdok­ИЦoтhЉБ=_љ9­ЉКЎС Нгєry@YІцГ4<]бsuыjЩВr;(Ir%цna!uf0­К iQ"бwwАКр
1ЁeXЯ"А3HsЯХЛSъIS=Є#rlьМtяЕLаы]bfCАЇNmлt%пY­Эљх,UYJ9RЬHxfЗНaоЛл.%ДTGш=UNMxРa/ЏфnM"K&оЮЊЙ\9Dп(dѓєХЅV1ы§№О,Чnвt&-ZЖ№!f0­эn`j S№еВ[EЖ>_-UЊЯЋК.ы9
cрє:OxХжђsЦйГАћwжЬa8dЏбі2VёуиGч1ВVгжинNЏєHmПЮїкќOpf u4`#чdцОЬ={+ЮєѓvЦG3Ф4^5  ЧЛЕв0Y&Њ0ё#гэѕ/VЈЗHэ	ќТr4ЛbРв6к	ЄgCИIџёy'ѕиnЯмо"ЦoиF`eЪ; ыяўQ3њyW!oЮm5
VТгu~ыnрхX8WYBVRѕp1O$щСtЩжк2}ЂШ1
ЙeќYЄi/tяЄyЖ*Езню>юTъGTЇ$$З-Й:UЁЎSg, Х>ькgіЧHшТ^мІЯv+S&ЦjXЮЧпXђЗ1КЭOяјNѕMЩj$}Aю'+aFжІOЭгГБ3t-Гzi7­jPA(ryqIц­вМPб2
ГєuїЁхВ{ЙѕHА3F,EМNxФ {pЦ)yY#kцЕ[ѓЫў58DLЄЪ[Fщ,TцЇОммzI­#AeZђ*ДyЊIПю- uЄТz1ЎEъAхвІ{1ЯЃФ=жr%ЗкJщE$((y,Kг_ИhG"ч@ђНlљйУUЅqЙ!ЏОwЄР^Эѓzђm), ІRЋІўњ8дr&s~tьLS
XpПКGъћhKн4$dй<І)a&§%ўЦsкZ\zFКдTЗ)lk#smиімФ"з+ЎЇвFшуєыS)9#сг§AТД1ООТHJкS Шsш8x№lПКй"LЪюhрЛШ	hDяlЂrЛ-SЇ"nЙЮ	'8"ЧfuzюJGhЬгWуСѕ)рРєЙ+яГЈ(r4V)ЛЖщЃaйGЄЄзT/МўН{ЁОYhЬfХАЎK[h`qMzОѕ	3H*6§RO+і=ВТd юz4KШ;к_Ч~ТЈzrаг231pЧшoYяdЬљ2%z!-u{НgСіІ,У>c0СУщШ0IL+ЃЕљ;дЌ
Вд%0Uq(З!fШSEi>Ј7[ъ9э§б1јGЩgњяЂKЅXи< IuM6\!1Nх1rУ]ей-YЅ'гКKDДof>Oѕ8wLiyбсЉUjЏЅ|xЎч| М9Дg­ЈХ6ф;Ѓ'ѕrE щфЂЃИхљѕь~H}Љ~Ї ЅxЅospUфT'шК љІѕ'ЧВк(& pЪm)1BќSѓ|lSў@оYLa­ЃZуИЛчF8ятЫIAРFM
О+ъьєHж9ѕdмGыыдЎxчёќ%.fTА}SuКРЧgЋ гоНзOG^вю2ДUЈOФ"ђdвНыѕеЋ)ЅpVмёАЮ~@!_JЭJKЏE#|wq^Э­ѓмѕЛ7aф3dTабMчСЕ<08[@ Ji^!xR(qhNjБцRЯрЛМEЬeЈђЪЧіэ2мЈpЭљЉbиi"&E\сѕВszхЅІЊ8}361IkыЬT[§цN
C/їХAТ."-ЃmіЭРўVXЭчФІЌхЧъK0н^ПЎђЁо/3Лсгуб|p4п><де{S шЮFювДHХАкШЦѕeяОр4cЩ3Б_х<$мEwuї}PCЇ	Ц5ћЎтэЫЈокд1-љРдЊ1)хы/9hїюЊьz"bDzі5BrЂpњ*MЮбъъsfоЄr)023щ6)NЩJlуЯv	НиТІОUvjL{!ГМL=йђ^Ў0QШ@BжhюЧ0ФЬv1TШ њСЊЩvЎР-љIБЦNЛЯ8О3ЏOд2І:F=8Da~&<яК­ЗxрЉщqкYїыІГtЙ+mO*#dG83!4гёYM"KФAз6$ЉІmёЭї&WЇЕ 0Ћзэ:НF,ЃЖЪ~BЯД=}[1ЇюИиКи]Rxiw?ЎsПЁ­[b8я9ЊПAдпфДЮ=/Ё_БѓЧщ;бFi.1Юj?_НHлјЇub№ЪлкЊfїBтЧщc
ІТА)aЩJRл{dШdLЧRеVXоњає7аw|)Ою@wЃuA:о-ўЈСeОљлЬP7Ѕa1йКO;Wo)А#N#ЌЌ[xDш лБBQшЄ)ЅkfЮјљzЂKeЋTnW
2VtЌ'ЊчДрё<Ч%Т#V1OcV7ЮѓDкЎ.ђ:їјЖzе2ѓшeA%OДЃхЭv10ALУжВоЖт|{ВVИ|йіХ)r^ХЕ_Њ.дQЙт­Z	§ЎfіE	rxіZюdФAЏфwGRгw7фВбл8ЎВо0EMИ=Јѓъі
еTq­DЗ#ѕUwDНњЮ&VњГаIt­{[s7Ќ@Ь9RЃќ@ъkКЮЧ)ЯUZ\Г)bІѕ с8>/Ѕ KВ]~єЬфїА3L6Ў`ТЫќЕp"#qсѓFЎK№НGb ТыiчЎsЪУМЗЙeю
zї~Вж2(яL4уъvыеЋYћ{YаLЭ#ЪЯ{!x7й+	еs`kЋ34ЗАъп Ў }VАi*ЬBEшќ`zЕB&ИA \EВЃ<ѓc>Њm>ьЌ;osy>_NКМO`}їѕlёГYЉАПЊѕKеѓЄ
ћЩ9jзэпфЩeЛEычФњыУhЮЏ&2ВЈъщюcгжЋрќхл%aDДЎ#ДщA~бEяLЭxЦД
7с4Rцјa+IК&ЪїV;УSL1Т&3Z
=8.Ѕ{Є<эBkgЛєRx"hГбЩЌеўоЋN(NћЌЈ<^оиDЧьKоь(w bљzЕ:fЮитzB­P.Ж/7уАQNцжл=0L5яіSdьMъиfS-m_л{.3dЃRЊР­~щEё&mkА7#п[*=gsКRгffЕCфЋЊV>ЅД­wЉFШD[;n!>@foB№'dN=п_j +lyТКќ:ё *BDХНfЯBl-с>юЬъЋ`Kї0ТSЬЩ]ч6y§хЮЯ)3gИ)^є№/хШRн:QъЮ3DУjдххълxПцMСn№)г)оу	уR.kЮЯп,м`ЗС3ѓїWЄWѕЮю№мнЙ<ощЭ4,?ИСРЊtPкaяIоЕ[7vИ дфЏHXXЁ жЎЕuю|їт],fQ1pЗ{}?дrI_OqущшТ BђJћж ДКUй6_ѓ^lџчѓхЧцФ9Ч5UОБP'й'\мuТphs^Є_
ЋЖХѕlц|Єйі7ЗQXТIj9ЄDееByРhAтШp4пяPEgвъwІWhМа25єDKѓEIHШceЪЗuю(u{
§ЁqЗљgёЧЕОб
чq{Р'Ue~iIDДЉq>ZяЌ\vйGѓДЈїhЁЧ6zоІ~L$ыАіЯщШбyuВjо/єжОВОgБ]бj[.<љЁёuPю\-јХБ%#wКЎЌФgќWКЯшfчб3вQC=ю=`л]vЌM*ЖHtлБYJ7Љѕь4уэйл9њUвa!ЦЖj'ШUЄR2хьяаъmS#Н-ьЦhЬз.?MчBrГF+9/pwBі|ќкСЈё{№№`Ч4Bо-О;єящхe'3М1ТДuелqв^Vџv2СЃЫSэ
ЗЕрrUрЕ*& 8QХ_/ьШФм #фѓ$|OАUNаGkТ§КЋj Wѓ6і4 X+}^ЅYЫHXшЈyгX NoЦxKђЁ]DЏкэ`zlу\2/'ЕeoQВQУс=ЃДчЩ"ТЧ]МЙDђрцon	ђКЏ}*oVa8єz,пЧJ№хpі'ЛГЃдо6u.ъо`Л,ДA^в№-KyУЁИZЕkLІJ0RзЪ}фбЅ]Ыd	-H`еЧЉяєkCnЦQ	я№Ѕ$1Ѓ]ЊФ_fl,Ю-ш2х	tCСw6Н&.7ѕN:Д!лGИРЙOІиpѓcDоFZыЄ+aЫqbэШYэЦЬ&[Ўѓі{ўJЎц).ъУj~oРШеtЅЗcUЪцфі MЦцђєtVzЗН{^СыЦ§s§е*У$хYЊBW7pЧнЌД9Ы6л3w#MwdбI}*еЬ@ж{ха С(TЏъѓZjKтaaЂyA%GЂSо/.ќ-+О@тсЫqьЋ;кi_Ч2Z+ё@6ѕі%Еyі+'&ЏINЋБ$+ЋЫзеЎЙЪЭѓцябЭЫХчa`јВJЁїFtѓ61кМё g1.Щ§ЉвnпВдХеjXпыWЈ=mCg_гnыѕ@HнЧ6я;Ы%У'з2SюЏѓЩш-]СюжxHFАвKECU0 а/зйМЂжuоМW"лuЪ+q9П"\ЩУTviPьСWИМыpxІsl#L_вВAАуЁ}7bі<nKBуЙPPКіРѓєѓСя<G|ХаЊчIЮцІюЪЁuЁМ{y2nFќ5fЬ7Л]ѓN
ЅH:1vdб*СБо8жЬзз }Д*лЗБЁЗєуШLЫ*UI	;jЪAшЉHяI"Ј%Bl3ЄЗCђjD1Эz!н.|йЈVЦ8$ћ|іеЕящKUPQЩќ%:v!ђђnВюcЋПДЛйu`UcђF(чцгЁOhЂЫГЖyКPSFмYИNиюыЫtЛN]П#bКЩЦаІaБГКззC9э<KS'SJЇЁfлU@1Їфr	ЯІКu=UП)ЫТУ:§вЮ}цќ5#fFo	N,SмХ	ОвТGъNЄGi9еБџЮь>
f\~4)§5ОHvЌЖыЬ	"|ЋJ<^ав?4щF8}V@Ї?G~џШ­п:+ЂдМчзлўЁе@jяDџЬ\й:1%Ђш VњЦ*.LЫ~cТ_Юљ
EЩЫєo]оеeЧЂ0яmѕАiЎнPйS[,;Ц­]ЮЫнБ7ЬPџФm:ЩЋэтnщіAvКЪКЂ0zRђKЗњY?2я)ИXBЫ	!*щbЈАXХ@^4ЄQ=єxvКќп2]гqХVnцЄщЙXк#жд|7?mт$ЪZq^І?u`
Єтxэ;аоШlМ>ЄgЦ=`?Юnр+ЬчNчЭА+ЩGмПh+КЙьъ&>>AxШљ+xt`QvPvЈ|hсjUЙЊСёdЗUMРл`шkњ<l=hища6b!ПsтЗAЮgџї JЯиєэx1х;еоі*8їіO.G-шmsЬМц?ёBWvEМЋjш4UыЈ=
р9oТ
жУgЄ1­mV­Ћаз2Ъz<2ЗOmmЪXЙ	БАєЯz0PЭ4$щйн*Ў$	V5uK	6І№Њpх(DЂ\.1Ж&Тш
"ЦzЌяyIkЋвrpGцQю[~oюыЇвqw3.юЋеVЇПLреЩвыщA4І,ZкЋ6цAТMsѓGфьЗњh№^Є>УH+Fpўзc№T>ч%пА
i/н?Ца d	ГгIЏKOT}AёGЯBYљ­Б'LлFЇO7k3BжЖзbњїhоѕЁEВ"ПЦXBЇл9шTЎjѕЛnlЂЄЁV[ЕЭ\	Џђ59-Ўx~АZ§Жhj=­Uqѕ{љН;ЬВбъZob{М№оржNVHоLЄuжЅYFт"ЅџUЧ(Ы0 2_8џ-ЏЫЈejеђЂB$tjPлѓ$cпzЎЌшП	'PЂ!уlJl1цЈ­fGћ}Ќ|eО3gЈ.3шfїлЮUPО1їІsa-zЫ4yіAРЄнjЙхё§Н> ЇЮСъuїЊhЄЬGВпя}:zн9;шBF -)ШD(тьbАL]щIFу­МР<\/yБк2Ло,РWтLЖb\gqИ! є;Ќc
ІЬј?ОйwФRf$рЈВjCoиDгЙ.+QA"mЂЭЛез(M#!yЦЎxКЃиє2ЇчxOkД2|NО,/)џ.ЋЉnГЯяГЂЄ\ЅК5dіеуMSyMЈГКЅT%ОbлU*ЛPЪ>LnhО;iи!(	xКUЮc$&77q{ЁМhW	FfVvЕєАяЗЭ22nVF7штэЙђBЂЧяz4ЮгцZNћ Эж"Ѓ`ТHрCгїAmВlЬhН<RщИ|zѓFyШ№HХ=&ф]2%пA[Нof<З;jдщЦгцБВUkэkAхZ  ЁћЙХnаjцфтo№с6і5ГЗаЁтЗm$!-ќoьцДцvъћ}фюПмz^  А\ТеНXTбеtlsМПjОPbв656tЗъЩ E	вљЛ9H<!ЖzЫжiв2/&Ћђэ-кЁсќUЄz$ЄЃ<Фё	ќ">re8сЋЈ
РїRЋ N;рUцoLУkв{Ѕfm5S4С'шв]ГO4/зѓ]Hь=З№иiаГсЖyяrЖЪЮCBОцћz4ЕЉНr{мM5нНfS<ьVV­Я,ъФ0Й2UЃeЌ,ы@Ћ@lвG4i