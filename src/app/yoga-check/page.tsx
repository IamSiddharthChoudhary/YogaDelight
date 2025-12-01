"use client";
import { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";
import { poseInstructions, POINTS } from "../utils/data";
import { drawPoint, drawSegment } from "../utils/helper";
import * as poseDetection from "@tensorflow-models/pose-detection";
import Navbar from "@/src/components/navbar";

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

let skeletonColor = "rgb(255,0,0)";
let flag = false;

const correctSound =
  typeof window !== "undefined" ? new Audio("/sounds/correct.mp3") : null;

const YogaPage = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [currentPose, setCurrentPose] = useState("Tree");
  const [isStartPose, setIsStartPose] = useState(false);
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(
    null
  );
  const [poseClassifier, setPoseClassifier] = useState<tf.LayersModel | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const diff = (currentTime - startingTime) / 1000;
    if (flag) setPoseTime(diff);
    if (diff > bestPerform) setBestPerform(diff);
  }, [currentTime, startingTime, bestPerform]);

  useEffect(() => {
    setCurrentTime(0);
    setPoseTime(0);
    setBestPerform(0);
  }, [currentPose]);

  useEffect(() => {
    if (isStartPose && !detector && !poseClassifier) {
      setIsLoading(true);
      const load = async () => {
        try {
          await tf.ready();
          const d = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER }
          );
          setDetector(d);
          const classifier = await tf.loadLayersModel(
            "https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json"
          );
          setPoseClassifier(classifier);
          setIsLoading(false);
        } catch {
          setIsStartPose(false);
          setIsLoading(false);
        }
      };
      load();
    }
  }, [isStartPose, detector, poseClassifier]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStartPose && detector && poseClassifier) {
      interval = setInterval(() => detectPose(), 100);
    }
    return () => interval && clearInterval(interval);
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
    const ctx = canvasRef.current.getContext("2d");
    const w = video.videoWidth;
    const h = video.videoHeight;

    canvasRef.current.width = w;
    canvasRef.current.height = h;

    const poses = await detector.estimatePoses(video);
    if (!poses.length || !ctx) return;

    ctx.clearRect(0, 0, w, h);

    const keypoints = poses[0].keypoints;
    let notDetected = 0;

    const input = keypoints.map((kp: any) => {
      if (kp.score > 0.4 && kp.name !== "left_eye" && kp.name !== "right_eye") {
        drawPoint(ctx, kp.x, kp.y, 8, skeletonColor);
        if (kp.name in keypointConnections) {
          keypointConnections[kp.name].forEach((conn: string) => {
            const target = keypoints.find((k) => k.name === conn);
            if (target && target.score > 0.4) {
              drawSegment(
                ctx,
                [kp.x, kp.y],
                [target.x, target.y],
                skeletonColor
              );
            }
          });
        }
      } else {
        notDetected++;
      }
      return [kp.x, kp.y];
    });

    if (notDetected > 4) {
      skeletonColor = "rgb(255,0,0)";
      return;
    }

    const processed = landmarksToEmbedding(tf.tensor2d(input));
    const prediction = poseClassifier.predict(processed) as tf.Tensor;

    prediction.array().then((data: any) => {
      const classNo = CLASS_NO[currentPose];
      if (data[0][classNo] > 0.97) {
        if (!flag) {
          setStartingTime(Date.now());
          correctSound?.play().catch(() => {});
          flag = true;
        }
        setCurrentTime(Date.now());
        skeletonColor = "rgb(0,255,0)";
      } else {
        flag = false;
        skeletonColor = "rgb(255,0,0)";
      }
    });
  };

  const startYoga = () => setIsStartPose(true);

  const stopPose = () => {
    setIsStartPose(false);
    flag = false;
    skeletonColor = "rgb(255,0,0)";
    detector?.dispose();
    poseClassifier?.dispose();
    setDetector(null);
    setPoseClassifier(null);
  };

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
    let center = getCenterPoint(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    center = tf.broadcastTo(tf.expandDims(center, 1), [1, 17, 2]);
    landmarks = tf.sub(landmarks, center);
    const size = getPoseSize(landmarks);
    return tf.div(landmarks, size);
  }

  function getPoseSize(
    landmarks: tf.Tensor2D,
    torsoSizeMultiplier = 2.5
  ): tf.Tensor {
    const hips = getCenterPoint(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    const shoulders = getCenterPoint(
      landmarks,
      POINTS.LEFT_SHOULDER,
      POINTS.RIGHT_SHOULDER
    );
    const torso = tf.norm(tf.sub(shoulders, hips));
    let center = getCenterPoint(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    center = tf.broadcastTo(tf.expandDims(center, 1), [1, 17, 2]);
    const d = tf.gather(tf.sub(landmarks, center), 0, 0);
    const maxDist = tf.max(tf.norm(d, "euclidean", 0));
    return tf.maximum(tf.mul(torso, torsoSizeMultiplier), maxDist);
  }

  function getCenterPoint(
    landmarks: tf.Tensor2D,
    left: number,
    right: number
  ): tf.Tensor {
    const l = tf.gather(landmarks, left, 1);
    const r = tf.gather(landmarks, right, 1);
    return tf.add(tf.mul(l, 0.5), tf.mul(r, 0.5));
  }

  return (
    <div
      className="h-full bg-gray-950 text-white overflow-hidden transition-all duration-500"
      style={{
        boxShadow:
          skeletonColor === "rgb(0,255,0)" ? "0 0 40px #14ff00 inset" : "none",
      }}
    >
      <div className="h-[10vh] mb-5">
        <Navbar />
      </div>
      {isStartPose ? (
        <div className="flex flex-col md:flex-row items-center justify-center h-full p-4 gap-10 max-w-7xl mx-auto">
          <div className="w-full md:w-[50%] flex flex-col">
            <div className="bg-gray-800 rounded-xl p-4 mb-4 flex justify-between">
              <h4 className="text-lg font-semibold">{poseTime.toFixed(1)} s</h4>
              <h4 className="text-lg font-semibold">
                {bestPerform.toFixed(1)} s
              </h4>
            </div>

            <div
              className="relative flex-1 rounded-2xl transition-all duration-300"
              style={{
                boxShadow:
                  skeletonColor === "rgb(0,255,0)"
                    ? "0 0 25px #14ff00"
                    : "none",
              }}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-10">
                  <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              <Webcam
                ref={webcamRef}
                className="w-full h-full object-cover rounded-2xl"
                videoConstraints={{ facingMode: "user" }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>

            <button
              onClick={stopPose}
              className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold"
            >
              Stop Pose
            </button>
          </div>

          <div className="w-full md:w-[40%] h-full overflow-hidden">
            <div className="bg-gray-800 rounded-xl p-6 h-full flex flex-col overflow-hidden">
              <h3 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-300 to-purple-100 bg-clip-text text-transparent">
                {currentPose} Pose
              </h3>

              <div className="flex justify-center bg-gray-900 p-4 rounded-xl mb-4">
                <img
                  src={`/pose_images/${currentPose.toLowerCase()}.jpg`}
                  alt={currentPose}
                  className="h-56 object-contain"
                />
              </div>

              <div className="bg-gray-700 rounded-xl p-4 overflow-y-auto flex-1">
                <h3 className="text-xl font-semibold mb-3 text-indigo-200">
                  Instructions
                </h3>
                <ul className="space-y-2">
                  {poseInstructions[currentPose]?.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-indigo-200 font-semibold mr-3">
                        {index + 1}.
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="max-w-2xl w-full bg-gray-800 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-300 to-purple-100 bg-clip-text text-transparent">
              Choose Your Pose
            </h2>

            <div className="mb-8">
              <select
                value={currentPose}
                onChange={(e) => setCurrentPose(e.target.value)}
                className="w-full p-4 bg-gray-700 rounded-xl text-white border border-gray-600 hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              >
                {poseList.map((pose) => (
                  <option key={pose} value={pose}>
                    {pose}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8 bg-gray-700 rounded-xl p-4 max-h-64 overflow-y-auto">
              <h3 className="text-xl font-semibold mb-3 text-indigo-200">
                Instructions
              </h3>
              <ul className="space-y-2">
                {poseInstructions[currentPose]?.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-indigo-200 font-semibold mr-3">
                      {index + 1}.
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={startYoga}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold"
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
