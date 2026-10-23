// ==UserScript==
// @name         Telegram Web K Redirector
// @namespace    http://tampermonkey.net/
// @version      21.0
// @description  Scans source code for any site in the @match list, handles t.me invite buttons properly.
// @author       Arafat
// @match        https://t.me/*
// @match        https://filesgram.xyz/*
// @match        https://tgfiles.space/*
// @updateURL    https://arafatislam.github.io/archive/userscripts/telegram-web-k-redirector.user.js
// @downloadURL  https://arafatislam.github.io/archive/userscripts/telegram-web-k-redirector.user.js
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const DELAY_SECONDS = 3; 

    function triggerDelayedRedirect(tgUrl) {
        window.stop(); 
        document.documentElement.innerHTML = `
            <html lang="en">
            <body style="display:flex; justify-content:center; align-items:center; height:100vh; margin:0; background-color:#1c1c1d; color:#ffffff; font-family:Arial, sans-serif;">
                <div style="text-align:center; padding:30px; border-radius:15px; background-color:#2c2c2e; box-shadow: 0 10px 20px rgba(0,0,0,0.5);">
                    <h2 style="margin: 0 0 15px 0; color:#3390ec;">🚀 Routing to Telegram Web K</h2>
                    <p style="margin: 0; font-size:16px; color:#a1a1aa;">Redirecting in <strong id="timer">${DELAY_SECONDS}</strong> seconds...</p>
                </div>
            </body>
            </html>
        `;

        let timeLeft = DELAY_SECONDS;
        const timerElement = document.getElementById('timer');
        const interval = setInterval(() => {
            timeLeft -= 1;
            if (timerElement) timerElement.innerText = timeLeft;
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);
            window.location.replace(`https://web.telegram.org/k/#?tgaddr=${encodeURIComponent(tgUrl)}`);
        }, DELAY_SECONDS * 1000);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const startIdFromUrl = urlParams.get('start');
    const urlBotName = urlParams.get('bot');
    const hostname = window.location.hostname;
    const isHomePage = window.location.pathname === '/' && window.location.search === '';

    // 1. INSTANT PARSE (If bot data is already clearly in the URL)
    if (urlBotName && startIdFromUrl) {
        const tgUrl = `tg://resolve?domain=${urlBotName}&start=${startIdFromUrl}`;
        triggerDelayedRedirect(tgUrl);
        return;
    }

    // 2. UNIVERSAL BACKGROUND FETCH (Runs on ANY site matched at the top EXCEPT t.me)
    if (hostname !== 't.me' && hostname !== 'web.telegram.org' && !isHomePage) {
        window.stop(); 
        fetch(window.location.href)
            .then(res => res.text())
            .then(html => {
                const botMatch = html.match(/(?:bootName|botName)\s*=\s*['"]([^'"]+)['"]/i);
                const startIdMatch = html.match(/(?:startId|start)\s*=\s*['"]([^'"]+)['"]/i);
                
                const finalStartId = startIdFromUrl || (startIdMatch ? startIdMatch[1] : 'Hi');

                if (botMatch && botMatch[1]) {
                    const tgUrl = `tg://resolve?domain=${botMatch[1]}&start=${finalStartId}`;
                    triggerDelayedRedirect(tgUrl);
                } else {
                    const tgMatch = html.match(/(tg:\/\/[^"'\s<>]+)/);
                    if (tgMatch && tgMatch[1]) {
                        triggerDelayedRedirect(tgMatch[1].replace(/&amp;/g, '&'));
                    } else {
                        document.open();
                        document.write(html);
                        document.close();
                    }
                }
            });
        return;
    }

    // 3. STANDARD LINK INTERCEPTOR (For t.me ONLY)
    if (hostname === 't.me') {
        const path = window.location.pathname;
        const isInviteLink = path.startsWith('/+') || path.startsWith('/joinchat/');

        if (!isInviteLink) {
            const observer = new MutationObserver(() => {
                const link = document.querySelector('a[href^="tg://"]');
                if (link) {
                    observer.disconnect();
                    triggerDelayedRedirect(link.getAttribute('href'));
                }
            });
            observer.observe(document, { childList: true, subtree: true });
        }

        document.addEventListener('click', function(event) {
            const link = event.target.closest('a');
            if (link && link.href && link.href.startsWith('tg://')) {
                event.preventDefault();
                triggerDelayedRedirect(link.href);
            }
        }, true);
    }
})();
