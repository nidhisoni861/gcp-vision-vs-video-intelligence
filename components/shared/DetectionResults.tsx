"use client";

import { useState } from "react";
import { DetectionSection } from "./DetectionSection";
import type { DetectionResults as DetectionResultsType } from "@/redux/types";
import detectionResultsStyles from "@/styles/components/DetectionResults.module.css";

interface DetectionResultsProps {
  results: DetectionResultsType | null;
  error: string | null;
}

const SECTIONS = [
  { key: "labels" as const, icon: "🏷️", title: "Labels" },
  { key: "objects" as const, icon: "🎯", title: "Objects" },
  { key: "text" as const, icon: "📝", title: "Text" },
  { key: "logos" as const, icon: "🎭", title: "Logos" },
  { key: "sentiment" as const, icon: "💬", title: "Sentiment / Experience" },
] as const;

export function DetectionResults({ results, error }: DetectionResultsProps) {
  console.log(results , "results")
  const [expandedSections, setExpandedSections] = useState({
    labels: false,
    objects: false,
    text: false,
    logos: false,
    sentiment: false,
  });

  if (!results && !error) return null;

  return (
    <div className={detectionResultsStyles.wrapper}>
      <div className={detectionResultsStyles.resultsHeader}>
        <h3 className={detectionResultsStyles.title}>Results</h3>
      </div>
      {error && (
        <p className={detectionResultsStyles.error}>{error}</p>
      )}
      {results && (
        <div className={detectionResultsStyles.cardsGrid}>
          {SECTIONS.map(({ key, icon, title }) => (
            <DetectionSection
              key={key}
              icon={icon}
              title={title}
              items={results[key]}
              isExpanded={expandedSections[key]}
              onToggle={() =>
                setExpandedSections((prev) => ({
                  ...prev,
                  [key]: !prev[key],
                }))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
