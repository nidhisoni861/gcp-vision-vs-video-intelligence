"use client";

import { useState } from 'react';
import Image from "next/image";

// This is a client component that will handle the file upload
function VisionTest() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setResult('Analyzing image...');
    
    try {
      // Create form data to send to our API route
      const formData = new FormData();
      formData.append('image', file);
      
      // Call our API route
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.error) {
        setResult(`Error: ${data.error}`);
      } else {
        // Format the results
        const labels = data.labels.map((label: any) => 
          `${label.description} (${Math.round(label.score * 100)}%)`
        ).join(', ');
        
        setResult(`Detected: ${labels}`);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setResult('Error analyzing image. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Google Vision API Test
      </h1>
      
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
      </div>
      
      <button
        onClick={analyzeImage}
        disabled={!file || isLoading}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          !file || isLoading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Image'}
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
      
      {result && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Results:</h3>
          <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-200">{result}</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto">
        <VisionTest />
      </main>
    </div>
  );
}
