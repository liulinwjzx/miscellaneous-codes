/**
 * @param {String} str
 * @param {String} type "base64", "base64safe", "base32", "base32ex" or "base16"
 *                      default is "base64".
 * @author Liulinwj
 * @license MIT
 */

var baseEncode = (function() {

  const CONFIG = {
    base64: {
      fromCharCount: 3,
      toCharCount  : 4,
      chars        : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      pad          : "=",
      enc          : base64,
    },
    base64safe: {
      fromCharCount: 3,
      toCharCount  : 4,
      chars        : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
      pad          : "=",
      enc          : base64,
    },
    base32: {
      fromCharCount: 5,
      toCharCount  : 6,
      chars        : "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
      pad          : "=",
      enc          : base32,
    },
    base32ex: {
      fromCharCount: 5,
      toCharCount  : 6,
      chars        : "0123456789ABCDEFGHIJKLMNOPQRSTUV",
      pad          : "=",
      enc          : base32,
    },
    base16: {
      fromCharCount: 1,
      toCharCount  : 2,
      chars        : "0123456789ABCDEF",
      enc          : base16,
    },
  };


  function base64(c1, c2, c3) {
    let d1, d2, d3, d4;
    d1 = d2 = d3 = d4 = -1;
    if (Number.isFinite(c1)) {
      d1 = c1 >>> 2;
      d2 = (c1 & 0x03) << 4;
    }
    if (Number.isFinite(c2)) {
      d2 |= c2 >>> 4;
      d3 = (c2 & 0x0f) << 2;
    }
    if (Number.isFinite(c3)) {
      d3 |= c3 >>> 6;
      d4 = c3 & 0x3f;
    }
    return [d1, d2, d3, d4];
  }


  function base32(c1, c2, c3, c4, c5) {
    let d1, d2, d3, d4, d5, d6, d7, d8;
    d1 = d2 = d3 = d4 = d5 = d6 = d7 = d8 = -1;
    if (Number.isFinite(c1)) {
      d1 = c1 >>> 3;
      d2 = (c1 & 0x07) << 2;
    }
    if (Number.isFinite(c2)) {
      d2 |= c2 >>> 6;
      d3 = (c2 & 0x3f) >>> 1;
      d4 = (c2 & 0x01);
    }
    if (Number.isFinite(c3)) {
      d4 |= c3 >>> 4;
      d5 = (c3 & 0x0f) << 1;
    }
    if (Number.isFinite(c4)) {
      d5 |= c4 >>> 7;
      d6 = c4 & 0x7c;
      d7 = (c4 & 0x03) << 3;
    }
    if (Number.isFinite(c5)) {
      d7 |= (c5 & 0x03) << 3;
      d7 = c5 & 0x1f;
    }
    return [d1, d2, d3, d4, d5, d6, d7, d8];
  }


  function base16(c) {
    return [c >>> 4, c & 0x0f];
  }


  function getBytes(str) {
    let result = [];
    for (let v of str) {
      let cp = v.charCodeAt(0);
      if (cp < 0x80) {
        result.push(cp);
      } else if (cp < 0x800) {
        result.push((cp >>> 6) | 0xC0, cp & 0x3F | 0x80);
      } else if (cp < 0x10000) {
        result.push(
          (cp >>> 12) | 0xE0,
          ((cp & 0xFC0) >>> 6) | 0x80, cp & 0x3F | 0x80,
        );
      } else {
        result.push(
          (cp >>> 18) | 0xF0,
          ((cp & 0x3F000) >>> 12) | 0x80,
          ((cp & 0xFC0) >>> 6) | 0x80, cp & 0x3F | 0x80,
        );
      }
    }
    return result;
  }


  return function(str, type = "base64") {
    if (!str) {
      return "";
    }
    let config = CONFIG[type];
    if (!config) {
      return "";
    }
    let result = "";
    let bytes = getBytes(str);
    let combine = (r, v) => {
      return r += v === -1 ? config.pad : config.chars[v];
    };
    for (let i = 0, len = bytes.length; i < len; i += config.fromCharCount) {
      let sequence = bytes.slice(i, i + config.fromCharCount);
      result += config.enc(...sequence).reduce(combine, "");
    }
    return result;
  };

})();
