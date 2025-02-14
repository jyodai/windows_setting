// ==UserScript==
// @name         esa_only_directly
// @namespace    http://tampermonkey.net/
// @version      2024-01-05
// @description  チェックボックスに常にチェックをつける
// @author       You
// @match        https://*.esa.io/$
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const interval = setInterval(() => {
        const checkbox = document.getElementById('category_on');
        if (checkbox && !checkbox.checked) {
            checkbox.click(); // クリックイベントを発火
        }
    }, 500);

})();
