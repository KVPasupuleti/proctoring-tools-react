import React, { useEffect, useRef, useState } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import * as tf from "@tensorflow/tfjs";
import toast from "react-hot-toast";

interface FaceDetectionProps {
  onViolation: (message: string) => void;
  onLoadingComplete: () => void;
}

export const useFaceDetection = ({
  onViolation,
  onLoadingComplete
}: FaceDetectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await blazeface.load();
        setModel(loadedModel);
        onLoadingComplete();
      } catch (err) {
        setError("Failed to load face detection model");
        toast.error("Failed to initialize face detection");
      }
    };
    loadModel();
  }, [onLoadingComplete]);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Failed to access camera");
        toast.error("Camera access is required for proctoring");
      }
    };

    setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!model || !videoRef.current || error) return;

    const detectFaces = async () => {
      try {
        const predictions = await model.estimateFaces(videoRef.current!, false);

        if (predictions.length === 0) {
          onViolation("No face detected");
          toast.error("Please stay in front of the camera");
        } else if (predictions.length > 1) {
          onViolation("Multiple faces detected");
          toast.error("Multiple faces detected in frame");
        }
      } catch (err) {
        console.error("Face detection error:", err);
      }
    };

    const interval = setInterval(detectFaces, 1000);
    return () => clearInterval(interval);
  }, [model, onViolation, error]);

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg mb-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return <video ref={videoRef} autoPlay playsInline muted className="hidden" />;
};
