// ==UserScript==
// @name         360 Document Copy.
// @namespace    Liulinwj
// @version      0.0.1
// @description  Enable to copy 360 document.
// @author       Liulinwj
// @match        *://www.360doc.com/*
// @grant        none
// ==/UserScript==

Reflect.defineProperty(HTMLElement.prototype, "oncopy", {
  writable: false,
});
