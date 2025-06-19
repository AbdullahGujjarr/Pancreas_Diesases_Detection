from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from torchvision import models, transforms
from PIL import Image
import torch
import io

# --- CONFIGURATION ---

# Update these according to your trained model and classes
MODEL_PATH = "model.pth"  # Path to your trained model weights
CLASS_NAMES = ['Normal', 'Acute Pancreatitis', 'Chronic Pancreatitis', 'Pancreatic Cancer', 'Pancreatic Cysts']  # Example
NUM_CLASSES = len(CLASS_NAMES)

# --- MODEL LOADING ---

model = models.resnet50(pretrained=False)
model.fc = torch.nn.Linear(model.fc.in_features, NUM_CLASSES)
model.load_state_dict(torch.load(MODEL_PATH, map_location='cpu'))
model.eval()

# --- IMAGE TRANSFORM ---

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# --- FASTAPI APP SETUP ---

app = FastAPI()

# Allow CORS for all origins (so your frontend can call this API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "ResNet50 Inference API is running."}

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        img_t = transform(image).unsqueeze(0)
        with torch.no_grad():
            outputs = model(img_t)
            _, predicted = torch.max(outputs, 1)
            class_idx = predicted.item()
            class_name = CLASS_NAMES[class_idx]
        return JSONResponse({"predicted_class": class_name, "class_index": class_idx})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# --- INSTRUCTIONS ---
# 1. Save your trained model weights as 'model.pth' in the same directory, or update MODEL_PATH.
# 2. Update CLASS_NAMES to match your actual class labels.
# 3. Install dependencies if needed:
#    pip install fastapi uvicorn pillow torch torchvision
# 4. Run the server:
#    uvicorn inference_api:app --reload
# 5. POST an image to http://localhost:8000/predict/ to get a prediction.
