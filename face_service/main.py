from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import base64
import numpy as np
import cv2
from insightface.app import FaceAnalysis

app = FastAPI()

# Load face model once (IMPORTANT)
face_app = FaceAnalysis(name="buffalo_l")
face_app.prepare(ctx_id=0, det_size=(640, 640))

class RegisterFaceRequest(BaseModel):
    image: str

class VerifyFaceRequest(BaseModel):
    image: str
    embedding: List[float]

def decode_image(image_base64: str):
    img_data = image_base64.split(",")[1]
    img_bytes = base64.b64decode(img_data)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img

@app.post("/register-face")
def register_face(data: RegisterFaceRequest):
    img = decode_image(data.image)
    faces = face_app.get(img)

    if len(faces) == 0:
        return {"error": "No face detected"}

    embedding = faces[0].embedding.tolist()
    return {"embedding": embedding}

@app.post("/verify-face")
def verify_face(data: VerifyFaceRequest):
    img = decode_image(data.image)
    faces = face_app.get(img)

    if len(faces) == 0:
        return {"matched": False, "distance": None}

    new_embedding = faces[0].embedding
    stored_embedding = np.array(data.embedding)

    distance = np.linalg.norm(new_embedding - stored_embedding)
    matched = distance < 0.6

    return {
        "matched": matched,
        "distance": float(distance)
    }

@app.get("/")
def root():
    return {"status": "Face API running"}
