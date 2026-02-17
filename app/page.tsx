'use client';

import { useState } from 'react';
import VisionTest from '@/components/VisionTest';
import VideoTest from '@/components/VideoTest';
import ComparisonPanel from '../components/ComparisonPanel';
import { useAppSelector } from '@/redux/hooks';
import pageStyles from '@/styles/components/Page.module.css';
import headerStyles from '@/styles/components/Header.module.css';

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
    <div className={pageStyles.container}>
      <header className={headerStyles.header}>
        <h1 className={headerStyles.title}>Google Cloud AI Vision</h1>
        <p className={headerStyles.subtitle}>Analyze images & videos with Vision & Video Intelligence API</p>
      </header>
      <main className={pageStyles.main}>
        <div className={pageStyles.grid}>
          <VisionTest />
          <VideoTest />
        </div>

        {canCompare && (
          <div className={pageStyles.buttonWrapper}>
            <button
              type="button"
              onClick={handleToggleComparison}
              className={pageStyles.compareButton}
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
