from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import base64
import numpy as np
import cv2

app = FastAPI()

class VerifyFaceRequest(BaseModel):
    image: str
    embedding: List[float]

@app.post("/verify-face")
def verify_face(data: VerifyFaceRequest):
    try:
        # remove base64 header
        image_base64 = data.image.split(",")[1]
        image_bytes = base64.b64decode(image_base64)

        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return {"matched": False, "distance": None}

        stored_embedding = np.array(data.embedding, dtype=np.float32)

        # TODO: real face comparison
        distance = 0.38

        return {
            "matched": True,
            "distance": distance
        }

    except Exception as e:
        return {"error": str(e)}
