# ALSKwela JHS LS6 Digital — Time Tracking Patch v4.0.2

This patch upgrades the three-section Learning Report (v3.4) to show:

- **Date and Time Started** — recorded when the learner begins a new trial.
- **Date and Time Finished** — recorded on finishing the final question.
- **Total Elapsed Time** — duration from start to finish, including breaks and periods away from the app.

Times display in Philippine Time (PHT; Asia/Manila), based on timestamps saved locally on the learner's device. The timing fields are shown in section 01, Performance Snapshot, in **Download PDF** and **Print / Save as PDF**.

## Deploy without erasing existing learner progress
1. Back up your current repository / original working files.
2. Extract this ZIP and upload the updated `index.html`, `sw.js`, `report-v3-check.json`, `verify-update-v3.html` to the **root of the EXISTING GitHub repository**. Replace the four files.
3. DO NOT DELETE the `bank/` folder, app icons, manifest or other files.
4. Commit to the GitHub Pages publishing branch (usually `main`).
5. Once deployed, visit `https://<your-domain>/<your-repo>/verify-update-v3.html` in Chrome and select **Check and activate v4.0.2**.
6. Open the reviewer, complete a new practice trial, and download/print the report.
7. Verify that the three timing fields appear under **01 Performance Snapshot**. Test again in airplane mode.

## Important
- No learner questions, correct answers, IDs, or feedback are changed.
- Existing trial start and finish timestamps already captured by v4.x are used where present.
- Unfinished trial start timestamps persist when a learner resumes.
- Elapsed time is NOT active engagement time. If a learner closes the app for hours, that time is counted. Device clock changes could also make timestamps unreliable.
- PDF timing is indicative evidence, not a tamper-proof proctoring or attendance record.
- Do not clear browser site data; it can erase saved practice progress.
