// ==UserScript==
// @name         github_name_mapping
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add names to GitHub sidebar using local storage
// @author       You
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'GitHubUserMappings';

    // ローカルストレージに名前を保存または更新する
    function saveOrUpdateName(username, realName) {
        let mappings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        mappings[username] = realName;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
        displaySavedNames();
    }

    // ローカルストレージからユーザー名を削除する
    function deleteName(username) {
        let mappings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        delete mappings[username];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
        displaySavedNames();
    }

    // 入力フォームと保存された名前のリストを追加する
    function addInputForm() {
        const sidebar = document.querySelector('.Layout-sidebar');
        if (sidebar) {
            const form = document.createElement('div');
            form.innerHTML = `
                <div style="padding: 10px; margin-top: 20px; border: 1px solid #e1e4e8;">
                    <label for="username">GitHub Username:</label><br>
                    <input type="text" id="username" name="username" style="width: 100%;"><br>
                    <label for="realname">Real Name:</label><br>
                    <input type="text" id="realname" name="realname" style="width: 100%;"><br>
                    <button id="saveBtn" style="margin-top: 10px;">Save/Update</button>
                    <button id="deleteBtn" style="margin-top: 10px;">Delete</button>
                    <div id="savedNames"></div>
                </div>
            `;
            sidebar.appendChild(form);

            document.getElementById('saveBtn').addEventListener('click', function() {
                const username = document.getElementById('username').value;
                const realName = document.getElementById('realname').value;
                saveOrUpdateName(username, realName);
            });

            document.getElementById('deleteBtn').addEventListener('click', function() {
                const username = document.getElementById('username').value;
                deleteName(username);
            });
        }
    }

    // 保存された名前を表示する
    function displaySavedNames() {
        const savedNamesEl = document.getElementById('savedNames');
        savedNamesEl.innerHTML = '<div style="margin-top: 10px;">';
        let mappings = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        for (let username in mappings) {
            savedNamesEl.innerHTML += `<strong>${username}</strong>: ${mappings[username]}<br>`;
        }
         savedNamesEl.innerHTML += '</div>';
    }

    addInputForm();
    displaySavedNames();
})();
