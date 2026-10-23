# Telegram Web K Redirector

A powerful Tampermonkey UserScript that seamlessly intercepts Telegram (`t.me`) and custom file-sharing bot redirect links. It extracts hidden bot parameters from raw source code or URLs to bypass forced native app-download pages, routing you directly to Telegram Web K.

## 🚀 Features

* **Zero-Click Extraction:** Performs a background fetch of the raw HTML on custom file-sharing sites to extract hidden `botName` and `startId` variables before the page can force an app-download redirect.
* **Universal Scaling:** Automatically applies the background-fetch logic to any new site you add to the `@match` list—no complex code changes required.
* **Smart Invite Handling:** Detects private Telegram invite links (`t.me/+hash`) and temporarily disables auto-redirects, preserving the manual "Join Channel" button mode.
* **Clean Transition UI:** Replaces broken custom landing pages with a clean, customizable 3-second countdown screen before routing to Web K via the `tgaddr` parameter.
* **Seamless Updates:** Includes built-in `@updateURL` tags for automatic background updates via GitHub Pages.

## 📦 Installation

1. Install a user script manager extension for your browser, such as [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. [**Click here to install the script**](https://arafatislam.github.io/archive/userscripts/telegram-web-k-redirector.user.js).
3. Your script manager will automatically open an installation tab. Click **Install**.

## 🌐 Default Supported Sites

The script works out-of-the-box for:
* `https://t.me/*`
* `https://filesgram.xyz/*`
* `https://tgfiles.space/*`

## 🛠️ How to Add New Custom Sites

If you encounter a new file-sharing bot site, you only need to add its domain to the top of the script. The universal logic will handle the rest automatically.

1. Open your Tampermonkey dashboard and edit the script.
2. Add a new `@match` line in the metadata block at the top:
   ```javascript
   // @match        https://t.me/*
   // @match        https://filesgram.xyz/*
   // @match        https://tgfiles.space/*
   // @match        https://newbotsite.com/*
   ```
3. Save the script (Ctrl+S / Cmd+S).

---
**Author:** Arafat
*[Return to main archive](../README.md)*
