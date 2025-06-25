from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Allow CORS for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATASET_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../DATASET'))
SAMPLES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../samples'))

@app.get("/api/dataset/list")
def list_dataset():
    # List all files in DATASET/train and DATASET/test
    train_path = os.path.join(DATASET_DIR, 'train')
    test_path = os.path.join(DATASET_DIR, 'test')
    train_files = os.listdir(train_path) if os.path.exists(train_path) and os.path.isdir(train_path) else []
    test_files = os.listdir(test_path) if os.path.exists(test_path) and os.path.isdir(test_path) else []
    return JSONResponse({
        "train": train_files,
        "test": test_files
    })

@app.get("/api/samples/list")
def list_samples():
    # List all sample images
    sample_files = os.listdir(SAMPLES_DIR) if os.path.exists(SAMPLES_DIR) and os.path.isdir(SAMPLES_DIR) else []
    return JSONResponse({
        "samples": sample_files
    })
