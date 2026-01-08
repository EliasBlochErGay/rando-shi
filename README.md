# ASCII Webcam (rando-shi)

A tiny local web app that uses your webcam and renders it as ASCII art in real time.

- No uploads — everything runs in the browser.
- Works on localhost (camera permission required by the browser).

Quick start:

1. Run: `python main.py`
2. Grant camera permission when prompted.
3. Tune density, charset, color, and other controls.

Notes:
- Tested on modern Chromium-based browsers and Firefox on localhost.
- If your browser refuses camera access, make sure you are running on `http://localhost` (not `file://`).
