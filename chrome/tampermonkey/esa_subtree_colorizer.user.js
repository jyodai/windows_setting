// ==UserScript==
// @name         esa_subtree_colorizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Apply color to items under a specified category in a nested list, with category name stored in localStorage
// @author       You
// @match        https://*.esa.io/$
// @grant        none
// ==/UserScript==

// コンソールで以下のコマンドを実行してカテゴリー名を設定可能:
// localStorage.setItem('esa_subtree_colorizer', 'hoge');
(function() {
    'use strict';

    const targetCategoryName = localStorage.getItem('esa_subtree_colorizer') || 'hoge';
    const highlightColor = '#333333';
    const maxRetries = 5;
    let retryCount = 0;

    // 指定されたカテゴリーを探し、色付けする関数
    const highlightCategory = () => {
        const targetCategoryElement = [...document.querySelectorAll('.navbar-category__title-name')].find(
            el => el.getAttribute('title') === targetCategoryName
        );

        if (!targetCategoryElement) {
            console.log(`esa_subtree_colorizer: ${targetCategoryName} not found.`);
            return false;
        }

        const currentItem = targetCategoryElement.closest('li');
        const nestedItems = currentItem.querySelectorAll('li');

        nestedItems.forEach(item => item.style.backgroundColor = highlightColor);
        currentItem.style.backgroundColor = highlightColor;

        console.log(`esa_subtree_colorizer: ${targetCategoryName} found and colored.`);
        return true;
    };

    // 1秒ごとに実行し、成功したら停止、失敗回数が最大に達したら停止
    const intervalId = setInterval(() => {
        if (highlightCategory()) {
            clearInterval(intervalId);
        } else if (++retryCount >= maxRetries) {
            console.log('esa_subtree_colorizer: Max retries reached. Stopping.');
            clearInterval(intervalId);
        }
    }, 1000);
})();

