require("dotenv").config();
const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_REGION
});

const rekognition = new AWS.Rekognition();

const COLLECTION_ID = "attendance_faces";

rekognition.createCollection(
  { CollectionId: COLLECTION_ID },
  (err, data) => {
    if (err) {
      console.error("❌ Error:", err.code);
    } else {
      console.log("✅ Collection created:", data);
    }
  }
);