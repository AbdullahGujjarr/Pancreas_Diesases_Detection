from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import random
import os

app = FastAPI()

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    # Save file to mock uploads folder
    uploads_dir = "uploads"
    os.makedirs(uploads_dir, exist_ok=True)
    file_path = os.path.join(uploads_dir, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    # Simulate analysis result
    disease_types = [
        "acute_pancreatitis", "chronic_pancreatitis", "pancreatic_cysts", "pancreatic_cancer", "normal"
    ]
    result = random.choice(disease_types)
    probabilities = {d: (0.9 if d == result else random.uniform(0, 0.1)) for d in disease_types}
    explanations = {d: f"Mock explanation for {d}" for d in disease_types}
    return JSONResponse({
        "analysisId": f"mock_{file.filename}",
        "probabilities": probabilities,
        "explanations": explanations,
        "imageUrl": f"/api/uploads/{file.filename}"
    })

@app.get("/api/uploads/{filename}")
def get_uploaded_image(filename: str):
    # In real API, would return the image file
    return JSONResponse({"message": f"Would serve image: {filename}"})
