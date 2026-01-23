const faceapi = require("@vladmandic/face-api");

const canvas = require("canvas");

async function getEmbedding(base64Image) {
  const img = await canvas.loadImage(base64Image);
  const detection = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) return null;

  return Array.from(detection.descriptor); // Float32 → array
}

// Euclidean distance
function compareEmbeddings(e1, e2) {
  let sum = 0;
  for (let i = 0; i < e1.length; i++) {
    sum += Math.pow(e1[i] - e2[i], 2);
  } 
  return Math.sqrt(sum);
}

module.exports = { getEmbedding, compareEmbeddings };
