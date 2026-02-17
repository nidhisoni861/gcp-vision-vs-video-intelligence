'use client';

import { useState } from 'react';
import VisionTest from '@/components/VisionTest';
import VideoTest from '@/components/VideoTest';
import ComparisonPanel from '../components/ComparisonPanel';
import { useAppSelector } from '@/redux/hooks';

export default function Home() {
  const { results: visionResults } = useAppSelector((state) => state.vision);
  const { results: videoResults } = useAppSelector((state) => state.video);
  const [showComparison, setShowComparison] = useState(false);

  const canCompare = !!visionResults && !!videoResults;

  const handleToggleComparison = () => {
    if (!canCompare) return;
    setShowComparison((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <VisionTest />
          <VideoTest />
        </div>

        {canCompare && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleToggleComparison}
              className="px-6 py-3 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md transition-colors"
            >
              {showComparison
                ? 'Hide comparison'
                : 'Compare Vision API vs Video Intelligence API'}
            </button>
          </div>
        )}

        {canCompare && showComparison && visionResults && videoResults && (
          <ComparisonPanel
            imageResults={visionResults}
            videoResults={videoResults}
          />
        )}
      </main>
    </div>
  );
}
