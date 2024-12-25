// ==UserScript==
// @name         esa_extra_time_toggle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  デイリー終了後に議論する事項を忘れないようするためのボタン
// @author       You
// @match        https://*.esa.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let checkCount = 0;
    const maxChecks = 5;
    const checkInterval = 1000; // 1秒ごとにチェック

    // デイリースクラムの文言をチェックする関数
    function checkForDailyScrum() {
        const pageContent = document.body.innerText || '';
        const containsDailyScrum = pageContent.includes('デイリースクラム') && pageContent.includes('勤怠連絡') ;

        checkCount++;

        if (containsDailyScrum || checkCount >= maxChecks) {
            clearInterval(checkIntervalId);

            if (containsDailyScrum) {
                createFloatingText();
                createToggleButton();
            }
        }
    }

    // フローティングテキストを作成する関数
    function createFloatingText() {
        const floatingText = document.createElement('div');
        floatingText.id = 'extraTimeFloatingText';
        floatingText.textContent = '!!! デイリー終了後に議論する事項が残っています !!!';

        Object.assign(floatingText.style, {
            position: 'fixed',
            left: '150px',
            top: '65px',
            padding: '10px 20px',
            backgroundColor: '#bc5053',
            border: '1px solid #ccc',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            cursor: 'move',
            display: 'none', // 初期状態では非表示
            zIndex: '1000',
            color: 'white',
            fontSize: '30px'
        });

        document.body.appendChild(floatingText);
        addDragFunctionality(floatingText);
    }

    // フローティングテキストにドラッグ機能を追加する関数
    function addDragFunctionality(element) {
        let isDragging = false;
        let offsetX, offsetY;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;

            // ドラッグ中のスタイルを調整
            element.style.right = '';
            element.style.bottom = '';

            document.addEventListener('mousemove', dragElement);
            document.addEventListener('mouseup', stopDragging);
        });

        function dragElement(e) {
            if (!isDragging) return;
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }

        function stopDragging() {
            isDragging = false;
            document.removeEventListener('mousemove', dragElement);
            document.removeEventListener('mouseup', stopDragging);
        }
    }

    // トグルボタンを作成する関数
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'extraTimeButton';
        button.textContent = '延長';
        button.style.marginLeft = '10px';
        button.style.cursor = 'pointer';

        // ボタンのクリックイベントでフローティングテキストをトグル
        button.addEventListener('click', () => {
            const floatingText = document.getElementById('extraTimeFloatingText');
            if (floatingText) {
                floatingText.style.display = floatingText.style.display === 'none' ? 'block' : 'none';
            }
        });

        // ナビゲーションバーにボタンを追加
        const navUser = document.querySelector('.nav-user');
        if (navUser) {
            navUser.appendChild(button);
        } else {
            console.warn('ナビゲーションバーが見つかりませんでした。ボタンを挿入できません。');
        }
    }

    // 1秒おきに最大5回までチェックを行う
    const checkIntervalId = setInterval(checkForDailyScrum, checkInterval);

})();
