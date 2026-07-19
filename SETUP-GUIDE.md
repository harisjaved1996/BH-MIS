# Beaconhouse MIS — Setup Guide

This guide explains **everything you need to run the Beaconhouse MIS on a Windows laptop,
starting from zero** — no software installed, no technical background needed.
Just follow the steps in order. Total time: about 20–30 minutes (mostly downloads).

---

## Part 1 — Install the required software (one time only)

You need to install **two** free programs. Both are safe, official, and widely used.

### 1.1 Install Python (runs the application's server)

1. Open your web browser and go to: **https://www.python.org/downloads/**
2. Click the big yellow button **"Download Python 3.x.x"**.
3. Open the downloaded file.
4. **VERY IMPORTANT:** On the first screen of the installer, tick the checkbox at the
   bottom that says **"Add python.exe to PATH"** — do this BEFORE clicking Install.
5. Click **"Install Now"** and wait for it to finish, then click **Close**.

**Check it worked:** Press the **Windows key**, type `cmd`, press Enter to open the
black Command Prompt window, then type:

```
python --version
```

You should see something like `Python 3.12.4`. If you see an error, restart the laptop
and try again (or re-run the installer and make sure the PATH checkbox was ticked).

### 1.2 Install Node.js (runs the application's screens/UI)

1. Go to: **https://nodejs.org/**
2. Click the green **"LTS"** download button (LTS means the stable version).
3. Open the downloaded file and click **Next** through all the steps
   (the default options are fine), then **Finish**.

**Check it worked:** Open a new Command Prompt (Windows key → type `cmd` → Enter) and type:

```
node --version
```

You should see something like `v22.x.x`.

---

## Part 2 — Get the project onto the laptop

Choose ONE of these two options.

### Option A — Download as ZIP (easiest, no extra software)

1. Go to: **https://github.com/harisjaved1996/BH-MIS**
2. Click the green **"<> Code"** button → click **"Download ZIP"**.
3. Find the downloaded `BH-MIS-main.zip` in your Downloads folder.
4. Right-click it → **"Extract All..."** → extract it to `C:\` (or anywhere you like).
5. You now have a folder like `C:\BH-MIS-main`. That's the project folder —
   the rest of this guide calls it **the project folder**.

### Option B — Using Git (if you prefer)

Install Git from https://git-scm.com/download/win (default options), then in a
Command Prompt run:

```
cd C:\
git clone https://github.com/harisjaved1996/BH-MIS.git
```

The project folder is then `C:\BH-MIS`.

---

## Part 3 — First-time setup (one time only)

Open a Command Prompt (Windows key → `cmd` → Enter) and run these commands **one at a
time**, pressing Enter after each. Replace `C:\BH-MIS-main` with your actual project
folder if it's different.

**Step 1 — Go to the project folder:**

```
cd C:\BH-MIS-main
```

**Step 2 — Create the Python environment** (a private box for the app's Python tools):

```
python -m venv .venv
```

**Step 3 — Install the server's requirements** (takes 1–2 minutes):

```
.venv\Scripts\pip install -r requirements.txt
```

**Step 4 — Create the database** (also creates the login account and default grades/sessions):

```
cd backend
..\.venv\Scripts\python manage.py migrate
cd ..
```

**Step 5 — Install the UI's requirements** (takes 2–5 minutes, needs internet):

```
cd frontend
npm install
cd ..
```

Setup is done. You never need to repeat Part 1–3 again.

---

## Part 4 — Starting the application (every time you want to use it)

The application has two parts that must both be running: the **server** and the **UI**.
You need **two Command Prompt windows** open at the same time.

### Window 1 — Start the server

Open a Command Prompt and run:

```
cd C:\BH-MIS-main\backend
..\.venv\Scripts\python manage.py runserver
```

Leave this window open. You'll see a message like
`Starting development server at http://127.0.0.1:8000/`. That means it's running.

### Window 2 — Start the UI

Open a **second** Command Prompt (Windows key → `cmd` → Enter again) and run:

```
cd C:\BH-MIS-main\frontend
npm run dev
```

Leave this window open too. You'll see a message with `Local: http://localhost:5173/`.

### Open the application

Open your web browser (Chrome/Edge) and go to:

> **http://localhost:5173**

Log in with:

| Email | Password |
|---|---|
| `haris@gmail.com` | `beaconhouse` |

*(You can change this password from the "My Profile" page after logging in,
and create more admin accounts from the "Admins" page.)*

### Stopping the application

Simply close both Command Prompt windows (or press `Ctrl + C` in each).
Your data is saved automatically — it will still be there next time you start.

---

## Part 5 — Quick tour

- **Dashboard** — KPIs, charts and filter-based reports (session, city, board, campus,
  grade, top/lowest students). All filters allow multiple selections.
- **Results** — Click **"Add Result"** to upload an Excel result sheet: first pick the
  session, then drop the `.xlsx` file. Percentage and grade are calculated automatically.
  Duplicate students (same Roll No + Session + Board) are skipped, never overwritten.
  A sample sheet `Results SSC II -H.xlsx` is included in the project folder for testing.
- **Sessions** — Add the two-year academic sessions (e.g. 2028 → "2028 - 2030").
- **Grades** — Define the percentage bands (e.g. 90–94.99% = A+). Defaults are included.
- **Admins** — Add or manage admin panel users.
- The **sun/moon button** (top right) switches between dark and light theme.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `'python' is not recognized...` | Python wasn't added to PATH. Re-run the Python installer, choose "Modify", and enable "Add python to environment variables" — or reinstall with the PATH checkbox ticked. Then open a NEW Command Prompt. |
| `'npm' is not recognized...` | Node.js isn't installed or the Command Prompt was open during installation. Install Node.js, then open a NEW Command Prompt. |
| Browser shows "This site can't be reached" | One of the two windows isn't running. Make sure BOTH Command Prompt windows from Part 4 are open and showing their "running" messages. |
| Login says "Invalid email or password" | Use exactly `haris@gmail.com` / `beaconhouse` (all lowercase, no spaces). |
| Upload says "Sheet layout not recognized" | The Excel file must have the standard columns: Sr No, Roll No, Student Name, Campus, City, Board, Total Marks, Obtained Marks, Remarks (headers in the first few rows). |
| `npm install` fails with a disk-space error | Free up space on the C: drive and try again. |
| Something else | Close both windows, repeat Part 4. If it persists, send a screenshot of the Command Prompt error. |
