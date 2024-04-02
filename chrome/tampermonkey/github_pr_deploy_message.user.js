// ==UserScript==
// @name         github_pr_deploy_message
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Copy GitHub PR information to clipboard on click
// @author       You
// @match        https://github.com/*/*/pull/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    document.addEventListener("keydown", function(event) {
        if (((event.ctrlKey && !event.metaKey) || (!event.ctrlKey && event.metaKey)) &&  event.key === "m") {
            event.preventDefault();
            main();
        }
    });

    function main () {
        const messageButton = createButton();
        setMessageButton(messageButton);
    }

    // ボタンを作成する関数
    function createButton() {
         const element = document.createElement("button");
        element.textContent = "deploy_message";

        element.addEventListener('click', () => {
            navigator.clipboard.writeText(createMessage());
        })
        return element;
    }

    function createMessage() {
        const repoName = document.location.pathname.split('/')[2];
        const prTitle = document.querySelector('.js-issue-title').textContent.trim();

        const now = new Date();
        const endDate = new Date(now.getTime() + 30*60000); // 30分後

        const startFormat = formatDate(now);
        const endFormat = formatDate(endDate);

        return `■対象サイト
${repoName}
■日時
${startFormat} ~ ${endFormat.slice(-5)}
■対応案件
${prTitle}
`;
    }

    function formatDate(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = ('0' + date.getMinutes()).slice(-2); // 分が一桁の場合は0を追加
        return `${month}/${day} ${hours}:${minutes}`;
    }

    function setMessageButton(button) {
        const target =  document.getElementById('partial-discussion-header');
        target.prepend(button);
    }
})();

