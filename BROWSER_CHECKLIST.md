# Browser acceptance check

Run in Edge/Chrome, then check another supported browser if you intend to use it.

1. Open `index.html`. Confirm the black sidebar, white cards and blue controls are visible; resize to phone width and check for horizontal overflow.
2. Select a topic and start 10 questions. Check one correct and one incorrect answer. Confirm both explanations have working official Cisco links.
3. Choose the drag-and-drop format. Drag a chip to a row, then move it to another row. Confirm the first row clears. Complete another mapping using only the keyboard dropdowns.
4. Flag a question, finish practice, and open Review. Check both the missed and flagged filters. Correctly retry a miss; verify the miss clears while its flag remains until manually cleared.
5. Start a timed exam. Answer, flag, and navigate back. Confirm there are no explanations before submission. Refresh and confirm saved answers, flags and original remaining time.
6. Submit with some unanswered items. Confirm all exam questions are scored and unanswered items are incorrect. Review the domain breakdown and flagged-only filter.
7. For deadline testing in development, change the saved active session's deadline to the immediate past in browser developer tools, then reload. Confirm it submits once and does not restart the timer. Do not use altered-clock sessions for genuine practice records.
8. Complete at least 3 different questions in one topic, with fewer than 75% correct. Confirm it appears under Low-scoring topics; an untouched topic must not appear as weak.
9. Export progress. Import the same file twice and confirm totals do not double. Open the app in another browser profile and import it to confirm transfer.
10. Run `node server.js`. Visit the dashboard and the three `*.ccna.localhost:8080` mode addresses. Check that the expected mode opens and results appear on the dashboard after completing practice on the topic subdomain. Clear a flag in one mode and confirm that it stays cleared in another.
11. Test with browser storage blocked. Verify the app warns that persistence or sharing is unavailable and that export remains usable.
12. Close and reopen the same app location. Confirm that completed history and an unfinished practice session remain available.
