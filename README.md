
---

# PancreasPro: Web-based Pancreatic Disease Classification with ResNet50

## Overview

PancreasPro is a web-based application for classifying pancreatic diseases from medical images (CT/MRI scans). It uses a deep learning ResNet50 model to distinguish between:

- Normal
- Acute Pancreatitis
- Chronic Pancreatitis
- Pancreatic Cancer
- Pancreatic Cysts

The app is designed for researchers, clinicians, and students to upload images and receive instant AI-powered predictions.

---

## Features

- Deep Learning with ResNet50
- FastAPI backend for predictions
- React + Tailwind frontend for easy use
- Visualization of results
- Sample images included

---

## Project Structure

```
pancreas_pro_v1.7/
├── DataTrain.ipynb           # Model training notebook
├── train_models.py           # PyTorch training script
├── inference_api.py          # FastAPI backend
├── samples/                  # Example images
│   ├── Pancreatic Cancer.jpg
│   └── Pancreatic Cysts.jpg
├── src/                      # React frontend
├── train/                    # Training images (by class)
└── ...                       # Other files
```

---

## Setup Instructions

1. **Clone the Repository**
   ```
   git clone <your-repo-url>
   cd pancreas_pro_v1.7
   ```

2. **Install Python Dependencies**
   ```
   pip install fastapi uvicorn pillow torch torchvision scikit-learn matplotlib seaborn
   ```

3. **Train the Model**
   - Use DataTrain.ipynb or train_models.py to train ResNet50.
   - Save the weights as `model.pth` in the project root.

4. **Start the Backend API**
   ```
   uvicorn inference_api:app --reload
   ```

5. **Frontend Setup**
   ```
   npm install
   npm run dev
   ```
   - Open your browser at `http://localhost:5173`

---

## Usage

- Open the web app.
- Upload a medical image.
- View the predicted class.

---

## API Reference

- **POST** `/predict/`
  - **Body:** Image file (form-data)
  - **Response:** JSON with predicted class and index

Example:
```
curl -X POST "http://localhost:8000/predict/" -F "file=@samples/Pancreatic\ Cancer.jpg"
```

---

## Sample Screenshots

**Pancreatic Cancer Example**
![Pancreatic Cancer](https://github.com/user-attachments/assets/610d43b2-3823-4179-9af0-cb6c388f40e1)
![Pancreatic Cysts](https://github.com/user-attachments/assets/d2108999-9a4c-4fd0-bb5f-b29b9cc859cf)




**Pancreatic Cysts Example**

![Pancreatic Cysts](samples/Pancreatic%20Cysts.jpg)

## Results
![result-page](https://github.com/user-attachments/assets/65a53c9d-5663-42a2-b600-205c908e94dc)
![heat-map](https://github.com/user-attachments/assets/c661b3ca-ec1f-4fcc-b1f3-897186fcbcaf)

---

## Notes

- Ensure `model.pth` exists before running the API.
- Update `CLASS_NAMES` in inference_api.py to match your classes.
- Extendable for more classes or analytics.

---

## License

For educational and research use only.

---

You can now copy and paste this into your `README.md` or any documentation box!
