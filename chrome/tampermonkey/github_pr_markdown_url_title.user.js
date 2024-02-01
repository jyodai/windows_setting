// ==UserScript==
// @name         github_pr_markdown_url_title
// @namespace    http://tampermonkey.net/
// @version      2024-01-05
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*/pull/*
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
        const messageButton = createButton();
        setMessageButton(messageButton);
    }

    function createButton() {
         const element = document.createElement("button");
        element.textContent = "markdown_url_title";

        element.addEventListener('click', () => {
            navigator.clipboard.writeText(createMessage());
        })
        return element;
    }

    function createMessage() {
        const url = location.href ;
        const title = document.getElementById('partial-discussion-header')
        .getElementsByTagName('h1')[0].
        getElementsByTagName('bdi')[0].
        innerHTML;

        const message = `[${title}](${url})`;
        return message;
    }

    function setMessageButton(button) {
        const target =  document.getElementById('partial-discussion-header');
        target.prepend(button);
    }
})();
