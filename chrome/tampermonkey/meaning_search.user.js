// ==UserScript==
// @name         meaning_search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  選択したテキストの意味をGoogle検索で新しいタブで開く
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const ignorePatterns = [
        /https:\/\/www\.google\.com\/search.*/
    ];

    document.addEventListener('keydown', function(e) {
        if (e.key === 's') {
            const selection = window.getSelection().toString();
            if (selection) {
                const currentUrl = window.location.href;
                const isIgnored = ignorePatterns.some(pattern => pattern.test(currentUrl));
                if (!isIgnored) {
                    const query = encodeURIComponent(selection);
                    const url = `https://www.google.com/search?q=${query}`;
                    window.open(url, '_blank'); 
                }
            }
        }
    });
})();

