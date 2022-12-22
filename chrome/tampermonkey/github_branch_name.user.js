// ==UserScript==
// @name         github_branch_name
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  feature/issue-9999 の形式でブランチを作成可能にする
// @author       You
// @match        https://github.com/*/issues/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xsrv.jp
// @grant        none
// ==/UserScript==

(function() {
    const defaultButton = getDefaultButton();
    const renameButton  = createRenameButton();
    defaultButton.parentNode.append(renameButton);

    function getDefaultButton() {
        const elements = getSideElement();
        return elements[0];
    }
    function createRenameButton () {
        const element = document.createElement("button");
        element.textContent = "Create a branch(feature/issue-9999)";
        element.classList.add('btn-link');

        element.addEventListener('click', () => {
            const defaultButton = getDefaultButton();
            defaultButton.click();
            const handle = setInterval(() => {
                if (changeBranchName()) {
                    clearInterval(handle);
                }
            }, 100);
            changeBranchName();

        })

        return element;
    }
    function getSideElement () {
        return document.getElementById('partial-discussion-sidebar').querySelectorAll('[data-action]');
    }
    function changeBranchName () {
        const element = document.querySelector('[aria-label="Branch name"]');
        if (element === null) {
            return false;
        }
        const issue = element.placeholder.match(/^[0-9]+/g);
        element.value = `feature/issue-${issue}`;
        return true;
    }
})();