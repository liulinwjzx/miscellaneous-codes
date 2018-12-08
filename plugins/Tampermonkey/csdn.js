// ==UserScript==
// @name         CSDN: Show Whole
// @namespace    Liulinwj
// @version      0.0.1
// @description  Auto show whole article.
// @author       Liulinwj
// @modified     2018-10-30
// @match        *://blog.csdn.net/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  unsafeWindow.$(".article_content").css({
    height  : "",
    overflow: "hidden",
  });
  GM_addStyle(`
    .hide-article-box,
    #btn-readmore {
          display: none!important;
    }
  `);
})();
