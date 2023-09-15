/*
TwGPT 1.0
Copyright (C) 2023 Naveed ur Rehman
*** Read the license.txt file ***
twitter.com/@getorhack | naveedurrehman.com
*/

const tones = [
    { "emoji": "👍", "tone": "Appreciative" },
    { "emoji": "🤔", "tone": "Thoughtful" },
    { "emoji": "😊", "tone": "Good" },
    { "emoji": "🤝", "tone": "Friendly" },
    { "emoji": "👎", "tone": "Disagreement" },
    { "emoji": "😏", "tone": "Sarcastic" },
    { "emoji": "🔥", "tone": "Passionate" },
    { "emoji": "💲", "tone": "Luxurious" },
    { "emoji": "😐", "tone": "Average" },
    { "emoji": "✨", "tone": "Fabulous" },
    { "emoji": "🧑‍💼", "tone": "Professional" },
    { "emoji": "🎩", "tone": "Witty" },
    { "emoji": "😄", "tone": "Funny" },
    { "emoji": "😌", "tone": "Relaxed" },
    { "emoji": "💪", "tone": "Bold" },
    { "emoji": "🏝️", "tone": "Adventurous" },
    { "emoji": "🧠", "tone": "Persuasive" },
    { "emoji": "🤗", "tone": "Empathetic" },
    { "emoji": "❤️", "tone": "Compassionate" },
    { "emoji": "🤩", "tone": "Enthusiastic" },
    { "emoji": "😁", "tone": "Joyful" },
    { "emoji": "🌟", "tone": "Inspirational" },
    { "emoji": "📚", "tone": "Informative" },
    { "emoji": "👍", "tone": "Convincing" },
    { "emoji": "🚨", "tone": "Urgent" },
    { "emoji": "😨", "tone": "Worried" },
    { "emoji": "🙇‍♂️", "tone": "Humble" },
    { "emoji": "😎", "tone": "Casual" },
    { "emoji": "😂", "tone": "Humorous" }
];

var OPENAI_KEY = '';
var PROMPT_TEMPLATE = '';

document.addEventListener('DOMContentLoaded', function () {
    setInterval(function () { inject(); }, 1000);
    sync();
});

function inject() {

    var injectid;
    var articles = document.body.querySelectorAll('article');
    [].forEach.call(articles, function (article) {
        if (!article.hasAttribute("loaded")) {
            injectid = getRandomId();
            article.setAttribute("loaded", true);
            article.setAttribute("injectid_article", injectid);
        }
    })

    injectid = '';
    var allElements = document.body.querySelectorAll('*');
    [].forEach.call(allElements, function (element) {
        if (element.hasAttribute("injectid_article")) {
            injectid = element.getAttribute("injectid_article");
        }
        if (injectid != '' && document.body.querySelector('[injectid_article="' + injectid + '"]').querySelector('[data-testid="tweetText"]').textContent) {
            if (!element.hasAttribute("loaded") && element.getAttribute("data-testid") == "tweetTextarea_0") {
                element.setAttribute('loaded', true);
                element.setAttribute('injectid_textbox', injectid);
            }

            if (!element.hasAttribute("loaded") && element.getAttribute("data-testid") == "toolBar") {
                element.setAttribute("loaded", true);

                var select = document.createElement("select");
                select.setAttribute('injectid_select', injectid);
                select.classList.add("inject_select");
                select.innerHTML = '<option value="">Generate Reply using TwGPT?</option>';
                for (let i = 0; i < tones.length; i++) {
                    value = tones[i];
                    select.innerHTML += '<option value="' + value['tone'] + '">' + value['emoji'] + ' ' + value['tone'] + '</option>';
                }
                select.onchange = async function () {
                    if (OPENAI_KEY == '') {
                        alert('OpenAI API key is not provided.');
                        return;
                    }
                    if (PROMPT_TEMPLATE == '') {
                        alert('Prompt is not provided.');
                        return;
                    }
                    const injectid = this.getAttribute('injectid_select');
                    const textbox = document.body.querySelector('[injectid_textbox="' + injectid + '"]');
                    const article = document.body.querySelector('[injectid_article="' + injectid + '"]');
                    const tweet = article.querySelector('[data-testid="tweetText"]').textContent;
                    const tone = this.value;
                    if (tone == '') { return; }
                    var prompt = PROMPT_TEMPLATE;
                    prompt = replaceText('#tone#', tone, prompt);
                    prompt = replaceText('#tweet#', tweet, prompt);

                    this.classList.add('inject_disabled');

                    var reply = await chatGPT(prompt);
                    reply = removeHashtags(reply);
                    reply = removeQuotes(reply);
                    write(textbox, reply);
                    this.classList.remove('inject_disabled');

                };
                element.prepend(select);
            }
        }
    })


}

async function chatGPT(prompt) {

    const url = 'https://api.openai.com/v1/chat/completions';
    const postFields = {
        "model": "gpt-3.5-turbo",
        "messages": [{
            "role": "user",
            "content": prompt
        }],
        "max_tokens": 2000,
        "top_p": 1,
        "temperature": 1
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPENAI_KEY
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(postFields),
    });

    const result = await response.json();

    let r = '';
    if (result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content) {
        r = result.choices[0].message.content;
    }

    return r;
}

function getRandomId(length = 10) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    var rId = result + String(parseInt(Math.random() * (999999 - 111111) + 111111));
    return (rId);
}

function replaceText(placeholder, replacement, inputString) {
    const regex = new RegExp(placeholder, "g");
    return inputString.replace(regex, replacement);
}

function removeHashtags(text) {
    return text.replace(/#[^\s]+/g, '');
}

function removeQuotes(str) {
    return str.replace(/^['"]+|['"]+$/g, '');
}

function write(control, text) {
    r = new DataTransfer;
    r.setData("text/plain", text), null == control || control.dispatchEvent(new ClipboardEvent("paste", {
        dataType: "text/plain",
        data: text,
        bubbles: !0,
        clipboardData: r,
        cancelable: !0
    }));
}

function sync() {
    chrome.storage.sync.get(["apikey"]).then((result) => {
        if (result.apikey == undefined || result.apikey == '') {
            console.log('API key is not provided.');
        }
        else {
            OPENAI_KEY = result.apikey;
        }
    });

    chrome.storage.sync.get(["prompt"]).then((result) => {
        if (result.prompt == undefined || result.prompt == '') {
            console.log('Prompt is not provided.');
        }
        else {
            PROMPT_TEMPLATE = result.prompt;
        }
    });

}