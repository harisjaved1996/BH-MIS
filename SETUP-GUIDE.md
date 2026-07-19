# Beaconhouse MIS — Setup Guide

Welcome! This guide will help you run the Beaconhouse MIS on your laptop,
**starting from zero** — nothing needs to be installed beforehand, and no technical
knowledge is needed. Just follow the steps in order.

The guide has two kinds of steps — pay attention to the labels:

| Label | Meaning |
|---|---|
| ✅ **ONE-TIME SETUP** | Do these only once, the very first time. Never again. |
| 🔁 **EVERY TIME** | Do these each time you want to use the application. |

> **About your data:** The application starts completely **empty** — no student data
> comes with it. You will add your own data by uploading Excel result sheets inside
> the app. Everything you add is **saved permanently on your laptop**, even after you
> close the application or restart the laptop. Only one login account is created for
> you during setup, and you can change its email and password later from inside the app.

**Total first-time setup: about 20–30 minutes (mostly waiting for downloads).**
**Starting the app after that: about 1 minute.**

---

# ✅ ONE-TIME SETUP

## Step 1 — Install Python

Python is the engine that runs the application's server.

1. Open your web browser and go to: **https://www.python.org/downloads/**
2. Click the big yellow button **"Download Python 3.x.x"**.
3. Open the downloaded file.
4. ⚠️ **VERY IMPORTANT:** On the first screen, tick the checkbox at the bottom that says
   **"Add python.exe to PATH"** — tick it BEFORE clicking Install.
5. Click **"Install Now"**, wait for it to finish, click **Close**.

**Check it worked:** Press the **Windows key** ⊞, type `cmd`, press **Enter**.
A black window opens (this is called the *Command Prompt* — you'll use it a lot).
Type this and press Enter:

```
python --version
```

✔️ You should see something like `Python 3.12.4`.
❌ If you see an error, restart the laptop and check again.

## Step 2 — Install Node.js

Node.js runs the application's screens (the part you see in the browser).

1. Go to: **https://nodejs.org/**
2. Click the green **"LTS"** download button.
3. Open the downloaded file, keep clicking **Next** (the default options are fine),
   then **Finish**.

**Check it worked:** Open a **new** Command Prompt (Windows key ⊞ → `cmd` → Enter) and type:

```
node --version
```

✔️ You should see something like `v22.x.x`.

## Step 3 — Get the project folder

1. Go to: **https://github.com/harisjaved1996/BH-MIS**
2. Click the green **"<> Code"** button → click **"Download ZIP"**.
3. Open your **Downloads** folder and find `BH-MIS-main.zip`.
4. Right-click it → **"Extract All..."** → choose `C:\` → click **Extract**.
5. You now have the folder **`C:\BH-MIS-main`**. This is the project folder.

## Step 4 — Prepare the application

Open a Command Prompt (Windows key ⊞ → `cmd` → Enter) and type these commands
**one at a time**, pressing **Enter** after each one. Wait for each command to finish
before typing the next.

**4a. Go into the project folder:**

```
cd C:\BH-MIS-main
```

**4b. Create the app's private Python workspace:**

```
python -m venv .venv
```

**4c. Install the server's components** (takes 1–2 minutes):

```
.venv\Scripts\pip install -r requirements.txt
```

**4d. Create your empty database and your login account:**

```
cd backend
..\.venv\Scripts\python manage.py migrate
cd ..
```

> This creates a brand-new **empty** database on your laptop and sets up your login
> account (see Step 5). It does NOT add any student data — that's yours to upload later.

**4e. Install the screen components** (takes 2–5 minutes, needs internet):

```
cd frontend
npm install
cd ..
```

🎉 **That's it — setup is finished forever.** You never repeat Steps 1–4 again.

## Step 5 — Your login account

Setup created one login account for you:

| Email | Password |
|---|---|
| `haris@gmail.com` | `beaconhouse` |

🔒 **After your first login, please change these:** click **"My Profile"** in the left
menu — there you can set your own email and password. You can also create accounts for
other people from the **"Admins"** page.

---

# 🔁 EVERY TIME — Starting the application

The application has two halves — the **server** (brain) and the **UI** (screens) —
and **both must be running at the same time**. That means you keep **two Command
Prompt windows open** while using the app.

### Window 1 — start the server (brain)

Open a Command Prompt (Windows key ⊞ → `cmd` → Enter) and type:

```
cd C:\BH-MIS-main\backend
..\.venv\Scripts\python manage.py runserver
```

✔️ When you see `Starting development server at http://127.0.0.1:8000/` — it's running.
**Leave this window open. Don't close it. Minimize it if you like.**

### Window 2 — start the UI (screens)

Open a **second** Command Prompt (Windows key ⊞ → `cmd` → Enter again) and type:

```
cd C:\BH-MIS-main\frontend
npm run dev
```

✔️ When you see `Local: http://localhost:5173/` — it's running.
**Leave this window open too.**

### Open the app in your browser

Open Chrome or Edge and go to:

> ## http://localhost:5173

Log in and start working. 🎉

---

# 🔁 EVERY TIME — Closing the application

When you're done, simply **close both black Command Prompt windows** (click the ✖,
or press `Ctrl + C` inside each window).

> 💾 **Your data is already saved.** Everything you added — results, sessions, grades,
> admins — is stored in a file on your laptop (`backend\db.sqlite3`). Closing the app,
> shutting down, or restarting the laptop will NOT lose anything. Next time you start
> the app (two windows again), all your data will be exactly where you left it.

> ⚠️ The only things that delete data: the **"Delete All"** button on the Results page,
> deleting individual records yourself, or deleting the project folder / the
> `db.sqlite3` file from the laptop. To make a backup, just copy the file
> `C:\BH-MIS-main\backend\db.sqlite3` somewhere safe (e.g. a USB drive).

---

# Quick reference card

**Every time you want to use the app — 3 things:**

| # | Where | What to type / do |
|---|---|---|
| 1 | Command Prompt window 1 | `cd C:\BH-MIS-main\backend` then `..\.venv\Scripts\python manage.py runserver` |
| 2 | Command Prompt window 2 | `cd C:\BH-MIS-main\frontend` then `npm run dev` |
| 3 | Browser | open **http://localhost:5173** and log in |

**To close:** close both black windows. Data stays saved.

---

# A quick tour of the app

- **Dashboard** — charts, KPIs and reports. Filter by session, city, board, campus,
  grade, top/lowest students. Every dropdown allows multiple selections.
- **Results** — click **"Add Result"**, pick the session, and drop in your Excel result
  sheet (`.xlsx`). Percentage and grade are calculated automatically. If a student
  (same Roll No + Session + Board) is already in the system, that row is skipped —
  existing data is never overwritten. A sample sheet `Results SSC II -H.xlsx` is
  included in the project folder if you want to try an upload.
- **Sessions** — add two-year academic sessions (enter 2028 → creates "2028 - 2030").
- **Grades** — set the percentage bands (e.g. 90–94.99% = A+). Sensible defaults are
  already there; you can edit them.
- **Admins** — create logins for other people.
- **My Profile** — change your own email and password.
- The **sun/moon button** (top right) switches between dark and light theme.

---

# If something goes wrong

| Problem | Fix |
|---|---|
| `'python' is not recognized...` | Python wasn't added to PATH. Re-run the Python installer and make sure the **"Add python.exe to PATH"** box is ticked. Then open a NEW Command Prompt. |
| `'npm' is not recognized...` | Install Node.js (Step 2), then open a NEW Command Prompt. |
| Browser says "This site can't be reached" | One of the two black windows isn't running. Make sure BOTH windows are open and showing their "running" messages. |
| Login not working | Type exactly `haris@gmail.com` and `beaconhouse` (all lowercase, no spaces) — or your own credentials if you changed them. |
| Upload says "Sheet layout not recognized" | The Excel sheet must have these columns: Sr No, Roll No, Student Name, Campus, City, Board, Total Marks, Obtained Marks, Remarks. |
| Anything else | Close both windows and start them again (the 🔁 EVERY TIME steps). If it persists, take a screenshot of the black window's message and send it to us. |
