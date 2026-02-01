from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import base64
import numpy as np
import cv2
from insightface.app import FaceAnalysis

app = FastAPI()

# ---------------- FACE MODEL ----------------
face_app = FaceAnalysis(name="buffalo_l")
face_app.prepare(ctx_id=0, det_size=(640, 640))

# ---------------- MODELS ----------------
class RegisterFaceRequest(BaseModel):
    image: str

class VerifyFaceRequest(BaseModel):
    image: str
    embedding: List[float]

# ---------------- HELPERS ----------------
def decode_base64_image(image_str: str):
    image_base64 = image_str.split(",")[1]
    image_bytes = base64.b64decode(image_base64)
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img

def get_face_embedding(img):
    faces = face_app.get(img)
    if len(faces) == 0:
        return None
    return faces[0].embedding

# ---------------- REGISTER FACE ----------------
@app.post("/register-face")
def register_face(data: RegisterFaceRequest):
    img = decode_base64_image(data.image)
    embedding = get_face_embedding(img)

    if embedding is None:
        raise HTTPException(status_code=400, detail="No face detected")

    return {
        "embedding": embedding.tolist()
    }

# ---------------- VERIFY FACE ----------------
@app.post("/verify-face")
def verify_face(data: VerifyFaceRequest):
    img = decode_base64_image(data.image)
    new_embedding = get_face_embedding(img)

    if new_embedding is None:
        raise HTTPException(status_code=400, detail="No face detected")

    stored_embedding = np.array(data.embedding)

    # Cosine similarity
    similarity = np.dot(new_embedding, stored_embedding) / (
        np.linalg.norm(new_embedding) * np.linalg.norm(stored_embedding)
    )

    matched = similarity > 0.5   # threshold

    return {
        "matched": matched,
        "similarity": float(similarity)
    }

@app.get("/")
def root():
    return {"status": "Face API running"}
