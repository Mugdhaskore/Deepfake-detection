# Deepfake Detection Web Demo

This folder contains a standalone demo website for deepfake detection of images and videos.

## Files

- `index.html` - Main page structure with header, upload section, report preview, and footer.
- `styles.css` - Visual design, animated background, responsive layout, and UI polish.
- `script.js` - Upload interactions, simulated analysis, and sample report rendering.

## How to use

1. Open `index.html` in your browser.
2. Click `Choose image or video` and select a supported file.
3. Press `Analyze now` to simulate a detection report.

## Notes

- The current page uses sample report results for demonstration only.
- You can integrate a real detection API by replacing the simulated `setTimeout` in `script.js` with a network request.
- This UI is mobile-friendly and built to be easy to customize for production use.
