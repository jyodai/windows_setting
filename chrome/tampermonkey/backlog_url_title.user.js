// ==UserScript==
// @name         backlog_url_title
// @namespace    http://tampermonkey.net/
// @version      2024-01-05
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
        element.textContent = "url_title";

        element.addEventListener('click', () => {
            navigator.clipboard.writeText(message);
        })
        return element;
    }

    function createMessage() {
        const url = location.href ;
        const title =  document.getElementsByClassName('ticket__parent-group')[0].innerText;

        const message = `${title}
${url}`;
        return message;
    }

    function setMessageButton(button) {
        const target =  document.getElementById('root');
        target.prepend(button);
    }
})();
