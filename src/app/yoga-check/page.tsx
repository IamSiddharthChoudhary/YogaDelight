"use client";
import { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";
import { poseImages } from "../utils/pose_images";
import { poseInstructions, POINTS } from "../utils/data";
import { drawPoint, drawSegment } from "../utils/helper";

import * as poseDetection from "@tensorflow-models/pose-detection";

const poseList = [
  "Tree",
  "Chair",
  "Cobra",
  "Warrior",
  "Dog",
  "Shoulderstand",
  "Triangle",
];

const CLASS_NO: Record<string, number> = {
  Chair: 0,
  Cobra: 1,
  Dog: 2,
  No_Pose: 3,
  Shoulderstand: 4,
  Triangle: 5,
  Tree: 6,
  Warrior: 7,
};

let skeletonColor = "rgb(255,255,255)";
let flag = false;

const YogaPage = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [startingTime, setStartingTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [poseTime, setPoseTime] = useState<number>(0);
  const [bestPerform, setBestPerform] = useState<number>(0);
  const [currentPose, setCurrentPose] = useState<string>("Tree");
  const [isStartPose, setIsStartPose] = useState<boolean>(false);
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(
    null
  );
  const [poseClassifier, setPoseClassifier] = useState<tf.LayersModel | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000;
    if (flag) setPoseTime(timeDiff);
    if (timeDiff > bestPerform) setBestPerform(timeDiff);
  }, [currentTime, startingTime, bestPerform]);

  useEffect(() => {
    setCurrentTime(0);
    setPoseTime(0);
    setBestPerform(0);
  }, [currentPose]);

  // Initialize models
  useEffect(() => {
    if (isStartPose && !detector && !poseClassifier) {
      setIsLoading(true);
      const loadModels = async () => {
        try {
          // Load MoveNet
          await tf.ready();
          const detectorConfig = {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
          };
          const moveNetDetector = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            detectorConfig
          );
          setDetector(moveNetDetector);

          // Load pose classifier
          const classifierModel = await tf.loadLayersModel(
            "https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json"
          );
          setPoseClassifier(classifierModel);
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading models:", error);
          setIsLoading(false);
          setIsStartPose(false);
        }
      };

      loadModels();
    }
  }, [isStartPose, detector, poseClassifier]);

  // Detect pose
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStartPose && detector && poseClassifier) {
      interval = setInterval(() => {
        detectPose();
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStartPose, detector, poseClassifier, currentPose]);

  const detectPose = async () => {
    if (
      !webcamRef.current ||
      !webcamRef.current.video ||
      webcamRef.current.video.readyState !== 4 ||
      !detector ||
      !poseClassifier ||
      !canvasRef.current
    )
      return;

    const video = webcamRef.current.video;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Set canvas dimensions
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    try {
      // Detect poses
      const poses = await detector.estimatePoses(video);
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, videoWidth, videoHeight);

      if (poses.length > 0) {
        const keypoints = poses[0].keypoints;
        let notDetected = 0;
        const input: number[][] = keypoints.map((keypoint: any) => {
          if (
            keypoint.score &&
            keypoint.score > 0.4 &&
            keypoint.name &&
            !(keypoint.name === "left_eye" || keypoint.name === "right_eye")
          ) {
            drawPoint(ctx, keypoint.x, keypoint.y, 8, "rgb(255,255,255)");

            // Draw connections
            if (keypoint.name && keypoint.name in keypointConnections) {
              keypointConnections[keypoint.name].forEach(
                (connection: string) => {
                  const connKeypoint = keypoints.find(
                    (kp) => kp.name === connection
                  );
                  if (connKeypoint && connKeypoint.score > 0.4) {
                    drawSegment(
                      ctx,
                      [keypoint.x, keypoint.y],
                      [connKeypoint.x, connKeypoint.y],
                      skeletonColor
                    );
                  }
                }
              );
            }
          } else {
            notDetected++;
          }
          return [keypoint.x, keypoint.y];
        });

        if (notDetected > 4) {
          skeletonColor = "rgb(255,255,255)";
          return;
        }

        // Process input for classification
        const processedInput = landmarksToEmbedding(tf.tensor2d(input));
        const classification = poseClassifier.predict(
          processedInput
        ) as tf.Tensor;

        classification.array().then((data: any) => {
          const classNo = CLASS_NO[currentPose];
          if (data[0][classNo] > 0.97) {
            if (!flag) {
              setStartingTime(Date.now());
              flag = true;
            }
            setCurrentTime(Date.now());
            skeletonColor = "rgb(0,255,0)";
          } else {
            flag = false;
            skeletonColor = "rgb(255,255,255)";
          }
        });
      }
    } catch (error) {
      console.error("Error in pose detection:", error);
    }
  };

  const startYoga = () => {
    setIsStartPose(true);
  };

  const stopPose = () => {
    setIsStartPose(false);
    flag = false;
    skeletonColor = "rgb(255,255,255)";

    // Clean up
    if (detector) {
      detector.dispose();
      setDetector(null);
    }
    if (poseClassifier) {
      poseClassifier.dispose();
      setPoseClassifier(null);
    }
  };

  // Helper functions for pose processing
  const keypointConnections: Record<string, string[]> = {
    nose: ["left_eye", "right_eye"],
    left_eye: ["left_ear"],
    right_eye: ["right_ear"],
    left_ear: ["left_shoulder"],
    right_ear: ["right_shoulder"],
    left_shoulder: ["right_shoulder", "left_elbow", "left_hip"],
    right_shoulder: ["right_elbow", "right_hip"],
    left_elbow: ["left_wrist"],
    right_elbow: ["right_wrist"],
    left_hip: ["right_hip", "left_knee"],
    right_hip: ["right_knee"],
    left_knee: ["left_ankle"],
    right_knee: ["right_ankle"],
  };

  function landmarksToEmbedding(landmarks: tf.Tensor2D): tf.Tensor2D {
    landmarks = normalizePoseLandmarks(
      tf.expandDims(landmarks, 0) as tf.Tensor2D
    );
    return tf.reshape(landmarks, [1, 34]);
  }

  function normalizePoseLandmarks(landmarks: tf.Tensor2D): tf.Tensor2D {
    let poseCenter = getCenterPoint(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    poseCenter = tf.expandDims(poseCenter, 1);
    poseCenter = tf.broadcastTo(poseCenter, [1, 17, 2]);
    landmarks = tf.sub(landmarks, poseCenter);

    const poseSize = getPoseSize(landmarks);
    return tf.div(landmarks, poseSize);
  }

  function getPoseSize(
    landmarks: tf.Tensor2D,
    torsoSizeMultiplier = 2.5
  ): tf.Tensor {
    const hipsCenter = getCenterPoint(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    const shouldersCenter = getCenterPoint(
      landmarks,
      POINTS.LEFT_SHOULDER,
      POINTS.RIGHT_SHOULDER
    );
    const torsoSize = tf.norm(tf.sub(shouldersCenter, hipsCenter));

    let poseCenterNew = getCenterPoint(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    poseCenterNew = tf.expandDims(poseCenterNew, 1);
    poseCenterNew = tf.broadcastTo(poseCenterNew, [1, 17, 2]);

    const d = tf.gather(tf.sub(landmarks, poseCenterNew), 0, 0);
    const maxDist = tf.max(tf.norm(d, "euclidean", 0));

    return tf.maximum(tf.mul(torsoSize, torsoSizeMultiplier), maxDist);
  }

  function getCenterPoint(
    landmarks: tf.Tensor2D,
    leftBodyPart: number,
    rightBodyPart: number
  ): tf.Tensor {
    const left = tf.gather(landmarks, leftBodyPart, 1);
    const right = tf.gather(landmarks, rightBodyPart, 1);
    return tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {isStartPose ? (
        <div className="flex flex-col md:flex-row items-center justify-center p-4 gap-6">
          <div className="flex-1 max-w-xl">
            <div className="bg-gray-800 rounded-xl p-4 mb-4 flex justify-between">
              <h4 className="text-lg font-semibold">
                Pose Time: {poseTime.toFixed(1)} s
              </h4>
              <h4 className="text-lg font-semibold">
                Best: {bestPerform.toFixed(1)} s
              </h4>
            </div>
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-10 rounded-xl">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-indigo-300">Loading models...</p>
                  </div>
                </div>
              )}
              <Webcam
                ref={webcamRef}
                className="w-full rounded-xl"
                videoConstraints={{
                  width: 640,
                  height: 480,
                  facingMode: "user",
                }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
            <button
              onClick={stopPose}
              className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all"
            >
              Stop Pose
            </button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-300 to-purple-100 bg-clip-text text-transparent">
                {currentPose} Pose
              </h3>
              <div className="flex justify-center mb-4">
                <img
                  src={
                    poseImages[currentPose] ||
                    "/placeholder.svg?height=256&width=256"
                  }
                  alt={`${currentPose} pose`}
                  className="h-64 object-contain"
                />
              </div>
              <div className="bg-gray-700 rounded-xl p-4">
                <h3 className="text-xl font-semibold mb-3 text-indigo-200">
                  Instructions
                </h3>
                <ul className="space-y-2">
                  {poseInstructions[currentPose]?.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-500 text-white text-sm mr-3 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-100">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="max-w-2xl w-full bg-gray-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-300 to-purple-100 bg-clip-text text-transparent">
              Choose Your Yoga Pose
            </h2>
            <div className="mb-8">
              <div className="relative w-full">
                <select
                  value={currentPose}
                  onChange={(e) => setCurrentPose(e.target.value)}
                  className="w-full p-4 bg-gray-700 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {poseList.map((pose, index) => (
                    <option key={index} value={pose}>
                      {pose}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <div className="bg-gray-700 rounded-xl p-4">
                <h3 className="text-xl font-semibold mb-3 text-indigo-200">
                  Instructions
                </h3>
                <ul className="space-y-2">
                  {poseInstructions[currentPose]?.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-500 text-white text-sm mr-3 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-100">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={startYoga}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all"
            >
              Start Pose
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YogaPage;
