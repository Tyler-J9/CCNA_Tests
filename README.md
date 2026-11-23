# CCNA_Tests

## Packet Practice — CCNA Lab

A black, white and blue CCNA 200-301 v1.1 practice app with 420 original practice items, organized around topics in Jeremy’s IT Lab. All question data ships with the app. No account, database, package download or paid service is required to use it.

## Quick start: standalone app

Open `index.html` in Edge, Chrome or another modern desktop browser. It contains the entire app and bank, and works without a network connection. Cisco reference links require Internet access. Keep the file in the same location and use the same browser profile to retain its local progress. If your browser restricts storage for local files, the app shows a warning; export your progress before closing, or use the local server below.

The standalone file switches modes within one page. It does **not** create public subdomains.

## Separate subdomains on your computer

With Node.js 20 or newer installed:

1. Extract this folder from the ZIP.
2. On Windows, double-click `start.cmd`. Alternatively, open a terminal in this folder and run `node server.js` (or `npm start`). No `npm install` is needed.
3. Keep the terminal open and open **http://ccna.localhost:8080** in Edge or Chrome.

| Mode | Local address |
| --- | --- |
| Title page / dashboard | http://ccna.localhost:8080 |
| Topic practice | http://topics.ccna.localhost:8080 |
| Exam mode | http://exam.ccna.localhost:8080 |
| Weakness mode | http://weakness.ccna.localhost:8080 |

Modern Chromium browsers resolve `.localhost` names to loopback. If your browser or local DNS policy does not, use the standalone file, or map those four hostnames to `127.0.0.1` in your local hosts file. The server listens only on `127.0.0.1` by default.

The three modes use a shared browser-storage bridge at the dashboard origin. The bridge accepts messages only from the configured mode origins. Results remain in the browser; the Node server does not receive or store them. Each origin keeps its active unfinished session locally. Changing the scheme, hostname, browser profile, or port changes the local storage context. A privacy setting that blocks the bridge can require Export / Import instead.

## Run with Docker

With Docker Desktop running, open a terminal in this folder and run:

```powershell
docker compose up -d --build
```

Then open **http://ccna.localhost:8080**. Docker runs Node.js in a container, so Node.js does not need to be installed on Windows. The topic, exam, and weakness subdomains work as in the local Node setup. See [`DOCKER.md`](./DOCKER.md) for shutdown, logs, and troubleshooting instructions.

## Modes and behavior

- **Topic practice:** choose any combination of topics, session length, format, and unattempted-only filtering. Select an answer, then press **Check answer** for immediate feedback and a Cisco documentation link. Checking commits that attempt; moving away before checking does not score it.
- **Exam mode:** 60, 100 or 120 questions, with a configurable time limit. Default: 100 questions / 120 minutes. Domain quotas follow the published v1.1 weights. Exam selection includes multiple-selection, matching and output-based items without repeating a question within a session. Answers and explanations appear only after submission or timeout. The timer continues through refresh/closure; reopening after the deadline submits the saved answers.
- **Weakness mode:** topics below **75%** across their latest **20 attempts**, after at least **3 distinct questions** have been attempted in that recent window. Currently missed questions in those topics are prioritized. This is a study target, not a Cisco passing threshold.
- **Missed review:** includes questions whose latest attempt was incorrect. Answering one correctly on a later attempt clears it from the current missed list.
- **Flags:** independently track guessed or uncertain answers. A correct answer does not clear its flag. Exam flags become part of saved review when the exam ends.
- **Matching:** drag answer chips to rows or use the dropdowns with a mouse, touch or keyboard. Assigning an answer to a different row clears its previous assignment; each answer is used once.
- **Results & backup:** inspect session history, export progress to JSON, or import a backup. Import merges stable attempt IDs and prevents duplicate counting.

All questions are scored all-or-nothing. In exams, incomplete and unanswered questions are incorrect. In practice, unchecked questions are unscored. Question order and answer order are randomized; a saved session retains its answer ordering.

## Question bank and scope

There are **420 items**: 298 individually authored choice questions, 22 matching exercises, and 100 deterministic applied scenario variants. The final format mix is **379 single-answer, 19 multiple-selection, and 22 matching** questions. **100 items** contain CLI or structured-output exhibits (these overlap the format counts). Repeated scenario patterns provide drills with changed addresses, routes, policies or values; they are not 100 unrelated concepts.

| CCNA v1.1 domain | Bank items | Exam weight |
| --- | ---: | ---: |
| Network Fundamentals | 89 | 20% |
| Network Access | 72 | 20% |
| IP Connectivity | 89 | 25% |
| IP Services | 54 | 10% |
| Security Fundamentals | 63 | 15% |
| Automation & Programmability | 53 | 10% |
| Total | 420 | 100% |

Each item has a stable ID, topic, level, blueprint objective references, answer key, explanation and official Cisco reference. The references point to related concept/configuration sections; they are not representations that Cisco wrote the questions. CLI exhibits are simplified for interpretation. There is no live router CLI simulator. Keep doing Jeremy’s Packet Tracer labs alongside the quizzes.

This is independently authored practice, not a Cisco or Jeremy’s IT Lab product, live exam dump, or an official reproduction of exam scoring, interface behavior or question count. The v1.1 blueprint was checked on November 20, 2026. Jeremy’s topic names are used as a learning companion; no lesson-by-lesson completion is inferred.

- Official blueprint: https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf
- Official exam topics page: https://learningnetwork.cisco.com/s/ccna-exam-topics
- Jeremy’s course outline: https://courses.jeremysitlab.com/p/ccna
- Full Cisco reference directory: use **References** inside the app.

## Public subdomains

Public hosting is **not activated** by this package. A domain, DNS access, and an HTTPS-capable host are needed. The same application server supports all four addresses. For example, if your dashboard is `ccna.example.com`:

1. Point DNS for `ccna.example.com`, `topics.ccna.example.com`, `exam.ccna.example.com`, and `weakness.ccna.example.com` to your host.
2. Set `HOME_ORIGIN=https://ccna.example.com` and `PORT=8080` when starting `node server.js`.
3. Put an HTTPS reverse proxy in front of the server for all four hostnames. A `Caddyfile.example` is included. Replace every example hostname before using it. Preserve the incoming Host header.
4. Use the same HTTPS scheme and parent site for all modes so the browser-storage bridge stays same-site.
5. Validate all modes, refresh recovery, and cross-mode history in the browser you will use.

These steps publish only app code and the public practice bank. Browser-local history is not uploaded to this server. This is a personal study app, not a secure exam-delivery system: all answer keys necessarily ship to the client. It has no user accounts, server synchronization, analytics, or pass-guarantee model.

## Files and development

- `index.html`: standalone app, built with all assets inline.
- `questions.json`: readable bank and reference metadata.
- `build.py`: bank authoring, deterministic scenario generation, validation and HTML assembly.
- `engine.js`: scoring, weighted exam selection, weakness selection and history merging.
- `app.js`, `ui.html`: interaction and layout source.
- `server.js`: optional built-in Node HTTP server and trusted-origin local storage bridge.
- `tests/`: dependency-free Node tests and independent Python answer calculations.

After a source edit:

```sh
python3 build.py
npm test
python3 tests/validate_scenarios.py
node server.js
```

Stop/restart the server after rebuilding because it reads the HTML at startup. Windows can use `python` instead of `python3` if that is its configured Python command.

## Validation performed

25 automated tests passed covering the bank schema, exact-set scoring, matching completeness, weighted exam distribution and minimum format mix, no repeated exam items, recent weakness calculation, flags, persistence/reload, exam expiry, import merging, every question’s rendering/scoring flow, server hostname routing, and the bridge’s origin checks. 55 subnet, route-lookup and ACL answers were independently recomputed from the final question prompts.

App-flow and server tests use adapters; they do not open actual network sockets or run a real browser. Chromium could not launch in the build environment because the environment blocked required OS socket operations. Desktop/mobile visual rendering, native drag-and-drop, and browser-specific cross-subdomain storage behavior therefore remain to be checked in a real browser. A manual checklist is provided in `BROWSER_CHECKLIST.md`.
