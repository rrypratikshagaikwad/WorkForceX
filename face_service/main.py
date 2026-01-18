from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import base64
import numpy as np
import cv2

app = FastAPI()

# ================== MODELS ==================

class RegisterFaceRequest(BaseModel):
    image: str

class VerifyFaceRequest(BaseModel):
    image: str
    embedding: List[float]

# ================== REGISTER FACE ==================

@app.post("/register-face")
def register_face(data: RegisterFaceRequest):
    try:
        image_base64 = data.image.split(",")[1]
        image_bytes = base64.b64decode(image_base64)

        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return {"error": "Face not detected"}

        # 🔥 TODO: Real face embedding logic
        # For now dummy embedding
        embedding = np.random.rand(128).tolist()

        return {
            "embedding": embedding
        }

    except Exception as e:
        return {"error": str(e)}

# ================== VERIFY FACE ==================

@app.post("/verify-face")
def verify_face(data: VerifyFaceRequest):
    try:
        image_base64 = data.image.split(",")[1]
        image_bytes = base64.b64decode(image_base64)

        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return {"matched": False, "distance": None}

        stored_embedding = np.array(data.embedding, dtype=np.float32)

        # 🔥 TODO: real face comparison
        distance = 0.38  # dummy value
        matched = distance < 0.6

        return {
            "matched": matched,
            "distance": distance
        }

    except Exception as e:
        return {"error": str(e)}
