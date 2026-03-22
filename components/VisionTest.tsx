"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { analyzeImage } from "@/redux/store/slices/visionSlice";
import { FileUpload, DetectionResults } from "@/components/shared";
import cardStyles from "@/styles/components/Card.module.css";
import buttonStyles from "@/styles/components/Button.module.css";
import previewStyles from "@/styles/components/Preview.module.css";

function VisionTest() {
  const dispatch = useAppDispatch();
  const { results, isLoading, error } = useAppSelector((state:any) => state.vision);
  const [file, setFile] = useState<File | null>(null);

  const handleAnalyze = () => {
    if (file) {
      dispatch(analyzeImage(file));
    }
  };

  return (
    <div className={cardStyles.card}>
      <h1 className={cardStyles.title}>Google Vision API Test</h1>

      <FileUpload
        accept="image/*"
        onChange={setFile}
        selectedFile={file}
        label="Choose image"
      />

      <button
        onClick={handleAnalyze}
        disabled={!file || isLoading}
        className={buttonStyles.primary}
      >
        {isLoading ? "Analyzing..." : "Analyze Image"}
      </button>

      {file && (
        <div className={previewStyles.wrapper}>
          <h3 className={previewStyles.title}>Preview:</h3>
          <div className={previewStyles.mediaWrapper}>
            <Image
              src={URL.createObjectURL(file)}
              alt="Preview"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 42rem"
              className={previewStyles.image}
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}

      <DetectionResults results={results} error={error} />
    </div>
  );
}

export default VisionTest;
