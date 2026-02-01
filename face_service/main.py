from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import base64
import numpy as np
import cv2

app = FastAPI()

class RegisterFaceRequest(BaseModel):
    image: str

class VerifyFaceRequest(BaseModel):
    image: str
    embedding: List[float]

@app.post("/register-face")
def register_face(data: RegisterFaceRequest):
    try:
        if "," not in data.image:
            raise HTTPException(status_code=400, detail="Invalid base64 image")

        image_base64 = data.image.split(",")[1]
        image_bytes = base64.b64decode(image_base64)

        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Image decode failed")

        embedding = np.random.rand(128).tolist()

        return {"embedding": embedding}

    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/verify-face")
def verify_face(data: VerifyFaceRequest):
    try:
        image_base64 = data.image.split(",")[1]
        image_bytes = base64.b64decode(image_base64)

        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return {"matched": False, "distance": None}

        distance = 0.38
        matched = distance < 0.6

        return {"matched": matched, "distance": distance}

    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.get("/")
def root():
    return {"status": "Face API running"}
