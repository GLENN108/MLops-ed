# MLOps-ED

An end-to-end machine learning analysis and model-selection system that uses **dataset profiling, meta-learning, train-size verification, and model optimization** to recommend and build suitable machine-learning models for an uploaded dataset.

The project consists of a **FastAPI backend** that exposes the ML functionality through REST APIs and a **React frontend** that provides the user interface.

---

## Overview

MLOps-ED is designed around the idea that a machine-learning workflow should be able to automatically analyze a previously unseen dataset and assist with selecting an appropriate model.

The system currently provides four major capabilities:

1. **Dataset Profiling**

   * Generates an HTML data-profile report using `fg-data-profiling`.
   * Provides statistical and structural information about the uploaded dataset.

2. **Algorithm Prediction**

   * Extracts meta-features from the dataset.
   * Detects whether the problem is classification or regression.
   * Uses a trained meta-learner to recommend an appropriate machine-learning algorithm.

3. **Train-Size Verification**

   * Compares model performance when trained using 85% of the available training data against training using only 15%.
   * Measures the resulting performance degradation.
   * Determines whether the selected model is relatively robust to reduced training data.

4. **Optimization & Model Building**

   * Performs hyperparameter tuning on the selected model.
   * Evaluates optimized variants.
   * Produces the final serialized `.pkl` model for deployment.

---

## Architecture

```text
                         ┌──────────────────────┐
                         │      React Client    │
                         │                      │
                         │  Dataset Upload      │
                         │  Profiling           │
                         │  Model Prediction    │
                         │  Verification        │
                         │  Optimization        │
                         └──────────┬───────────┘
                                    │
                              HTTP / REST
                                    │
                         ┌──────────▼───────────┐
                         │     FastAPI Server   │
                         │                      │
                         │  Dataset Routes      │
                         │  Profiling Routes    │
                         │  Model Routes        │
                         │  Verification        │
                         │  Optimization        │
                         │  Recommendation      │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
       ┌──────▼──────┐      ┌──────▼──────┐      ┌──────▼──────┐
       │   Dataset   │      │ Meta-Learning│      │   Model     │
       │  Processing │      │    System    │      │  Tuning     │
       └─────────────┘      └──────────────┘      └─────────────┘
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    │
                         ┌──────────▼───────────┐
                         │  Data / Results /    │
                         │       Models         │
                         └──────────────────────┘
```

---

## Project Structure

```text
.
├── client/                         # React frontend
│
├── server/                         # FastAPI backend
│   ├── config.py                   # Server configuration
│   ├── main.py                     # FastAPI application entry point
│   │
│   ├── routes/
│   │   ├── datasets.py             # Dataset upload/retrieval endpoints
│   │   ├── models.py               # Model-related endpoints
│   │   ├── optimization.py         # Model optimization endpoints
│   │   ├── profiling.py            # Dataset profiling endpoints
│   │   ├── recommendation.py       # Model recommendation endpoints
│   │   └── verification.py         # Train-size verification endpoints
│   │
│   ├── schemas/
│   │   ├── datasets.py             # Dataset request/response schemas
│   │   ├── optimization.py         # Optimization schemas
│   │   ├── profiling.py            # Profiling schemas
│   │   ├── recommendation.py       # Recommendation schemas
│   │   └── verification.py         # Verification schemas
│   │
│   ├── services/
│   │   ├── dataset_services.py     # Dataset handling
│   │   ├── model_service.py        # Model-related operations
│   │   ├── optimization_services.py
│   │   ├── profiling_services.py
│   │   ├── recommendation_services.py
│   │   └── verification_services.py
│   │
│   └── tests/
│       ├── fixtures/
│       └── test_api.sh
│
├── src/
│   ├── baselines.py                # Data preparation / baseline models
│   ├── evaluator.py                # Model evaluation metrics
│   ├── meta_features.py            # Dataset meta-feature extraction
│   ├── meta_learner.py             # Meta-learning implementation
│   ├── model_tuner.py              # Hyperparameter optimization
│   └── profiling.py                # Dataset profiling
│
├── data/
│   └── raw/                        # Local datasets
│
├── models/
│   ├── meta_learner.pkl            # Trained meta-learner
│   └── best_model.pkl              # Generated best model
│
├── results/
│   ├── baseline_results.csv
│   ├── meta_features.csv
│   ├── profiles/                   # Generated HTML profiling reports
│   └── test_results/               # Verification results
│
├── compare_train_size.py           # 15% vs 85% train-size comparison
├── predict_best_model.py           # Model prediction utility
├── run_pipeline.py                 # Offline ML pipeline
├── train_meta_model.py             # Train meta-learner
├── verify_system.py                # System verification
│
├── pyproject.toml                  # Python project configuration
├── README.md
└── dev.sh                          # Start frontend and backend together
```

> The `client/` directory contains the frontend application. The Python code outside `server/` and `src/` contains the underlying ML pipeline and supporting utilities.

---

# System Workflow

## 1. Dataset Upload

The user uploads a CSV dataset through the React frontend.

```text
React
  │
  │ POST /api/datasets/upload
  ▼
FastAPI
  │
  ▼
data/raw/
```

The backend stores the dataset and assigns an identifier that can be used by subsequent API requests.

---

## 2. Dataset Profiling

The profiling service loads the selected dataset and generates a `fg-data-profiling` report.

```text
Dataset
   │
   ▼
Pandas DataFrame
   │
   ▼
fg-data-profiling
   │
   ▼
HTML Profile Report
   │
   ▼
results/profiles/
```

The generated HTML report is exposed through the API rather than returning the server's filesystem path to the frontend.

---

## 3. Meta-Feature Extraction

The system extracts characteristics of the dataset that can be used by the meta-learner.

Examples of dataset-level characteristics include:

* Number of samples
* Number of features
* Numerical/categorical feature characteristics
* Missing-value characteristics
* Statistical properties
* Dataset dimensionality
* Problem type

The resulting meta-feature representation is passed to the trained meta-learner.

---

## 4. Problem-Type Detection

The system determines whether the dataset represents a:

```text
Classification
```

or

```text
Regression
```

problem.

This determines which candidate algorithms and evaluation metrics should be considered.

---

## 5. Algorithm Recommendation

The extracted meta-features are passed to the trained meta-learning model:

```text
Dataset
   │
   ▼
Meta-Features
   │
   ▼
Meta-Learner
   │
   ▼
Recommended Algorithm
```

For example:

```text
Recommended Model: RandomForest
```

The recommendation is then made available to the frontend.

---

## 6. Train-Size Verification

The recommended model can be tested against different training-data sizes.

The current verification compares:

```text
85% Training Data
        vs
15% Training Data
```

The same test split is used to evaluate the models.

The system calculates:

* Baseline score
* Small-training score
* Absolute score drop
* Percentage performance drop

Conceptually:

```text
Performance Drop
        =
Baseline Score - Small Training Score
```

and:

```text
Drop %
        =
(Baseline Score - Small Training Score)
------------------------------------------------ × 100
             Baseline Score
```

This provides an indication of how sensitive the selected model is to a reduction in training data.

---

## 7. Model Optimization

Once a model has been selected and verified, the optimization service can tune it.

The process is approximately:

```text
Recommended Model
       │
       ▼
Hyperparameter Search
       │
       ▼
Candidate Models
       │
       ▼
Validation
       │
       ▼
Best Configuration
       │
       ▼
Final Model
       │
       ▼
best_model.pkl
```

The resulting model can then be downloaded or used for subsequent prediction tasks.

---

# Backend

The backend is implemented using **FastAPI**.

### Main entry point

```text
server/main.py
```

The backend exposes REST endpoints for:

```text
/api/datasets
/api/profile
/api/models
/api/recommendation
/api/verification
/api/optimization
```

The exact routes and methods are defined inside `server/routes/`.

---

# Frontend

The frontend is implemented as a React application and is located under:

```text
client/
```

It communicates with the FastAPI backend through HTTP requests.

The frontend is responsible for:

* Dataset upload
* Dataset selection
* Target-column selection
* Triggering profiling
* Displaying profiling results
* Requesting model recommendations
* Running verification
* Triggering optimization
* Displaying model results

The frontend does **not** perform the ML computations itself.

---

# Development Setup

## Requirements

### Backend

* Python 3.11+
* FastAPI
* Uvicorn
* Pandas
* NumPy
* Scikit-learn
* fg-data-profiling
* python-multipart

Install the optional Streamlit interface dependency with `pip install -e ".[streamlit]"`.

### Frontend

* Node.js
* npm

or the package manager used by the project.

---

## Python Environment

Create or activate the project's Python environment.

For example, using Conda:

```bash
conda activate mlops-ed
```

Then install the Python dependencies:

```bash
pip install -e .
```

The project's Python dependencies are defined in:

```text
pyproject.toml
```

---

## Running the Development Application

The project includes a development script that starts both applications in the same terminal.

```bash
./dev.sh
```

The output is prefixed to distinguish the two processes:

```text
[SERVER] INFO: Uvicorn running on http://127.0.0.1:8000
[CLIENT] VITE v5.x.x ready
[CLIENT] ➜ Local: http://localhost:5173/
```

The two development servers therefore run concurrently without requiring separate terminals.

### Backend

```text
http://localhost:8000
```

### Frontend

```text
http://localhost:5173
```

FastAPI's interactive API documentation is available at:

```text
http://localhost:8000/docs
```

---

# Running the Backend Independently

The backend can also be started directly with Uvicorn:

```bash
uvicorn server.main:app --reload
```

Or using the project's configured command:

```bash
mlops-api
```

---

# Running the Frontend Independently

From the client directory:

```bash
cd client
npm run dev
```

The Vite development server will normally be available at:

```text
http://localhost:5173
```

---

# Offline ML Pipeline

The project also contains standalone scripts used for experimentation, training, evaluation, and verification.

These scripts are independent of the web application.

## Train the Meta-Learner

```bash
python train_meta_model.py
```

This produces the trained meta-learning model used for algorithm recommendation.

---

## Compare Training Sizes

```bash
python compare_train_size.py
```

This runs the standalone CLI version of the train-size comparison.

The CLI can process multiple datasets sequentially for offline experimentation.

The web application, however, operates on **one uploaded dataset at a time**.

---

## Run the Pipeline

```bash
python run_pipeline.py
```

This runs the project's broader offline ML pipeline.

---

## Verify the System

```bash
python verify_system.py
```

This can be used to verify the underlying ML components independently of the frontend.

---

# Data

Datasets used during development and experimentation are stored under:

```text
data/raw/
```

Example datasets include:

```text
adult.csv
Churn_Modelling.csv
energy.csv
Housing.csv
insurance.csv
iot_energy_management_dataset.csv
sensor_maintenance_data.csv
student_lifestyle_dataset.csv
WineQT.csv
```

These datasets are primarily used for experimentation and training the meta-learning system.

---

# Generated Artifacts

The application generates several types of artifacts.

### Models

```text
models/
├── meta_learner.pkl
└── best_model.pkl
```

### Profiling Reports

```text
results/profiles/
```

Each profile is generated as an HTML document.

### Evaluation Results

```text
results/test_results/
```

Contains CSV files generated by the evaluation and train-size experiments.

---

# API Design

The backend follows a layered structure:

```text
Route
  │
  ▼
Schema
  │
  ▼
Service
  │
  ▼
ML / Data Processing Code
```

### Routes

Handle HTTP requests and responses.

```text
server/routes/
```

### Schemas

Define request and response structures using Pydantic.

```text
server/schemas/
```

### Services

Contain application-level business logic.

```text
server/services/
```

### ML Core

The underlying machine-learning implementation is kept separately under:

```text
src/
```

This separation allows the ML functionality to be used by the API without coupling the ML code directly to FastAPI.

---

# Design Principles

The project follows several architectural principles:

### Separation of concerns

The frontend, API layer, application services, and ML implementation are kept separate.

```text
React
  ↓
FastAPI Routes
  ↓
Services
  ↓
ML Core
```

### Reusable ML functions

Core operations such as:

```python
run_comparison(...)
compute_meta_features(...)
detect_problem_type(...)
```

are implemented as reusable Python functions rather than being tied to a particular UI.

This allows them to be used by:

* FastAPI
* CLI scripts
* Offline experiments
* Automated tests

### API does not expose filesystem internals

The server may internally use paths such as:

```text
/home/.../results/profiles/report.html
```

but these are not returned to the frontend as public API data.

Instead, the frontend receives HTTP-accessible resources such as:

```text
/api/profile/report.html
```

---

# Development Status

Current system components:

* [x] React frontend
* [x] FastAPI backend
* [x] CSV dataset upload
* [x] Dataset retrieval
* [x] Dataset profiling
* [x] Problem-type detection
* [x] Meta-feature extraction
* [x] Meta-learning recommendation
* [x] Train-size verification
* [x] Hyperparameter optimization
* [x] Model serialization
* [x] Combined frontend/backend development runner
* [ ] Authentication
* [ ] Persistent database
* [ ] Production deployment configuration
* [ ] Automated CI/CD pipeline
* [ ] Containerized deployment

---

# License

This project is currently intended as an academic/development project.

Add the project's license information here if and when a license is selected.
