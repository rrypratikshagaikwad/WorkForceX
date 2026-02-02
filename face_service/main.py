from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import base64
import numpy as np
import cv2
import face_recognition

app = FastAPI()

# ================= MODELS =================

class RegisterFaceRequest(BaseModel):
    image: str  # base64 image

class VerifyFaceRequest(BaseModel):
    image: str
    embedding: List[float]

# ================= UTILS =================

def decode_base64_image(base64_str: str):
    if "," in base64_str:
        base64_str = base64_str.split(",")[1]

    img_bytes = base64.b64decode(base64_str)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image")

    return img

# ================= REGISTER FACE =================

@app.post("/register-face")
def register_face(data: RegisterFaceRequest):
    img = decode_base64_image(data.image)

    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    encodings = face_recognition.face_encodings(rgb_img)

    if len(encodings) == 0:
        raise HTTPException(status_code=400, detail="No face detected")

    embedding = encodings[0].tolist()

    return {"embedding": embedding}

# ================= VERIFY FACE =================

@app.post("/verify-face")
def verify_face(data: VerifyFaceRequest):
    img = decode_base64_image(data.image)

    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    encodings = face_recognition.face_encodings(rgb_img)

    if len(encodings) == 0:
        return {"matched": False, "distance": None}

    live_embedding = encodings[0]
    stored_embedding = np.array(data.embedding)

    distance = np.linalg.norm(live_embedding - stored_embedding)
    matched = distance < 0.6  # production threshold

    return {
        "matched": matched,
        "distance": float(distance)
    }

@app.get("/")
def health():
    return {"status": "Face API running"}
