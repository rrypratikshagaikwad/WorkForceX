// const faceapi = require("@vladmandic/face-api");
// const canvas = require("canvas");
// require("@tensorflow/tfjs-node");

// const { Canvas, Image, ImageData } = canvas;
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// const loadModels = async () => {
//   const modelPath = "./models";

//   await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
//   await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
//   await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);

//   console.log("✅ Face models loaded (tfjs)");
// };

// module.exports = loadModels;

const faceapi = require("@vladmandic/face-api");
const canvas = require("canvas");

// ✅ Native Node backend
const tf = require("@tensorflow/tfjs-node");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const loadModels = async () => {
  await tf.ready();

  const modelPath = "./models";

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);

  console.log("✅ Face models loaded (tfjs-node)");
};

module.exports = loadModels;


