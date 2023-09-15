/*
TwGPT 1.0
Copyright (C) 2023 Naveed ur Rehman
*** Read the license.txt file ***
twitter.com/@getorhack | naveedurrehman.com
*/

document.addEventListener("DOMContentLoaded", init);

const DEFAULT_PROMPT = "Write a very short, one-line valuable and insightful reply for the following tweet of my friend in '#tone#'. The reply should sound like a casual talk. Use a simple language that a 12-year old can easily understand. Don't sound cheesy. Do not start with 'Reply:'\r\nTweet: '#tweet#'";

function init() {
    document.getElementById('btnsave').addEventListener("click", function () { btnsave(); });

    chrome.storage.sync.get(["apikey"]).then((result) => {
        if (result.apikey != undefined) {
            document.getElementById("apikey").value = result.apikey;
        }
    });

    chrome.storage.sync.get(["prompt"]).then((result) => {
        if (result.apikey != undefined) {
            document.getElementById("prompt").value = result.prompt;
        } else {
            document.getElementById("prompt").value = DEFAULT_PROMPT;
        }
    });
}

function btnsave() {
    if (!document.getElementById("apikey").value) {
        alert('Provide the valid API key.');
        return;
    }

    chrome.storage.sync.set({ apikey: document.getElementById("apikey").value });

    if (!document.getElementById("prompt").value) {
        alert('Provide the valid prompt.');

        return;
    }

    chrome.storage.sync.set({ prompt: document.getElementById("prompt").value });

    console.log('Settings are saved.');

    window.close();
}