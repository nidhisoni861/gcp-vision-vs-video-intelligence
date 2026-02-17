"use client";

import { useState } from "react";
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

  const handleAnalyze = () => {
    if (file) {
      dispatch(analyzeVideo(file));
    }
  };

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
              src={URL.createObjectURL(file)}
              controls
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
