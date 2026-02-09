const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_REGION
});

const rekognition = new AWS.Rekognition();

/* ---------- COMMON IMAGE PARSER ---------- */
function getImageBuffer(base64Image) {
  if (!base64Image || typeof base64Image !== "string") {
    console.error("❌ Invalid faceImage:", base64Image);
    throw new Error("Invalid face image");
  }

  if (!base64Image.startsWith("data:image")) {
    throw new Error("Face image must be base64 data URL");
  }

  return Buffer.from(
    base64Image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
}

/* ---------- REGISTER FACE ---------- */
async function registerFace(base64Image, externalId) {
  const buffer = getImageBuffer(base64Image);

  const res = await rekognition.indexFaces({
    CollectionId: "attendance_faces",
    Image: { Bytes: buffer },
    ExternalImageId: externalId,
    DetectionAttributes: []
  }).promise();

  if (!res.FaceRecords || res.FaceRecords.length === 0) {
    return null;
  }

  return res.FaceRecords[0].Face.FaceId;
}

/* ---------- VERIFY FACE ---------- */
async function verifyFace(base64Image) {
  const buffer = getImageBuffer(base64Image);

  const res = await rekognition.searchFacesByImage({
    CollectionId: "attendance_faces",
    Image: { Bytes: buffer },
    FaceMatchThreshold: 90,
    MaxFaces: 1
  }).promise();

  if (!res.FaceMatches || res.FaceMatches.length === 0) {
    return null;
  }

  return {
    faceId: res.FaceMatches[0].Face.FaceId,
    confidence: res.FaceMatches[0].Similarity
  };
}

module.exports = { registerFace, verifyFace };