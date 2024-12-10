import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getMicrophonePermission } from "./useMicrophonePermission";

interface NoiseDetectionProps {
  onViolation: (message: string) => void;
}

export const useNoiseDetection = () => {
  const [isNoiseDetected, setIsNoiseDetected] = useState<boolean | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const setupNoiseDetection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true
        });
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        const analyzer = audioContextRef.current.createAnalyser();

        source.connect(analyzer);
        analyzer.fftSize = 256;

        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const checkNoise = () => {
          analyzer.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;

          if (average > 100) {
            // Threshold for noise detection
            setIsNoiseDetected(true);
            toast.error("Please maintain silence");
          } else {
            setIsNoiseDetected(false);
          }
        };

        const interval = setInterval(checkNoise, 1000);
        return () => {
          clearInterval(interval);
          stream.getTracks().forEach((track) => track.stop());
          audioContextRef.current?.close();
        };
      } catch (err) {
        getMicrophonePermission();
        toast.error("Microphone access is required");
      }
    };

    setupNoiseDetection();
  }, []);

  return isNoiseDetected;
};
