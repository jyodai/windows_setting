// ==UserScript==
// @name         backlog_feature_branch
// @namespace    http://tampermonkey.net/
// @version      2024-06-25
// @description  try to take over the world!
// @author       You
// @match        https://*.backlog.jp/view/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    document.addEventListener("keydown", function(event) {
        if (((event.ctrlKey && !event.metaKey) || (!event.ctrlKey && event.metaKey)) &&  event.key === "m") {
             event.preventDefault();
            main();
        }
    });

    function main() {
        const ticketNumber = getTicketNumber();

        addButton("feature_branch", `feature/${ticketNumber}`, setMessageButton);
        addButton("create_feature_branch", `git switch -c feature/${ticketNumber}`, setFeatureBranchButton);
    }

    function getTicketNumber() {
        return document.getElementsByClassName('ticket__key-number')[0].innerText;
    }

    function addButton(buttonText, message, appendToFunction) {
        const button = createButton(buttonText, message);
        appendToFunction(button);
    }

    function createButton(buttonText, message) {
        const button = document.createElement("button");
        button.textContent = buttonText;

        button.addEventListener('click', () => {
            navigator.clipboard.writeText(message);
        });

        return button;
    }

    function setMessageButton(button) {
        const target = document.getElementById('project-header');
        target.prepend(button);
    }

    function setFeatureBranchButton(button) {
        const target = document.getElementById('project-header');
        target.prepend(button);
    }
})();
