# Beaconhouse MIS — Prototype

School MIS prototype for Beaconhouse: admins upload consolidated board-exam result
sheets (Excel), the system computes percentage and grade automatically, and the data
is explored through a filterable dashboard.

**Stack:** Django 5 + Django REST Framework + SQLite (backend API) · React 18 + Vite +
Ant Design + Chart.js (frontend SPA).

**Branding** (from beaconhouse.net): primary navy `#061D7B`, accent yellow `#FEEC13`
(text on yellow `#292929`), white surfaces, muted brown-gray secondary text `#948574`.

## Login

| Email | Password |
|---|---|
| haris@gmail.com | beaconhouse |

Additional admins can be created from the **Admins** page after logging in.

## Run (two terminals)

Backend (http://127.0.0.1:8000):

```powershell
cd backend
..\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
```

Frontend (http://localhost:5173 — open this in the browser):

```powershell
cd frontend
npm run dev
```

The Vite dev server proxies `/api` to Django, so no CORS setup is needed in the browser.

## First-time setup

```powershell
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
cd backend
..\.venv\Scripts\python.exe manage.py migrate   # creates DB, seeds admin + default grades
cd ..\frontend
npm install
```

## Modules

- **Grades** — CRUD for grade bands (e.g. 90–94.99% ⇒ A+). Overlapping ranges are
  rejected. A default band set (A++ … F) is seeded on first migrate and can be edited.
- **Results** — CRUD + "Add Result" upload: select a two-year session (2022 - 2024,
  2024 - 2026, … generated automatically), then upload the .xlsx sheet. Percentage
  `(obtained / total) × 100` and grade are computed server-side; the sheet's own %age
  column is ignored. A student is identified by **Roll No + Session + Board** — rows
  that already exist are skipped (never overridden) and reported in the upload summary.
- **Dashboard** — filters (Session, City, Board, Campus, Grade, min/max %), KPI cards,
  grade-distribution and average-percentage charts (by campus / city / board), and
  Top X / Lowest X students.
- **Admins** — manage admin users; every admin can update their own profile and
  password from **My Profile**.

Every table carries audit fields: created_by, created_date, updated_by, updated_date.

## Expected Excel layout

Row 1 title (merged), row 2 headers, data from row 3. Columns:
`Sr No | Roll No | Student Name | Campus | City | Board | Total Marks | Obtained Marks | (%age — ignored) | (Grade — ignored) | Remarks`.
Whitespace is normalized and Board is uppercased during import.

## Known prototype limitations

- Editing grade bands does **not** re-grade existing results (grade is a snapshot
  taken at upload/edit time).
- The sample sheet contains three board spellings (BSEK, B.S.E.K, BESK); they are
  imported as distinct boards — source-data cleanup, board-name canonicalization, or
  a merge tool would be a future enhancement.
- Dev-mode auth token is stored in localStorage; fine for a localhost prototype.
