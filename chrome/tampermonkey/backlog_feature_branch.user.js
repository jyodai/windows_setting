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
        const message = createMessage();
        const messageButton = createMessageButton(message);
        setMessageButton(messageButton);
    }

    function createMessageButton(message) {
         const element = document.createElement("button");
        element.textContent = "feature_branch";

        element.addEventListener('click', () => {
            navigator.clipboard.writeText(message);
        })
        return element;
    }

    function createMessage() {
        const url = location.href ;
        const number = document.getElementsByClassName('ticket__key-number')[0].innerText;

        return `feature/${number}`;
    }

    function setMessageButton(button) {
        const target =  document.getElementById('project-header');
        target.prepend(button);
    }
})();
