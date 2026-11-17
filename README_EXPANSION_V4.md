# ALSKwela Expandable Question Bank v4.0 — GitHub update

This update **does not add any exam questions**. It makes the app ready to accept additional JSON question sets later.
It preserves all original foundation questions (A–C), the same app name, saved sessions, offline support and the v3.3 three-section PDF.

## Initial deployment to your EXISTING repository
1. Back up the existing repository files (GitHub > Code > Download ZIP).
2. Extract this ZIP. Upload **all root files and the entire `bank/` folder**, keeping paths intact. Do not upload the ZIP as one file.
3. On GitHub, choose Add file > Upload files; drag the extracted content including the `bank` directory from the file explorer, or use GitHub Desktop so directory paths are retained. Commit to your publishing branch.
4. Open the existing `verify-update-v3.html` address in Chrome, select `Check and activate v4.0`, then reopen the installed app online.
5. In the app check for `Expandable Question Bank` and `Sets A–C`; complete a trial and export a three-section PDF, then confirm the app reopens in airplane mode.
6. Do not delete site data or uninstall the app: old progress is saved under its existing storage keys.

## To add Set D in the FUTURE — no HTML edit required
1. Prepare the required **40 JHS items** or **30 Elementary items** in `bank/sets/set_D_v1.json`.
2. Ensure the unique question IDs begin after the foundation range, and check the curriculum mapping and answer key.
3. Add `{"id":"D","file":"bank/sets/set_D_v1.json","version":"1.0"}` inside `bank/manifest.json` sets, and increase `bank_version`.
4. Run `python tools/validate_bank.py` before committing.
5. Upload only the new JSON file and changed `bank/manifest.json` to GitHub; retain directories.
6. Open the installed reviewer online and tap `Check for new question sets`; confirm Set D appears and then test it offline.

**Notes:** Foundation questions are duplicated intentionally: in the original embedded HTML for reliable offline continuity and in `bank/foundation.json` as an immutable archival export. Future sets live only in new JSON files. The existing randomized mode uses its original CG-balanced blueprint but can sample added questions mapped to the current competencies. If new official guidelines change competencies or test blueprint, revise the TOS and selection rules through a separately validated engine update first. The GitHub-hosted question bank is publicly inspectable; this is a practice reviewer, not a secure examination platform.
