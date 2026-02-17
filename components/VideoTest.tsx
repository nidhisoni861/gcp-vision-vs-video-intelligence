"use client";

import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { analyzeVideo } from "@/redux/store/slices/videoSlice";
import { FileUpload, DetectionResults } from "@/components/shared";
import cardStyles from "@/styles/components/Card.module.css";
import buttonStyles from "@/styles/components/Button.module.css";
import previewStyles from "@/styles/components/Preview.module.css";

function VideoTest() {
  const dispatch = useAppDispatch();
  const { results, isLoading, error } = useAppSelector((state) => state.video);
  const [file, setFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleAnalyze = () => {
    if (file) {
      dispatch(analyzeVideo(file));
    }
  };

  // Ensure video plays when file changes or during analysis
  useEffect(() => {
    if (videoRef.current && file) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
        } catch (error) {
          // Autoplay may be blocked by browser, but video will still be ready
          console.log("Autoplay prevented:", error);
        }
      };
      playVideo();
    }
  }, [file]);

  // Keep video playing during analysis
  useEffect(() => {
    if (videoRef.current && isLoading) {
      const playVideo = async () => {
        try {
          if (videoRef.current?.paused) {
            await videoRef.current.play();
          }
        } catch (error) {
          console.log("Play prevented:", error);
        }
      };
      playVideo();
    }
  }, [isLoading]);

  return (
    <div className={cardStyles.card}>
      <h1 className={cardStyles.title}>Google Video Intelligence API Test</h1>

      <FileUpload
        accept="video/*"
        onChange={setFile}
        selectedFile={file}
        label="Choose video"
      />

      <button
        onClick={handleAnalyze}
        disabled={!file || isLoading}
        className={buttonStyles.primary}
      >
        {isLoading ? "Analyzing..." : "Analyze Video"}
      </button>

      {file && (
        <div className={previewStyles.wrapper}>
          <h3 className={previewStyles.title}>Preview:</h3>
          <div className={previewStyles.mediaWrapper}>
            <video
              ref={videoRef}
              src={URL.createObjectURL(file)}
              controls
              autoPlay
              loop
              muted
              playsInline
              className={previewStyles.video}
            />
          </div>
        </div>
      )}

      <DetectionResults results={results} error={error} />
    </div>
  );
}

export default VideoTest;
