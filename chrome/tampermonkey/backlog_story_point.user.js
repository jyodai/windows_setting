// ==UserScript==
// @name         backlog_story_point
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Fetch title and story points from the current page and store them in localStorage
// @author       Your Name
// @match        https://*.backlog.jp/view/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("keydown", function(event) {
        if (((event.ctrlKey && !event.metaKey) || (!event.ctrlKey && event.metaKey)) &&  event.key === "m") {
            event.preventDefault();
            main();
        }
    });

    function main() {
        const messageButton = createMessageButton();
        setMessageButton(messageButton);
    }

    function createMessageButton() {
        const element = document.createElement("button");
        element.textContent = "story_point";

        element.addEventListener('click', () => {
            const currentFlag = localStorage.getItem('showStoryPoint');
            const newFlag = currentFlag === '1' ? '0' : '1';
            localStorage.setItem('showStoryPoint', newFlag);
            location.reload();
        });

        return element;
    }

    function setMessageButton(button) {
        const target = document.getElementById('project-header');
        target.prepend(button);
    }

    const flag = localStorage.getItem('showStoryPoint');

    if (flag === '1') {
        // UIを作成
        const uiContainer = document.createElement('div');
        uiContainer.style.position = 'fixed';
        uiContainer.style.top = '10px';
        uiContainer.style.right = '10px';
        uiContainer.style.zIndex = '9999';
        uiContainer.style.backgroundColor = '#fff';
        uiContainer.style.border = '1px solid #ccc';
        uiContainer.style.padding = '10px';
        uiContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        uiContainer.style.borderRadius = '5px';
        document.body.appendChild(uiContainer);

        // タイトル
        const title = document.createElement('h3');
        title.textContent = 'ストーリーポイント';
        uiContainer.appendChild(title);

        // 保存するボタン
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        uiContainer.appendChild(saveButton);

        // 一覧表示ボタン
        const listButton = document.createElement('button');
        listButton.textContent = '一覧';
        uiContainer.appendChild(listButton);

        // 一括クリアボタン
        const clearButton = document.createElement('button');
        clearButton.textContent = '一括クリア';
        uiContainer.appendChild(clearButton);

        // 保存ボタンクリック時の処理
        saveButton.onclick = function() {
            const titleElement = document.querySelector('#summary .title-group__title-text .markdown-body');
            const storyPointElements = document.querySelectorAll('.ticket__properties-item.-custom-field');

            let storyPoints = [];

            // ストーリーポイントを取得
            storyPointElements.forEach(item => {
                const label = item.querySelector('.ticket__properties-label');
                if (label && label.innerText.includes('ストーリーポイント')) {
                    const value = item.querySelector('.ticket__properties-value span');
                    if (value) {
                        storyPoints.push(parseInt(value.innerText.trim(), 10));
                    }
                }
            });

            if (titleElement) {
                const title = titleElement.innerText.trim();
                const currentData = JSON.parse(localStorage.getItem('storyPointsData')) || [];
                currentData.push({ title: title, points: storyPoints });
                localStorage.setItem('storyPointsData', JSON.stringify(currentData));
                alert('タイトルとストーリーポイントを保存しました。');
            } else {
                console.error('タイトルが見つかりません。');
            }
        };

        // 一覧表示ボタンクリック時の処理
        listButton.onclick = function() {
            const savedData = JSON.parse(localStorage.getItem('storyPointsData')) || [];
            if (savedData.length === 0) {
                alert('保存されたデータはありません。');
                return;
            }

            // 保存されたデータの表示用コンテナを作成
            const listContainer = document.createElement('div');
            listContainer.style.position = 'fixed';
            listContainer.style.top = '50px';
            listContainer.style.right = '10px';
            listContainer.style.zIndex = '9999';
            listContainer.style.backgroundColor = '#fff';
            listContainer.style.border = '1px solid #ccc';
            listContainer.style.padding = '10px';
            listContainer.style.maxHeight = '300px';
            listContainer.style.overflowY = 'auto';
            listContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            listContainer.style.borderRadius = '5px';
            document.body.appendChild(listContainer);

            // タイトル
            const listTitle = document.createElement('h4');
            listTitle.textContent = '保存されたストーリーポイント';
            listContainer.appendChild(listTitle);

            // 閉じるボタン
            const closeButton = document.createElement('button');
            closeButton.textContent = '閉じる';
            closeButton.style.marginBottom = '10px';
            closeButton.onclick = function() {
                listContainer.remove();
            };
            listContainer.appendChild(closeButton);

            // 保存されたデータをリストとして表示
            let totalPoints = 0; // ストーリーポイントの合計値
            savedData.forEach((item, index) => {
                const itemContainer = document.createElement('div');
                itemContainer.style.display = 'flex';
                itemContainer.style.justifyContent = 'space-between';
                itemContainer.style.alignItems = 'center';
                itemContainer.style.padding = '5px';
                itemContainer.style.borderBottom = '1px solid #ccc';
                itemContainer.textContent = `${item.points.join(', ')} | ${item.title}`;

                // ストーリーポイントを合計
                totalPoints += item.points.reduce((acc, point) => acc + point, 0);

                // 削除ボタンを作成
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '削除';
                deleteButton.style.marginLeft = '10px';
                deleteButton.onclick = function() {
                    // アイテムを削除
                    savedData.splice(index, 1);
                    localStorage.setItem('storyPointsData', JSON.stringify(savedData));
                    alert('データを削除しました。');
                    // 表示を更新
                    listContainer.remove();
                    listButton.click(); // 一覧表示ボタンを再度クリックして更新
                };

                itemContainer.appendChild(deleteButton);
                listContainer.appendChild(itemContainer);
            });

            // 合計ポイントを表示
            const totalPointsContainer = document.createElement('div');
            totalPointsContainer.style.padding = '5px';
            totalPointsContainer.style.fontWeight = 'bold';
            totalPointsContainer.textContent = `合計ストーリーポイント: ${totalPoints}`;
            listContainer.appendChild(totalPointsContainer);
        };

        // 一括クリアボタンクリック時の処理
        clearButton.onclick = function() {
            if (confirm('保存されたデータを全てクリアしますか？')) {
                localStorage.removeItem('storyPointsData');
                alert('データがクリアされました。');
            }
        };
    }
})();
