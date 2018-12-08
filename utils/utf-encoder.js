/**
 * Encode character or code point to UTF32, UTF16, UTF8
 * @param {String | Number} x If String, use first character
 * @author Liulinwj
 * @throws {TypeError} If argument is empty or invalid cope point.
 * @license MIT
 */

function encode(x) {

  if (!x) {
    throw new TypeError("Argument required.");
  }
  let cp = typeof x === "string" ? x.codePointAt(0) : Math.floor(x);
  if (typeof cp !== "number" || cp < 0 || cp > 0x10FFFF) {
    throw new TypeError("Invalid Code Point.");
  }

  let UTF32LE, UTF32BE, UTF16LE, UTF16BE, UTF8;

  if (cp > 0xFFFF) {
    UTF32LE = combine(0, cp << 8 >>> 24, cp << 16 >>> 24, cp & 0xFF);
  } else {
    UTF32LE = combine(0, 0, cp >>> 8, cp & 0xFF);
  }
  UTF32BE = convertBOM(UTF32LE);

  if (cp > 0xFFFF) {
    let c  = cp - 0x10000;
    let sh = (c >>> 10) + 0xD800;   // high sorrogate
    let sl = (c & 0xFFF) + 0xDC00;  // low sorrogate
    UTF16LE = combine(sh >>> 8, sh & 0xFF, sl >>> 8, sl & 0xFF);
  } else {
    UTF16LE = combine(cp >>> 8, cp & 0xFF);
  }
  UTF16BE = convertBOM(UTF16LE);

  if (cp < 0x80) {
    UTF8 = combine(cp);
  } else if (cp < 0x800) {
    UTF8 = combine((cp >>> 6) | 0xC0, cp & 0x3F | 0x80);
  } else if (cp < 0x10000) {
    UTF8 = combine(
      (cp >>> 12) | 0xE0,
      ((cp & 0xFC0) >>> 6) | 0x80,
      cp & 0x3F | 0x80,
    );
  } else {
    UTF8 = combine(
      (cp >>> 18) | 0xF0,
      ((cp & 0x3F000) >>> 12) | 0x80,
      ((cp & 0xFC0) >>> 6) | 0x80, cp & 0x3F | 0x80,
    );
  }

  return { UTF32LE, UTF32BE, UTF16LE, UTF16BE, UTF8 };

  function combine(...args) {
    return args.map(function(n) {
      let leftPad = n < 0x10 ? "0" : "";
      return leftPad + n.toString(16).toUpperCase();
    }).join(" ");
  }

  function convertBOM(str) {
    return str.replace(/(\w\w) (\w\w)/g, "$2 $1");
  }

}
