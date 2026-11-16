# ALSKwela A&E 2027 — JHS LS6 Digital Citizenship

## Publish to GitHub Pages

1. Create a new public repository, for example: `alskwela-ls6-digital-reviewer-jhs`.
2. Extract this ZIP and upload every file to the repository root (not an enclosing subfolder).
3. Enable Settings → Pages → Deploy from a branch → main → /(root).
4. Open the HTTPS site directly in Android Chrome while connected. Reload and confirm **Offline files saved successfully**.
5. Install from Chrome's menu, or save a Home Screen shortcut where installation is not available.
6. Test using airplane mode: restart the reviewer, complete a question, and export a PDF report.
7. In ALSKwela (Glide), attach the live URL to an Open Link action. Offline use requires opening the separately cached app/shortcut, not Glide itself.

## App identity
- Full name: JHS ALS A&E Reviewer LS 6 - Digital Citizenship
- Home Screen label: JHS A&E LS6 Digital
- Storage and cache names are distinct from all other strands.

## Contents
- index.html — complete reviewer and embedded 120-item question bank
- question_bank_120.json — educator/app-development data copy
- manifest.webmanifest — installable PWA configuration
- sw.js — offline cache controller
- icon-192.png and icon-512.png — app icons

## Reviewer features
- Fixed sets A, B, C (40 items each) and 40-item randomized trials
- 12 Easy, 20 Moderate, 8 Challenging; five-domain representation
- Options shuffled within each trial; answer checking and professional Taglish feedback
- Progress saved locally on the device and resume capability
- Score summary and separate competency-domain performance
- Learner PDF (no external JavaScript libraries) and Print / Save as PDF

## Safeguards
- Source-aligned original mock items; not official A&E 2027 exam content.
- Question difficulties are judgmental estimates until pilot data is analyzed.
- Subject-matter expert review is required before broad learner distribution.
- Offline availability depends on browser storage retention. Export reports before clearing app data or reinstalling.
- No learner data is transmitted to a server by this static reviewer.
