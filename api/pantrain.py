from fastapi import FastAPI
from fastapi.responses import JSONResponse
import os

app = FastAPI()

PANTRAIN_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../PanTrain.ipynb'))

@app.get("/api/pantrain/info")
def get_pantrain_info():
    # Return mock info about PanTrain notebook
    if os.path.exists(PANTRAIN_PATH):
        return JSONResponse({
            "notebook": "PanTrain.ipynb",
            "status": "available",
            "path": PANTRAIN_PATH
        })
    else:
        return JSONResponse({
            "notebook": "PanTrain.ipynb",
            "status": "not found"
        })
