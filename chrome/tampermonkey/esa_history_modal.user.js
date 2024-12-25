// ==UserScript==
// @name         esa_history_modal_with_search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display and manage page history with search across esa.io
// @author       You
// @match        https://*.esa.io/*
// @grant        none
// ==/UserScript==

(function() {
    // 関数定義：履歴を保存する（esa.io/posts/* のみで動作）
    function saveHistoryIfNeeded() {
        const path = window.location.pathname;
        // URLが/posts/を含む場合のみ動作
        if (!path.startsWith('/posts/')) return;

        let title = document.querySelector('title').innerText;
        // タイトルから "[WIP]" 文字列を削除する
        title = title.replace(/\[WIP\]\s*/g, '');

        // タイトルが "Edit post" で始まる場合は保存しない
        if (title.startsWith('Edit post')) return;

        let url = window.location.href;
        let history = localStorage.getItem('esaHistoryStorage');
        history = history ? JSON.parse(history) : [];

        // 同名のタイトルがある場合はその履歴を削除する
        history = history.filter(item => item.title !== title);

        // 新しい履歴を先頭に追加
        history.unshift({ title: title, url: url });

        // 履歴が1000件を超えた場合は末尾の履歴を削除
        if (history.length > 1000) {
            history.pop();
        }

        localStorage.setItem('esaHistoryStorage', JSON.stringify(history));
    }

    // 関数定義：モーダルを表示する
    function showModal() {
        let modalHtml = `
            <div id="esaHistoryModal" class="esaHistoryModal">
                <div class="esaHistoryModalContent">
                    <span class="esaHistoryClose">&times;</span>
                    <h2>履歴</h2>
                    <input type="text" id="esaHistorySearch" placeholder="Search history..." style="width: 100%; padding: 8px; margin-bottom: 10px;">
                    <ul id="esaHistoryList"></ul>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // イベントリスナー：閉じるボタン
        let close = document.querySelector('.esaHistoryClose');
        close.onclick = () => document.getElementById('esaHistoryModal').style.display = "none";

        // イベントリスナー：モーダル外のクリックで閉じる
        window.onclick = function(event) {
            if (event.target == document.getElementById('esaHistoryModal')) {
                document.getElementById('esaHistoryModal').style.display = "none";
            }
        };

        // 履歴検索機能
        document.getElementById('esaHistorySearch').addEventListener('input', function() {
            updateHistoryList(this.value);
        });

        updateHistoryList();
        document.getElementById('esaHistoryModal').style.display = "block";
    }

    // 関数定義：履歴リストを更新する
    function updateHistoryList(query = "") {
        let history = filterHistory(query);
        let historyHtml = history.map((item, index) => {
            // タイトルから "- xyz.esa.io" 形式のサフィックスを削除する
            let cleanedTitle = item.title.replace(/ - .*\.esa\.io$/, '');
            // インデックスを1から始まる番号に変換してタイトルの前に追加する
            return `<li><a href="${item.url}">${index + 1}: ${cleanedTitle}</a></li>`;
        }).join('');
        document.getElementById('esaHistoryList').innerHTML = historyHtml;
    }


    // 関数定義：クエリに基づいて履歴をフィルタリングする
    function filterHistory(query) {
        let history = JSON.parse(localStorage.getItem('esaHistoryStorage')) || [];
        if (!query) return history;
        return history.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
    }

    // ページロード時に履歴を保存するか判断
    window.addEventListener('load', saveHistoryIfNeeded);

    // ボタンとモーダルウィンドウのスタイルを定義
    const styleSheet = `
        .esaHistoryModal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
        }
        .esaHistoryModalContent {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
        }
        .esaHistoryClose {
            color: #aaaaaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        .esaHistoryClose:hover,
        .esaHistoryClose:focus {
            color: #000;
            text-decoration: none;
        }
    `;
    let styleTag = document.createElement('style');
    document.head.appendChild(styleTag);
    styleTag.textContent = styleSheet;

    // 履歴ボタンをナビゲーションバーに追加
    let buttonHtml = '<button id="esaShowHistory" style="margin-left: 20px;">履歴</button>';
    document.querySelector('.nav-user').insertAdjacentHTML('beforeend', buttonHtml);
    document.getElementById('esaShowHistory').addEventListener('click', showModal);
})();
