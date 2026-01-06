const axios = require("axios");

async function verifyFace(faceImage, storedEmbedding) {
  const response = await axios.post(
    "http://localhost:8000/verify-face",
    {
      image: faceImage,
      embedding: storedEmbedding,
    },
    {
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 15000,
    }
  );

  return response.data;
}

module.exports = { verifyFace };
