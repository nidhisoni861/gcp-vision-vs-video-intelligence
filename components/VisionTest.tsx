"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { analyzeImage } from "@/redux/store/slices/visionSlice";
import { FileUpload, DetectionResults } from "@/components/shared";

function VisionTest() {
  const dispatch = useAppDispatch();
  const { results, isLoading, error } = useAppSelector((state) => state.vision);
  const [file, setFile] = useState<File | null>(null);

  const handleAnalyze = () => {
    if (file) {
      dispatch(analyzeImage(file));
    }
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Google Vision API Test
      </h1>

      <FileUpload
        accept="image/*"
        onChange={setFile}
        selectedFile={file}
        label="Choose image"
      />

      <button
        onClick={handleAnalyze}
        disabled={!file || isLoading}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          !file || isLoading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Analyzing..." : "Analyze Image"}
      </button>

      {file && (
        <div className="mt-4">
          <h3 className="font-medium text-gray-900 dark:text-white">Preview:</h3>
          <div className="mt-2 w-full max-w-xs">
            <Image
              src={URL.createObjectURL(file)}
              alt="Preview"
              width={300}
              height={200}
              className="rounded-md"
            />
          </div>
        </div>
      )}

      <DetectionResults results={results} error={error} />
    </div>
  );
}

export default VisionTest;
