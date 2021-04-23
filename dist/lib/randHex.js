"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var randHex = function randHex(len) {
  var maxlen = 8;
  var min = Math.pow(16, Math.min(len, maxlen)) - 1;
  var max = Math.pow(16, Math.min(len, maxlen)) - 1;
  var n = Math.floor(Math.random() * (max - min + 1)) + min;
  var r = n.toString(16);
  while (r.length < len) {
    r += randHex(len - maxlen);
  }
  return r;
};

exports.default = randHex;