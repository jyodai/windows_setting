// ==UserScript==
// @name         esa_markdown_url_title
// @namespace    http://tampermonkey.net/
// @version      2024-01-05
// @description  try to take over the world!
// @author       You
// @match        https://*.esa.io/posts/*
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
        element.textContent = "markdown url title";

        element.addEventListener('click', () => {
            navigator.clipboard.writeText(message);
        })
        return element;
    }

    function createMessage() {
        const url = location.href ;
        const title =  document.getElementsByClassName('post-title')[0].innerText;

        const message = `[${title.trim()}](${url})`;
        return message;
    }

    function setMessageButton(button) {
        const target =  document.getElementsByClassName('layout-app__content ')[0];
        target.prepend(button);
    }
})();
