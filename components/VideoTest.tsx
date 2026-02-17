"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { analyzeVideo } from "@/redux/store/slices/videoSlice";
import { FileUpload, DetectionResults } from "@/components/shared";

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
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Google Video Intelligence API Test
      </h1>

      <FileUpload
        accept="video/*"
        onChange={setFile}
        selectedFile={file}
        label="Choose video"
      />

      <button
        onClick={handleAnalyze}
        disabled={!file || isLoading}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          !file || isLoading
            ? "bg-green-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isLoading ? "Analyzing..." : "Analyze Video"}
      </button>

      {file && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-900 dark:text-white">Preview:</h3>
          <div className="mt-2 w-full max-w-xs">
            <video
              src={URL.createObjectURL(file)}
              controls
              className="rounded-md w-full"
            />
          </div>
        </div>
      )}

      <DetectionResults results={results} error={error} />
    </div>
  );
}

export default VideoTest;
