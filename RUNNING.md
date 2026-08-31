# MLOps-ED: Requirements and Run Instructions

## 1) What this project is

This repository contains a machine-learning analysis application with:

- A Python ML backend using FastAPI
- A React + Vite frontend
- A standalone Streamlit interface (`app.py`)
- Prebuilt sample datasets in `data/raw/`
- Trained model artifacts in `models/`
- Generated profiling reports in `results/profiles/`

The main app flow is:

- User uploads a CSV in the React frontend
- Backend reads / validates the file
- ML pipeline computes profiling, meta-features, recommendations, verification, and optimization
- Frontend displays the results and calls the API

## 2) Runtime requirements

### Python

- Python 3.11+
- pip
- virtual environment recommended (`venv` or `conda`)

Required Python packages from the project configuration (`pyproject.toml`):

- numpy
- pandas
- scikit-learn
- ydata_profiling
- fastapi>=0.115,<1.0
- uvicorn[standard]>=0.30,<1.0
- python-multipart>=0.0.9,<1.0

Additional package needed for the standalone Streamlit UI:

- streamlit

### Node / frontend

- Node.js 18+
- npm (or Bun, because the project includes `bun.lock` and `dev.sh` uses `bun run dev`)

Required frontend dependencies from `client/package.json`:

- react
- react-dom
- react-router-dom
- vite
- typescript
- @vitejs/plugin-react
- tailwindcss
- @tailwindcss/vite
- sonner
- lucide-react

### Operating system / environment

- Linux/macOS/Windows with a shell capable of running Python and Node commands
- A browser to open the frontend UI

## 3) Project structure relevant to running the app

- `server/main.py` — FastAPI app entry point
- `server/routes/` — REST API endpoints
- `client/` — React frontend
- `app.py` — standalone Streamlit ML interface
- `data/raw/` — CSV datasets
- `models/` — model files such as `meta_learner.pkl` and `best_model.pkl`
- `results/` — generated profiling and evaluation artifacts

## 4) Important runtime notes

### Backend port

The active code configuration shows the backend is expected to run on port 5000:

- `server/main.py` allows CORS from `http://localhost:5173`
- `client/src/api/client.ts` defaults to `http://localhost:5000/`
- `dev.sh` starts FastAPI with `uvicorn server.main:app --reload --port 5000`

So the current app is wired for:

- Frontend: `http://localhost:5173`
- API: `http://localhost:5000`

There is a mismatch in the repository docs: some README sections mention `http://localhost:8000`, but the actual runtime config uses port 5000.

### Model artifacts

The project expects trained model files to exist in `models/` before the UI can do full predictions and optimization. If those files are missing, retrain them using the ML scripts or rerun the pipeline.

## 5) Setup steps

### Option A: run the React frontend + FastAPI backend

From the project root (`MLops-ed`):

1. Create and activate a virtual environment:

```bash
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
# Windows CMD
.venv\Scripts\activate.bat
# macOS/Linux
source .venv/bin/activate
```

2. Install Python dependencies:

```bash
pip install -e .
```

If you want to run the standalone Streamlit app too, also install:

```bash
pip install streamlit
```

3. Install frontend dependencies:

```bash
cd client
npm install
# or: bun install
```

4. Start the backend from the project root:

```bash
uvicorn server.main:app --reload --port 5000
```

5. Start the frontend in another terminal:

```bash
cd client
npm run dev
# or: bun run dev
```

6. Open the frontend in a browser:

```text
http://localhost:5173
```

7. The API docs are available at:

```text
http://localhost:5000/docs
```

### Option B: use the bundled dev script

From the project root:

```bash
./dev.sh
```

This script starts both the frontend and backend together.

Important: it uses `bun run dev` for the frontend and `uvicorn ... --port 5000` for the backend. If Bun is not installed, use the manual setup above instead.

## 6) Run the standalone Streamlit app

This repository also contains a standalone Streamlit user interface.

From the project root:

```bash
python -m streamlit run app.py
```

This opens a local Streamlit page where you can:

- upload a CSV
- preview the dataset
- generate profiling reports
- predict the best model
- compare 15% vs 85% training sizes
- optimize a model and save a `.pkl` file

## 7) Typical first-run workflow

1. Activate the Python environment
2. Install Python dependencies with `pip install -e .`
3. Install frontend dependencies with `npm install` inside `client/`
4. Start the backend on port 5000
5. Start the frontend on port 5173
6. Upload a sample CSV from `data/raw/`
7. Run the profiling / recommendation / verification / optimization flow

## 8) Useful project commands

From the project root:

```bash
# backend
uvicorn server.main:app --reload --port 5000

# frontend (client)
cd client
npm run dev

# streamlit
python -m streamlit run app.py
```

## 9) Summary

To run the main app in its current state, the minimum required setup is:

- Python 3.11+
- FastAPI + ML dependencies installed
- Node.js + npm (or Bun) installed
- `client` dependencies installed
- backend started on `http://localhost:5000`
- frontend started on `http://localhost:5173`

The Streamlit UI is optional but available as a separate local interface.
