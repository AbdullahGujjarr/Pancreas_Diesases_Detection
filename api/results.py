from fastapi import FastAPI
from fastapi.responses import JSONResponse
import random

app = FastAPI()

@app.get("/api/results/{analysis_id}")
def get_results(analysis_id: str):
    # Simulate fetching analysis results for a given analysis_id
    disease_types = [
        "acute_pancreatitis", "chronic_pancreatitis", "pancreatic_cysts", "pancreatic_cancer", "normal"
    ]
    result = random.choice(disease_types)
    probabilities = {d: (0.9 if d == result else random.uniform(0, 0.1)) for d in disease_types}
    explanations = {d: f"Image explanation for {d}" for d in disease_types}
    return JSONResponse({
        "analysisId": analysis_id,
        "probabilities": probabilities,
        "explanations": explanations
    })
