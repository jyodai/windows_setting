// ==UserScript==
// @name         github_pr_custom
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xsrv.jp
// @grant        none
// ==/UserScript==

(function() {
    main()

    function main () {
        const turboFrames = getTurboFrame();
        setMenu(turboFrames);
    }

    function getTurboFrame () {
        const discussion = document.getElementById('discussion_bucket');
        const turboFrames = discussion.getElementsByTagName("turbo-frame");
        return turboFrames;
    }

    function setMenu (frames) {
        for(let i = 0; i < frames.length; ++i) {
            setCopyFilePathBtn(frames[i]);
        }
    }

    function setCopyFilePathBtn (frame) {
        const filePath = getFilePath(frame);

        const element = document.createElement("button");
        element.textContent = "copy file path";
        element.classList.add('btn-link');

        element.addEventListener('click', () => {
            navigator.clipboard.writeText(filePath);
            element.textContent = filePath;
            setTimeout(
                () => {element.textContent = "copy file path"},
                3000
            );
        })

        frame.parentNode.insertBefore(element, frame);
    }

    function getFilePath (frame) {
        const summaries = frame.getElementsByTagName("summary");

        const a = summaries[0].getElementsByTagName("a");
        return a[0].title;
    }
})();