// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Make version of this Electron App accessable for the Web App so it can react to it.

const { shell } = require("electron").remote;

window.engineVersion = require("./package.json").version;

const $webview = document.querySelector("webview");
const $loader = document.querySelector(".loader");
let isInitialLoad = true;

$webview.src = "https://colorganize.com/index.php?engineVersion=" + engineVersion;
// $webview.src = "http://localhost/colorganize-with-react/index.php?engineVersion=" + engineVersion;
// $webview.src = "http://localhost:90/wegdamit/colorganize-with-react/index.php?engineVersion=" + engineVersion;

$webview.addEventListener("did-start-loading", () => {
    // we use client side rendering in the web app, so the loader is only needed on the first page load
    if (isInitialLoad) {
        $webview.classList.add("hide");
        $loader.classList.remove("loader-hide");
        isInitialLoad = false;
    }
});

$webview.addEventListener("dom-ready", () => {
    $webview.classList.remove("hide");
    // have to delay in order for the webview show/resize to settle
    setTimeout(() => {
        $loader.classList.add("loader-hide");
    }, 100);
});

$webview.addEventListener("new-window", event => {
    const protocol = require("url").parse(event.url).protocol;

    if (protocol === "http:" || protocol === "https:") {
        shell.openExternal(event.url);
    }
});