# Smart21network school server

A tiny server (Node 18+, no packages to install) that gives your school:
accounts for teachers and students, cloud saves, classes with join codes, assignments with deadlines,
submissions (with the anti-cheat fingerprint) and a teacher dashboard.

```
node server/s21-server.js                       # http://localhost:8787
PORT=9000 DATA=/var/s21/data.json node server/s21-server.js
```
Data is one JSON file (`s21-data.json` next to the script by default). Back it up.

## In the app
**Plus → Cloud and class…**
* Teacher: create a class → give students the 6-letter code → build a lab → "Assign the lab in the current tab" (with deadline) → **Dashboard** (progress per student, class average, CSV, submissions for anti-cheat).
* Student: join with the code → **Open** the assignment (opens in a new tab) → do the work → **Submit my work**.
* Both: **Cloud saves** to continue on another computer.

## Before using it on the internet
* Put it behind HTTPS (Caddy, nginx, Cloudflare Tunnel). Passwords travel in the request body.
* Passwords are stored as salted scrypt hashes. Tokens last 30 days. There is a simple per-IP rate limit.
* There is no email reset: a teacher who forgets a password needs the data file edited (or a new account).
* Teachers can see only their own classes. Students can see only classes they joined.

## API (JSON)
`POST /api/register|login` · `GET /api/me` · `GET|PUT|DELETE /api/cloud[/slot]` · `POST|GET /api/classes` · `POST /api/classes/join` ·
`POST|GET /api/assignments`, `GET|DELETE /api/assignments/:id` · `POST /api/results` · `GET /api/dashboard?class=CODE` · `GET /api/submissions?class=CODE` ·
`POST /api/lab-results` (no login, used by "Send results to teacher") · `GET /api/health`.
